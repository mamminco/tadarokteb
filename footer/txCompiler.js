import fs from 'fs';
import path from 'path';

let previousUsedClasses = {
    tx: new Set(),
    txs: new Set()
};

const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
};

export default function txPlugin(fileExtensions) {
    let initialRun = true; // Flag to track the first run

    return {
        name: 'tx-plugin',

        buildStart() {
            // Run initial compilation on server start
            if (initialRun) {
                console.log("Initial app.css compilation on server start...");
                compileAppCss(fileExtensions, null, previousUsedClasses); // Pass null for changedFile on initial run
                initialRun = false;
            }
        },

        handleHotUpdate(ctx) {
            const changedFile = ctx.file;
            if (fileExtensions.includes(path.extname(changedFile).slice(1))) {
                console.log(`Hot reload detected for file: ${changedFile}`);
                // Always re-extract root variables on hot reload, then apply them.
                compileAppCss(fileExtensions, null, previousUsedClasses);
            } else {
                console.log(`File changed, but not a relevant extension, skipping app.css update: ${changedFile}`);
            }
        },
    };
}

async function compileAppCss(fileExtensions, changedFile = null, previousClassesState) {
    let baseCssPath = './base.css';
    let appCssPath = './src/routes/app.css';
    let spacingUnit = 'var(--tx)';

    try {
        let baseCssContent = fs.readFileSync(baseCssPath, 'utf-8');
        let baseCssRules = parseBaseCss(baseCssContent);
        let rootVariables = mergeRootVariables(baseCssContent); // Extract and merge :root variables

        let currentUsedTxClasses = new Set();
        let currentUsedTxsClasses = new Set();

        let filesToProcess = [];

        if (changedFile) {
            filesToProcess = [changedFile]; // Only process the changed file
            console.log(`Processing only changed file: ${changedFile}`);
        } else {
            filesToProcess = findFilesInDirectory('.', fileExtensions); // Process all files on initial run
            console.log(`Processing all files for initial app.css generation.`);
        }

        // Extract classes from base.css
        let baseCssClasses = extractClassesFromCss(baseCssContent);


        for (let file of filesToProcess) {
            let fileContent = fs.readFileSync(file, 'utf-8');
            let classes = extractClassesFromFileContent(fileContent);

            for (let classNameWithPrefix of classes) {
                if (classNameWithPrefix.startsWith('txs-') || classNameWithPrefix.startsWith('sm:txs-') || classNameWithPrefix.startsWith('md:txs-') || classNameWithPrefix.startsWith('lg:txs-') || classNameWithPrefix.startsWith('!txs-')  || classNameWithPrefix.startsWith('!sm:txs-') || classNameWithPrefix.startsWith('!md:txs-') || classNameWithPrefix.startsWith('!lg:txs-')) {
                    currentUsedTxsClasses.add(classNameWithPrefix);
                } else {
                    let className = classNameWithPrefix;
                    let prefix = '';
                    let isImportant = false;

                    if (classNameWithPrefix.startsWith('!')) {
                        isImportant = true;
                        className = classNameWithPrefix.substring(1);
                    }

                    if (className.startsWith('sm:')) {
                        prefix = 'sm';
                        className = className.substring(3);
                    } else if (className.startsWith('md:')) {
                        prefix = 'md';
                        className = className.substring(3);
                    } else if (className.startsWith('lg:')) {
                        prefix = 'lg';
                        className = className.substring(3);
                    }

                    if (baseCssClasses.has(className)) {
                        currentUsedTxClasses.add(classNameWithPrefix);
                    }
                }
            }
        }

        let appCssContent = '';

        // Always include root variables, but only read them from base.css.
        appCssContent += rootVariables + '\n\n'; // Add merged root variables at the beginning with a newline


        // Add used tx- classes from base.css
        let txRules = generateTxClassRules(currentUsedTxClasses, baseCssRules);
        appCssContent += txRules + `\n@media (max-width: 767px) {
    :root {
        --tx-canvas-size: 420;
    }
}\n`;


        // Generate txs- classes
        let txsClassRules = generateTxsClassRules(currentUsedTxsClasses, spacingUnit);
        appCssContent += txsClassRules;

        // Check if classes have changed since last compilation
        const txClassesChanged = !setsAreEqual(currentUsedTxClasses, previousClassesState.tx);
        const txsClassesChanged = !setsAreEqual(currentUsedTxsClasses, previousClassesState.txs);

        if (!changedFile || txClassesChanged || txsClassesChanged) {
            fs.writeFileSync(appCssPath, appCssContent.trim() || '/* app.css is empty because no tx- or txs- classes were detected */');
            console.log(`Successfully compiled app.css${changedFile ? ' due to hot reload.' : ' on initial run.'}`);

            // Update previous classes state for the next hot reload
            previousClassesState.tx = new Set(currentUsedTxClasses); // Create new Sets to avoid reference issues
            previousClassesState.txs = new Set(currentUsedTxsClasses);
        } else {
            console.log('No changes in relevant classes detected, app.css not updated.');
        }


    } catch (error) {
        console.error('Error compiling app.css:', error);
    }
}

function generateTxClassRules(currentUsedTxClasses, baseCssRules) {
    let rules = '';
    currentUsedTxClasses.forEach(classNameWithPrefix => {
        let prefix = '';
        let className = classNameWithPrefix;
        let isImportant = false;
        let importantPrefix = '';

        if (classNameWithPrefix.startsWith('!')) {
            isImportant = true;
            importantPrefix = '!';
            classNameWithPrefix = classNameWithPrefix.substring(1); // Remove ! for prefix and class name extraction
            className = classNameWithPrefix.substring(classNameWithPrefix.indexOf('-') + 1) || classNameWithPrefix.substring(classNameWithPrefix.indexOf(':') + 1); // Extract class name after prefix if exists, or just the classname if no prefix
        }


        if (classNameWithPrefix.startsWith('sm:')) {
            prefix = 'sm';
            className = classNameWithPrefix.substring(3);
        } else if (classNameWithPrefix.startsWith('md:')) {
            prefix = 'md';
            className = classNameWithPrefix.substring(3);
        } else if (classNameWithPrefix.startsWith('lg:')) {
            prefix = 'lg';
            className = classNameWithPrefix.substring(3);
        }


        if (baseCssRules.has(className)) {
            let baseRule = baseCssRules.get(className).split('{')[1].trim();
            let ruleContent = '';
            baseRule.split(';').filter(r => r.trim() !== '').forEach(r => {
                ruleContent += r.trim() + (isImportant ? ' !important;\n' : ';\n');
            });

            let escapedClassName = classNameWithPrefix.replace(/:/g, '\\:').replace(/!/g, '\\!');
            if (isImportant) {
                escapedClassName = '\\!' + escapedClassName;
            }
            const selector = `.${escapedClassName}`;


            if (prefix) {
                rules += `@media (min-width: ${breakpoints[prefix]}) {\n  ${selector} {\n${ruleContent.trim().slice(0, -1)}\n  }\n}\n`.slice(0, -2);
            } else {
                rules += `${selector} {\n${ruleContent.trim()}\n}\n`.slice(0, -4);
            }
        }
    });
    return rules;
}


// Helper function to extract and merge all :root variables from CSS content
function mergeRootVariables(cssContent) {
    const rootRegex = /:root\s*\{([^}]+)\}/g;
    let mergedVariables = '';
    let match;

    while ((match = rootRegex.exec(cssContent)) !== null) {
        mergedVariables += match[1].trim() + '\n'; // Append each :root block's content
    }

    if (mergedVariables) {
        return `:root {\n${mergedVariables.trim()}\n}`; // Wrap all merged variables in a single :root block
    }
    return ''; // Return empty string if no :root block is found
}


// Helper function to compare sets
function setsAreEqual(set1, set2) {
    if (set1.size !== set2.size) return false;
    for (let item of set1) {
        if (!set2.has(item)) return false;
    }
    return true;
}


function parseBaseCss(cssContent) {
    let rulesMap = new Map();
    let regex = /(?:\.([\w-]+)\s*\{([^}]+)\})/g; // Matches class names and their rules

    let match;
    while ((match = regex.exec(cssContent)) !== null) {
        let className = match[1];
        let cssRules = match[2].trim();
        rulesMap.set(className, `.${className} {\n${cssRules}\n}`); // Original line
    }
    return rulesMap;
}

function findFilesInDirectory(dir, extensions, fileList = []) {
    let files = fs.readdirSync(dir);
    for (let file of files) {
        let filePath = path.join(dir, file);
        let fileStat = fs.statSync(filePath);
        if (fileStat.isDirectory()) {
            findFilesInDirectory(filePath, extensions, fileList);
        } else if (extensions.includes(path.extname(file).slice(1))) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

function extractClassesFromFileContent(fileContent) {
    let classNames = new Set();
    let regex = /class=["']([^"']*)["']/g;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        let classesString = match[1];
        classesString.split(/\s+/).forEach(cls => {
            if (cls) {
                classNames.add(cls);
            }
        });
    }
    return classNames;
}

function extractClassesFromCss(cssContent) {
    const classNames = new Set();
    const regex = /\.([\w-]+)/g; // Matches class names in CSS
    let match;

    while ((match = regex.exec(cssContent)) !== null) {
        classNames.add(match[1]);
    }

    return classNames;
}



function generateTxsClassRules(txsClasses, spacingUnit) {
    let rules = '';
    // Regex is now VERY focused - ONLY spacing, sizes, opacity, z-index, order, transform numerical values
    let valueRegex = /^txs-(mr|mx|my|ml|fs|mt|mb|p|rounded|pt|top|bottom|left|right|pb|pl|pr|px|py|gap|w|h|min-w|max-w|min-h|max-h|op|border|bw|z|order|flex-basis|scale|translate-x|translate-y|rotate|skew-x|skew-y)-(\d+)$/;

    txsClasses.forEach(classNameWithPrefix => {
        let prefix = '';
        let className = classNameWithPrefix;
        let isImportant = false;
        let importantPrefix = '';


        if (classNameWithPrefix.startsWith('!')) {
            isImportant = true;
            importantPrefix = '!';
            classNameWithPrefix = classNameWithPrefix.substring(1);
            className = classNameWithPrefix.substring(classNameWithPrefix.indexOf('-') + 1) || classNameWithPrefix.substring(classNameWithPrefix.indexOf(':') + 1); // Extract class name after prefix if exists, or just the classname if no prefix
        }


        if (classNameWithPrefix.startsWith('sm:')) {
            prefix = 'sm';
            className = classNameWithPrefix.substring(3);
        } else if (classNameWithPrefix.startsWith('md:')) {
            prefix = 'md';
            className = classNameWithPrefix.substring(3);
        } else if (classNameWithPrefix.startsWith('lg:')) {
            prefix = 'lg';
            className = classNameWithPrefix.substring(3);
        }


        let match = className.match(valueRegex);
        if (match) {
            let baseRule = generateSingleTxsRule(match, spacingUnit, classNameWithPrefix, isImportant); // Pass isImportant flag
            if (prefix) {
                rules += `@media (min-width: ${breakpoints[prefix]}) {\n  ${baseRule}\n}\n`;
            } else {
                rules += baseRule;
            }
        }
    });
    return rules;
}

function generateSingleTxsRule(match, spacingUnit, classNameWithPrefix, isImportant) { // Receive isImportant flag
    let ruleContent = '';
    let prefix = match[1]; // Prefix is ONLY spacing, sizes, opacity, z-index, order, transform
    let value = match[2]; // Value is GUARANTEED to be a number string (\d+)
    let cssValue = `calc(${spacingUnit} * ${parseInt(value, 10)})`; // ALWAYS treat as numerical spacing value
    let cssProperty = '';
    let unit = ''; // Initialize unit as an empty string
    let escapedClassName = classNameWithPrefix.replace(/:/g, '\\:').replace(/!/g, '\\!');
    if (isImportant) {
        escapedClassName = '\\!' + escapedClassName;
    }
    const selector = `.${escapedClassName}`;
    const importantSuffix = isImportant ? ' !important' : '';


    switch (prefix) { // Switch is now also VERY focused - ONLY numerical properties
        case 'mr': cssProperty = 'margin-right'; break;
        case 'ml': cssProperty = 'margin-left'; break;
        case 'mt': cssProperty = 'margin-top'; break;
        case 'mb': cssProperty = 'margin-bottom'; break;
        case 'mx': cssProperty = 'margin'; break;
        case 'my': cssProperty = 'margin'; break;
        case 'top': cssProperty = 'top'; break;
        case 'bottom': cssProperty = 'bottom'; break;
        case 'left': cssProperty = 'left'; break;
        case 'right': cssProperty = 'right'; break;
        case 'p': cssProperty = 'padding'; break;
        case 'pt': cssProperty = 'padding-top'; break;
        case 'pb': cssProperty = 'padding-bottom'; break;
        case 'pl': cssProperty = 'padding-left'; break;
        case 'pr': cssProperty = 'padding-right'; break;
        case 'px': cssProperty = 'padding'; break;
        case 'py': cssProperty = 'padding'; break;
        case 'gap': cssProperty = 'gap'; break;
        case 'w': cssProperty = 'width'; break;
        case 'fs': cssProperty = 'font-size'; break;
        case 'rounded': cssProperty = 'border-radius'; break;
        case 'h': cssProperty = 'height'; break;
        case 'min-w': cssProperty = 'min-width'; break;
        case 'max-w': cssProperty = 'max-width'; break;
        case 'min-h': cssProperty = 'min-height'; break;
        case 'max-h': cssProperty = 'max-height'; break;
        case 'border': cssProperty = 'border-width'; unit = 'px'; break; // px for border widths
        case 'bw': cssProperty = 'border-width'; unit = 'px'; break; // px for border widths
        case 'flex-basis': cssProperty = 'flex-basis'; break;
        case 'scale': cssProperty = 'scale';  cssValue = value; break; // scale value is unitless multiplier
        case 'translate-x': cssProperty = 'transform'; cssValue = `translateX(${cssValue})`; break;
        case 'translate-y': cssProperty = 'transform'; cssValue = `translateY(${cssValue})`; break;
        case 'rotate': cssProperty = 'transform'; unit = 'deg'; cssValue = value; break; // Degrees for rotate
        case 'skew-x': cssProperty = 'transform'; cssValue = `skewX(${value}deg)`; unit = ''; break;
        case 'skew-y': cssProperty = 'transform'; cssValue = `skewY(${value}deg)`; unit = ''; break;
        case 'op': cssProperty = 'opacity'; cssValue = (parseInt(value, 10) / 100).toFixed(2);  break; // Opacity normalized
        case 'z': cssProperty = 'z-index';  cssValue = value; break; // Unitless integer
        case 'order': cssProperty = 'order';  cssValue = value; break; // Unitless integer
        default: return ''; // Should not reach here with the focused regex
    }
    if (['translate-x', 'translate-y', 'skew-x', 'skew-y'].includes(prefix)) {
        ruleContent = `  ${cssProperty}: ${cssValue}${importantSuffix};\n`; // Use escapedClassName and importantSuffix
    } else if (['px', 'mx'].includes(prefix)) {
        ruleContent = `  ${cssProperty}-left: ${cssValue}${unit}${importantSuffix};\n${cssProperty}-right: ${cssValue}${unit}${importantSuffix};\n`; // Use escapedClassName and importantSuffix
    }
    else if (['py', 'my'].includes(prefix)) {
        ruleContent = `  ${cssProperty}-top: ${cssValue}${unit}${importantSuffix};\n${cssProperty}-bottom: ${cssValue}${unit}${importantSuffix};\n`; // Use escapedClassName and importantSuffix
    }
    else {
        ruleContent = `  ${cssProperty}: ${cssValue}${unit}${importantSuffix};\n`; // Use escapedClassName and importantSuffix
    }
    return `${selector} {\n${ruleContent}}`;
}
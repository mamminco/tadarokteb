import fs from 'fs';
import path from 'path';
import crypto from 'crypto'; // Added for MD5

// State for CSS class tracking
let previousUsedClasses = {
    tx: new Set(),
    txs: new Set()
};

const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
};

const svelteFileExtension = 'svelte'; // Define for clarity

// --- Helper Functions ---

// Generate a random MD5 ID
function generateMd5Id() {
    return crypto.createHash('md5').update(Date.now().toString() + Math.random().toString()).digest('hex');
}

const defaultIgnorePatterns = ['node_modules', '.git', '.svelte-kit', 'build', 'dist', 'package-lock.json', 'yarn.lock'];

function findFilesInDirectory(dir, extensions, ignorePatterns = defaultIgnorePatterns, fileList = []) {
    const dirAbsolutePath = path.resolve(dir); // Resolve to absolute path for reliable checks

    // Check if the current directory itself should be ignored
    if (dir !== '.' && ignorePatterns.some(pattern => dirAbsolutePath.includes(path.sep + pattern + path.sep) || path.basename(dirAbsolutePath) === pattern)) {
        return fileList;
    }

    let filesInCurrentDir;
    try {
        filesInCurrentDir = fs.readdirSync(dir);
    } catch (err) {
        // console.warn(`Could not read directory ${dir}: ${err.message}`);
        return fileList; // Skip unreadable directories
    }
    
    for (let file of filesInCurrentDir) {
        let filePath = path.join(dir, file);
        let fileAbsolutePath = path.resolve(filePath); // Resolve to absolute path for reliable checks

        // Check if the path itself or its basename matches any ignore pattern
        if (ignorePatterns.some(pattern => fileAbsolutePath.includes(path.sep + pattern + path.sep) || path.basename(fileAbsolutePath) === pattern || fileAbsolutePath.includes(path.join(path.sep, pattern, path.sep)))) {
            continue;
        }
        
        let fileStat;
        try {
            fileStat = fs.statSync(filePath);
        } catch (err) {
            // console.warn(`Could not stat file ${filePath}: ${err.message}`);
            continue; // Skip files that can't be stat-ed
        }

        if (fileStat.isDirectory()) {
            findFilesInDirectory(filePath, extensions, ignorePatterns, fileList);
        } else if (extensions.includes(path.extname(file).slice(1).toLowerCase())) { // lowerCase extension check
            fileList.push(filePath);
        }
    }
    return fileList;
}


// Process Svelte files to add/update specific attributes with MD5 IDs
async function processSvelteAttributes(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const originalContent = content; // Keep a copy for comparison
        const attributesToModify = ['static', 'editablelink', 'editabletext'];
        let fileWasModified = false;

        for (const attr of attributesToModify) {
            // Regex to find the attribute:
            // \b(${attr})\b: Matches the whole attribute name (e.g., "static").
            // (?: ... )?: Optional non-capturing group for the attribute's value part.
            //    \\s*=\\s*: Equals sign, possibly surrounded by whitespace.
            //    (?:(["'])(?:(?!\\2).)*\\2|[^\\s>]+): Matches a quoted string or an unquoted value.
            //       (["']) : Quote char (single or double), captured in group 2.
            //       (?:(?!\2).)* : Any char not the opening quote, repeated. (Avoids catastrophic backtracking with .*?)
            //       \\2 : Closing quote.
            //       | : OR
            //       [^\\s>/"'=]+ : Unquoted value (sequence of non-whitespace, non-'>', non-'"', non-'\'', non-'=' chars).
            const regex = new RegExp(`\\b(${attr})\\b(?:\\s*=\\s*(?:(["'])(?:(?!\\2).)*\\2|[^\\s>/"'=]+))?`, 'g');
            
            let currentContentBeforeReplace = content;
            content = content.replace(regex, (match, capturedAttrName) => {
                const id = generateMd5Id();
                // console.log(`Modifying attribute in ${filePath}: '${match}' to '${capturedAttrName}="${id}"'`);
                return `${capturedAttrName}="${id}"`;
            });
            if (content !== currentContentBeforeReplace) {
                fileWasModified = true;
            }
        }

        if (fileWasModified) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Successfully updated attributes in Svelte file: ${filePath}`);
        }
        // Optional: else { console.log(`No relevant attributes found or modified in Svelte file: ${filePath}`); }

    } catch (error) {
        console.error(`Error processing Svelte file ${filePath} for attributes:`, error);
    }
}


// Main Plugin Export
export default function txPlugin(fileExtensionsForCss) { // Renamed for clarity
    let initialRun = true; // Plugin's initial run flag

    return {
        name: 'tx-plugin-attributes-and-css', // More descriptive name

        async buildStart() {
            // 1. Process Svelte files for attributes
            console.log("Scanning and processing Svelte files for specified attributes...");
            const svelteFiles = findFilesInDirectory('.', [svelteFileExtension]);
            for (const svelteFile of svelteFiles) {
                await processSvelteAttributes(svelteFile); // Await to ensure modifications are done before CSS processing
            }
            console.log("Svelte attribute processing complete.");

            // 2. Process CSS (original functionality)
            if (initialRun) {
                console.log("Initial app.css compilation on server start...");
                await compileAppCss(fileExtensionsForCss, null, previousUsedClasses, true); // Pass true for isInitialRun
                initialRun = false;
            }
        },

        async handleHotUpdate(ctx) {
            const changedFile = ctx.file;
            const changedFileExt = path.extname(changedFile).slice(1).toLowerCase();
            let svelteFileProcessedForAttributes = false;

            // 1. If a Svelte file changed, process its attributes
            if (changedFileExt === svelteFileExtension) {
                console.log(`Svelte file changed: ${changedFile}. Processing attributes...`);
                await processSvelteAttributes(changedFile); // Await modification
                svelteFileProcessedForAttributes = true;
            }

            // 2. If the changed file is relevant for CSS (could be Svelte or other)
            if (fileExtensionsForCss.map(ext => ext.toLowerCase()).includes(changedFileExt)) {
                console.log(`Hot reload triggered for CSS-relevant file: ${changedFile}`);
                await compileAppCss(fileExtensionsForCss, changedFile, previousUsedClasses, false); // Pass false for isInitialRun
            } else if (!svelteFileProcessedForAttributes) {
                console.log(`File changed, but not relevant for CSS processing or Svelte attribute updates: ${changedFile}`);
            }
        },
    };
}


async function compileAppCss(fileExtensions, changedFile = null, previousClassesState, isInitialRun = false) {
    let baseCssPath = './base.css';
    let appCssPath = './src/routes/app.css';
    let spacingUnit = 'var(--tx)';

    try {
        if (!fs.existsSync(baseCssPath)) {
            console.warn(`base.css not found at ${baseCssPath}. Skipping CSS compilation.`);
            return;
        }
        let baseCssContent = fs.readFileSync(baseCssPath, 'utf-8');
        let baseCssRules = parseBaseCss(baseCssContent);
        let rootVariables = mergeRootVariables(baseCssContent);

        let currentUsedTxClasses = new Set();
        let currentUsedTxsClasses = new Set();

        let filesToProcess = findFilesInDirectory('.', fileExtensions);
        if (changedFile && !isInitialRun) { // Log specific file if it's a targeted HMR update
            console.log(`Processing relevant files for app.css generation (triggered by: ${changedFile}).`);
        } else if (isInitialRun) {
            console.log(`Processing relevant files for app.css generation (initial run).`);
        } else {
            console.log(`Processing relevant files for app.css generation (full scan).`);
        }


        let baseCssClasses = extractClassesFromCss(baseCssContent);

        for (let file of filesToProcess) {
            if (!fs.existsSync(file)) {
                console.warn(`File ${file} not found during CSS compilation. Skipping.`);
                continue;
            }
            let fileContent = fs.readFileSync(file, 'utf-8');
            let classes = extractClassesFromFileContent(fileContent);

            for (let classNameWithPrefix of classes) {
                if (classNameWithPrefix.startsWith('txs-') || classNameWithPrefix.startsWith('sm:txs-') || classNameWithPrefix.startsWith('!md:txs-') || classNameWithPrefix.startsWith('lg:txs-') || classNameWithPrefix.startsWith('!txs-')  || classNameWithPrefix.startsWith('!sm:txs-') || classNameWithPrefix.startsWith('!md:txs-') || classNameWithPrefix.startsWith('!lg:txs-')) {
                    currentUsedTxsClasses.add(classNameWithPrefix);
                } else {
                    let className = classNameWithPrefix;
                    // let prefix = ''; // This variable was not used for baseCssClasses check
                    // let isImportant = false; // This variable was not used for baseCssClasses check

                    if (classNameWithPrefix.startsWith('!')) {
                        // isImportant = true;
                        className = classNameWithPrefix.substring(1);
                    }

                    // Strip breakpoint prefixes for checking existence in baseCssClasses
                    let checkClassName = className;
                    if (checkClassName.startsWith('sm:') || checkClassName.startsWith('md:') || checkClassName.startsWith('lg:')) {
                        checkClassName = checkClassName.substring(3);
                    }
                    
                    if (baseCssClasses.has(checkClassName)) {
                        currentUsedTxClasses.add(classNameWithPrefix); // Add the full original class name with prefixes and '!'
                    }
                }
            }
        }

        let appCssContent = '';
        appCssContent += rootVariables + '\n\n';

        let txRules = generateTxClassRules(currentUsedTxClasses, baseCssRules);
        appCssContent += txRules; // Removed extra newline and media query from here.
        if(txRules) { // Add media query only if txRules are generated
             appCssContent += `\n@media (max-width: 767px) {\n    :root {\n        --tx-canvas-size: 420;\n    }\n}\n`;
        }


        let txsClassRules = generateTxsClassRules(currentUsedTxsClasses, spacingUnit);
        appCssContent += txsClassRules;

        const txClassesChanged = !setsAreEqual(currentUsedTxClasses, previousClassesState.tx);
        const txsClassesChanged = !setsAreEqual(currentUsedTxsClasses, previousClassesState.txs);

        if (isInitialRun || txClassesChanged || txsClassesChanged) {
            fs.writeFileSync(appCssPath, appCssContent.trim() || '/* app.css is empty because no tx- or txs- classes were detected */');
            console.log(`Successfully compiled app.css${!isInitialRun ? ' due to hot reload/changes.' : ' on initial run.'}`);

            previousClassesState.tx = new Set(currentUsedTxClasses);
            previousClassesState.txs = new Set(currentUsedTxsClasses);
        } else {
            console.log('No changes in relevant classes detected, app.css not updated.');
        }

    } catch (error) {
        console.error('Error compiling app.css:', error);
    }
}

function mergeRootVariables(cssContent) {
    const rootRegex = /:root\s*\{([^}]+)\}/gs; // Added 's' flag for dotall
    let mergedVariables = '';
    let match;

    while ((match = rootRegex.exec(cssContent)) !== null) {
        mergedVariables += match[1].trim() + '\n';
    }

    if (mergedVariables.trim()) {
        return `:root {\n${mergedVariables.trim()}\n}`;
    }
    return '';
}

function setsAreEqual(set1, set2) {
    if (set1.size !== set2.size) return false;
    for (let item of set1) {
        if (!set2.has(item)) return false;
    }
    return true;
}

function parseBaseCss(cssContent) {
    let rulesMap = new Map();
    // Regex to capture .class-name { rules }
    // It handles nested structures like media queries poorly if classes are defined inside them directly.
    // Assumes base.css has simple .class { property: value; } rules at the top level.
    const regex = /\.([\w-]+)\s*\{([^}]*)\}/g;
    let match;
    while ((match = regex.exec(cssContent)) !== null) {
        const className = match[1];
        const cssRules = match[2].trim();
        if (className && cssRules) { // Ensure both classname and rules exist
            rulesMap.set(className, `.${className} {\n${cssRules}\n}`);
        }
    }
    return rulesMap;
}

function extractClassesFromFileContent(fileContent) {
    let classNames = new Set();
    const regex = /class(?:Name)?=["']([^"']+)["']/g; // Handles class="foo bar" and className (React)
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        const classesString = match[1];
        classesString.split(/\s+/).forEach(cls => {
            if (cls) { // Ensure non-empty class
                classNames.add(cls.trim());
            }
        });
    }
    return classNames;
}

function extractClassesFromCss(cssContent) {
    const classNames = new Set();
    // Regex to find class names (e.g., .my-class, .another-class)
    // Avoids matching pseudo-classes like :hover by ensuring it's a class selector
    const regex = /\.([a-zA-Z_][\w-]*)/g; 
    let match;
    while ((match = regex.exec(cssContent)) !== null) {
        classNames.add(match[1]);
    }
    return classNames;
}

function generateTxClassRules(currentUsedTxClasses, baseCssRules) {
    let rules = '';
    currentUsedTxClasses.forEach(fullClassNameWithPrefix => { // e.g., "!sm:text-red-500"
        let classNameForLookup = fullClassNameWithPrefix;
        let breakpointPrefix = '';
        let isImportant = false;

        if (classNameForLookup.startsWith('!')) {
            isImportant = true;
            classNameForLookup = classNameForLookup.substring(1); // Remove "!" -> "sm:text-red-500"
        }

        if (classNameForLookup.startsWith('sm:')) {
            breakpointPrefix = 'sm';
            classNameForLookup = classNameForLookup.substring(3); // Remove "sm:" -> "text-red-500"
        } else if (classNameForLookup.startsWith('md:')) {
            breakpointPrefix = 'md';
            classNameForLookup = classNameForLookup.substring(3);
        } else if (classNameForLookup.startsWith('lg:')) {
            breakpointPrefix = 'lg';
            classNameForLookup = classNameForLookup.substring(3);
        }
        // classNameForLookup is now the base class name, e.g., "text-red-500"

        if (baseCssRules.has(classNameForLookup)) {
            let baseRuleBlock = baseCssRules.get(classNameForLookup); // e.g., ".text-red-500 {\n  color: #f00;\n}"
            let ruleContentMatch = baseRuleBlock.match(/\{([\s\S]*)\}/); // Extract content within {}
            if (ruleContentMatch && ruleContentMatch[1]) {
                let properties = ruleContentMatch[1].trim();
                let finalProperties = '';
                properties.split(';').forEach(prop => {
                    prop = prop.trim();
                    if (prop) {
                        finalProperties += `  ${prop}${isImportant ? ' !important' : ''};\n`;
                    }
                });

                // Escape the original full class name for the selector
                let escapedSelectorClassName = fullClassNameWithPrefix.replace(/([!%:])/g, '\\$1');

                const selector = `.${escapedSelectorClassName}`;

                if (breakpointPrefix) {
                    rules += `@media (min-width: ${breakpoints[breakpointPrefix]}) {\n${selector} {\n${finalProperties.trimEnd()}\n}\n}\n`;
                } else {
                    rules += `${selector} {\n${finalProperties.trimEnd()}\n}\n`;
                }
            }
        }
    });
    return rules;
}

function generateTxsClassRules(txsClasses, spacingUnit) {
    let rules = '';
    // Regex updated to be more specific about property prefixes
    const valueRegex = /^txs-(mr|mx|my|ml|fs|mt|mb|p|rounded|pt|top|bottom|left|right|pb|pl|pr|px|py|gap|w|h|min-w|max-w|min-h|max-h|opacity|border|bw|z|order|flex-basis|scale(?:-x|-y)?|translate-x|translate-y|rotate|skew-x|skew-y)-([\d.-]+)$/;


    txsClasses.forEach(originalFullClassName => { // e.g., "!sm:txs-mr-10"
        let classNameForParsing = originalFullClassName;
        let breakpointPrefix = '';
        let isImportant = false;

        if (classNameForParsing.startsWith('!')) {
            isImportant = true;
            classNameForParsing = classNameForParsing.substring(1);
        }

        if (classNameForParsing.startsWith('sm:')) {
            breakpointPrefix = 'sm';
            classNameForParsing = classNameForParsing.substring(3);
        } else if (classNameForParsing.startsWith('md:')) {
            breakpointPrefix = 'md';
            classNameForParsing = classNameForParsing.substring(3);
        } else if (classNameForParsing.startsWith('lg:')) {
            breakpointPrefix = 'lg';
            classNameForParsing = classNameForParsing.substring(3);
        }
        // classNameForParsing is now like "txs-mr-10"

        const match = classNameForParsing.match(valueRegex);
        if (match) {
            let baseRule = generateSingleTxsRule(match, spacingUnit, originalFullClassName, isImportant);
            if (baseRule) { // Ensure rule was generated
                if (breakpointPrefix) {
                    rules += `@media (min-width: ${breakpoints[breakpointPrefix]}) {\n${baseRule}\n}\n`;
                } else {
                    rules += baseRule + '\n'; // Add newline for separation
                }
            }
        }
    });
    return rules;
}

function generateSingleTxsRule(match, spacingUnit, originalFullClassName, isImportant) {
    let propertyName = match[1]; // e.g., 'mr', 'fs', 'opacity', 'scale-x'
    let valueStr = match[2];    // Numerical part as string, e.g., "10", "0.5", "-5"
    let numValue = parseFloat(valueStr); // Convert to number

    let cssProperty = '';
    let cssValue = '';
    let requiresCalc = true; // Most properties use calc with spacingUnit

    // Escape the original full class name for use as a CSS selector
    let escapedSelectorClassName = originalFullClassName.replace(/([!%:])/g, '\\$1');
    const selector = `.${escapedSelectorClassName}`;
    const importantSuffix = isImportant ? ' !important' : '';

    switch (propertyName) {
        case 'mr': cssProperty = 'margin-right'; break;
        case 'ml': cssProperty = 'margin-left'; break;
        case 'mt': cssProperty = 'margin-top'; break;
        case 'mb': cssProperty = 'margin-bottom'; break;
        case 'mx': cssProperty = 'margin-left'; cssValue = `calc(${spacingUnit} * ${numValue});\n  margin-right: calc(${spacingUnit} * ${numValue})`; break;
        case 'my': cssProperty = 'margin-top'; cssValue = `calc(${spacingUnit} * ${numValue});\n  margin-bottom: calc(${spacingUnit} * ${numValue})`; break;
        case 'top': cssProperty = 'top'; break;
        case 'bottom': cssProperty = 'bottom'; break;
        case 'left': cssProperty = 'left'; break;
        case 'right': cssProperty = 'right'; break;
        case 'p': cssProperty = 'padding'; break;
        case 'pt': cssProperty = 'padding-top'; break;
        case 'pb': cssProperty = 'padding-bottom'; break;
        case 'pl': cssProperty = 'padding-left'; break;
        case 'pr': cssProperty = 'padding-right'; break;
        case 'px': cssProperty = 'padding-left'; cssValue = `calc(${spacingUnit} * ${numValue});\n  padding-right: calc(${spacingUnit} * ${numValue})`; break;
        case 'py': cssProperty = 'padding-top'; cssValue = `calc(${spacingUnit} * ${numValue});\n  padding-bottom: calc(${spacingUnit} * ${numValue})`; break;
        case 'gap': cssProperty = 'gap'; break;
        case 'w': cssProperty = 'width'; break;
        case 'h': cssProperty = 'height'; break;
        case 'min-w': cssProperty = 'min-width'; break;
        case 'max-w': cssProperty = 'max-width'; break;
        case 'min-h': cssProperty = 'min-height'; break;
        case 'max-h': cssProperty = 'max-height'; break;
        case 'fs': cssProperty = 'font-size'; break;
        case 'rounded': cssProperty = 'border-radius'; break;
        
        case 'border': cssProperty = 'border-width'; cssValue = `${numValue}px`; requiresCalc = false; break;
        case 'bw': cssProperty = 'border-width'; cssValue = `${numValue}px`; requiresCalc = false; break;
        
        case 'opacity': // Renamed from 'op' for clarity, matches CSS
            cssProperty = 'opacity'; 
            cssValue = (numValue / 100).toFixed(2); 
            requiresCalc = false; 
            break;
        
        case 'z': cssProperty = 'z-index'; cssValue = valueStr; requiresCalc = false; break;
        case 'order': cssProperty = 'order'; cssValue = valueStr; requiresCalc = false; break;
        case 'flex-basis': cssProperty = 'flex-basis'; break; // uses calc

        // Transform properties
        case 'scale': cssProperty = 'transform'; cssValue = `scale(${numValue / 100})`; requiresCalc = false; break;
        case 'scale-x': cssProperty = 'transform'; cssValue = `scaleX(${numValue / 100})`; requiresCalc = false; break;
        case 'scale-y': cssProperty = 'transform'; cssValue = `scaleY(${numValue / 100})`; requiresCalc = false; break;
        case 'translate-x': cssProperty = 'transform'; cssValue = `translateX(calc(${spacingUnit} * ${numValue}))`; requiresCalc = false; break;
        case 'translate-y': cssProperty = 'transform'; cssValue = `translateY(calc(${spacingUnit} * ${numValue}))`; requiresCalc = false; break;
        case 'rotate': cssProperty = 'transform'; cssValue = `rotate(${valueStr}deg)`; requiresCalc = false; break;
        case 'skew-x': cssProperty = 'transform'; cssValue = `skewX(${valueStr}deg)`; requiresCalc = false; break;
        case 'skew-y': cssProperty = 'transform'; cssValue = `skewY(${valueStr}deg)`; requiresCalc = false; break;
        
        default: return ''; // Unknown property
    }

    let ruleContent = '';
    if (['mx', 'my', 'px', 'py'].includes(propertyName)) {
        // cssValue already contains both properties
        ruleContent = `  ${cssValue.replace(/;/g, importantSuffix + ';')}${importantSuffix};\n`;
    } else {
        if (requiresCalc && !cssValue) { // If cssValue wasn't pre-set by a special case
            cssValue = `calc(${spacingUnit} * ${numValue})`;
        }
        ruleContent = `  ${cssProperty}: ${cssValue}${importantSuffix};\n`;
    }
    
    return `${selector} {\n${ruleContent}}`;
}
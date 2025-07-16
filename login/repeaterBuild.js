import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';
import { parseDocument } from 'htmlparser2'
async function generateRepeaterFunctions() {
    console.log("[generate-repeater-functions] Starting script execution (htmlparser2 version).");

    const functionDefinitions = {};
    const generatedFunctionNames = new Set();
    const svelteFilesDir = path.resolve('src');
    let svelteKitOutputDir;

    try {
        const svelteConfig = await readConfig();
        svelteKitOutputDir = svelteConfig?.kit?.outDir || './build';
        console.log(`[generate-repeater-functions] SvelteKit output directory resolved: ${svelteKitOutputDir}`);
    } catch (error) {
        console.warn("[generate-repeater-functions] Could not read svelte.config.js, using default output directory './build'. Error:", error.message);
        svelteKitOutputDir = './build';
    }

    const outputNodesDir = path.resolve(svelteKitOutputDir, '_app/immutable/nodes');
    console.log(`[generate-repeater-functions] Output nodes directory: ${outputNodesDir}`);
    console.log(`[generate-repeater-functions] Scanning Svelte files in: ${svelteFilesDir}`);

    const svelteFiles = await glob('**/*.svelte', { cwd: svelteFilesDir });
    console.log(`[generate-repeater-functions] Found Svelte files:`, svelteFiles);

    if (svelteFiles.length === 0) {
        console.warn("[generate-repeater-functions] No Svelte files found in 'src' directory. Exiting.");
        return;
    }

    for (const svelteFileRelativePath of svelteFiles) {
        const svelteFilePath = path.join(svelteFilesDir, svelteFileRelativePath);
        console.log(`[generate-repeater-functions] Processing file: ${svelteFilePath}`);

        let code;
        try {
            code = await fs.readFile(svelteFilePath, 'utf-8');
        } catch (readError) {
            console.error(`[generate-repeater-functions] Error reading file ${svelteFilePath}:`, readError);
            continue; // Skip to the next file if reading fails
        }

        console.log(`[generate-repeater-functions] File content read successfully. Parsing HTML.`);

        let dom;
        try {
            dom = parseDocument(code); // Parse HTML using htmlparser2
        } catch (parseError) {
            console.error(`[generate-repeater-functions] Error parsing HTML in ${svelteFilePath}:`, parseError);
            continue; // Skip file if parsing fails
        }

        console.log(`[generate-repeater-functions] HTML Parsed successfully. Walking DOM tree.`);

        const findRepeaterElements = (nodes) => {
            if (!nodes) return;

            for (const node of nodes) {
                if (node.type === 'tag' && node.attribs && node.attribs.repeater) {
                    const repeaterElement = node;
                    const repeaterValue = repeaterElement.attribs.repeater;
                    const attributes = repeaterElement.attribs;

                    console.log(`[generate-repeater-functions] --- Repeater Element Found ---`);
                    console.log(`[generate-repeater-functions] Element Name:`, repeaterElement.name);
                    console.log(`[generate-repeater-functions] Repeater Value:`, repeaterValue);
                    console.log(`[generate-repeater-functions] Attributes:`, attributes);


                    // --- Validation ---
                    if (!attributes.data) {
                        console.error(`[generate-repeater-functions] Missing 'data' attribute in repeater="${repeaterValue}" in: ${svelteFileRelativePath} in element: <${repeaterElement.name}>`);
                        continue;
                    }
                    if (!attributes.fields) {
                        console.error(`[generate-repeater-functions] Missing 'fields' attribute in repeater="${repeaterValue}" in: ${svelteFileRelativePath} in element: <${repeaterElement.name}>`);
                        continue;
                    }

                    let fieldsArray;
                    try {
                        fieldsArray = JSON.parse(attributes.fields);
                        if (!Array.isArray(fieldsArray) || !fieldsArray.every(item => typeof item === 'string')) {
                            throw new Error("Fields is not array of string");
                        }
                    } catch (e) {
                        console.error(`[generate-repeater-functions] Invalid 'fields' attribute format (must be JSON array of strings) in repeater="${repeaterValue}" in: ${svelteFileRelativePath} in element: <${repeaterElement.name}>. Error: ${e.message}`);
                        continue;
                    }

                    let limitValue = attributes.limit ? parseInt(attributes.limit, 10) : undefined;
                    if (attributes.limit && isNaN(limitValue)) {
                        console.error(`[generate-repeater-functions] Invalid 'limit' attribute (must be a number) in repeater="${repeaterValue}" in: ${svelteFileRelativePath} in element: <${repeaterElement.name}>`);
                        continue;
                    }

                    const sort = attributes.sort;
                    const category = attributes.category;
                    const data = attributes.data;


                    // --- Function Generation --- (same as before, just using parsed attributes)
                    const functionName = `repeater_${repeaterValue}`;
                    if (!generatedFunctionNames.has(functionName)) {
                        generatedFunctionNames.add(functionName);

                        let apiUrl = `/wp-json/sveltewp/${data}`;
                        const queryParams = [];

                        if (fieldsArray && fieldsArray.length > 0) {
                            queryParams.push(`_fields=${fieldsArray.join(',')}`);
                        }
                        if (limitValue !== undefined) {
                            queryParams.push(`per_page=${limitValue}`);
                        }
                        if (sort) {
                            queryParams.push(`orderby=${sort}`);
                            queryParams.push(`order=desc`);
                        }
                        if (category) {
                            queryParams.push(`categories_name=${category}`);
                        }

                        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
                        apiUrl += queryString;

                        const functionCode = `
export async function ${functionName}() {
    /**
     * Fetches data for repeater "${repeaterValue}" from WordPress REST API.
     * Data type: "${data}"
     * Fields: ${JSON.stringify(fieldsArray)}
     * Limit: ${limitValue !== undefined ? limitValue : 'default'}
     * Sort by: ${sort || 'default'}
     * Category: ${category || 'all'}
     */
    try {
        const response = await fetch('${apiUrl}');
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        s=await response.json();
    } catch (error) {
        console.error('Error fetching repeater data for ${repeaterValue}:', error);
        
    }
}
    ${functionName}();
`;
                        functionDefinitions[functionName] = functionCode;
                        console.log(`[generate-repeater-functions] Generated function definition for: ${functionName}`);
                    } else {
                        console.log(`[generate-repeater-functions] Function definition already exists for: ${functionName}. Skipping generation.`);
                    }
                }

                findRepeaterElements(node.children); // Recursive call for child nodes
            }
        };

        findRepeaterElements(dom.children); // Start DOM traversal from the root children

    }


    if (Object.keys(functionDefinitions).length === 0) {
        console.log("[generate-repeater-functions] No repeater functions found in Svelte files (after processing). Exiting.");
        return;
    } else {
        console.log(`[generate-repeater-functions] Generated function definitions:`, Object.keys(functionDefinitions));
    }

    let chunkFiles;
    try {
        console.log(`[generate-repeater-functions] Searching for chunk files in: ${outputNodesDir}`);
        chunkFiles = await glob('*.js', { cwd: outputNodesDir });
        console.log(`[generate-repeater-functions] Found chunk files:`, chunkFiles);
    } catch (e) {
        console.error(`[generate-repeater-functions] Error finding chunk files in ${outputNodesDir}:`, e);
        return;
    }

    if (chunkFiles.length === 0) {
        console.warn("[generate-repeater-functions] No chunk files found in output directory. Injection skipped.");
        return;
    }

    const lastChunkFile = chunkFiles.sort()[chunkFiles.length - 1];
    const lastChunkPath = path.join(outputNodesDir, lastChunkFile);
    console.log(`[generate-repeater-functions] Last chunk file for injection: ${lastChunkPath}`);

    let chunkContent;
    try {
        chunkContent = await fs.readFile(lastChunkPath, 'utf-8');
    } catch (e) {
        console.error(`[generate-repeater-functions] Error reading last chunk file ${lastChunkPath}:`, e);
        return;
    }

    const functionCodeToAppend = Object.values(functionDefinitions).join('\n\n');
    const updatedChunkContent = `${chunkContent}\n\n${functionCodeToAppend}`;

    try {
        await fs.writeFile(lastChunkPath, updatedChunkContent);
        console.log(`[generate-repeater-functions] Injected repeater functions into last chunk: ${lastChunkPath}`);
    } catch (e) {
        console.error(`[generate-repeater-functions] Error writing to last chunk file ${lastChunkPath}:`, e);
    }

    console.log("[generate-repeater-functions] Script execution completed.");

}

generateRepeaterFunctions().catch(error => {
    console.error("[generate-repeater-functions] Script failed with unhandled error:", error);
});
const fs = require('fs');

const content = fs.readFileSync('src/i18n.js', 'utf8');

// Extract the resources object text
// Assuming it starts with "const resources = {" and ends before "i18n" or similar
const startMatch = content.match(/const resources = \{/);
if (!startMatch) {
    console.error("Could not find start of resources object");
    process.exit(1);
}

const startIndex = startMatch.index + "const resources = ".length;

// Simple brace counting to find the end of the object
let braceCount = 0;
let endIndex = -1;
let inString = false;
let stringChar = '';

for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    if (inString) {
        if (char === stringChar && content[i - 1] !== '\\') {
            inString = false;
        }
    } else {
        if (char === '"' || char === "'") {
            inString = true;
            stringChar = char;
        } else if (char === '{') {
            braceCount++;
        } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }
}

if (endIndex === -1) {
    console.error("Could not find end of resources object");
    process.exit(1);
}

const resourcesObjStr = content.substring(startIndex, endIndex);

try {
    // There shouldn't be any variable references inside, so we can try eval (safe-ish context of this script)
    // or JSON.parse if it was strict JSON, but it might have loose keys (though i18n usually uses strings)
    // It's a JS object literal.
    const resources = eval('(' + resourcesObjStr + ')');

    console.log("--- English Keys (Top Level) ---");
    if (resources.en && resources.en.translation) {
        console.log(Object.keys(resources.en.translation).filter(k => k === 'contact_card' || k === 'sync'));
    } else {
        console.log("en.translation missing!");
    }

    console.log("\n--- Hebrew Keys (Top Level) ---");
    if (resources.he && resources.he.translation) {
        console.log("Keys found:", Object.keys(resources.he.translation).filter(k => k === 'contact_card' || k === 'sync'));

        console.log("\n--- Deep Check: contact_card ---");
        if (resources.he.translation.contact_card) {
            console.log("contact_card exists. Sample key 'basic_details':", resources.he.translation.contact_card.basic_details);
        } else {
            console.log("contact_card is MISSING from he.translation");
        }

        console.log("\n--- Deep Check: sync ---");
        if (resources.he.translation.sync) {
            console.log("sync exists. Sample key 'syncing':", resources.he.translation.sync.syncing);
        } else {
            console.log("sync is MISSING from he.translation");
        }

    } else {
        console.log("he.translation missing!");
        // Check if he exists but has different structure
        if (resources.he) {
            console.log("resources.he keys:", Object.keys(resources.he));
        }
    }

} catch (e) {
    console.error("Error parsing resources object:", e);
    console.log("Extracted string (first 500 chars):", resourcesObjStr.substring(0, 500));
}

const fs = require('fs');
const path = require('path');

try {
    const content = fs.readFileSync('src/i18n.js', 'utf8');
    // Attempt to parse as script to check syntax
    // Since it has imports, we might need to strip them or use vm.Script with module?
    // Actually, just require usually works if we use babel-node or similar, but here standard node might fail on 'import'.
    // However, syntax error like misplaced brace is parse error regardless of module type usually.

    // Let's use vm
    const vm = require('vm');
    try {
        new vm.Script(content);
        console.log("Syntax OK (VM Script check - might ignore some module syntax)");
    } catch (e) {
        console.log("VM Script Syntax Error:");
        console.log(e.message);
        if (e.stack) console.log(e.stack.split('\n').slice(0, 3).join('\n'));
    }

} catch (err) {
    console.error("Error reading file:", err);
}

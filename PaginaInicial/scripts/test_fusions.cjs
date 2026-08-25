const fs = require('fs');
const vm = require('vm');

const constantsCode = fs.readFileSync('src/constants.js', 'utf8');
const databaseCode = fs.readFileSync('src/database.js', 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);

try {
    vm.runInContext(constantsCode + '\n' + databaseCode, sandbox);
    console.log("No syntax or reference errors found!");
    
    // Check recipes and fusion data
    const MASTER_FUSION_DATA = sandbox.window.MASTER_FUSION_DATA;
    const MASTER_FUSION_RECIPES = sandbox.window.MASTER_FUSION_RECIPES;
    
    let allGood = true;
    for (const [recipe, fusionId] of Object.entries(MASTER_FUSION_RECIPES)) {
        let found = false;
        for (const cls in MASTER_FUSION_DATA) {
            const skill = MASTER_FUSION_DATA[cls].find(s => s.id === fusionId);
            if (skill) {
                found = true;
                if (!skill.type || !skill.stats) {
                    console.log(`Error: ${fusionId} is missing type or stats.`);
                    allGood = false;
                }
                break;
            }
        }
        if (!found) {
            console.log(`Error: Recipe ${recipe} points to non-existent fusion ${fusionId}`);
            allGood = false;
        }
    }
    
    if (allGood) {
        console.log("All recipes point to valid fusion skills!");
    }
} catch (e) {
    console.error("Error executing combined files:", e);
}

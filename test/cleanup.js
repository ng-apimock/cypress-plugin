const path = require('path');

const fs = require('fs-extra');

const generatedMocksDirectory = path.join(process.cwd(), '.ngapimock', 'generated');

console.log('Cleaning up generaged presets');
[
    'unhappy.preset.json',
    'unhappy_without_mocks_with_variables.preset.json',
    'unhappy_with_mocks_without_variables.preset.json'
]
    .map((preset) => path.join(generatedMocksDirectory, preset))
    .forEach((preset) => {
        if (fs.existsSync(preset)) {
            fs.removeSync(preset);
        }
    });

const fs = require('fs')
const { join } = require('path');

const constants = {
    ELEMENTS_DIR: join('.', 'elements'),
    PUBLIC_ELEMENTS_DIR: join('.', 'public', 'elements'),
    SRC_ELEMENTS_DIR: join('.', 'src', 'elements'),
}

const elements = [];

fs.readdirSync(constants.PUBLIC_ELEMENTS_DIR, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .forEach((folder) => {
        console.log(folder);
        const fileNames = fs.readdirSync(
            join(constants.PUBLIC_ELEMENTS_DIR, folder.name)
        );
        fileNames.forEach((fileName) => {
            const dashSplit = fileName.split('-');
            const prefix = dashSplit[0];
            const dotSplit = dashSplit[1].split('.');
            const suffix = dotSplit[0];

            elements.push(join(constants.ELEMENTS_DIR, folder.name, prefix + '-' + suffix + '.html'))
        });
    });

fs.writeFileSync(
    join(constants.SRC_ELEMENTS_DIR, 'index.js'),
    `export const htmlFiles=${JSON.stringify(elements)};`
)
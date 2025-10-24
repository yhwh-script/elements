const fs = require('fs')
const path = require('path');

const constants = {
    ELEMENTS_DIR: path.join('.', 'elements'),
    PUBLIC_ELEMENTS_DIR: path.join('.', 'public', 'elements'),
    SRC_ELEMENTS_DIR: path.join('.', 'src', 'elements'),
}

const elements = [];
try {
    fs.readdirSync(constants.PUBLIC_ELEMENTS_DIR, { withFileTypes: true })
        .filter((dir) => dir.isDirectory())
        .forEach((folder) => {
            console.log(folder);
            const fileNames = fs.readdirSync(
                path.join(constants.PUBLIC_ELEMENTS_DIR, folder.name)
            );
            fileNames.forEach((fileName) => {
                if (fileName.indexOf("-") != -1) {
                    const dashSplit = fileName.split('-');
                    const prefix = dashSplit[0];
                    const dotSplit = dashSplit[1].split('.');
                    const suffix = dotSplit[0];
                    // elements.push(join(constants.ELEMENTS_DIR, folder.name, prefix + '-' + suffix + '.html'))

                    // Solution 1: Use path.posix.join for consistent forward slashes
                    const elementPath = path.posix.join(constants.ELEMENTS_DIR, folder.name, prefix + '-' + suffix + '.html');
                    elements.push(elementPath);
                    
                    // Alternative Solution 2: Normalize path separators
                    // const elementPath = join(constants.ELEMENTS_DIR, folder.name, prefix + '-' + suffix + '.html');
                    // elements.push(elementPath.replace(/\\/g, '/'));
                }
            });
        });
} catch (e) {
    if (e instanceof TypeError) {
        console.error("WRONG GENERATION ERROR: Maybe there is a wrong filename? Use prefix/prefix-suffix.html in elements folder!")
        // TODO should I ignore? maybe add a start option. Or prompt to move.
    }
    throw e;
}

fs.writeFileSync(
    path.join(constants.SRC_ELEMENTS_DIR, 'elements.js'),
    `export const htmlFiles=${JSON.stringify(elements, null, 2)};`
)
const fs = require("fs");
const { join } = require("path");

const constants = {
    ELEMENTS_DIR: join(".", "elements"),
};

const elements = {};

fs.readdirSync(constants.ELEMENTS_DIR, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .forEach((folder) => {
        console.log("folder", folder);
        const fileNames = fs.readdirSync(
            join(constants.ELEMENTS_DIR, folder.name)
        );
        fileNames.forEach((fileName) => {
            const dashspilt = fileName.split("-");
            const prefix = dashspilt[0];
            const dotSplit = dashspilt[1].split(".");
            const suffix = dotSplit[0];
            if (!elements[prefix]) {
                elements[prefix] = [];
            }
            elements[prefix].push({
                suffix,
                filePath: join(
                    constants.ELEMENTS_DIR,
                    folder.name,
                    prefix + "-" + suffix + ".html"
                ),
            });
        });
    });

fs.writeFileSync(
    join(constants.ELEMENTS_DIR, "index.js"),
    `export const elements=${JSON.stringify(elements)};`
);
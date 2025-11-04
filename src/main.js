console.debug("START Modules");

Promise.all([
    import('./modules/eventBus'),
]).then((importedModules) => {
    importedModules.forEach((module) => {
        if (!module.moduleName) {
            throw new Error("Missing moduleName in imported module.");
        }
        window[module.moduleName] = module;
    })
}).finally(() => {
    // import('./modules/router'),
    import('/src/elements');
    console.log("END Modules")
});


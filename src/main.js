Promise.all([
    import('./modules/bus'),
    import('./modules/router')
]).then((importedModules) => {
    importedModules.forEach((module) => {
        if (!module.moduleName) {
            throw new Error("Missing moduleName in imported module.");
        }
        window[module.moduleName] = module;
    })
}).finally(() => {
    import('/src/elements');
});


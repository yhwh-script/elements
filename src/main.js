Promise.all([
    import('./modules/router'),
    import('./modules/bus'),
    import('./modules/callbacks'),
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

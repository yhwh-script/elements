Promise.all([
    import('./modules/shadowH4x'),
    import('./modules/router'),
    import('./modules/sqlite'),
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


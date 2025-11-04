export const moduleName = "weakbus";

// export function addEventListener(type, callback) {
//     if (!eventHandler[type]) {

//     };
//     console.log(weakKey, callback);
//     if (!callbacks) {
//         callbacks = [callback];
//         _weakMap.set(weakKey, callbacks);
//     } else if (!callbacks.includes(callback)) {
//         callbacks.push(callback);
//     }
// }

addEventListener("toggle-nav", handleEvent);
addEventListener("click", handleEvent);
addEventListener("popstate", handleEvent);
addEventListener("pushstate", handleEvent);

function handleEvent(event) {
    console.log("Test");
    switch (event.type) {
        case "click":
            break;
        case "popstate":
            break;
        case "pushstate":
            break;
        case "toggle-nav":
            break;
    }
}



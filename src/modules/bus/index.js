export const moduleName = "Bus";

const callbacksOfAnyType = [];

export function dispatchEvent(e) {
    // { type: "api:register", notify: [...hostDataIDs], callback: () => {}}
    // each time a router:navigate occurs,
    // notify eventListeners 
    if (e.type == "render:section") {
        renderSection(e.section)
    }
    // e.target.refresh(); // is available here :)
}

export function navigate(callback) {

}
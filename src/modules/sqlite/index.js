import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

// https://www.npmjs.com/package/@sqlite.org/sqlite-wasm
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

export const moduleName = "sqlite";

const workers = {};

function initalizeWorker(name) {
    let worker = new Worker(new URL('./sqliteWorker.js', import.meta.url), { type: 'module' });
    if (workers[name]) {
        console.error("InstantiationError: already taken");
        worker.terminate();
    } else {
        workers[name] = worker;
    }
}

export function createDB(name = 'default') {
    return new Promise((resolve, reject) => {
        initalizeWorker(name);
        let worker = getWorker(name);
        worker.onmessage = function ({ data }) {
            const { type, message } = data;
            if (type === 'created') {
                resolve({ message });
            }
        }
        worker.onerror = (error) => {
            reject(new Error(error));
        };
        worker.postMessage({ action: 'createDB', name });
    });
}

export async function deleteAndTerminateDB(name) {
    var root = await navigator.storage.getDirectory();
    let fileSystemFileHandle = await root.getFileHandle(`${name}.sqlite3`);
    if (fileSystemFileHandle) {
        let worker = workers[name];
        worker.onmessage = async function ({ data }) {
            const { type } = data;
            if (type === 'closed') {
                console.log("Removing...", fileSystemFileHandle);
                await fileSystemFileHandle.remove();
                await worker.terminate();
            }
            delete workers[name];
        }
        worker.postMessage({ action: 'closeDB' });
    }
}

export function downloadDB(name = 'default') {
    let worker = workers[name];
    if (worker) {
        worker.onmessage = function ({ data }) {
            const { type } = data;
            if (type === 'application/vnd.sqlite3') {
                let downloadChannel = new BroadcastChannel("download_channel");
                downloadChannel.postMessage(data);
                downloadChannel.close();
            }
        }
        worker.postMessage({ action: 'downloadDB' });
    }
}

export function executeQuery(sql, name = 'default') {
    return new Promise((resolve, reject) => {
        let worker = getWorker(name);
        if (worker) {
            worker.onmessage = function ({ data }) {
                const { type } = data;
                if (type === 'application/json') {
                    const { result } = data;
                    resolve(result);
                }
            }
            worker.onerror = (error) => {
                reject(error);
            };
            worker.postMessage({ action: "executeQuery", sql });
        } else {
            reject(new Error("No worker"));
        }
    });
}

export function executeStatement({ sql, values, name = "default" }) {
    return new Promise((resolve, reject) => {
        let worker = getWorker(name);
        if (worker) {
            worker.onmessage = function ({ data }) {
                const { type } = data;
                if (type === 'application/json') {
                    const { result } = data;
                    resolve(result);
                }
            }
            worker.onerror = (error) => {
                reject(error);
            };
            worker.postMessage({ action: "prepareStatement", sql, values });
        } else {
            reject(new Error("No worker"));
        }
    });
}

export function getWorker(name = 'default') {
    let worker = workers[name];
    return worker ? worker : undefined;
}

export function getWorkers() {
    return workers;
}

export function uploadDB(fileName, arrayBuffer) {
    let [name, extension] = fileName.split(".");
    if (['sqlite', 'sqlite3'].includes(extension)) {
        let worker = workers[name];
        if (!worker) {
            initalizeWorker(name);
            worker = getWorker(name);
        } // TODO: allow overwrite
        worker.postMessage({ action: 'uploadDB', name, arrayBuffer });
    } else {
        throw new Error({ name: "UnsupportedError", message: "Unsupported extension" });
    }
}

export function terminate(name = 'default') {
    let worker = workers[name];
    if (worker) {
        worker.postMessage({ command: 'terminate' });
    } 
}

if (window.Worker) {
    try {
        // instantiation test
        const sqlite3 = await sqlite3InitModule({ print: console.log, printErr: console.error });
        console.log('Running SQLite3 version', sqlite3.version.libVersion);
    } catch (err) {
        console.error('Initialization error:', err.name, err.message);
    }
} else {
    console.error('Your browser doesn\'t support web workers.');
}

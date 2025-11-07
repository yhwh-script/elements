import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

var db = null;
var sqlite3 = null;

onmessage = async function ({ data }) {
  const { action } = data;
  switch (action) {
    case 'createDB': {
      const { name } = data;
      const { newDB, message } = await createDatabase(name)
      db = newDB;
      postMessage({ type: 'created', message });
      break;
    }
    case 'executeQuery': {
      const { sql } = data;
      try {
        const result = await db.exec({ sql, returnValue: "resultRows" });
        // console.log(sql, result);
        postMessage({ result, type: "application/json" });
      } catch (e) {
        if (e.message.indexOf("SQLITE_CANTOPEN") != -1) {
          console.info("Info: Currently no SQLite database available for this worker. Upload a new database or reload the page.");
        }
        if (e.message.indexOf("SQLITE_CONSTRAINT_UNIQUE") != -1) {
          console.error("Error executing SQL statement", sql, e.message);
        }
      }
      break;
    }
    case 'prepareStatement': {
      const { sql, values } = data;
      let stmt;
      try {
        // console.log(sql, values);
        stmt = await db.prepare(sql, values);
        const columns = stmt.getColumnNames();
        // console.log("columns", columns);
        stmt.bind(values);
        // console.log("stmt", stmt)
        const result = [];
        while (stmt.step()) {
          let row = stmt.get([]);
          let zipped = columns.map(function (columnName, index) {
            return [columnName, row[index]];
          });
          let obj = Object.fromEntries(zipped);
          result.push(obj);
        }
        // console.log("RESULT", result)
        postMessage({ result, type: "application/json" });
      } catch (e) {
        if (e.message.indexOf("SQLITE_CANTOPEN") != -1) {
          console.info("Info: Currently no SQLite database available for this worker. Upload a new database or reload the page.");
        } else if (e.message.indexOf("SQLITE_CONSTRAINT_UNIQUE") != -1) {
          error("Error executing SQL statement", sql, e.message);
        } else {
          error("Error executing SQL statement", sql, e.message);
        }
      } finally {
        stmt.finalize();
      }
      break;
    }
    case 'uploadDB':
      const { name, arrayBuffer } = data;
      const { message } = await uploadDatabase(name, arrayBuffer)
      console.log(message, db);
      break;
    case 'downloadDB':
      try {
        const byteArray = sqlite3.capi.sqlite3_js_db_export(db);
        const blob = new Blob([byteArray.buffer], { type: "application/vnd.sqlite3" });
        postMessage(blob); // send the database Blob to the API
      } catch (e) {
        if (e.message.indexOf("SQLITE_NOMEM") != -1)
          postMessage({ type: "application/vnd.sqlite3", error: "SQLITE_NOMEM" });
        else
          error(e);
      }
      break;
    case 'closeDB':
      closeDB();
      postMessage({ type: "closed" });
      break;
    default:
      console.log({data})
  }
}

async function createDatabase(name) {
  const sqlite3 = await getInstance();
  return 'opfs' in sqlite3
    ? { newDB: new sqlite3.oo1.OpfsDb(`/${name}.sqlite3`), message: `OPFS is available, created persisted database at /${name}.sqlite3` }
    : { newDB: new sqlite3.oo1.DB(`/${name}.sqlite3`, 'ct'), message: `OPFS is not available, created transient database /${name}.sqlite3` };
}

async function uploadDatabase(name, arrayBuffer) {
  try {
    const sqlite3 = await getInstance();
    if ('opfs' in sqlite3) {
      const size = await sqlite3.oo1.OpfsDb.importDb(`${name}.sqlite3`, arrayBuffer);
      if (size) {
        db = new sqlite3.oo1.OpfsDb(`/${name}.sqlite3`);
        return { message: `New DB imported as ${name}.sqlite3. (${arrayBuffer.byteLength} Bytes)` }
      } else {
        throw new Error({ name: "ImportError", message: "Empty size" })
      }
    } else { // TODO allow alternative
      throw new Error({ name: "OPFSMissingError", message: "Unsupported operation due to missing OPFS support." });
    }
  } catch (err) {
    error(err.name, err.message);
  }
}

function closeDB() {
  if (db) {
    console.log("Closing...", db);
    db.close();
  }
}

async function getInstance() {
  try {
    if (!sqlite3) {
      sqlite3 = await sqlite3InitModule({ print: console.log, printErr: console.error });
    }
    return sqlite3;
  } catch (err) {
    console.error(err.name, err.message);
  }
}

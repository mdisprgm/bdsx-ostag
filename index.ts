import { events } from "bdsx/event";
import { red, white } from "colors";

import fs = require("fs");

const makeFolder = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("[OSTAG] directory", dir, "is generated");
    } else {
        console.log("[OSTAG] directory", dir, "exists already");
    }
};

events.serverOpen.on(() => {
    const dbPath = "../plugins/ostag/setting.json";

    makeFolder("../plugins/ostag");

    const files = fs.readdirSync("../plugins/ostag");
    if (!files.includes("setting.json")) {
        fs.closeSync(fs.openSync(dbPath, "w"));
        fs.writeFileSync(dbPath, JSON.stringify({ enabled: true }));
    }
    const value = fs.readFileSync(dbPath).toString();
    const p = JSON.parse(value);
    if (p["enabled"]) {
        import("./scoretag");
        console.log(white("[OSTAG] loaded successfullly"));
    } else console.log(white("[OSTAG]"), red("not enabled"));
});

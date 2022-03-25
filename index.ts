import { events } from "bdsx/event";
import { fsutil } from "bdsx/fsutil";
import { red, white } from "colors";
import * as fs from "fs";
import * as path from "path";

const defaultConfig = {
    tags: {
        position: "JukeboxPopup",
        permission: "OPERATOR", // unavailable with position: ScoreTag
        enabled: true,
    },
    UNKNOWN: "UNKNOWN",
    ANDROID: "ANDROID",
    IOS: "IOS",
    OSX: "OSX",
    AMAZON: "AMAZON",
    GEAR_VR: "GEAR_VR",
    HOLOLENS: "HOLOLENS",
    WINDOWS_10: "WINDOWS_10",
    WIN32: "WIN32",
    DEDICATED: "DEDICATED",
    TVOS: "TVOS",
    PLAYSTATION: "PLAYSTATION",
    NINTENDO: "NINTENDO",
    XBOX: "XBOX",
    WINDOWS_PHONE: "WINDOWS_PHONE",
};

function mkdirRecursive(dirpath: string, dirhas?: Set<string>): void {
    if (dirhas != null && dirhas.has(dirpath)) return;
    mkdirRecursive(path.dirname(dirpath), dirhas);
    try {
        fs.mkdirSync(dirpath);
    } catch {}
}
const dbPath = path.join(fsutil.projectPath, "ostag");
const filePath = path.join(dbPath, "setting.json");
mkdirRecursive(dbPath, new Set([fsutil.projectPath]));

let config: typeof defaultConfig = defaultConfig;
export function getConfig(): typeof config {
    return config;
}
try {
    const file = fs.readFileSync(filePath, "utf8");
    config = JSON.parse(file);
} catch {
    fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 4));
}

events.serverOpen.on(() => {
    if ((config as any).enabled != null) {
        console.log(new Error("Global " + "enabled".blue + " in setting is unused now. Please set " + "enabled".blue + " in " + "tags".blue + " scope"));
    }
    if (config?.tags?.enabled !== false) {
        import("./src/scoretag");
        console.log(white("[OSTAG] loaded successfullly"));
    } else console.log(white("[OSTAG]"), red("not enabled"));
});

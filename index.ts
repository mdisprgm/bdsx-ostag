import { events } from "bdsx/event";
import { red, white } from "colors";
import { readFileSync } from "fs";

const value = readFileSync("../plugins/ostag/setting.json").toString();
const p = JSON.parse(value);
events.serverOpen.on(() => {
  if (p["enabled"]) import("./scoretag");
});
if (p["enabled"]) console.log(white("[OSTAG] loaded successfullly"));
else console.log(white("[OSTAG]"), red("not enabled"));

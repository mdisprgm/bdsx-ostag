import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { InteractPacket } from "bdsx/bds/packets";
import { Player, ServerPlayer } from "bdsx/bds/player";
import { serverInstance } from "bdsx/bds/server";
import { BuildPlatform } from "bdsx/common";
import { events } from "bdsx/event";
import { getConfig } from "..";

const OSs = new Map<NetworkIdentifier, BuildPlatform>();

events.packetAfter(MinecraftPacketIds.Login).on((pkt, ni) => {
    const connreq = pkt.connreq;
    if (!connreq) return;
    OSs.set(ni, connreq.getDeviceOS());
});

events.networkDisconnected.on((ni) => {
    OSs.delete(ni);
});

const config = getConfig();
function getOSName(player: Player) {
    const ni = player.getNetworkIdentifier();
    return (config as any)[BuildPlatform[OSs.get(ni)!]] ?? config.UNKNOWN ?? "";
}

let taggingFunc: (message: string, params?: string[]) => void = (msg: string) => {};
events.playerJoin.on((ev) => {
    const os = getOSName(ev.player);
    if (config.tags.position !== "ScoreTag") registerInteractEv();
    else ev.player.setScoreTag(os);
});

let evRegistered = false;
const mc_level = serverInstance.minecraft.getLevel();
function registerInteractEv() {
    if (evRegistered) return;
    try {
        switch (config.tags.position) {
            case "Raw":
                taggingFunc = ServerPlayer.prototype.sendMessage;
                break;
            case "Popup":
                taggingFunc = ServerPlayer.prototype.sendPopup;
                break;
            case "JukeboxPopup":
                taggingFunc = ServerPlayer.prototype.sendJukeboxPopup;
                break;
            case "Tip":
                taggingFunc = ServerPlayer.prototype.sendTip;
                break;
            case "ActionBar":
                taggingFunc = ServerPlayer.prototype.sendActionbar;
                break;
            default:
                break;
        }

        events.packetBefore(MinecraftPacketIds.Interact).on((pkt, ni) => {
            const interactor = ni.getActor();
            const isMouseover = pkt.action === InteractPacket.Actions.Mouseover;
            if (isMouseover) {
                const entity = mc_level.getRuntimeEntity(pkt.actorId, false);
                if (entity?.isPlayer() && interactor) {
                    taggingFunc.call(interactor, "§f" + getOSName(entity));
                }
            }
        });
    } catch {
        evRegistered = true;
    }
}

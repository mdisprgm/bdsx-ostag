import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
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

events.playerJoin.on((ev) => {
    const ni = ev.player.getNetworkIdentifier();
    const os = (config as any)[BuildPlatform[OSs.get(ni)!] as any] ?? config.UNKNOWN;
    ev.player.setScoreTag(os);
});

import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { BuildPlatform } from "bdsx/common";

const OSs = new Map<NetworkIdentifier, BuildPlatform>();

events.packetAfter(MinecraftPacketIds.Login).on((pkt, ni) => {
    const connreq = pkt.connreq;
    if (!connreq) return;
    OSs.set(ni, connreq.getDeviceOS());
});

events.networkDisconnected.on((ni) => {
    OSs.delete(ni);
});

events.playerJoin.on(async (ev) => {
    const player = ev.player!;

    const os = BuildPlatform[OSs.get(player.getNetworkIdentifier())!];
    ev.player.setScoreTag(os);
});

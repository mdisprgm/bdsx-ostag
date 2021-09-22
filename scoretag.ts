import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { DeviceOS } from "bdsx/common";

const OSs = new Map<NetworkIdentifier, DeviceOS>();

events.packetAfter(MinecraftPacketIds.Login).on((pkt, ni) => {
  const connreq = pkt.connreq!;
  OSs.set(ni, connreq.getDeviceOS());
});

events.networkDisconnected.on((ni) => {
  OSs.delete(ni);
});

events.playerJoin.on((ev) => {
  const player = ev.player!;

  const os = DeviceOS[OSs.get(player.getNetworkIdentifier())!];
  ev.player.setScoreTag(os);
});

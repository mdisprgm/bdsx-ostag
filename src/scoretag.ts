import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { InteractPacket } from "bdsx/bds/packets";
import { Player, PlayerPermission, ServerPlayer } from "bdsx/bds/player";
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

const mc_level = serverInstance.minecraft.getLevel();

class OSTag {
    constructor() {
        this.event();
    }
    private getOSName(player: Player) {
        const ni = player.getNetworkIdentifier();
        return (this.config as any)[BuildPlatform[OSs.get(ni)!]] ?? this.config.UNKNOWN ?? "";
    }
    private tagger: (message: string, params?: string[]) => void = (msg: string) => {};

    private readonly config = getConfig();
    private readonly cfgPerm = PlayerPermission[this.config.tags.permission as any] as unknown as number;
    private readonly leastPerm = [PlayerPermission.CUSTOM, undefined, null].includes(this.cfgPerm) ? PlayerPermission.VISITOR : this.cfgPerm;

    private event(): void {
        events.playerJoin.on((ev) => {
            const os = this.getOSName(ev.player);
            if (this.config.tags.position !== "ScoreTag") this.registerInteractEv();
            else ev.player.setScoreTag(os);
        });
    }
    private evRegistered = false;
    private registerInteractEv() {
        if (this.evRegistered) return;
        try {
            switch (this.config.tags.position) {
                case "Raw":
                    this.tagger = ServerPlayer.prototype.sendMessage;
                    break;
                case "Popup":
                    this.tagger = ServerPlayer.prototype.sendPopup;
                    break;
                case "JukeboxPopup":
                    this.tagger = ServerPlayer.prototype.sendJukeboxPopup;
                    break;
                case "Tip":
                    this.tagger = ServerPlayer.prototype.sendTip;
                    break;
                case "ActionBar":
                    this.tagger = ServerPlayer.prototype.sendActionbar;
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
                        if (interactor.getPermissionLevel() >= this.leastPerm) this.tagger.call(interactor, "§f" + this.getOSName(entity));
                    }
                }
            });
        } catch {
            this.evRegistered = true;
        }
    }
}
new OSTag();

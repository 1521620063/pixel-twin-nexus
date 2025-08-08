interface IceServer {
    urls: string;
    username?: string;
    credential?: string;
}
interface RTCConfigurationType {
    iceTransportPolicy: "all" | "relay" | "none";
    bundlePolicy: "balanced" | "max-compat" | "max-bundle";
    rtcpMuxPolicy: "require" | "negotiate";
    iceServers: IceServer[];
}
interface PixelTwinArg {
    key: string;
    value?: number | string;
    check: boolean;
}
type PixelTwinInstance = Array<{
    id: string;
    playerId: number;
    UEClient: any;
    playerClient: any;
    UEProcess: any;
    clientInfo: any;
    serverIp: string;
    gpuAdapter: number;
    slaveClient?: any;
}>;
interface PixelTwinType {
    pixelTwinId: string;
    pixelTwinName: string;
    pixelTwinStartPath: string;
    pixelTwinArgs: PixelTwinArg[];
    graphicsMemory: number;
    serviceEnable: boolean;
    pixelTwinInstance: PixelTwinInstance;
}
interface GpuInfo {
    graphicsAdapter: number;
    gpuMemory: number;
}
interface HostNode {
    ip: string;
    gpu: GpuInfo[];
    slaveList?: {
        pixelTwinId: string;
        pixelTwinStartPath: string;
    }[];
    slaveClient?: any;
}
export type WebRTCConfigType = RTCConfigurationType | {};
export type PixelTwinTypeMap = Map<string, PixelTwinType>;
export { HostNode };

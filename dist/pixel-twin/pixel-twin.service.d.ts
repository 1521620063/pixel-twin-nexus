import { ConfigService } from '@nestjs/config';
import { HostNode } from 'src/types/pixel-twin.type';
export declare class PixelTwinService {
    private readonly configService;
    constructor(configService: ConfigService);
    private isSignallingEnabled;
    private WebRTCConfig;
    private pixelTwinMap;
    private pixelTwinGpuConfig;
    private pixelTwinIPlayerIdMap;
    private playerIdIndex;
    private readonly MAX_SAFE_PLAYER_ID;
    private generatePlayerId;
    initConfig(): Promise<void>;
    toRunPixelTwin(client: any, url: string, request: any): Promise<void>;
    registerUEClient(client: any, args: any): void;
    sendMessageToUE(playerId: number, message: any): void;
    sendMessageToPlayer(playerId: number, message: any): void;
    handlePlayerDisconnect(): void;
    enableSignalling(): boolean;
    disableSignalling(): boolean;
    getSignallingStatus(): boolean;
    isSignallingServiceEnabled(): boolean;
    private disconnectAllClients;
    getPlayerIdMap(playerId: number): {
        pixelTwinId: string;
        pixelTwinInstanceId: string;
    } | undefined;
    getPixelTwinMap(): Map<string, any>;
    getPixelTwinGpuConfig(isMaster?: boolean): HostNode[] | HostNode | undefined;
    updatePixelTwinGpuConfig(gpuConfigData: HostNode): void;
    treeKillProcess(instance: any): void;
    findFreeServerAndGPU(pixelTwinId: string): {
        ip: string;
        graphicsAdapter: number;
        slaveClient: any;
    } | null;
    handleSlaveConfig(slaveConfigData: {
        ip: string;
        gpu: {
            graphicsAdapter: number;
            gpuMemory: number;
        }[];
        slaveList: {
            pixelTwinId: string;
            pixelTwinStartPath: string;
        }[];
    }, client: any): void;
    handleSlaveDisconnect(): void;
    renegotiateSDP(playerId: number): void;
}

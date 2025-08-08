import { ConfigService } from '@nestjs/config';
export declare class PixelTwinSlaveService {
    private configService;
    private slaveGpuConfig;
    private slaveList;
    private slaveInstanceList;
    private wsClient;
    private isConnected;
    private isReconnecting;
    private reconnectTimer;
    private readonly reconnectInterval;
    constructor(configService: ConfigService);
    initSlave(): Promise<void>;
    private connectToMaster;
    private scheduleReconnect;
    private clearReconnectTimer;
    private handleMessage;
    private sendMessageToMaster;
    private toRunPixelTwin;
    private toKillPixelTwin;
}

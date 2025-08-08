import { Server } from 'ws';
import { PixelTwinService } from './pixel-twin.service';
export declare class PixelTwinMasterGateway {
    private pixelTwinService;
    server: Server;
    constructor(pixelTwinService: PixelTwinService);
    afterInit(server: Server): void;
    handleConnection(client: any, ...args: any[]): void;
    handleDisconnect(client: any): void;
    handleClose(client: any): void;
    handleError(): void;
    handleSlaveStatusReport(client: any, data: any): void;
}

import { Server } from 'ws';
import { PixelTwinService } from './pixel-twin.service';
export declare class PixelTwinUEGateway {
    private pixelTwinService;
    server: Server;
    constructor(pixelTwinService: PixelTwinService);
    afterInit(server: Server): void;
    handleConnection(client: any, ...args: any[]): void;
    handleDisconnect(client: any): void;
    handleClose(client: any, code: any, reason: any): void;
    handleError(client: any, error: any): void;
    handleWebRTCOffer(client: any, data: any): void;
    handleWebRTCIceCandidate(client: any, data: any): void;
}

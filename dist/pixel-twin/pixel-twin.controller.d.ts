import { PixelTwinService } from './pixel-twin.service';
export declare class PixelTwinController {
    private readonly pixelTwinService;
    constructor(pixelTwinService: PixelTwinService);
    toggleSignalling(body: {
        enable: boolean;
    }): Promise<{
        state: boolean;
    }>;
    getSignallingStatus(): Promise<{
        state: boolean;
    }>;
}

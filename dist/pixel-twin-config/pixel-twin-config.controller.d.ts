import { PixelTwinConfigService } from './pixel-twin-config.service';
export declare class PixelTwinConfigController {
    private readonly pixelTwinConfigService;
    constructor(pixelTwinConfigService: PixelTwinConfigService);
    getConfig(): Promise<unknown>;
    writeConfig(configData: unknown): Promise<{
        state: boolean;
    }>;
    getGpuConfig(): Promise<import("../types/pixel-twin.type").HostNode | undefined>;
    writeGpuConfig(gpuConfigData: unknown): Promise<{
        state: boolean;
    }>;
}

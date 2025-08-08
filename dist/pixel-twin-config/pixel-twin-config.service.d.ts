import { PixelTwinService } from '../pixel-twin/pixel-twin.service';
import { HostNode } from 'src/types/pixel-twin.type';
export declare class PixelTwinConfigService {
    private readonly pixelTwinService;
    constructor(pixelTwinService: PixelTwinService);
    getConfig(configPath: string): Promise<unknown | null>;
    writeConfig(configPath: string, configData: unknown): Promise<{
        state: boolean;
    }>;
    getGpuConfigFromMemory(): HostNode | undefined;
    writeGpuConfigAndUpdateMemory(gpuConfigData: unknown): Promise<{
        state: boolean;
    }>;
}

import { PixelTwinService } from '../pixel-twin/pixel-twin.service';
export declare class PixelTwinInstanceService {
    private readonly pixelTwinService;
    constructor(pixelTwinService: PixelTwinService);
    getAllPixelTwinProjects(): {
        list: Array<{
            pixelTwinId: string;
            pixelTwinName: string;
        }>;
    };
    getPixelTwinInstances(pixelTwinId: string, page?: number, pageSize?: number): {
        list: Array<any>;
        total: number;
    };
    destroyPixelTwinInstance(pixelTwinId: string, instanceId: string): Promise<Boolean>;
}

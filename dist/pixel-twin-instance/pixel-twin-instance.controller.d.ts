import { PixelTwinInstanceService } from './pixel-twin-instance.service';
export declare class PixelTwinInstanceController {
    private readonly pixelTwinInstanceService;
    constructor(pixelTwinInstanceService: PixelTwinInstanceService);
    getAllPixelTwinProjects(): Promise<{
        list: Array<{
            pixelTwinId: string;
            pixelTwinName: string;
        }>;
    }>;
    getPixelTwinInstances(body: {
        pixelTwinId: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        list: Array<any>;
        total: number;
    }>;
    destroyPixelTwinInstance(body: {
        pixelTwinId: string;
        instanceId: string;
    }): Promise<Boolean>;
}

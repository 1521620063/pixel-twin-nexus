import { PixelTwinService } from '../pixel-twin/pixel-twin.service';
export declare class PixelTwinProjectService {
    private readonly pixelTwinService;
    constructor(pixelTwinService: PixelTwinService);
    getPixelTwinList(page?: number, pageSize?: number, search?: string): Promise<object>;
    addPixelTwin(projectData: any): Promise<{
        state: boolean;
    }>;
    updatePixelTwin(body: any): Promise<{
        state: boolean;
    }>;
    deletePixelTwin(pixelTwinId: string): Promise<{
        state: boolean;
    }>;
}

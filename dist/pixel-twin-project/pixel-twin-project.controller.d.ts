import { PixelTwinProjectService } from './pixel-twin-project.service';
export declare class PixelTwinProjectController {
    private readonly pixelTwinProjectService;
    constructor(pixelTwinProjectService: PixelTwinProjectService);
    getProjectList(body: any): Promise<object>;
    addProject(projectData: any): Promise<any>;
    editProject(body: any): Promise<any>;
    deleteProject(pixelTwinId: string): Promise<any>;
}

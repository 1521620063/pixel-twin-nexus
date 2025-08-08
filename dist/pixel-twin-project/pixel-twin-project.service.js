"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTwinProjectService = void 0;
const common_1 = require("@nestjs/common");
const commonEnum_1 = require("../commonEnum");
const pixel_twin_service_1 = require("../pixel-twin/pixel-twin.service");
const utils_1 = require("../utils");
const paths_constants_1 = require("../constants/paths.constants");
let PixelTwinProjectService = class PixelTwinProjectService {
    pixelTwinService;
    constructor(pixelTwinService) {
        this.pixelTwinService = pixelTwinService;
    }
    async getPixelTwinList(page = 1, pageSize = 10, search) {
        const pixelTwinMap = this.pixelTwinService.getPixelTwinMap();
        let list = [];
        for (const [_, value] of pixelTwinMap) {
            const { pixelTwinInstance, ...item } = value;
            list.push({ ...item, gpuList: [] });
        }
        list = list.filter((v) => v.pixelTwinName?.includes(search));
        const total = list.length;
        list = list.slice((page - 1) * pageSize, page * pageSize);
        let gpuList = this.pixelTwinService.getPixelTwinGpuConfig();
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < (Array.isArray(gpuList) ? gpuList.length : 0); j++) {
                if (gpuList[j].slaveList?.find((v) => v.pixelTwinId === list[i].pixelTwinId)) {
                    list[i].gpuList.push(gpuList[j].ip);
                }
            }
        }
        return {
            total,
            list,
        };
    }
    async addPixelTwin(projectData) {
        const pixelTwinList = ((await utils_1.JsonUtil.readJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_LIST) || []));
        const existingProject = pixelTwinList.find((item) => item.pixelTwinId === projectData.pixelTwinId);
        if (existingProject) {
            throw new common_1.HttpException({ errorMessage: commonEnum_1.ExceptionCodeMap[1004], code: 1004 }, common_1.HttpStatus.OK);
        }
        projectData.pixelTwinInstance = [];
        pixelTwinList.push(projectData);
        await utils_1.JsonUtil.writeJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_LIST, pixelTwinList);
        const pixelTwinMap = this.pixelTwinService.getPixelTwinMap();
        pixelTwinMap.set(projectData.pixelTwinId, projectData);
        return {
            state: true
        };
    }
    async updatePixelTwin(body) {
        const { pixelTwinId, serviceEnable } = body;
        const pixelTwinList = ((await utils_1.JsonUtil.readJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_LIST) || []));
        const index = pixelTwinList.findIndex((item) => item.pixelTwinId === pixelTwinId);
        pixelTwinList[index] = body;
        await utils_1.JsonUtil.writeJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_LIST, pixelTwinList);
        const pixelTwinMap = this.pixelTwinService.getPixelTwinMap();
        const pixelTwinInstance = pixelTwinMap.get(pixelTwinId).pixelTwinInstance;
        if (serviceEnable === false &&
            pixelTwinInstance &&
            pixelTwinInstance.length > 0) {
            pixelTwinInstance.forEach((instance) => {
                try {
                    if (instance.playerClient &&
                        instance.playerClient.readyState === 1) {
                        instance.playerClient.close();
                    }
                    if (instance.UEClient && instance.UEClient.readyState === 1) {
                        instance.UEClient.close();
                    }
                    this.pixelTwinService.treeKillProcess(instance);
                }
                catch (error) {
                    console.error('清理实例时发生错误:', error);
                }
            });
            pixelTwinInstance.length = 0;
        }
        pixelTwinMap.set(pixelTwinId, body);
        return {
            state: true
        };
    }
    async deletePixelTwin(pixelTwinId) {
        const pixelTwinList = ((await utils_1.JsonUtil.readJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_LIST)) || []);
        const index = pixelTwinList.findIndex((item) => item.pixelTwinId === pixelTwinId);
        pixelTwinList.splice(index, 1);
        await utils_1.JsonUtil.writeJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_LIST, pixelTwinList);
        const pixelTwinMap = this.pixelTwinService.getPixelTwinMap();
        const project = pixelTwinMap.get(pixelTwinId);
        if (project &&
            project.pixelTwinInstance &&
            project.pixelTwinInstance.length > 0) {
            project.pixelTwinInstance.forEach((instance) => {
                try {
                    if (instance.playerClient &&
                        instance.playerClient.readyState === 1) {
                        instance.playerClient.close();
                    }
                    if (instance.UEClient && instance.UEClient.readyState === 1) {
                        instance.UEClient.close();
                    }
                    this.pixelTwinService.treeKillProcess(instance);
                }
                catch (error) {
                    console.error('清理实例时发生错误:', error);
                }
            });
        }
        pixelTwinMap.delete(pixelTwinId);
        return { state: true };
    }
};
exports.PixelTwinProjectService = PixelTwinProjectService;
exports.PixelTwinProjectService = PixelTwinProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pixel_twin_service_1.PixelTwinService])
], PixelTwinProjectService);
//# sourceMappingURL=pixel-twin-project.service.js.map
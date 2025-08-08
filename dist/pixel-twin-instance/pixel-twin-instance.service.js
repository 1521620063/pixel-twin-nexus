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
exports.PixelTwinInstanceService = void 0;
const common_1 = require("@nestjs/common");
const pixel_twin_service_1 = require("../pixel-twin/pixel-twin.service");
const commonEnum_1 = require("../commonEnum");
let PixelTwinInstanceService = class PixelTwinInstanceService {
    pixelTwinService;
    constructor(pixelTwinService) {
        this.pixelTwinService = pixelTwinService;
    }
    getAllPixelTwinProjects() {
        const pixelTwinMap = this.pixelTwinService.getPixelTwinMap();
        const projects = [];
        pixelTwinMap.forEach((value, key) => {
            projects.push({
                pixelTwinId: key,
                pixelTwinName: value.pixelTwinName || key,
            });
        });
        return {
            list: projects,
        };
    }
    getPixelTwinInstances(pixelTwinId, page = 1, pageSize = 10) {
        const pixelTwinMap = this.pixelTwinService.getPixelTwinMap();
        let allInstances = [];
        if (!pixelTwinId || pixelTwinId.trim() === '') {
            pixelTwinMap.forEach((pixelTwinInfo, key) => {
                const instances = pixelTwinInfo.pixelTwinInstance || [];
                const instancesWithProject = instances.map((instance) => ({
                    ...instance,
                    pixelTwinId: key,
                    pixelTwinName: pixelTwinInfo.pixelTwinName || key
                }));
                allInstances = allInstances.concat(instancesWithProject);
            });
        }
        else {
            const pixelTwinInfo = pixelTwinMap.get(pixelTwinId);
            if (pixelTwinInfo) {
                allInstances = pixelTwinInfo.pixelTwinInstance || [];
            }
        }
        const total = allInstances.length;
        const paginatedInstances = allInstances.slice((page - 1) * pageSize, page * pageSize);
        const filteredInstances = paginatedInstances.map((instance) => {
            const { playerClient, UEClient, UEProcess, ...safeInstance } = instance;
            return { ...safeInstance };
        });
        return {
            list: filteredInstances,
            total
        };
    }
    async destroyPixelTwinInstance(pixelTwinId, instanceId) {
        const pixelTwinMap = this.pixelTwinService.getPixelTwinMap();
        const pixelTwinInfo = pixelTwinMap.get(pixelTwinId);
        const instances = pixelTwinInfo.pixelTwinInstance || [];
        const instanceIndex = instances.findIndex((instance) => instance.id === instanceId);
        const instance = instances[instanceIndex];
        try {
            if (instance.playerClient && instance.playerClient.readyState === 1) {
                instance.playerClient.close();
            }
            if (instance.UEClient && instance.UEClient.readyState === 1) {
                instance.UEClient.close();
            }
            this.pixelTwinService.treeKillProcess(instance);
            if (instance.playerId) {
                const playerIdMap = this.pixelTwinService.pixelTwinIPlayerIdMap;
                if (playerIdMap) {
                    playerIdMap.delete(instance.playerId);
                }
            }
            instances.splice(instanceIndex, 1);
            return true;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: commonEnum_1.ExceptionCodeMap[1005], code: 1005 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PixelTwinInstanceService = PixelTwinInstanceService;
exports.PixelTwinInstanceService = PixelTwinInstanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pixel_twin_service_1.PixelTwinService])
], PixelTwinInstanceService);
//# sourceMappingURL=pixel-twin-instance.service.js.map
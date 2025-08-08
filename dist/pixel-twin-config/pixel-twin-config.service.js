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
exports.PixelTwinConfigService = void 0;
const common_1 = require("@nestjs/common");
const pixel_twin_service_1 = require("../pixel-twin/pixel-twin.service");
const utils_1 = require("../utils");
const paths_constants_1 = require("../constants/paths.constants");
let PixelTwinConfigService = class PixelTwinConfigService {
    pixelTwinService;
    constructor(pixelTwinService) {
        this.pixelTwinService = pixelTwinService;
    }
    async getConfig(configPath) {
        try {
            return await utils_1.JsonUtil.readJsonData(configPath);
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: `读取配置文件失败: ${error.message}`, code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async writeConfig(configPath, configData) {
        try {
            await utils_1.JsonUtil.writeJsonData(configPath, configData);
            return {
                state: true
            };
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: `写入配置文件失败: ${error.message}`, code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getGpuConfigFromMemory() {
        try {
            return this.pixelTwinService.getPixelTwinGpuConfig(true);
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: `获取GPU配置失败: ${error.message}`, code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async writeGpuConfigAndUpdateMemory(gpuConfigData) {
        try {
            await utils_1.JsonUtil.writeJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_MASTER_GPU, gpuConfigData);
            this.pixelTwinService.updatePixelTwinGpuConfig(gpuConfigData);
            return {
                state: true
            };
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: `写入GPU配置失败: ${error.message}`, code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PixelTwinConfigService = PixelTwinConfigService;
exports.PixelTwinConfigService = PixelTwinConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pixel_twin_service_1.PixelTwinService])
], PixelTwinConfigService);
//# sourceMappingURL=pixel-twin-config.service.js.map
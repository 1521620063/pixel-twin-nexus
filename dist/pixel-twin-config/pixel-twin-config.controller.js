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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTwinConfigController = void 0;
const common_1 = require("@nestjs/common");
const commonEnum_1 = require("../commonEnum");
const pixel_twin_config_service_1 = require("./pixel-twin-config.service");
const auth_guard_1 = require("../auth/auth.guard");
const paths_constants_1 = require("../constants/paths.constants");
let PixelTwinConfigController = class PixelTwinConfigController {
    pixelTwinConfigService;
    constructor(pixelTwinConfigService) {
        this.pixelTwinConfigService = pixelTwinConfigService;
    }
    async getConfig() {
        try {
            const configData = await this.pixelTwinConfigService.getConfig(paths_constants_1.JSON_PATHS.PIXEL_TWIN_CONFIG);
            return configData;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '读取配置文件失败', code: commonEnum_1.ExceptionCodeMap[1002] || 1002 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async writeConfig(configData) {
        try {
            return await this.pixelTwinConfigService.writeConfig(paths_constants_1.JSON_PATHS.PIXEL_TWIN_CONFIG, configData);
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '写入配置文件失败', code: commonEnum_1.ExceptionCodeMap[1003] || 1003 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getGpuConfig() {
        try {
            return this.pixelTwinConfigService.getGpuConfigFromMemory();
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '读取GPU配置失败', code: commonEnum_1.ExceptionCodeMap[1004] || 1004 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async writeGpuConfig(gpuConfigData) {
        try {
            return await this.pixelTwinConfigService.writeGpuConfigAndUpdateMemory(gpuConfigData);
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '写入GPU配置失败', code: commonEnum_1.ExceptionCodeMap[1005] || 1005 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PixelTwinConfigController = PixelTwinConfigController;
__decorate([
    (0, common_1.Post)('config/read'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PixelTwinConfigController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Post)('config/write'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PixelTwinConfigController.prototype, "writeConfig", null);
__decorate([
    (0, common_1.Post)('config/gpu-read'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PixelTwinConfigController.prototype, "getGpuConfig", null);
__decorate([
    (0, common_1.Post)('config/gpu-write'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PixelTwinConfigController.prototype, "writeGpuConfig", null);
exports.PixelTwinConfigController = PixelTwinConfigController = __decorate([
    (0, common_1.Controller)('pixel-twin'),
    __metadata("design:paramtypes", [pixel_twin_config_service_1.PixelTwinConfigService])
], PixelTwinConfigController);
//# sourceMappingURL=pixel-twin-config.controller.js.map
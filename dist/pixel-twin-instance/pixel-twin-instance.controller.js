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
exports.PixelTwinInstanceController = void 0;
const common_1 = require("@nestjs/common");
const pixel_twin_instance_service_1 = require("./pixel-twin-instance.service");
const auth_guard_1 = require("../auth/auth.guard");
let PixelTwinInstanceController = class PixelTwinInstanceController {
    pixelTwinInstanceService;
    constructor(pixelTwinInstanceService) {
        this.pixelTwinInstanceService = pixelTwinInstanceService;
    }
    async getAllPixelTwinProjects() {
        try {
            const result = this.pixelTwinInstanceService.getAllPixelTwinProjects();
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '获取项目列表失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPixelTwinInstances(body) {
        try {
            const { pixelTwinId, page = 1, pageSize = 10 } = body;
            const result = this.pixelTwinInstanceService.getPixelTwinInstances(pixelTwinId, page, pageSize);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '获取实例列表失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async destroyPixelTwinInstance(body) {
        try {
            const { pixelTwinId, instanceId } = body;
            const result = await this.pixelTwinInstanceService.destroyPixelTwinInstance(pixelTwinId, instanceId);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '销毁实例失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PixelTwinInstanceController = PixelTwinInstanceController;
__decorate([
    (0, common_1.Post)('instance/types'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PixelTwinInstanceController.prototype, "getAllPixelTwinProjects", null);
__decorate([
    (0, common_1.Post)('instance/list'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PixelTwinInstanceController.prototype, "getPixelTwinInstances", null);
__decorate([
    (0, common_1.Post)('instance/destroy'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PixelTwinInstanceController.prototype, "destroyPixelTwinInstance", null);
exports.PixelTwinInstanceController = PixelTwinInstanceController = __decorate([
    (0, common_1.Controller)('pixel-twin'),
    __metadata("design:paramtypes", [pixel_twin_instance_service_1.PixelTwinInstanceService])
], PixelTwinInstanceController);
//# sourceMappingURL=pixel-twin-instance.controller.js.map
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
exports.PixelTwinController = void 0;
const common_1 = require("@nestjs/common");
const pixel_twin_service_1 = require("./pixel-twin.service");
const auth_guard_1 = require("../auth/auth.guard");
let PixelTwinController = class PixelTwinController {
    pixelTwinService;
    constructor(pixelTwinService) {
        this.pixelTwinService = pixelTwinService;
    }
    async toggleSignalling(body) {
        try {
            const result = body.enable
                ? this.pixelTwinService.enableSignalling()
                : this.pixelTwinService.disableSignalling();
            return {
                state: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '信令服务状态切换失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSignallingStatus() {
        try {
            const enabled = this.pixelTwinService.getSignallingStatus();
            return {
                state: enabled,
            };
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '获取信令服务状态失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PixelTwinController = PixelTwinController;
__decorate([
    (0, common_1.Post)('signal/toggle'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PixelTwinController.prototype, "toggleSignalling", null);
__decorate([
    (0, common_1.Post)('signal/status'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PixelTwinController.prototype, "getSignallingStatus", null);
exports.PixelTwinController = PixelTwinController = __decorate([
    (0, common_1.Controller)('pixel-twin'),
    __metadata("design:paramtypes", [pixel_twin_service_1.PixelTwinService])
], PixelTwinController);
//# sourceMappingURL=pixel-twin.controller.js.map
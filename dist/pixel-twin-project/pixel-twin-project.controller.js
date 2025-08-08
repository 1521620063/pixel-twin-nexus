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
exports.PixelTwinProjectController = void 0;
const common_1 = require("@nestjs/common");
const pixel_twin_project_service_1 = require("./pixel-twin-project.service");
const auth_guard_1 = require("../auth/auth.guard");
let PixelTwinProjectController = class PixelTwinProjectController {
    pixelTwinProjectService;
    constructor(pixelTwinProjectService) {
        this.pixelTwinProjectService = pixelTwinProjectService;
    }
    async getProjectList(body) {
        try {
            const { page = 1, pageSize = 10, search } = body;
            const result = await this.pixelTwinProjectService.getPixelTwinList(page, pageSize, search);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '获取项目列表失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addProject(projectData) {
        try {
            const result = await this.pixelTwinProjectService.addPixelTwin(projectData);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '添加项目失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async editProject(body) {
        try {
            const result = await this.pixelTwinProjectService.updatePixelTwin(body);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '编辑项目失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteProject(pixelTwinId) {
        try {
            const result = await this.pixelTwinProjectService.deletePixelTwin(pixelTwinId);
            return result;
        }
        catch (error) {
            throw new common_1.HttpException({ errorMessage: '删除项目失败', code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PixelTwinProjectController = PixelTwinProjectController;
__decorate([
    (0, common_1.Post)('project/list'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PixelTwinProjectController.prototype, "getProjectList", null);
__decorate([
    (0, common_1.Post)('project/add'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PixelTwinProjectController.prototype, "addProject", null);
__decorate([
    (0, common_1.Post)('project/edit'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PixelTwinProjectController.prototype, "editProject", null);
__decorate([
    (0, common_1.Post)('project/delete'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)('pixelTwinId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PixelTwinProjectController.prototype, "deleteProject", null);
exports.PixelTwinProjectController = PixelTwinProjectController = __decorate([
    (0, common_1.Controller)('pixel-twin'),
    __metadata("design:paramtypes", [pixel_twin_project_service_1.PixelTwinProjectService])
], PixelTwinProjectController);
//# sourceMappingURL=pixel-twin-project.controller.js.map
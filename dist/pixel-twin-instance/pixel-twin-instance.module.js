"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTwinInstanceModule = void 0;
const common_1 = require("@nestjs/common");
const pixel_twin_instance_controller_1 = require("./pixel-twin-instance.controller");
const pixel_twin_instance_service_1 = require("./pixel-twin-instance.service");
const pixel_twin_module_1 = require("../pixel-twin/pixel-twin.module");
let PixelTwinInstanceModule = class PixelTwinInstanceModule {
};
exports.PixelTwinInstanceModule = PixelTwinInstanceModule;
exports.PixelTwinInstanceModule = PixelTwinInstanceModule = __decorate([
    (0, common_1.Module)({
        imports: [pixel_twin_module_1.PixelTwinModule],
        controllers: [pixel_twin_instance_controller_1.PixelTwinInstanceController],
        providers: [pixel_twin_instance_service_1.PixelTwinInstanceService],
        exports: [pixel_twin_instance_service_1.PixelTwinInstanceService],
    })
], PixelTwinInstanceModule);
//# sourceMappingURL=pixel-twin-instance.module.js.map
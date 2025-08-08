"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTwinConfigModule = void 0;
const common_1 = require("@nestjs/common");
const pixel_twin_config_controller_1 = require("./pixel-twin-config.controller");
const pixel_twin_config_service_1 = require("./pixel-twin-config.service");
const pixel_twin_module_1 = require("../pixel-twin/pixel-twin.module");
let PixelTwinConfigModule = class PixelTwinConfigModule {
};
exports.PixelTwinConfigModule = PixelTwinConfigModule;
exports.PixelTwinConfigModule = PixelTwinConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [pixel_twin_module_1.PixelTwinModule],
        controllers: [pixel_twin_config_controller_1.PixelTwinConfigController],
        providers: [pixel_twin_config_service_1.PixelTwinConfigService],
        exports: [pixel_twin_config_service_1.PixelTwinConfigService],
    })
], PixelTwinConfigModule);
//# sourceMappingURL=pixel-twin-config.module.js.map
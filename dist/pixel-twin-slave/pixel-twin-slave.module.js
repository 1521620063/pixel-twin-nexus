"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTwinSlaveModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pixel_twin_slave_controller_1 = require("./pixel-twin-slave.controller");
const pixel_twin_slave_service_1 = require("./pixel-twin-slave.service");
let PixelTwinSlaveModule = class PixelTwinSlaveModule {
};
exports.PixelTwinSlaveModule = PixelTwinSlaveModule;
exports.PixelTwinSlaveModule = PixelTwinSlaveModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
        ],
        controllers: [
            pixel_twin_slave_controller_1.PixelTwinSlaveController,
        ],
        providers: [
            pixel_twin_slave_service_1.PixelTwinSlaveService,
        ],
        exports: [
            pixel_twin_slave_service_1.PixelTwinSlaveService,
        ],
    })
], PixelTwinSlaveModule);
//# sourceMappingURL=pixel-twin-slave.module.js.map
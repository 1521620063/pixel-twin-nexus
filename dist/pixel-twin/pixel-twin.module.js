"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTwinModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pixel_twin_controller_1 = require("./pixel-twin.controller");
const pixel_twin_service_1 = require("./pixel-twin.service");
const pixel_twin_player_gateway_1 = require("./pixel-twin-player.gateway");
const pixel_twin_ue_gateway_1 = require("./pixel-twin-ue.gateway");
const pixel_twin_master_gateway_1 = require("./pixel-twin-master.gateway");
let PixelTwinModule = class PixelTwinModule {
};
exports.PixelTwinModule = PixelTwinModule;
exports.PixelTwinModule = PixelTwinModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
        ],
        controllers: [
            pixel_twin_controller_1.PixelTwinController,
        ],
        providers: [
            pixel_twin_service_1.PixelTwinService,
            pixel_twin_player_gateway_1.PixelTwinPlayerGateway,
            pixel_twin_ue_gateway_1.PixelTwinUEGateway,
            pixel_twin_master_gateway_1.PixelTwinMasterGateway,
        ],
        exports: [
            pixel_twin_service_1.PixelTwinService,
        ],
    })
], PixelTwinModule);
//# sourceMappingURL=pixel-twin.module.js.map
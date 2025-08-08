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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTwinMasterGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const pixel_twin_service_1 = require("./pixel-twin.service");
const wsInterceptors_1 = require("../interceptors/wsInterceptors");
const common_1 = require("@nestjs/common");
let PixelTwinMasterGateway = class PixelTwinMasterGateway {
    pixelTwinService;
    server;
    constructor(pixelTwinService) {
        this.pixelTwinService = pixelTwinService;
    }
    afterInit(server) {
    }
    handleConnection(client, ...args) {
        console.log('Slave node attempting to connect:');
    }
    handleDisconnect(client) {
        console.log('Slave node disconnected');
        this.pixelTwinService.handleSlaveDisconnect();
    }
    handleClose(client) {
        this.pixelTwinService.handleSlaveDisconnect();
    }
    handleError() {
        this.pixelTwinService.handleSlaveDisconnect();
    }
    handleSlaveStatusReport(client, data) {
        this.pixelTwinService.handleSlaveConfig(data.data, client);
    }
};
exports.PixelTwinMasterGateway = PixelTwinMasterGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], PixelTwinMasterGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('slaveConfig'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PixelTwinMasterGateway.prototype, "handleSlaveStatusReport", null);
exports.PixelTwinMasterGateway = PixelTwinMasterGateway = __decorate([
    (0, common_1.UseInterceptors)(wsInterceptors_1.WsInterceptor),
    (0, websockets_1.WebSocketGateway)({
        path: '/pixel-twin-master',
        cors: {
            origin: '*',
        },
        perMessageDeflate: true,
    }),
    __metadata("design:paramtypes", [pixel_twin_service_1.PixelTwinService])
], PixelTwinMasterGateway);
//# sourceMappingURL=pixel-twin-master.gateway.js.map
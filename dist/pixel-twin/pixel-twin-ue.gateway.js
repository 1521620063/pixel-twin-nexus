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
exports.PixelTwinUEGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const pixel_twin_service_1 = require("./pixel-twin.service");
let PixelTwinUEGateway = class PixelTwinUEGateway {
    pixelTwinService;
    server;
    constructor(pixelTwinService) {
        this.pixelTwinService = pixelTwinService;
    }
    afterInit(server) {
    }
    handleConnection(client, ...args) {
        if (!this.pixelTwinService.isSignallingServiceEnabled()) {
            client.close(1013, 'WebSocket service is disabled');
            return;
        }
        this.pixelTwinService.registerUEClient(client, args[0]);
    }
    handleDisconnect(client) {
    }
    handleClose(client, code, reason) {
    }
    handleError(client, error) {
    }
    handleWebRTCOffer(client, data) {
        this.pixelTwinService.sendMessageToPlayer(data.playerId, {
            event: 'offer',
            data,
        });
    }
    handleWebRTCIceCandidate(client, data) {
        this.pixelTwinService.sendMessageToPlayer(data.playerId, {
            event: 'iceCandidate',
            data,
        });
    }
};
exports.PixelTwinUEGateway = PixelTwinUEGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], PixelTwinUEGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('offer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PixelTwinUEGateway.prototype, "handleWebRTCOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('iceCandidate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PixelTwinUEGateway.prototype, "handleWebRTCIceCandidate", null);
exports.PixelTwinUEGateway = PixelTwinUEGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        path: '/pixel-twin-ue',
        cors: {
            origin: '*',
        },
        perMessageDeflate: true,
    }),
    __metadata("design:paramtypes", [pixel_twin_service_1.PixelTwinService])
], PixelTwinUEGateway);
//# sourceMappingURL=pixel-twin-ue.gateway.js.map
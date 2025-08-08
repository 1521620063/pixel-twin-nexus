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
exports.PixelTwinPlayerGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const pixel_twin_service_1 = require("./pixel-twin.service");
const wsInterceptors_1 = require("../interceptors/wsInterceptors");
const common_1 = require("@nestjs/common");
let PixelTwinPlayerGateway = class PixelTwinPlayerGateway {
    pixelTwinService;
    server;
    constructor(pixelTwinService) {
        this.pixelTwinService = pixelTwinService;
    }
    afterInit(server) {
    }
    handleConnection(client, ...args) {
        const request = args[0];
        this.pixelTwinService.toRunPixelTwin(client, request.url, request);
    }
    handleDisconnect(client) {
        this.pixelTwinService.handlePlayerDisconnect();
    }
    handleClose(client, code, reason) {
        this.pixelTwinService.handlePlayerDisconnect();
    }
    handleError(client, error) {
        this.pixelTwinService.handlePlayerDisconnect();
    }
    handlePlayerAnswer(client, data) {
        this.pixelTwinService.sendMessageToUE(data.data.playerId, {
            ...data.data.answer,
            playerId: data.data.playerId,
        });
    }
    handlePlayerIceCandidate(client, data) {
        this.pixelTwinService.sendMessageToUE(data.data.playerId, {
            type: 'iceCandidate',
            candidate: data.data.candidate,
            playerId: data.data.playerId,
        });
    }
    handleRenegotiateSDP(client, data) {
        this.pixelTwinService.renegotiateSDP(data.data.playerId);
    }
};
exports.PixelTwinPlayerGateway = PixelTwinPlayerGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
], PixelTwinPlayerGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('answer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PixelTwinPlayerGateway.prototype, "handlePlayerAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('iceCandidate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PixelTwinPlayerGateway.prototype, "handlePlayerIceCandidate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('renegotiateSDP'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PixelTwinPlayerGateway.prototype, "handleRenegotiateSDP", null);
exports.PixelTwinPlayerGateway = PixelTwinPlayerGateway = __decorate([
    (0, common_1.UseInterceptors)(wsInterceptors_1.WsInterceptor),
    (0, websockets_1.WebSocketGateway)({
        path: '/pixel-twin-player',
        cors: {
            origin: '*',
        },
        perMessageDeflate: true,
    }),
    __metadata("design:paramtypes", [pixel_twin_service_1.PixelTwinService])
], PixelTwinPlayerGateway);
//# sourceMappingURL=pixel-twin-player.gateway.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const encryption_1 = require("../encryption");
let WsInterceptor = class WsInterceptor {
    intercept(context, next) {
        const wsContext = context.switchToWs();
        const client = wsContext.getClient();
        const data = wsContext.getData();
        if (data?.data?.pixel_twin_params) {
            const [ciphertext, key, iv] = data.data.pixel_twin_params;
            let [decryptText] = (0, encryption_1.Decrypt)(key, iv, ciphertext);
            data.data = JSON.parse(decryptText);
        }
        return next.handle().pipe((0, operators_1.map)((responseData) => {
            return responseData;
        }));
    }
};
exports.WsInterceptor = WsInterceptor;
exports.WsInterceptor = WsInterceptor = __decorate([
    (0, common_1.Injectable)()
], WsInterceptor);
//# sourceMappingURL=wsInterceptors.js.map
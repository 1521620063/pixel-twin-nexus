"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const commonEnum_1 = require("../commonEnum");
const encryption_1 = require("../encryption");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request.body?.pixel_twin_params) {
            const [ciphertext, timestamp, key, iv] = request.body?.pixel_twin_params;
            let [decryptText, t] = (0, encryption_1.Decrypt)(key, iv, ciphertext, timestamp);
            const clientTimestamp = parseInt(t);
            const currentTimestamp = Date.now();
            const timeDiff = Math.abs(currentTimestamp - clientTimestamp);
            if (timeDiff > 60000) {
                throw new common_1.HttpException({ errorMessage: commonEnum_1.ExceptionCodeMap[1006], code: 1006 }, common_1.HttpStatus.OK);
            }
            request.body = JSON.parse(decryptText);
        }
        return next.handle().pipe((0, operators_1.map)((data) => {
            const responseData = {
                pixel_twin_params: (0, encryption_1.Encrypt)(JSON.stringify(data), Date.now().toString())
            };
            return {
                data: responseData,
                code: 200,
                message: 'success',
            };
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=httpInterceptors.js.map
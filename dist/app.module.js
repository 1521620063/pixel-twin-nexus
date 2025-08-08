"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const serve_static_1 = require("@nestjs/serve-static");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const config_1 = require("@nestjs/config");
const pixel_twin_module_1 = require("./pixel-twin/pixel-twin.module");
const pixel_twin_config_module_1 = require("./pixel-twin-config/pixel-twin-config.module");
const pixel_twin_instance_module_1 = require("./pixel-twin-instance/pixel-twin-instance.module");
const pixel_twin_project_module_1 = require("./pixel-twin-project/pixel-twin-project.module");
const pixel_twin_slave_module_1 = require("./pixel-twin-slave/pixel-twin-slave.module");
let AppModule = AppModule_1 = class AppModule {
    static forRoot() {
        const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.master';
        console.info('[AppModule] NODE_ENV:', process.env.NODE_ENV);
        const baseImports = [
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
            }),
            config_1.ConfigModule.forRoot({
                envFilePath: [envFile],
                isGlobal: true,
            }),
        ];
        const conditionalImports = [];
        if (process.env.NODE_ENV === 'master') {
            conditionalImports.push(serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'client/pixel-twin-nexus-web/dist'),
                exclude: ['/api/*'],
                serveStaticOptions: {
                    fallthrough: false,
                },
            }), auth_module_1.AuthModule, users_module_1.UsersModule, pixel_twin_module_1.PixelTwinModule, pixel_twin_config_module_1.PixelTwinConfigModule, pixel_twin_instance_module_1.PixelTwinInstanceModule, pixel_twin_project_module_1.PixelTwinProjectModule);
        }
        else if (process.env.NODE_ENV === 'slave') {
            conditionalImports.push(pixel_twin_slave_module_1.PixelTwinSlaveModule);
        }
        return {
            module: AppModule_1,
            imports: [...baseImports, ...conditionalImports],
            providers: [
                {
                    provide: core_1.APP_GUARD,
                    useClass: throttler_1.ThrottlerGuard,
                },
            ],
        };
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({})
], AppModule);
//# sourceMappingURL=app.module.js.map
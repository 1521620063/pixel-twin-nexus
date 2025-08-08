"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const helmet_1 = require("helmet");
const httpInterceptors_1 = require("./interceptors/httpInterceptors");
const http_exception_filter_1 = require("./http-exception.filter");
const validation_pipe_1 = require("./pipe/validation.pipe");
const compression = require("compression");
const platform_ws_1 = require("@nestjs/platform-ws");
const RSA_1 = require("./encryption/RSA");
let rsaKeyPair = (0, RSA_1.generateRSAKeyPair)();
console.info(rsaKeyPair.publicKey.replace(/\n/g, ''));
console.info(rsaKeyPair.privateKey.replace(/\n/g, ''));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule.forRoot());
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app, {
        messageParser: (data) => {
            const { type, event, ...args } = JSON.parse(data.toString());
            return { event: type || event, data: args };
        },
    }));
    app.setGlobalPrefix('/api');
    app.use(cookieParser());
    const helmetConfig = {
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
        crossOriginOpenerPolicy: false,
        strictTransportSecurity: false,
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        xFrameOptions: { action: "sameorigin" },
        xContentTypeOptions: true,
        xDnsPrefetchControl: { allow: false },
        xDownloadOptions: true,
        xPermittedCrossDomainPolicies: { permittedPolicies: "none" },
        originAgentCluster: false,
        hidePoweredBy: true,
    };
    app.use((0, helmet_1.default)(helmetConfig));
    app.use(compression());
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalInterceptors(new httpInterceptors_1.TransformInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    await app.listen(process.env.PORT ?? 3000, process.env.HOST_NAME || '0.0.0.0');
    console.log(`应用程序启动成功，监听端口：${process.env.PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
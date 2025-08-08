"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUtil = void 0;
class ClientUtil {
    static extractClientInfo(request) {
        let clientIP = '';
        if (request.headers['x-forwarded-for']) {
            clientIP = request.headers['x-forwarded-for'].split(',')[0].trim();
        }
        else if (request.headers['x-real-ip']) {
            clientIP = request.headers['x-real-ip'];
        }
        else if (request.socket && request.socket.remoteAddress) {
            clientIP = request.socket.remoteAddress;
        }
        else {
            clientIP = 'unknown';
        }
        const clientInfo = {
            ip: clientIP,
            userAgent: request.headers['user-agent'] || 'unknown',
            origin: request.headers['origin'] || 'unknown',
            host: request.headers['host'] || 'unknown',
            protocol: request.headers['sec-websocket-protocol'] || 'none',
            extensions: request.headers['sec-websocket-extensions'] || 'none',
            url: request.url || 'unknown',
            method: request.method || 'unknown',
            httpVersion: request.httpVersion || 'unknown',
            connectTime: new Date().toISOString(),
            lastActiveTime: new Date().toISOString(),
        };
        return clientInfo;
    }
    static getClientIP(request) {
        if (request.headers['x-forwarded-for']) {
            return request.headers['x-forwarded-for']
                .split(',')[0]
                .trim();
        }
        else if (request.headers['x-real-ip']) {
            return request.headers['x-real-ip'];
        }
        else if (request.socket?.remoteAddress) {
            return request.socket.remoteAddress;
        }
        return 'unknown';
    }
}
exports.ClientUtil = ClientUtil;
//# sourceMappingURL=client.util.js.map
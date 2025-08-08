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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelTwinSlaveService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const WebSocket = require("ws");
const fs = require("fs");
const child_process_1 = require("child_process");
const treeKill = require("tree-kill");
let PixelTwinSlaveService = class PixelTwinSlaveService {
    configService;
    slaveGpuConfig = null;
    slaveList = [];
    slaveInstanceList = [];
    wsClient = null;
    isConnected = false;
    isReconnecting = false;
    reconnectTimer = null;
    reconnectInterval = 5000;
    constructor(configService) {
        this.configService = configService;
        this.initSlave();
    }
    async initSlave() {
        try {
            const slaveGpuData = await utils_1.JsonUtil.readJsonData(constants_1.JSON_PATHS.PIXEL_TWIN_SLAVE_GPU);
            this.slaveGpuConfig = slaveGpuData;
            const slaveListData = await utils_1.JsonUtil.readJsonData(constants_1.JSON_PATHS.PIXEL_TWIN_LIST_SLAVE);
            this.slaveList = slaveListData;
            await this.connectToMaster();
        }
        catch (error) {
            console.error('从节点初始化失败:', error);
        }
    }
    async connectToMaster() {
        try {
            const signalConnectUrl = this.configService.get('SIGNAL_CONNECT_URL');
            return new Promise((resolve, reject) => {
                this.wsClient = new WebSocket(signalConnectUrl);
                this.wsClient.on('open', () => {
                    this.isConnected = true;
                    this.isReconnecting = false;
                    this.clearReconnectTimer();
                    console.info('成功连接到主节点 WebSocket 服务');
                    this.sendMessageToMaster('slaveConfig', { ...this.slaveGpuConfig, slaveList: this.slaveList });
                    resolve();
                });
                this.wsClient.on('message', (data) => {
                    this.handleMessage(data);
                });
                this.wsClient.on('close', (code, reason) => {
                    this.isConnected = false;
                    this.scheduleReconnect();
                });
                this.wsClient.on('error', (error) => {
                    this.isConnected = false;
                    reject(error);
                });
                setTimeout(() => {
                    if (!this.isConnected) {
                        reject(new Error('WebSocket 连接超时'));
                    }
                }, 10000);
            });
        }
        catch (error) {
        }
    }
    scheduleReconnect() {
        if (this.isReconnecting) {
            return;
        }
        this.isReconnecting = true;
        console.info(`${this.reconnectInterval / 1000}秒后尝试重新连接主节点...`);
        this.reconnectTimer = setTimeout(async () => {
            try {
                await this.connectToMaster();
            }
            catch (error) {
                this.isReconnecting = false;
                this.scheduleReconnect();
            }
        }, this.reconnectInterval);
    }
    clearReconnectTimer() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }
    handleMessage(message) {
        try {
            const { event, data } = JSON.parse(message.toString());
            switch (event) {
                case 'toRunPixelTwin':
                    this.toRunPixelTwin(data.pixelTwinId, data.args, data.pixelTwinInstanceId);
                    break;
                case 'toKillPixelTwin':
                    this.toKillPixelTwin(data.pixelTwinInstanceId);
                    break;
            }
        }
        catch (error) {
        }
    }
    sendMessageToMaster(event, data) {
        if (this.wsClient && this.wsClient.readyState === WebSocket.OPEN) {
            this.wsClient.send(JSON.stringify({ event, data }));
        }
    }
    toRunPixelTwin(pixelTwinId, args, pixelTwinInstanceId) {
        const pixelTwinSlaveInfo = this.slaveList.find((item) => item.pixelTwinId === pixelTwinId);
        if (pixelTwinSlaveInfo) {
            args = args.map(v => {
                if (v.indexOf('-PixelStreamingURL') > -1) {
                    let query = v.split('?')[1];
                    v = `-PixelStreamingURL=${this.configService.get('UE_CONNECT_SIGNAL_URL')}?${query}`;
                }
                return v;
            });
            if (fs.existsSync(pixelTwinSlaveInfo.pixelTwinStartPath)) {
                let child = null;
                if (process.platform == 'win32') {
                    child = (0, child_process_1.spawn)(pixelTwinSlaveInfo.pixelTwinStartPath, args, { cwd: __dirname, detached: true, windowsHide: true, stdio: 'ignore' });
                }
                else if (process.platform == 'darwin') {
                    child = (0, child_process_1.spawn)(pixelTwinSlaveInfo.pixelTwinStartPath, args, { cwd: __dirname, detached: true, stdio: 'ignore' });
                }
                else if (process.platform == 'linux') {
                    child = (0, child_process_1.spawn)('sh', [pixelTwinSlaveInfo.pixelTwinStartPath, ...args], { cwd: __dirname, detached: true, stdio: 'ignore' });
                }
                this.slaveInstanceList.push({
                    pixelTwinId,
                    pixelTwinInstanceId,
                    UEProcess: child
                });
            }
            else {
                console.error(`项目ID为${pixelTwinId}的项目不存在`);
            }
        }
    }
    toKillPixelTwin(pixelTwinInstanceId) {
        for (let i = 0; i < this.slaveInstanceList.length; i++) {
            if (this.slaveInstanceList[i].pixelTwinInstanceId === pixelTwinInstanceId) {
                treeKill(this.slaveInstanceList[i].UEProcess.pid, 'SIGKILL');
                this.slaveInstanceList.splice(i, 1);
                i--;
            }
        }
    }
};
exports.PixelTwinSlaveService = PixelTwinSlaveService;
exports.PixelTwinSlaveService = PixelTwinSlaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PixelTwinSlaveService);
//# sourceMappingURL=pixel-twin-slave.service.js.map
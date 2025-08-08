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
exports.PixelTwinService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
const treeKill = require("tree-kill");
const fs = require("fs");
const utils_1 = require("../utils");
const paths_constants_1 = require("../constants/paths.constants");
const encryption_1 = require("../encryption");
let PixelTwinService = class PixelTwinService {
    configService;
    constructor(configService) {
        this.configService = configService;
        this.initConfig();
        this.enableSignalling();
    }
    isSignallingEnabled = false;
    WebRTCConfig = {
        type: 'config',
        peerConnectionOptions: {},
    };
    pixelTwinMap = new Map();
    pixelTwinGpuConfig = [];
    pixelTwinIPlayerIdMap = new Map();
    playerIdIndex = 1;
    MAX_SAFE_PLAYER_ID = Number.MAX_SAFE_INTEGER - 1000;
    generatePlayerId() {
        if (this.playerIdIndex >= this.MAX_SAFE_PLAYER_ID) {
            this.playerIdIndex = 1;
        }
        while (this.pixelTwinIPlayerIdMap.has(this.playerIdIndex)) {
            this.playerIdIndex++;
            if (this.playerIdIndex >= this.MAX_SAFE_PLAYER_ID) {
                this.playerIdIndex = 1;
            }
        }
        return this.playerIdIndex++;
    }
    async initConfig() {
        try {
            const pixelTwinConfig = await utils_1.JsonUtil.readJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_CONFIG);
            const pixelTwinList = await utils_1.JsonUtil.readJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_LIST);
            const pixelTwinGpu = await utils_1.JsonUtil.readJsonData(paths_constants_1.JSON_PATHS.PIXEL_TWIN_MASTER_GPU);
            if (pixelTwinConfig && pixelTwinList) {
                this.WebRTCConfig.peerConnectionOptions = pixelTwinConfig.peerConnectionOptions;
                pixelTwinList.forEach((element) => {
                    this.pixelTwinMap.set(element.pixelTwinId, element);
                });
            }
            if (pixelTwinGpu) {
                this.pixelTwinGpuConfig = [pixelTwinGpu];
            }
        }
        catch (err) {
            console.error('读取配置文件失败:', err);
            throw new common_1.HttpException({ errorMessage: `初始化配置失败: ${err.message}`, code: 500 }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async toRunPixelTwin(client, url, request) {
        try {
            if (!this.isSignallingServiceEnabled()) {
                client.send(JSON.stringify({ event: 'message', message: '信令服务已停用' }));
                client.close(1013, '信令服务已停用');
                return;
            }
            const pixelTwinId = utils_1.UrlUtil.getQuery(url, 'pixelTwinId');
            if (!pixelTwinId) {
                client.send(JSON.stringify({ event: 'message', message: 'pixelTwinId参数有误' }));
                client.close(1013, '参数有误');
                return;
            }
            const pixelTwinInfo = this.pixelTwinMap.get(pixelTwinId);
            if (!pixelTwinInfo) {
                client.send(JSON.stringify({ event: 'message', message: '项目不存在' }));
                client.close(1013, '项目不存在');
                return;
            }
            if (!pixelTwinInfo || pixelTwinInfo.serviceEnable === false) {
                client.send(JSON.stringify({ event: 'message', message: '项目服务已禁用，无法建立连接' }));
                client.close(1013, '项目服务已禁用，无法建立连接');
                return;
            }
            const freeServer = this.findFreeServerAndGPU(pixelTwinId);
            if (!freeServer) {
                client.send(JSON.stringify({ event: 'message', message: '没有空闲的渲染资源' }));
                return;
            }
            client.send(JSON.stringify({
                event: 'config',
                data: {
                    pixel_twin_params: (0, encryption_1.Encrypt)(JSON.stringify(this.WebRTCConfig.peerConnectionOptions))
                }
            }));
            if (pixelTwinInfo) {
                const playerId = this.generatePlayerId();
                const pixelTwinInstanceId = (0, uuid_1.v4)();
                this.pixelTwinIPlayerIdMap.set(playerId, {
                    pixelTwinId: pixelTwinId,
                    pixelTwinInstanceId,
                });
                const args = [];
                for (let i = 0; i < pixelTwinInfo.pixelTwinArgs.length; i++) {
                    const arg = pixelTwinInfo.pixelTwinArgs[i];
                    if (arg.check) {
                        if (arg.key == '-PixelStreamingURL') {
                            const ueConnectUrl = this.configService.get('UE_CONNECT_SIGNAL_URL');
                            args.push(`-PixelStreamingURL=${ueConnectUrl}?playerId=${playerId}`);
                        }
                        else if (arg.value)
                            args.push(arg.key + '=' + arg.value);
                        else
                            args.push(arg.key);
                    }
                }
                args.push(`-GraphicsAdapter=${freeServer?.graphicsAdapter || 0}`);
                const clientInfo = utils_1.ClientUtil.extractClientInfo(request);
                if (freeServer.ip == '127.0.0.1') {
                    if (fs.existsSync(pixelTwinInfo.pixelTwinStartPath)) {
                        let child = null;
                        if (process.platform == 'win32') {
                            child = (0, child_process_1.spawn)(pixelTwinInfo.pixelTwinStartPath, args, { cwd: __dirname, detached: true, windowsHide: true, stdio: 'ignore' });
                        }
                        else if (process.platform == 'darwin') {
                            child = (0, child_process_1.spawn)(pixelTwinInfo.pixelTwinStartPath, args, { cwd: __dirname, detached: true, stdio: 'ignore' });
                        }
                        else if (process.platform == 'linux') {
                            child = (0, child_process_1.spawn)('sh', [pixelTwinInfo.pixelTwinStartPath, ...args], { cwd: __dirname, detached: true, stdio: 'ignore' });
                        }
                        pixelTwinInfo.pixelTwinInstance.push({
                            id: pixelTwinInstanceId,
                            playerId,
                            playerClient: client,
                            UEClient: null,
                            UEProcess: child,
                            clientInfo,
                            serverIp: freeServer?.ip || '',
                            gpuAdapter: freeServer?.graphicsAdapter || 0
                        });
                    }
                    else {
                        client.send(JSON.stringify({ event: 'message', message: '项目文件不存在' }));
                        client.close(1013, '项目文件不存在');
                        console.error(`项目ID为${pixelTwinId}的项目不存在`);
                    }
                }
                else {
                    freeServer.slaveClient.send(JSON.stringify({
                        event: 'toRunPixelTwin',
                        data: {
                            pixelTwinId,
                            args,
                            pixelTwinInstanceId
                        }
                    }));
                    pixelTwinInfo.pixelTwinInstance.push({
                        id: pixelTwinInstanceId,
                        playerId,
                        playerClient: client,
                        slaveClient: freeServer.slaveClient,
                        UEClient: null,
                        UEProcess: null,
                        clientInfo,
                        serverIp: freeServer?.ip || '',
                        gpuAdapter: freeServer?.graphicsAdapter || 0
                    });
                }
            }
        }
        catch (error) {
            console.error('启动Pixel Twin实例失败:', error);
            try {
                client.send(JSON.stringify({ event: 'message', message: '启动实例失败，请稍后重试' }));
                client.close(1011, '服务器内部错误');
            }
            catch (clientError) {
                console.error('发送错误消息到客户端失败:', clientError);
            }
        }
    }
    registerUEClient(client, args) {
        try {
            const playerId = Number(utils_1.UrlUtil.getQuery(args.url, 'playerId'));
            const mapValue = this.getPlayerIdMap(playerId);
            if (mapValue) {
                const { pixelTwinId, pixelTwinInstanceId } = mapValue;
                const pixelTwinInfo = this.pixelTwinMap.get(pixelTwinId);
                const pixelTwinInstance = pixelTwinInfo?.pixelTwinInstance.find((findItem) => findItem.id === pixelTwinInstanceId);
                if (pixelTwinInstance) {
                    pixelTwinInstance.UEClient = client;
                    this.sendMessageToUE(playerId, this.WebRTCConfig);
                    this.sendMessageToUE(playerId, {
                        type: 'playerConnected',
                        playerId,
                        dataChannel: true,
                    });
                }
            }
        }
        catch (error) {
            console.error('注册UE客户端失败:', error);
            try {
                client.close(1011, '注册客户端失败');
            }
            catch (clientError) {
                console.error('关闭客户端连接失败:', clientError);
            }
        }
    }
    sendMessageToUE(playerId, message) {
        try {
            const mapValue = this.getPlayerIdMap(playerId);
            if (mapValue) {
                const { pixelTwinId, pixelTwinInstanceId } = mapValue;
                const pixelTwinInfo = this.pixelTwinMap.get(pixelTwinId);
                const pixelTwinInstance = pixelTwinInfo?.pixelTwinInstance.find((findItem) => findItem.id === pixelTwinInstanceId);
                if (pixelTwinInstance && pixelTwinInstance.UEClient) {
                    pixelTwinInstance.UEClient.send(JSON.stringify(message));
                }
            }
        }
        catch (error) {
            console.error(`向UE实例发送消息失败 (playerId: ${playerId}):`, error);
        }
    }
    sendMessageToPlayer(playerId, message) {
        try {
            const mapValue = this.getPlayerIdMap(playerId);
            if (mapValue) {
                const { pixelTwinId, pixelTwinInstanceId } = mapValue;
                const pixelTwinInfo = this.pixelTwinMap.get(pixelTwinId);
                const pixelTwinInstance = pixelTwinInfo?.pixelTwinInstance.find((findItem) => findItem.id === pixelTwinInstanceId);
                if (pixelTwinInstance && pixelTwinInstance.playerClient) {
                    let encryptMessage = {
                        event: message.event,
                        data: {
                            pixel_twin_params: (0, encryption_1.Encrypt)(JSON.stringify(message.data))
                        }
                    };
                    pixelTwinInstance.playerClient.send(JSON.stringify(encryptMessage));
                }
            }
        }
        catch (error) {
            console.error(`向客户端发送消息失败 (playerId: ${playerId}):`, error);
        }
    }
    handlePlayerDisconnect() {
        try {
            this.pixelTwinMap.forEach((value, key) => {
                for (let i = 0; i < value.pixelTwinInstance.length; i++) {
                    const item = value.pixelTwinInstance[i];
                    if (item.playerClient.readyState === 3 || item.playerClient.readyState === 2) {
                        try {
                            this.treeKillProcess(item);
                        }
                        catch (error) {
                            console.error('终止UE进程失败:', error);
                        }
                        this.pixelTwinIPlayerIdMap.delete(item.playerId);
                        value.pixelTwinInstance.splice(i, 1);
                        i--;
                    }
                }
            });
        }
        catch (error) {
            console.error('处理客户端断开连接失败:', error);
        }
    }
    enableSignalling() {
        this.isSignallingEnabled = true;
        return this.isSignallingEnabled;
    }
    disableSignalling() {
        try {
            this.isSignallingEnabled = false;
            this.disconnectAllClients();
            return this.isSignallingEnabled;
        }
        catch (error) {
            console.error('禁用信令服务失败:', error);
            throw new common_1.HttpException('禁用信令服务失败', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getSignallingStatus() {
        return this.isSignallingEnabled;
    }
    isSignallingServiceEnabled() {
        return this.isSignallingEnabled;
    }
    disconnectAllClients() {
        try {
            this.pixelTwinMap.forEach((value, key) => {
                value.pixelTwinInstance.forEach((instance) => {
                    try {
                        if (instance.playerClient && instance.playerClient.readyState === 1) {
                            instance.playerClient.close();
                        }
                        if (instance.UEClient && instance.UEClient.readyState === 1) {
                            instance.UEClient.close();
                        }
                        this.treeKillProcess(instance);
                        this.pixelTwinIPlayerIdMap.delete(instance.playerId);
                    }
                    catch (error) {
                        console.error('清理客户端连接失败:', error);
                    }
                });
                value.pixelTwinInstance = [];
            });
        }
        catch (error) {
            console.error('断开所有客户端连接失败:', error);
        }
    }
    getPlayerIdMap(playerId) {
        return this.pixelTwinIPlayerIdMap.get(Number(playerId));
    }
    getPixelTwinMap() {
        return this.pixelTwinMap;
    }
    getPixelTwinGpuConfig(isMaster) {
        if (isMaster) {
            let masterGpu = this.pixelTwinGpuConfig.find(findItem => findItem.ip == '127.0.0.1');
            return masterGpu;
        }
        else {
            return this.pixelTwinGpuConfig;
        }
    }
    updatePixelTwinGpuConfig(gpuConfigData) {
        try {
            for (let i = 0; i < this.pixelTwinGpuConfig.length; i++) {
                if (this.pixelTwinGpuConfig[i].ip == gpuConfigData.ip) {
                    this.pixelTwinGpuConfig[i] = gpuConfigData;
                    break;
                }
            }
        }
        catch (error) {
            console.error('更新GPU配置数据失败:', error);
            throw new common_1.HttpException('更新GPU配置数据失败', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    treeKillProcess(instance) {
        if (instance.UEProcess) {
            treeKill(instance.UEProcess.pid, 'SIGKILL');
        }
        else if (instance.slaveClient) {
            instance.slaveClient.send(JSON.stringify({
                event: 'toKillPixelTwin',
                data: {
                    pixelTwinInstanceId: instance.id
                }
            }));
        }
    }
    findFreeServerAndGPU(pixelTwinId) {
        try {
            const pixelTwinInfo = this.pixelTwinMap.get(pixelTwinId);
            if (!pixelTwinInfo) {
                throw new common_1.HttpException('项目不存在', common_1.HttpStatus.BAD_REQUEST);
            }
            const requiredMemory = pixelTwinInfo.graphicsMemory;
            const serverGpuUsage = new Map();
            for (let i = 0; i < this.pixelTwinGpuConfig.length; i++) {
                const server = this.pixelTwinGpuConfig[i];
                const gpuUsageMap = new Map();
                for (let j = 0; j < server.gpu.length; j++) {
                    gpuUsageMap.set(server.gpu[j].graphicsAdapter, { used: 0, total: server.gpu[j].gpuMemory });
                }
                serverGpuUsage.set(server.ip, gpuUsageMap);
            }
            const projectEntries = Array.from(this.pixelTwinMap.entries());
            for (let i = 0; i < projectEntries.length; i++) {
                const [_, projectInfo] = projectEntries[i];
                const instances = projectInfo.pixelTwinInstance;
                if (!instances || instances.length === 0)
                    continue;
                for (let j = 0; j < instances.length; j++) {
                    const serverUsage = serverGpuUsage.get(instances[j].serverIp);
                    const gpuUsage = serverUsage?.get(instances[j].gpuAdapter);
                    if (gpuUsage) {
                        gpuUsage.used += projectInfo.graphicsMemory;
                    }
                }
            }
            for (let i = 0; i < this.pixelTwinGpuConfig.length; i++) {
                const server = this.pixelTwinGpuConfig[i];
                if (Array.isArray(server.slaveList)) {
                    if (!server.slaveList.find(slave => slave.pixelTwinId === pixelTwinId))
                        continue;
                }
                else {
                    if (!this.pixelTwinMap.get(pixelTwinId)?.pixelTwinStartPath)
                        continue;
                }
                const serverUsage = serverGpuUsage.get(server.ip);
                for (let j = 0; j < server.gpu.length; j++) {
                    const gpu = server.gpu[j];
                    const gpuUsage = serverUsage?.get(gpu.graphicsAdapter);
                    const availableMemory = gpuUsage ? gpuUsage.total - gpuUsage.used : 0;
                    if (availableMemory >= requiredMemory)
                        return { ip: server.ip, graphicsAdapter: gpu.graphicsAdapter, slaveClient: server.slaveClient };
                }
            }
            return null;
        }
        catch (error) {
            console.error('查找空闲服务器和GPU资源失败:', error);
            throw new common_1.HttpException('查找空闲服务器和GPU资源失败', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    handleSlaveConfig(slaveConfigData, client) {
        try {
            const updatedConfig = [...this.pixelTwinGpuConfig];
            let existingIndex = -1;
            for (let i = 0; i < updatedConfig.length; i++) {
                if (updatedConfig[i].ip === slaveConfigData.ip) {
                    existingIndex = i;
                    break;
                }
            }
            if (existingIndex !== -1)
                updatedConfig[existingIndex] = { ...slaveConfigData, slaveClient: client };
            else
                updatedConfig.push({ ...slaveConfigData, slaveClient: client });
            this.pixelTwinGpuConfig = updatedConfig;
        }
        catch (error) {
            console.error('处理从节点配置时发生错误:', error);
        }
    }
    handleSlaveDisconnect() {
        try {
            this.pixelTwinGpuConfig = this.pixelTwinGpuConfig.filter((config) => {
                return config.slaveClient ? (config.slaveClient.readyState === 1) : true;
            });
        }
        catch (error) {
            console.error('处理从节点断开连接时发生错误:', error);
        }
    }
    renegotiateSDP(playerId) {
        this.sendMessageToUE(playerId, {
            type: 'playerConnected',
            playerId,
            dataChannel: true,
        });
    }
};
exports.PixelTwinService = PixelTwinService;
exports.PixelTwinService = PixelTwinService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PixelTwinService);
//# sourceMappingURL=pixel-twin.service.js.map
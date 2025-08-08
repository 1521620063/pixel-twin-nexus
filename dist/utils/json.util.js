"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonUtil = void 0;
const fse = require("fs-extra");
class JsonUtil {
    static async readJsonData(path) {
        try {
            const jsonRes = await fse.readJson(path);
            return jsonRes;
        }
        catch (error) {
            console.error('读取 JSON 文件失败:', error);
            return null;
        }
    }
    static async writeJsonData(path, data) {
        try {
            await fse.writeJson(path, data, { spaces: 2 });
        }
        catch (error) {
            console.error('写入 JSON 文件失败:', error);
            throw error;
        }
    }
}
exports.JsonUtil = JsonUtil;
//# sourceMappingURL=json.util.js.map
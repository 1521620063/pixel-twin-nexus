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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const commonEnum_1 = require("../commonEnum");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
let UsersService = class UsersService {
    users = [];
    saltOrRounds = 10;
    constructor() {
        this.init();
    }
    async init() {
        this.users = await utils_1.JsonUtil.readJsonData(constants_1.JSON_PATHS.PIXEL_TWIN_USERS);
    }
    async findOne(username, pass) {
        let user = this.users.find((user) => user.username === username);
        if (!user) {
            throw new common_1.HttpException({ errorMessage: commonEnum_1.ExceptionCodeMap[1001], code: 1001 }, common_1.HttpStatus.OK);
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new common_1.HttpException({ errorMessage: commonEnum_1.ExceptionCodeMap[1001], code: 1001 }, common_1.HttpStatus.OK);
        }
        return user;
    }
    async modifyUser(modifyUserDto) {
        const { userId, username, password, newUsername, newPassword } = modifyUserDto;
        let user = this.users.find((user) => (user.userId === userId && user.username === username));
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                this.saltOrRounds = await bcrypt.genSalt();
                const hash = await bcrypt.hash(newPassword, this.saltOrRounds);
                user.username = newUsername;
                user.password = hash;
                await utils_1.JsonUtil.writeJsonData(constants_1.JSON_PATHS.PIXEL_TWIN_USERS, this.users);
                return {};
            }
        }
        throw new common_1.HttpException({ errorMessage: commonEnum_1.ExceptionCodeMap[1001], code: 1001 }, common_1.HttpStatus.OK);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UsersService);
//# sourceMappingURL=users.service.js.map
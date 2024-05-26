"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor(context) {
        this.engine = (0, express_1.default)();
        this.engine.use(express_1.default.json());
        this.engine.use(express_1.default.urlencoded({ extended: true }));
        this.context = context;
    }
}
exports.default = Server;

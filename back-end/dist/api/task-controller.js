"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
exports.router = express_1.default.Router();
let pool;
dotenv_1.default.config();
initPool();
function initPool() {
    return __awaiter(this, void 0, void 0, function* () {
        pool = yield promise_mysql_1.default.createPool({
            host: process.env.host,
            port: +process.env.port,
            database: process.env.password,
            user: process.env.username,
            password: process.env.password,
            connectionLimit: +process.env.connection_limit
        });
    });
}
exports.router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield pool.query("SELECT * FROM task");
    res.json(tasks);
}));
exports.router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const task = req.body;
    if (!((_a = task.description) === null || _a === void 0 ? void 0 : _a.trim())) {
        res.sendStatus(400);
        return;
    }
    const result = yield pool.query('INSERT INTO task (description, status) VALUES (?,DEFAULT)', [task.description]);
    task.id = result.insertId;
    task.status = "NOT_COMPLETED";
    res.status(201).json(task);
}));
exports.router.delete("/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("DELETE FROM task WHERE id=?", [req.params.taskId]);
    res.sendStatus(result.affectedRows ? 204 : 404);
}));
exports.router.patch("/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.body;
    task.id = +req.params.taskId;
    if (!task.status) {
        res.sendStatus(400);
        return;
    }
    const result = yield pool.query("UPDATE task SET status=? WHERE id=?", [task.status, task.id]);
    res.sendStatus(result.affectedRows ? 204 : 404);
}));

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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
var index_1 = require("../index");
var zod_1 = require("zod");
var router = express_1.default.Router();
var PostData = zod_1.z.object({
    title: zod_1.z.string().trim(),
    description: zod_1.z.string().trim(),
    tag: zod_1.z.string().trim(),
});
router.get("/all", authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.prisma.post.findMany({
                        where: {
                            userId: req.user.id,
                        },
                    })];
            case 1:
                data = _a.sent();
                res.json({ status: true, data: data });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res
                    .status(500)
                    .json({ status: true, data: { message: "Internal server error" } });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/get/:id", authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_1.prisma.post.findMany({
                        where: {
                            id: req.params.id,
                        },
                    })];
            case 1:
                data = _a.sent();
                res.json({ status: true, data: data });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res
                    .status(500)
                    .json({ status: true, data: { message: "Internal server error" } });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/add", authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, post, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = PostData.safeParse(req.body);
                if (data.success === false) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ status: false, data: { message: "Invalid Data!" } })];
                }
                return [4 /*yield*/, index_1.prisma.post.create({
                        data: {
                            title: data.data.title,
                            description: data.data.description,
                            tag: data.data.tag,
                            userId: req.user.id
                        }
                    })];
            case 1:
                post = _a.sent();
                return [2 /*return*/, res
                        .json({ status: true, data: post })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, res
                        .status(500)
                        .json({ status: false, data: { message: "Internal Server Error!!" } })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/update/:id', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, note, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                data = PostData.safeParse(req.body);
                if (data.success === false) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ status: false, data: { message: "Invalid Data!" } })];
                }
                if (!req.params.id) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ status: false, data: { message: "Invalid Data!" } })];
                }
                return [4 /*yield*/, index_1.prisma.post.findUnique({
                        where: {
                            id: req.params.id
                        }
                    })];
            case 1:
                note = _a.sent();
                if (!note) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ status: false, data: { message: "Invalid Data!" } })];
                }
                if (note.userId !== req.user.id) {
                    return [2 /*return*/, res.status(401).json({ status: false, data: { message: "Not Allowed!" } })];
                }
                return [4 /*yield*/, index_1.prisma.post.update({
                        where: {
                            id: req.params.id
                        },
                        data: {
                            title: data.data.title,
                            description: data.data.description,
                            tag: data.data.tag,
                        }
                    })];
            case 2:
                note = _a.sent();
                res.status(401).json({ status: true, data: note });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).json({ status: false, data: { message: "Internal Server Error!!" } });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//get single note
router.delete('/delete/:id', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var note, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, index_1.prisma.post.findUnique({
                        where: {
                            id: req.params.id
                        }
                    })];
            case 1:
                note = _a.sent();
                if (!note) {
                    return [2 /*return*/, res.status(404).json({ status: false, data: { message: "Post Not Found" } })];
                }
                if (note.userId !== req.user.id) {
                    return [2 /*return*/, res.status(401).json({ status: false, data: { message: "Not Allowed!" } })];
                }
                return [4 /*yield*/, index_1.prisma.post.delete({
                        where: {
                            id: req.params.id
                        }
                    })];
            case 2:
                note = _a.sent();
                res.status(302).json({ status: true, data: { message: "Post deleted sucessfully!!" } });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).send('Internal server error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

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
var index_1 = require("../index");
var bcrypt_1 = require("bcrypt");
var zod_1 = require("zod");
var authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
var signToken_1 = require("../utils/signToken");
var router = express_1.default.Router();
var loginData = zod_1.z.object({
    username: zod_1.z
        .string({
        required_error: "Username is required!",
        invalid_type_error: "Username must be a string",
    })
        .trim()
        .min(3, { message: "Must be 3 or more characters long" }),
    password: zod_1.z
        .string()
        .trim()
        .min(8, { message: "Must be 8 or more characters long" }),
});
var signupData = zod_1.z.object({
    name: zod_1.z.string(),
    username: zod_1.z
        .string({
        required_error: "Username is required!",
        invalid_type_error: "Username must be a string",
    })
        .trim()
        .min(3, { message: "Must be 3 or more characters long" }),
    password: zod_1.z
        .string()
        .trim()
        .min(8, { message: "Must be 8 or more characters long" }),
    email: zod_1.z.string().email({
        message: "Email is required!",
    }),
});
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, ExistingUser, compredPwd, payload, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('req came');
                data = loginData.safeParse(req.body);
                if (data.success === false) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ status: false, data: { message: "Invalid Data!" } })];
                }
                return [4 /*yield*/, index_1.prisma.user.findFirst({
                        where: {
                            username: { equals: data.data.username },
                        },
                    })];
            case 1:
                ExistingUser = _a.sent();
                if (ExistingUser === null)
                    return [2 /*return*/, res
                            .status(404)
                            .json({ status: false, data: { message: "User Not Found!" } })];
                return [4 /*yield*/, (0, bcrypt_1.compare)(data.data.password, ExistingUser.password)];
            case 2:
                compredPwd = _a.sent();
                if (compredPwd === false) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Please Login with correct credentials" })];
                }
                payload = {
                    user: {
                        id: ExistingUser.id,
                        username: ExistingUser.username,
                        email: ExistingUser.email,
                    },
                };
                return [4 /*yield*/, (0, signToken_1.signToken)(payload)];
            case 3:
                token = _a.sent();
                // res.setHeader("Set-Cookie", [`Authorization=${token}`]);
                res.cookie("Authorization", token, { domain: "http://localhost:5000", sameSite: "none", secure: true, path: "/" });
                res.json({ status: true, data: { token: token } });
                return [2 /*return*/];
        }
    });
}); });
router.post("/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, existingUsers, user, _a, _b, payload, token;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                data = signupData.safeParse(req.body);
                if (data.success === false) {
                    console.log(data);
                    return [2 /*return*/, res.status(401).json({ status: false, data: { message: "Invalid Data!" } })];
                }
                return [4 /*yield*/, index_1.prisma.user.findMany({
                        where: {
                            OR: [
                                { email: { equals: data.data.email } },
                                { username: { equals: data.data.username } },
                            ],
                        },
                    })];
            case 1:
                existingUsers = _e.sent();
                if (existingUsers.length > 0)
                    return [2 /*return*/, res.json({ status: false, data: { message: "Please Login with correct credentials!!!" } })];
                _b = (_a = index_1.prisma.user).create;
                _c = {};
                _d = {
                    email: data.data.email
                };
                return [4 /*yield*/, (0, bcrypt_1.hash)(data.data.password, 10)];
            case 2: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.password = _e.sent(),
                        _d.name = data.data.name,
                        _d.username = data.data.username,
                        _d),
                        _c)])];
            case 3:
                user = _e.sent();
                payload = {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    },
                };
                return [4 /*yield*/, (0, signToken_1.signToken)(payload)];
            case 4:
                token = _e.sent();
                res.cookie('Authorization', token, { httpOnly: true, sameSite: true, secure: false, maxAge: 6 * 60 * 60 * 1000, });
                return [2 /*return*/, res.json({ status: true, data: { token: token } })];
        }
    });
}); });
router.post("/change-password", authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var umail, _a, _b, e_1;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                umail = req.user.email;
                if (!req.body.password) {
                    return [2 /*return*/, res.json({ status: false, data: { message: "Password can not be null!!" } })];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 4, , 5]);
                _b = (_a = index_1.prisma.user).update;
                _c = {
                    where: {
                        email: umail,
                    }
                };
                _d = {};
                return [4 /*yield*/, (0, bcrypt_1.hash)(req.body.password, 10)];
            case 2: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.password = _e.sent(),
                        _d),
                        _c)])];
            case 3:
                _e.sent();
                res.json({ status: true, data: { message: "Password changed sucessfully!!" } });
                return [3 /*break*/, 5];
            case 4:
                e_1 = _e.sent();
                res.json({ status: false, data: { message: e_1 } });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.delete("/account", authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, ids, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, index_1.prisma.post.findMany({
                        where: {
                            userId: req.user.id,
                        }
                    })];
            case 1:
                posts = _a.sent();
                ids = posts.map(function (p) { return p.id; });
                return [4 /*yield*/, index_1.prisma.sharedPost.deleteMany({
                        where: {
                            postId: { in: ids }
                        }
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, index_1.prisma.post.deleteMany({
                        where: {
                            userId: req.user.id,
                        }
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, index_1.prisma.user.delete({
                        where: {
                            email: req.user.email,
                        },
                    })];
            case 4:
                _a.sent();
                res.cookie('Authorization', 'delted', { httpOnly: true, sameSite: true, secure: true });
                res.json({ status: true, data: { message: "User Deleted!!" } });
                return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                res.json({ status: false, data: { message: e_2 } });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

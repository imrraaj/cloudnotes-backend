"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
var client_1 = require(".prisma/client");
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("./routes/auth"));
var secureRoutes_1 = __importDefault(require("./routes/secureRoutes"));
var cors = require('cors');
// const cookieParser = require('cookie-parser')
var cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.prisma = new client_1.PrismaClient();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
// let corsOptions = {
//   origin: 'http://127.0.0.1:5500', //frontend url
//   credentials: true
// }
app.use(cors());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/api', secureRoutes_1.default);
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    console.log(req);
    res.json({
        status: "OK"
    });
});
app.listen(PORT, function () { return console.log("Server is started on http://localhost:".concat(PORT)); });

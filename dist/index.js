"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const logger_1 = require("./middleware/logger");
const response_utils_1 = require("./utils/response.utils");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static('public'));
app.use(logger_1.requestMiddleware);
// app.use(requestMiddleware);
app.get('/', (req, res) => {
    (0, response_utils_1.handleSuccess)(res, {
        message: 'Express App: Sample App',
    });
});
app.listen(process.env.PORT, () => console.log(`Server Up:${process.env.PORT}`));
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestMiddleware = void 0;
const crypto_1 = require("crypto");
const requestMiddleware = (req, res, next) => {
    const responseId = (0, crypto_1.randomUUID)();
    res.locals.responseId = responseId;
    next();
};
exports.requestMiddleware = requestMiddleware;
//# sourceMappingURL=logger.js.map
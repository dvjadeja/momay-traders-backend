"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodErrors = exports.handleAxiosError = exports.handleErrors = exports.handleSuccess = void 0;
const axios_1 = require("axios");
const zod_1 = require("zod");
const handleSuccess = (res, resObj) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { status } = resObj, rest = __rest(resObj, ["status"]);
    const username = ((_b = (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.company)
        ? (_e = (_d = (_c = res.locals) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.company) === null || _e === void 0 ? void 0 : _e.name
        : ((_g = (_f = res === null || res === void 0 ? void 0 : res.locals) === null || _f === void 0 ? void 0 : _f.user) === null || _g === void 0 ? void 0 : _g.firstName)
            ? (_j = (_h = res.locals) === null || _h === void 0 ? void 0 : _h.user) === null || _j === void 0 ? void 0 : _j.firstName
            : 'Guest';
    // Do not console log the /api/v1/auth/me endpoint
    if (res.req.originalUrl !== '/api/v1/auth/me') {
        console.log(Object.assign({ responseId: res.locals.responseId, username: username, method: res.req.method, url: res.req.originalUrl, body: res.req.body, params: res.req.params, query: res.req.query, code: resObj.code || 'SUCCESS', status: status || 200 }, rest));
    }
    https: return res.status(status || 200).json(Object.assign({ code: resObj.code || 'SUCCESS' }, rest));
};
exports.handleSuccess = handleSuccess;
const handleErrors = (req, res, errObj) => {
    let _error = errObj === null || errObj === void 0 ? void 0 : errObj.error;
    if (_error instanceof axios_1.AxiosError)
        _error = (0, exports.handleAxiosError)(errObj.error);
    if (_error instanceof zod_1.ZodError)
        _error = (0, exports.handleZodErrors)(errObj.error);
    const { status } = errObj, rest = __rest(errObj, ["status"]);
    return res.status(status || 400).json(Object.assign({ code: 'ERROR', data: {
            message: (_error === null || _error === void 0 ? void 0 : _error.message) || _error,
            query: Object.assign({}, req.query),
            body: Object.assign({}, req.body),
            params: Object.assign({}, req.params),
            data: _error === null || _error === void 0 ? void 0 : _error.data,
        } }, rest));
};
exports.handleErrors = handleErrors;
//  ---------------------
const handleAxiosError = (error) => {
    var _a, _b, _c;
    if (!error.response)
        return null;
    const config = (_a = error.response) === null || _a === void 0 ? void 0 : _a.config;
    console.log('\n\n\n ------------------------------------------ \n');
    console.log('Config Headers', config === null || config === void 0 ? void 0 : config.headers);
    console.log('Config Base URL -', config === null || config === void 0 ? void 0 : config.baseURL);
    console.log('Config Endpoint - ', config === null || config === void 0 ? void 0 : config.url);
    console.log('Config Data', config === null || config === void 0 ? void 0 : config.headers);
    console.log('\n ------------------------------------------ \n\n\n');
    console.log('Data', (_b = error.response) === null || _b === void 0 ? void 0 : _b.data);
    return { data: (_c = error.response) === null || _c === void 0 ? void 0 : _c.data };
};
exports.handleAxiosError = handleAxiosError;
const handleZodErrors = (error) => {
    console.log('Zod Error', error);
    const data = error.issues.map((err) => `${err.path}: expected ${err.expected}, but recieved ${err.recieved}`);
    console.log('Error', data);
    return {
        message: 'Error validating request body',
        data,
    };
};
exports.handleZodErrors = handleZodErrors;
//# sourceMappingURL=response.utils.js.map
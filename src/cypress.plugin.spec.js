"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = require("sinon");
var cypress_plugin_1 = require("./cypress.plugin");
describe('CypressPlugin', function () {
    var requestFn;
    var setCookieFn;
    var wrapFn;
    var plugin;
    var deferredPromise;
    beforeEach(function () {
        requestFn = sinon_1.stub();
        setCookieFn = sinon_1.stub();
        wrapFn = sinon_1.stub();
        deferredPromise = {};
        global['cy'] = {
            request: requestFn,
            setCookie: setCookieFn,
            wrap: wrapFn
        };
        global['Cypress'] = {
            config: function () { return ({ baseUrl: 'http://localhost:9000' }); }
        };
        plugin = new cypress_plugin_1.CypressPlugin();
    });
    describe('constructor', function () {
        it('sets the apimock id', function () {
            return expect(plugin.ngApimockId).toBeDefined();
        });
        it('sets the baseUrl', function () {
            return expect(plugin.baseUrl).toBe('http://localhost:9000/ngapimock');
        });
    });
    describe('delayResponse', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves();
                        return [4 /*yield*/, plugin.delayResponse('name', 1000)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('delays the mock response', function () {
            sinon_1.assert.calledWith(invokeFn, 'mocks', 'PUT', { name: 'name', delay: 1000 });
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('deleteVariable', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves();
                        return [4 /*yield*/, plugin.deleteVariable('one')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('deletes the variable', function () {
            sinon_1.assert.calledWith(invokeFn, 'variables/one', 'DELETE', {});
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('echoRequest', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves();
                        return [4 /*yield*/, plugin.echoRequest('name', true)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('enables the mock request echo', function () {
            sinon_1.assert.calledWith(invokeFn, 'mocks', 'PUT', { name: 'name', echo: true });
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('getMocks', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.getMocks()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('gets the mocks', function () {
            sinon_1.assert.calledWith(invokeFn, 'mocks', 'GET', {});
            sinon_1.assert.calledWith(wrapFn, { some: 'thing' });
        });
    });
    describe('getPresets', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.getPresets()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('gets the presets', function () {
            sinon_1.assert.calledWith(invokeFn, 'presets', 'GET', {});
            sinon_1.assert.calledWith(wrapFn, { some: 'thing' });
        });
    });
    describe('getRecordings', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.getRecordings()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('gets the recordings', function () {
            sinon_1.assert.calledWith(invokeFn, 'recordings', 'GET', {});
            sinon_1.assert.calledWith(wrapFn, { some: 'thing' });
        });
    });
    describe('getVariables', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.getVariables()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('gets the variables', function () {
            sinon_1.assert.calledWith(invokeFn, 'variables', 'GET', {});
            sinon_1.assert.calledWith(wrapFn, { some: 'thing' });
        });
    });
    describe('invoke', function () {
        describe('throws an error when fetch returns non 200', function () {
            beforeEach(function () {
                requestFn.resolves(({ status: 404 }));
            });
            it('calls the api without body', function () { return __awaiter(_this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, plugin.invoke('some/query', 'GET', { some: 'body' })];
                        case 1:
                            _a.sent();
                            fail();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            expect(error_1.message).toBe('An error occured while invoking http://localhost:9000/ngapimock/some/query that resulted in status code 404');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('method is GET', function () {
            beforeEach(function () {
                requestFn.resolves(({ status: 200 }));
                plugin.ngApimockId = '123';
            });
            it('calls the api without body', function () {
                plugin.invoke('some/query', 'GET', { some: 'body' });
                sinon_1.assert.calledWith(requestFn, sinon_1.match(function (actual) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        expect(actual.method).toBe('GET');
                        expect(actual.url).toBe('http://localhost:9000/ngapimock/some/query');
                        expect(actual.log).toBe(false);
                        expect(actual.headers['Cookie']).toBe('apimockid=123');
                        expect(actual.headers['Content-Type']).toBe('application/json');
                        return [2 /*return*/, expect(actual.body).toBeUndefined()];
                    });
                }); }));
            });
        });
        describe('method is DELETE', function () {
            beforeEach(function () {
                requestFn.resolves(({ status: 200 }));
                plugin.ngApimockId = '123';
            });
            it('calls the api without body', function () {
                plugin.invoke('some/query', 'DELETE', { some: 'body' });
                sinon_1.assert.calledWith(requestFn, sinon_1.match(function (actual) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        expect(actual.method).toBe('DELETE');
                        expect(actual.url).toBe('http://localhost:9000/ngapimock/some/query');
                        expect(actual.headers['Cookie']).toBe('apimockid=123');
                        expect(actual.headers['Content-Type']).toBe('application/json');
                        return [2 /*return*/, expect(actual.body).toBeUndefined()];
                    });
                }); }));
            });
        });
        describe('method is POST', function () {
            beforeEach(function () {
                requestFn.resolves(({ status: 200 }));
                plugin.ngApimockId = '123';
            });
            it('calls the api without body', function () {
                plugin.invoke('some/query', 'POST', { some: 'body' });
                sinon_1.assert.calledWith(requestFn, sinon_1.match(function (actual) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        expect(actual.method).toBe('POST');
                        expect(actual.url).toBe('http://localhost:9000/ngapimock/some/query');
                        expect(actual.headers['Cookie']).toBe('apimockid=123');
                        expect(actual.headers['Content-Type']).toBe('application/json');
                        return [2 /*return*/, expect(actual.body).toEqual({ some: 'body' })];
                    });
                }); }));
            });
        });
        describe('method is PUT', function () {
            beforeEach(function () {
                requestFn.resolves(({ status: 200 }));
                plugin.ngApimockId = '123';
            });
            it('calls the api without body', function () {
                plugin.invoke('some/query', 'PUT', { some: 'body' });
                sinon_1.assert.calledWith(requestFn, sinon_1.match(function (actual) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        expect(actual.method).toBe('PUT');
                        expect(actual.url).toBe('http://localhost:9000/ngapimock/some/query');
                        expect(actual.headers['Cookie']).toBe('apimockid=123');
                        expect(actual.headers['Content-Type']).toBe('application/json');
                        return [2 /*return*/, expect(actual.body).toEqual({ some: 'body' })];
                    });
                }); }));
            });
        });
    });
    describe('recordRequests', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.recordRequests(true)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('enables the recording the requests', function () {
            sinon_1.assert.calledWith(invokeFn, 'actions', 'PUT', { action: 'record', record: true });
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('resetMocksToDefault', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.resetMocksToDefault()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('resets the mocks to defaults', function () {
            sinon_1.assert.calledWith(invokeFn, 'actions', 'PUT', { action: 'defaults' });
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('selectPreset', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.selectPreset('preset name')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('selects the preset', function () {
            sinon_1.assert.calledWith(invokeFn, 'presets', 'PUT', { name: 'preset name' });
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('selectScenario', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.selectScenario('name', 'scenario')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('selects the mock scenario', function () {
            sinon_1.assert.calledWith(invokeFn, 'mocks', 'PUT', { name: 'name', scenario: 'scenario' });
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('setMocksToPassThrough', function () {
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.setMocksToPassThrough()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('sets mocks to passThrough', function () {
            sinon_1.assert.calledWith(invokeFn, 'actions', 'PUT', { action: 'passThroughs' });
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('setNgApimockCookie', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestFn.resolves();
                        setCookieFn.resolves();
                        return [4 /*yield*/, plugin.setNgApimockCookie()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () {
            requestFn.reset();
            setCookieFn.reset();
        });
        it('opens the init url', function () {
            sinon_1.assert.calledWith(requestFn, {
                method: 'GET',
                url: 'http://localhost:9000/ngapimock/init',
                log: false
            });
        });
        it('sets the cookie', function () {
            sinon_1.assert.calledWith(setCookieFn, 'apimockid', plugin.ngApimockId, { log: false });
            sinon_1.assert.called(wrapFn);
        });
    });
    describe('setVariable', function () {
        var setVariablesFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setVariablesFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'setVariables');
                        setVariablesFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.setVariable('one', 'first')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () {
            setVariablesFn.restore();
        });
        it('sets the variable', function () {
            return sinon_1.assert.calledWith(setVariablesFn, { one: 'first' });
        });
    });
    describe('setVariables', function () {
        var variables;
        var invokeFn;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invokeFn = sinon_1.stub(cypress_plugin_1.CypressPlugin.prototype, 'invoke');
                        invokeFn.resolves({ body: { some: 'thing' } });
                        return [4 /*yield*/, plugin.setVariables({ 'one': 'first', 'two': 'second' })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return invokeFn.restore(); });
        it('sets the variables', function () {
            sinon_1.assert.calledWith(invokeFn, 'variables', 'PUT', { 'one': 'first', 'two': 'second' });
            sinon_1.assert.called(wrapFn);
        });
    });
});

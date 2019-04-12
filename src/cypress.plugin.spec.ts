import {assert, match, SinonStub, stub} from 'sinon';
import {CypressPlugin} from './cypress.plugin';
import {RequestObject} from "./request.object";

describe('CypressPlugin', () => {
    let requestFn: SinonStub;
    let setCookieFn: SinonStub;
    let wrapFn: SinonStub;
    let plugin: CypressPlugin;
    let deferredPromise: any;

    beforeEach(() => {
        requestFn = stub();
        setCookieFn = stub();
        wrapFn = stub();
        deferredPromise = {};

        (global as any)['cy'] = {
            request: requestFn,
            setCookie: setCookieFn,
            wrap: wrapFn
        };

        (global as any)['Cypress'] = {
            config: () => ({baseUrl: 'http://localhost:9000'})
        };

        plugin = new CypressPlugin();
    });

    describe('constructor', () => {
        it('sets the apimock id', () =>
            expect(plugin.ngApimockId).toBeDefined());

        it('sets the baseUrl', () =>
            expect(plugin.baseUrl).toBe('http://localhost:9000/ngapimock'));
    });

    describe('delayResponse', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves();

            await plugin.delayResponse('name', 1000);
        });

        afterEach(() => invokeFn.restore());

        it('delays the mock response', () => {
            assert.calledWith(invokeFn, 'mocks', 'PUT', {name: 'name', delay: 1000});
            assert.called(wrapFn);
        });
    });

    describe('deleteVariable', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves();

            await plugin.deleteVariable('one');
        });

        afterEach(() => invokeFn.restore());

        it('deletes the variable', () => {
            assert.calledWith(invokeFn, 'variables/one', 'DELETE', {});
            assert.called(wrapFn);
        });
    });

    describe('echoRequest', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves();

            await plugin.echoRequest('name', true);
        });

        afterEach(() => invokeFn.restore());

        it('enables the mock request echo', () => {
            assert.calledWith(invokeFn, 'mocks', 'PUT', {name: 'name', echo: true});
            assert.called(wrapFn);
        });
    });

    describe('getMocks', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.getMocks();
        });

        afterEach(() => invokeFn.restore());

        it('gets the mocks', () => {
            assert.calledWith(invokeFn, 'mocks', 'GET', {});
            assert.calledWith(wrapFn, {some: 'thing'});
        });
    });

    describe('getPresets', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.getPresets();
        });

        afterEach(() => invokeFn.restore());

        it('gets the presets', () => {
            assert.calledWith(invokeFn, 'presets', 'GET', {});
            assert.calledWith(wrapFn, {some: 'thing'});
        });
    });

    describe('getRecordings', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.getRecordings();
        });

        afterEach(() => invokeFn.restore());

        it('gets the recordings', () => {
            assert.calledWith(invokeFn, 'recordings', 'GET', {});
            assert.calledWith(wrapFn, {some: 'thing'});
        });
    });

    describe('getVariables', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.getVariables();
        });

        afterEach(() => invokeFn.restore());

        it('gets the variables', () => {
            assert.calledWith(invokeFn, 'variables', 'GET', {});
            assert.calledWith(wrapFn, {some: 'thing'});
        });
    });

    describe('invoke', () => {

        describe('throws an error when fetch returns non 200', () => {
            beforeEach(() => {
                requestFn.resolves(({status: 404}));
            });

            it('calls the api without body', async () => {
                try {
                    await plugin.invoke('some/query', 'GET', {some: 'body'});
                    fail();
                } catch (error) {
                    expect(error.message).toBe('An error occured while invoking http://localhost:9000/ngapimock/some/query that resulted in status code 404');
                }
            });
        });

        describe('method is GET', () => {
            beforeEach(() => {
                requestFn.resolves(({status: 200}));
                plugin.ngApimockId = '123';
            });

            it('calls the api without body', () => {
                plugin.invoke('some/query', 'GET', {some: 'body'});

                assert.calledWith(requestFn, match(async (actual: RequestObject) => {
                    expect(actual.method).toBe('GET');
                    expect(actual.url).toBe('http://localhost:9000/ngapimock/some/query');
                    expect(actual.log).toBe(false);
                    expect(actual.headers['Cookie']).toBe('apimockid=123');
                    expect(actual.headers['Content-Type']).toBe('application/json');
                    return expect(actual.body).toBeUndefined();
                }));
            });
        });

        describe('method is DELETE', () => {
            beforeEach(() => {
                requestFn.resolves(({status: 200}));
                plugin.ngApimockId = '123';
            });

            it('calls the api without body', () => {
                plugin.invoke('some/query', 'DELETE', {some: 'body'});

                assert.calledWith(requestFn, match(async (actual: RequestObject) => {
                    expect(actual.method).toBe('DELETE');
                    expect(actual.url).toBe('http://localhost:9000/ngapimock/some/query');
                    expect(actual.headers['Cookie']).toBe('apimockid=123');
                    expect(actual.headers['Content-Type']).toBe('application/json');
                    return expect(actual.body).toBeUndefined();
                }));
            });
        });

        describe('method is POST', () => {
            beforeEach(() => {
                requestFn.resolves(({status: 200}));
                plugin.ngApimockId = '123';
            });

            it('calls the api without body', () => {
                plugin.invoke('some/query', 'POST', {some: 'body'});

                assert.calledWith(requestFn, match(async (actual: RequestObject) => {
                    expect(actual.method).toBe('POST');
                    expect(actual.url).toBe('http://localhost:9000/ngapimock/some/query');
                    expect(actual.headers['Cookie']).toBe('apimockid=123');
                    expect(actual.headers['Content-Type']).toBe('application/json');
                    return expect(actual.body).toEqual({some: 'body'});
                }));
            });
        });

        describe('method is PUT', () => {
            beforeEach(() => {
                requestFn.resolves(({status: 200}));
                plugin.ngApimockId = '123';
            });

            it('calls the api without body', () => {
                plugin.invoke('some/query', 'PUT', {some: 'body'});

                assert.calledWith(requestFn, match(async (actual: RequestObject) => {
                    expect(actual.method).toBe('PUT');
                    expect(actual.url).toBe('http://localhost:9000/ngapimock/some/query');
                    expect(actual.headers['Cookie']).toBe('apimockid=123');
                    expect(actual.headers['Content-Type']).toBe('application/json');
                    return expect(actual.body).toEqual({some: 'body'});
                }));
            });
        });
    });

    describe('recordRequests', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.recordRequests(true);
        });

        afterEach(() => invokeFn.restore());

        it('enables the recording the requests', () => {
            assert.calledWith(invokeFn, 'actions', 'PUT', {action: 'record', record: true});
            assert.called(wrapFn);
        });
    });

    describe('resetMocksToDefault', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.resetMocksToDefault();
        });

        afterEach(() => invokeFn.restore());

        it('resets the mocks to defaults', () => {
            assert.calledWith(invokeFn, 'actions', 'PUT', {action: 'defaults'});
            assert.called(wrapFn);
        });
    });

    describe('selectPreset', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.selectPreset('preset name');
        });

        afterEach(() => invokeFn.restore());

        it('selects the preset', () => {
            assert.calledWith(invokeFn, 'presets', 'PUT', {name: 'preset name'});
            assert.called(wrapFn);
        });
    });

    describe('selectScenario', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.selectScenario('name', 'scenario');
        });

        afterEach(() => invokeFn.restore());

        it('selects the mock scenario', () => {
            assert.calledWith(invokeFn, 'mocks', 'PUT', {name: 'name', scenario: 'scenario'});
            assert.called(wrapFn);
        });
    });

    describe('setMocksToPassThrough', () => {
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.setMocksToPassThrough();
        });

        afterEach(() => invokeFn.restore());

        it('sets mocks to passThrough', () => {
            assert.calledWith(invokeFn, 'actions', 'PUT', {action: 'passThroughs'});
            assert.called(wrapFn);
        });
    });

    describe('setNgApimockCookie', () => {
        beforeEach(async () => {
            requestFn.resolves();
            setCookieFn.resolves();

            await plugin.setNgApimockCookie();
        });

        afterEach(() => {
            requestFn.reset();
            setCookieFn.reset();
        });

        it('opens the init url', () => {
            assert.calledWith(requestFn, {
                method: 'GET',
                url: 'http://localhost:9000/ngapimock/init',
                log: false
            });
        });

        it('sets the cookie', () => {
            assert.calledWith(setCookieFn, 'apimockid', plugin.ngApimockId, {log: false});
            assert.called(wrapFn);
        });
    });

    describe('setVariable', () => {
        let setVariablesFn: SinonStub;

        beforeEach(async () => {
            setVariablesFn = stub(CypressPlugin.prototype, 'setVariables');
            setVariablesFn.resolves({body: {some: 'thing'}});

            await plugin.setVariable('one', 'first');
        });

        afterEach(() => {
            setVariablesFn.restore();
        });

        it('sets the variable', () =>
            assert.calledWith(setVariablesFn, {one: 'first'}));
    });

    describe('setVariables', () => {
        let variables: { [key: string]: string };
        let invokeFn: SinonStub;

        beforeEach(async () => {
            invokeFn = stub(CypressPlugin.prototype, 'invoke');
            invokeFn.resolves({body: {some: 'thing'}});

            await plugin.setVariables({'one': 'first', 'two': 'second'});
        });

        afterEach(() => invokeFn.restore());

        it('sets the variables', () => {
            assert.calledWith(invokeFn, 'variables', 'PUT', {'one': 'first', 'two': 'second'});
            assert.called(wrapFn);
        });
    });
});
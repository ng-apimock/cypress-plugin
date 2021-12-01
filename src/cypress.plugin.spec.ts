import * as bluebird from 'bluebird';
import { EventEmitter2 } from 'eventemitter2';

import { CypressPlugin } from './cypress.plugin';

function promisify(chain: any) {
    return new Promise((resolve) => {
        function resolvePromise(value: any) {
            resolve(value);
        }

        chain.then(resolvePromise);
    });
}

describe('CypressPlugin', () => {
    let getCookieFn: jest.Mock;
    let requestFn: jest.Mock;
    let setCookieFn: jest.Mock;
    let wrapFn: jest.Mock;
    let plugin: CypressPlugin;
    const eventemitter2 = new EventEmitter2();

    beforeEach(() => {
        getCookieFn = jest.fn();
        requestFn = jest.fn();
        setCookieFn = jest.fn();
        wrapFn = jest.fn();

        (global as any)['cy'] = {
            getCookie: getCookieFn,
            request: requestFn,
            setCookie: setCookieFn,
            wrap: wrapFn
        };

        (global as any)['Cypress'] = {
            env: (envName: string) => {
                const envVars: { [key: string]: string } = {
                    NG_API_MOCK_BASE_URL: 'http://localhost:9000',
                    NG_API_MOCK_ENABLE_LOGS: 'false'
                };
                return envVars[envName];
            },
            Promise: bluebird,
            on: eventemitter2.on.bind(eventemitter2),
            off: eventemitter2.off.bind(eventemitter2)
        };

        plugin = new CypressPlugin();
    });

    describe('constructor', () => {
        describe('defaults', () => {
            beforeEach(() => {
                (global as any)['Cypress'].env = (envName: string) => {
                    const envVars: { [key: string]: string } = {
                        NG_API_MOCK_BASE_URL: 'http://localhost:9000'
                    };
                    return envVars[envName];
                };
                plugin = new CypressPlugin();
            });

            it('sets the baseUrl', () => expect(plugin.baseUrl).toBe('http://localhost:9000/ngapimock'));

            it('sets the logging option', () => expect(plugin.isLogsEnabled).toBe(true));

            it('sets the https agent', () => expect((plugin as any).agent).toBeDefined());
        });

        describe('overrides', () => {
            beforeEach(() => {
                (global as any)['Cypress'].env = (envName: string) => {
                    const envVars: { [key: string]: any } = {
                        NG_API_MOCK_BASE_URL: 'http://localhost:9000',
                        NG_API_MOCK_ENABLE_LOGS: false,
                        NG_API_MOCK_BASE_PATH: 'myapimock'
                    };
                    return envVars[envName];
                };
                plugin = new CypressPlugin();
            });

            it('sets the baseUrl', () => expect(plugin.baseUrl).toBe('http://localhost:9000/myapimock'));

            it('sets the logging option', () => expect(plugin.isLogsEnabled).toBe(false));

            it('uses default logging option', () => {
                (global as any)['Cypress'].env = (envName: string) => {
                    const envVars: { [key: string]: string } = {
                        NG_API_MOCK_BASE_URL: 'http://localhost:9000'
                    };
                    return envVars[envName];
                };
                plugin = new CypressPlugin();
                expect(plugin.isLogsEnabled).toBe(true);
            });

            it('sets the https agent', () => expect((plugin as any).agent).toBeDefined());
        });

        describe('invalid', () => {
            beforeEach(() => {
                (global as any)['Cypress'].env = (envName: string) => {
                    const envVars: { [key: string]: any } = {
                        NG_API_MOCK_BASE_URL: 'http://localhost:9000',
                        NG_API_MOCK_ENABLE_LOGS: 'fail'
                    };
                    return envVars[envName];
                };
            });

            it('throws on the wrong logging option', () => {
                // eslint-disable-next-line no-new
                expect(() => {
                    // eslint-disable-next-line no-new
                    new CypressPlugin();
                })
                    .toThrowError('Unexpected value for NG_API_MOCK_ENABLE_LOGS env var, please provide string value: `true` or `false`');
            });
        });
    });

    describe('createPreset', () => {
        let invokeFn: jest.Mock;
        let getMocksFn: jest.Mock;
        let getVariablesFn: jest.Mock;

        beforeEach(() => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());
            getMocksFn = plugin.getMocks = jest.fn();
            getVariablesFn = plugin.getVariables = jest.fn();

            getMocksFn.mockResolvedValue({ state: { name: 'my-mock' } });
            getVariablesFn.mockResolvedValue({ state: { name: 'my-variable' } });
        });

        it('persists the preset with mocks and variables', async () => {
            await promisify(plugin.createPreset('my-preset', true, true));

            expect(invokeFn).toHaveBeenCalledWith('presets', 'POST', {
                name: 'my-preset',
                mocks: { name: 'my-mock' },
                variables: { name: 'my-variable' }
            });
        });

        it('persists the preset with mocks and without variables', async () => {
            await promisify(plugin.createPreset('my-preset', true, false));

            expect(invokeFn).toHaveBeenCalledWith('presets', 'POST', {
                name: 'my-preset',
                mocks: { name: 'my-mock' },
                variables: { }
            });
        });

        it('persists the preset with out mocks and with variables', async () => {
            await promisify(plugin.createPreset('my-preset', false, true));

            expect(invokeFn).toHaveBeenCalledWith('presets', 'POST', {
                name: 'my-preset',
                mocks: { },
                variables: { name: 'my-variable' }
            });
        });
    });

    describe('delayResponse', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.delayResponse('name', 1000));
        });

        it('delays the mock response', () => {
            expect(invokeFn).toHaveBeenCalledWith('mocks', 'PUT', { name: 'name', delay: 1000 });
            expect(wrapFn).toHaveBeenCalled();
        });
    });

    describe('deleteVariable', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.deleteVariable('one'));
        });

        it('deletes the variable', () => {
            expect(invokeFn).toHaveBeenCalledWith('variables/one', 'DELETE', {});
            expect(wrapFn).toHaveBeenCalled();
        });
    });

    describe('echoRequest', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.echoRequest('name', true));
        });

        it('enables the mock request echo', () => {
            expect(invokeFn).toHaveBeenCalledWith('mocks', 'PUT', { name: 'name', echo: true });
            expect(wrapFn).toHaveBeenCalled();
        });
    });

    describe('getMocks', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockResolvedValue({ body: { some: 'thing' } });

            await promisify(plugin.getMocks());
        });

        it('gets the mocks', () => {
            expect(invokeFn).toHaveBeenCalledWith('mocks', 'GET', {});
            expect(wrapFn).toHaveBeenCalledWith({ some: 'thing' });
        });
    });

    describe('getPresets', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockResolvedValue({ body: { some: 'thing' } });

            await promisify(plugin.getPresets());
        });

        it('gets the presets', () => {
            expect(invokeFn).toHaveBeenCalledWith('presets', 'GET', {});
            expect(wrapFn).toHaveBeenCalledWith({ some: 'thing' });
        });
    });

    describe('getRecordings', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockResolvedValue({ body: { some: 'thing' } });

            await promisify(plugin.getRecordings());
        });

        it('gets the recordings', () => {
            expect(invokeFn).toHaveBeenCalledWith('recordings', 'GET', {});
            expect(wrapFn).toHaveBeenCalledWith({ some: 'thing' });
        });
    });

    describe('getVariables', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockResolvedValue({ body: { some: 'thing' } });

            await promisify(plugin.getVariables());
        });

        it('gets the variables', () => {
            expect(invokeFn).toHaveBeenCalledWith('variables', 'GET', {});
            expect(wrapFn).toHaveBeenCalledWith({ some: 'thing' });
        });
    });

    describe('invoke', () => {
        describe('throws an error when fetch returns non 200', () => {
            beforeEach(() => {
                requestFn.mockResolvedValue({ status: 404 });
            });

            it('calls the api without body', async () => {
                await expect(plugin.invoke('some/query', 'GET', { some: 'body' }))
                    .rejects
                    .toThrowError('An error occured while invoking http://localhost:9000/ngapimock/some/query '
                        + 'that resulted in status code 404');
            });
        });

        describe('method is GET', () => {
            beforeEach(() => {
                requestFn.mockResolvedValue({ status: 200 });
            });

            it('calls the api without body', () => {
                plugin.invoke('some/query', 'GET', { some: 'body' });

                expect(requestFn).toHaveBeenCalled();

                const actualRequest = requestFn.mock.calls[0][0];
                expect(actualRequest.url).toBe('http://localhost:9000/ngapimock/some/query');
                expect(actualRequest.method).toBe('GET');
                expect((actualRequest as any).agent).toBeUndefined();
                expect(actualRequest.headers['Content-Type']).toBe('application/json');
                expect(actualRequest.body).toBeUndefined();
            });
        });

        describe('method is HEAD', () => {
            beforeEach(() => {
                requestFn.mockResolvedValue({ status: 200 });
            });

            it('calls the api without body', () => {
                plugin.invoke('some/query', 'HEAD', { some: 'body' });

                expect(requestFn).toHaveBeenCalled();

                const actualRequest = requestFn.mock.calls[0][0];
                expect(actualRequest.url).toBe('http://localhost:9000/ngapimock/some/query');
                expect(actualRequest.method).toBe('HEAD');
                expect((actualRequest as any).agent).toBeUndefined();
                expect(actualRequest.headers['Content-Type']).toBe('application/json');
                expect(actualRequest.body).toBeUndefined();
            });
        });

        describe('method is POST', () => {
            beforeEach(() => {
                requestFn.mockResolvedValue({ status: 200 });
            });

            it('calls the api without body', () => {
                plugin.invoke('some/query', 'POST', { some: 'body' });

                expect(requestFn).toHaveBeenCalled();

                const actualRequest = requestFn.mock.calls[0][0];
                expect(actualRequest.url).toBe('http://localhost:9000/ngapimock/some/query');
                expect(actualRequest.method).toBe('POST');
                expect((actualRequest as any).agent).toBeUndefined();
                expect(actualRequest.headers['Content-Type']).toBe('application/json');
                expect(actualRequest.body).toEqual({ some: 'body' });
            });
        });

        describe('method is PUT', () => {
            beforeEach(() => {
                requestFn.mockResolvedValue({ status: 200 });
            });

            it('calls the api without body', () => {
                plugin.invoke('some/query', 'PUT', { some: 'body' });

                expect(requestFn).toHaveBeenCalled();

                const actualRequest = requestFn.mock.calls[0][0];
                expect(actualRequest.url).toBe('http://localhost:9000/ngapimock/some/query');
                expect(actualRequest.method).toBe('PUT');
                expect((actualRequest as any).agent).toBeUndefined();
                expect(actualRequest.headers['Content-Type']).toBe('application/json');
                expect(actualRequest.body).toEqual({ some: 'body' });
            });
        });

        describe('protocal is https', () => {
            beforeEach(() => {
                requestFn.mockResolvedValue({ status: 200 });

                plugin.baseUrl = 'https://localhost:9000';
            });

            it('calls the api without body', () => {
                plugin.invoke('https://some/query', 'GET', { some: 'body' });

                expect(requestFn).toHaveBeenCalled();

                // const actualRequest = requestFn.mock.calls[0][0];
                // expect(actualRequest.url).toBe('http://localhost:9000/ngapimock/some/query');
                // expect(actualRequest.method).toBe('PUT');
                // expect((actualRequest as any).agent).toBeUndefined();
                // expect(actualRequest.headers['Content-Type']).toBe('application/json');
                // expect(actualRequest.body).toEqual({ some: 'body' });
            });
        });
    });

    describe('recordRequests', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.recordRequests(true));
        });

        it('enables the recording the requests', () => {
            expect(invokeFn).toHaveBeenCalledWith('actions', 'PUT', {
                action: 'record',
                record: true
            });
            expect(wrapFn).toHaveBeenCalled();
        });
    });

    describe('resetMocksToDefault', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.resetMocksToDefault());
        });

        it('resets the mocks to defaults', () => {
            expect(invokeFn).toHaveBeenCalledWith('actions', 'PUT', { action: 'defaults' });
            expect(wrapFn).toHaveBeenCalled();
        });
    });

    describe('selectPreset', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.selectPreset('preset name'));
        });

        it('selects the preset', () => {
            expect(invokeFn).toHaveBeenCalledWith('presets', 'PUT', { name: 'preset name' });
            expect(wrapFn).toHaveBeenCalled();
        });
    });

    describe('selectScenario', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.selectScenario('name', 'scenario'));
        });

        it('selects the mock scenario', () => {
            expect(invokeFn).toHaveBeenCalledWith('mocks', 'PUT', {
                name: 'name',
                scenario: 'scenario'
            });
            expect(wrapFn).toHaveBeenCalled();
        });
    });

    describe('setMocksToPassThrough', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.setMocksToPassThrough());
        });

        it('sets mocks to passThrough', () => {
            expect(invokeFn).toHaveBeenCalledWith('actions', 'PUT', { action: 'passThroughs' });
            expect(wrapFn).toHaveBeenCalled();
        });
    });

    describe('setNgApimockCookie', () => {
        describe('defaults', () => {
            beforeEach(async () => {
                getCookieFn.mockResolvedValue(Promise.resolve(null));
                requestFn.mockResolvedValue(Promise.resolve());
                setCookieFn.mockResolvedValue(Promise.resolve());

                await promisify(plugin.setNgApimockCookie());
            });

            it('sets the apimock id', () => expect(plugin.ngApimockId).toBeDefined());

            it('opens the init url', () => expect(requestFn).toHaveBeenCalledWith('http://localhost:9000/ngapimock/init'));

            it('sets the cookie', () => expect(setCookieFn).toHaveBeenCalledWith('apimockid', plugin.ngApimockId));
        });

        describe('override', () => {
            beforeEach(async () => {
                getCookieFn.mockResolvedValue(Promise.resolve(null));
                requestFn.mockResolvedValue(Promise.resolve());
                setCookieFn.mockResolvedValue(Promise.resolve());

                (global as any)['Cypress'].env = (envName: string) => {
                    const envVars: { [key: string]: any } = {
                        NG_API_MOCK_BASE_IDENTIFIER: 'awesomemock',
                        NG_API_MOCK_BASE_URL: 'http://localhost:9000',
                        NG_API_MOCK_BASE_PATH: 'myapimock'
                    };
                    return envVars[envName];
                };

                plugin = new CypressPlugin();
                plugin.ngApimockId = '123';

                await promisify(plugin.setNgApimockCookie());
            });

            it('opens the init url', () => expect(requestFn).toHaveBeenCalledWith('http://localhost:9000/myapimock/init'));

            it('sets the cookie', () => expect(setCookieFn).toHaveBeenCalledWith('awesomemock', plugin.ngApimockId));
        });

        describe('already set cookie', () => {
            beforeEach(async () => {
                getCookieFn.mockResolvedValue(Promise.resolve({ value: '1234' }));
                requestFn.mockResolvedValue(Promise.resolve());
                setCookieFn.mockResolvedValue(Promise.resolve());

                (global as any)['Cypress'].env = (envName: string) => {
                    const envVars: { [key: string]: any } = {
                        NG_API_MOCK_BASE_IDENTIFIER: 'awesomemock',
                        NG_API_MOCK_BASE_URL: 'http://localhost:9000',
                        NG_API_MOCK_BASE_PATH: 'myapimock'
                    };
                    return envVars[envName];
                };

                plugin = new CypressPlugin();
                plugin.ngApimockId = '123';

                await promisify(plugin.setNgApimockCookie());
            });

            it('sets the apimock id back to the cookie value', () => expect(plugin.ngApimockId).toBe('1234'));

            it('sets the cookie', () => expect(setCookieFn).not.toHaveBeenCalled());
        });
    });

    describe('setVariable', () => {
        // let setVariablesFn: jest.Mock;
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.setVariable('one', 'first'));
        });

        it('sets the variable', () => {
            expect(invokeFn).toHaveBeenCalledWith('variables', 'PUT', {
                one: 'first'
            });
        });
    });

    describe('setVariables', () => {
        let invokeFn: jest.Mock;

        beforeEach(async () => {
            invokeFn = plugin.invoke = jest.fn();
            invokeFn.mockReturnValue(Promise.resolve());

            await promisify(plugin.setVariables({ one: 'first', enabled: true }));
        });

        it('sets the variables', () => {
            expect(invokeFn).toHaveBeenCalledWith('variables', 'PUT', {
                one: 'first',
                enabled: true
            });
            expect(wrapFn).toHaveBeenCalled();
        });
    });
});

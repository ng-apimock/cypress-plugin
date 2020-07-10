# ng-apimock/cypress-plugin [![npm](https://img.shields.io/npm/v/@ng-apimock/cypress-plugin?color=brightgreen)](https://www.npmjs.com/package/@ng-apimock/cypress-plugin) [![Build Status](https://github.com/ng-apimock/cypress-plugin/workflows/CI/badge.svg)](https://github.com/ng-apimock/cypress-plugin/actions?workflow=CI) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ng-apimock_cypress-plugin&metric=alert_status)](https://sonarcloud.io/dashboard?id=ng-apimock_cypress-plugin) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-brightgreen.svg)](https://github.com/semantic-release/semantic-release) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=ng-apimock/cypress-plugin)](https://dependabot.com) [![dependency Status](https://img.shields.io/david/ng-apimock/cypress-plugin.svg)](https://david-dm.org/ng-apimock/cypress-plugin) [![devDependency Status](https://img.shields.io/david/dev/ng-apimock/cypress-plugin.svg)](https://david-dm.org/ng-apimock/cypress-plugin#info=devDependencies) ![npm downloads](https://img.shields.io/npm/dm/@ng-apimock/cypress-plugin)
The cypress plugin for ng-apimock. 

### Usage
This plugin connects to ng-apimock and makes the plugin functions available within the tests.

1. Enable this plugin in your supports file:

```js
require('@ng-apimock/cypress-plugin').load();
```

2. Add environment variables to `cypress.json` configuration file

Use **NG_API_MOCK_ENABLE_LOGS** with a string value of "true" or "false". Default: "true".
Use **NG_API_MOCK_BASE_URL** with a string value of base url of your ng-apimock server

```js
{
  "env": {
    "NG_API_MOCK_BASE_IDENTIFIER": "my-identifier", // optional: defaults to apimockId (the cookie identifier)
    "NG_API_MOCK_BASE_URL": "http://localhost:3000",
    "NG_API_MOCK_BASE_PATH": "myapimock", // optional: defaults to ngapimock (path on which ngapimock listens)
    "NG_API_MOCK_ENABLE_LOGS": "false"
  }
}
```

3. After registering the plugin and adding environment variables to Cypress config, you can use it in your tests by calling it like this:

```js
describe('Some test', () => {
    it('does something', () => 
        cy.selectScenario('my-mock-name', 'some-scenario'));
});
```

### Available plugin functions
The following functions are available. Each plugin function returns a promise.

##### initializeNgApimock(): Promise<any>;
Initializes apimock for concurrent testing. (sets a cookie)
[@ng-apimock/core](https://github.com/ng-apimock/core) uses a cookie to make sure that parallel tests don't intervene with each other).

##### selectScenario(name: string, scenario: string): Promise<any>;
Selects the given scenario (when calling this function without a scenario or with 'passThrough' as scenario name, the call will be passed through to the actual backend).

##### delayResponse(mockName: string, delay: number): Promise<any>;
Sets the delay time in milliseconds for the mock. This makes sure the response is delayed. The delay set here overrides the delay defined in the response mock.

##### echoRequest(name: string, echo: boolean): Promise<any>; 
Sets the indicator which enables / disables the request logging.

##### setVariable(key: string, value: any): Promise<any>;
Adds or updates the global variable.
    
##### setVariables(variables: {[key: string]: any;}): Promise<any>;
Adds or updates the global variables  ie. {'some':'value', 'another': 'value'}.
    
##### deleteVariable(key: string): Promise<any>;
Deletes the global variable.

##### resetMocksToDefault(): Promise<any>;
Resets all the mocks to the default state.

##### setMocksToPassThrough(): Promise<any>;
Sets all the mocks to pass through.

##### setPreset(name: string): Promise<any>;
Sets the mocks and variables in the selected state.

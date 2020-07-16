[![npm](https://img.shields.io/npm/v/@ng-apimock/cypress-plugin?color=brightgreen)](https://www.npmjs.com/package/@ng-apimock/cypress-plugin) [![Build Status](https://github.com/ng-apimock/cypress-plugin/workflows/CI/badge.svg)](https://github.com/ng-apimock/cypress-plugin/actions?workflow=CI) <br />
[@ng-apimock/cypress-plugin](https://github.com/ng-apimock/cypress-plugin) is the [cypress](https://www.cypress.io/) plugin for [@ng-apimock/core](https://github.com/ng-apimock/core).

This plugin connects to [@ng-apimock/core](https://github.com/ng-apimock/core) middelware and makes the all its features available in the tests.

## Requirements

see Ng-apimock [requirements](/docs/#requirements)

## Installing using npm / yarn
```bash
npm install @ng-apimock/cypress-plugin --save-dev
```
or 

```bash
yarn add @ng-apimock/cypress-plugin --dev
```

## Usage
Once the plugin has been installed, enable this plugin in your supports file

```js
require('@ng-apimock/cypress-plugin').load();
```

### Plugin configuration
Add environment variables to `cypress.json` configuration file

```
{
  "env": {
    "NG_API_MOCK_BASE_IDENTIFIER": "my-identifier", // optional: defaults to apimockId (the cookie identifier)
    "NG_API_MOCK_BASE_URL": "http://localhost:3000",
    "NG_API_MOCK_BASE_PATH": "myapimock", // optional: defaults to ngapimock (path on which ngapimock listens)
    "NG_API_MOCK_ENABLE_LOGS": "false"
  }
}
```

## Using in tests
Now you can use it.

```typescript
describe('Some test', () => {
    it('does something', () => 
        cy.selectScenario('my-mock-name', 'some-scenario'));
});
``` 

## API 
See [API](/docs/api/select-scenario)

declare namespace Cypress {
  interface Chainable<Subject = any> {
      createPreset(name: string, includeMocks: boolean, includeVariables: boolean): Cypress.Chainable<any> ;
      delayResponse(name: string, delay: number): Cypress.Chainable<any>;
      deleteVariable(key: string): Cypress.Chainable<any>;
      echoRequest(name: string, echo: boolean): Cypress.Chainable<any>;
      getMocks(): Cypress.Chainable<any>;
      getPresets(): Cypress.Chainable<any>;
      getRecordings(): Cypress.Chainable<any>;
      getVariables(): Cypress.Chainable<any>;
      initializeNgApimock(): Cypress.Chainable<any>;
      invoke(query: string, method: string, body: any): Cypress.Chainable<any>;
      recordRequests(record: boolean): Cypress.Chainable<any>;
      resetMocksToDefault(): Cypress.Chainable<any>;
      selectPreset(name: string): Cypress.Chainable<any>;
      selectScenario(name: string, scenario: string): Cypress.Chainable<any>;
      setMocksToPassThrough(): Cypress.Chainable<any>;
      setVariable(key: string, value: any): Cypress.Chainable<any>;
      setVariables(variables: { [key: string]: any }): Cypress.Chainable<any>;
  }
}

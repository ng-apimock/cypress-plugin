declare namespace Cypress {
  interface Chainable<Subject = any> {
      delayResponse(name: string, delay: number): Promise<any>;
      deleteVariable(key: string): Promise<any>;
      echoRequest(name: string, echo: boolean): Promise<any>;
      getMocks(): Promise<any>;
      getPresets(): Promise<any>;
      getRecordings(): Promise<any>;
      getVariables(): Promise<any>;
      invoke(query: string, method: string, body: any): Promise<any>;
      recordRequests(record: boolean): Promise<any>;
      resetMocksToDefault(): Promise<any>;
      selectPreset(name: string): Promise<any>;
      selectScenario(name: string, scenario: string): Promise<any>;
      setMocksToPassThrough(): Promise<any>;
      setVariable(key: string, value: string): Promise<any>;
      setVariables(variables: { [key: string]: string }): Promise<any>;
  }
}
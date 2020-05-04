import {CypressPlugin} from './cypress.plugin';

/** Load the commands. */
function load() {
    const plugin = new CypressPlugin();

    Cypress.Commands.add("delayResponse", (name: string, delay: number) => {
        plugin.delayResponse(name, delay);
    });

    Cypress.Commands.add("deleteVariable", (name: string) => {
        plugin.deleteVariable(name);
    });

    Cypress.Commands.add("echoRequest", (name: string, echo: boolean) => {
        plugin.echoRequest(name, echo);
    });

    Cypress.Commands.add("getMocks", () => {
        plugin.getMocks();
    });

    Cypress.Commands.add("getPresets", () => {
        plugin.getPresets();
    });

    Cypress.Commands.add("getRecordings", () => {
        plugin.getRecordings();
    });

    Cypress.Commands.add("getVariables", () => {
        plugin.getVariables();
    });

    Cypress.Commands.add("recordRequests", (record: boolean) => {
        plugin.recordRequests(record);
    });

    Cypress.Commands.add("resetMocksToDefault", () => {
        plugin.resetMocksToDefault();
    });

    Cypress.Commands.add("selectPreset", (name: string) => {
        plugin.selectPreset(name);
    });

    Cypress.Commands.add("selectScenario", (name: string, scenario: string) => {
        plugin.selectScenario(name, scenario);
    });

    Cypress.Commands.add("setMocksToPassThrough", () => {
        plugin.setMocksToPassThrough();
    });

    Cypress.Commands.add("setVariable", (key: string, value: string) => {
        plugin.setVariable(key, value);
    });

    Cypress.Commands.add("setVariables", (variables: { [key: string]: string }) => {
        plugin.setVariables(variables);
    });
}

module.exports = {
    load: load,
};

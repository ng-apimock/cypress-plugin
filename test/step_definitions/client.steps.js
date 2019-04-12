import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {expect} from "chai";

Given(/^ng-apimock has been initialized$/, initializeNgApimock);
Given(/^the following mocks state:$/, checkMocksState);
Given(/^the following variables state:$/, checkVariablesState);

When(/^I add variable (.*) with value (.*)/, addVariable);
When(/^I delete variable (.*)/, deleteVariable);
When(/^I select scenario (.*) for mock (.*)$/, selectScenario);
When(/^I select the preset (.*)/, selectPreset);
When(/^I set delay to (\d+) for mock (.*)$/, delayResponse);
When(/^I set the mocks to passThroughs$/, setMocksToPassThrough);
When(/^I reset the mocks to default$/, resetMocksToDefault);
When(/^I update variable (.*) with value (.*)/, updateVariable);
When(/^I wait a (\d+) milliseconds$/, waitSeconds);

function addVariable(key, value) {
    return cy.setVariable(key, value);
}

function checkMocksState(dataTable) {
    return cy
        .then(() => {
                cy.getMocks().then((mocks) => {
                    dataTable.rows()
                        .forEach((row) => expect(mocks.state[row[0]].scenario).to.equal(row[1]))
                })
            }
        );
}

function checkVariablesState(dataTable) {
    return cy.getVariables()
        .then((variables) => dataTable.rows()
            .forEach((row) => expect(variables.state[row[0]]).to.equal(row[1])));
}

function delayResponse(delay, name) {
    return cy.delayResponse(name, parseInt(delay))
}

function deleteVariable(key) {
    return cy.deleteVariable(key);
}

function initializeNgApimock() {
    return cy.resetMocksToDefault().then(() => cy.initializeNgApimock());
}

function resetMocksToDefault() {
    return cy.resetMocksToDefault();
}

function selectPreset(name) {
    return cy.selectPreset(name);
}

function selectScenario(scenario, name) {
    return cy.selectScenario(name, scenario);
}

function setMocksToPassThrough() {
    return cy.setMocksToPassThrough();
}

function updateVariable(key, value) {
    return cy.setVariable(key, value);
}

function waitSeconds(wait) {
    return cy.wait(wait)
}

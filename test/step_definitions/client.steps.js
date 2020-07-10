import { expect } from 'chai';
import { Given, When } from 'cypress-cucumber-preprocessor/steps';

Given(/^ng-apimock has been initialized$/, () => cy.initializeNgApimock()
    .then(() => cy.resetMocksToDefault()));

Given(/^the following mocks state:$/, (dataTable) => cy
    .then(() => {
        cy.getMocks().then((mocks) => {
            dataTable.rows()
                .forEach((row) => expect(mocks.state[row[0]].scenario).to.equal(row[1]));
        });
    }));

Given(/^the following variables state:$/, (dataTable) => {
    cy.getVariables()
        .then((variables) => dataTable.rows()
            .forEach((row) => expect(variables.state[row[0]]).to.equal(row[1])));
});

When(/^I add variable (.*) with value (.*)/, (key, value) => cy.setVariable(key, value));

When(/^I delete variable (.*)/, (key) => cy.deleteVariable(key));

When(/^I select scenario (.*) for mock (.*)$/,
    (scenario, name) => cy.selectScenario(name, scenario));

When(/^I select the preset (.*)/, (name) => cy.selectPreset(name));

When(/^I set delay to (\d+) for mock (.*)$/,
    (delay, name) => cy.delayResponse(name, parseInt(delay)));

When(/^I set the mocks to passThroughs$/, () => cy.setMocksToPassThrough());

When(/^I reset the mocks to default$/, () => cy.resetMocksToDefault());

When(/^I update variable (.*) with value (.*)/, (key, value) => cy.setVariable(key, value));

When(/^I wait a (\d+) milliseconds$/, (wait) => cy.wait(wait));

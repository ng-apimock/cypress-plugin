import { expect } from 'chai';
import { After, Given, When } from 'cypress-cucumber-preprocessor/steps';

Given(/^ng-apimock has been initialized$/,
    () => cy.initializeNgApimock());

Given(/^the following mocks state:$/, (dataTable) => cy
    .then(() => {
        cy.getMocks().then((mocks) => {
            dataTable.rows()
                .forEach((row) => expect(mocks.state[row[0]].scenario).to.equal(row[1]));
        });
    }));

Given(/^the following presets are present:$/, (dataTable) => {
    const hashes = dataTable.hashes();
    hashes.forEach((h, index) => {
        cy.getPresets().then((p) => {
            const preset = p.presets[index];
            expect(preset.name).to.equal(h.name);
            expect(Object.keys(preset.mocks).length).to.equal(parseInt(h.mocks));
            expect(Object.keys(preset.variables).length).to.equal(parseInt(h.variables));
        });
    });
});

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

When(/^I select the preset (.*)/, (name) => cy.selectPreset(name));

When(/^I create a preset (.*) with mocks and variables/,
    (name) => cy.createPreset(name, true, true));

When(/^I create a preset (.*) with mocks and without variables/,
    (name) => cy.createPreset(name, true, false));

When(/^I create a preset (.*) without mocks and with variables/,
    (name) => cy.createPreset(name, false, true));

After(() => {
    cy.resetMocksToDefault();
    cy.exec('yarn cleanup');
});

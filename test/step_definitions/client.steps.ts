import { After, Given, When } from '@badeball/cypress-cucumber-preprocessor';
import { expect } from 'chai';

Given(/^ng-apimock has been initialized$/,
    () => cy.initializeNgApimock());

Given(/^the following mocks state:$/, (dataTable: any) => cy
    .then(() => {
        cy.getMocks().then((mocks: any) => {
            dataTable.rows()
                .forEach((row: any) => expect(mocks.state[row[0]].scenario).to.equal(row[1]));
        });
    }));

Given(/^the following presets are present:$/, (dataTable: any) => {
    const hashes = dataTable.hashes();
    hashes.forEach((h: Record<string, string>, index: number) => {
        cy.getPresets().then((p: any) => {
            const preset = p.presets[index];
            expect(preset.name).to.equal(h.name);
            expect(Object.keys(preset.mocks).length).to.equal(parseInt(h.mocks));
            expect(Object.keys(preset.variables).length).to.equal(parseInt(h.variables));
        });
    });
});

Given(/^the following variables state:$/, (dataTable: any) => {
    cy.getVariables()
        .then((variables: any) => dataTable.rows()
            .forEach((row: any) => expect(variables.state[row[0]]).to.equal(row[1])));
});

When(/^I add variable (.*) with value (.*)/, (key: string, value: string) => cy.setVariable(key, value));

When(/^I delete variable (.*)/, (key: string) => cy.deleteVariable(key));

When(/^I select scenario (.*) for mock (.*)$/,
    (scenario: string, name: string) => cy.selectScenario(name, scenario));

When(/^I set delay to (\d+) for mock (.*)$/,
    (delay: string, name: string) => cy.delayResponse(name, parseInt(delay)));

When(/^I set the mocks to passThroughs$/, () => cy.setMocksToPassThrough());

When(/^I reset the mocks to default$/, () => cy.resetMocksToDefault());

When(/^I update variable (.*) with value (.*)/, (key: string, value: any) => cy.setVariable(key, value));

When(/^I wait a (\d+) milliseconds$/, (wait: number) => cy.wait(wait));

When(/^I select the preset (.*)/, (name: string) => cy.selectPreset(name));

When(/^I create a preset (.*) with mocks and variables/,
    (name: string) => cy.createPreset(name, true, true));

When(/^I create a preset (.*) with mocks and without variables/,
    (name: string) => cy.createPreset(name, true, false));

When(/^I create a preset (.*) without mocks and with variables/,
    (name: string) => cy.createPreset(name, false, true));

After(() => {
    cy.resetMocksToDefault();
    cy.exec('yarn cleanup');
});

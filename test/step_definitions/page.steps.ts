import {
    Before, Given, Then, When
} from '@badeball/cypress-cucumber-preprocessor';

import { PagePO } from '../pos/page.po';

Before(() => Cypress.automation('remote:debugger:protocol', {
    command: 'Network.clearBrowserCache' // we don't want to have cached responses
}));

Given(/^I open the page$/, () => {
    PagePO.navigate();
});

Given(/^I refresh/, () => {
    cy.get('body').type('{esc}');
    PagePO.refresh();
});

Given(/^I try to create a repository/, () => {
    PagePO.navigate('/#/repos;action=new');
    PagePO.repositoryName.clear();
    PagePO.repositoryName.type('some-awesome-plugin');
    PagePO.repositoryDescription.type('Some awesome plugin');
    PagePO.createRepository.click();
});

When(/^I download the readme for the repository (.*)$/,
    (repository) => PagePO.downloadReadmeForRepository(repository));

Then(/^the following repositories are shown:$/, (dataTable: any) => {
    const hashes = dataTable.hashes();

    hashes.forEach((h: Record<string, string>, index: number) => {
        Object.keys(hashes[0]).forEach((f) => {
            PagePO.repositories.then(() => cy.get(`mat-row>.mat-column-${f}`))
                .eq(index)
                .should('contain', h[f]);
        });
    });
});

Then(/^the repository is added$/, () => {
    const addedRepositoryName = 'some-awesome-plugin';
    PagePO.repositories.then(() => cy.get('mat-row>.mat-column-name')
        .should('contain', addedRepositoryName));
});

When(/^An error with message (.*) has occured$/, (message: string) => {
    PagePO.error().should('contain', message);
    cy.get('body').type('{esc}');
});

Then(/^the repositories are fetched$/, () => PagePO.repositories.should('exist'));

Then(/^the repositories are not yet fetched$/, () => PagePO.repositories.should('not.exist'));

Then(/^the README is downloaded$/, () => {
    const downloadsFolder = Cypress.config('downloadsFolder') + '/README.md';

    cy.readFile(downloadsFolder, 'binary', { timeout: 15000 })
        .should((buffer) => expect(buffer.length).to.be.gt(1));
});

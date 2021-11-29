class PagePO {
    static get repositories() {
        return cy.get('.repositories');
    }

    static get repositoryName() {
        return cy.get('input[formcontrolname=\'name\']');
    }

    static get repositoryDescription() {
        return cy.get('input[formcontrolname=\'description\']');
    }

    static get createRepository() {
        return cy.get('button:contains("Submit")');
    }

    static downloadReadmeForRepository(name) {
        this.repositories
            .then(() => cy.get('mat-row>.mat-column-name'))
            .contains(name).parent()
            .within(() => cy.get('button:contains("Download readme")').click());
    }

    static navigate(destination = '/index.html') {
        cy.visit(destination);
    }

    static refresh() {
        return cy.get('button:contains("Refresh")').click();
    }

    static error() {
        return cy.get('.mat-dialog-title');
    }
}

module.exports = {
    PagePO
};

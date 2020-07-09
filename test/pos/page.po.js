const { PageButtons } = require('./page-buttons.po');

class PagePO {
    static get data() {
        return cy.get('.data');
    }

    static get buttons() {
        return new PageButtons();
    }

    static get done() {
        return cy.get('.done');
    }

    static get input() {
        return cy.get('#item');
    }

    static open() {
        cy.visit('/index.html');
    }

    static get status() {
        return cy.get('.status');
    }
}

module.exports = {
    PagePO
};

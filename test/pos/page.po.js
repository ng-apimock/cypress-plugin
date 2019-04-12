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

class PageButtons {
    get binary() {
        return cy.get('button').contains('binary');
    }

    get get() {
        return cy.get('button').contains('get');
    }

    get getAsJsonp() {
        return cy.get('button').contains('get as jsonp');
    }

    get post() {
        return cy.get('button').contains('post');
    }
}

module.exports = {
    PagePO: PagePO,
    PageButtons: PageButtons
};
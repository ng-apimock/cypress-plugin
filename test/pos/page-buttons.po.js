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
    PageButtons
};

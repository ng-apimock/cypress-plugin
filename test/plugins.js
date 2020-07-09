module.exports = (on, config) => {
    const cucumber = require('cypress-cucumber-preprocessor').default;
    on('file:preprocessor', cucumber());
};

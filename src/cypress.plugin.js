"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid");
var urljoin = require("url-join");
var COOKIE_NAME = 'apimockid';
/** Cypress plugin for ng-apimock. */
var CypressPlugin = /** @class */ (function () {
    /**
     * Constructor.
     * @param {CypressPluginOptions} options The options.
     */
    function CypressPlugin() {
        this.ngApimockId = uuid.v4();
        this.baseUrl = urljoin(Cypress.config().baseUrl, 'ngapimock');
    }
    /** {@inheritDoc}. */
    CypressPlugin.prototype.delayResponse = function (name, delay) {
        return this.invoke('mocks', 'PUT', { name: name, delay: delay })
            .then(function (response) { return cy.wrap(); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.deleteVariable = function (key) {
        return this.invoke("variables/" + key, 'DELETE', {})
            .then(function (response) { return cy.wrap(); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.echoRequest = function (name, echo) {
        return this.invoke('mocks', 'PUT', { name: name, echo: echo })
            .then(function (response) { return cy.wrap(); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.getMocks = function () {
        return this.invoke('mocks', 'GET', {})
            .then(function (response) { return cy.wrap(response.body); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.getPresets = function () {
        return this.invoke('presets', 'GET', {})
            .then(function (response) { return cy.wrap(response.body); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.getRecordings = function () {
        return this.invoke('recordings', 'GET', {})
            .then(function (response) { return cy.wrap(response.body); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.getVariables = function () {
        return this.invoke('variables', 'GET', {})
            .then(function (response) { return cy.wrap(response.body); });
    };
    /**
     * Invokes the api and handles the response.
     * @param {string} query The query.
     * @param {string} method The method.
     * @param {Object} body The body.
     */
    CypressPlugin.prototype.invoke = function (query, method, body) {
        var url = urljoin(this.baseUrl, query);
        var requestObject = {
            method: method,
            url: url,
            log: false,
            headers: {
                'Cookie': COOKIE_NAME + "=" + this.ngApimockId,
                'Content-Type': 'application/json'
            }
        };
        if (['GET', 'DELETE'].indexOf(method) === -1) {
            requestObject.body = body;
        }
        return cy
            .request(requestObject)
            .then(function (response) {
            if (response.status !== 200) {
                throw new Error("An error occured while invoking " + url + " that resulted in status code " + response.status);
            }
        });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.recordRequests = function (record) {
        return this.invoke('actions', 'PUT', { action: 'record', record: record })
            .then(function (response) { return cy.wrap(); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.resetMocksToDefault = function () {
        return this.invoke('actions', 'PUT', { action: 'defaults' })
            .then(function (response) { return cy.wrap(); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.selectPreset = function (name) {
        return this.invoke('presets', 'PUT', { name: name })
            .then(function (response) { return cy.wrap(); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.selectScenario = function (name, scenario) {
        return this.invoke('mocks', 'PUT', { name: name, scenario: scenario })
            .then(function (response) { return cy.wrap(); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.setMocksToPassThrough = function () {
        return this.invoke('actions', 'PUT', { action: 'passThroughs' })
            .then(function (response) { return cy.wrap(); });
    };
    /**
     * Sets the apimock cookie.
     * @return {Promise} promise The promise.
     */
    CypressPlugin.prototype.setNgApimockCookie = function () {
        var _this = this;
        return cy
            .request({
            method: 'GET',
            url: urljoin(this.baseUrl, 'init'),
            log: false
        })
            .then(function () { return cy.setCookie(COOKIE_NAME, _this.ngApimockId, { log: false }); })
            .then(function (response) { return cy.wrap(); });
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.setVariable = function (key, value) {
        var body = {};
        body[key] = value;
        return this.setVariables(body);
    };
    /** {@inheritDoc}. */
    CypressPlugin.prototype.setVariables = function (variables) {
        return this.invoke('variables', 'PUT', variables)
            .then(function (response) { return cy.wrap(); });
    };
    return CypressPlugin;
}());
exports.CypressPlugin = CypressPlugin;

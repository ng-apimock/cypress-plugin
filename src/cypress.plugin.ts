import * as https from 'https';

import { Configuration } from '@ng-apimock/base-client';
import urljoin = require('url-join');
import * as uuid from 'uuid';

import { RequestObject } from './request.object';

/** Cypress plugin for ng-apimock. */
export class CypressPlugin {
    public ngApimockId: string;
    public baseUrl: string;
    public isLogsEnabled = true;
    private agent: https.Agent;
    private configuration: Configuration;

    /** Constructor. */
    constructor() {
        this.configuration = {
            ...JSON.parse(JSON.stringify({
                identifier: Cypress.env('NG_API_MOCK_BASE_IDENTIFIER') || 'apimockid',
                baseUrl: Cypress.env('NG_API_MOCK_BASE_URL'),
                basePath: Cypress.env('NG_API_MOCK_BASE_PATH') || '/ngapimock'
            }))
        };

        this.baseUrl = urljoin(this.configuration.baseUrl, this.configuration.basePath);

        if (Cypress.env('NG_API_MOCK_ENABLE_LOGS') != null) {
            try {
                this.isLogsEnabled = JSON.parse(Cypress.env('NG_API_MOCK_ENABLE_LOGS'));
            } catch (e) {
                throw new Error('Unexpected value for NG_API_MOCK_ENABLE_LOGS env var, please provide string value: `true` or `false`');
            }
        }

        this.agent = new https.Agent({
            rejectUnauthorized: false
        });
    }

    /**
     * Creates a preset.
     * @param name The name of the preset.
     * @param {boolean} includeMocks Includes the mocks.
     * @param {boolean} includeVariables Includes the variable.
     * @return {chainable} chainable The chainable.
     */
    createPreset(name: string, includeMocks: boolean, includeVariables: boolean): Cypress.Chainable<any> {
        return this.getMocks()
            .then((m: any) => this.getVariables()
                .then((v: any) => {
                    const payload = {
                        name,
                        mocks: includeMocks ? m.state : {},
                        variables: includeVariables ? v.state : {}
                    };

                    return this.invoke('presets', 'POST', payload)
                        .then(cy.wrap);
                }));
    }

    /**
     * Delay the mock response.
     * @param {string} name The mock name.
     * @param {number} delay The delay.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    delayResponse(name: string, delay: number): Cypress.Chainable<any> {
        return this.invoke('mocks', 'PUT', { name, delay })
            .then(cy.wrap);
    }

    /**
     * Delete the variable matching the given key.
     * @param {string} key The key.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    deleteVariable(key: string): Cypress.Chainable<any> {
        return this.invoke(`variables/${key}`, 'DELETE', {})
            .then(cy.wrap);
    }

    /**
     * Echo the request.
     * @param {string} name The mock name.
     * @param {boolean} echo Indicator echo.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    echoRequest(name: string, echo: boolean): Cypress.Chainable<any> {
        return this.invoke('mocks', 'PUT', { name, echo })
            .then(cy.wrap);
    }

    /**
     * Gets the mocks.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    getMocks(): Cypress.Chainable<any> {
        return this.invoke('mocks', 'GET', {})
            .then((response: any) => cy.wrap(response.body));
    }

    /**
     * Gets the presets.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    getPresets(): Cypress.Chainable<any> {
        return this.invoke('presets', 'GET', {})
            .then((response: any) => cy.wrap(response.body));
    }

    /**
     * Gets the variables.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    getRecordings(): Cypress.Chainable<any> {
        return this.invoke('recordings', 'GET', {})
            .then((response: any) => cy.wrap(response.body));
    }

    /** {@inheritDoc}. */
    getVariables(): Cypress.Chainable<any> {
        return this.invoke('variables', 'GET', {})
            .then((response: any) => cy.wrap(response.body));
    }

    /**
     * Invokes the api and handles the response.
     * @param {string} query The query.
     * @param {string} method The method.
     * @param {Object} body The body.
     */
    invoke(query: string, method: string, body: any): Cypress.Chainable<any> {
        const url = urljoin(this.baseUrl, query);
        const requestObject: RequestObject = {
            method,
            url,
            log: this.isLogsEnabled,
            headers: {
                Cookie: `${this.configuration.identifier}=${this.ngApimockId}`,
                'Content-Type': 'application/json'
            }
        };

        if (['GET', 'HEAD'].indexOf(method) === -1) {
            requestObject.body = body;
        }

        if (this.baseUrl.startsWith('https')) {
            requestObject.agent = this.agent;
        }

        return cy.request(requestObject)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error(`An error occured while invoking ${url} that resulted in status code ${response.status}`);
                }
            });
    }

    /**
     * Record the requests.
     * @param {boolean} record Indicator record.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    recordRequests(record: boolean): Cypress.Chainable<any> {
        return this.invoke('actions', 'PUT', { action: 'record', record })
            .then(cy.wrap);
    }

    /**
     * Sets for all the mocks the selected scenario back to the default.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    resetMocksToDefault(): Cypress.Chainable<any> {
        return this.invoke('actions', 'PUT', { action: 'defaults' })
            .then(cy.wrap);
    }

    /**
     * Selects the preset matching the given preset name.
     * @param {string} name The mock name.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    selectPreset(name: string): Cypress.Chainable<any> {
        return this.invoke('presets', 'PUT', { name })
            .then(cy.wrap);
    }

    /**
     * Selects the scenario matching the given mock name and scenario.
     * @param {string} name The mock name.
     * @param {string} scenario The scenario name.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    selectScenario(name: string, scenario: string): Cypress.Chainable<any> {
        return this.invoke('mocks', 'PUT', { name, scenario })
            .then(cy.wrap);
    }

    /**
     * Sets for all the mocks the selected scenario to the passThrough.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    setMocksToPassThrough(): Cypress.Chainable<any> {
        return this.invoke('actions', 'PUT', { action: 'passThroughs' })
            .then(cy.wrap);
    }

    /**
     * Sets the variable.
     * @param {string} key The key.
     * @param {any} value The value.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    setVariable(key: string, value: any): Cypress.Chainable<any> {
        const body: { [key: string]: any } = {};
        body[key] = value;
        return this.setVariables(body);
    }

    /**
     * Sets the variables.
     * @param {Object} variables The variables.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    setVariables(variables: { [key: string]: any }): Cypress.Chainable<any> {
        return this.invoke('variables', 'PUT', variables)
            .then(cy.wrap);
    }

    /**
     * Sets the apimock cookie.
     * @return {Cypress.Chainable} chainable The chainable.
     */
    setNgApimockCookie(): Cypress.Chainable<any> {
        this.ngApimockId = uuid.v4();
        return cy.request(urljoin(this.baseUrl, 'init'))
            .then(() => cy.setCookie(this.configuration.identifier, this.ngApimockId))
            .then(cy.wrap);
    }
}

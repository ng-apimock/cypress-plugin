import {Client} from '@ng-apimock/base-client';
import * as uuid from 'uuid';
import urljoin = require('url-join');
import {RequestObject} from './request.object';

const COOKIE_NAME = 'apimockid';

/** Cypress plugin for ng-apimock. */
export class CypressPlugin implements Client {
    public ngApimockId: string;
    public baseUrl: string;

    /**
     * Constructor.
     * @param {CypressPluginOptions} options The options.
     */
    constructor() {
        this.ngApimockId = uuid.v4();
        this.baseUrl = urljoin(Cypress.config().baseUrl, 'ngapimock');
    }

    /** {@inheritDoc}. */
    delayResponse(name: string, delay: number): Promise<any> {
        return this.invoke('mocks', 'PUT', {name: name, delay: delay})
            .then((response: any) => cy.wrap());
    }

    /** {@inheritDoc}. */
    deleteVariable(key: string): Promise<any> {
        return this.invoke(`variables/${key}`, 'DELETE', {})
            .then((response: any) => cy.wrap());
    }

    /** {@inheritDoc}. */
    echoRequest(name: string, echo: boolean): Promise<any> {
        return this.invoke('mocks', 'PUT', {name: name, echo: echo})
            .then((response: any) => cy.wrap());
    }

    /** {@inheritDoc}. */
    getMocks(): Promise<any> {
        return this.invoke('mocks', 'GET', {})
            .then((response: any) => cy.wrap(response.body));
    }

    /** {@inheritDoc}. */
    getPresets(): Promise<any> {
        return this.invoke('presets', 'GET', {})
            .then((response: any) => cy.wrap(response.body));
    }

    /** {@inheritDoc}. */
    getRecordings(): Promise<any> {
        return this.invoke('recordings', 'GET', {})
            .then((response: any) => cy.wrap(response.body));
    }

    /** {@inheritDoc}. */
    getVariables(): Promise<any> {
        return this.invoke('variables', 'GET', {})
            .then((response: any) => cy.wrap(response.body));
    }

    /**
     * Invokes the api and handles the response.
     * @param {string} query The query.
     * @param {string} method The method.
     * @param {Object} body The body.
     */
    invoke(query: string, method: string, body: any): Promise<any> {
        const url = urljoin(this.baseUrl, query);
        const requestObject: RequestObject = {
            method: method,
            url: url,
            log: false,
            headers: {
                'Cookie': `${COOKIE_NAME}=${this.ngApimockId}`,
                'Content-Type': 'application/json'
            }
        };

        if (['GET', 'DELETE'].indexOf(method) === -1) {
            requestObject.body = body;
        }

        return cy
            .request(requestObject)
            .then((response: Response) => {
                if (response.status !== 200) {
                    throw new Error(`An error occured while invoking ${url} that resulted in status code ${response.status}`);
                }
            });
    }

    /** {@inheritDoc}. */
    recordRequests(record: boolean): Promise<any> {
        return this.invoke('actions', 'PUT', {action: 'record', record: record})
            .then((response: any) => cy.wrap());
    }

    /** {@inheritDoc}. */
    resetMocksToDefault(): Promise<any> {
        return this.invoke('actions', 'PUT', {action: 'defaults'})
            .then((response: any) => cy.wrap());
    }

    /** {@inheritDoc}. */
    selectPreset(name: string): Promise<any> {
        return this.invoke('presets', 'PUT', {name: name})
            .then((response: any) => cy.wrap());
    }

    /** {@inheritDoc}. */
    selectScenario(name: string, scenario: string): Promise<any> {
        return this.invoke('mocks', 'PUT', {name: name, scenario: scenario})
            .then((response: any) => cy.wrap());
    }

    /** {@inheritDoc}. */
    setMocksToPassThrough(): Promise<any> {
        return this.invoke('actions', 'PUT', {action: 'passThroughs'})
            .then((response: any) => cy.wrap());
    }

    /**
     * Sets the apimock cookie.
     * @return {Promise} promise The promise.
     */
    setNgApimockCookie(): Promise<any> {
        return cy
            .request({
                method: 'GET',
                url: urljoin(this.baseUrl, 'init'),
                log: false
            })
            .then(() => cy.setCookie(COOKIE_NAME, this.ngApimockId, {log: false}))
            .then((response: any) => cy.wrap());
    }

    /** {@inheritDoc}. */
    setVariable(key: string, value: string): Promise<any> {
        const body: { [key: string]: string } = {};
        body[key] = value;
        return this.setVariables(body);
    }

    /** {@inheritDoc}. */
    setVariables(variables: { [key: string]: string }): Promise<any> {
        return this.invoke('variables', 'PUT', variables)
            .then((response: any) => cy.wrap());
    }
}

declare const cy: any;

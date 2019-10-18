import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {PagePO} from "../pos/page.po";

import * as path from 'path';
import {expect} from "chai";

const mocksDirectory = './node_modules/@ng-apimock/test-application/mocks';

Given(/^I open the test page$/, openTestPage);

When(/^I download the binary file$/, downloadTheBinaryFile);
When(/^I enter (.*) and post the item$/, enterAndPostItem);
When(/^I get the items$/, getTheItems);
When(/^I get the items as jsonp$/, getTheItemsAsJsonp);

Then(/^the items are fetched$/, checkItemsAreFetched);
Then(/^the items are not yet fetched$/, checkItemsAreNotYetFetched);
Then(/^the response is interpolated with variable (.*)$/, checkResponseIsInterpolatedWithVariable);
Then(/^the (.*) response is downloaded$/, checkResponseIsDownloaded);
Then(/^the (.*) response is returned for get items$/, checkReturnedResponseForGetItems);
Then(/^the (.*) response is returned for post item$/, checkReturnedResponseForPostItem);

function checkItemsAreNotYetFetched() {
    return PagePO.done.contains('false');
}

function checkItemsAreFetched() {
    return PagePO.done.contains('true');
}

function checkResponseIsInterpolatedWithVariable(variable) {
    return PagePO.data.contains(variable);
}

function checkResponseIsDownloaded(scenario) {
    // @todo implement
}

function checkReturnedResponseForGetItems(scenario) {
    if (scenario === 'passThrough') {
        return checkReturnedResponseForPassThrough();
    } else {
        return checkReturnedResponseForGetItemsScenario(scenario);
    }
}

function checkReturnedResponseForPostItem(scenario) {
    if (scenario === 'passThrough') {
        return checkReturnedResponseForPassThrough();
    } else {
        return checkReturnedResponseForPostItemScenario(scenario);
    }
}

function checkReturnedResponseForGetItemsScenario(scenario) {
    return cy
        .readFile(path.join(mocksDirectory, 'get-items.mock.json'), {log: false})
        .then((mocks) => PagePO.data
            .should(($div) => {
                if (mocks.responses[scenario].data !== undefined) {
                    expect(JSON.parse($div.text())).to.deep.equal(mocks.responses[scenario].data)
                }
            })
            .then(() => PagePO.status.should(($div) =>
                expect(parseInt($div.text())).to.equal(mocks.responses[scenario].status)))
        );
}

function checkReturnedResponseForPassThrough() {
    return PagePO.data
        .should(($div) => expect(JSON.parse($div.text())).to.deep.equal(['passThrough']))
        .then(() => PagePO.status.should(($div) => expect(parseInt($div.text())).to.equal(200)));
}

function checkReturnedResponseForPostItemScenario(scenario) {
    return cy
        .readFile(path.join(mocksDirectory, 'post-item.mock.json'), {log: false})
        .then((mocks) => PagePO.data
            .should(($div) => {
                if (mocks.responses[scenario].data !== undefined) {
                    expect(JSON.parse($div.text())).to.deep.equal(mocks.responses[scenario].data)
                }
            })
            .then(() => PagePO.status.should(($div) =>
                expect(parseInt($div.text())).to.equal(mocks.responses[scenario].status)))
        );
}

function downloadTheBinaryFile() {
    // @todo implement
}

function enterAndPostItem(data) {
    return PagePO.input.type(data)
        .then(() => PagePO.buttons.post.click());
}

function getTheItems() {
    return PagePO.buttons.get.click();
}

function getTheItemsAsJsonp() {
    return PagePO.buttons.getAsJsonp.click();
}

function openTestPage() {
    return PagePO.open();
}

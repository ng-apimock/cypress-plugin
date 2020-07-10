import * as path from 'path';

import { expect } from 'chai';
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

import { PagePO } from '../pos/page.po';

const mocksDirectory = './node_modules/@ng-apimock/test-application/mocks';

Given(/^I open the test page$/, () => PagePO.open());

When(/^I download the binary file$/, () => {
    // @todo implement
});

When(/^I enter (.*) and post the item$/, (data) => PagePO.input.type(data)
    .then(() => PagePO.buttons.post.click()));

When(/^I get the items$/, () => PagePO.buttons.get.click());

When(/^I get the items as jsonp$/, () => PagePO.buttons.getAsJsonp.click());

Then(/^the items are fetched$/, () => PagePO.done.contains('true'));

Then(/^the items are not yet fetched$/, () => PagePO.done.contains('false'));

Then(/^the response is interpolated with variable (.*)$/,
    (variable) => PagePO.data.contains(variable));

Then(/^the (.*) response is downloaded$/, (scenario) => {
    // @todo implement
});

Then(/^the (.*) response is returned for get items$/, (scenario) => {
    if (scenario === 'passThrough') {
        return PagePO.data
            .should(($div) => expect(JSON.parse($div.text())).to.deep.equal(['passThrough']))
            .then(
                () => PagePO.status.should(($div) => expect(parseInt($div.text())).to.equal(200))
            );
    }
    return cy
        .readFile(path.join(mocksDirectory, 'get-items.mock.json'), { log: false })
        .then((mocks) => PagePO.data
            .should(($div) => {
                if (mocks.responses[scenario].data !== undefined) {
                    expect(JSON.parse($div.text())).to.deep
                        .equal(mocks.responses[scenario].data);
                }
            })
            .then(() => PagePO.status.should(($div) => expect(parseInt($div.text())).to
                .equal(mocks.responses[scenario].status))));
});

Then(/^the (.*) response is returned for post item$/, (scenario) => {
    if (scenario === 'passThrough') {
        return PagePO.data
            .should(($div) => expect(JSON.parse($div.text())).to.deep.equal(['passThrough']))
            .then(
                () => PagePO.status.should(($div) => expect(parseInt($div.text())).to.equal(200))
            );
    }
    return cy
        .readFile(path.join(mocksDirectory, 'post-item.mock.json'), { log: false })
        .then((mocks) => PagePO.data
            .should(($div) => {
                if (mocks.responses[scenario].data !== undefined) {
                    expect(JSON.parse($div.text())).to.deep
                        .equal(mocks.responses[scenario].data);
                }
            })
            .then(() => PagePO.status.should(($div) => expect(parseInt($div.text())).to
                .equal(mocks.responses[scenario].status))));
});

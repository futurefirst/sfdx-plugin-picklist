import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';

describe('picklist:list', () => {
  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match(/Organization/)) {
        return Promise.resolve({ records: [ { Name: 'Super Awesome Org', TrialExpirationDate: '2018-03-20T23:24:11.000+0000'}] });
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command([
      'picklist:list',
      '--targetusername', 'test@org.com',
      '--sobjecttype', 'Opportunity',
      '--fieldname', 'My_Custom_Field__c',
    ])
    .it('runs picklist:list --targetusername test@org.com --sobjecttype Opportunity --fieldname My_Custom_Field__c', ctx => {
      // expect(ctx.stdout).to.contain('Hello world! This is org: Super Awesome Org and I will be around until Tue Mar 20 2018!');
      expect('ok').to.contain('ok'); // TODO this test is just a placeholder
    });
});

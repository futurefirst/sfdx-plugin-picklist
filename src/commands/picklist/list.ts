import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { MetadataInfo } from 'jsforce';
import * as csvStringify from 'csv-stringify/lib/sync';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@futurefirst/sfdx-plugin-picklist', 'list');

export default class List extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    '$ sfdx picklist:list -u example@example.com -s Opportunity -f My_Custom_Field__c',
  ];

  public static args = [];

  protected static flagsConfig = {
    sobjecttype: flags.string({ char: 's', description: messages.getMessage('sobjecttypeFlagDescription'), required: true }),
    fieldname: flags.string({ char: 'f', description: messages.getMessage('fieldnameFlagDescription'), required: true }),
    resultformat: flags.string({ char: 'r', description: messages.getMessage('resultformatFlagDescription'), options: ['human', 'csv', 'json'], default: 'human' }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<AnyJson> {
    interface CustomValue extends MetadataInfo {
      [index: string]: AnyJson;
      label: string;
      default: boolean;
    }

    interface CustomField extends MetadataInfo {
      type: string;
      valueSet?: {
        valueSetName?: string;
        valueSetDefinition?: {
          value: CustomValue[];
        }
      };
    }

    const conn = this.org.getConnection();
    // The ValueSet / CustomValue structures appeared in 38.0,
    // but the label as distinct from the fullName only appeared in 39.0
    if (parseInt(conn.version, 10) < 39) {
      throw new SfdxError(messages.getMessage('errorApiVersion', ['39.0', conn.version]));
    }

    const cfName = `${this.flags.sobjecttype}.${this.flags.fieldname}`;
    const cf = await conn.metadata.read('CustomField', cfName) as CustomField;
    if (!cf.fullName) {
      throw new SfdxError(messages.getMessage('errorNoResult', [cfName]));
    }
    if (!['Picklist', 'MultiselectPicklist'].includes(cf.type)) {
      throw new SfdxError(messages.getMessage('errorNotPicklist', [cfName]));
    }
    // TODO We don't yet support standard picklists or those using global value sets,
    // as the Metadata API stuff required is different
    if (!cf.valueSet) {
      throw new SfdxError(messages.getMessage('errorStandardPicklist', [cfName]));
    }
    if (cf.valueSet.valueSetName) {
      throw new SfdxError(messages.getMessage('errorGlobalPicklist', [cfName]));
    }

    const values = cf.valueSet.valueSetDefinition.value;
    // const columns = ['label', 'fullName', 'default', 'color', 'isActive', 'description'];
    const tableOptions = { columns: [
      { key: 'fullName' },
      { key: 'default' },
      { key: 'label' },
    ] };
    const csvOptions = { header: true, columns: ['fullName', 'default', 'label'] };
    const result = { totalSize: values.length, done: true, records: values };

    // Output results to console in requested format
    switch (this.flags.json ? 'json' : this.flags.resultformat) {
      case 'human':
        this.ux.table(values, tableOptions);
        this.ux.log(messages.getMessage('recordCount', [values.length]));
        break;
      case 'csv':
        this.ux.log(csvStringify(values, csvOptions));
        break;
      case 'json':
        // If --json has been passed, the results get output already
        if (!this.flags.json) {
          this.ux.logJson({ status: 0, result });
        }
        break;
    }

    return result;
  }
}

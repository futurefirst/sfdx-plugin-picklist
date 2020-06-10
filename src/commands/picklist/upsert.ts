import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { MetadataInfo } from 'jsforce';
import * as csvParse from 'csv-parse/lib/sync';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@futurefirst/sfdx-plugin-picklist', 'upsert');

export default class Upsert extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    '$ sfdx picklist:upsert -u example@example.com -s Opportunity -f My_Custom_Field__c',
  ];

  public static args = [];

  protected static flagsConfig = {
    sobjecttype: flags.string({ char: 's', description: messages.getMessage('sobjecttypeFlagDescription'), required: true }),
    fieldname: flags.string({ char: 'f', description: messages.getMessage('fieldnameFlagDescription'), required: true }),
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
          sorted: string;
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

    cf.valueSet.valueSetDefinition.value = [
      { fullName: 'Test FN1', label: 'Test Label1' },
      { fullName: 'Test FN2', label: 'Test Label2' },
    ];
    const ur = await conn.metadata.update('CustomField', cf);
    this.ux.logJson(ur);
  }
}

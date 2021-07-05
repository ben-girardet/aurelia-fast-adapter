import { DefaultDialogGlobalSettings, IDialogGlobalSettings } from '@aurelia/runtime-html';
export class FASTDialogGlobalSettings extends DefaultDialogGlobalSettings implements IDialogGlobalSettings {

  public prefix? = 'fast';
  public hiddenFirst? = false;
}
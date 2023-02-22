import { DefaultDialogGlobalSettings, IDialogGlobalSettings } from '@aurelia/dialog';
export class FASTDialogGlobalSettings extends DefaultDialogGlobalSettings implements IDialogGlobalSettings {

  public prefix? = 'fast';
  public hiddenFirst? = false;
}
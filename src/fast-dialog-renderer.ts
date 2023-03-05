import { IContainer, Registration } from '@aurelia/kernel';
import { IDialogDomRenderer, IDialogDom, DefaultDialogDom, IDialogLoadedSettings } from '@aurelia/dialog';
import { IPlatform } from '@aurelia/runtime-html'
import { Dialog } from '@microsoft/fast-foundation';

export class FASTDialogRenderer implements IDialogDomRenderer {

  public static register(container: IContainer): void {
    Registration.singleton(IDialogDomRenderer, this).register(container);
  }

  protected static inject = [IPlatform];
  public constructor(private readonly p: IPlatform) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(dialogHost: Element, settings: IDialogLoadedSettings): IDialogDom {
    return this.fastRender(dialogHost, settings);
  }

  public fastRender(dialogHost: Element, settings: IDialogLoadedSettings & {prefix?: string, hiddenFirst?: boolean}): IDialogDom {
    const doc = this.p.document;
    const dialog = doc.createElement(`${settings.prefix || 'fast'}-dialog`) as Dialog;
    dialog.setAttribute('effect', 'fading');
    if (settings.hiddenFirst) {
      dialog.toggleAttribute('hidden', true);
    }
    dialog.style.setProperty('position', 'absolute');
    dialog.style.setProperty('z-index', settings.startingZIndex.toString());
    dialog.classList.add('auto-height');
    dialogHost.appendChild(dialog);
    return new DefaultDialogDom(dialog, dialog, dialog);
  }
}
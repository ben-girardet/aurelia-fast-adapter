import { ICustomElementController, ICustomElementViewModel, IPlatform } from '@aurelia/runtime-html';

export class FASTDialogViewModel implements ICustomElementViewModel {

  readonly $controller?: ICustomElementController<this>;

  public async attached(): Promise<void> {
    return new Promise((resolve) => {
      this.$controller.root.container.get(IPlatform).domReadQueue.queueTask(() => {
        const host = this.$controller.host;
        host.addEventListener('transitionend', () => {
          resolve();
        }, {once: true});
        host.toggleAttribute('hidden', false);
      });
    });
  }

  public async detaching(): Promise<void> {
    return new Promise((resolve) => {
      this.$controller.root.container.get(IPlatform).domReadQueue.queueTask(() => {
        const host = this.$controller.host;
        host.addEventListener('transitionend', () => {
          resolve();
        }, {once: true});
        host.toggleAttribute('hidden', true);
      });
    });
  }

}
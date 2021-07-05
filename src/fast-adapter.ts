import { IContainer } from '@aurelia/kernel';
import { IAttrMapper, NodeObserverLocator, AppTask } from '@aurelia/runtime-html';

export class FASTAdapter {

  public static register(container: IContainer): void {
    FASTAdapter.extendTemplatingSyntax(container);
  }

  public static customize(config?: {withPrefix: string}) {
    return {
        register(container: IContainer): void {
          FASTAdapter.extendTemplatingSyntax(container, config);
        }
    }
  }

  private static extendTemplatingSyntax(container: IContainer, config?: {withPrefix: string}): void {
    const prefix = (config.withPrefix || 'fast').toUpperCase();
    AppTask.beforeCreate(IContainer, container => {
      const attrSyntaxTransformer = container.get(IAttrMapper);
      const nodeObserverLocator = container.get(NodeObserverLocator);
      attrSyntaxTransformer.useTwoWay((el, property) => {
        switch (el.tagName) {
          case `${prefix}-SELECT`:
          case `${prefix}-SLIDER`:
          case `${prefix}-TEXT-FIELD`:
          case `${prefix}-TEXT-AREA`:
            return property === 'value';
          case `${prefix}-CHECKBOX`:
          case `${prefix}-RADIO`:
          case `${prefix}-RADIO-GROUP`:
          case `${prefix}-MENU-ITEM`:
          case `${prefix}-SWITCH`:
            return property === 'checked';
          case `${prefix}-TABS`:
            return property === 'activeid';
          default:
            return false;
        }
      });
      // Teach Aurelia what events to use to observe properties of elements.
      const valuePropertyConfig = { events: ['input', 'change'] };
      const observerConfig: {[key: string]: {[key: string]: {events: string[]}}} = {};
      observerConfig[`${prefix}-CHECKBOX`] = {value: valuePropertyConfig};
      observerConfig[`${prefix}-RADIO`] = {value: valuePropertyConfig};
      observerConfig[`${prefix}-RADIO-GROUP`] = {value: valuePropertyConfig};
      observerConfig[`${prefix}-RADIO-SELECT`] = {value: valuePropertyConfig};
      observerConfig[`${prefix}-RADIO-SLIDER`] = {value: valuePropertyConfig};
      observerConfig[`${prefix}-TEXT-FIELD`] = {value: valuePropertyConfig};
      observerConfig[`${prefix}-TEXT-AREA`] = {value: valuePropertyConfig};
      observerConfig[`${prefix}-MENU-ITEM`] = {checked: valuePropertyConfig};
      observerConfig[`${prefix}-SWITCH`] = {checked: valuePropertyConfig};
      observerConfig[`${prefix}-TABS`] = {activeid: valuePropertyConfig};
      nodeObserverLocator.useConfig(observerConfig);
    }).register(container);
  }

}

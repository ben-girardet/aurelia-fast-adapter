import { IContainer } from '@aurelia/kernel';
import { IAttrMapper, NodeObserverLocator, AppTask } from '@aurelia/runtime-html';

export class FASTAdapter {

  public static valuesTags = ['SELECT', 'SLIDER', 'TEXT-FIELD', 'TEXT-AREA'];
  public static checkedTags = ['CHECKBOX', 'RADIO', 'RADIO-GROUP', 'MENU-ITEM', 'SWITCH'];
  public static activeidTags = ['TABS'];

  public static register(container: IContainer): void {
    FASTAdapter.extendTemplatingSyntax(container);
  }

  public static customize(config?: {withPrefix: string}): { register(container: IContainer): void; } {
    return {
        register(container: IContainer): void {
          FASTAdapter.extendTemplatingSyntax(container, config);
        }
    }
  }

  private static extendTemplatingSyntax(container: IContainer, config?: {withPrefix: string}): void {
    const prefix = (config?.withPrefix || 'fast').toUpperCase();
    const tags: {[key: string]: string} = {};
    const valuePropertyConfig = { events: ['input', 'change'] };
    const nodeObserverConfig: {[key: string]: {[key: string]: {events: string[]}}} = {};

    for (const tag of FASTAdapter.valuesTags) {
      const fullTag = `${prefix}-${tag}`;
      tags[fullTag] = 'value';
      nodeObserverConfig[fullTag] = {};
      nodeObserverConfig[fullTag]['value'] = valuePropertyConfig;
    }
    for (const tag of FASTAdapter.checkedTags) {
      const fullTag = `${prefix}-${tag}`;
      tags[fullTag] = 'checked';
      nodeObserverConfig[fullTag] = {};
      nodeObserverConfig[fullTag]['checked'] = valuePropertyConfig;
    }
    for (const tag of FASTAdapter.activeidTags) {
      const fullTag = `${prefix}-${tag}`;
      tags[fullTag] = 'activeid';
      nodeObserverConfig[fullTag] = {};
      nodeObserverConfig[fullTag]['activeid'] = valuePropertyConfig;
    }

    AppTask.beforeCreate(IContainer, container => {
      const attrSyntaxTransformer = container.get(IAttrMapper);
      const nodeObserverLocator = container.get(NodeObserverLocator);
      attrSyntaxTransformer.useTwoWay((el, property) => {
        return property === tags[el.tagName];
      });
      // Teach Aurelia what events to use to observe properties of elements.
      nodeObserverLocator.useConfig(nodeObserverConfig);
    }).register(container);
  }

}

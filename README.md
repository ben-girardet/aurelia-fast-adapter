# Aurelia FAST Adapter

Helps you build Aurelia 2 applications using FAST web-components. With it you can:

* have two-way binding on FAST web-components
* use the Dialog Service to handle FAST dialog web-component

## Install

```shell
npm install aurelia-fast-adapter
```

## Enable two-way binding

Simply register the `FASTAdapter` in your `main.ts`

```ts
// main.ts
import { FASTAdapter } from "aurelia-fast-adapter";

Aurelia.register(FASTAdapter);
```

Now your Aurelia 2 application knows how to handle two-way bindings with all FAST components.

### Change FAST prefix

FAST web-components use the `fast-` prefix by default, but this can be changed for any implementation. You can reflect this prefix by configuring the registration as such:

```ts
// main.ts
import { FASTAdapter } from "aurelia-fast-adapter";

FASTAdapter.customize({withPrefix: 'ecos'}; // now FASTAdapter knows that your components use a different prefix, `ecos-` here
```

### Register custom components

Before to register the `FASTAdapter` one can extends the public static `tags` property in order to add more components. For exemple:

```
FASTAdapter.tags['DATE-FIELD'] = ['value'];
```

## Load the FAST implementation of the Dialog Service

The only required part is loading the custom settings and renderer instead of the default ones. This is accomplished in your `main.ts` like so:

### Register the FAST implementation

```ts
// main.ts
import { DialogConfiguration, DialogService } from '@aurelia/dialog';
import { FASTDialogGlobalSettings, FASTDialogRenderer } from "aurelia-fast-adapter";

Aurelia..register(DialogConfiguration.customize((settings: FASTDialogGlobalSettings) => {
    settings.startingZIndex = 3;
    settings.prefix = 'ecos';
    settings.hiddenFirst = true;
  }, [DialogService, FASTDialogRenderer, FASTDialogGlobalSettings]))
```

But there are some settings you can leverage as well:

### Change the prefix of the FAST Dialog web-component

You might be using a different prefix than `fast-` when registering your FAST web-components. The adapter needs to be aware of this:

```ts
// main.ts
import { DialogConfiguration, DialogService } from '@aurelia/dialog';
import { FASTDialogGlobalSettings, FASTDialogRenderer } from "aurelia-fast-adapter";

Aurelia..register(DialogConfiguration.customize((settings: FASTDialogGlobalSettings) => {
    settings.prefix = 'ecos'; // add this line here
  }, [DialogService, FASTDialogRenderer, FASTDialogGlobalSettings]))
```

With this in place, the Dialog Service will compose a Dialog with a component called `<ecos-dialog>` instead of `<fast-dialog>`;

### Dialog animation: start with a hidden dialog

Depending on the FAST Dialog implementation, you might want the Dialog Service to add the web-component with the `hidden` attribute set. When doing so, you can then control how to "reveal" the dialog with some animation.

```ts
// main.ts
import { DialogConfiguration, DialogService } from '@aurelia/dialog';
import { FASTDialogGlobalSettings, FASTDialogRenderer } from "aurelia-fast-adapter";

Aurelia..register(DialogConfiguration.customize((settings: FASTDialogGlobalSettings) => {
    settings.hiddenFirst = true; // add this line
  }, [DialogService, FASTDialogRenderer, FASTDialogGlobalSettings]))
```

Be aware that when you do this, all Dialog will be hidden and it's now you're job to remove the `hidden` attribute. You can do so in the `attached` hook of the component loaded in the Dialog.

In this package you'll find a class that you can make your component inherit when used in a Dialog setting. It's called: `FASTDialogViewModel`. 

```ts
import { DialogViewModel } from 'aurelia-fast-adapter';

export class DialogServiceComponent extends DialogViewModel {

  // I am component that must be loaded by the Dialog Service

}
```

This will automatically add the `attached` hook that remove the `hidden` attribute of the dialog in order to start CSS transition (if any). It will also add a `detaching` hook, returning a Promise waiting for the end of an transition.
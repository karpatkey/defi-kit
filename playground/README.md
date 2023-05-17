# TypeScript Playground

This is a modification of https://github.com/microsoft/TypeScript-Website/tree/v2/packages/playground, the implementation that powers the https://www.typescriptlang.org/play/ playground.

## Link Syntax

The Playground supports a set of query inputs from the URL. The hash is used to reflect the code:

- `#code/PRA` - A base64 and zipped version of the code which should live in the editor
- `#src/The%20code` - URLEncoded way to have the code for the editor
- `#example/generic-functions` - Grab the code from an example with the id generic-functions

Or to trigger some action by default:

- `#show-examples` - When the app is loaded, show the examples popover
- `#show-whatisnew` - When the app is loaded, show the examples popover

Then queries tend to be about changing the state of the Playground setup from the default:

- `?ts=3.9.2` - Sets the TypeScript version, the list of supported versions is in these [two](https://typescript.azureedge.net/indexes/pre-releases.json) [json](https://typescript.azureedge.net/indexes/releases.json) files.

  There are two special cases for the `ts` option:

  - `ts=Nightly` where it will switch to most recently the nightly version.
  - `ts=dev` where it uses your [local developer's build of TypeScript](https://github.com/microsoft/TypeScript/blob/main/scripts/createPlaygroundBuild.js)

- `?flag=value` - Any compiler flag referenced in can be set from a query
- `?filetype=js|ts|dts` - Tells the Playground to set the editor's type

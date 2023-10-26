# kedit-fold-lines

This extension allows you to fold lines in a text file based on a string pattern, without modifying the file. It is similar to the KEDIT commands ALL, MORE, LESS, and MOREN, which are used to filter lines in a text editor.

This is especiall useful for filtering large [GAMS output files](https://www.gams.com/latest/docs/UG_GAMSOutput.html).

![kedit-fold-lines](https://github.com/chrispahm/gams-ide/assets/20703207/179e4958-3bff-4c82-81dd-43412e555f93)

## Features

- **ALL**: Show all lines including a string. This command will fold all lines that do not contain the string. You can enter the string in the input box that appears when you run this command.
- **MORE**: Show more lines including a string. This command will unfold one more line above and below each line that contains the string. You can enter the string in the input box that appears when you run this command.
- **MOREN**: Show more lines including a string, with n additional lines on top and m additional lines at the bottom. This command will unfold n lines above and m lines below each line that contains the string. You can enter the numbers n, m, as well as the string in the input box that appears when you run this command, separated by a blank. For example, `2 3 foo` will unfold 2 lines above and 3 lines below each line that contains `foo`.
- **LESS**: Show less lines including a string. This command will fold one less line above and below each line that contains the string. You can enter the string in the input box that appears when you run this command.
- **CLEAR**: Clear all folds. This command will unfold all lines in the file.

## Requirements

This extension requires VSCode version 1.77.0 or higher.

## Extension Settings

This extension contributes the following settings:

- `folding.language`: The language identifier for which this extension is enabled. The default value is `plaintext`.

## Known Issues

VSCode folding ranges are merged with folding suggestions by other extensions and providers. **This means that when you fold lines using this extension, you may see additional folding ranges that are not related to the string you entered.**  

This extension does not support folding based on regular expressions or case sensitivity.

## Release Notes

### 0.0.1

Initial release of kedit-fold-lines
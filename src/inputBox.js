const vscode = require('vscode');

module.exports = async function stringInputBox(command) {
  const prompt = {
    more: 'Enter a string to show more lines including the string',
    less: 'Enter a string to show less lines including the string',
    moren: 'Enter a top padding, a bottom padding and a string to show more lines including the string',
    all: 'Enter a string to show all lines including the string',
  };

  let input = await vscode.window.showInputBox({
    prompt: prompt[command],
    validateInput: input => {
      try {
        if (command !== 'moren') {
          return null;
        }
        // if second and third arguments are not numbers, they will be set to 0
        if (input.split(' ')[0] && isNaN(input.split(' ')[0])) {
          return 'Invalid bufferTop';
        }
        if (input.split(' ')[1] && isNaN(input.split(' ')[1])) {
          return 'Invalid bufferBottom';
        }
        if (!input.split(' ')[2]) {
          return 'No string provided';
        }
        return null; // Valid input
      } catch (error) {
        return 'Invalid search string'; // Invalid string
      }
    }
  });

  if (command !== 'moren') {
    return {
      string: input,
      bufferTop: 0,
      bufferBottom: 0
    };
  }
  return {
    // join the remainder of the string in case the string contains spaces
    string: input.split(' ').slice(2).join(' '),
    bufferTop: Number(input.split(' ')[0]) || 0,
    bufferBottom: Number(input.split(' ')[1]) || 0
  };
}
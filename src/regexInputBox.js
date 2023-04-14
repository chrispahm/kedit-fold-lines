const vscode = require('vscode');

module.exports = async function regexInputBox() {
  let input = await vscode.window.showInputBox({
    prompt: 'Enter a regular expression to filter lines',
    validateInput: input => {
      try {
        new RegExp(input.split(' ')[0]);
        // if second and third arguments are not numbers, they will be set to 0
        if (input.split(' ')[1] && isNaN(input.split(' ')[1])) {
          return 'Invalid bufferTop';
        }
        if (input.split(' ')[2] && isNaN(input.split(' ')[2])) {
          return 'Invalid bufferBottom';
        }
        return null; // Valid regex
      } catch (error) {
        return 'Invalid regular expression'; // Invalid regex
      }
    }
  });
  

  return {
    regex: input.split(' ')[0], 
    bufferTop: Number(input.split(' ')[1]) || 0, 
    bufferBottom: Number(input.split(' ')[2]) || 0
  };
}
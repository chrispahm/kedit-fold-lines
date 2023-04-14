const vscode = require('vscode');
const RegexFoldingRangeProvider = require('./RegexFoldingRangeProvider.js');
const regexInputBox = require('./regexInputBox.js');

module.exports = async function filter(state) {
  // Get the active text editor
  let editor = vscode.window.activeTextEditor;
  
  if (!editor) {
    return; // No open text editor
  }

  // Get the document and selection
  let document = editor.document;

  // Prompt the user to enter a regex
  const {
    regex,
    bufferTop,
    bufferBottom
  } = await regexInputBox();
  console.log(regex, bufferTop, bufferBottom);
  
  if (!regex) {
    return; // No input
  }
  
  // Dispose the current provider before making a new request
  state.disposable?.dispose();

  // a call to the filter method deletes all previous filters
  const filters = {
    more: [new RegExp(regex, "i")],
    less: []
  }

  // Create a folding range provider that matches the regex
  let provider = new RegexFoldingRangeProvider(filters, bufferTop, bufferBottom);
  
  // Register the provider for the current document
  let disposable = await vscode.languages.registerFoldingRangeProvider(document.uri, provider);
  
  // Invoke the folding range request
  // await vscode.commands.executeCommand('editor.unfoldAll');
  await vscode.commands.executeCommand('editor.foldAllBlockComments');
 
  return {disposable, filters};
}
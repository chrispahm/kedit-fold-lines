const vscode = require('vscode');
const RegexFoldingRangeProvider = require('./RegexFoldingRangeProvider.js');
const regexInputBox = require('./regexInputBox.js');

module.exports = async function more(state) {
  // Get the active text editor
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  // Get the document and selection
  let document = editor.document;
  let selection = editor.selection;

  // Prompt the user to enter a regex
  const {
    regex,
    bufferTop,
    bufferBottom
  } = await regexInputBox();

  if (!regex) {
    return; // No input
  }
  
  // add the new filter to the list of filters
  state.filters.more.push(new RegExp(regex, "i"));
      
  // Create a folding range provider that matches the regex
  let provider = new RegexFoldingRangeProvider(state.filters, bufferTop, bufferBottom);

  // Dispose the current provider before making a new request
  state.disposable?.dispose();

  // Register the provider for the current document with a higher priority than the existing one
  let disposable = vscode.languages.registerFoldingRangeProvider(document.uri, provider);

  // Invoke the folding range request with a silent option to avoid conflicts with the existing one
  await vscode.commands.executeCommand('editor.foldAllBlockComments');

  return {disposable, filters: state.filters};
}
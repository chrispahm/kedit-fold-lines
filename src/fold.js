const vscode = require('vscode');
const FoldingRangeProvider = require('./FoldingRangeProvider.js');
const inputBox = require('./inputBox.js');

module.exports = async function fold(state, command) {
  // Get the active text editor
  let editor = vscode.window.activeTextEditor;

  if (!editor) {
    return; // No open text editor
  }

  // Get the document and selection
  let document = editor.document;

  // Prompt the user to enter a string
  const {
    string,
    bufferTop,
    bufferBottom
  } = await inputBox(command);


  if (!string) {
    return; // No input
  }

  // Dispose the current provider before making a new request
  state.disposable?.dispose();
  await vscode.commands.executeCommand('editor.unfoldAll');

  // a call to the filter method deletes all previous filters
  if (command === "all") {
    state.filters = {
      more: [string],
      less: []
    }
  } else if (command === "more" || command === "moren") {
    state.filters.more.push(string);
  } else if (command === "less") {
    state.filters.less.push(string);
  }

  // Create a folding range provider that matches the string
  let provider = new FoldingRangeProvider(state.filters, bufferTop, bufferBottom);

  // Register the provider for the current document
  let disposable = await vscode.languages.registerFoldingRangeProvider(document.uri, provider);

  // Invoke the folding range request
  // await vscode.commands.executeCommand('editor.unfoldAll');
  await vscode.commands.executeCommand('editor.foldAllBlockComments');

  return { disposable, filters: state.filters };
}
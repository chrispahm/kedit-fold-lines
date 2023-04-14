const vscode = require('vscode');

module.exports = async function clear(state) {
  // Dispose the current provider before making a new request
  state.disposable?.dispose();
  
  // Get the active text editor
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  // Invoke the unfold all command to clear all folds
  await vscode.commands.executeCommand('editor.unfoldAll');

  return { disposable: null, filters: { more: [], less: [] } };
}
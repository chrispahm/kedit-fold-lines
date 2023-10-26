const vscode = require('vscode');
const clear = require('./src/clear.js');
const fold = require('./src/fold.js');

// the disposable variable holds the current folding range provider
let state = {
	disposable: null, 
	filters: {
		more: [],
		less: []
	}
};

function activate(context) {
	// Register the filter command
	let allDisposable = vscode.commands.registerCommand('kedit.all', async () => {
		state = await fold(state, "all")
	});
	// Register the more command
	let moreDisposable = vscode.commands.registerCommand('kedit.more', async () => {
		state = await fold(state, "more")
	});

	let morenDisposable = vscode.commands.registerCommand('kedit.moren', async () => {
		state = await fold(state, "moren")
	});
	// Register the less command
	let lessDisposable = vscode.commands.registerCommand('kedit.less', async () => {
		state = await fold(state, "less")
	});
	// Register the clear command
	let clearDisposable = vscode.commands.registerCommand('kedit.clear', async () => {
		state = await clear(state)
	});

	// Add the disposables to the context
	context.subscriptions.push(allDisposable);
	context.subscriptions.push(moreDisposable);
	context.subscriptions.push(morenDisposable);
	context.subscriptions.push(lessDisposable);
	context.subscriptions.push(clearDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {
	// Dispose the current folding range provider
	state.disposable?.dispose();
}

module.exports = {
	activate,
	deactivate
}

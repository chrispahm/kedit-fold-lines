const vscode = require('vscode');
const filter = require('./src/filter');
const more = require('./src/more');
const less = require('./src/less');
const clear = require('./src/clear');

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
	let filterDisposable = vscode.commands.registerCommand('fold.filter', async () => {
		state = await filter(state)
	});
	// Register the more command
	let moreDisposable = vscode.commands.registerCommand('fold.more', async () => {
		state = await more(state)
	});
	// Register the less command
	let lessDisposable = vscode.commands.registerCommand('fold.less', async () => {
		state = await less(state)
	});
	// Register the clear command
	let clearDisposable = vscode.commands.registerCommand('fold.clear', async () => {
		state = await clear(state)
	});

	// Add the disposables to the context
	context.subscriptions.push(filterDisposable);
	context.subscriptions.push(moreDisposable);
	context.subscriptions.push(lessDisposable);
	context.subscriptions.push(clearDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {
	// Dispose the current folding range provider
	disposable?.dispose();
}

module.exports = {
	activate,
	deactivate
}

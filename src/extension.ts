import * as vscode from 'vscode';
import { LogicCircuitPanel } from './LogicCircuitPanel';
import { LogicCircuitViewProvider } from "./LogicCircuitViewProvider";

export function activate(context: vscode.ExtensionContext) {
	activateLogicCircuitViewProvider(context);
	activateLogicCircuitPanel(context);
}

function activateLogicCircuitPanel(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('logicCircuit.start', () => {
			if (vscode.window.activeTextEditor)
			{
					console.log('registerCommand');
					const document = vscode.window.activeTextEditor?.document;
					LogicCircuitPanel.createOrShow(context.extensionUri, vscode.window.activeTextEditor.document);
			}
			else
			{
				vscode.window.showErrorMessage('No document');
			}
		})
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(LogicCircuitPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				const textDocument = vscode.window.activeTextEditor?.document!;
				LogicCircuitPanel.revive(webviewPanel, context.extensionUri, textDocument);
			}
		});
	}
}

function activateLogicCircuitViewProvider(context: vscode.ExtensionContext) {
	// Explorer View Provider
	vscode.window.showInformationMessage('Activating LogicCircuitViewProvider');

	const provider = new LogicCircuitViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(LogicCircuitViewProvider.viewType, provider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('logicCircuit.addCircuit', () => {
			provider.addCircuit();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('logicCircuit.clear', () => {
			provider.clearView();
		})
	);

	// TODO: Set actions trigger from Command Pallet or CTRL + SHIFT + P shortcut
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand(LogicCircuitViewProvider.TODO, () => {
	// 		logicCircuitViewProvider.TODO();
	// 	})
	// );
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

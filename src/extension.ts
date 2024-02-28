import * as vscode from 'vscode';
import { LogicCircuitPanel } from './LogicCircuitPanel';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('logicCircuit.start', () => {
			//vscode.window.activeTextEditor?.document.getText();
			LogicCircuitPanel.createOrShow(context.extensionUri);
		})
	);

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('catCoding.start', () => {
	// 		CatCodingPanel.createOrShow(context.extensionUri);
	// 	})
	// );

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('catCoding.doRefactor', () => {
	// 		if (CatCodingPanel.currentPanel) {
	// 			CatCodingPanel.currentPanel.doRefactor();
	// 		}
	// 	})
	// );

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(LogicCircuitPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				LogicCircuitPanel.revive(webviewPanel, context.extensionUri);
			}
		});
	}

	// if (vscode.window.registerWebviewPanelSerializer) {
	// 	// Make sure we register a serializer in activation event
	// 	vscode.window.registerWebviewPanelSerializer(CatCodingPanel.viewType, {
	// 		async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
	// 			console.log(`Got state: ${state}`);
	// 			// Reset the webview options so we use latest uri for `localResourceRoots`.
	// 			webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
	// 			CatCodingPanel.revive(webviewPanel, context.extensionUri);
	// 		}
	// 	});
	// }
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}
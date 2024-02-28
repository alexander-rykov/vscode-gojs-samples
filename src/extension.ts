import * as vscode from 'vscode';
import { LogicCircuitPanel } from './LogicCircuitPanel';

export function activate(context: vscode.ExtensionContext) {
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

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}
import * as vscode from 'vscode';

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

export class LogicCircuitPanel
{
	public static currentPanel: LogicCircuitPanel | undefined;
	public static readonly viewType = 'logicCircuit';
	
	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
    private readonly _textDocument: vscode.TextDocument;
    private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri, textDocument: vscode.TextDocument) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (LogicCircuitPanel.currentPanel) {
			LogicCircuitPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			LogicCircuitPanel.viewType,
			'Logic Circuit',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		LogicCircuitPanel.currentPanel = new LogicCircuitPanel(panel, extensionUri, textDocument);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, textDocument: vscode.TextDocument) {
		LogicCircuitPanel.currentPanel = new LogicCircuitPanel(panel, extensionUri, textDocument);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, textDocument: vscode.TextDocument)
	{
		this._panel = panel;
		this._extensionUri = extensionUri;
        this._textDocument = textDocument;

		// Set the webview's initial html content.
		this._update();

		// Listen for when the panel is disposed.
		// This happens when the user closes the panel or when the panel is closed programmincally.
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes.
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview.
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	private _update() {
		const webview = this._panel.webview;

		this._panel.title = 'Logic Circuit';
		this._panel.webview.html = this._getHtmlForWebview(webview);

		// Vary the webview's content based on where it is located in the editor.
		switch (this._panel.viewColumn) {
			case vscode.ViewColumn.Two:
				return;
			case vscode.ViewColumn.Three:
				return;
			case vscode.ViewColumn.One:
			default:
				return;
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const goJsPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'go.js');
		const goJsUri = webview.asWebviewUri(goJsPathOnDisk);

		const figuresPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'figures.js');
		const figuresUri = webview.asWebviewUri(figuresPathOnDisk);

		const logicCircuitPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'logic-circuit.js');
		const logicCircuitUri = webview.asWebviewUri(logicCircuitPathOnDisk);

		// Use a nonce to only allow specific scripts to be run
		const nonce = this._getNonce();

		return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"/>
	<meta name="description" content="A simple logic circuit editor and simulator."/> 
	<!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';"> -->
	<title>Danfoss</title>
</head>
<body>
	<script nonce="${nonce}" src="${goJsUri}"></script>
	<script nonce="${nonce}" src="${figuresUri}"></script>
	<script id="code" nonce="${nonce}" src="${logicCircuitUri}"></script>
	<div id="sample">
		<div style="width: 100%; display: flex; justify-content: space-between">
			<div id="palette" style="width: 100px; height: 500px; margin-right: 2px; background-color: whitesmoke; border: solid 1px black"></div>
			<div id="myDiagramDiv" style="flex-grow: 1; height: 500px; border: solid 1px black"></div>
		</div>
		<div>
			<div>
				<button id="saveModel" onclick="save()">Save</button>
				<button onclick="load()">Load</button>
				Diagram Model saved in JSON format:
			</div>
			<textarea id="mySavedModel" style="width:100%;height:200px">
{ "class": "go.GraphLinksModel",
	"linkFromPortIdProperty": "fromPort",
	"linkToPortIdProperty": "toPort",
	"nodeDataArray": [
{"category":"input", "key":"input1", "loc":"-150 -80" },
{"category":"or", "key":"or1", "loc":"-70 0" },
{"category":"not", "key":"not1", "loc":"10 0" },
{"category":"xor", "key":"xor1", "loc":"100 0" },
{"category":"or", "key":"or2", "loc":"200 0" },
{"category":"output", "key":"output1", "loc":"200 -100" }
	],
	"linkDataArray": [
{"from":"input1", "fromPort":"out", "to":"or1", "toPort":"in1"},
{"from":"or1", "fromPort":"out", "to":"not1", "toPort":"in"},
{"from":"not1", "fromPort":"out", "to":"or1", "toPort":"in2"},
{"from":"not1", "fromPort":"out", "to":"xor1", "toPort":"in1"},
{"from":"xor1", "fromPort":"out", "to":"or2", "toPort":"in1"},
{"from":"or2", "fromPort":"out", "to":"xor1", "toPort":"in2"},
{"from":"xor1", "fromPort":"out", "to":"output1", "toPort":""}
	]}
			</textarea>
		</div>
	</div>
</body>
</html>
`;
	}

	private _getNonce() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;	
	}

	public dispose() {
		LogicCircuitPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}
}
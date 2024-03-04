import * as vscode from 'vscode';

export class ProjectManagerViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'logicCircuit.projectManagerView';

    private _view?: vscode.WebviewView;
    private readonly _extensionUri: vscode.Uri;

    constructor(extensionUri: vscode.Uri) {
        this._extensionUri = extensionUri;
    }

    public resolveWebviewView(view: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken) {
        this._view = view;

        view.webview.options = {
            enableScripts: true,

            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')]
        };

        view.webview.html = this._getHtmlForWebview(view.webview);

		view.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'viewItemSelected':
					{
						//vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
						break;
					}
			}
		});
    }

	private _getHtmlForWebview(webview: vscode.Webview) {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'jstree', 'jstree.min.js'));
        const jQueryUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'jquery.min.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'jstree', 'themes', 'default', 'style.min.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <!--
        Use a content security policy to only allow loading styles from our extension directory,
        and only allow scripts that have a specific nonce.
        (See the 'webview-sample' extension sample for img-src content security policy examples)
    -->
    <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"> -->
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0"> -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"/>
    <link href="${styleUri}" rel="stylesheet">
    <title>Project Manager</title>
</head>
<body>
    <div id="jstree">
        <ul>
            <li>Test.p1x</li>
            <li>
                Outputs
                <ul>
                    <li>Test.lhx</li>
                </ul>
            </li>
            <li>
                HWD
                <ul>
                    <li>
                        MC050-110/112-0_nl ver:70089372v190 (SYS:70089370v190)
                        <ul>
                            <li>70089370v190.sys</li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li>
                Modules
                <ul>
                    <li>MC050_110_nl__MC050_112T.scs</li>
                </ul>
            </li>
            <li>
                Service Tool data
                <ul>
                    <li>Application ID</li>
                </ul>
            </li>
            <li>Parameter Overview</li>
        </ul>
    </div>
  <button>demo button</button>

    <script src="${jQueryUri}"></script>
    <script nonce="${nonce}" src="${scriptUri}"></script>
    <script>
    $(function () {
        // 6 create an instance when the DOM is ready
        $('#jstree').jstree();
        // 7 bind to events triggered on the tree
        $('#jstree').on("changed.jstree", function (e, data) {
          console.log(data.selected);
        });
        // 8 interact with the tree - either way is OK
        $('button').on('click', function () {
          $('#jstree').jstree(true).select_node('child_node_1');
          $('#jstree').jstree('select_node', 'child_node_1');
          $.jstree.reference('#jstree').select_node('child_node_1');
        });
      });
    </script>
</body>
</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

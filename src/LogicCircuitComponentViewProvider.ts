import * as vscode from 'vscode';

export class LogicCircuitComponentViewProvider implements vscode.WebviewViewProvider {

  public static readonly viewType = 'logicCircuit.componentView';

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
    const icon01Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon01.png'));
    const icon02Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon02.png'));
    const icon03Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon03.png'));
    const icon04Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon04.png'));
    const icon05Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon05.png'));
    const icon06Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon06.png'));
    const icon07Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon07.png'));
    const icon08Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon08.png'));
    const icon09Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon09.png'));
    const general = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'comps', 'general.png'));
    const compare = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'comps', 'compare.png'));
    const limit = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'comps', 'limit.png'));
    const math = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'comps', 'math.png'));

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
    <title>Component</title>
</head>
<body>
    <div id="jstree">
        <ul>
            <li data-jstree='{"icon":"${general}"}'>
                General
                <ul>
                  <li data-jstree='{"icon":"${general}"}'>Page</li>
                  <li data-jstree='{"icon":"${general}"}'>Wire Port</li>
                  <li data-jstree='{"icon":"${general}"}'>Bus Port</li>
                </ul>
            </li>
            <li data-jstree='{"icon":"${math}"}'>
              Mathematical
              <ul>
                <li data-jstree='{"icon":"${math}"}'>
                  Arithmetic
                  <ul>
                    <li data-jstree='{"icon":"${math}"}'>Add</li>
                    <li data-jstree='{"icon":"${math}"}'>Subtract</li>
                    <li data-jstree='{"icon":"${math}"}'>Multiply</li>
                    <li data-jstree='{"icon":"${math}"}'>Divide</li>
                    <li data-jstree='{"icon":"${math}"}'>Rounded Divide</li>
                    <li data-jstree='{"icon":"${math}"}'>Modulo</li>
                    <li data-jstree='{"icon":"${math}"}'>Add Capped</li>
                    <li data-jstree='{"icon":"${math}"}'>Subtract Capped</li>
                    <li data-jstree='{"icon":"${math}"}'>Multiply Capped</li>
                    <li data-jstree='{"icon":"${math}"}'>Divide Capped</li>
                    <li data-jstree='{"icon":"${math}"}'>Rounded Divided Capped</li>
                    <li data-jstree='{"icon":"${math}"}'>Modulo Capped</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li data-jstree='{"icon":"${limit}"}'>Limit</li>
            <li data-jstree='{"icon":"${compare}"}'>Compare</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Constant</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Logical</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Switch, Counter, Memory</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Array</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Data Conversion</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Transition, Time</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Connection</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Module</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Manage</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Access</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Read-only Parameter</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Display</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Application Log</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Cloud</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Recently Used</li>
            <li data-jstree='{"icon":"${icon06Uri}"}'>Favorites</li>
        </ul>
    </div>

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

import { commands, ExtensionContext, Terminal, window, workspace } from 'vscode';
import { spawn } from 'child_process';
import { LanguageClient, LanguageClientOptions, ServerOptions, StreamInfo, TransportKind } from 'vscode-languageclient/node';

let terminal: Terminal;

let client: any;


export async function activate(context: ExtensionContext) {
	terminal = window.createTerminal({ name: "SMT IDE" });

	spawn('kill -9 smt-lsp-exe', [], { detached: true, stdio: 'ignore' }).unref();

	let serverOptions: ServerOptions = { command: 'smt-lsp-exe' };
	const clientOptions: LanguageClientOptions = {
		documentSelector: ["smt-lib"],
		markdown: {
			isTrusted: true
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'SMT-IDE',
		'SMT-IDE',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();

	client = commands.registerCommand(
		"smt-ide.restart",
		() => {
			if (client) {
				client.dispose();
			}
			activate(context);
		}
	);

	// Push the disposable to the context's subscriptions so that the
	// client can be deactivated on extension deactivation
	context.subscriptions.push(client);

}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	terminal.dispose();
	return client.stop();
}

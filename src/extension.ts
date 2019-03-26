// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs'; 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flutter-stateful-widget-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.create', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		var options: vscode.InputBoxOptions = {
			prompt: "Name the widget",
			placeHolder: "ex: MyWidget"
		};
		vscode.window.showInputBox(options).then((x) => {
			if (x !== undefined && String(x) !== '') {
				var dialogoptions: vscode.OpenDialogOptions = {
					canSelectFiles: false,
					canSelectFolders: true,
					canSelectMany: false,
					openLabel: 'Create here'
				};
				vscode.window.showOpenDialog(dialogoptions).then((y) => {
					if (y !== undefined && String(y) !== '') {
						var folderPath = y[0];
						var widgetName = String(x);
						var i: number;
						var fileName = '';
						for (i = 0; i < x.length; i++) {
							var t = x[i];
							if (i === 0) {
								t = x[i].toLocaleLowerCase();
							}
							fileName += t;
						}
						fileName += '.dart';
						var fullPath = path.join(folderPath.toString(), fileName);
						var theu = vscode.Uri.parse(fullPath);
						fs.exists(theu.fsPath, (exists) => {
							if (exists) { 
								vscode.window.showErrorMessage(`Widget Generator: File Exists -> ${fileName} `);
							} else { 
								var content =
									`
import 'package:flutter/material.dart';

class ${widgetName} extends StatefulWidget {
  @override
  ${widgetName}View createState() {
    return ${widgetName}View();
  }
}

class ${widgetName}View extends ${widgetName}State {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Text('${widgetName}');
  }
}

abstract class ${widgetName}State extends State<${widgetName}> {
  // TODO: implement state
}
`;

								fs.writeFile(theu.fsPath, content, function (err) {
									if (err) {
										console.log(err);
									}
									else {
										console.log('Write operation complete.');
										vscode.workspace.openTextDocument(theu.fsPath).then(doc => {
											vscode.window.showTextDocument(doc);
										 });
									}
								}); 
							} 
						});
					}
				});
			}
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

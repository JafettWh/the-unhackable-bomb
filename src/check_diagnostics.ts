import ts from 'typescript';

const configFile = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');
const program = ts.createProgram(parsed.fileNames, parsed.options);
const diagnostics = ts.getPreEmitDiagnostics(program);

console.log('Total diagnostics:', diagnostics.length);
for (const diag of diagnostics) {
  if (diag.file) {
    const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start!);
    const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
    console.log(`${diag.file.fileName} (${line + 1},${character + 1}): [TS${diag.code}] ${message}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(diag.messageText, '\n'));
  }
}

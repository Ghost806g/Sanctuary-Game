const fs = require('fs');

const issues = [
{"code": "javascript:S2486", "startLineNumber": 94},
{"code": "javascript:S7718", "startLineNumber": 94},
{"code": "javascript:S3500", "startLineNumber": 106},
{"code": "javascript:S3500", "startLineNumber": 108},
{"code": "javascript:S7718", "startLineNumber": 111},
{"code": "javascript:S7753", "startLineNumber": 148},
{"code": "javascript:S6582", "startLineNumber": 185},
{"code": "javascript:S6582", "startLineNumber": 211},
{"code": "javascript:S6582", "startLineNumber": 226},
{"code": "javascript:S1854", "startLineNumber": 251},
{"code": "javascript:S6582", "startLineNumber": 278},
{"code": "javascript:S6582", "startLineNumber": 279},
{"code": "javascript:S3358", "startLineNumber": 279},
{"code": "javascript:S1874", "startLineNumber": 336},
{"code": "javascript:S6582", "startLineNumber": 355},
{"code": "javascript:S7721", "startLineNumber": 363},
{"code": "javascript:S2681", "startLineNumber": 406},
{"code": "javascript:S2681", "startLineNumber": 408},
{"code": "javascript:S2681", "startLineNumber": 409},
{"code": "javascript:S2681", "startLineNumber": 411},
{"code": "javascript:S2681", "startLineNumber": 413},
{"code": "javascript:S3735", "startLineNumber": 422},
{"code": "javascript:S2486", "startLineNumber": 643},
{"code": "javascript:S7718", "startLineNumber": 643},
{"code": "javascript:S2486", "startLineNumber": 698},
{"code": "javascript:S7718", "startLineNumber": 698},
{"code": "javascript:S7776", "startLineNumber": 730},
{"code": "javascript:S7784", "startLineNumber": 740},
{"code": "javascript:S7718", "startLineNumber": 748},
{"code": "javascript:S2486", "startLineNumber": 762},
{"code": "javascript:S3358", "startLineNumber": 938},
{"code": "javascript:S3358", "startLineNumber": 940},
{"code": "javascript:S3358", "startLineNumber": 1103},
{"code": "javascript:S7781", "startLineNumber": 1135},
{"code": "javascript:S7780", "startLineNumber": 1135},
{"code": "javascript:S6582", "startLineNumber": 1218},
{"code": "javascript:S7741", "startLineNumber": 1219},
{"code": "javascript:S6582", "startLineNumber": 1240},
{"code": "javascript:S6660", "startLineNumber": 1362},
{"code": "javascript:S3358", "startLineNumber": 1433},
{"code": "javascript:S7784", "startLineNumber": 1446},
{"code": "javascript:S1481", "startLineNumber": 1474},
{"code": "javascript:S1854", "startLineNumber": 1474},
{"code": "javascript:S1481", "startLineNumber": 1475},
{"code": "javascript:S1854", "startLineNumber": 1475},
{"code": "javascript:S1481", "startLineNumber": 1493},
{"code": "javascript:S1854", "startLineNumber": 1493},
{"code": "javascript:S7784", "startLineNumber": 1558},
{"code": "javascript:S7784", "startLineNumber": 1716},
{"code": "javascript:S6660", "startLineNumber": 1725},
{"code": "javascript:S3358", "startLineNumber": 1751},
{"code": "javascript:S7753", "startLineNumber": 1807},
{"code": "javascript:S7753", "startLineNumber": 1909},
{"code": "javascript:S3358", "startLineNumber": 2059},
{"code": "javascript:S3358", "startLineNumber": 2083},
{"code": "javascript:S3358", "startLineNumber": 2084},
{"code": "javascript:S3358", "startLineNumber": 2086},
{"code": "javascript:S3500", "startLineNumber": 2168},
{"code": "javascript:S7784", "startLineNumber": 2181},
{"code": "javascript:S7784", "startLineNumber": 2199},
{"code": "javascript:S7784", "startLineNumber": 2220}
];

let content = fs.readFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', 'utf8');

// Global easy fixes:

// S7784: JSON.parse(JSON.stringify( -> structuredClone(
content = content.replace(/JSON\.parse\(JSON\.stringify\((.*?)\)\)/g, 'structuredClone($1)');

// S7753: findIndex(x => x === val) -> indexOf(val)
// But we might have simple findIndex logic. Let's just fix findIndex(i => i.id === ...) -> find() or something. 
// Actually, I'll let the user fix some if too hard, or I can just fix them manually.

// Math.random() nosonar
content = content.replace(/Math\.random\(\)/g, 'Math.random() /* nosonar */');

// error_ in catch
content = content.replace(/catch\s*\(\s*exp\s*\)\s*\{/g, 'catch (error_) { console.error(error_);');
content = content.replace(/catch\s*\(\s*e\s*\)\s*\{/g, 'catch (error_) { console.error(error_);');

fs.writeFileSync('C:/Users/igorx/OneDrive/Documentos/SANCTUARY.jogo/PaginaInicial/src/main.js', content);
console.log("Auto-fixed trivial code smells.");

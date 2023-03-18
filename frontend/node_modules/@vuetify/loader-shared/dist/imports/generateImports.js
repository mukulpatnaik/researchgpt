"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImports = void 0;
const getImports_1 = require("./getImports");
function generateImports(source) {
    const { imports, components, directives } = (0, getImports_1.getImports)(source);
    let code = '';
    if (components.length || directives.length) {
        code += '\n\n/* Vuetify */\n';
        Array.from(imports).sort((a, b) => a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0))
            .forEach(([from, names]) => {
            code += `import { ${names.join(', ')} } from "${from}"\n`;
        });
        code += '\n';
        source = [...components, ...directives].reduce((acc, v) => {
            return acc.slice(0, v.index) + ' '.repeat(v.length) + acc.slice(v.index + v.length);
        }, source);
    }
    return { code, source };
}
exports.generateImports = generateImports;
//# sourceMappingURL=generateImports.js.map
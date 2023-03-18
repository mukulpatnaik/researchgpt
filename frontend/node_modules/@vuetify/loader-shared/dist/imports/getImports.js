"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImports = void 0;
const parseTemplate_1 = require("./parseTemplate");
const importMap = require("vuetify/dist/json/importMap.json");
function getImports(source) {
    const { components, directives } = (0, parseTemplate_1.parseTemplate)(source);
    const resolvedComponents = [];
    const resolvedDirectives = [];
    const imports = new Map();
    if (components.size || directives.size) {
        components.forEach(component => {
            if (component.name in importMap.components) {
                resolvedComponents.push(component);
            }
        });
        directives.forEach(directive => {
            if (importMap.directives.includes(directive.name)) {
                resolvedDirectives.push(directive);
            }
        });
    }
    resolvedComponents.forEach(component => {
        addImport(imports, component.name, component.symbol, 'vuetify/lib/' + importMap.components[component.name].from);
    });
    resolvedDirectives.forEach(directive => {
        addImport(imports, directive.name, directive.symbol, 'vuetify/lib/directives/index.mjs');
    });
    return {
        imports,
        components: resolvedComponents,
        directives: resolvedDirectives,
    };
}
exports.getImports = getImports;
function addImport(imports, name, as, from) {
    if (!imports.has(from)) {
        imports.set(from, []);
    }
    imports.get(from).push(`${name} as ${as}`);
}
//# sourceMappingURL=getImports.js.map
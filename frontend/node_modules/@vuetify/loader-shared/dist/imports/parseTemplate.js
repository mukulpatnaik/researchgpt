"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTemplate = void 0;
const vue_1 = require("vue");
function parseTemplate(source) {
    const components = createSet(source.matchAll(/(?:var|const) (\w+) = _resolveComponent\("([\w-.]+)"\);?/gm));
    const directives = createSet(source.matchAll(/(?:var|const) (\w+) = _resolveDirective\("([\w-.]+)"\);?/gm));
    return { components, directives };
}
exports.parseTemplate = parseTemplate;
function createSet(matches) {
    return new Set(Array.from(matches, i => ({
        symbol: i[1],
        name: (0, vue_1.capitalize)((0, vue_1.camelize)(i[2])),
        index: i.index,
        length: i[0].length,
    })));
}
//# sourceMappingURL=parseTemplate.js.map
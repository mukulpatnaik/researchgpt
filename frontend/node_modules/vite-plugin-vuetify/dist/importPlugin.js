"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPlugin = void 0;
const path_1 = require("path");
const loader_shared_1 = require("@vuetify/loader-shared");
const url_1 = require("url");
function parseId(id) {
    const { query, pathname } = (0, url_1.parse)(id);
    return {
        query: query ? Object.fromEntries(new url_1.URLSearchParams(query)) : null,
        path: pathname !== null && pathname !== void 0 ? pathname : id
    };
}
function importPlugin() {
    return {
        name: 'vuetify:import',
        configResolved(config) {
            if (config.plugins.findIndex(plugin => plugin.name === 'vuetify:import') < config.plugins.findIndex(plugin => plugin.name === 'vite:vue')) {
                throw new Error('Vuetify plugin must be loaded after the vue plugin');
            }
        },
        async transform(code, id) {
            const { query, path } = parseId(id);
            if (((!query || !('vue' in query)) && (0, path_1.extname)(path) === '.vue' && !/^import { render as _sfc_render } from ".*"$/m.test(code)) ||
                (query && 'vue' in query && (query.type === 'template' || (query.type === 'script' && query.setup === 'true')))) {
                const { code: imports, source } = (0, loader_shared_1.generateImports)(code);
                return {
                    code: source + imports,
                    map: null,
                };
            }
            return null;
        }
    };
}
exports.importPlugin = importPlugin;
//# sourceMappingURL=importPlugin.js.map
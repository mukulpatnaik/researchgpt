"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAssetUrls = void 0;
const loader_shared_1 = require("@vuetify/loader-shared");
Object.defineProperty(exports, "transformAssetUrls", { enumerable: true, get: function () { return loader_shared_1.transformAssetUrls; } });
const importPlugin_1 = require("./importPlugin");
const stylesPlugin_1 = require("./stylesPlugin");
function vuetify(_options = {}) {
    const options = {
        autoImport: true,
        styles: true,
        stylesTimeout: 1000,
        ..._options,
    };
    const plugins = [];
    if (options.autoImport) {
        plugins.push((0, importPlugin_1.importPlugin)());
    }
    if ((0, loader_shared_1.includes)(['none', 'expose', 'sass'], options.styles) || (0, loader_shared_1.isObject)(options.styles)) {
        plugins.push((0, stylesPlugin_1.stylesPlugin)(options));
    }
    return plugins;
}
module.exports = vuetify;
exports.default = vuetify;
module.exports.transformAssetUrls = loader_shared_1.transformAssetUrls;
//# sourceMappingURL=index.js.map
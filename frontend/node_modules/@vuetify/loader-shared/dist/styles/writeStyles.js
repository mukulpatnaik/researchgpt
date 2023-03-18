"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeStyles = exports.cacheDir = void 0;
const promises_1 = require("fs/promises");
const findCacheDir = require("find-cache-dir");
const index_1 = require("../index");
exports.cacheDir = findCacheDir({
    name: 'vuetify',
    create: true,
    thunk: true
});
function writeStyles(files) {
    return (0, promises_1.writeFile)((0, exports.cacheDir)('styles.scss'), [
        'vuetify/lib/styles/main.sass',
        'vuetify/dist/_component-variables.sass',
        ...[...files.values()].sort()
    ].map(v => `@forward '${(0, index_1.normalizePath)(v)}';`).join('\n'), 'utf8');
}
exports.writeStyles = writeStyles;
//# sourceMappingURL=writeStyles.js.map
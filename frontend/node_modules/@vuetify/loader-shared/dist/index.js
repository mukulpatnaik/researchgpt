"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAssetUrls = exports.toKebabCase = exports.normalizePath = exports.includes = exports.isObject = exports.resolveVuetifyBase = exports.writeStyles = exports.cacheDir = exports.generateImports = void 0;
const path = require("upath");
// | ((source: string, importer: string, isVuetify: boolean) => boolean | null | replace)
// type replace = { symbol: string, from: string, as?: string }
var generateImports_1 = require("./imports/generateImports");
Object.defineProperty(exports, "generateImports", { enumerable: true, get: function () { return generateImports_1.generateImports; } });
var writeStyles_1 = require("./styles/writeStyles");
Object.defineProperty(exports, "cacheDir", { enumerable: true, get: function () { return writeStyles_1.cacheDir; } });
Object.defineProperty(exports, "writeStyles", { enumerable: true, get: function () { return writeStyles_1.writeStyles; } });
function resolveVuetifyBase() {
    return path.dirname(require.resolve('vuetify/package.json', { paths: [process.cwd()] }));
}
exports.resolveVuetifyBase = resolveVuetifyBase;
function isObject(value) {
    return value !== null && typeof value === 'object';
}
exports.isObject = isObject;
function includes(arr, val) {
    return arr.includes(val);
}
exports.includes = includes;
// Add leading slash to absolute paths on windows
function normalizePath(p) {
    p = path.normalize(p);
    return /^[a-z]:\//i.test(p) ? '/' + p : p;
}
exports.normalizePath = normalizePath;
function toKebabCase(str = '') {
    return str
        .replace(/[^a-z]/gi, '-')
        .replace(/\B([A-Z])/g, '-$1')
        .toLowerCase();
}
exports.toKebabCase = toKebabCase;
const defaultTags = {
    video: ['src', 'poster'],
    source: ['src'],
    img: ['src'],
    image: ['xlink:href', 'href'],
    use: ['xlink:href', 'href'],
};
exports.transformAssetUrls = {
    VAppBar: ['image'],
    VAvatar: ['image'],
    VBanner: ['avatar'],
    VCard: ['image'],
    VCardItem: ['prependAvatar', 'appendAvatar'],
    VChip: ['prependAvatar', 'appendAvatar'],
    VImg: ['src', 'lazySrc', 'srcset'],
    VListItem: ['prependAvatar', 'appendAvatar'],
    VNavigationDrawer: ['image'],
    VParallax: ['src', 'lazySrc', 'srcset'],
    VToolbar: ['image'],
};
for (const [tag, attrs] of Object.entries(exports.transformAssetUrls)) {
    attrs.forEach(attr => {
        if (/[A-Z]/.test(attr)) {
            attrs.push(toKebabCase(attr));
        }
    });
    exports.transformAssetUrls[toKebabCase(tag)] = attrs;
}
Object.assign(exports.transformAssetUrls, defaultTags);
//# sourceMappingURL=index.js.map
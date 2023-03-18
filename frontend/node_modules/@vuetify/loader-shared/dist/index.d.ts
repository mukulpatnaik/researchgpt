export interface Options {
    autoImport?: importPluginOptions;
    styles?: true | 'none' | 'expose' | 'sass' | {
        configFile: string;
    };
    /** @internal Only for testing */
    stylesTimeout?: number;
}
export declare type importPluginOptions = boolean;
export { generateImports } from './imports/generateImports';
export { cacheDir, writeStyles } from './styles/writeStyles';
export declare function resolveVuetifyBase(): string;
export declare function isObject(value: any): value is object;
export declare function includes(arr: any[], val: any): boolean;
export declare function normalizePath(p: string): string;
export declare function toKebabCase(str?: string): string;
export declare const transformAssetUrls: Record<string, string[]>;

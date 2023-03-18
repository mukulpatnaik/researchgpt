import { Plugin } from 'vite';
import { Options, transformAssetUrls } from '@vuetify/loader-shared';
declare function vuetify(_options?: Options): Plugin[];
export default vuetify;
export { transformAssetUrls };

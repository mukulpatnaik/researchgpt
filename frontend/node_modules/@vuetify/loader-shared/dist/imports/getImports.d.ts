import { TemplateMatch } from './parseTemplate';
export declare function getImports(source: string): {
    imports: Map<string, string[]>;
    components: TemplateMatch[];
    directives: TemplateMatch[];
};

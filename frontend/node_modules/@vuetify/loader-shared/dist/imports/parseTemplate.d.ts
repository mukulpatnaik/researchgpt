export declare function parseTemplate(source: string): {
    components: Set<TemplateMatch>;
    directives: Set<TemplateMatch>;
};
export interface TemplateMatch {
    symbol: string;
    name: string;
    index: number;
    length: number;
}

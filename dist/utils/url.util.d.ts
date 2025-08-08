export declare class UrlUtil {
    static getQuery(url: string, queryKey?: string): string | Record<string, string>;
    static buildQueryString(params: Record<string, any>): string;
}

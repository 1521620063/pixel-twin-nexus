export declare class JsonUtil {
    static readJsonData(path: string): Promise<unknown | null>;
    static writeJsonData(path: string, data: unknown): Promise<void>;
}

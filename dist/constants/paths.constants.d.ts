export declare const JSON_PATHS: {
    readonly PIXEL_TWIN_USERS: "./json/pixelTwinUsers.json";
    readonly PIXEL_TWIN_CONFIG: "./json/pixelTwinConfig.json";
    readonly PIXEL_TWIN_LIST: "./json/pixelTwinList.json";
    readonly PIXEL_TWIN_MASTER_GPU: "./json/pixelTwinMasterGPU.json";
    readonly PIXEL_TWIN_SLAVE_GPU: "./json/pixelTwinSlaveGPU.json";
    readonly PIXEL_TWIN_LIST_SLAVE: "./json/pixelTwinListSlave.json";
};
export type JsonPathKeys = keyof typeof JSON_PATHS;
export type JsonPathValues = typeof JSON_PATHS[JsonPathKeys];

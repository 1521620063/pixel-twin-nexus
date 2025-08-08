interface SlaveGpuConfig {
    ip: string;
    gpu: {
        graphicsAdapter: number;
        gpuMemory: number;
    }[];
}
interface SlaveListConfig {
    pixelTwinId: string;
    pixelTwinStartPath: string;
}
interface slaveInstance {
    pixelTwinId: string;
    pixelTwinInstanceId: string;
    UEProcess: any;
}
export { SlaveGpuConfig, SlaveListConfig, slaveInstance };

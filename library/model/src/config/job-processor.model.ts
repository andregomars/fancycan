export interface IJobProcessor {
    name: string;
    enabled: boolean;
    [key: string]: any;
}
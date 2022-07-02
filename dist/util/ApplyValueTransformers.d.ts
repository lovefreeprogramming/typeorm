import { ValueTransformer } from "../0101-decorator/options/ValueTransformer";
export declare class ApplyValueTransformers {
    static transformFrom(transformer: ValueTransformer | ValueTransformer[], databaseValue: any): any;
    static transformTo(transformer: ValueTransformer | ValueTransformer[], entityValue: any): any;
}

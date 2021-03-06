import { Subject } from "../0303-persistence/Subject";
/**
 * Thrown when same object is scheduled for remove and updation at the same time.
 */
export declare class SubjectRemovedAndUpdatedError extends Error {
    name: string;
    constructor(subject: Subject);
}

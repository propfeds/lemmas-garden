/**
 * Profiling utilities
 */
/**
 * Class for profiling a single part of code. All values are in seconds.
 * Use the 'profilers' instance to create a profiler.
 */
export class Profiler {
    /**
     * @returns {string}
     */
    get name(): string;
    /**
     * @returns {number}
     */
    get mean(): number;
    /**
     * @returns {number}
     */
    get min(): number;
    /**
     * @returns {number}
     */
    get max(): number;
    /**
     * @returns {number}
     */
    get variance(): number;
    /**
     * @returns {number} Standard Deviation
     */
    get stddev(): number;
    /**
     * @returns {number} The last recorded value
     */
    get latest(): number;
    /**
     * @returns {number} The number of times that the code was executed
     */
    get count(): number;
    /**
     * @param {function(void):void} f - The function to execute
     */
    exec(f: (arg0: void) => void): any;
}
/**
 * Class that contains a set of profilers.
 */
export class Profilers {
    /**
     * Creates or reuses an instance of the profiler with the given name
     * and execute the function 'f'. This is equivalent to
     * 'profilers.get(name).exec(f)'
     * @param {string} name - The name of the profiler
     * @param {function(void):void} f - The function to execute
     */
    exec(name: string, f: (arg0: void) => void): any;
    /**
     * Creates or reuses an instance of the profiler with the given name
     * and returns the instance.
     * @param {string} name - The name of the profiler
     * @return {Profiler} The new or existing profiler
     */
    get(name: string): Profiler;
}
/**
 * Instance of Profilers.
 * @type {Profilers}
 */
export const profilers: Profilers;

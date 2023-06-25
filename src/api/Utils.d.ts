/**
  * Similar to console.log, but sends a message to the SDK.
  * @param {Object} message
  */
export function log(message: any): any;
/**
 * Various formatting and calculation methods.
 */
export class Utils {
    /**
     * Adds '\(' and '\)' for inline LaTeX math display.
     * @param {String} value
     * @returns {String}
     */
    static getMath(value: string): string;
    /**
     * Adds '\(' and '\)' for inline LaTeX math display and an LaTeX arrow between the values.
     * @param {String} valueLeft
     * @param {String} valueRight
     * @returns {String}
     */
    static getMathTo(valueLeft: string, valueRight: string): string;
    /**
     * A value that increases exponentially using repeated steps.
     * For example, the difference in value for basePower=2, stepLength=3 will be
     * 1, 1, 1, 2, 2, 2, 4, 4, 4, 8, 8, 8, ...
     * @param {number} level - Level of the upgrade
     * @param {number} basePower - How the value difference increases
     * @param {number} stepLength - How many times the same difference is used
     * @param {number} offset - Value when the level is 0
     * @returns {BigNumber}
     */
    static getStepwisePowerSum(level: number, basePower: number, stepLength: number, offset: number): BigNumber;
    /**
     * Calculates the value of s_n(x) = x * Π_i^n (1 - (x/(k*π))^2)
     * @param {number} n
     * @param {BigNumber|number} x
     * @returns {BigNumber}
     */
    static getWeierstrassSineProd(m: any, x: BigNumber | number): BigNumber;
}
import { BigNumber } from "./BigNumber";

/**
 * Defines the accepted modes for auto-reset features.
 */
export class AutoResetMode {
    /** @returns {AutoResetMode} */ static get RATIO(): AutoResetMode;
    /** @returns {AutoResetMode} */ static get TIME(): AutoResetMode;
    /** @returns {AutoResetMode} */ static get EXPRESSION(): AutoResetMode;
}
/**
 * Properties of an in-game auto-reset (Prestige/Supremacy).
 */
export class AutoReset {
    /**
     * @type {boolean} Is the auto-reset toggle "on"?
     * @public
     */
    public isActive: boolean;
    /**
     * @type {AutoResetMode} Mode: Ratio/Time/Expression
     * @public
     */
    public mode: AutoResetMode;
    /**
     * @type {BigNumber} db/b ratio (if the mode is set to "Ratio")
     * @public
     */
    public ratio: BigNumber;
    /**
     * @type {number} Time, in seconds, for reset (if the mode is set to "Time")
     * @public
     */
    public time: number;
    /**
     * @type {String} Math expression (if the mode is set to "Math Expression")
     * @public
     */
    public expression: string;
    /**
     * @returns {boolean} Is the auto-reset purchased?
     */
    get isAvailable(): boolean;
}
import { BigNumber } from "./BigNumber";

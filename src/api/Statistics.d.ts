/**
 * Gathers most statistics of the Statistics popup
 */
export class Statistics {
    /**
     * @returns {number}
     */
    get equationTapCount(): number;
    /**
     * @returns {number}
     */
    get tickCount(): number;
    /**
     * @returns {number}
     */
    get prestigeCount(): number;
    /**
     * @returns {number}
     */
    get supremacyCount(): number;
    /**
     * @returns {number}
     */
    get graduationCount(): number;
    /**
     * @returns {number}
     */
    get timeSinceLastPrestige(): number;
    /**
     * @returns {number}
     */
    get timeSinceLastSupremacy(): number;
    /**
     * @returns {number}
     */
    get timeSinceLastGraduation(): number;
    /**
     * @returns {number}
     */
    get durationOfLastPrestige(): number;
    /**
     * @returns {number}
     */
    get durationOfLastSupremacy(): number;
    /**
     * @returns {number}
     */
    get onlineTime(): number;
    /**
     * @returns {number}
     */
    get gameTime(): number;
    /**
     * @returns {BigNumber}
     */
    get lifetimeF(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get graduationF(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get supremacyF(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get prestigeF(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get previousB(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get maxDt(): BigNumber;
    /**
     * @returns {number}
     */
    get rewardCount(): number;
}
import { BigNumber } from "./BigNumber";

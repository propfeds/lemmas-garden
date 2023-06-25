/**
 * Generic upgrade
 */
export class Upgrade {
    /**
     * Holds a function to call to get the description of the upgrade given a buy amount.
     * The amount is always positive and relative to the current level.
     * Note: Can only be modified within a custom theory
     * @type {function(number):string}
     * @public
     */
    public getDescription: (arg0: number) => string;
    /**
     * Holds the static description of the upgrade. For dynamic descriptions, use getDescription.
     * Note: Can only be modified within a custom theory
     * @type {String}
     * @public
     */
    public description: string;
    /**
     * Holds a function to call to get the info of the upgrade ('i' button) given a buy amount.
     * The amount is always positive and relative to the current level.
     * Note: Can only be modified within a custom theory
     * @type {function(number):string}
     * @public
     */
    public getInfo: (arg0: number) => string;
    /**
     * Holds the static info of the upgrade. For dynamic info, use getInfo.
     * Note: Can only be modified within a custom theory
     * @type {String}
     * @public
     */
    public info: string;
    /**
     * Holds a function that returns whether a given amount of upgrade level can be refunded.
     * The amount is always positive and relative to the current level.
     * Note: Can only be modified within a custom theory
     * @type {function(number):boolean}
     * @public
     */
    public canBeRefunded: (arg0: number) => boolean;
    /**
     * Current level of the upgrade. Default: 0.
     * Notes:
     *  - Can only be modified within a custom theory.
     *  - Cannot be negative or lower than maxLevel
     *  - When set, 'bought', 'refunded', 'boughtOrRefunded'
     *    will be called depending on the previous level.
     * @type {number}
     * @public
     */
    public level: number;
    /**
     * Maximum level of the upgrade. Default: Max integer.
     * Notes:
     *  - Can only be modified within a custom theory.
     *  - Cannot be negative or lower than the current level
     * @type {number}
     * @public
     */
    public maxLevel: number;
    /**
     * Is the upgrade available to buy (in the list)? Default: true.
     * Note: Can only be modified within a custom theory
     * @type {boolean}
     * @public
     */
    public isAvailable: boolean;
    /**
     * Is the upgrade considered by the auto-buyer and the "buy all" button? Default: true.
     * @type {boolean}
     * @public
     */
    public isAutoBuyable: boolean;
    /**
     * @returns {number} Unique ID
     */
    get id(): number;
    /**
     * @returns {Currency} Currency model associated to the upgrade
     */
    get currency(): Currency;
    /**
     * @returns {Cost} Cost model associated to the upgrade
     */
    get cost(): Cost;
    /**
     * Sets a function to call when the level increases of a given amount.
     * The amount is always positive and relative to the current level.
     * @param {function(number):void} onBought
     */
    set bought(arg: (arg0: number) => void);
    /**
     * Sets a function to call when the level decreases of a given amount.
     * The amount is always positive and relative to the current level.
     * @param {function(number):void} onRefunded
     */
    set refunded(arg: (arg0: number) => void);
    /**
     * Sets a function to call when the level increases or decreases of a given amount.
     * The amount is always positive and relative to the current level.
     * @param {function(number):void} onBoughtOrRefunded
     */
    set boughtOrRefunded(arg: (arg0: number) => void);
    /**
     * Buys a specified amount of this upgrade. Does nothing if it cannot afford it.
     * Enter a negative value to buy the maximum amount.
     * @param {number} amount - Number of levels to purchase
     */
    buy(amount: number): any;
    /**
     * Refunds a specified amount of this upgrade. Does nothing if it cannot refund it.
     * Enter a negative value to refund all levels.
     * @param {number} amount - Number of levels to refund
     */
    refund(amount: number): any;
}
/**
 * Variable
 */
export class Variable extends Upgrade {
    /**
     * @returns {number} Power of the variable. In [0, 1].
     */
    get power(): number;
}
/**
 * Research Upgrade
 */
export class Research extends Upgrade {
    /**
     * @returns {number} Power of the research upgrade. In [0, 1].
     */
    get power(): number;
}
import { Currency } from "./Currency";
import { Cost } from "./Costs";

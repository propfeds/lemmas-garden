/**
 * Holds a single currency
 */
export class Currency {
    /**
     * The current value of currency
     * Note: Can only be set within a custom theory.
     * @type {BigNumber}
     * @public
     */
    public value: BigNumber;
    /**
     * The symbol of currency
     * @returns {string}
     */
    get symbol(): string;
}
import { BigNumber } from "./BigNumber";

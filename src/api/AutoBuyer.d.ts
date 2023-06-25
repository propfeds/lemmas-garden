/**
 * Properties of an in-game auto-buyer
 */
export class AutoBuyer {
    /**
     * @type {boolean} Is the auto-buyer toggle "on"?
     * @public
     */
    public isActive: boolean;
    /**
     * @returns {boolean} Is the auto-buyer purchased?
     */
    get isAvailable(): boolean;
}

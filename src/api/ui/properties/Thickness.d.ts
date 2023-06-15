/**
 * Thickness of "padding" and "margin" properties
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.thickness
 */
export class Thickness {
    /**
     * If 1 parameter is provided, the value is used for all sides.
     * If 2 parameters are provided, the first value is used for left/right
     * and the second value is used for top/bottom.
     * You must provide either 1, 2, or 4 parameters.
     * @param {number} left
     * @param {number} [top]
     * @param {number} [right]
     * @param {number} [bottom]
     */
    constructor(left: number, top?: number, right?: number, bottom?: number);
    /**
     * @type {number}
     * @public
     */
    public left: number;
    /**
     * @type {number}
     * @public
     */
    public top: number;
    /**
     * @type {number}
     * @public
     */
    public right: number;
    /**
     * @type {number}
     * @public
     */
    public bottom: number;
}

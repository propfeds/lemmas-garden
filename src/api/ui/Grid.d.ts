import { Layout } from "./Layout";

/**
 * Grid layout
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.grid
 */
export class Grid extends Layout {
    /**
     * @type {Array.<number>}
     * @public
     */
    public columnDefinitions: Array<number>;
    /**
     * @type {number}
     * @public
     */
    public columnSpacing: number;
    /**
     * @type {Array.<number>}
     * @public
     */
    public rowDefinitions: Array<number>;
    /**
     * @type {number}
     * @public
     */
    public rowSpacing: number;
}

/**
 * Frame layout
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.frame
 */
export class Frame {
    /**
     * @type {Color}
     * @public
     */
    public borderColor: Color;
    /**
     * @type {number}
     * @public
     */
    public cornerRadius: number;
    /**
     * @type {boolean}
     * @public
     */
    public hasShadow: boolean;
    /**
     * @type {View}
     * @public
     */
    public content: View;
}
import { Color } from "./properties/Color";

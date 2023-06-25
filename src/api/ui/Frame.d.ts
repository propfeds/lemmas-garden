/**
 * Frame layout
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.frame
 */
export class Frame extends Layout {
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
import { Layout } from "./Layout";
import { Color } from "./properties/Color";
import { View } from "./View";

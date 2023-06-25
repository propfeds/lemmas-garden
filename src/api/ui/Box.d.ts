/**
 * Box view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.boxview
 */
export class Box extends View {
    /**
     * @type {CornerRadius}
     * @public
     */
    public cornerRadius: CornerRadius;
    /**
     * @type {Color}
     * @public
     */
    public color: Color;
}
import { CornerRadius } from "./properties/CornerRadius";
import { Color } from "./properties/Color";
import { View } from "./View";

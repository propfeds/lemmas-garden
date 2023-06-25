/**
 * CheckBox view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.checkbox
 */
export class CheckBox extends View {
    /**
     * @type {Color}
     * @public
     */
    public color: Color;
    /**
     * @type {boolean}
     * @public
     */
    public isChecked: boolean;
    /**
     * @type {function(void):void}
     * @public
     */
    public onCheckedChanged: (arg0: void) => void;
}
import { Color } from "./properties/Color";
import { View } from "./View";

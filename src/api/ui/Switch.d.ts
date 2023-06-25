/**
 * Switch view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.switch
 */
export class Switch extends View {
    /**
     * @type {Color}
     * @public
     */
    public onColor: Color;
    /**
     * @type {Color}
     * @public
     */
    public thumbColor: Color;
    /**
     * @type {boolean}
     * @public
     */
    public isToggled: boolean;
    /**
     * @type {function(void):void}
     * @public
     */
    public onToggled: (arg0: void) => void;
}
import { View } from "./View";
import { Color } from "./properties/Color";

/**
 * Layout view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.layout
 */
export class Layout extends View {
    /**
     * @type {boolean}
     * @public
     */
    public cascadeInputTransparent: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isClippedToBounds: boolean;
    /**
     * @type {Thickness}
     * @public
     */
    public padding: Thickness;
    /**
     * @type {Array.<View>}
     * @public
     */
    public children: Array<View>;
    /**
     * @type {function(void):void}
     * @public
     */
    public onLayoutChanged: (arg0: void) => void;
}
import { Thickness } from "./properties/Thickness";
import { View } from "./View";


/**
 * Button view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.button
 */
export class Button extends View {
    /**
     * @type {Color}
     * @public
     */
    public borderColor: Color;
    /**
     * @type {number}
     * @public
     */
    public borderWidth: number;
    /**
     * @type {number}
     * @public
     */
    public cornerRadius: number;
    /**
     * @type {FontAttributes}
     * @public
     */
    public fontAttributes: FontAttributes;
    /**
     * @type {FontFamily}
     * @public
     */
    public fontFamily: FontFamily;
    /**
     * @type {number}
     * @public
     */
    public fontSize: number;
    /**
     * @type {Thickness}
     * @public
     */
    public padding: Thickness;
    /**
     * @type {string}
     * @public
     */
    public text: string;
    /**
     * @type {Color}
     * @public
     */
    public textColor: Color;
    /**
     * @type {function(void):void}
     * @public
     */
    public onClicked: (arg0: void) => void;
    /**
     * @type {function(void):void}
     * @public
     */
    public onPressed: (arg0: void) => void;
    /**
     * @type {function(void):void}
     * @public
     */
    public onReleased: (arg0: void) => void;
}
import { Color } from "./properties/Color";
import { FontAttributes } from "./properties/FontAttributes";
import { FontFamily } from "./properties/FontFamily";
import { Thickness } from "./properties/Thickness";
import { View } from "./View";

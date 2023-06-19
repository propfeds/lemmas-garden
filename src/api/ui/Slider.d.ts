/**
 * Slider view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.slider
 */
export class Slider extends View {
    /**
     * @type {number}
     * @public
     */
    public minimum: number;
    /**
     * @type {number}
     * @public
     */
    public maximum: number;
    /**
     * @type {number}
     * @public
     */
    public value: number;
    /**
     * @type {Color}
     * @public
     */
    public minimumTrackColor: Color;
    /**
     * @type {Color}
     * @public
     */
    public maximumTrackColor: Color;
    /**
     * @type {Color}
     * @public
     */
    public thumbColor: Color;
    /**
     * @type {ImageSource}
     * @public
     */
    public thumbImageSource: ImageSource;
    /**
     * @type {function(void):void}
     * @public
     */
    public onValueChanged: (arg0: void) => void;
    /**
     * @type {function(void):void}
     * @public
     */
    public onDragStarted: (arg0: void) => void;
    /**
     * @type {function(void):void}
     * @public
     */
    public onDragCompleted: (arg0: void) => void;
}
import { View } from "./View";
import { Color } from "./properties/Color";
import { ImageSource } from "./properties/ImageSource";

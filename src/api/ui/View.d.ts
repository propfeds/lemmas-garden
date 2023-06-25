/**
 * Base view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.view
 */
export class View {
    /**
     * @type {number}
     * @public
     */
    public anchorX: number;
    /**
     * @type {number}
     * @public
     */
    public anchorY: number;
    /**
     * @type {Color}
     * @public
     */
    public backgroundColor: Color;
    /**
     * @type {boolean}
     * @public
     */
    public inputTransparent: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isEnabled: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isVisible: boolean;
    /**
     * @type {Thickness}
     * @public
     */
    public margin: Thickness;
    /**
     * @type {LayoutOptions}
     * @public
     */
    public horizontalOptions: LayoutOptions;
    /**
     * @type {LayoutOptions}
     * @public
     */
    public verticalOptions: LayoutOptions;
    /**
     * @type {number}
     * @public
     */
    public widthRequest: number;
    /**
     * @type {number}
     * @public
     */
    public heightRequest: number;
    /**
     * @type {number}
     * @public
     */
    public minimumWidthRequest: number;
    /**
     * @type {number}
     * @public
     */
    public minimumHeightRequest: number;
    /**
     * @type {number}
     * @public
     */
    public rotation: number;
    /**
     * @type {number}
     * @public
     */
    public rotationX: number;
    /**
     * @type {number}
     * @public
     */
    public rotationY: number;
    /**
     * @type {number}
     * @public
     */
    public scale: number;
    /**
     * @type {number}
     * @public
     */
    public scaleX: number;
    /**
     * @type {number}
     * @public
     */
    public scaleY: number;
    /**
     * @type {number}
     * @public
     */
    public translationX: number;
    /**
     * @type {number}
     * @public
     */
    public translationY: number;
    /**
     * @type {number}
     * @public
     */
    public row: number;
    /**
     * @type {number}
     * @public
     */
    public column: number;
    /**
     * @type {function(void):void}
     * @public
     */
    public onSizeChanged: (arg0: void) => void;
    /**
     * @type {function(TouchEvent):void}
     * @public
     */
    public onTouched: (arg0: TouchEvent) => void;
    /**
     * @returns {number}
     */
    get width(): number;
    /**
     * @returns {number}
     */
    get height(): number;
    /**
     * @returns {number}
     */
    get x(): number;
    /**
     * @returns {number}
     */
    get y(): number;
    /**
     * @param {number} value - Target value of 'opacity'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    fadeTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} value - Relative target value of 'scale' (target = scale * value)
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    relScaleTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} value - Target value of 'scale'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    scaleTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} value - Target value of 'scaleX'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    scaleXTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} value - Target value of 'scaleY'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    scaleYTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} value - Target value of 'rotation' (target = rotation + value)
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    relRotateTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} value - Target value of 'rotation'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    rotateTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} value - Target value of 'rotationX'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    rotateXTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} value - Target value of 'rotationY'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    rotateYTo(value: number, length: number, easing?: Easing): any;
    /**
     * @param {number} valueX - Target value of 'translationX'
     * @param {number} valueY - Target value of 'translationY'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    translateTo(valueX: number, valueY: number, length: number, easing?: Easing): any;
}
import { Color } from "./properties/Color";
import { Thickness } from "./properties/Thickness";
import { LayoutOptions } from "./properties/LayoutOptions";
import { TouchEvent } from "./properties/TouchEvent";
import { Easing } from "./properties/Easing";

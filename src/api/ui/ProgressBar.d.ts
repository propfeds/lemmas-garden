/**
 * Progress bar view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.progressbar
 */
export class ProgressBar extends View {
    /**
     * @type {Color}
     * @public
     */
    public progressColor: Color;
    /**
     * @type {number}
     * @public
     */
    public progress: number;
    /**
     * @param {number} value - Target value of 'progress'
     * @param {number} length - Time milliseconds to reach the target value
     * @param {Easing} [easing] - Type of smoothing to apply to the transition. Default: Easing.LINEAR
     */
    progressTo(value: number, length: number, easing?: Easing): any;
}
import { View } from "./View";
import { Color } from "./properties/Color";
import { Easing } from "./properties/Easing";

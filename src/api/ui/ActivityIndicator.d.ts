/**
 * Activity Indicator view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.activityindicator
 */
export class ActivityIndicator extends View {
    /**
     * @type {Color}
     * @public
     */
    public color: Color;
    /**
     * @type {boolean}
     * @public
     */
    public isRunning: boolean;
}
import { Color } from "./properties/Color";
import { View } from "./View";

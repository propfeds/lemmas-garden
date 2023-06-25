/**
 * Scroll area view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.scrollview
 */
export class ScrollView extends View {
    /**
     * @type {View}
     * @public
     */
    public content: View;
    /**
     * @type {ScrollBarVisibility}
     * @public
     */
    public horizontalScrollBarVisibility: ScrollBarVisibility;
    /**
     * @type {ScrollBarVisibility}
     * @public
     */
    public verticalScrollBarVisibility: ScrollBarVisibility;
    /**
     * @type {ScrollOrientation}
     * @public
     */
    public orientation: ScrollOrientation;
    /**
     * @type {function(void):void}
     * @public
     */
    public onScrolled: (arg0: void) => void;
    /**
     * @returns {number}
     */
    get scrollX(): number;
    /**
     * @returns {number}
     */
    get scrollY(): number;
}
import { ScrollBarVisibility } from "./properties/ScrollBarVisibility";
import { ScrollOrientation } from "./properties/ScrollOrientation";
import { View } from "./View";

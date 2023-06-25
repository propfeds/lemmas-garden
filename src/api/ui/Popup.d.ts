/**
 * Popup view
 */
export class Popup extends View {
    /**
     * @type {string}
     * @public
     */
    public title: string;
    /**
     * @type {boolean}
     * @public
     */
    public closeOnBackgroundClicked: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public closeOnBackButtonClicked: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isPeekable: boolean;
    /**
     * @type {View}
     * @public
     */
    public content: View;
    /**
     * @type {function(void):void}
     * @public
     */
    public onAppearing: (arg0: void) => void;
    /**
     * @type {function(void):void}
     * @public
     */
    public onDisappearing: (arg0: void) => void;
    /**
     * Display the popup
     */
    show(): any;
    /**
     * Hide the popup
     */
    hide(): any;
}
import { View } from "./View";

/**
 * Properties of a touch event
 */
export class TouchEvent {
    /**
     * @type {TouchType}
     * @public
     */
    public type: TouchType;
    /**
     * The x position of the touch event relative to its parent
     * @type {number}
     * @public
     */
    public x: number;
    /**
     * The y position of the touch event relative to its parent
     * @type {number}
     * @public
     */
    public y: number;
    /**
     * The x position of the touch event relative to the whole app
     * @type {number}
     * @public
     */
    public absoluteX: number;
    /**
     * The x position of the touch event relative to the whole app
     * @type {number}
     * @public
     */
    public absoluteY: number;
}
import { TouchType } from "./TouchType";

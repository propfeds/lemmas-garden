/**
 * LaTeX label view
 * Reference: https://github.com/verybadcat/CSharpMath
 */
export class LatexLabel extends View {
    /**
     * @type {number}
     * @public
     */
    public displacementX: number;
    /**
     * @type {number}
     * @public
     */
    public displacementY: number;
    /**
     * @type {number}
     * @public
     */
    public fontSize: number;
    /**
     * @type {TextAlignment}
     * @public
     */
    public horizontalTextAlignment: TextAlignment;
    /**
     * @type {number}
     * @public
     */
    public magnification: number;
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
     * @type {TextAlignment}
     * @public
     */
    public verticalTextAlignment: TextAlignment;
}
import { TextAlignment } from "./properties/TextAlignment";
import { Thickness } from "./properties/Thickness";
import { Color } from "./properties/Color";import { View } from "./View";


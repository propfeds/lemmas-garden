/**
 * Label view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.label
 */
export class Label extends View {
    /**
     * @type {number}
     * @public
     */
    public characterSpacing: number;
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
     * @type {TextAlignment}
     * @public
     */
    public horizontalTextAlignment: TextAlignment;
    /**
     * @type {LineBreakMode}
     * @public
     */
    public lineBreakMode: LineBreakMode;
    /**
     * @type {number}
     * @public
     */
    public lineHeight: number;
    /**
     * @type {number}
     * @public
     */
    public maxLines: number;
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
     * @type {TextDecorations}
     * @public
     */
    public textDecorations: TextDecorations;
    /**
     * @type {TextAlignment}
     * @public
     */
    public verticalTextAlignment: TextAlignment;
}
import { FontAttributes } from "./properties/FontAttributes";
import { FontFamily } from "./properties/FontFamily";
import { TextAlignment } from "./properties/TextAlignment";
import { LineBreakMode } from "./properties/LineBreakMode";
import { Thickness } from "./properties/Thickness";
import { Color } from "./properties/Color";
import { TextDecorations } from "./properties/TextDecorations";import { View } from "./View";


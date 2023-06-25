/**
 * Entry view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.entry
 */
export class Entry extends View {
    /**
     * @type {number}
     * @public
     */
    public characterSpacing: number;
    /**
     * @type {ClearButtonVisibility}
     * @public
     */
    public clearButtonVisibility: ClearButtonVisibility;
    /**
     * @type {number}
     * @public
     */
    public cursorPosition: number;
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
     * @type {boolean}
     * @public
     */
    public isPassword: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isReadOnly: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isSpellCheckEnabled: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isTextPredictionEnabled: boolean;
    /**
     * @type {Keyboard}
     * @public
     */
    public keyboard: Keyboard;
    /**
     * @type {number}
     * @public
     */
    public maxLength: number;
    /**
     * @type {function(void):void}
     * @public
     */
    public onCompleted: (arg0: void) => void;
    /**
     * @type {function(string, string):void} Parameters: (oldTextValue, newTextValue)
     * @public
     */
    public onTextChanged: (arg0: string, arg1: string) => void;
    /**
     * @type {string}
     * @public
     */
    public placeholder: string;
    /**
     * @type {Color}
     * @public
     */
    public placeholderColor: Color;
    /**
     * @type {ReturnType}
     * @public
     */
    public returnType: ReturnType;
    /**
     * @type {number}
     * @public
     */
    public selectionLength: number;
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
import { ClearButtonVisibility } from "./properties/ClearButtonVisibility";
import { FontAttributes } from "./properties/FontAttributes";
import { FontFamily } from "./properties/FontFamily";
import { TextAlignment } from "./properties/TextAlignment";
import { Keyboard } from "./properties/Keyboard";
import { ReturnType } from "./properties/ReturnType";
import { Color } from "./properties/Color";
import { View } from "./View";

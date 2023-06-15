/**
 * Color Properties
 */
export class Color {
    /** @returns {Color} */ static get DEFAULT(): Color;
    /** @returns {Color} */ static get TRANSPARENT(): Color;
    /** @returns {Color} */ static get DARK_BACKGROUND(): Color;
    /** @returns {Color} */ static get MEDIUM_BACKGROUND(): Color;
    /** @returns {Color} */ static get LIGHT_BACKGROUND(): Color;
    /** @returns {Color} */ static get BORDER(): Color;
    /** @returns {Color} */ static get TEXT(): Color;
    /** @returns {Color} */ static get TEXT_MEDIUM(): Color;
    /** @returns {Color} */ static get TEXT_DARK(): Color;
    /** @returns {Color} */ static get DEACTIVATED_UPGRADE(): Color;
    /** @returns {Color} */ static get MINIGAME_TILE_DARK(): Color;
    /** @returns {Color} */ static get MINIGAME_TILE_LIGHT(): Color;
    /** @returns {Color} */ static get MINIGAME_TILE_BORDER(): Color;
    /** @returns {Color} */ static get SELECTION_DESELECTED(): Color;
    /** @returns {Color} */ static get SELECTION_SELECTED(): Color;
    /** @returns {Color} */ static get SWITCH_BACKGROUND(): Color;
    /** @returns {Color} */ static get ACHIEVEMENT_CATEGORY(): Color;
    /**
     * @param {number} r - Red value in [0,1]
     * @param {number} g - Green value in [0,1]
     * @param {number} b - Blue value in [0,1]
     * @returns {Color}
     * */
    static fromRgb(r: number, g: number, b: number): Color;
    /**
     * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.color.fromhex?view=xamarin-forms#Xamarin_Forms_Color_FromHex_System_String_
     * @param {string} hex - Hexadecimal value
     * @returns {Color}
     * */
    static fromHex(hex: string): Color;
}

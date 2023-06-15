/**
 * Font family of a UIButton, a UIEntry, or a UILabel
 */
export class FontFamily {
    /**
     * Default OS Font
     * @returns {FontFamily}
     */
    static get DEFAULT(): FontFamily;
    /**
     * LaTeX font for text
     * @returns {FontFamily}
     */
    static get CMU_REGULAR(): FontFamily;
    /**
     * Italic LaTeX font for text
     * @returns {FontFamily}
     */
    static get CMU_ITALIC(): FontFamily;
    /**
     * Specialized LaTeX font for numbers
     * @returns {FontFamily}
     */
    static get CMU_NUMBERS(): FontFamily;
    /**
     * Bold LaTeX font for text
     * @returns {FontFamily}
     */
    static get CMU_BOLD(): FontFamily;
}

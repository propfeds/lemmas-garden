/**
 * Image source for a UIImage
 */
export class ImageSource {
    /** @returns {ImageSource} */ static get ADD(): ImageSource;
    /** @returns {ImageSource} */ static get ACCELERATE(): ImageSource;
    /** @returns {ImageSource} */ static get ACHIEVEMENTS(): ImageSource;
    /** @returns {ImageSource} */ static get ARROW_120(): ImageSource;
    /** @returns {ImageSource} */ static get ARROW_90(): ImageSource;
    /** @returns {ImageSource} */ static get BOOK(): ImageSource;
    /** @returns {ImageSource} */ static get CHANGE(): ImageSource;
    /** @returns {ImageSource} */ static get CHECKLIST(): ImageSource;
    /** @returns {ImageSource} */ static get CLOSE(): ImageSource;
    /** @returns {ImageSource} */ static get COPY(): ImageSource;
    /** @returns {ImageSource} */ static get ELLIPSIS(): ImageSource;
    /** @returns {ImageSource} */ static get EYE(): ImageSource;
    /** @returns {ImageSource} */ static get FAST_FORWARD(): ImageSource;
    /** @returns {ImageSource} */ static get FUNCTION(): ImageSource;
    /** @returns {ImageSource} */ static get INFO(): ImageSource;
    /** @returns {ImageSource} */ static get LANGUAGE(): ImageSource;
    /** @returns {ImageSource} */ static get LOCK(): ImageSource;
    /** @returns {ImageSource} */ static get MINUS(): ImageSource;
    /** @returns {ImageSource} */ static get PLUS(): ImageSource;
    /** @returns {ImageSource} */ static get PRESTIGE(): ImageSource;
    /** @returns {ImageSource} */ static get PUBLISH(): ImageSource;
    /** @returns {ImageSource} */ static get REFUND(): ImageSource;
    /** @returns {ImageSource} */ static get RESET(): ImageSource;
    /** @returns {ImageSource} */ static get REWARDS(): ImageSource;
    /** @returns {ImageSource} */ static get SDK(): ImageSource;
    /** @returns {ImageSource} */ static get SECRET(): ImageSource;
    /** @returns {ImageSource} */ static get SETTINGS(): ImageSource;
    /** @returns {ImageSource} */ static get STAR_EMPTY(): ImageSource;
    /** @returns {ImageSource} */ static get STAR_FULL(): ImageSource;
    /** @returns {ImageSource} */ static get STUDENTS(): ImageSource;
    /** @returns {ImageSource} */ static get ENTRY(): ImageSource;
    /** @returns {ImageSource} */ static get THEORY(): ImageSource;
    /** @returns {ImageSource} */ static get UP_DOWN_ARROWS(): ImageSource;
    /** @returns {ImageSource} */ static get UPGRADES(): ImageSource;
    /** @returns {ImageSource} */ static get WARNING(): ImageSource;
    /**
     * Retreives an image from an URI.
     * Limitations: This function can only be called directly,
     * and its argument must be a string literal.
     * Examples:
     *   ImageSource.fromUri("http://some.url.com/image.png"); // OK
     *   ImageSource.fromUri("http://some.url.com/" + "image.png"); // Error
     *   ImageSource.fromUri(getImage()); // Error
     *   ImageSource.fromUri(urls[0]); // Error
     *   var getUri = ImageSource.fromUri; getUri("http://some.url.com/image.png") // Error
     * @param {string} uri - The URI of the image
     * @returns {ImageSource}
     */
    static fromUri(uri: string): ImageSource;
}

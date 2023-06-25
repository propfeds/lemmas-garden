/**
 * Touch type of a TouchEvent
 */
export class TouchType {
    /** @returns {TouchType} */ static get ENTERED(): TouchType;
    /** @returns {TouchType} */ static get EXITED(): TouchType;
    /** @returns {TouchType} */ static get MOVED(): TouchType;
    /** @returns {TouchType} */ static get PRESSED(): TouchType;
    /** @returns {TouchType} */ static get SHORTPRESS_RELEASED(): TouchType;
    /** @returns {TouchType} */ static get LONGPRESS(): TouchType;
    /** @returns {TouchType} */ static get LONGPRESS_RELEASED(): TouchType;
    /** @returns {TouchType} */ static get CANCELLED(): TouchType;
    /**
     * @returns {boolean} true if the type is either SHORTPRESS_RELEASED, LONGPRESS_RELEASED, or CANCELLED.
     */
    isReleased(): boolean;
}

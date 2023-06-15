/**
 * Easing of an animation
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.easing
 */
export class Easing {
    /** @returns {Easing} */ static get BOUNCE_IN(): Easing;
    /** @returns {Easing} */ static get BOUNCE_OUT(): Easing;
    /** @returns {Easing} */ static get CUBIC_IN(): Easing;
    /** @returns {Easing} */ static get CUBIC_INOUT(): Easing;
    /** @returns {Easing} */ static get CUBIC_OUT(): Easing;
    /** @returns {Easing} */ static get LINEAR(): Easing;
    /** @returns {Easing} */ static get SIN_IN(): Easing;
    /** @returns {Easing} */ static get SIN_INOUT(): Easing;
    /** @returns {Easing} */ static get SIN_OUT(): Easing;
    /** @returns {Easing} */ static get SPRING_IN(): Easing;
    /** @returns {Easing} */ static get SPRING_OUT(): Easing;
}

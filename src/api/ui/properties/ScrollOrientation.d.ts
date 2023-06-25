/**
 * Scroll orientation of a UIScrollView
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.scrollorientation
 */
export class ScrollOrientation {
    /** @returns {ScrollOrientation} */ static get BOTH(): ScrollOrientation;
    /** @returns {ScrollOrientation} */ static get HORIZONTAL(): ScrollOrientation;
    /** @returns {ScrollOrientation} */ static get VERTICAL(): ScrollOrientation;
    /** @returns {ScrollOrientation} */ static get NEITHER(): ScrollOrientation;
}

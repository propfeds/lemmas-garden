/**
 * Layout options of a UIView
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.layoutoptions
 */
export class LayoutOptions {
    /** @returns {LayoutOptions} */ static get START(): LayoutOptions;
    /** @returns {LayoutOptions} */ static get CENTER(): LayoutOptions;
    /** @returns {LayoutOptions} */ static get END(): LayoutOptions;
    /** @returns {LayoutOptions} */ static get FILL(): LayoutOptions;
    /** @returns {LayoutOptions} */ static get START_AND_EXPAND(): LayoutOptions;
    /** @returns {LayoutOptions} */ static get CENTER_AND_EXPAND(): LayoutOptions;
    /** @returns {LayoutOptions} */ static get END_AND_EXPAND(): LayoutOptions;
    /** @returns {LayoutOptions} */ static get FILL_AND_EXPAND(): LayoutOptions;
}

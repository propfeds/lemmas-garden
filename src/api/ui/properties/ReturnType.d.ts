/**
 * Return type of a UIEntry
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.returntype
 */
export class ReturnType {
    /** @returns {ReturnType} */ static get DEFAULT(): ReturnType;
    /** @returns {ReturnType} */ static get DONE(): ReturnType;
    /** @returns {ReturnType} */ static get GO(): ReturnType;
    /** @returns {ReturnType} */ static get NEXT(): ReturnType;
    /** @returns {ReturnType} */ static get SEARCH(): ReturnType;
    /** @returns {ReturnType} */ static get SEND(): ReturnType;
}

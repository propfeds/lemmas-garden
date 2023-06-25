/**
 * Keyboard type of a UIEntry
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.keyboard
 */
export class Keyboard {
    /** @returns {Keyboard} */ static get PLAIN(): Keyboard;
    /** @returns {Keyboard} */ static get CHAT(): Keyboard;
    /** @returns {Keyboard} */ static get DEFAULT(): Keyboard;
    /** @returns {Keyboard} */ static get EMAIL(): Keyboard;
    /** @returns {Keyboard} */ static get NUMERIC(): Keyboard;
    /** @returns {Keyboard} */ static get TELEPHONE(): Keyboard;
    /** @returns {Keyboard} */ static get TEXT(): Keyboard;
    /** @returns {Keyboard} */ static get URL(): Keyboard;
}

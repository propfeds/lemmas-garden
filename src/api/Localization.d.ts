/**
 * Provide localization support for sentences that are already translated in the game.
 */
export class Localization {
    /**
     * Provides safe formatting using C# syntax.
     * @param {String} text - Templated literal, e.g., "Increase {0} by {1}"
     * @param {...object} args - Values to use in place of {0} and {1}
     * @returns {String}
     */
    static format(text: string, ...args: unknown[]): string;
    /**
     * Access to the translation service of the game.
     * @param {String} id - ID from the translation source document
     * @returns {String} Translated sentence from the game
     */
    static get(id: string): string;
    /**
     * @returns {string} Language code of the game selected by the player
     */
    static get language(): string;
    /**
     * @returns {boolean} Is the current active language Right-to-Left?
     */
    static get isRTL(): boolean;
    /**
     * Sentence: "Unlock {term}"
     * @param {String} term
     * @returns {String}
     */
    static getUpgradeUnlockDesc(term: string): string;
    /**
     * Sentence: "Unlocks {term}"
     * @param {String} term
     * @returns {String}
     */
    static getUpgradeUnlockInfo(term: string): string;
    /**
     * Sentence: "Add the term {term}"
     * @param {String} term
     * @returns {String}
     */
    static getUpgradeAddTermDesc(term: string): string;
    /**
     * Sentence: "Adds term {term} to the equation"
     * @param {String} term
     * @returns {String}
     */
    static getUpgradeAddTermInfo(term: string): string;
    /**
     * Sentence: "Add a new dimension"
     * @returns {String}
     */
    static getUpgradeAddDimensionDesc(): string;
    /**
     * Sentence: "Adds a new dimension to the linear space"
     * @returns {String}
     */
    static getUpgradeAddDimensionInfo(): string;
    /**
     * Sentence: "Unlock Publications"
     * @returns {String}
     */
    static getUpgradePublicationDesc(): string;
    /**
     * Sentence: "Unlocks a Prestige layer for theories"
     * @returns {String}
     */
    static getUpgradePublicationInfo(): string;
    /**
     * Sentence: '"Buy All" button'
     * @returns {String}
     */
    static getUpgradeBuyAllDesc(): string;
    /**
     * Sentence: "Allows to buy all theory upgrades"
     * @returns {String}
     */
    static getUpgradeBuyAllInfo(): string;
    /**
     * Sentence: "Upgrade auto-buyer"
     * @returns {String}
     */
    static getUpgradeAutoBuyerDesc(): string;
    /**
     * Sentence: "Automatically purchases theory upgrades"
     * @returns {String}
     */
    static getUpgradeAutoBuyerInfo(): string;
    /**
     * Sentence: "\\uparrow {paramName} by {amount}"
     * @param {String} paramName
     * @param {String} amount
     * @returns {String}
     */
    static getUpgradeIncCustomDesc(paramName: string, amount: string): string;
    /**
     * Sentence: "Increases {paramName} by {amount}"
     * @param {String} paramName
     * @param {String} amount
     * @returns {String}
     */
    static getUpgradeIncCustomInfo(paramName: string, amount: string): string;
    /**
     * Sentence: "\\times {paramName} by {amount}"
     * @param {String} paramName
     * @param {String} amount
     * @returns {String}
     */
    static getUpgradeMultCustomDesc(paramName: string, amount: string): string;
    /**
     * Sentence: "Multiplies {paramName} by {amount}"
     * @param {String} paramName
     * @param {String} amount
     * @returns {String}
     */
    static getUpgradeMultCustomInfo(paramName: string, amount: string): string;
    /**
     * Sentence: "\\downarrow {paramName} by {amount}"
     * @param {String} paramName
     * @param {String} amount
     * @returns {String}
     */
    static getUpgradeDecCustomDesc(paramName: string, amount: string): string;
    /**
     * Sentence: "Decreases {paramName} by {amount}"
     * @param {String} paramName
     * @param {String} amount
     * @returns {String}
     */
    static getUpgradeDecCustomInfo(paramName: string, amount: string): string;
    /**
     * Sentence: "\\uparrow {paramName} exponent by {amount}"
     * @param {String} paramName
     * @param {String} amount
     * @returns {String}
     */
    static getUpgradeIncCustomExpDesc(paramName: string, amount: string): string;
    /**
     * Sentence: "Increases {paramName} exponent by {amount}"
     * @param {String} paramName
     * @param {String} amount
     * @returns {String}
     */
    static getUpgradeIncCustomExpInfo(paramName: string, amount: string): string;
    /**
     * Sentence: 'Unlock "Chen Attractor"'
     * @returns {String}
     */
    static getUpgradeChenAttractor(): string;
    /**
     * Sentence: 'Unlock "Rössler Attractor"'
     * @returns {String}
     */
    static getUpgradeRosslerAttractor(): string;
    /**
     * Sentence: "Prove lemma {lemma}"
     * @param {number} lemma
     * @returns {number}
     */
    static getUpgradeProveLemma(lemma: number): number;
    /**
     * Sentence: "Theorem:"
     * @returns {String}
     */
    static getConvergenceTestTheorem(): string;
    /**
     * Sentence: "Lemma {lemma}:"
     * @param {number} lemma
     * @returns {number}
     */
    static getConvergenceTestLemma(lemma: number): number;
    /**
     * Sentence: "Q.E.D."
     * @returns {String}
     */
    static getConvergenceTestQED(): string;
    /**
     * Sentence: "Completion: {completion}%"
     * @param {number} completion
     * @returns {String}
     */
    static getConvergenceTestCompletion(completion: number): string;
}

export class Theme {
    /** @returns {Theme} */ static get STANDARD(): Theme;
    /** @returns {Theme} */ static get DARK(): Theme;
    /** @returns {Theme} */ static get LIGHT(): Theme;
}
export class GraphQuality {
    /** @returns {GraphQuality} */ static get LOW(): GraphQuality;
    /** @returns {GraphQuality} */ static get MEDIUM(): GraphQuality;
    /** @returns {GraphQuality} */ static get HIGH(): GraphQuality;
}
export class AcceleratorPosition {
    /** @returns {AcceleratorPosition} */ static get BOTTOM(): AcceleratorPosition;
    /** @returns {AcceleratorPosition} */ static get TOP(): AcceleratorPosition;
}
/**
 * Settings of the game.
 */
export class Settings {
    /**
     * @type {Theme}
     * @public
     */
    public theme: Theme;
    /**
     * @type {GraphQuality}
     * @public
     */
    public graphQuality: GraphQuality;
    /**
     * @type {AcceleratorPosition}
     * @public
     */
    public acceleratorPosition: AcceleratorPosition;
    /**
     * @type {boolean}
     * @public
     */
    public isOfflineProgressEnabled: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isSoundEnabled: boolean;
    /**
     * @type {boolean}
     * @public
     */
    public isMusicEnabled: boolean;
}

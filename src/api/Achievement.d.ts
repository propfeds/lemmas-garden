/**
 * Properties of an in-game achievement
 */
export class Achievement {
    /**
     * Can only be modified if you own the achievement.
     * Will not trigger the achievement popup when set to 'true'.
     * Only the unlock condition can trigger the achievement popup.
     * @type {boolean}
     * @public
     */
    public isUnlocked: boolean;
    /**
     * @returns {number} Unique id
     */
    get id(): number;
    /**
     * @returns {boolean}
     */
    get isSecret(): boolean;
    /**
     * @returns {String}
     */
    get category(): string;
    /**
     * @returns {String}
     */
    get name(): string;
    /**
     * @returns {String}
     */
    get description(): string;
    /**
     * @returns {String}
     */
    get hint(): string;
    /**
     * @returns {number} Number of rewarded stars when unlocking the achievement
     */
    get stars(): number;
    /**
     * @returns {Date} Date in UTC timezone. Null if not unlocked.
     */
    get dateUnlocked(): Date;
    /**
     * @returns {number} A number in [0, 1] representing the progress. 1 is 100%/unlocked.
     */
    get progress(): number;
}

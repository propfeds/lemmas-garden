/**
 * Holds a single row of the list of values that are
 * displayed on the right of the equation.
 */
export class QuaternaryEntry {
    /** @constructor
     * @param {String} name - Left side of the equality sign
     * @param {String} value - Right side of the equality sign
     */
    constructor(name: string, value: string);
    name: string;
    value: unknown;
}
/**
 * Properties of a theory.
 */
export class Theory {
    /**
     * @type {number} Relative scale of the primary equation. Default: 1
     * @public
     */
    public primaryEquationScale: number;
    /**
     * @type {number} Absolute height of the primary equation. Default: 40
     * @public
     */
    public primaryEquationHeight: number;
    /**
     * @type {number} Relative scale of the secondary equation. Default: 1
     * @public
     */
    public secondaryEquationScale: number;
    /**
     * @type {number} Absolute height of the secondary equation. Default: 30
     * @public
     */
    public secondaryEquationHeight: number;
    /**
     * @type {number} The buy amount of the 'Upgrades' panel
     * @public
     */
    public buyAmountUpgrades: number;
    /**
     * @type {number} The buy amount of the 'Permanent Upgrades' panel
     * @public
     */
    public buyAmountPermanentUpgrades: number;
    /**
     * Callback to know right before publishing the theory
     * @type {function(void):void}
     * @public
     */
    public publishing: (arg0: void) => void;
    /**
     * Callback to know right after publishing the theory
     * @type {function(void):void}
     * @public
     */
    public published: (arg0: void) => void;
    /**
     * @returns {number} Unique ID
     */
    get id(): number;
    /**
     * @returns {String} Name of the theory, as shown below the summary bar
     */
    get name(): string;
    /**
     * @returns {String} The symbol of the theory in ASCII, e.g., τ₁
     */
    get symbol(): string;
    /**
     * @returns {String} The symbol of the theory in LaTeX, e.g., \tau_1
     */
    get latexSymbol(): string;
    /**
     * @returns {boolean}
     */
    get isUnlocked(): boolean;
    /**
     * @returns {Currency[]}
     */
    get currencies(): Currency[];
    /**
     * @returns {Upgrade[]} Upgrades from the first panel
     */
    get upgrades(): Upgrade[];
    /**
     * @returns {Upgrade[]} Upgrades from the second panel
     */
    get permanentUpgrades(): Upgrade[];
    /**
     * @returns {Upgrade[]} Upgrades from the publication panel
     */
    get milestoneUpgrades(): Upgrade[];
    /**
     * This upgrade is also in "permanentUpgrades"
     * @returns {Upgrade}
     */
    get publicationUpgrade(): Upgrade;
    /**
     * This upgrade is also in "permanentUpgrades"
     * @returns {Upgrade}
     */
    get buyAllUpgrade(): Upgrade;
    /**
     * This upgrade is also in "permanentUpgrades"
     * @returns {Upgrade}
     */
    get autoBuyerUpgrade(): Upgrade;
    /**
     * @returns {boolean} Was the publication upgrade purchased? Equivalent to "publicationUpgrade.level > 0"
     */
    get isPublicationAvailable(): boolean;
    /**
     * @returns {boolean} Was the "buy all" upgrade purchased? Equivalent to "buyAllUpgrade.level > 0"
     */
    get isBuyAllAvailable(): boolean;
    /**
     * @returns {boolean} Was the auto-buyer upgrade purchased? Equivalent to "autoBuyerUpgrade.level > 0"
     */
    get isAutoBuyerAvailable(): boolean;
    /**
     * @returns {boolean} Is the toggle "on"?
     */
    get isAutoBuyerActive(): boolean;
    /**
     * @returns {BigNumber} The value of tau, as shown in the currency bar
     */
    get tau(): BigNumber;
    /**
     * @returns {BigNumber} The value of tau at the last publication
     */
    get tauPublished(): BigNumber;
    /**
     * @returns {BigNumber} The income multiplier, as shown in the publication popup
     */
    get publicationMultiplier(): BigNumber;
    /**
     * @returns {BigNumber} The income multiplier if the theory was published using the current tau value.
     */
    get nextPublicationMultiplier(): BigNumber;
    /**
     * @param {BigNumber|number} tau - The tau value for which you want to evaluate the multiplier.
     * @returns {BigNumber} The income multiplier if the theory was last published using the given tau value.
     */
    getPublicationMultiplier(tau: BigNumber | number): BigNumber;
    /**
     * @returns {boolean} Equivalent to "tau > tauPublished"
     */
    get canPublish(): boolean;
    /**
     * @returns {number} The amount of milestones left that can be spent on milestone upgrades
     */
    get milestonesUnused(): number;
    /**
     * @returns {number} The total amount of milestones done so far
     */
    get milestonesTotal(): number;
    /**
     * @returns {BigNumber} The value of tau required to get another milestone upgrade
     */
    get nextMilestone(): BigNumber;
    /**
     * @returns {String} LaTeX string of the primary equation
     */
    get primaryEquation(): string;
    /**
     * @returns {String} LaTeX string of the secondary equation
     */
    get secondaryEquation(): string;
    /**
     * @returns {String} LaTeX string of the tertiary equation
     */
    get tertiaryEquation(): string;
    /**
     * @returns {number} Amount of quaternary values
     */
    get quaternaryCount(): number;
    /**
     * @param {number} index - Index of the quaternary entry, starting at 0
     * @returns {String} LaTeX string of the name of the quaternary entry
     */
    quaternaryName(index: number): string;
    /**
     * @param {number} index - Index of the quaternary entry, starting at 0
     * @returns {String} LaTeX string of the value of the quaternary entry
     */
    quaternaryValue(index: number): string;
    /**
     * @returns {Achievement[]} List of all achievements of this theory
     */
    get achievements(): Achievement[];
    /**
     * @returns {StoryChapter[]} List of all story chapters of this theory
     */
    get storyChapters(): StoryChapter[];
    /**
     * Creates a new currency
     * Note: If multiple currency use the same symbol, the game will append a subscript
     * @param {string} [symbol] - The ASCII symbol for the currency - Default: "ρ"
     * @param {string} [latexSymbol] - The LaTeX symbol for the currency - Default: "\\rho"
     * @returns {Currency}
     */
    createCurrency(symbol?: string, latexSymbol?: string): Currency;
    /**
     * @param {number} id - Unique ID among regular upgrades
     * @param {Currency} currency - Currency to use for this upgrade
     * @param {Cost} cost - Cost model to use for this upgrade
     * @returns {Upgrade}
     */
    createUpgrade(id: number, currency: Currency, cost: Cost): Upgrade;
    /**
     * @param {number} id - Unique ID among permanent upgrades
     * @param {Currency} currency - Currency to use for this upgrade
     * @param {Cost} cost - Cost model to use for this upgrade
     * @returns {Upgrade}
     */
    createPermanentUpgrade(id: number, currency: Currency, cost: Cost): Upgrade;
    /**
     * @param {number} id - Unique ID among milestone upgrades
     * @param {number} maxLevel - Max level of this upgrade
     * @returns {Upgrade}
     */
    createMilestoneUpgrade(id: number, maxLevel: number): Upgrade;
    /**
     * A singular upgrade is an upgrade shown separately at the
     * top of the regular upgrades, like the "Prove Lemma" upgrade
     * in the theory "Convergence Test"
     * @param {number} id - Unique ID among singular upgraades
     * @param {Currency} currency - Currency to use for this upgrade
     * @param {Cost} cost - Cost model to use for this upgrade
     * @returns {Upgrade}
     */
    createSingularUpgrade(id: number, currency: Currency, cost: Cost): Upgrade;
    /**
     * @param {number} id - Unique ID among permanent upgrades
     * @param {Currency} currency - Currency to use for this upgrade
     * @param {number|BigNumber} cost - Cost model to use for this upgrade
     * @returns {Upgrade}
     */
    createPublicationUpgrade(id: number, currency: Currency, cost: number | BigNumber): Upgrade;
    /**
     * @param {number} id - Unique ID among permanent upgrades
     * @param {Currency} currency - Currency to use for this upgrade
     * @param {number|BigNumber} cost - Cost model to use for this upgrade
     * @returns {Upgrade}
     */
    createBuyAllUpgrade(id: number, currency: Currency, cost: number | BigNumber): Upgrade;
    /**
     * @param {number} id - Unique ID among permanent upgrades
     * @param {Currency} currency - Currency to use for this upgrade
     * @param {number|BigNumber} cost - Cost model to use for this upgrade
     * @returns {Upgrade}
     */
    createAutoBuyerUpgrade(id: number, currency: Currency, cost: number | BigNumber): Upgrade;
    /**
     * Sets the progress needed to buy milestones in logarithmic space.
     * The nth milestones will cost 10^cost.getCost(n-1).
     * For example, use "new LinearCost(25, 20)" to get
     * milestones at 1e25, 1e45, 1e65, etc.
     * @param {Cost} cost - Cost model for milestone upgrades.
     */
    setMilestoneCost(cost: Cost): any;
    /**
     * Force refresh the primary equation. (Main formula)
     */
    invalidatePrimaryEquation(): any;
    /**
     * Force refresh the secondary equation. (Formula right below the main one)
     */
    invalidateSecondaryEquation(): any;
    /**
     * Force refresh the tertiary equation. (Formula at the bottom of the equation area)
     */
    invalidateTertiaryEquation(): any;
    /**
     * Force refresh the quaternary value list. (List of values on the right side, e.g., Differential Calculus)
     */
    invalidateQuaternaryValues(): any;
    /**
     * Clears the graph
     */
    clearGraph(): any;
    /**
     * Performs a "tick" on the active theory.
     * Only works on custom theories coming from the SDK.
     */
    tick(): any;
    /**
     * Performs a "Publication".
     * Does nothing if publications are not available or the tau value is lower than the previous publication.
     */
    publish(): any;
    /**
     * Creates your own achievement category.
     * @param {number} id - Unique ID within the current custom theory achievements
     * @param {string} name - Name of the achievement
     * @returns {AchievementCategory}
     */
    createAchievementCategory(id: number, name: string): AchievementCategory;
    /**
     * Creates your own achievement.
     * @param {number} id - Unique ID within the current custom theory achievements
     * @param {AchievementCategory} [category] - Category of the achievement
     * @param {string} name - Name of the achievement
     * @param {string} description - Description of the achievement.
     * @param {function():boolean} unlockCondition - Function returning if the achievement can be unlocked. Checks every second. Stops being called once it is unlocked.
     * @param {function():number} [progress] - Function returning if the progress towards the achievement. In [0, 1].
     * @returns {Achievement}
     */
    createAchievement(id: number, category: AchievementCategory, name: string, description: string, unlockCondition: () => boolean, progress?: () => number): Achievement;
    /**
     * Creates your own secret achievement.
     * @param {number} id - Unique ID within the current custom theory achievements
     * @param {AchievementCategory} [category] - Category of the achievement
     * @param {string} name - Name of the secret achievement
     * @param {string} description - Description of the secret achievement.
     * @param {string} hint - Hint of the secret achievement.
     * @param {function():boolean} unlockCondition - Function returning if the achievement can be unlocked. Checks every second. Stops being called once it is unlocked.
     * @returns {Achievement}
     */
    createSecretAchievement(id: number, category: AchievementCategory, name: string, description: string, hint: string, unlockCondition: () => boolean): Achievement;
    /**
     * Creates your own story chapter.
     * @param {number} id - Unique ID within the current custom theory story chapters
     * @param {string} title - Title of the chapter
     * @param {string} text - Text of the chapter. You need to split lines yourself using '\n'.
     * @param {function():boolean} unlockCondition - Function returning if the chapter can be unlocked. Checks every second. Stops being called once it is unlocked.
     * @returns {StoryChapter}
     */
    createStoryChapter(id: number, title: string, text: string, unlockCondition: () => boolean): StoryChapter;
    /**
     * Completely resets the theory. Only available within its own custom theory.
     */
    reset(): void;
    /**
     * Pauses the theory.
     */
    pause(): void;
    /**
     * Resumes the theory from a paused state.
     */
    resume(): void;
}
/**
 * Instance of the current custom theory. Only available within a custom theory.
 * @type {Theory}
 */
export const theory: Theory;
import { Currency } from "./Currency";
import { Upgrade } from "./Upgrades";
import { BigNumber } from "./BigNumber";
import { Achievement } from "./Achievement";
import { StoryChapter } from "./StoryChapter";
import { Cost } from "./Costs";
import { AchievementCategory } from "./AchievementCategory";

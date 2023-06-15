/**
 * Properties of the game.
 */
export class Game {
    /**
     * @type {Theory} The currently active theory. Set to null to stop the current theory.
     * @public
     */
    public activeTheory: Theory;
    /**
     * Callback to know right before doing a Prestige
     * @type {function(void):void}
     * @public
     */
    public prePrestige: (arg0: void) => void;
    /**
     * Callback to know right after doing a Prestige
     * @type {function(void):void}
     * @public
     */
    public postPrestige: (arg0: void) => void;
    /**
     * Callback to know right before doing a Supremacy
     * @type {function(void):void}
     * @public
     */
    public preSupremacy: (arg0: void) => void;
    /**
     * Callback to know right after doing a Supremacy
     * @type {function(void):void}
     * @public
     */
    public postSupremacy: (arg0: void) => void;
    /**
     * Callback to know right before doing a Graduation
     * @type {function(void):void}
     * @public
     */
    public preGraduation: (arg0: void) => void;
    /**
     * Callback to know right after doing a Graduation
     * @type {function(void):void}
     * @public
     */
    public postGraduation: (arg0: void) => void;
    /**
     * Callback to know right before changing the active theory
     * @type {function(void):void}
     * @public
     */
    public activeTheoryChanging: (arg0: void) => void;
    /**
     * Callback to know right after changing the active theory
     * @type {function(void):void}
     * @public
     */
    public activeTheoryChanged: (arg0: void) => void;
    /**
     * @returns {BigNumber} f(t)
     */
    get f(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get t(): BigNumber;
    /**
     * The value of dt shown in the summary bar, i.e., including rewards and acceleration.
     * @returns {BigNumber}
     */
    get dt(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get acceleration(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get b(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get db(): BigNumber;
    /**
     * @returns {BigNumber}
     */
    get x(): BigNumber;
    /**
     * @param {number} index - Index of the x_i value. Starts at 0. For example, x is xi(0), x_1 is xi(1), etc.
     * @returns {BigNumber}
     */
    xi(index: number): BigNumber;
    /**
     * @returns {BigNumber} μ
     */
    get mu(): BigNumber;
    /**
     * @returns {BigNumber} dμ
     */
    get dmu(): BigNumber;
    /**
     * @returns {BigNumber} ψ
     */
    get psi(): BigNumber;
    /**
     * @returns {BigNumber} dψ
     */
    get dpsi(): BigNumber;
    /**
     * @returns {BigNumber} The unspent amount of stars
     */
    get stars(): BigNumber;
    /**
     * @returns {BigNumber} The total amount of stars
     */
    get starsTotal(): BigNumber;
    /**
     * @returns {BigNumber} φ
     */
    get phi(): BigNumber;
    /**
     * @returns {BigNumber} The combined tau (τ) values, as shown in the summary bar.
     */
    get tau(): BigNumber;
    /**
     * @returns {BigNumber} The unspent amount of students (σ)
     */
    get sigma(): BigNumber;
    /**
     * @returns {BigNumber} The total amount of students (σ)
     */
    get sigmaTotal(): BigNumber;
    /**
     * @returns {Variable[]} List of all variables
     */
    get variables(): Variable[];
    /**
     * @returns {Upgrade[]} List of all regular upgrades
     */
    get regularUpgrades(): Upgrade[];
    /**
     * @returns {Upgrade[]} List of all prestige upgrades
     */
    get prestigeUpgrades(): Upgrade[];
    /**
     * @returns {Upgrade[]} List of all supremacy upgrades
     */
    get supremacyUpgrades(): Upgrade[];
    /**
     * @returns {Upgrade[]} List of all star bonuses
     */
    get starBonuses(): Upgrade[];
    /**
     * @returns {Upgrade[]} List of all research upgrades
     */
    get researchUpgrades(): Upgrade[];
    /**
     * @returns {Theory[]} List of all theories
     */
    get theories(): Theory[];
    /**
     * @returns {Achievement[]} List of all achievements
     */
    get achievements(): Achievement[];
    /**
     * @returns {StoryChapter[]} List of all story chapters
     */
    get storyChapters(): StoryChapter[];
    // /**
    //  * @returns {Story} Story chapters
    //  */
    // get story(): Story;
    /**
     * @returns {Automation} Automation features
     */
    get automation(): Automation;
    /**
     * @returns {BuyAmounts} All buy amounts of the game
     */
    get buyAmounts(): BuyAmounts;
    /**
     * @returns {Statistics} Statistics of the game (Statistics popup)
     */
    get statistics(): Statistics;
    /**
     * @returns {Settings} Settings of the game (Settings popup)
     */
    get settings(): Settings;
    /**
     * @returns {boolean} Is there a reward (via ad or purchase) currently active?
     */
    get isRewardActive(): boolean;
    /**
     * @returns {boolean} Is the game currently in the offline progress screen?
     */
    get isCalculatingOfflineProgress(): boolean;
    /**
     * Performs a "Prestige"
     */
    prestige(): any;
    /**
     * Performs a "Supremacy"
     * Does nothing if f(t) < ee50
     */
    supremacy(): any;
    /**
     * Performs a "Graduation"
     * Does nothing if f(t) < ee2000 or if dσ = 0
     */
    graduate(): any;
    /**
     * Buy the specified amount of level of all provided upgrades following
     * the same buying pattern as the "Buy All" button. For example, if the amount
     * is set to 10 and it could afford 25, it will buy 20 (2x10).
     * Use -1 or 1 for maximum.
     * For more control, use the 'buy' method of each independent upgrade.
     * @param {Upgrade[]} upgrades - List of upgrades to buy
     * @param {number} [bulkAmount] - Will buy a multiple of this amount of each upgrade. Default: -1 (max)
     * @param {boolean} [ignoreToggle] - If true, buy all upgrades regardless of the checkbox. Default: false
     */
    buy(upgrades: Upgrade[], bulkAmount?: number, ignoreToggle?: boolean): any;
    /**
     * Refund the specified amount of level of all provided upgrades.
     * If the amount is greater that the current level, it will refund all levels.
     * Use -1 for maximum.
     * @param {Upgrade[]} upgrades - List of upgrades to refund
     * @param {number} amount - Amount to refund
     */
    refund(upgrades: Upgrade[], amount: number): any;
}
/**
 * Instance of the game.
 * @type {Game}
 */
export const game: Game;
import { Theory } from "./Theory";
import { BigNumber } from "./BigNumber";
import { Variable } from "./Upgrades";
import { Upgrade } from "./Upgrades";
import { Achievement } from "./Achievement";
import { StoryChapter } from "./StoryChapter";
import { Automation } from "./Automation";
import { BuyAmounts } from "./BuyAmounts";
import { Statistics } from "./Statistics";
import { Settings } from "./Settings";

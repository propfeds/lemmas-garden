/**
 * Properties of an in-game story chapter
 */
export class StoryChapter {
    /**
     * Can only be modified if you own the story chapter.
     * Will not trigger the chapter when set to 'true'.
     * Only the unlock condition can trigger the chapter.
     * @type {boolean}
     * @public
     */
    public isUnlocked: boolean;
    /**
     * @returns {number} Unique id
     */
    get id(): number;
    /**
     * @returns {String}
     */
    get title(): string;
    /**
     * @returns {String}
     */
    get text(): string;
}

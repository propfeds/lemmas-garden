/**
 * Holds a representation of a 3D vector.
 */
export class Vector3 {
    /** @constructor
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} z - Z coordinate
     */
    constructor(x: number, y: number, z: number);
    /**
     * @type {number} X coordinate
     * @public
     */
    public x: number;
    /**
     * @type {number} Y coordinate
     * @public
     */
    public y: number;
    /**
     * @type {number} Z coordinate
     * @public
     */
    public z: number;
    /**
     * @param {Vector3} value
     * @returns {Vector3} Component-wise minimum between 'this' and value
     */
    min(value: Vector3): Vector3;
    /**
     * @param {Vector3} value
     * @returns {Vector3} Component-wise maximum between 'this' and value
     */
    max(value: Vector3): Vector3;
    /**
     * @returns {number} Norm of the vector
     */
    get length(): number;
    /**
     * @returns {number} Minimum component of the vector
     */
    get minComponent(): number;
    /**
     * @returns {number} Maximum component of the vector
     */
    get maxComponent(): number;
}

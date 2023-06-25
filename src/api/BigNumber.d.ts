/**
 * Similar to parseFloat, decode a string into a BigNumber.
 * Accepted format are one of the following forms:
 *   123.456
 *   1.234e56
 *   1.234e-12
 *   e56
 *   ee123.456
 * Note: Number can be negative.
 * @param {String} value
 * @returns {BigNumber}
 */
export function parseBigNumber(value: string): BigNumber;
/**
 * Defines the accepted rounding rules for converting a BigNumber
 * to a string using the 'toString' method.
 */
export class Rounding {
    /** @returns {Rounding} */ static get UP(): Rounding;
    /** @returns {Rounding} */ static get DOWN(): Rounding;
    /** @returns {Rounding} */ static get NEAREST(): Rounding;
}
/**
 * Holds a representation of an arbitrarily large number.
 * The class also supports the mathematical operators:
 *    +, -, *, /, +=, -=, *=, /=, ==, !=
 */
export class BigNumber {
    /** @returns {BigNumber} */ static get ZERO(): BigNumber;
    /** @returns {BigNumber} */ static get ONE(): BigNumber;
    /** @returns {BigNumber} */ static get TWO(): BigNumber;
    /** @returns {BigNumber} */ static get THREE(): BigNumber;
    /** @returns {BigNumber} */ static get FOUR(): BigNumber;
    /** @returns {BigNumber} */ static get FIVE(): BigNumber;
    /** @returns {BigNumber} */ static get SIX(): BigNumber;
    /** @returns {BigNumber} */ static get SEVEN(): BigNumber;
    /** @returns {BigNumber} */ static get EIGHT(): BigNumber;
    /** @returns {BigNumber} */ static get NINE(): BigNumber;
    /** @returns {BigNumber} */ static get TEN(): BigNumber;
    /** @returns {BigNumber} */ static get HUNDRED(): BigNumber;
    /** @returns {BigNumber} */ static get THOUSAND(): BigNumber;
    /** @returns {BigNumber} */ static get E(): BigNumber;
    /** @returns {BigNumber} */ static get PI(): BigNumber;
    /**
     * Converts a native number or a string to a BigNumber
     * @param {number|string} value
     * @returns {BigNumber}
     */
    static from(value: number | string): BigNumber;
    /**
     * Tries to convert a string to a BigNumber.
     * Alternative: parseBigNumber(value).
     * @param {String} value
     * @param {BigNumber} out_result - This value will be overwritten
     * @returns {boolean} Success = true, Failure = false
     */
    static tryParse(value: string, out_result: BigNumber): boolean;
    /**
     * Deserialize a Base64 string to a BigNumber (exact representation)
     * @param {String} value
     * @returns {BigNumber}
     */
    static fromBase64String(value: string): BigNumber;
    /**
     * Creates a BigNumber based on the underlying representation.
     * A BigNumber is represented as the triplet (sign, depth, exponent):
     * sign*10^10^10^...10^(exponent + 6)
     *      |_____________|
     *           depth
     * If 'depth' is 0, then the number is sign*exponent.
     * @param {number} sign - Either 1, 0, or -1
     * @param {number} depth - Must be greater or equal to 0
     * @param {number} exponent - Must be in [0, 1e6)
     * @returns {BigNumber}
     */
    static fromComponents(sign: number, depth: number, exponent: number): BigNumber;
    /**
     * @returns {BigNumber} A copy of the instance
     */
    clone(): BigNumber;
    /**
     * @returns {number} -1, 0, or 1
     */
    get sign(): number;
    /**
     * @returns {boolean} Whether 'this' is equal (close?) to zero
     */
    get isZero(): boolean;
    /**
     * @param {BigNumber} value
     * @returns {BigNumber} this^value
     */
    pow(value: BigNumber): BigNumber;
    /**
     * @returns {BigNumber} Natural logarithm of 'this'
     */
    log(): BigNumber;
    /**
     * @returns {BigNumber} Base 2 logarithm of 'this'
     */
    log2(): BigNumber;
    /**
     * @returns {BigNumber} Base 10 logarithm of 'this'
     */
    log10(): BigNumber;
    /**
     * @returns {BigNumber} e^this
     */
    exp(): BigNumber;
    /**
     * @returns {BigNumber} 10^this
     */
    exp10(): BigNumber;
    /**
     * @returns {BigNumber} Square root of 'this'
     */
    sqrt(): BigNumber;
    /**
     * @returns {BigNumber} Squared value of 'this'
     */
    square(): BigNumber;
    /**
     * @param {BigNumber} value
     * @returns {BigNumber} Minimum between 'this' and value
     */
    min(value: BigNumber): BigNumber;
    /**
     * @param {BigNumber} value
     * @returns {BigNumber} Maximum between 'this' and value
     */
    max(value: BigNumber): BigNumber;
    /**
     * @returns {BigNumber} Absolute value of 'this'
     */
    abs(): BigNumber;
    /**
     * Note: This only applies to values less than 1e6.
     * @returns {BigNumber} Nearest integer
     */
    round(): BigNumber;
    /**
     * Note: This only applies to values less than 1e6
     * @returns {BigNumber} Greatest integer less than or equal to 'this'
     */
    floor(): BigNumber;
    /**
     * Note: This only applies to values less than 1e6
     * @returns {BigNumber} Least integer greater than or equal to 'this'
     */
    ceil(): BigNumber;
    /**
     * Note: Only applies to numbers in [-1.79e308, 1.79e308]. Returns 1 otherwise.
     * @returns {BigNumber} Cosine of the number.
     */
    cos(): BigNumber;
    /**
     * Note: Only applies to numbers in [-1.79e308, 1.79e308]. Returns 0 otherwise.
     * @returns {BigNumber} Sine of the number.
     */
    sin(): BigNumber;
    /**
     * Convert a BigNumber to a native JS number. If 'this' cannot be contained
     * in a native number, Number.POSITIVE_INFINITY or Number.NEGATIVE_INFINITY
     * is returned depending on the sign of the number.
     * @returns {number}
     */
    toNumber(): number;
    /**
     * Converts a BigNumber to a string.
     * @param {number} [decimals] - The maximum number of decimals when below 1e6.
     * @param {number} [maxDepth] - The maximum of 'e' to use, e.g., 1 means that it shows 1e1000000 instead of ee6.
     * @param {Rounding} [rounding] - The rounding rule for decimals at any scale.
     * @returns {String}
     */
    toString(decimals?: number, maxDepth?: number, rounding?: Rounding): string;
    /**
     * Serialize a BigNumber to a Base64 string (exact representation)
     * @returns {String}
     */
    toBase64String(): string;
    /**
     * Access to the underlying representation of a BigNumber.
     * A BigNumber is represented as the triplet (sign, depth, exponent):
     * sign*10^10^10^...10^(exponent + 6)
     *      |_____________|
     *           depth
     * If 'depth' is 0, then the number is sign*exponent.
     * 'sign' can be 1, 0, or -1.
     * 'depth' is greater or equal to 0
     * 'exponent' is in the range [0, 1e6)
     * @returns {number} The 'depth' component of the underlying representation.
     */
    get depth(): number;
    /**
     * Access to the underlying representation of a BigNumber.
     * A BigNumber is represented as the triplet (sign, depth, exponent):
     * sign*10^10^10^...10^(exponent + 6)
     *      |_____________|
     *           depth
     * If 'depth' is 0, then the number is sign*exponent.
     * 'sign' can be 1, 0, or -1.
     * 'depth' is greater or equal to 0
     * 'exponent' is in the range [0, 1e6)
     * @returns {number} The 'exponent' component of the underlying representation.
     */
    get exponent(): number;
}

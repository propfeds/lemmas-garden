import { BigNumber } from '../api/BigNumber';
import { ExponentialCost, FirstFreeCost, FreeCost } from '../api/Costs';
import { Localization } from '../api/Localization';
import { theory } from '../api/Theory';
import { Vector3 } from '../api/Vector3';

var id = 'lemmas_garden';
var getName = (language) =>
{
    let names =
    {
        en: 'Lemma\'s Garden',
    };

    return names[language] || names.en;
}
var getDescription = (language) =>
{
    let descs =
    {
        en:
`Last night, Lemma swept away remnants of her old garden.
Today, it will do weatherly.`,
    };

    return descs[language] || descs.en;
}
var authors = 'propfeds';
var version = 0;

let time = 0;
let plot = 0;
let plotManagers = [];
let normaliseQuaternions = false;
let maxCharsPerTick = 250;
let tmpCurrency;
let everybodyGangsta = true;

// Balance parameters

const plotCosts = new FirstFreeCost(new ExponentialCost(100, Math.log2(1000)));

const tax = .12;
const tauRateN = 10;   // e30 = 100 tau, e45 = end
const tauRateD = 3;

const pubExp = .03;
var getPublicationMultiplier = (tau) => tau.max(BigNumber.ONE).pow(pubExp *
tau.max(BigNumber.ONE).log().max(BigNumber.ONE).log());
var getPublicationMultiplierFormula = (symbol) =>
`\\begin{array}{c}{${symbol}}^{${pubExp} \\ln({\\ln{${symbol}})}}\\\\
(\\text{${getLoc('tax')}}\\colon\\enspace${tax}\\times\\max\\,\\text{p})
\\end{array}`;
// Need a better place to write this

const maxPlots = 6;

const TRIM_SP = /\s+/g;
const LS_RULE = /([^:]+)(:(.+))?=(.*)/;
// Context doesn't need to check for nested brackets!
const LS_CONTEXT =
/((.)(\(([^\)]+)\))?<)?((.)(\(([^\)]+)\))?)(>(.)(\(([^\)]+)\))?)?/;
const BACKTRACK_LIST = new Set('+-&^\\/|[$T');
// Leaves and apices
const SYNTHABLE_PARTS = new Set('LA');
const menuLang = Localization.language;
const locStrings =
{
    en:
    {
        versionName: 'alpha 0',

        plotTitle: `\\text{{Plot }}{{{0}}}`,
        unlockPlot: `\\text{{plot }}{{{0}}}`,
        unlockPlots: `\\text{{plots }}{{{0}}}~{{{1}}}`,
        tax: 'Publishing tax',
    }
};

/**
 * Returns a localised string.
 * @param {string} name the internal name of the string.
 * @returns {string} the string.
 */
let getLoc = (name, lang = menuLang) =>
{
    if(lang in locStrings && name in locStrings[lang])
        return locStrings[lang][name];

    if(name in locStrings.en)
        return locStrings.en[name];
    
    return `String missing: ${lang}.${name}`;
}

/* Image size reference
Size 20:
270x480

Size 24:
360x640
450x800
540x960

Size 36:
720x1280

Size 48:
1080x1920
*/
let getImageSize = (width) =>
{
    if(width >= 1080)
        return 48;
    if(width >= 720)
        return 36;
    if(width >= 360)
        return 24;

    return 20;
}

let getBtnSize = (width) =>
{
    if(width >= 1080)
        return 96;
    if(width >= 720)
        return 72;
    if(width >= 360)
        return 48;

    return 40;
}

let getMediumBtnSize = (width) =>
{
    if(width >= 1080)
        return 88;
    if(width >= 720)
        return 66;
    if(width >= 360)
        return 44;

    return 36;
}

let getSmallBtnSize = (width) =>
{
    if(width >= 1080)
        return 80;
    if(width >= 720)
        return 60;
    if(width >= 360)
        return 40;

    return 32;
}

/**
 * Represents an instance of the Xorshift RNG.
 */
class Xorshift
{
    /**
     * @constructor
     * @param {number} seed must be initialized to non-zero.
     */
    constructor(seed = 0)
    {
        this.x = seed;
        this.y = 0;
        this.z = 0;
        this.w = 0;
        for(let i = 0; i < 64; ++i)
            this.nextInt;
    }
    /**
     * Returns a random integer within [0, 2^31) probably.
     * @returns {number}
     */
    get nextInt()
    {
        let t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        this.w ^= (this.w >> 19) ^ t ^ (t >> 8);
        return this.w;
    }
    /**
     * Returns a random floating point number within [0, 1).
     * @returns {number}
     */
    get nextFloat()
    {
        return (this.nextInt >>> 0) / ((1 << 30) * 2);
    }
    /**
     * Returns a full random double floating point number using 2 rolls.
     * @returns {number}
     */
    get nextDouble()
    {
        let top, bottom, result;
        do
        {
            top = this.nextInt >>> 10;
            bottom = this.nextFloat;
            result = (top + bottom) / (1 << 21);
        }
        while(result === 0);
        return result;
    }
    /**
     * Returns a random integer within a range of [start, end).
     * @param {number} start the range's lower bound.
     * @param {number} end the range's upper bound, plus 1.
     * @returns {number}
     */
    nextRange(start, end)
    {
        // [start, end)
        let size = end - start;
        return start + Math.floor(this.nextFloat * size);
    }
    /**
     * Returns a random element from an array.
     * @param {any[]} array the array.
     * @returns {any}
     */
    choice(array)
    {
        return array[this.nextRange(0, array.length)];
    }
}

/**
 * Represents one hell of a quaternion.
 */
class Quaternion
{
    /**
     * @constructor
     * @param {number} r (default: 1) the real component.
     * @param {number} i (default: 0) the imaginary i component.
     * @param {number} j (default: 0) the imaginary j component.
     * @param {number} k (default: 0) the imaginary k component.
     */
    constructor(r = 1, i = 0, j = 0, k = 0)
    {
        /**
         * @type {number} the real component.
         */
        this.r = r;
        /**
         * @type {number} the imaginary i component.
         */
        this.i = i;
        /**
         * @type {number} the imaginary j component.
         */
        this.j = j;
        /**
         * @type {number} the imaginary k component.
         */
        this.k = k;
    }

    /**
     * Computes the sum of the current quaternion with another. Does not modify
     * the original quaternion.
     * @param {Quaternion} quat this other quaternion.
     * @returns {Quaternion}
     */
    add(quat)
    {
        return new Quaternion(
            this.r + quat.r,
            this.i + quat.i,
            this.j + quat.j,
            this.k + quat.k
        );
    }
    /**
     * Computes the product of the current quaternion with another. Does not
     * modify the original quaternion.
     * @param {Quaternion} quat this other quaternion.
     * @returns {Quaternion}
     */
    mul(quat)
    {
        let t0 = this.r * quat.r - this.i * quat.i -
        this.j * quat.j - this.k * quat.k;
        let t1 = this.r * quat.i + this.i * quat.r +
        this.j * quat.k - this.k * quat.j;
        let t2 = this.r * quat.j - this.i * quat.k +
        this.j * quat.r + this.k * quat.i;
        let t3 = this.r * quat.k + this.i * quat.j -
        this.j * quat.i + this.k * quat.r;

        let result = new Quaternion(t0, t1, t2, t3);
        if(normaliseQuaternions)
            return result.normalise;
        else
            return result;
    }
    /**
     * Rotates the quaternion by some degrees.
     * @param {number} degrees degrees.
     * @param {string} symbol the corresponding symbol in L-system language.
     */
    rotate(degrees = 0, symbol = '+')
    {
        if(degrees == 0)
            return this;

        let halfAngle = degrees * Math.PI / 360;
        let s = Math.sin(halfAngle);
        let c = Math.cos(halfAngle);
        let rotation;
        switch(symbol)
        {
            case '+':
                rotation = new Quaternion(-c, 0, 0, s);
                break;
            case '-':
                rotation = new Quaternion(-c, 0, 0, -s);
                break;
            case '&':
                rotation = new Quaternion(-c, 0, s, 0);
                break;
            case '^':
                rotation = new Quaternion(-c, 0, -s, 0);
                break;
            case '\\':
                rotation = new Quaternion(-c, s, 0, 0);
                break;
            case '/':
                rotation = new Quaternion(-c, -s, 0, 0);
                break;
            default:
                return this;
        }
        return rotation.mul(this);
    }
    /**
     * Computes the negation of a quaternion. The negation also acts as the
     * inverse if the quaternion's norm is 1, which is the case with rotation
     * quaternions.
     * @returns {Quaternion}
     */
    get neg()
    {
        return new Quaternion(this.r, -this.i, -this.j, -this.k);
    }
    /**
     * Computes the norm of a quaternion.
     * @returns {number}
     */
    get norm()
    {
        return Math.sqrt(this.r ** 2 + this.i ** 2 + this.j ** 2 + this.k ** 2);
    }
    /**
     * Normalises a quaternion.
     * @returns {Quaternion}
     */
    get normalise()
    {
        let n = this.norm;
        return new Quaternion(this.r / n, this.i / n, this.j / n, this.k / n);
    }
    /**
     * Returns a heading vector from the quaternion.
     * @returns {Vector3}
     */
    get headingVector()
    {
        let r = this.neg.mul(xUpQuat).mul(this);
        return new Vector3(r.i, r.j, r.k);
    }
    /**
     * Returns an up vector from the quaternion.
     * @returns {Vector3}
     */
    get upVector()
    {
        let r = this.neg.mul(yUpQuat).mul(this);
        return new Vector3(r.i, r.j, r.k);
    }
    /**
     * Returns a side vector (left or right?) from the quaternion.
     * @returns {Vector3}
     */
    get sideVector()
    {
        let r = this.neg.mul(zUpQuat).mul(this);
        return new Vector3(r.i, r.j, r.k);
    }
    /**
     * (Deprecated) Rotate from a heading vector to another. Inaccurate!
     * @param {Vector3} src the current heading.
     * @param {Vector3} dst the target heading.
     * @returns {Quaternion}
     */
    rotateFrom(src, dst)
    {
        let dp = src.x * dst.x + src.y * dst.y +
        src.z * dst.z;
        let rotAxis;
        if(dp < -1 + 1e-8)
        {
            /* Edge case
            If the two vectors are in opposite directions, just reverse.
            */
            return zUpQuat.mul(this);
        }
        rotAxis = new Vector3(
            src.y * dst.z - src.z * dst.y,
            src.z * dst.x - src.x * dst.z,
            src.x * dst.y - src.y * dst.x,
        );
        let s = Math.sqrt((1 + dp) * 2);
        // I forgore that our quaternions have to be all negative, dunnoe why
        return this.mul(new Quaternion(
            -s / 2,
            rotAxis.x / s,
            rotAxis.y / s,
            rotAxis.z / s
        ));
    }
    /**
     * https://stackoverflow.com/questions/71518531/how-do-i-convert-a-direction-vector-to-a-quaternion
     * (Deprecated) Applies a gravi-tropism vector to the quaternion.
     * @param {number} weight the vector's length (negative for upwards).
     * @returns {Quaternion}
     */
    applyTropismVector(weight = 0)
    {
        if(weight == 0)
            return this;

        let curHead = this.headingVector;
        let newHead = curHead - new Vector3(0, weight, 0);
        let n = newHead.length;
        if(n == 0)
            return this;
        newHead /= n;
        let result = this.rotateFrom(curHead, newHead);
        return result;
    }
    /**
     * Applies a gravi-tropism vector to the quaternion.
     * @param {number} weight the branch's susceptibility to bending.
     * @param {number} x the tropism vector's x component.
     * @param {number} y the tropism vector's y component.
     * @param {number} z the tropism vector's z component.
     * @returns {Quaternion}
     */
    applyTropism(weight = 0, x = 0, y = -1, z = 0)
    {
        if(weight == 0)
            return this;

        // a = e * |HxT| (n)
        let curHead = this.headingVector;
        let rotAxis = new Vector3(
            curHead.y * z - curHead.z * y,
            curHead.z * x - curHead.x * z,
            curHead.x * y - curHead.y * x,
        );
        let n = rotAxis.length;
        if(n == 0)
            return this;
        rotAxis /= n;
        let a = weight * n / 2;
        let s = Math.sin(a);
        let c = Math.cos(a);
        // I don't know why it works the opposite way this time
        return this.mul(new Quaternion(
            -c,
            rotAxis.x * s,
            rotAxis.y * s,
            rotAxis.z * s
        ));
    }
    /**
     * https://gamedev.stackexchange.com/questions/198977/how-to-solve-for-the-angle-of-a-axis-angle-rotation-that-gets-me-closest-to-a-sp/199027#199027
     * Rolls the quaternion so that its up vector aligns with the earth.
     * @returns {Quaternion}
     */
    alignToVertical()
    {
        // L = V×H / |V×H|
        let curHead = this.headingVector;
        let curUp = this.upVector;
        let side = new Vector3(curHead.z, 0, -curHead.x);
        let n = side.length;
        if(n == 0)
            return this;
        side /= n;
        // U = HxL
        let newUp = new Vector3(
            curHead.y * side.z - curHead.z * side.y,
            curHead.z * side.x - curHead.x * side.z,
            curHead.x * side.y - curHead.y * side.x,
        );
        let a = Math.atan2(
            curUp.x * side.x + curUp.y * side.y + curUp.z * side.z,
            curUp.x * newUp.x + curUp.y * newUp.y + newUp.z * newUp.z,
        ) / 2;
        let s = Math.sin(a);
        let c = Math.cos(a);
        return new Quaternion(-c, s, 0, 0).mul(this);
    }
    /**
     * Returns the quaternion's string representation.
     * @returns {string}
     */
    toString()
    {
        return `${getCoordString(this.r)} + ${getCoordString(this.i)}i + ${getCoordString(this.j)}j + ${getCoordString(this.k)}k`;
    }
}

/**
 * Represents a parametric L-system.
 */
class LSystem
{
    /**
     * @constructor
     * @param {string} axiom the starting sequence.
     * @param {string[]} rules the production rules.
     * @param {string} turnAngle the turning angle (in degrees).
     * @param {number} seed the seed used for stochastic systems.
     * @param {string} ignoreList a list of symbols to be ignored by the turtle.
     * @param {string} ctxIgnoreList a list of symbols ignored when deriving
     * context.
     * @param {string} tropism the tropism factor.
     * @param {object} variables globally defined variables for the system.
     */
    constructor(axiom = '', rules = [], turnAngle = 0, seed = 0,
    ignoreList = '', ctxIgnoreList = '', tropism = 0, variables = {})
    {
        // User input
        this.userInput =
        {
            axiom: axiom,
            rules: this.purgeEmpty(rules),
            turnAngle: turnAngle,
            seed: seed,
            ignoreList: ignoreList,
            ctxIgnoreList: ctxIgnoreList,
            tropism: tropism,
            variables: variables
        };
        // I want to transfer them to a map to deep copy them. LS menu uses
        // arrays so we're fine on that.
        this.variables = new Map();
        for(let key in variables)
            this.variables.set(key, MathExpression.parse(variables[key]).
            evaluate());

        let axiomMatches = this.parseSequence(axiom.replace(TRIM_SP, ''));
        this.axiom = axiomMatches.result;
        this.axiomParams = axiomMatches.params;

        // Manually calculate axiom parameters
        for(let i = 0; i < this.axiomParams.length; ++i)
        {
            if(!this.axiomParams[i])
                continue;

            let params = this.axiomParams[i].split(',');
            for(let j = 0; j < params.length; ++j)
                params[j] = MathExpression.parse(params[j]).evaluate(
                (v) => this.variables.get(v));
            this.axiomParams[i] = params;
            // Maybe leave them at BigNumber?
        }
        
        let ruleMatches = [];
        for(let i = 0; i < this.userInput.rules.length; ++i)
        {
            ruleMatches.push([...this.userInput.rules[i].replace(TRIM_SP, '').
            match(LS_RULE)]);
            // Indices 1, 3, 4 are context, condition, and all derivations
        }
        this.rules = new Map();
        this.models = new Map();
        for(let i = 0; i < ruleMatches.length; ++i)
        {
            // [i][1]: context
            let contextMatch = [...ruleMatches[i][1].match(LS_CONTEXT)];
            // Indices 2, 4, 6, 8, 10, 12 are the symbols and parameters of
            // left, middle, and right respectively
            if(!contextMatch[6])
                continue;

            let tmpRule = {};
            let ruleParams = {};
            if(contextMatch[8])
            {
                let params = contextMatch[8].split(',');
                for(let j = 0; j < params.length; ++j)
                    ruleParams[params[j]] = ['m', j];
            }
            tmpRule.left = contextMatch[2];
            if(tmpRule.left && contextMatch[4])
            {
                let params = contextMatch[4].split(',');
                for(let j = 0; j < params.length; ++j)
                    ruleParams[params[j]] = ['l', j];
            }
            tmpRule.right = contextMatch[10];
            if(tmpRule.right && contextMatch[12])
            {
                let params = contextMatch[12].split(',');
                for(let j = 0; j < params.length; ++j)
                {
                    ruleParams[params[j]] = ['r', j];
                }
            }
            tmpRule.params = ruleParams;
            /*  // O(1) lookup with O(n) memory, I think
            ruleParams = {
                'a': ['m', 0],
                'b': ['l', 0],
                'c': ['r', 0],
                'd': ['r', 1]
            };
            */
            tmpRule.paramMap = (v, l, m, r) =>
            {
                let pos = tmpRule.params[v][0];
                let result = null;
                switch(pos)
                {
                    case 'm':
                        if(m)
                        {
                            result = m[tmpRule.params[v][1]];
                            break;
                        }
                    case 'l':
                        if(l)
                        {
                            result = l[tmpRule.params[v][1]];
                            break;
                        }
                    case 'r':
                        if(r)
                        {
                            result = r[tmpRule.params[v][1]];
                            break;
                        }
                }
                // log(`${v} = ${result}`);
                return result;
                // MathExpression eval: (v) => rule.paramMap(v, params[l], ...)
            }

            // [i][3]: condition
            if(ruleMatches[i][3])
                tmpRule.condition = MathExpression.parse(ruleMatches[i][3]);
            else
                tmpRule.condition = MathExpression.parse('1');

            // [i][4]: everything else
            // Doing just comma instead of semi-colon will ruin the parameters!
            let tmpRuleMatches = ruleMatches[i][4].split(';');
            for(let j = 0; j < tmpRuleMatches.length; ++j)
            {
                if(typeof tmpRuleMatches[j] === 'undefined')
                    continue;

                tmpRuleMatches[j] = tmpRuleMatches[j].split(':');
                let tmpDeriv = this.parseSequence(tmpRuleMatches[j][0]);
                let derivParams = tmpDeriv.params;
                for(let k = 0; k < derivParams.length; ++k)
                {
                    if(!derivParams[k])
                        continue;

                    let params = derivParams[k].split(',');
                    for(let l = 0; l < params.length; ++l)
                        params[l] = MathExpression.parse(params[l]);

                    derivParams[k] = params;
                }
                if(typeof tmpRule.derivations === 'string')
                {
                    tmpRule.derivations = [tmpRule.derivations,
                    tmpDeriv.result];
                    tmpRule.parameters = [tmpRule.parameters, derivParams];
                    if(tmpRuleMatches[j][1])
                        tmpRule.chances = [tmpRule.chances,
                        MathExpression.parse(tmpRuleMatches[j][1])];
                    else
                        tmpRule.chances = [tmpRule.chances,
                        MathExpression.parse('1')];
                }
                else if(!tmpRule.derivations)
                {
                    tmpRule.derivations = tmpDeriv.result;
                    tmpRule.parameters = derivParams;
                    if(tmpRuleMatches[j][1])
                        tmpRule.chances = MathExpression.parse(
                        tmpRuleMatches[j][1]);
                    else
                        tmpRule.chances = MathExpression.parse('1');
                }
                else    // Already an array
                {
                    tmpRule.derivations.push(tmpDeriv.result);
                    tmpRule.parameters.push(derivParams);
                    if(tmpRuleMatches[j][1])
                        tmpRule.chances.push(MathExpression.parse(
                        tmpRuleMatches[j][1]));
                    else
                        tmpRule.chances.push(MathExpression.parse('1'));
                }
            }

            // Finally, push rule
            if(contextMatch[6] == '~')
            {
                if(!this.models.has(contextMatch[10]))
                    this.models.set(contextMatch[10], []);
                this.models.get(contextMatch[10]).push(tmpRule);
            }
            else
            {
                if(!this.rules.has(contextMatch[6]))
                    this.rules.set(contextMatch[6], []);
                this.rules.get(contextMatch[6]).push(tmpRule);
            }
        }

        this.ignoreList = new Set(ignoreList);
        this.ctxIgnoreList = new Set(ctxIgnoreList);

        this.RNG = new Xorshift(seed);
        this.halfAngle = MathExpression.parse(turnAngle.toString()).evaluate(
        (v) => this.variables.get(v)).
        toNumber() * Math.PI / 360;
        
        this.rotations = new Map();
        let s = Math.sin(this.halfAngle);
        let c = Math.cos(this.halfAngle);
        this.rotations.set('+', new Quaternion(-c, 0, 0, s));
        this.rotations.set('-', new Quaternion(-c, 0, 0, -s));
        this.rotations.set('&', new Quaternion(-c, 0, s, 0));
        this.rotations.set('^', new Quaternion(-c, 0, -s, 0));
        this.rotations.set('\\', new Quaternion(-c, s, 0, 0));
        this.rotations.set('/', new Quaternion(-c, -s, 0, 0));

        this.tropism = MathExpression.parse(tropism.toString()).evaluate(
        (v) => this.variables.get(v)).
        toNumber();
    }

    /**
     * Parse a sequence to return one array of characters and one of parameters.
     * Is only used when initialising the L-system.
     * @param {string} sequence the sequence to be parsed.
     * @returns {object}
     */
    parseSequence(sequence)
    {
        let result = '';
        let resultParams = [];
        let bracketLvl = 0;
        let start = null;
        for(let i = 0; i < sequence.length; ++i)
        {
            switch(sequence[i])
            {
                case ' ':
                    log('Blank space detected.')
                    break;
                case '(':
                    ++bracketLvl;
                    if(bracketLvl == 1)
                        start = i + 1;
                    break;
                case ')':
                    if(!bracketLvl)
                    {
                        log('You\'ve clearly made a bracket error.');
                        break;
                    }
                    --bracketLvl;
                    if(!bracketLvl)
                        resultParams.push(sequence.slice(start, i));
                    break;
                default:
                    if(bracketLvl)
                        break;
                    
                    result += sequence[i];
                    if(sequence[i + 1] != '(')
                        resultParams.push(null);
                    break;
            }
        }
        return {
            result: result,
            params: resultParams
        };
        // Tested this out on Chrome console, it worked.
    }
    /**
     * Returns and ancestree and a child tree for a sequence.
     * @param {string} sequence the sequence.
     * @returns {object}
     */
    getAncestree(sequence, task = {})
    {
        // Scanning behaviour should be very similar to renderer drawing.
        let tmpStack = task.stack || [];
        let tmpIdxStack = task.idxStack || [];
        let tmpAncestors = task.ancestors || [];
        let tmpChildren = task.children || [];
        let i = task.start || 0;
        for(; i < sequence.length; ++i)
        {
            if(i - task.start > maxCharsPerTick)
            {
                return {
                    start: i,
                    stack: tmpStack,
                    idxStack: tmpIdxStack,
                    ancestors: tmpAncestors,
                    children: tmpChildren
                };
            }
            switch(sequence[i])
            {
                case ' ':
                    log('Blank space detected.')
                    break;
                case '[':
                    tmpIdxStack.push(tmpStack.length);
                    break;
                case ']':
                    if(tmpStack.length == 0)
                    {
                        log('You\'ve clearly made a bracket error.');
                        break;
                    }
                    while(tmpStack.length > tmpIdxStack[tmpIdxStack.length - 1])
                        tmpStack.pop();

                    tmpIdxStack.pop();
                    break;
                default:
                    let ignored = this.ctxIgnoreList.has(sequence[i]);
                    if(ignored)
                        break;
                    
                    if(tmpStack.length > 0)
                    {
                        let ancIdx = tmpStack[tmpStack.length - 1];
                        tmpAncestors[i] = ancIdx;
                        if(typeof tmpChildren[ancIdx] === 'undefined')
                            tmpChildren[ancIdx] = [];
                        tmpChildren[ancIdx].push(i);
                    }

                    tmpStack.push(i);
                    break;
            }
        }
        return {
            start: 0,
            stack: tmpStack,
            idxStack: tmpIdxStack,
            ancestors: tmpAncestors,
            children: tmpChildren
        };
    }

    /**
     * Derive a sequence from the input string. `next` denotes the starting
     * position to be derived next tick. `result` contains the work completed
     * for the current tick.
     * @param {string} sequence the input string.
     * @returns {{start: number, result: string}}
     */
    derive(sequence, seqParams, ancestors, children, task = {})
    {
        let result = task.derivation || '';
        let resultParams = task.parameters || [];
        let i = task.start || 0;
        let charCount = 0;
        for(; i < sequence.length; ++i)
        {
            if(charCount > maxCharsPerTick)
            {
                return {
                    start: i,
                    charCount: charCount,
                    derivation: result,
                    parameters: resultParams
                };
            }
            if(sequence[i] == '%')
            {
                let branchLvl = 0;
                for(; i < sequence.length; ++i)
                {
                    switch(sequence[i])
                    {
                        case '[':
                            ++branchLvl;
                            break;
                        case ']':
                            --branchLvl;
                            break;
                    }
                    if(branchLvl < 0)
                        break;
                }
                if(sequence[i] == ']')
                {
                    result += sequence[i];
                    ++charCount;
                    resultParams.push(null);
                }
                else
                    continue;
            }
            else if(sequence[i] == '~')
                continue;
            else if(this.rules.has(sequence[i]))
            {
                let tmpRules = this.rules.get(sequence[i]);
                let ruleChoice = -1;
                for(let j = 0; j < tmpRules.length; ++j)
                {
                    // Left and right first
                    if(tmpRules[j].left && tmpRules[j].left !=
                    sequence[ancestors[i]])
                        continue;

                    let right = -1;
                    if(tmpRules[j].right)
                    {
                        if(children[i])
                        {
                            for(let k = 0; k < children[i].length; ++k)
                            {
                                if(tmpRules[j].right == sequence[children[i][
                                k]])
                                {
                                    right = children[i][k];
                                    break;
                                }
                            }
                        }
                        if(right == -1)
                            continue;
                    }

                    let tmpParamMap = (v) => this.variables.get(v) ||
                    tmpRules[j].paramMap(v, seqParams[ancestors[i]],
                    seqParams[i], seqParams[right]);
                    // Next up is the condition
                    if(tmpRules[j].condition.evaluate(tmpParamMap) ==
                    BigNumber.ZERO)
                        continue;

                    if(typeof tmpRules[j].derivations === 'string')
                    {
                        result += tmpRules[j].derivations;
                        charCount += tmpRules[j].derivations.length;
                        if(tmpRules[j].parameters)
                        {
                            for(let k = 0; k < tmpRules[j].parameters.length;
                            ++k)
                            {
                                let derivPi = null;
                                if(tmpRules[j].parameters[k])
                                {
                                    for(let l = 0; l < tmpRules[j].parameters[
                                    k].length; ++l)
                                    {
                                        if(tmpRules[j].parameters[k][l])
                                        {
                                            if(!derivPi)
                                                derivPi = [];
                                            derivPi.push(tmpRules[j].
                                            parameters[k][l].evaluate(
                                            tmpParamMap));
                                        }
                                    }
                                }
                                resultParams.push(derivPi);
                            }
                        }
                        ruleChoice = j;
                        break;
                    }
                    else    // Stochastic time
                    {
                        let roll = this.RNG.nextFloat;
                        let chanceSum = 0;
                        let choice = -1;
                        for(let k = 0; k < tmpRules[j].derivations.length; ++k)
                        {
                            // Example
                            // roll: 0.50
                            // chance 1: 0.00 - 0.49
                            // sum after 1: 0.50
                            // chance 2: 0.50 - 0.99
                            // sum after 2: 1 (select!)
                            chanceSum += tmpRules[j].chances[k].evaluate(
                            tmpParamMap);
                            if(chanceSum > roll)    // select this
                            {
                                choice = k;
                                result += tmpRules[j].derivations[k];
                                charCount += tmpRules[j].derivations[k].length;
                                if(tmpRules[j].parameters[k])
                                {
                                    for(let l = 0; l < tmpRules[j].
                                    parameters[k].length; ++l)
                                    {
                                        let derivPi = null;
                                        if(tmpRules[j].parameters[k][l])
                                        {
                                            for(let m = 0; m < tmpRules[j].
                                            parameters[k][l].length; ++m)
                                            {
                                                if(tmpRules[j].
                                                parameters[k][l][m])
                                                {
                                                    if(!derivPi)
                                                        derivPi = [];
                                                    derivPi.push(tmpRules[j].
                                                    parameters[k][l][m].
                                                    evaluate(tmpParamMap));
                                                }
                                            }
                                        }
                                        resultParams.push(derivPi);
                                    }
                                }
                                break;
                            }
                        }
                        // log(`roll = ${roll} choice = ${choice}`)
                        if(choice == -1)
                            continue;
                        ruleChoice = j;
                        break;
                    }
                }
                if(ruleChoice == -1)
                {
                    result += sequence[i];
                    ++charCount;
                    resultParams.push(...[seqParams[i]]);
                }
            }
            else
            {
                result += sequence[i];
                ++charCount;
                resultParams.push(...[seqParams[i]]);
            }
        }
        return {
            start: 0,
            charCount: charCount,
            derivation: result,
            parameters: resultParams
        };
    }

    deriveModel(symbol, params)
    {
        let result = '';
        let resultParams = [];
        if(this.models.has(symbol))
        {
            let tmpRules = this.models.get(symbol);
            for(let j = 0; j < tmpRules.length; ++j)
            {
                let tmpParamMap = (v) => this.variables.get(v) ||
                tmpRules[j].paramMap(v, null, null, params);
                // Next up is the condition
                if(tmpRules[j].condition.evaluate(tmpParamMap) ==
                BigNumber.ZERO)
                    continue;

                if(typeof tmpRules[j].derivations === 'string')
                {
                    result = tmpRules[j].derivations;
                    if(tmpRules[j].parameters)
                    {
                        for(let k = 0; k < tmpRules[j].parameters.length;
                        ++k)
                        {
                            let derivPi = null;
                            if(tmpRules[j].parameters[k])
                            {
                                for(let l = 0; l < tmpRules[j].parameters[k].
                                length; ++l)
                                {
                                    if(tmpRules[j].parameters[k][l])
                                    {
                                        if(!derivPi)
                                            derivPi = [];
                                        derivPi.push(tmpRules[j].parameters[k][
                                        l].evaluate(tmpParamMap));
                                    }
                                }
                            }
                            resultParams.push(derivPi);
                        }
                    }
                    break;
                }
                else    // Stochastic time
                {
                    // Models can be drawn any time, thus, the RNG should be
                    // separate from actual rule processing.
                    let roll = globalRNG.nextFloat;
                    let chanceSum = 0;
                    let choice = -1;
                    for(let k = 0; k < tmpRules[j].derivations.length; ++k)
                    {
                        // Example
                        // roll: 0.50
                        // chance 1: 0.00 - 0.49
                        // sum after 1: 0.50
                        // chance 2: 0.50 - 0.99
                        // sum after 2: 1 (select!)
                        chanceSum += tmpRules[j].chances[k].evaluate(
                        tmpParamMap);
                        if(chanceSum > roll)    // select this
                        {
                            choice = k;
                            result = tmpRules[j].derivations[k];
                            if(tmpRules[j].parameters[k])
                            {
                                for(let l = 0; l < tmpRules[j].
                                parameters[k].length; ++l)
                                {
                                    let derivPi = null;
                                    if(tmpRules[j].parameters[k][l])
                                    {
                                        for(let m = 0; m < tmpRules[j].
                                        parameters[k][l].length; ++m)
                                        {
                                            if(tmpRules[j].
                                            parameters[k][l][m])
                                            {
                                                if(!derivPi)
                                                    derivPi = [];
                                                derivPi.push(tmpRules[j].
                                                parameters[k][l][m].
                                                evaluate(tmpParamMap));
                                            }
                                        }
                                    }
                                    resultParams.push(derivPi);
                                }
                            }
                            break;
                        }
                    }
                    // log(`roll = ${roll} choice = ${choice}`)
                    if(choice == -1)
                        continue;
                    break;
                }
            }
        }
        return {
            result: result,
            params: resultParams
        };
    }

    reconstruct(sequence, params, task = {})
    {
        let result = task.result || '';
        let i = task.start || 0;
        for(; i < sequence.length; ++i)
        {
            if((i - task.start) * (task.start + 1) > maxCharsPerTick)
            {
                return {
                    start: i,
                    result: result
                }
            }
            result += sequence[i];
            if(params[i])
                result += `(${params[i].join(', ')})`;
        }
        return {
            start: 0,
            result: result
        };
    }
    /**
     * Purge the rules of empty lines.
     * @param {string[]} rules rules.
     * @returns {string[]}
     */
    purgeEmpty(rules)
    {
        let result = [];
        let idx = 0;
        for(let i = 0; i < rules.length; ++i)
        {
            // I hope this deep-copies
            if(rules[i])
            {
                result[idx] = rules[i];
                ++idx;
            }
        }
        return result;
    }
    /**
     * Returns a deep copy (hopefully) of the user input to prevent overwrites.
     * @returns {{
     *  axiom: string,
     *  rules: string[],
     *  turnAngle: string,
     *  seed: number,
     *  ignoreList: string,
     *  ctxIgnoreList: string,
     *  tropism: string,
     *  variables: object
     * }}
     */
    get object()
    {
        return {
            axiom: this.userInput.axiom,
            rules: this.purgeEmpty(this.userInput.rules),
            turnAngle: this.userInput.turnAngle,
            seed: this.userInput.seed,
            ignoreList: this.userInput.ignoreList,
            ctxIgnoreList: this.userInput.ctxIgnoreList,
            tropism: this.userInput.tropism,
            variables: this.userInput.variables
        };
    }
    /**
     * Returns the system's string representation.
     * @returns {string}
     */
    toString()
    {
        return JSON.stringify(this.object, null, 4);
    }
}

/**
 * Mini-renderer!
 */
class Renderer
{
    constructor(sequence, params, camera = {}, stroke = {})
    {
        this.figureScale = camera.scale || 1;
        this.cameraMode = camera.mode || 0;
        this.followFactor = camera.followFactor || 0.15;
        this.camCentre = new Vector3(camera.x || 0, camera.y || 0,
        camera.z || 0);
        this.upright = camera.upright || false;
        this.lastCamera = new Vector3(0, 0, 0);
        this.lastCamVel = new Vector3(0, 0, 0);

        this.tickLength = stroke.tickLength || 1;
        this.initDelay = stroke.initDelay || 0;
        // Loop mode is always 0
        // Whether to reset graph on hitting reset button is a game setting
        this.loadModels = stroke.loadModels || true;
        this.quickDraw = stroke.quickDraw || false;
        this.quickBacktrack = stroke.quickBacktrack || false;
        this.backtrackTail = stroke.backtrackTail || true;
        this.hesitateApex = stroke.hesitateApex || true;
        this.hesitateFork = stroke.hesitateFork || true;
        
        this.sequence = sequence;
        this.params = params;
        this.state = new Vector3(0, 0, 0);
        this.ori = this.upright ? uprightQuat : new Quaternion();
        this.stack = [];
        this.idxStack = [];
        this.models = [];
        this.modelParams = [];
        this.mdi = [];
        this.i = 0;
        this.elapsed = -this.initDelay;
        this.cooldown = 0;
        this.polygonMode = 0;
    }

    /**
     * Resets the renderer.
     * @param {boolean} clearGraph whether to clear the graph.
     */
    reset(clearGraph = true)
    {
        this.state = new Vector3(0, 0, 0);
        this.ori = this.upright ? uprightQuat : new Quaternion();
        this.stack = [];
        this.idxStack = [];
        this.i = 0;
        this.models = [];
        this.modelParams = [];
        this.mdi = [];
        this.cooldown = 0;
        this.polygonMode = 0;
        this.elapsed = -this.initDelay;
        if(clearGraph)
        {
            theory.clearGraph();
        }
    }
    configure(sequence, params, camera = {}, stroke = {})
    {
        this.figureScale = camera.scale || 1;
        this.cameraMode = camera.mode || 0;
        this.camCentre = new Vector3(camera.x || 0, camera.y || 0,
        camera.z || 0);
        this.upright = camera.upright || false;
        this.lastCamera = new Vector3(0, 0, 0);
        this.lastCamVel = new Vector3(0, 0, 0);

        this.tickLength = stroke.tickLength || 1;
        this.initDelay = stroke.initDelay || 0;
        // Loop mode is always 0
        // Whether to reset graph on hitting reset button is a game setting
        this.loadModels = stroke.loadModels || true;
        this.quickDraw = stroke.quickDraw || false;
        this.quickBacktrack = stroke.quickBacktrack || false;
        this.backtrackTail = stroke.backtrackTail || true;
        this.hesitateApex = stroke.hesitateApex || true;
        this.hesitateFork = stroke.hesitateFork || true;
        
        this.sequence = sequence;
        this.params = params;

        this.reset();
    }
    /**
     * Moves the cursor forward.
     */
    forward(distance = 1)
    {
        this.state += this.ori.headingVector * distance;
    }
    /**
     * Ticks the clock.
     */
    tick()
    {
        if(this.sequence.length)
            ++this.elapsed;
    }
    /**
     * Computes the next cursor position internally.
     */
    draw()
    {
        this.tick();
        if(this.elapsed % this.tickLength)  // Only update on multiples
            return;

        let j, t, moved;
        let loopLimit = 2;  // Shenanigans may arise with models? Try this
        for(j = 0; j < loopLimit; ++j)
        {
            if(this.cooldown > 0 && this.polygonMode <= 0)
            {
                --this.cooldown;
                return;
            }

            if(this.models.length > 0)
            {
                // Unreadable pile of shit
                for(; this.mdi[this.mdi.length - 1] <
                this.models[this.models.length - 1].length;
                ++this.mdi[this.mdi.length - 1])
                {
                    switch(this.models[this.models.length - 1][
                    this.mdi[this.mdi.length - 1]])
                    {
                        case ' ':
                            log('Blank space detected.')
                            break;
                        case '+':
                            if(this.modelParams[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[
                                this.models.length - 1][
                                this.mdi[this.mdi.length - 1]][0].toNumber(),
                                '+');
                            else
                                this.ori = this.system.rotations.get('+').mul(
                                this.ori);
                            break;
                        case '-':
                            if(this.modelParams[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[
                                this.models.length - 1][
                                this.mdi[this.mdi.length - 1]][0].toNumber(),
                                '-');
                            else
                                this.ori = this.system.rotations.get('-').mul(
                                this.ori);
                            break;
                        case '&':
                            if(this.modelParams[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[
                                this.models.length - 1][
                                this.mdi[this.mdi.length - 1]][0].toNumber(),
                                '&');
                            else
                                this.ori = this.system.rotations.get('&').mul(
                                this.ori);
                            break;
                        case '^':
                            if(this.modelParams[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[
                                this.models.length - 1][
                                this.mdi[this.mdi.length - 1]][0].toNumber(),
                                '^');
                            else
                                this.ori = this.system.rotations.get('^').mul(
                                this.ori);
                            break;
                        case '\\':
                            if(this.modelParams[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[
                                this.models.length - 1][
                                this.mdi[this.mdi.length - 1]][0].toNumber(),
                                '\\');
                            else
                                this.ori = this.system.rotations.get('\\').mul(
                                this.ori);
                            break;
                        case '/':
                            if(this.modelParams[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[
                                this.models.length - 1][
                                this.mdi[this.mdi.length - 1]][0].toNumber(),
                                '/');
                            else
                                this.ori = this.system.rotations.get('/').mul(
                                this.ori);
                            break;
                        case '|':
                            this.ori = zUpQuat.mul(this.ori);
                            break;
                        case '$':
                            this.ori = this.ori.alignToVertical();
                            break;
                        case 'T':
                            let args = this.modelParams[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]];
                            if(args)
                            {
                                if(args.length >= 4)
                                    this.ori = this.ori.applyTropism(
                                    args[0].toNumber(),
                                    args[1].toNumber(),
                                    args[2].toNumber(),
                                    args[3].toNumber());
                                else
                                    this.ori = this.ori.applyTropism(
                                    args[0].toNumber());
                            }
                            else
                                this.ori = this.ori.applyTropism(
                                this.system.tropism);
                            break;
                        case '~':
                            if(!this.system.models.has(
                            this.models[this.models.length - 1][
                            this.mdi[this.mdi.length - 1] + 1]))
                                break;

                            ++this.mdi[this.mdi.length - 1];
                            let model = this.system.deriveModel(this.models[
                            this.models.length - 1][
                            this.mdi[this.mdi.length - 1]], this.modelParams[
                            this.models.length - 1][
                            this.mdi[this.mdi.length - 1]]);

                            this.models.push(model.result);
                            this.modelParams.push(model.params);
                            this.mdi.push(0);
                            return;
                        case '[':
                            this.idxStack.push(this.stack.length);
                            this.stack.push([this.state, this.ori]);
                            break;
                        case ']':
                            if(this.cooldown > 0 && this.polygonMode <= 0)
                            {
                                --this.cooldown;
                                return;
                            }

                            if(this.stack.length == 0)
                            {
                                log('You\'ve clearly made a bracket error.');
                                break;
                            }

                            moved = this.state !==
                            this.stack[this.stack.length - 1][0];

                            t = this.stack.pop();
                            this.state = t[0];
                            this.ori = t[1];
                            if(this.stack.length ==
                            this.idxStack[this.idxStack.length - 1])
                            {
                                this.idxStack.pop();
                                if(moved)
                                    this.cooldown = 1;
                                if(this.hesitateFork && this.polygonMode <= 0)
                                {
                                    ++this.mdi[this.mdi.length - 1];
                                    return;
                                }
                                else
                                {
                                    break;
                                }
                            }
                            if(this.polygonMode <= 0)
                                return;
                            else
                            {
                                --this.mdi[this.mdi.length - 1];
                                break;
                            }
                        case '%':
                            // Nothing to do here
                            break;
                        case '{':        
                            ++this.polygonMode;
                            break;
                        case '}':
                            --this.polygonMode;
                            break;
                        case '.':
                            if(this.polygonMode <= 0)
                                log('You cannot register a vertex outside of ' +
                                'polygon drawing.');
                            else
                                ++this.mdi[this.mdi.length - 1];
                            return;
                        default:
                            if(this.cooldown > 0 && this.polygonMode <= 0)
                            {
                                --this.cooldown;
                                return;
                            }

                            let ignored = this.system.ignoreList.has(
                            this.models[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]]) ||
                            this.loadModels && this.system.models.has(
                            this.models[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]]);
                            let breakAhead = BACKTRACK_LIST.has(
                            this.models[this.models.length - 1][
                            this.mdi[this.mdi.length - 1] + 1]);
                            let btAhead = this.models[this.models.length - 1][
                            this.mdi[this.mdi.length - 1] + 1] == ']' ||
                            this.mdi[this.mdi.length - 1] ==
                            this.models[this.models.length - 1].length - 1;

                            if(this.hesitateApex && btAhead)
                                this.cooldown = 1;

                            if(this.quickDraw && breakAhead)
                                this.cooldown = 1;

                            moved = this.stack.length == 0 ||
                            (this.stack.length > 0 && this.state !==
                            this.stack[this.stack.length - 1][0]);

                            if(!this.quickBacktrack && moved && !ignored)
                                this.stack.push([this.state, this.ori]);

                            if(!ignored)
                            {
                                if(this.models[this.models.length - 1][
                                this.mdi[this.mdi.length - 1]] == 'F' &&
                                this.modelParams[this.models.length - 1][
                                this.mdi[this.mdi.length - 1]])
                                {
                                    this.forward(this.modelParams[
                                    this.models.length - 1][
                                    this.mdi[this.mdi.length - 1]][
                                    0].toNumber());
                                }
                                else
                                    this.forward();
                            }

                            if(this.quickBacktrack && breakAhead)
                                this.stack.push([this.state, this.ori]);
                            
                            if(this.quickDraw && !btAhead)
                                break;
                            else if(this.polygonMode <= 0  && !ignored)
                            {
                                ++this.mdi[this.mdi.length - 1];
                                return;
                            }
                            else
                                break;
                    }
                }
                this.models.pop();
                this.modelParams.pop();
                this.mdi.pop();
                ++loopLimit;
                // continue prevents the regular loop from running
                continue;
            }
            for(; this.i < this.sequence.length; ++this.i)
            {
                // if(this.models.length > 0)
                //     break;
                switch(this.sequence[this.i])
                {
                    case ' ':
                        log('Blank space detected.')
                        break;
                    case '+':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.levelParams[
                            this.i][0].toNumber(), '+');
                        else
                            this.ori = this.system.rotations.get('+').mul(
                            this.ori);
                        break;
                    case '-':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.levelParams[
                            this.i][0].toNumber(), '-');
                        else
                            this.ori = this.system.rotations.get('-').mul(
                            this.ori);
                        break;
                    case '&':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.levelParams[
                            this.i][0].toNumber(), '&');
                        else
                            this.ori = this.system.rotations.get('&').mul(
                            this.ori);
                        break;
                    case '^':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.levelParams[
                            this.i][0].toNumber(), '^');
                        else
                            this.ori = this.system.rotations.get('^').mul(
                            this.ori);
                        break;
                    case '\\':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.levelParams[
                            this.i][0].toNumber(), '\\');
                        else
                            this.ori = this.system.rotations.get('\\').mul(
                            this.ori);
                        break;
                    case '/':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.levelParams[
                            this.i][0].toNumber(), '/');
                        else
                            this.ori = this.system.rotations.get('/').mul(
                            this.ori);
                        break;
                    case '|':
                        this.ori = zUpQuat.mul(this.ori);
                        break;
                    case '$':
                        this.ori = this.ori.alignToVertical();
                        break;
                    case 'T':
                        let args = this.params[this.i];
                        if(args)
                        {
                            if(args.length >= 4)
                                this.ori = this.ori.applyTropism(
                                args[0].toNumber(),
                                args[1].toNumber(),
                                args[2].toNumber(),
                                args[3].toNumber());
                            else
                                this.ori = this.ori.applyTropism(
                                args[0].toNumber());
                        }
                        else
                            this.ori = this.ori.applyTropism(
                            this.system.tropism);
                        break;
                    case '~':
                        if(!this.loadModels || !this.system.models.has(
                        this.sequence[this.i + 1]))
                            break;

                        ++this.i;
                        let model = this.system.deriveModel(this.sequence[
                        this.i], this.params[this.i]);

                        this.models.push(model.result);
                        this.modelParams.push(model.params);
                        this.mdi.push(0);
                        return;
                    case '[':
                        this.idxStack.push(this.stack.length);
                        this.stack.push([this.state, this.ori]);
                        break;
                    case ']':
                        if(this.cooldown > 0 && this.polygonMode <= 0)
                        {
                            --this.cooldown;
                            return;
                        }

                        if(this.stack.length == 0)
                        {
                            log('You\'ve clearly made a bracket error.');
                            break;
                        }

                        moved = this.state !==
                        this.stack[this.stack.length - 1][0];

                        t = this.stack.pop();
                        this.state = t[0];
                        this.ori = t[1];
                        if(this.stack.length ==
                        this.idxStack[this.idxStack.length - 1])
                        {
                            this.idxStack.pop();
                            if(moved)
                                this.cooldown = 1;
                            if(this.hesitateFork && this.polygonMode <= 0)
                            {
                                ++this.i;
                                return;
                            }
                            else
                            {
                                break;
                            }
                        }
                        if(this.polygonMode <= 0)
                            return;
                        else
                        {
                            --this.i;
                            break;
                        }
                    case '%':
                        // Nothing to do here, all handled by LSystem derivation
                        break;
                    case '{':        
                        ++this.polygonMode;
                        break;
                    case '}':
                        --this.polygonMode;
                        break;
                    case '.':
                        if(this.polygonMode <= 0)
                            log('You cannot register a vertex outside of ' +
                            'polygon drawing.');
                        else
                            ++this.i;
                        return;
                    default:
                        if(this.cooldown > 0 && this.polygonMode <= 0)
                        {
                            --this.cooldown;
                            return;
                        }

                        let ignored = this.system.ignoreList.has(
                        this.sequence[this.i]) || this.loadModels &&
                        this.system.models.has(this.sequence[this.i]);
                        let breakAhead = BACKTRACK_LIST.has(
                        this.sequence[this.i + 1]);
                        let btAhead = this.sequence[this.i + 1] == ']' ||
                        this.i == this.sequence.length - 1;

                        if(this.hesitateApex && btAhead)
                            this.cooldown = 1;

                        if(this.quickDraw && breakAhead)
                            this.cooldown = 1;

                        moved = this.stack.length == 0 ||
                        (this.stack.length > 0 && this.state !==
                        this.stack[this.stack.length - 1][0]);

                        if(!this.quickBacktrack && moved && !ignored)
                            this.stack.push([this.state, this.ori]);

                        if(!ignored)
                        {
                            if(this.sequence[this.i] == 'F' &&
                            this.params[this.i])
                            {
                                this.forward(this.params[this.i][
                                0].toNumber());
                            }
                            else
                                this.forward();
                        }

                        if(this.quickBacktrack && breakAhead)
                            this.stack.push([this.state, this.ori]);
                        
                        if(this.quickDraw && !btAhead)
                            break;
                        else if(this.polygonMode <= 0 && !ignored)
                        {
                            ++i;
                            return;
                        }
                        else
                            break;
                }
            }
            // This is what the renderer will do at the end of a loop
            if(!this.backtrackTail || this.stack.length == 0)
                return;
            else
            {
                let t = this.stack.pop();
                this.state = t[0];
                this.ori = t[1];
                return;
            }
        }
    }
    /**
     * Return swizzled coordinates according to the in-game system. The game
     * uses Android UI coordinates, which is X-right Y-down Z-face.
     * @param {Vector3} coords the original coordinates.
     * @returns {Vector3}
     */
    swizzle(coords)
    {
        // The game uses left-handed Y-up, aka Y-down coordinates.
        return new Vector3(coords.x, -coords.y, coords.z);
    }
    /**
     * Returns the camera centre's coordinates.
     * @returns {Vector3}
     */
    get centre()
    {
        if(this.cameraMode)
            return -this.cursor;

        return this.swizzle(-this.camCentre / this.figureScale);
    }
    /**
     * Returns the turtle's coordinates.
     * @returns {Vector3}
     */
    get cursor()
    {
        let coords = this.state / this.figureScale;
        return this.swizzle(coords);
    }
    /**
     * Returns the camera's coordinates.
     * @returns {Vector3}
     */
    get camera()
    {
        let newCamera;
        switch(this.cameraMode)
        {
            case 1:
                // I accidentally discovered Bézier curves unknowingly.
                let dist = this.centre - this.lastCamera;
                newCamera = this.lastCamera + dist * this.followFactor ** 2 +
                this.lastCamVel * (1 - this.followFactor) ** 2;
                this.lastCamVel = newCamera - this.lastCamera;
                this.lastCamera = newCamera;
                return newCamera;
            case 0:
                return this.centre;
        }
    }
}

class Colony
{
    constructor(population, system, growthRate, growthCost, actions = [], camera = {},
    stroke = {})
    {
        this.system = system;
        this.sequence = system.axiom;
        this.params = system.axiomParams;
        this.stage = 0;
        this.population = population;

        this.energy = BigNumber.ZERO;
        this.growth = BigNumber.ZERO;
        this.growthRate = growthRate;
        this.growthCost = growthCost;
        this.actions = actions;
        let stats = this.calculateStats(actions[0].symbols);
        this.synthRate = stats.synthRate;
        this.profit = stats.profit;

        this.camera = camera;
        this.stroke = stroke;
    }
    calculateStats(harvestable = new Set())
    {
        // Mockup
        // TODO: Integrate tasks like ancestree and derive
        let synthRate = BigNumber.ZERO;
        let profit = BigNumber.ZERO;
        for(let i = 0; i < this.sequence.length; ++i)
        {
            if(SYNTHABLE_PARTS.has(this.sequence[i]) && this.params[i])
                synthRate += this.params[i][0];
            if(harvestable.has(this.sequence[i]) && this.params[i])
                profit += this.params[i][0];
        }
        return {
            synthRate: synthRate,
            profit: profit
        }
    }
    grow(dt, synth = true)
    {
        if(synth)
            this.energy += dt * this.synthRate * this.population;
        
        let dg = this.energy.min(dt * this.growthRate * this.population);
        this.growth += dg;
        this.energy -= dg;

        if((everybodyGangsta && this.growth >= this.growthCost *
        this.sequence.length * this.population) || this.ancestreeTask.start ||
        this.deriveTask.start || this.calcTask.start)
        {
            everybodyGangsta = false;
            this.derive();
        }
    }
    derive()
    {
        // Ancestree, derive and calc stats
        everybodyGangsta = true;
        theory.invalidateSecondaryEquation();
        theory.invalidateQuaternaryValues();
    }
}


// const sidewayQuat = new Quaternion(1, 0, 0, 0);
const uprightQuat = new Quaternion(-Math.sqrt(2)/2, 0, 0, Math.sqrt(2)/2);
const xUpQuat = new Quaternion(0, 1, 0, 0);
const yUpQuat = new Quaternion(0, 0, 1, 0);
const zUpQuat = new Quaternion(0, 0, 0, 1);

let renderer = new Renderer('', []);
let globalRNG = new Xorshift(Date.now());

var plotPerma;

var currency;

var init = () =>
{
    currency = theory.createCurrency('p');

    {
        let free_penny = theory.createUpgrade(0, currency, new FreeCost);
        free_penny.description = 'Get 1 penny for free';
        free_penny.info = 'Yields 1 penny';
        free_penny.bought = (_) => currency.value += BigNumber.ONE;
    }
    /* Plot unlock
    Before you can plant any plants, you have to switch tab and unlock plot 0.
    */
    {
        plotPerma = theory.createPermanentUpgrade(0, currency, plotCosts);
        plotPerma.getDescription = (amount) =>
        {
            if(amount == 1)
                return Localization.getUpgradeUnlockDesc(Localization.format(
                getLoc('unlockPlot'), plotPerma.level + amount));
            return Localization.getUpgradeUnlockDesc(Localization.format(
            getLoc('unlockPlots'), plotPerma.level + 1,
            plotPerma.level + amount));
        }
        plotPerma.getInfo = (amount) =>
        {
            if(amount == 1)
                return Localization.getUpgradeUnlockInfo(Localization.format(
                getLoc('unlockPlot'), plotPerma.level + amount));
            return Localization.getUpgradeUnlockInfo(Localization.format(
            getLoc('unlockPlots'), plotPerma.level + 1,
            plotPerma.level + amount));
        }
        plotPerma.bought = (_) => {
            theory.invalidatePrimaryEquation();
            updateAvailability()
        };
        plotPerma.maxLevel = maxPlots;
    }
    theory.createPublicationUpgrade(1, currency, 1);
    theory.createBuyAllUpgrade(2, currency, 1);
    theory.createAutoBuyerUpgrade(3, currency, 1);
    // To do: challenge plot (-1)
    // Next: plant unlocks and milestones

    theory.primaryEquationScale = 0.9;
    theory.secondaryEquationHeight = 330;

    updateAvailability();
}

var updateAvailability = () =>
{
    return;
}

var tick = (elapsedTime, multiplier) =>
{
    time += elapsedTime * multiplier;
    theory.invalidateTertiaryEquation();
}

var getPrimaryEquation = () =>
{
    if(!plotPerma.level)
        return '';
    return Localization.format(getLoc('plotTitle'), plot + 1);
}

// secondary

var getTertiaryEquation = () =>
{
    let nofDays = Math.floor(time / 144);
    let timeofDay = time % 144;
    let hour = Math.floor(timeofDay / 6);

    return `\\text{Day }${nofDays + 1},\\enspace${hour}\\text{ o' clock}`;
}

// quaternary

var getTau = () => currency.value.max(BigNumber.ZERO).pow(tauRateN / tauRateD);
var getCurrencyFromTau = (tau) =>
[
    tau.max(BigNumber.ONE).pow(tauRateD / tauRateN),
    currency.symbol
];

var prePublish = () =>
{
    tmpCurrency = currency.value;
}

// You can be in debt for this lol
var postPublish = () =>
{
    currency.value = tmpCurrency - getCurrencyFromTau(theory.tau)[0] * tax;
}

var canResetStage = () => true;

var getResetStageMessage = () => getLoc('resetRenderer');

var resetStage = () => renderer.reset();

var canGoToPreviousStage = () => plotPerma.level > 0 && plot > 0;

var goToPreviousStage = () =>
{
    --plot;
    renderer.reset();
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
};
var canGoToNextStage = () => plot < plotPerma.level - 1;
var goToNextStage = () =>
{
    ++plot;
    renderer.reset();
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
};

var getInternalState = () => JSON.stringify
({
    version: version,
    time: time,
})

var setInternalState = (stateStr) =>
{
    if(!stateStr)
        return;

    let state = JSON.parse(stateStr);

    if('time' in state)
    {
        time = state.time;
    }
    theory.invalidateTertiaryEquation();
}

var get3DGraphPoint = () => renderer.cursor;

var get3DGraphTranslation = () => renderer.camera;

init();

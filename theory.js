import { BigNumber } from '../api/BigNumber';
import { CompositeCost, ConstantCost, ExponentialCost, FirstFreeCost, FreeCost } from '../api/Costs';
import { Localization } from '../api/Localization';
import { QuaternaryEntry, theory } from '../api/Theory';
import { ImageSource } from '../api/ui/properties/ImageSource';
import { LayoutOptions } from '../api/ui/properties/LayoutOptions';
import { TextAlignment } from '../api/ui/properties/TextAlignment';
import { Thickness } from '../api/ui/properties/Thickness';
import { Vector3 } from '../api/Vector3';
import { FreeCost } from '../api/Costs';
import { theory } from '../api/Theory';
import { Utils } from '../api/Utils';
import { Vector3 } from '../api/Vector3';
import { ui } from '../api/ui/UI';
import { Color } from '../api/ui/properties/Color';
import { FontFamily } from '../api/ui/properties/FontFamily';
import { Keyboard } from '../api/ui/properties/Keyboard';
import { LayoutOptions } from '../api/ui/properties/LayoutOptions';
import { TextAlignment } from '../api/ui/properties/TextAlignment';
import { Thickness } from '../api/ui/properties/Thickness';
import { TouchType } from '../api/ui/properties/TouchType';
import { Localization } from '../api/Localization';
import { MathExpression } from '../api/MathExpression';
import { ClearButtonVisibility } from '../api/ui/properties/ClearButtonVisibility';
import { LineBreakMode } from '../api/ui/properties/LineBreakMode';
import { BigNumber } from '../api/BigNumber';
import { Upgrade } from '../api/Upgrades';
import { Button } from '../api/ui/Button';
import { Frame } from '../api/ui/Frame';

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
var authors = 'propfeds\n\nThanks to:\ngame-icons.net, for the icons';
var version = 0;

const maxPlots = 6;

let time = 0;
let days = 0;
let insolationIntegral = 0;
let growthIntegral = 0;
let plotIdx = 0;
let colonyIdx = new Array(maxPlots).fill(0);
let plantIdx = new Array(maxPlots).fill(0);
let finishedTutorial = false;
let actuallyPlanting = true;
let graphMode = 0;
let colonyMode = 0;
let textColor = 'ffccff';

let tmpCurrency;
let tmpLevels;

// Other constants

const eq1Colour = new Map();
eq1Colour.set(Theme.STANDARD, 'ffffff');
eq1Colour.set(Theme.DARK, 'ffffff');
eq1Colour.set(Theme.LIGHT, '000000');

const eq2Colour = new Map();
eq2Colour.set(Theme.STANDARD, 'c0c0c0');
eq2Colour.set(Theme.DARK, 'b5b5b5');
eq2Colour.set(Theme.LIGHT, '434343');

const TRIM_SP = /\s+/g;
const LS_RULE = /([^:]+)(:(.+))?=(.*)/;
// Context doesn't need to check for nested brackets!
const LS_CONTEXT =
/((.)(\(([^\)]+)\))?<)?((.)(\(([^\)]+)\))?)(>(.)(\(([^\)]+)\))?)?/;
const BACKTRACK_LIST = new Set('+-&^\\/|[$T');
// Leaves and apices
const SYNTHABLE_SYMBOLS = new Set('LaA');
const MAX_CHARS_PER_TICK = 200;
const NORMALISE_QUATERNIONS = false;
const MENU_LANG = Localization.language;
const locStrings =
{
    en:
    {
        versionName: 'v0.0, Axiom',

        pubTax: 'Publishing tax',

        btnView: 'View L-system',
        btnVar: 'Variables',
        btnClose: 'Close',
        btnSave: 'Save',

        labelActions: 'Actions: ',
        btnHarvest: 'Harvest',
        btnHarvestKill: 'Harvest\\\\(kill)',
        btnPrune: 'Prune',
        btnPruneKill: 'Prune\\\\(kill)',
        labelSettings: 'Settings: ',

        labelAxiom: 'Axiom: ',
        labelAngle: 'Turning angle (°): ',
        labelRules: 'Production rules: {0}',
        labelIgnored: 'Turtle-ignored: ',
        labelCtxIgnored: 'Context-ignored: ',
        labelTropism: 'Tropism (gravity): ',
        labelSeed: 'Random seed: ',
        menuVariables: 'Defined Variables',
        labelVars: 'Variables: {0}',

        plotTitle: `\\text{{Plot }}{{{0}}}`,
        unlockPlot: `\\text{{plot }}{{{0}}}`,
        unlockPlots: `\\text{{plots }}{{{0}}}~{{{1}}}`,

        colony: '{0} of {1}, stage {2}',
        colonyProg: '{0} of {1}, stg. {2} ({3}\\%)',
        dateTime: 'Year {0} day {1}\\\\{2}:{3}',
        dateTimeTax: 'Y{0}/{1}, {2}:{3}\\\\Tax: {4}p',
        dateTimeL: `\\text{{Year }}{0}\\text{{ day }}{1},\\enspace{2}
        \\colon{3}`,
        dateTimeTaxL: `\\text{{Y}}{0}\\text{{ d}}{1},\\enspace{2}
        \\colon{3}\\, - \\,\\text{{Tax\\colon}}\\enspace{4}\\text{{p}}`,

        switchPlant: 'Switch plant (plot {0})',
        switchPlantInfo: 'Cycles through the list of plants',
        plotPlant: 'Plot {0}: {1}',
        viewColony: 'View colony',
        viewColonyInfo: 'Displays details about the colony',
        switchColony: 'Switch colony',
        switchColonyInfo: 'Cycles through the list of colonies',

        menuTheory: 'Theory Settings',
        graphModes:
        [
            'Graph mode: L-system',
            'Graph mode: Photo-synthesis',
            'Graph mode: Growth'
        ],
        colonyModes:
        [
            'Colony view: Commentary',
            'Colony view: Statistics',
            'Colony view: List',
            'Colony view: Off'
        ],

        plants:
        [
            {
                name: 'Basil',
                info: 'A fast growing herb, regularly used for spicing.',
                details: `Basil is the friend of all dogs.\\\\`,
                LsDetails: `The symbol A represents a rising shoot (apex), ` +
`while F represents the stem body.\\\\The Prune (scissors) action cuts every ` +
`F.\\\\The Harvest (bundle) action returns profit based on the sum of A, and ` +
`kills the colony.`,
                cost: '2p ** (level - 2) (first seed is free)',
                stages:
                {
                    0: 'The first shoot rises. Harvestable.',
                    1: 'The shoot splits in three.\\\\The stem lengthens.',
                    2: 'The shoots continue to divide.',
                    4: 'What do you expect? It\'s a fractal.'
                }
            },
            {
                name: 'Arrow weed',
                info: 'Testing my arrow weeds',
                details: `Arrow weed is the friend of all dogs.\\\\`,
                LsDetails: `The symbol A represents a rising shoot (apex), ` +
`while F represents the stem body.\\\\The Prune (scissors) action cuts every ` +
`F.\\\\The Harvest (bundle) action returns profit based on the sum of A, and ` +
`kills the colony.`,
                cost: '2p ** (level - 2) (first seed is free)',
                stages:
                {
                    0: 'The first shoot rises. Harvestable.',
                    1: 'The shoot splits in three.\\\\The stem lengthens.',
                    2: 'The shoots continue to divide.',
                    3: 'The shoots continue to divide.',
                    4: 'What do you expect? It\'s a fractal.'
                }
            }
        ],
        plantStats: `Cost: {0}\\\\Growth rate: {1} (at night)\\\\Growth ` +
`cost: {2} * length\\\\Length: {3}`,

        resetRenderer: 'You are about to reset the renderer.'
    }
};

/**
 * Returns a localised string.
 * @param {string} name the internal name of the string.
 * @returns {string} the string.
 */
let getLoc = (name, lang = MENU_LANG) =>
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
 * What else do you expect?
 */
class Queue
{
    constructor(object = {})
    {
        this.oldestIndex = object.oldestIndex || 0;
        this.newestIndex = object.newestIndex || 0;
        this.storage = object.storage || {};
    }

    get length()
    {
        let result = this.newestIndex - this.oldestIndex;
        if(!result)
        {
            this.oldestIndex = 0;
            this.newestIndex = 0;
        }
        return result;
    };

    get object()
    {
        return {
            oldestIndex: this.oldestIndex,
            newestIndex: this.newestIndex,
            storage: this.storage
        };
    }

    enqueue(data)
    {
        this.storage[this.newestIndex] = data;
        this.newestIndex++;
    };

    dequeue()
    {
        var oldestIndex = this.oldestIndex,
            newestIndex = this.newestIndex,
            deletedData;

        if (oldestIndex !== newestIndex)
        {
            deletedData = this.storage[oldestIndex];
            delete this.storage[oldestIndex];
            this.oldestIndex++;

            return deletedData;
        }
    }
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
        if(NORMALISE_QUATERNIONS)
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

            let params = this.parseParams(this.axiomParams[i]);
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

                    let params = this.parseParams(derivParams[k]);
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
     * Parse a string to return one array of parameter strings.
     * Replaces split(',').
     * @param {string} string the string to be parsed.
     * @returns {string[]}
     */
    parseParams(string)
    {
        let result = [];
        let bracketLvl = 0;
        let start = 0;
        for(let i = 0; i < string.length; ++i)
        {
            switch(string[i])
            {
                case ' ':
                    log('Blank space detected.')
                    break;
                case '(':
                    ++bracketLvl;
                    break;
                case ')':
                    if(!bracketLvl)
                    {
                        log('You\'ve clearly made a bracket error.');
                        break;
                    }
                    --bracketLvl;
                    break;
                case ',':
                    if(!bracketLvl)
                    {
                        result.push(string.slice(start, i));
                        start = i + 1;
                    }
                    break;
                default:
                    break;
            }
        }
        result.push(string.slice(start, string.length));
        return result;
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
            if(i - task.start > MAX_CHARS_PER_TICK)
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
            if(charCount > MAX_CHARS_PER_TICK)
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
            if((i - task.start) * (task.start + 1) > MAX_CHARS_PER_TICK)
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
    constructor(system, sequence, params, camera = {}, stroke = {})
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

        this.system = system;
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
        this.cooldown = 1;
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
        this.cooldown = 1;
        this.polygonMode = 0;
        this.elapsed = -this.initDelay;
        if(clearGraph)
        {
            theory.clearGraph();
        }
    }
    /**
     * Configures the colony.
     * @param {object} colony hmm.
     */
    set colony(colony)
    {
        this.system = PLANT_DATA[colony.id].system;
        this.configure(colony.sequence, colony.params,
        PLANT_DATA[colony.id].camera(colony.stage),
        PLANT_DATA[colony.id].stroke(colony.stage));
    }
    configure(sequence, params, camera = {}, stroke = {})
    {
        this.figureScale = camera.scale || 1;
        this.cameraMode = camera.mode || 0;
        this.followFactor = camera.followFactor || 0.15;
        this.camCentre = new Vector3(camera.x || 0, camera.y || 0,
        camera.z || 0);
        this.upright = camera.upright || false;

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
                            break;
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

                            if(this.loadModels && this.system.models.has(
                            this.models[this.models.length - 1][
                            this.mdi[this.mdi.length - 1]]))
                            {
                                let model = this.system.deriveModel(this.models[
                                this.models.length - 1][
                                this.mdi[this.mdi.length - 1]],
                                this.modelParams[this.models.length - 1][
                                this.mdi[this.mdi.length - 1]]);

                                this.models.push(model.result);
                                this.modelParams.push(model.params);
                                this.mdi.push(0);
                                ++this.mdi[this.mdi.length - 2];
                                return;
                            }

                            let ignored = this.system.ignoreList.has(
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
                            this.ori = this.ori.rotate(this.params[
                            this.i][0].toNumber(), '+');
                        else
                            this.ori = this.system.rotations.get('+').mul(
                            this.ori);
                        break;
                    case '-':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.params[
                            this.i][0].toNumber(), '-');
                        else
                            this.ori = this.system.rotations.get('-').mul(
                            this.ori);
                        break;
                    case '&':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.params[
                            this.i][0].toNumber(), '&');
                        else
                            this.ori = this.system.rotations.get('&').mul(
                            this.ori);
                        break;
                    case '^':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.params[
                            this.i][0].toNumber(), '^');
                        else
                            this.ori = this.system.rotations.get('^').mul(
                            this.ori);
                        break;
                    case '\\':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.params[
                            this.i][0].toNumber(), '\\');
                        else
                            this.ori = this.system.rotations.get('\\').mul(
                            this.ori);
                        break;
                    case '/':
                        if(this.params[this.i])
                            this.ori = this.ori.rotate(this.params[
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
                        break;
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

                        if(this.loadModels && this.system.models.has(
                        this.sequence[this.i]))
                        {
                            let model = this.system.deriveModel(this.sequence[
                            this.i], this.params[this.i]);
    
                            this.models.push(model.result);
                            this.modelParams.push(model.params);
                            this.mdi.push(0);
                            ++this.i;
                            return;
                        }
                        let ignored = this.system.ignoreList.has(
                        this.sequence[this.i]);
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
                            ++this.i;
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

/**
 * This is not ECS, I'm not good enough to understand ECS.
*/
class ColonyManager
{
    constructor(object = {})
    {
        // 6*inf
        this.colonies = object.colonies ||
        Array.from({length: maxPlots}, (_) => []);

        // Everyone gangsta until a colony starts evolving
        this.gangsta = object.gangsta;
        this.ancestreeTask = object.ancestreeTask ||
        {
            start: 0
        };
        this.deriveTask = object.deriveTask ||
        {
            start: 0
        };
        this.calcTask = object.calcTask ||
        {
            start: 0
        };
        // Processed before regular gangsta
        this.actionQueue = new Queue(object.actionQueue);
        this.actionGangsta = object.actionGangsta;
        this.actionDeriveTask = object.actionDeriveTask ||
        {
            start: 0
        };
        this.actionCalcTask = object.actionCalcTask ||
        {
            start: 0
        };
    }

    get object()
    {
        return {
            colonies: this.colonies,
            gangsta: this.gangsta,
            ancestreeTask: this.ancestreeTask,
            deriveTask: this.deriveTask,
            calcTask: this.calcTask,
            actionQueue: this.actionQueue.object,
            actionGangsta: this.actionGangsta,
            actionDeriveTask: this.actionDeriveTask,
            actionCalcTask: this.actionCalcTask,
        };
    }

    addColony(plot, id, population)
    {
        for(let i = 0; i < this.colonies[plot].length; ++i)
        {
            if(this.colonies[plot][i].id == id && !this.colonies[plot][i].stage)
            {
                this.colonies[plot][i].population += population;
                theory.invalidateQuaternaryValues();
                return;
            }
        }
        let c =
        {
            id: id,
            population: population,
            sequence: PLANT_DATA[id].system.axiom,
            params: PLANT_DATA[id].system.axiomParams,
            stage: 0,

            energy: BigNumber.ZERO,
            growth: BigNumber.ZERO
        };
        let stats = this.calculateStats(c);
        c.synthRate = stats.synthRate;
        c.profit = stats.profit;
        this.colonies[plot].push(c);
        if(plot == plotIdx && colonyIdx[plot] == this.colonies[plot].length - 1)
            renderer.colony = c;
        theory.invalidateQuaternaryValues();
        updateAvailability();
    }
    killColony(plot, index)
    {
        let c = this.colonies[plot][index];
        if(!c)
            return;
        plants[plot][c.id].level -= Math.min(plants[plot][c.id].level,
        c.population);
        if(index == this.colonies[plot].length - 1)
            switchColony.buy(1);
        if(this.gangsta && plot == gangsta[0])
            this.gangsta = null;
        this.colonies[plot].splice(index, 1);
        updateAvailability();
    }
    growAll(di, dg)
    {
        if(this.actionGangsta)
            this.continueAction();
        else if(this.actionQueue.length)
            this.performAction(...this.actionQueue.dequeue());
        else if(this.gangsta)
            this.evolve();

        for(let i = 0; i < this.colonies.length; ++i)
        {
            for(let j = 0; j < this.colonies[i].length; ++j)
            {
                let c = this.colonies[i][j];
                c.energy += di * c.synthRate;

                let maxdg = c.energy.min(dg * PLANT_DATA[c.id].growthRate);
                c.growth += maxdg;
                c.energy -= maxdg;

                if(!this.gangsta && c.growth >= PLANT_DATA[c.id].growthCost *
                BigNumber.from(c.sequence.length))
                {
                    this.gangsta = [i, j];
                }
            }
        }
    }
    calculateStats(colony, task = {}, dTask = {})
    {
        // This is the only case where the colony needed
        let harvestable = PLANT_DATA[colony.id].actions[0].symbols;
        let synthRate = task.synthRate || BigNumber.ZERO;
        let profit = task.profit || BigNumber.ZERO;
        let sequence = dTask.derivation || colony.sequence;
        let params = dTask.parameters || colony.params;
        let i = task.start || 0;
        for(; i < sequence.length; ++i)
        {
            if(i - task.start > MAX_CHARS_PER_TICK)
            {
                return {
                    start: i,
                    synthRate: synthRate,
                    profit: profit
                }
            }
            if(SYNTHABLE_SYMBOLS.has(sequence[i]) && params[i])
                synthRate += params[i][0];
            if(harvestable.has(sequence[i]) && params[i])
                profit += params[i][0];
        }
        return {
            start: 0,
            synthRate: synthRate,
            profit: profit
        }
    }
    continueAction()
    {
        // Future idea: maybe instead of using an LS to prune/harvest, develop
        // efficient pruner/harvester, like a naked L-system rule???
        let c = this.colonies[this.actionGangsta[0]][this.actionGangsta[1]];
        let id = this.actionGangsta[2];
        if(!c)
        {
            this.actionGangsta = null;
            return;
        }
        if(PLANT_DATA[c.id].actions[id].killColony)
        {
            if(id == 0)
                currency.value += c.profit * BigNumber.from(c.population) *
                theory.publicationMultiplier;
            this.killColony(...this.actionGangsta);
            this.actionGangsta = null;
            theory.invalidateSecondaryEquation();
            theory.invalidateQuaternaryValues();
            return;
        }
        // derive and calc stats (possibly ancestree if future actions require
        // checking adjacency)
        if(!('derivation' in this.actionDeriveTask) ||
        ('derivation' in this.actionDeriveTask && this.actionDeriveTask.start))
        {
            this.actionDeriveTask = PLANT_DATA[c.id].actions[id].system.derive(
            c.sequence, c.params, null, null, this.actionDeriveTask);
            return;
        }
        if(!this.actionDeriveTask.derivation.length)
        {
            if(id == 0)
                currency.value += c.profit * BigNumber.from(c.population) *
                theory.publicationMultiplier;
            this.killColony(...this.actionGangsta);
            this.actionDeriveTask =
            {
                start: 0
            };
            this.actionGangsta = null;
            theory.invalidateSecondaryEquation();
            theory.invalidateQuaternaryValues();
            return;
        }
        if(!('synthRate' in this.actionCalcTask) ||
        ('synthRate' in this.actionCalcTask && this.actionCalcTask.start))
        {
            this.actionCalcTask = this.calculateStats(c, this.actionCalcTask,
            this.actionDeriveTask);
            return;
        }

        if(id == 0)
            currency.value += c.profit * BigNumber.from(c.population) *
            theory.publicationMultiplier;
        c.synthRate = this.actionCalcTask.synthRate;
        c.profit = this.actionCalcTask.profit;
        c.sequence = this.actionDeriveTask.derivation;
        c.params = this.actionDeriveTask.parameters;
        this.actionDeriveTask =
        {
            start: 0
        };
        this.actionCalcTask =
        {
            start: 0
        };
        // Roll back transaction!
        if(this.gangsta && this.gangsta[0] == this.actionGangsta[0] &&
        this.gangsta[1] == this.actionGangsta[1])
        {
            this.ancestreeTask =
            {
                start: 0
            };
            this.deriveTask =
            {
                start: 0
            };
            this.calcTask =
            {
                start: 0
            };
        }
        this.actionGangsta = null;
        theory.invalidateSecondaryEquation();
        theory.invalidateQuaternaryValues();
    }
    performAction(plot, index, id)
    {
        if(!this.colonies[plot][index])
            return;
        let action = [plot, index, id];
        if(this.actionGangsta)
        {
            this.actionQueue.enqueue(action);
            return;
        }
        this.actionGangsta = action;
    }
    evolve()
    {
        let c = this.colonies[this.gangsta[0]][this.gangsta[1]];
        if(!c)
        {
            this.gangsta = null;
            return;
        }
        // Ancestree, derive and calc stats
        if(!('ancestors' in this.ancestreeTask) ||
        ('ancestors' in this.ancestreeTask && this.ancestreeTask.start))
        {
            this.ancestreeTask = PLANT_DATA[c.id].system.getAncestree(
            c.sequence, this.ancestreeTask);
            return;
        }
        if(!('derivation' in this.deriveTask) ||
        ('derivation' in this.deriveTask && this.deriveTask.start))
        {
            this.deriveTask = PLANT_DATA[c.id].system.derive(c.sequence,
            c.params, this.ancestreeTask.ancestors, this.ancestreeTask.children,
            this.deriveTask);
            return;
        }
        if(!this.deriveTask.derivation.length)
        {
            this.killColony(...this.gangsta);
            this.ancestreeTask =
            {
                start: 0
            };
            this.deriveTask =
            {
                start: 0
            };
            this.gangsta = null;
            theory.invalidateSecondaryEquation();
            theory.invalidateQuaternaryValues();
            return;
        }
        if(!('synthRate' in this.calcTask) ||
        ('synthRate' in this.calcTask && this.calcTask.start))
        {
            this.calcTask = this.calculateStats(c, this.calcTask,
            this.deriveTask);
            return;
        }

        c.growth -= PLANT_DATA[c.id].growthCost *
        BigNumber.from(c.sequence.length);
        c.sequence = this.deriveTask.derivation;
        c.params = this.deriveTask.parameters;
        c.synthRate = this.calcTask.synthRate;
        c.profit = this.calcTask.profit;
        ++c.stage;
        this.ancestreeTask =
        {
            start: 0
        };
        this.deriveTask =
        {
            start: 0
        };
        this.calcTask =
        {
            start: 0
        };
        if(this.gangsta[0] == plotIdx && this.gangsta[1] == colonyIdx[plotIdx])
            renderer.colony = c;
        this.gangsta = null;
        theory.invalidateSecondaryEquation();
        theory.invalidateQuaternaryValues();
    }
}

let binarySearch = (arr, target) =>
{
    let l = 0;
    let r = arr.length - 1;
    while(l < r)
    {
        let m = Math.ceil((l + r) / 2);
        if(arr[m][0] <= target)
            l = m;
        else
            r = m - 1;
    }
    return arr[l][1];
}

// Balance parameters

const plotCosts = new FirstFreeCost(new ExponentialCost(100, Math.log2(1000)));
const plantUnlockCosts = new CompositeCost(1, new ConstantCost(1800),
new ConstantCost(1900));
const permaCosts =
[
    BigNumber.from(24),
    BigNumber.from(1e30),
    BigNumber.from(1e45)
];

const taxRate = BigNumber.from(.12);
const tauRate = BigNumber.ONE;
// e30 = 100 tau, e45 = end, but tau rate 1 = better design

const pubExp = BigNumber.from(.15);
var getPublicationMultiplier = (tau) => tau.max(BigNumber.ONE).pow(pubExp *
tau.max(BigNumber.ONE).log().max(BigNumber.ONE).log());
var getPublicationMultiplierFormula = (symbol) =>
`{${symbol}}^{${pubExp}\\ln({\\ln{${symbol}})}}`;

const PLANT_DATA =
[
    {   // Basil
        system: new LSystem('BA(0.12, 0)', [
            'A(r, t): r>=flowerThreshold = K(0)',
            'A(r, t): t<2 = A(r+0.06, t+1)',
            'A(r, t) = F(1.2)[+(42)L(0.06, min(r+0.06, maxLeafp), 0)]/(180)[+(42)TL(0.06, min(r+0.06, maxLeafp), 0)]/(90)I(0)A(r+0.06, 0)',
            'I(t): t<4 = I(t+1)',
            'I(t) = F(0.48)[+TL(0.06, maxLeafp/6, 0)]/(180)[+L(0.06, maxLeafp/6, 0)]',
            'F < K(t): t>=signalThreshold && t<=signalThreshold = S(0)[+$K(0)][-$K(0)]K(t)',
            'K(t): t-2 = K(t+1)',
            'K(t) = K(t+1)K(0)',
            'L(p, lim, s): s<1 && p<lim = L(p+0.03, lim, s)',
            'S(type) < L(p, lim, s): s<1 = L(p, p, s+1)',
            'L(p, lim, s): s>=1 && p>0 = L(p-0.12, lim, s)',
            'F(l) > S(type): type<=0 = S(type)F(l)',
            'S(type) < F(l): type>=1 = F(l)S(type)',
            'S(type) =',
            'B > S(type): type<=0 = BS(1)',
            '~> *= Model specification',
            '~> K(t) = /(90)F(sqrt(t/10)){[k(sqrt(t/10))//k(sqrt(t/10))//k(sqrt(t/10))//k(sqrt(t/10))//k(sqrt(t/10))//k(sqrt(t/10))//]}',
            '~> k(size): size<1 = [++F(size/2).[-F(size/2).].]',
            '~> k(size) = [++F(size/3).++[--F(size/2).][&F(size/2).].[^F(size/2).][--F(size/2).].[-F(size/2).].[F(size/2).].]',
            '~> L(p, lim, s): s<1 = {\\(90)F(p).T(p+0.7)[-(48)F(sqrt(p)).+&F(sqrt(p)).+F(sqrt(p)).+F(sqrt(p)).][F(sqrt(p))[&F(sqrt(p))[F(sqrt(p))[^F(sqrt(p)).].].].].[+(48)F(sqrt(p)).-&F(sqrt(p)).-F(sqrt(p)).-F(sqrt(p)).][F(sqrt(p))[&F(sqrt(p))[F(sqrt(p))[^F(sqrt(p)).].].].]}',
            '~> L(p, lim, s): s>=1 = {\\(90)F(sqrt(lim)).T(sqrt(lim)+0.6)[--F(lim).+&F(lim).+&F(lim).+F(lim)..][F(lim)[&F(lim)[&F(lim)[&F(lim).].].].].[++F(lim).-&F(lim).-&F(lim).-F(lim)..][F(lim)[&F(lim)[&F(lim)[&F(lim).].].].]}',
        ], 30, 0, 'SIA', '+-&^/\\T', 0.06, {
            'flowerThreshold': '1.2',
            'maxLeafp': '0.72',
            'signalThreshold': '4'
        }),
        cost: new FirstFreeCost(new ExponentialCost(1, 1)),
        growthRate: BigNumber.FOUR,
        growthCost: BigNumber.THREE,
        actions:
        [
            {   // Always a harvest
                symbols: new Set('L'),
                system: new LSystem('', ['L=']),
                killColony: true
            },
            {   // Always a prune
                system: new LSystem('', ['K=']),
                killColony: false
            }
        ],
        camera: (stage) =>
        {
            return {
                scale: 8,
                x: 0,
                y: Math.max(5, stage / 3),
                Z: 0,
                upright: true
            };
        },
        stroke: (stage) =>
        {
            return {
                tickLength: 1
            };
        }
    },
    {   // Arrow weed
        system: new LSystem('A(1)', [
            'F(l)=F(l*2)',
            'A(t)=F(1)[+A(t/2)][-A(t/2)]F(1)A(t)'
        ], 30),
        cost: new FirstFreeCost(new ExponentialCost(1, 1)),
        growthRate: BigNumber.TWO,
        growthCost: BigNumber.from(45),
        actions:
        [
            {   // Always a harvest
                symbols: new Set('A'),
                system: new LSystem('', ['A=']),
                killColony: true
            },
            {   // Always a prune
                system: new LSystem('', ['F=']),
                killColony: false
            }
        ],
        camera: (stage) =>
        {
            return {
                scale: 2 ** stage,
                // cameraMode: 0,
                // followFactor: 0.15,
                x: 2 ** stage,
                y: 0,
                Z: 0,
                upright: false
            };
        },
        stroke: (stage) =>
        {
            return {
                tickLength: stage < 3 ? 2 : 1,
                // initDelay: 0,
                // loadModels: true,
                // quickDraw: false,
                // quickBacktrack: false,
                // backtrackTail: true,
                // hesitateApex: true,
                // hesitateFork: true,
            };
        }
    }
]

// const sidewayQuat = new Quaternion(1, 0, 0, 0);
const uprightQuat = new Quaternion(-Math.sqrt(2)/2, 0, 0, Math.sqrt(2)/2);
const xUpQuat = new Quaternion(0, 1, 0, 0);
const yUpQuat = new Quaternion(0, 0, 1, 0);
const zUpQuat = new Quaternion(0, 0, 0, 1);

let manager = new ColonyManager();
let renderer = new Renderer(new LSystem(), '', []);
let globalRNG = new Xorshift(Date.now());

let quaternaryEntries =
[
    new QuaternaryEntry('p_1', null),
    new QuaternaryEntry('p_2', null),
    new QuaternaryEntry('p_3', null),
    new QuaternaryEntry('p_4', null),
    new QuaternaryEntry('p_5', null),
    new QuaternaryEntry('p_6', null),
];

let createFramedButton = (params, margin, callback, image) =>
{
    let frame = ui.createFrame
    ({
        cornerRadius: 1,
        margin: new Thickness(margin),
        padding: new Thickness(1),
        hasShadow: true,
        heightRequest: getImageSize(ui.screenWidth),
        widthRequest: getImageSize(ui.screenWidth),
        content: ui.createImage
        ({
            source: image,
            aspect: Aspect.ASPECT_FIT,
            useTint: false
        }),
        borderColor: Color.BORDER
    });
    return ui.createStackLayout
    ({
        ...params,
        children:
        [
            frame
        ],
        onTouched: (e) =>
        {
            if(e.type == TouchType.PRESSED)
            {
                frame.borderColor = Color.TRANSPARENT;
                // frame.hasShadow = false;
            }
            else if(e.type == TouchType.SHORTPRESS_RELEASED ||
            e.type == TouchType.LONGPRESS_RELEASED)
            {
                Sound.playClick();
                frame.borderColor = Color.BORDER;
                // frame.hasShadow = true;
                callback();
            }
            else if(e.type == TouchType.CANCELLED)
            {
                frame.borderColor = Color.BORDER;
                // frame.hasShadow = true;
            }
        }
    });
}

// const actionsLabel = ui.createLatexLabel
// ({
//     isVisible: () => manager.colonies[plotIdx][colonyIdx[plotIdx]] ?
//     true : false,
//     column: 0,
//     horizontalOptions: LayoutOptions.END,
//     verticalOptions: LayoutOptions.START,
//     margin: new Thickness(0, 14, 80, 0),
//     text: getLoc('labelActions'),
//     fontSize: 10,
//     textColor: () => Color.fromHex(eq2Colour.get(game.settings.theme))
// });
const harvestFrame = createFramedButton
({
    row: 0, column: 0,
}, 2, () => manager.performAction(plotIdx, colonyIdx[plotIdx], 0),
game.settings.theme == Theme.LIGHT ?
ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/trunk/icons/herbs-bundle-dark.png') :
ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/trunk/icons/herbs-bundle.png'));
const harvestLabel = ui.createLatexLabel
({
    row: 0, column: 1,
    // horizontalOptions: LayoutOptions.END,
    verticalTextAlignment: TextAlignment.START,
    margin: new Thickness(0, 9, 1, 9),
    text: getLoc('btnHarvest'),
    fontSize: 10,
    textColor: Color.TEXT_MEDIUM
});
const pruneFrame = createFramedButton
({
    row: 0, column: 2,
}, 2, () => manager.performAction(plotIdx, colonyIdx[plotIdx], 1),
game.settings.theme == Theme.LIGHT ?
ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/trunk/icons/hair-strands-dark.png') :
ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/trunk/icons/hair-strands.png'));
const pruneLabel = ui.createLatexLabel
({
    row: 0, column: 3,
    // horizontalOptions: LayoutOptions.END,
    verticalTextAlignment: TextAlignment.START,
    margin: new Thickness(0, 9, 1, 9),
    text: getLoc('btnPrune'),
    fontSize: 10,
    textColor: Color.TEXT_MEDIUM
});
const mutateFrame = createFramedButton
({
    row: 0, column: 4,
}, 2, () => log('Mootation!'),
game.settings.theme == Theme.LIGHT ?
ImageSource.THEORY :
ImageSource.THEORY);
const mutateLabel = ui.createLatexLabel
({
    row: 0, column: 5,
    // horizontalOptions: LayoutOptions.END,
    verticalTextAlignment: TextAlignment.START,
    margin: new Thickness(0, 9, 1, 9),
    text: 'Mutate',
    fontSize: 10,
    textColor: Color.TEXT_MEDIUM
});

// const settingsLabel = ui.createLatexLabel
// ({
//     column: 0,
//     horizontalOptions: LayoutOptions.END,
//     verticalOptions: LayoutOptions.END,
//     margin: new Thickness(0, 0, 40, 14),
//     text: getLoc('labelSettings'),
//     fontSize: 10,
//     textColor: () => Color.fromHex(eq2Colour.get(game.settings.theme))
// });
const settingsFrame = createFramedButton
({
    column: 0,
    verticalOptions: LayoutOptions.END
}, 2, () => createWorldMenu().show(), game.settings.theme == Theme.LIGHT ?
ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/trunk/icons/cog-dark.png') :
ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/trunk/icons/cog.png'));

var switchPlant, viewColony, switchColony;

var plants = Array.from({length: maxPlots}, (_) => []);

var plotPerma, plantPerma;

var currency;

var init = () =>
{
    currency = theory.createCurrency('p', 'p');

    /* Switch plant
    Moduloose
    */
    {
        switchPlant = theory.createSingularUpgrade(0, currency, new FreeCost);
        switchPlant.getDescription = () => Localization.format(
        getLoc('switchPlant'), plotIdx + 1);
        switchPlant.info = getLoc('switchPlantInfo');
        switchPlant.bought = (_) =>
        {
            switchPlant.level = 0;
            if(manager.colonies[plotIdx].length)
                return;
            plantIdx[plotIdx] = (plantIdx[plotIdx] + 1) %
            (plantPerma.level + 1);
            updateAvailability();
        };
        switchPlant.isAvailable = false;
    }
    /* View colony
    Essential in learning the game.
    */
    {
        viewColony = theory.createSingularUpgrade(1, currency, new FreeCost);
        viewColony.description = getLoc('viewColony');
        viewColony.info = getLoc('viewColonyInfo');
        viewColony.bought = (_) =>
        {
            viewColony.level = 0;
            let c = manager.colonies[plotIdx][colonyIdx[plotIdx]];
            if(!c)
                return;
            let seqMenu = createColonyViewMenu(c);
            seqMenu.show();
        };
        viewColony.isAvailable = false;
    }
    /* Switch colony
    Modulow
    */
    {
        switchColony = theory.createSingularUpgrade(2, currency, new FreeCost);
        switchColony.description = getLoc('switchColony');
        switchColony.info = getLoc('switchColonyInfo');
        switchColony.bought = (_) =>
        {
            switchColony.level = 0;
            if(manager.colonies[plotIdx].length < 2)
                return;

            colonyIdx[plotIdx] = (colonyIdx[plotIdx] + 1) %
            manager.colonies[plotIdx].length;
            let c = manager.colonies[plotIdx][colonyIdx[plotIdx]];
            renderer.colony = c;
        };
        switchColony.isAvailable = false;
    }

    /* Free penny
    For testing purposes
    */
    {
        let free_penny = theory.createUpgrade(9001, currency, new FreeCost);
        free_penny.description = 'Get 1 penny for free';
        free_penny.info = 'Yields 1 penny';
        free_penny.bought = (_) => currency.value += BigNumber.ONE;
        free_penny.isAutoBuyable = false;
        free_penny.isAvailable = false;
    }

    /* Plants & switch plants
    */
    for(let i = 0; i < maxPlots; ++i)
    {
        for(let j = 0; j < PLANT_DATA.length; ++j)
        {
            plants[i][j] = theory.createUpgrade(i * 100 + j, currency,
            PLANT_DATA[j].cost);
            plants[i][j].description = Localization.format(
            getLoc('plotPlant'), i + 1, getLoc('plants')[j].name);
            plants[i][j].info = getLoc('plants')[j].info;
            plants[i][j].bought = (amount) =>
            {
                if(actuallyPlanting)
                    manager.addColony(i, j, amount);
            };
            plants[i][j].isAvailable = false;
        }
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
        plotPerma.bought = (_) =>
        {
            theory.invalidateQuaternaryValues();
            updateAvailability();
        };
        plotPerma.maxLevel = maxPlots;
    }
    /* Plant unlock
    What do I do if I have other plants to unlock with other means?.
    */
    {
        plantPerma = theory.createPermanentUpgrade(4, currency,
        plantUnlockCosts);
        plantPerma.getDescription = (amount) =>
        {
            if(amount == 1)
                return Localization.getUpgradeUnlockDesc(`\\text
                {${getLoc('plants')[plantPerma.level + 1].name}}`);
            return Localization.getUpgradeUnlockDesc(`\\text
            {${getLoc('plants')[plantPerma.level + 1].name}~${getLoc('plants')[
            plantPerma.level + amount].name}}`);
        }
        plantPerma.getInfo = (amount) =>
        {
            if(amount == 1)
                return Localization.getUpgradeUnlockInfo(`\\text
                {${getLoc('plants')[plantPerma.level + 1].name}}`);
            return Localization.getUpgradeUnlockInfo(`\\text
            {${getLoc('plants')[plantPerma.level + 1].name}~${getLoc('plants')[
            plantPerma.level + amount].name}}`);
        }
        plantPerma.bought = (_) =>
        {
            updateAvailability();
        };
        plantPerma.maxLevel = PLANT_DATA.length - 1;
    }

    theory.createPublicationUpgrade(1, currency, permaCosts[0]);
    theory.createBuyAllUpgrade(2, currency, permaCosts[1]);
    theory.createAutoBuyerUpgrade(3, currency, permaCosts[2]);
    // To do: challenge plot (-1)
    // Next: plant unlocks and milestones

    // theory.primaryEquationHeight = 48;
    theory.primaryEquationScale = 0.96;
    theory.secondaryEquationHeight = 102;
}

var updateAvailability = () =>
{
    if(!finishedTutorial)
    {
        finishedTutorial = plotPerma.level > 0;
    }
    else
    {
        switchPlant.isAvailable = !manager.colonies[plotIdx].length;
        viewColony.isAvailable = manager.colonies[plotIdx].length == 1;
        switchColony.isAvailable = manager.colonies[plotIdx].length > 1;
    }
    for(let i = 0; i < plotPerma.level; ++i)
    {
        for(let j = 0; j < PLANT_DATA.length; ++j)
            plants[i][j].isAvailable = plants[i][j].level > 0 ||
            (j == plantIdx[i] && j > plantPerma.level - 1);
    }
}

var tick = (elapsedTime, multiplier) =>
{
    // Without the multiplier, one year is 14.6 hours
    let dt = elapsedTime * multiplier;
    time += dt;
    // https://www.desmos.com/calculator/pfku4nopgy
    // insolation = max(0, -cos(x*pi/72))
    // Help me check my integral maths
    let cycles = time / 144;
    days = Math.floor(cycles);
    let phase = Math.max(0, Math.min(cycles - days - 0.25, 0.5));
    let newII = days * 144 / Math.PI - 72 *
    (Math.cos(phase * 2 * Math.PI) - 1) / Math.PI;
    let di = newII - insolationIntegral;
    insolationIntegral = newII;
    // universal growth factor = cos(x*pi/72)/2 + 1/2
    let newGI = time / 2 + 36 * Math.sin(time * Math.PI / 72) / Math.PI;
    let dg = newGI - growthIntegral;
    growthIntegral = newGI;

    manager.growAll(BigNumber.from(di), BigNumber.from(dg));
    if(!graphMode)
        renderer.draw();
    theory.invalidateSecondaryEquation();
    // theory.invalidateTertiaryEquation();
}

var getEquationOverlay = () =>
{
    let result = ui.createGrid
    ({
        rowDefinitions: ['1*', '1*'],
        // columnDefinitions: ['68*', '32*'],
        inputTransparent: true,
        cascadeInputTransparent: false,
        children:
        [
            // For reference
            // ui.createFrame({row: 0, column: 2}),
            // ui.createFrame({row: 1, column: 2}),
            ui.createLatexLabel
            ({
                row: 0, column: 0,
                verticalTextAlignment: TextAlignment.START,
                margin: new Thickness(8, 4),
                text: getLoc('versionName'),
                fontSize: 9,
                textColor: Color.TEXT_MEDIUM
            }),
            ui.createLatexLabel
            ({
                row: 0, column: 0,
                horizontalTextAlignment: TextAlignment.CENTER,
                verticalTextAlignment: TextAlignment.START,
                margin: new Thickness(10, 4),
                text: getTimeString,
                fontSize: 10,
                textColor: Color.TEXT_MEDIUM
            }),
            ui.createGrid
            ({
                row: 1, column: 0,
                columnDefinitions: ['68*', '32*'],
                inputTransparent: true,
                cascadeInputTransparent: false,
                children:
                [
                    ui.createGrid
                    ({
                        isVisible: () => manager.colonies[plotIdx].length > 0,
                        row: 0, column: 0,
                        margin: new Thickness(4, 2),
                        horizontalOptions: LayoutOptions.START,
                        verticalOptions: LayoutOptions.END,
                        columnDefinitions:
                        [
                            'auto', 'auto',
                            'auto', 'auto',
                            'auto', 'auto'
                        ],
                        inputTransparent: true,
                        cascadeInputTransparent: false,
                        children:
                        [
                            harvestFrame,
                            harvestLabel,
                            pruneFrame,
                            pruneLabel,
                            // mutateFrame,
                            // mutateLabel
                        ]
                    }),
                    // actionsLabel,
                    ui.createGrid
                    ({
                        row: 0, column: 1,
                        margin: new Thickness(4, 2),
                        horizontalOptions: LayoutOptions.END,
                        verticalOptions: LayoutOptions.END,
                        inputTransparent: true,
                        cascadeInputTransparent: false,
                        children:
                        [
                            settingsFrame
                        ]
                    }),
                    // settingsLabel
                ]
            })
            
        ]
    });
    return result;
}

var getPrimaryEquation = () =>
{
    return Localization.format(getLoc('plotTitle'), plotIdx + 1);
}

var getSecondaryEquation = () =>
{
    if(!plotPerma.level)
        return '';

    let c = manager.colonies[plotIdx][colonyIdx[plotIdx]];
    if(!c)
    {
        let taxInfo = `\\text{${getLoc('pubTax')}}\\colon\\enspace
        ${taxRate}\\times\\max p\\\\
        =${getCurrencyFromTau(theory.tau)[0] * taxRate}p\\\\\\\\`;
        let tauInfo = `${theory.latexSymbol}=\\max p`;
        return `\\begin{array}{c}${theory.publicationUpgrade.level &&
        theory.canPublish ? taxInfo : ''}${tauInfo}\\end{array}`;
    }

    switch(colonyMode)
    {
        case 0:
            return `\\text{${Localization.format(getLoc('colonyProg'),
            c.population, getLoc('plants')[c.id].name, c.stage, c.growth *
            BigNumber.HUNDRED / (PLANT_DATA[c.id].growthCost *
            BigNumber.from(c.sequence.length)))}}\\\\
            \\text{${getLoc('plants')[c.id].stages[c.stage]}}\\\\
            (${colonyIdx[plotIdx] + 1}/${manager.colonies[plotIdx].length})
            \\\\`;
        case 1:
            return `\\text{${Localization.format(getLoc('colony'), c.population,
            getLoc('plants')[c.id].name, c.stage)}}\\\\E=${c.energy},\\enspace
            g=${c.growth}/${PLANT_DATA[c.id].growthCost *
            BigNumber.from(c.sequence.length)}\\\\
            r_s=${c.synthRate}/\\text{s},\\enspace\\pi =${c.profit}p
            \\\\(${colonyIdx[plotIdx] + 1}/${manager.colonies[plotIdx].length})
            \\\\`;
        case 2:
            let result = '';
            for(let i = 0; i < colonyIdx[plotIdx]; ++i)
            {
                let d = manager.colonies[plotIdx][i];
                result += `\\text{${Localization.format(getLoc('colonyProg'),
                d.population, getLoc('plants')[d.id].name, d.stage, d.growth *
                BigNumber.HUNDRED / (PLANT_DATA[d.id].growthCost *
                BigNumber.from(d.sequence.length)))}}\\\\`;
            }
            result += `\\underline{\\text{${Localization.format(
            getLoc('colonyProg'), c.population, getLoc('plants')[c.id].name,
            c.stage, c.growth * BigNumber.HUNDRED /
            (PLANT_DATA[c.id].growthCost *
            BigNumber.from(c.sequence.length)))}}}\\\\`;
            for(let i = colonyIdx[plotIdx] + 1;
            i < manager.colonies[plotIdx].length; ++i)
            {
                let d = manager.colonies[plotIdx][i];
                result += `\\text{${Localization.format(getLoc('colonyProg'),
                d.population, getLoc('plants')[d.id].name, d.stage, d.growth *
                BigNumber.HUNDRED / (PLANT_DATA[d.id].growthCost *
                BigNumber.from(d.sequence.length)))}}\\\\`;
            }
            return result;
        case 3:
            return '';
    }
}

let getTimeString = () =>
{
    let years = Math.floor(days / 365);
    let timeofDay = time % 144;
    let hour = Math.floor(timeofDay / 6);
    let min = Math.round((timeofDay % 6) * 10);

    return Localization.format(getLoc('dateTime'), years + 1, (days % 365) + 1,
    hour.toString().padStart(2, '0'), min.toString().padStart(2, '0'));
}

// var getTertiaryEquation = () =>
// {
//     return '_';
//     let years = Math.floor(days / 365);
//     let timeofDay = time % 144;
//     let hour = Math.floor(timeofDay / 6);
//     let min = Math.round((timeofDay % 6) * 10);

//     return Localization.format(getLoc(theory.canPublish &&
//     theory.publicationUpgrade.level ? 'dateTimeTaxL' : 'dateTimeL'), years + 1,
//     (days % 365) + 1, hour.toString().padStart(2, '0'),
//     min.toString().padStart(2, '0'),
//     getCurrencyFromTau(theory.tau)[0] * taxRate);
// }

var getQuaternaryEntries = () =>
{
    if(!plotPerma.level)
        return quaternaryEntries.slice(0, 1);

    for(let i = 0; i < plotPerma.level; ++i)
    {
        let sum = BigNumber.ZERO;
        for(let j = 0; j < manager.colonies[i].length; ++j)
        {
            let c = manager.colonies[i][j];
            sum += c.profit * BigNumber.from(c.population) *
            theory.publicationMultiplier;
        }
        quaternaryEntries[i].value = sum;
    }
    return quaternaryEntries//.slice(0, plotPerma.level);
}

let createVariableMenu = (variables) =>
{
    // Q: Does Object.entries mean that its contents are references, and 
    // therefore overwritable from afar?
    let varEntries = [];
    for(let i = 0; i < variables.length; ++i)
    {
        varEntries.push(ui.createEntry
        ({
            row: i,
            column: 0,
            text: variables[i][0]
        }));
        varEntries.push(ui.createLatexLabel
        ({
            text: '=',
            row: i,
            column: 1,
            horizontalTextAlignment: TextAlignment.CENTER,
            verticalTextAlignment: TextAlignment.CENTER
        }));
        varEntries.push(ui.createEntry
        ({
            row: i,
            column: 2,
            text: variables[i][1],
            horizontalTextAlignment: TextAlignment.END
        }));
    }
    let varsLabel = ui.createLatexLabel
    ({
        text: Localization.format(getLoc('labelVars'), variables.length),
        verticalTextAlignment: TextAlignment.CENTER,
        // margin: new Thickness(0, 12)
        heightRequest: getSmallBtnSize(ui.screenWidth)
    });
    let varStack = ui.createGrid
    ({
        columnDefinitions: ['50*', '20*', '30*'],
        children: varEntries
    });

    let menu = ui.createPopup
    ({
        title: getLoc('menuVariables'),
        content: ui.createStackLayout
        ({
            children:
            [
                ui.createGrid
                ({
                    columnDefinitions: ['70*', '30*'],
                    children:
                    [
                        varsLabel
                    ]
                }),
                ui.createScrollView
                ({
                    content: varStack
                }),
                ui.createBox
                ({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createButton
                ({
                    text: getLoc('btnClose'),
                    onClicked: () =>
                    {
                        Sound.playClick();
                        menu.hide();
                    }
                })
            ]
        })
    });
    return menu;
}

let createSystemMenu = (id) =>
{
    let values = PLANT_DATA[id].system.object;

    let tmpAxiom = values.axiom;
    let axiomEntry = ui.createEntry
    ({
        text: tmpAxiom,
        row: 0,
        column: 1
    });
    let tmpVars = Object.entries(values.variables);
    let varButton = ui.createButton
    ({
        text: getLoc('btnVar'),
        row: 0,
        column: 2,
        heightRequest: getSmallBtnSize(ui.screenWidth),
        onClicked: () =>
        {
            Sound.playClick();
            let varMenu = createVariableMenu(tmpVars);
            varMenu.show();
        }
    });
    let tmpRules = [];
    for(let i = 0; i < values.rules.length; ++i)
        tmpRules[i] = values.rules[i];
    let ruleEntries = [];
    for(let i = 0; i < tmpRules.length; ++i)
    {
        ruleEntries.push(ui.createEntry
        ({
            row: i,
            text: tmpRules[i]
        }));
    }
    let rulesLabel = ui.createLatexLabel
    ({
        text: Localization.format(getLoc('labelRules'), ruleEntries.length),
        verticalTextAlignment: TextAlignment.CENTER,
        // margin: new Thickness(0, 12),
        heightRequest: getSmallBtnSize(ui.screenWidth)
    });
    let ruleStack = ui.createGrid
    ({
        children: ruleEntries
    });

    let tmpIgnore = values.ignoreList || '';
    let ignoreEntry = ui.createEntry
    ({
        text: tmpIgnore,
        row: 0,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });
    let tmpCI = values.ctxIgnoreList || '';
    let CIEntry = ui.createEntry
    ({
        text: tmpCI,
        row: 1,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });
    let tmpAngle = values.turnAngle || '0';
    let angleEntry = ui.createEntry
    ({
        text: tmpAngle.toString(),
        row: 2,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });
    let tmpTropism = values.tropism || '0';
    let tropismEntry = ui.createEntry
    ({
        text: tmpTropism.toString(),
        row: 3,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });
    let tmpSeed = values.seed || '0';
    let seedLabel = ui.createGrid
    ({
        row: 4,
        column: 0,
        columnDefinitions: ['40*', '30*'],
        children:
        [
            ui.createLatexLabel
            ({
                text: getLoc('labelSeed'),
                column: 0,
                verticalTextAlignment: TextAlignment.CENTER
            })
        ]
    });
    let seedEntry = ui.createEntry
    ({
        text: tmpSeed.toString(),
        keyboard: Keyboard.NUMERIC,
        row: 4,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });

    let menu = ui.createPopup
    ({
        title: getLoc('plants')[id].name,
        isPeekable: true,
        content: ui.createStackLayout
        ({
            children:
            [
                ui.createScrollView
                ({
                    // heightRequest: ui.screenHeight * 0.32,
                    content: ui.createStackLayout
                    ({
                        children:
                        [
                            ui.createLatexLabel
                            ({
                                text: getLoc('plants')[id].LsDetails,
                                margin: new Thickness(0, 6),
                                horizontalTextAlignment: TextAlignment.START,
                                verticalTextAlignment: TextAlignment.CENTER
                            }),
                            ui.createGrid
                            ({
                                columnDefinitions: ['20*', '50*', '30*'],
                                children:
                                [
                                    ui.createLatexLabel
                                    ({
                                        text: getLoc('labelAxiom'),
                                        row: 0,
                                        column: 0,
                                        verticalTextAlignment:
                                        TextAlignment.CENTER
                                    }),
                                    axiomEntry,
                                    varButton
                                ]
                            }),
                            ui.createGrid
                            ({
                                columnDefinitions: ['70*', '30*'],
                                children:
                                [
                                    rulesLabel
                                ]
                            }),
                            ruleStack,
                            ui.createGrid
                            ({
                                columnDefinitions: ['70*', '30*'],
                                children:
                                [
                                    ui.createLatexLabel
                                    ({
                                        text: getLoc('labelIgnored'),
                                        row: 0,
                                        column: 0,
                                        verticalTextAlignment:
                                        TextAlignment.CENTER
                                    }),
                                    ignoreEntry,
                                    ui.createLatexLabel
                                    ({
                                        text: getLoc('labelCtxIgnored'),
                                        row: 1,
                                        column: 0,
                                        verticalTextAlignment:
                                        TextAlignment.CENTER
                                    }),
                                    CIEntry,
                                    ui.createLatexLabel
                                    ({
                                        text: getLoc('labelAngle'),
                                        row: 2,
                                        column: 0,
                                        verticalTextAlignment:
                                        TextAlignment.CENTER
                                    }),
                                    angleEntry,
                                    ui.createLatexLabel
                                    ({
                                        text: getLoc('labelTropism'),
                                        row: 3,
                                        column: 0,
                                        verticalTextAlignment:
                                        TextAlignment.CENTER
                                    }),
                                    tropismEntry,
                                    seedLabel,
                                    seedEntry
                                ]
                            })
                        ]
                    })
                }),
                ui.createBox
                ({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createButton
                ({
                    text: getLoc('btnClose'),
                    onClicked: () =>
                    {
                        Sound.playClick();
                        menu.hide();
                    }
                })
            ]
        })
    });
    return menu;
}

let createColonyViewMenu = (colony) =>
{
    let reconstructionTask =
    {
        start: 0
    };
    let updateReconstruction = () =>
    {
        if(!('result' in reconstructionTask) ||
        ('result' in reconstructionTask && reconstructionTask.start))
        {
            reconstructionTask = PLANT_DATA[colony.id].system.reconstruct(
            colony.sequence, colony.params, reconstructionTask);
        }
        return reconstructionTask.result;
    }
    let pageTitle = ui.createLatexLabel
    ({
        text: `${getLoc('plants')[colony.id].details}\\\\${Localization.format(
        getLoc('plantStats'), getLoc('plants')[colony.id].cost,
        PLANT_DATA[colony.id].growthRate, PLANT_DATA[colony.id].growthCost,
        colony.sequence.length)}`,
        margin: new Thickness(0, 6),
        horizontalTextAlignment: TextAlignment.START,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let pageContents = ui.createLabel
    ({
        fontFamily: FontFamily.CMU_REGULAR,
        fontSize: 16,
        text: () => updateReconstruction(),
        lineBreakMode: LineBreakMode.CHARACTER_WRAP
    });
    let viewButton = ui.createButton
    ({
        text: getLoc('btnView'),
        row: 0,
        column: 0,
        onClicked: () =>
        {
            Sound.playClick();
            let statsMenu = createSystemMenu(colony.id);
            statsMenu.show();
        }
    });
    let closeButton = ui.createButton
    ({
        text: getLoc('btnClose'),
        row: 0,
        column: 1,
        onClicked: () =>
        {
            Sound.playClick();
            menu.hide();
        }
    });

    let menu = ui.createPopup
    ({
        title: Localization.format(getLoc('colony'), colony.population,
        getLoc('plants')[colony.id].name, colony.stage),
        isPeekable: true,
        content: ui.createStackLayout
        ({
            children:
            [
                pageTitle,
                ui.createFrame
                ({
                    padding: new Thickness(8, 6),
                    heightRequest: ui.screenHeight * 0.16,
                    content: ui.createScrollView
                    ({
                        content: ui.createStackLayout
                        ({
                            children:
                            [
                                pageContents
                            ]
                        })
                    })
                }),
                ui.createBox
                ({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createGrid
                ({
                    minimumHeightRequest: getBtnSize(ui.screenWidth),
                    columnDefinitions: ['50*', '50*'],
                    children:
                    [
                        viewButton,
                        closeButton
                    ]
                })
            ]
        })
    });
    return menu;
}

let createWorldMenu = () =>
{
    let tmpGM = graphMode;
    let GMLabel = ui.createLatexLabel
    ({
        text: getLoc('graphModes')[tmpGM],
        row: 0,
        column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let GMSlider = ui.createSlider
    ({
        row: 0,
        column: 1,
        minimum: 0,
        maximum: 2,
        value: tmpGM,
        onValueChanged: () =>
        {
            tmpGM = Math.round(GMSlider.value);
            GMLabel.text = getLoc('graphModes')[tmpGM];
        },
        onDragCompleted: () =>
        {
            Sound.playClick();
            GMSlider.value = tmpGM;
        }
    });
    let tmpCM = colonyMode;
    let CMLabel = ui.createLatexLabel
    ({
        text: getLoc('colonyModes')[tmpCM],
        row: 1,
        column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let CMSlider = ui.createSlider
    ({
        row: 1,
        column: 1,
        minimum: 0,
        maximum: 3,
        value: tmpCM,
        onValueChanged: () =>
        {
            tmpCM = Math.round(CMSlider.value);
            CMLabel.text = getLoc('colonyModes')[tmpCM];
        },
        onDragCompleted: () =>
        {
            Sound.playClick();
            CMSlider.value = tmpCM;
        }
    });

    let menu = ui.createPopup
    ({
        title: getLoc('menuTheory'),
        content: ui.createStackLayout
        ({
            children:
            [
                ui.createGrid
                ({
                    columnDefinitions: ['70*', '30*'],
                    rowDefinitions:
                    [
                        getSmallBtnSize(ui.screenWidth),
                        getSmallBtnSize(ui.screenWidth)
                    ],
                    children:
                    [
                        GMLabel,
                        GMSlider,
                        CMLabel,
                        CMSlider
                    ]
                }),
                ui.createBox
                ({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createButton
                ({
                    text: getLoc('btnSave'),
                    onClicked: () =>
                    {
                        Sound.playClick();
                        graphMode = tmpGM;
                        colonyMode = tmpCM;
                        menu.hide();
                    }
                })
            ]
        })
    });
    return menu;
}

var getTau = () => currency.value.max(BigNumber.ZERO).pow(tauRate);

var getCurrencyFromTau = (tau) =>
[
    tau,
    currency.symbol
];

var prePublish = () =>
{
    tmpCurrency = currency.value;
    tmpLevels = Array.from({length: maxPlots}, (_) => []);
    for(let i = 0; i < maxPlots; ++i)
    {
        for(let j = 0; j < PLANT_DATA.length; ++j)
            tmpLevels[i][j] = 0;

        for(let j = 0; j < manager.colonies[i].length; ++j)
        {
            let c = manager.colonies[i][j];
            tmpLevels[i][c.id] += c.population;
        }
    }
}

// You can be in debt for this lol
var postPublish = () =>
{
    currency.value = tmpCurrency - getCurrencyFromTau(theory.tau)[0] * taxRate;
    actuallyPlanting = false;
    for(let i = 0; i < maxPlots; ++i)
    {
        for(let j = 0; j < PLANT_DATA.length; ++j)
            plants[i][j].level = tmpLevels[i][j];
    }
    actuallyPlanting = true;

    theory.invalidateQuaternaryValues();
}

var canResetStage = () => true;

var getResetStageMessage = () => getLoc('resetRenderer');

var resetStage = () => renderer.reset();

var canGoToPreviousStage = () => plotPerma.level > 0 && plotIdx > 0;

var goToPreviousStage = () =>
{
    --plotIdx;
    let c = manager.colonies[plotIdx][colonyIdx[plotIdx]];
    if(c)
        renderer.colony = c;
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    updateAvailability();
};
var canGoToNextStage = () => plotIdx < plotPerma.level - 1;
var goToNextStage = () =>
{
    ++plotIdx;
    let c = manager.colonies[plotIdx][colonyIdx[plotIdx]];
    if(c)
        renderer.colony = c;
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    updateAvailability();
};

// Copied from the ol Oiler's Formula
var bigStringify = (_, val) =>
{
    try
    {
        if(val instanceof BigNumber)
            return 'BigNumber' + val.toBase64String();
    }
    catch {};
    return val;
}

var unBigStringify = (_, val) =>
{
    if (val && typeof val === 'string')
    {
        if(val.startsWith('BigNumber'))
            return BigNumber.fromBase64String(val.substring(9));
    }
    return val;
}

var getInternalState = () => JSON.stringify
({
    version: version,
    time: time,
    plotIdx: plotIdx,
    colonyIdx: colonyIdx,
    plantIdx: plantIdx,
    finishedTutorial: finishedTutorial,
    manager: manager.object,
    graphMode: graphMode,
    colonyMode: colonyMode,
}, bigStringify);

var setInternalState = (stateStr) =>
{
    if(!stateStr)
        return;

    let state = JSON.parse(stateStr, unBigStringify);

    if('time' in state)
    {
        time = state.time;
        let cycles = time / 144;
        days = Math.floor(cycles);
        let phase = Math.max(0, Math.min(cycles - days - 0.25, 0.5));
        insolationIntegral = days * 144 / Math.PI - 72 *
        (Math.cos(phase * 2 * Math.PI) - 1) / Math.PI;
        growthIntegral = time / 2 + 36 * Math.sin(time * Math.PI / 72) /
        Math.PI;
    }

    if('plotIdx' in state)
        plotIdx = state.plotIdx;
    if('colonyIdx' in state)
        colonyIdx = state.colonyIdx;
    if('plantIdx' in state)
        plantIdx = state.plantIdx;
    if('finishedTutorial' in state)
        finishedTutorial = state.finishedTutorial;

    if('manager' in state)
        manager = new ColonyManager(state.manager);
    
    if('graphMode' in state)
        graphMode = state.graphMode;
    if('colonyMode' in state)
        colonyMode = state.colonyMode;

    actuallyPlanting = false;
    tmpLevels = Array.from({length: maxPlots}, (_) => []);
    for(let i = 0; i < maxPlots; ++i)
    {
        for(let j = 0; j < PLANT_DATA.length; ++j)
            tmpLevels[i][j] = 0;

        for(let j = 0; j < manager.colonies[i].length; ++j)
        {
            let c = manager.colonies[i][j];
            tmpLevels[i][c.id] += c.population;
        }
        for(let j = 0; j < PLANT_DATA.length; ++j)
            plants[i][j].level = tmpLevels[i][j];
    }
    actuallyPlanting = true;

    let c = manager.colonies[plotIdx][colonyIdx[plotIdx]];
    if(c)
        renderer.colony = c;
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    // theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
    updateAvailability();
}

var get2DGraphValue = () =>
{
    switch(graphMode)
    {
        case 0:
            return 0;
        case 1:     // Insolation
            return Math.max(0, -Math.cos(time * Math.PI / 72));
        case 2:     // Growth
            return (Math.cos(time * Math.PI / 72) + 1) / 2;
    }
};

var get3DGraphPoint = () => renderer.cursor;

var get3DGraphTranslation = () => renderer.camera;

init();

import { BigNumber } from './api/BigNumber';
import { CompositeCost, ConstantCost, ExponentialCost, FirstFreeCost, FreeCost } from './api/Costs';
import { game } from './api/Game';
import { Localization } from './api/Localization';
import { MathExpression } from './api/MathExpression';
import { profilers } from './api/Profiler';
import { Theme } from './api/Settings';
import { Sound } from './api/Sound';
import { QuaternaryEntry, theory } from './api/Theory';
import { Utils, log } from './api/Utils';
import { Vector3 } from './api/Vector3';
import { ui } from './api/ui/UI';
import { Aspect } from './api/ui/properties/Aspect';
import { ClearButtonVisibility } from './api/ui/properties/ClearButtonVisibility';
import { Color } from './api/ui/properties/Color';
import { FontFamily } from './api/ui/properties/FontFamily';
import { ImageSource } from './api/ui/properties/ImageSource';
import { Keyboard } from './api/ui/properties/Keyboard';
import { LayoutOptions } from './api/ui/properties/LayoutOptions';
import { LineBreakMode } from './api/ui/properties/LineBreakMode';
import { ScrollOrientation } from './api/ui/properties/ScrollOrientation';
import { StackOrientation } from './api/ui/properties/StackOrientation';
import { TextAlignment } from './api/ui/properties/TextAlignment';
import { Thickness } from './api/ui/properties/Thickness';
import { TouchType } from './api/ui/properties/TouchType';
var id = 'lemmas_garden';
var getName = (language) => {
    const names = {
        en: `Lemma's Garden (perch)`,
        ja: `レンマ苑`
    };
    return names[language] ?? names.en;
};
var getDescription = (language) => {
    const descs = {
        en: `Last night, Lemma swept away the fallen leaves on her old garden.
You are her first student in a long while.

Welcome to Lemma's Garden, an idle botanical theory built on the workings of ` +
            `Lindenmayer systems. Reminisce the story of Lemma, a retired teacher, as ` +
            `she rambles about things already long passed.`,
    };
    return descs[language] ?? descs.en;
};
var authors = 'propfeds\n\nThanks to:\nProf. Nakamura, research supervisor\n' +
    'game-icons.net, for providing the icons';
var version = 0.23;
// Numbers are often converted into 32-bit signed integers in JINT.
const INT_MAX = 0x7fffffff;
const INT_MIN = -0x80000000;
const TRIM_SP = /\s+/g;
const LS_RULE = /([^:]+)(:(.+))?=(.*)/;
// Context doesn't need to check for nested brackets!
const LS_CONTEXT = /((.)(\(([^\)]+)\))?<)?((.)(\(([^\)]+)\))?)(>(.)(\(([^\)]+)\))?)?/;
const BACKTRACK_LIST = new Set('+-&^\\/|[$T');
// Leaves and apices
const SYNTHABLE_SYMBOLS = new Set('AL');
const MAX_CHARS_PER_TICK = 300;
const NORMALISE_QUATERNIONS = false;
const MENU_LANG = Localization.language;
const LOC_STRINGS = {
    en: {
        versionName: `Version: 0.3 (Alpha), 'Grass Tidings'`,
        wip: 'Work in Progress',
        currencyTax: 'p (tax)',
        pubTax: 'Publishing fee \\&\\ taxes\\colon',
        btnView: 'View L-system',
        btnAlmanac: 'World of Plants',
        btnAlmanacNoEntry: '(Unavailable)',
        btnVar: 'Variables',
        btnSave: 'Save',
        btnReset: 'Clear Graphs',
        btnRedraw: 'Redraw',
        btnPrev: 'Prev.',
        btnNext: 'Next',
        btnContents: 'Table of\nContents',
        btnPage: 'p. {0}',
        actionConfirm: `You are about to perform a {0} on\\\\
{4}.\\\\(plot {1}, {2})\\\\{5}\\\\\n\n\\\\{6}`,
        bulkActionConfirm: `You are about to perform a {0} on all plants in ` +
            `plot {1}.\\\\\n\n\\\\{2}`,
        labelSave: 'Last saved: {0}s',
        labelSkip: 'Skip tutorial',
        labelWater: 'Water',
        labelWaterUrgent: 'Water!',
        labelActions: ['Harvest', 'Prune'],
        labelFilter: 'Filter: ',
        labelParams: 'Parameters: ',
        labelAxiom: 'Axiom: ',
        labelAngle: 'Turning angle (°): ',
        labelRules: `Production rules: {0}\\\\Every stage, each symbol in
the plant's sequence chooses one rule to evolve. Rules are checked from top to
bottom.`,
        labelIgnored: 'Turtle-ignored: ',
        labelCtxIgnored: 'Context-ignored: ',
        labelTropism: 'Tropism (gravity): ',
        labelSeed: 'Random seed: ',
        labelModels: `Model specifications: {0}\\\\Models define how each symbol
is drawn, with similar logic to production rules. If no model is specified, a
straight line will be drawn.`,
        menuVariables: 'Defined Variables',
        labelVars: 'Variables: {0}',
        plotTitle: `\\text{{Plot }}{{{0}}}`,
        plotTitleF: `\\mathcal{{P}} \\mkern -1mu l \\mkern -0.5mu o
\\mkern 1mu t \\enspace #{{\\mkern 2mu}}{{{0}}}`,
        riverTitle: `\\text{{River }}`,
        riverTitleF: `\\mathcal{{R}} \\mkern -0.5mu i \\mkern -0.5mu v
\\mkern 0.5mu e \\mkern 0.5mu r`,
        forestTitle: `\\text{{Lemma }}{{{0}}}`,
        forestTitleF: `\\mathcal{{L}} \\mkern -0.5mu e \\mkern 0.5mu mm
\\mkern 0.5mu a \\enspace #{{\\mkern 2mu}}{{{0}}}`,
        plainTitle: `\\text{{Floodplain }}{{{0}}}`,
        plainTitleF: `\\mathcal{{F}} \\mkern -1mu loodp \\mkern 0.5mu lain
\\enspace #{{\\mkern 2mu}}{{{0}}}`,
        unlockPlot: `\\text{{plot }}{{{0}}}`,
        unlockPlots: `\\text{{plots }}{{{0}}}~{{{1}}}`,
        unlockPlant: `\\text{{a new plant}}`,
        lockedPlot: `\\text{Untilled soil.}`,
        permaNote: `Notebook \\&\\ 'Buy All' button`,
        permaNoteInfo: 'Allows management of colony sizes',
        menuNote: 'Notebook',
        labelSpecies: 'Species',
        labelMaxLevel: 'Maximum level',
        labelNoteDesc: `The species' variable levels will not go beyond this
limit.`,
        menuAutoWater: 'Watering schedules',
        labelMaxStage: 'Stopping stage',
        labelAutoWaterDesc: `Scheduling is unlocked for a species after 
harvesting it for the first time.`,
        colony: `{0} of {1}, stage {2}`,
        colonyWMaxStg: `{0} of {1}, stage {2}/{3}`,
        colonyProg: '{0} of {1}, stg. {2} ({3}\\%)',
        colonyStats: `\\text{{Energy\\colon\\enspace {0} +{1}/s}}\\\\
\\text{{Growth\\colon\\enspace {2}/{3} +{4}/s}}\\\\
\\text{{Profit\\colon\\enspace {5}p}}\\\\
\\text{{({6}/{7}) {8}}}`,
        dateTime: 'Year {0} week {1}/{2}\\\\{3}:{4}\\\\{5}',
        dateTimeBottom: '{3}:{4}\\\\Year {0} week {1}/{2}\\\\{5}',
        hacks: 'Hax',
        status: {
            evolve: 'Growing...',
            actions: [
                'Harvesting...',
                'Pruning...'
            ]
        },
        switchPlant: 'Switch plant (plot {0})',
        switchPlantInfo: 'Cycles through the list of plants',
        plotPlant: 'Plot {0}: {1}',
        viewColony: 'Examine',
        viewColonyInfo: 'Displays details about the colony',
        switchColony: 'Switch colony ({0}/{1})',
        switchColonyInfo: 'Cycles through the list of colonies',
        labelSpeed: 'Game speed: {0}x',
        labelGM3D: '3D illustration: ',
        labelActionConfirm: 'Confirmation dialogue: ',
        lineGraphModes: [
            '2D graph: Off',
            '2D graph: Photosynthesis',
            '2D graph: Growth'
        ],
        colonyModes: [
            'Colony view: Off',
            'Colony view: Verbose',
            'Colony view: Simple',
            'Colony view: List'
        ],
        actionPanelModes: [
            'Action panel: Bottom',
            'Action panel: Top'
        ],
        plotTitleModes: [
            'Plot title: Serif',
            'Plot title: Cursive'
        ],
        quatModes: [
            'Account: Off',
            'Account: Expected revenue',
            'Account: Colonies',
            'Account: Performance (latest/avg)',
            'Account: Performance (min/max)'
        ],
        camModes: [
            'Camera: Static',
            'Camera: Follow (Linear)',
            'Camera: Follow (Squared)'
        ],
        plants: {
            sprout: {
                name: 'Pea sprout',
                nameShort: 's',
                info: `Tastes nice, innit? (\\(~\\)10 days)`,
                LsDetails: `A(r, t): apex (stem bud) providing r energy/s. Has
t stages left until it spurts.\\\\F(p): segment of length p.
Provides p pennies on harvest.\\\\L(r): leaf of size r, providing r energy/s.`,
                actions: [
                    `Harvest returns profit as the sum of all F lengths.`
                ],
                narrations: [
                    {
                        index: [0, 1, 4, 5, 8, 12],
                        0: `(Why is this seed called an axiom? What is the
second parameter for?\\\\I must wait for her return.)`,
                        1: `I am back! Rule number... one:\\\\The seed begins to
crack, and there's a 'timer' on it until something happens.`,
                        4: `Rule number 1 fails, so rule number 2 enacts:\\\\A
little stem rises, and there's a tiny pair of leaves on it.`,
                        5: `Rules 1, 3, and 4, all at the same time.`,
                        8: `The stem rises again, and with it, a new pair of
leaves.\\\\At the same time, the first segment and leaves reach their limits.`,
                        12: `You've made it. Welcome to class.\\\\Plant a few
more, then I'll get you something new.`
                    }
                ]
            },
            calendula: {
                name: 'Calendula',
                nameShort: 'C',
                info: 'The classic flower to start a month. (\\(~\\)7 weeks)',
                LsDetails: `A(r, t): apex (stem bud) providing r energy/s. Has
t stages left until it splits.\\\\F(l, lim): internode of length l, growing up
to lim.\\\\I(t): flower stem. Grows a leaf every stage until t reaches 0,
when it turns into K.\\\\K(p): flower of size p. Provides p pennies on harvest.
\\\\L(r, lim): leaf providing r energy/s, growing up to lim.`,
                actions: [
                    `Harvest returns profit as the sum of all K sizes.`
                ],
                narrations: [
                    {
                        index: [0, 5, 10, 15, 19, 21, 23, 26, 27, 28, 30, 31,
                            35, 39, 40],
                        0: 'A seed, curling over in its warm slumber.',
                        5: 'A little stem has just risen.',
                        10: `The second pair of leaves appears. See that for
this cultivar, each pair of leaves is rotated to 90° against the previous.
Others might generate leaves in a spiral around the stem.`,
                        15: 'The third pair of leaves appears.',
                        19: `The stem has split in two. It will start to flower
soon.`,
                        21: `On the flower stem, little leaves will start to
spawn in spiral around it. The spinning angle is approximately 137.508°, also
called by Mister Fibonacci as the golden angle.`,
                        23: 'Our first flower bud has risen.',
                        26: 'Wait for it...',
                        27: 'A second flower bud appears!',
                        28: 'The third and final flower appears.',
                        30: `My w... sister-in-law, she really liked munching on
these flowers raw. Try it.`,
                        31: `Try it!\\\\Naw, only teasing you ;). Keep your
saliva away from my little profit.`,
                        35: 'The first flower matures.',
                        39: 'The second flower matures.',
                        40: 'All flowers have reached maturity.',
                    }
                ]
            },
            basil: {
                name: 'Basil',
                nameShort: 'Ba',
                info: `A fragrant herb requiring a bit of care. (6\\(
~\\)8 weeks)`,
                LsDetails: `A(r, t): apex (stem bud).\\\\B: base, used for
communications.\\\\F(l, lim): internode.\\\\I(t): side stem. t stages left
until it advances.\\\\K(s, t): flower of size s. Grows another flower until t
reaches 0. Provides s pennies on harvest.\\\\L(p, lim, s): leaf. s denotes
whether a signal has been received. Provides p pennies on harvest.\\\\S(type):
signal (type 0 travels down, type 1 travels up).`,
                actions: [
                    `Harvest returns profit as the sum of all L and K sizes
(first parameter).`,
                    `Prune cuts off all A and K (and all geometry symbols near
K).`
                ],
                narrations: [
                    // Track 0: un-pruned or pruned late
                    {
                        index: [0, 6, 10, 14, 18, 22, 26, 27, 31, 32, 35],
                        0: 'A seed taking its sweet slumber.',
                        6: `The first pair of leaves pops up on the stem. A side
stem too.`,
                        10: 'The second leaf pair appears, along wth a stem.',
                        14: `The third pair of leaves appears. This rhythm will
repeat for a while`,
                        18: `I'll show you what to do when it's about to bloom,
soon.`,
                        22: `It's about to bloom. You can stay up watching
flowers later, or snip the bud, if you don't want your leaves bitter.`,
                        26: `The plant blooms. The flower sends a signal down.
\\\\Rules 12 to 15 govern signal transport.`,
                        27: `Rules number 12 and 14.\\\\The signal will travel
until it hits the base.`,
                        31: 'The signal touches base.',
                        32: 'Rule 15. Basil base relays the signal upward.',
                        35: `Rule 10. The first leaves receive the signal from
below. Let us unfold:\\\\
Bitter leaf, set us free,\\\\
as I whisper unto thee.\\\\
Flitting pollen, set me free,\\\\
as my mistress makes a tea,\\\\
out of me.`,
                    },
                    // Track 1: well pruned
                    {
                        name: 'well pruned',
                        index: [22],
                        22: `All leaves secured. Now watch the side stems
grow!`,
                    },
                    // Track 2: pruned
                    {
                        name: 'pruned',
                        index: [0, 6, 10, 14, 18],
                        0: `A seed taking its sweet slumber. It shall never wake
up.`,
                        6: `Pruning at this point nets you fairly little.`,
                        10: `This point secures a few more leaves, at least.`,
                        14: `At this pruning point, some of the leaves are
secured.`,
                        18: `At this pruning point, most of the leaves are
secured.`,
                    }
                ]
            },
            campion: {
                name: 'Rose campion',
                nameShort: 'R',
                info: `A silvery shrub, passively providing income per ` +
                    `stage. (\\(~\\)32 weeks)`,
                LsDetails: `A(r, t): apex (stem bud).\\\\F(l, t): internode of
length l. t stages until it stops growing.\\\\K(p, t): flower of size p. t
stages left until it disappears. Provides p pennies on harvest.\\\\L(s): leaf.
\\\\O(s): fruit of size s. Decorative.`,
                actions: [
                    `Harvest returns profit as the sum of all K sizes
(first parameter).`
                ],
                narrations: [
                    {
                        index: [0, 6, 10, 12, 14, 18, 19, 22, 27],
                        0: 'A seed basking in its own dazing lullaby.',
                        6: 'A flower bud already?',
                        10: 'New stems rise forth from a bud.',
                        12: `Reminder: gardeners need to be early birds. Now, 
why are you still up counting pennies?\\\\Look at the light. This lamp's wick
is, in fact, one of our own campion leaves. I don't sell them.\\\\So if you ever
needed to know whether what I do is all about crowns and riches, please look at
the light on your table again.`,
                        14: `New stems have risen. This pattern will repeat
periodically. Like a fractal.\\\\What's a graftal, you say?\\\\Oh, of course I'd
be making that up.`,
                        18: `New stems have risen.\\\\Oh no. Perhaps luminaries
were right all along. Small campion, big campion.`,
                        19: `Too late to munch on thy flowers, for the first 
fruit...\\\\cometh.`,
                        22: `Go to sleep. Was my campion sedative not good
enough?`,
                        27: `A fruit just fell off.\\\\Campion is a good self
seeder, you know. Watch for the new one coming right near ya.`
                    }
                ]
            },
            broomrape: {
                name: 'Broomrape',
                nameShort: 'Br',
            },
            arrow: {
                name: '(Test) Arrow weed',
                nameShort: 'Ar',
                info: 'Not balanced for regular play.',
                LsDetails: `The symbol A represents a rising shoot (apex), ` +
                    `while F represents the stem body.\\\\The Prune (scissors) action cuts every ` +
                    `F.\\\\The Harvest (bundle) action returns profit based on the sum of A, and ` +
                    `kills the colony.`,
                narrations: [
                    {
                        index: [0, 1, 2, 4],
                        0: 'The first shoot rises.\\\\Already harvestable.',
                        1: 'The shoot splits in three.\\\\The stem lengthens.',
                        2: 'The shoots continue to divide.',
                        4: `What do you expect? It\'s a fractal. Arrow weed is
friend to all mathematicians.`
                    }
                ]
            },
        },
        plantStats: `({0}) {1}\\\\—\\\\Photosynthetic rate: {2}/s (noon)
\\\\Growth rate: {3}/s\\\\Growth cost: {4} × {5} symbols\\\\—\\\\Sequence:`,
        narrationTrack: '{0}, {1}',
        noCommentary: 'No narrations.',
        noLsDetails: 'No explanations.',
        noActions: 'No actions available.',
        permaShelf: 'Bookshelf',
        permaShelfInfo: 'Access instructions and other tools',
        menuToC: 'Table of Contents',
        labelSource: 'Reference: ',
        bookTitleFormat: '{0} ({1}/{2})',
        almanacTitle: `Lemma's World of Plants`,
        almanac: {
            cover: {
                title: 'Title Cover',
                contents: `Lemma's World of Plants
An Introduction to Botany for Students
4th Edition (draft)


🌾🌻🌿



Lena Ruddles
Illustrations by Madeline H. Ruddles

Tau Publishing`
            },
            prep: {
                title: 'Preparations!',
                contents: `First, let's decide on your seeds.
I recommend any supplier that can provide consistent seeds in terms of ` +
                    `growth time, which would be perfect for setting up experiments. However, ` +
                    `such suppliers can be a bit expensive, so it's best to buy them in small ` +
                    `quantities in order to avoid turning a loss. ` +
                    `Don't worry about it, just take your time with any required calculations.

As students, you are also in charge of duties that, although quite mundane, ` +
                    `are more important than you think. Careful observation, a diligent plucking ` +
                    `of weeds, as well as a regular supply of water, are all needed to maintain ` +
                    `a healthy colony. (*)

Ready to sow some seeds?

(*) There are also important factors within the soil itself, such as its ` +
                    `elevation, the amount of sun it receives, its nutrients (prepare some good ` +
                    `compost for this), the moisture (make sure it has proper drainage and ` +
                    `doesn't clump up!).
Don't worry, I'm sure your teacher has a perfectly set up plot, though, so ` +
                    `go Sow Some Seeds!

Also, check your tool health: wash off the rust, clean them, sharpen very ` +
                    `well. Dip them in good soap and make a splash everywhere.
Don't forget to wash your best working dresses (also in good soap) and dry ` +
                    `them very well. You ought to look good while gardening. This is an ` +
                    `imperative.`
            },
            dayCycle: {
                title: 'And the day cycles...',
                contents: `Like us, plants in this world operate on a daily cycle, but their routine ` +
                    `is vastly different from ours. From the moment the sun comes up, they ` +
                    `harness the energy from its rays, converting it into sugar for its energy ` +
                    `storage. As the sun shines brightest at noon, the plant gets most of its ` +
                    `energy around this time.

By nightfall, where there is no sun to take advantage of, the plant focuses ` +
                    `on other routines. It converts its stored energy into the growth of its ` +
                    `cells. You can see that it would rise faster than it did during the day. ` +
                    `Some say that when it grows in the dark, it is really yearning for the sun ` +
                    `to come back.

Then the day cycles again...`
            },
            herbaceous: {
                title: 'Chapter 1: Herbaceous plants',
                contents: `In this book, plants will be divided into mainly two categories: herbaceous ` +
                    `and wooded plants.

Herbaceous plants are those that don't grow wood tissue on their stems, ` +
                    `such as ferns or grasses, and well, herbs! Compared to trees and wooded ` +
                    `shrubs, they have a relatively short life span, and are much more fragile.

Instead, they grow quickly, and rely on dispersing their seeds to survive. ` +
                    `Some of them can also grow their own underground food storage, such as ` +
                    `bulbs (onions), or tubers (potatoes).

Mind the medicinal definition of herbs, however! Not all herbaceous plants ` +
                    `are necessarily good for your health.`
            },
            calendula: {
                title: 'Calendula',
                contents: `Commonly called pot marigold (not to be confused with marigolds of the ` +
                    `genus Tagetes), calendulas are easy-going flowers known for numerous ` +
                    `medicinal and culinary uses. From inflammations to sunburns, scorpion ` +
                    `stings to hair care, you're going to see it everywhere!
The 'pot' in its name should also suggest it's uses as a cooking herb in ` +
                    `stews and soups too.

Life span: annual (~7 weeks)
Propagation: At life cycle's end, spread 1/3 population onto the same plot.

Here's a recipe to make some delicious calendula bread for your pleasures:`
            },
            basil: {
                title: 'Basil',
                contents: `Hailed as both queen and king of all herbs throughout the world, basil is ` +
                    `used as a spice in a vast number of recipes with its fragrance, accompanied ` +
                    `by a sweet and slightly intoxicating flavour. Even my dog loves it from ` +
                    `time to time.

Life span: annual (6~8 weeks)

If you plan to harvest leaves, snip off the stem before it flowers. ` +
                    `Otherwise, let the plant go into seed. The leaves will lose flavour, but ` +
                    `you will then be able to witness the fascinating communication signals ` +
                    `between the plant's organs. And the flowers do sell for good pennies.`
            },
            campion: {
                title: 'Rose campion',
                contents: `As a pest repellent, drought tolerant, and a great pollinator attractor, ` +
                    `campion is a vibrant shrub that will surely crown your garden with its ` +
                    `silvery sheen and bright pink blooms.
Rose campion can be used as a sedative, or for wound treatments, or wicks ` +
                    `for a lamp, which gave it the name of 'lamp flower'.

Life span: biennial (~32 weeks)
Propagation: Late in its life cycle, spread 1/2 population onto the same plot.
Passively provides income per stage equal to its current profit.

Occasionally, visitors and artists, generous donors, they would come and ` +
                    `toss a few pennies at your doorstep, as gratitude to keep the gardens ` +
                    `running. Well, mostly birds and bees paying for their hearty meals, but ` +
                    `there is the occasional human too.`
            }
        },
        manualTitle: 'Lindenmayer Systems',
        manual: {
            note: {
                title: `End Note`,
                contents: `This manuscript was found lying beneath a burrow, inside the forest. No ` +
                    `written indication of whether it would ever be arranged for publish. It ` +
                    `does not look to be written in our time, either. There is nothing natural ` +
                    `about this, as if one had willingly put the manuscript down, waiting for ` +
                    `someone else to pick up.

I shall leave this thread to resolve in a future date. Regardless, it is ` +
                    `certainly intriguing that the structure of a plant can be laid down into ` +
                    `a single line of letters. And the rules seem to represent not the guidance ` +
                    `from mother nature to the plants on how they would grow, but a person's ` +
                    `abstractions of such. And as such, they would rather serve as the guidance ` +
                    `from teacher to student, on how a wrinkled seed can sprout and flourish.
On a side note, I am delighted of the fact he does not think the wrinkled ` +
                    `seed would look identical in form to a grown up tree. Once I finish ` +
                    `dissecting the manuscript, I shall contemplate handing it to Ellen, ` +
                    `although, frankly speaking, it is unlikely anyone would believe me.

- Lena`
            },
            cover: {
                title: 'Title Cover',
                contents: `Lindenmayer Systems Renderer
A User's Guide
2nd Edition


🐢💨❄️



propfeds
Not for sale`
            },
            intro: {
                title: 'Lindenmayer systems: A primer',
                contents: `Developed in 1968 by biologist Aristid Lindenmayer, an L-system is a formal ` +
                    `grammar that describes the growth of a sequence (string). It is often used ` +
                    `to model plants and fractal figures for its ability to construct complex ` +
                    `objects out of simple rules.

Every L-system starts with a sequence called the axiom. From the axiom, the ` +
                    `sequence grows according to a set of production rules. These rules describe ` +
                    `how each symbol (character) of the sequence shall be rewritten in the next ` +
                    `stage.
Each rule is represented in the form of:
{symbol} = {derivation(s)}

Considering a simple system with the axiom of 'b' and the rules:
b = a
a = ab,
the sequence will grow as follows:
Stage 0: b
Stage 1: a
Stage 2: ab
Stage 3: aba
Stage 4: abaab
Stage 5: abaababa`
            },
            context: {
                title: 'Context-sensitivity',
                contents: `Context-sensitive L-systems allow each symbol to interact with nearby ` +
                    `symbols, by letting an individual behave differently depending on its ` +
                    `ancestor (the symbol to its immediate left), and its child to the right ` +
                    `(children, if it opens up multiple branches). They are often used to model ` +
                    `forms of communication between a plant's organs.

A context-sensitive rule goes as follows:
{left} < {symbol} > {right} = {derivation}
The symbol will only evolve according to this rule if its ancestor bears the ` +
                    `same symbol as {left}, and one of its children bears the same symbol as ` +
                    `{right}.`
            },
            parametric: {
                title: 'Parametric L-systems',
                contents: `Beyond geometric applications, parametric L-systems allow individual ` +
                    `symbols to hold additional information such as its state of growth, elapsed ` +
                    `time, etc. They can be even peeked at in context-sensitive rules!
When there are multiple rules specified for a symbol, the chosen one will be ` +
                    `selected according to two criteria:
- The condition evaluates to true (anything but zero).
- The number of parameters on the symbol must match the rule. This also ` +
                    `includes left and right contexts.

The syntax for a parametric rule goes as follows:
{symbol}({param_0},...) : {condition*} = {derivation_0} : {probability**} ;...
Examples:
I(t) : t>0 = FI(t-1)
I(t) = K(0) (this rule will be chosen when t<=0)
Example with context:
A(x) < B(y) > C(z) : x+y+z>10 = E((x+y)/2)F(z*2)

* When omitted, the condition is assumed to always be true.
** Ranges from 0 to 1. When omitted, the chance is assumed to be 1 (100%).`
            },
            symbols: {
                title: 'Appendix: Common organ symbols',
                contents: `A: apex (stem shoot). Can photosynthesise.
B: base. Often used to receive and send signals.
I: alternate stem. May transform into a new branch, or a flower.
K: flower. Looks good.
L: leaf. Can photosynthesise.
O: fruit. Tastes good and may drop seed.
S: signal. Used to communicate between organs.`
            },
            turtleSymbols: {
                title: 'Appendix: Geometric symbols',
                contents: `F(l): moves forward and draw a line of length l. Defaults to length 1 when ` +
                    `omitted.
+(n), -(n): perform yaw rotation by n degrees. Defaults to the angle ` +
                    `specified by the L-system when omitted.
&(n), ^(n): perform pitch rotation by n degrees.
\\(n), /(n): perform roll rotation by n degrees.

|: reverses direction.
T(n): applies tropism (gravity) with a weight of n. Defaults to the tropism ` +
                    `specified by the L-system when omitted.
T(n, x, y, z): applies tropism towards a custom vector.
$: aligns the turtle's up vector closest to vertical.

[: pushes turtle position & rotation onto a stack.
]: pops the stack's topmost element onto the turtle.
%: cuts off the remainder of a branch.

{: initiates polygon drawing mode.
.: sets a polygon vertex.
}: ends the polygon drawing mode.`
            },
        },
        chapters: {
            intro: [
                {
                    title: `Proven, untrusted`,
                    contents: `Not one of my students, are you?
Surprised to see somebody visit this late,
let alone urge me to let her plant on my ground?

(Hum. This is not fine.
But I can do something.)

...You're not in my classes yet,
but I can spare a little plot here for you.
Take one of my seeds, till the plot,
and we'll start in the morning.

Tip: Tap on 'Upgrades' to acquire your first plot.`
                },
                {
                    title: `Welcome to...`,
                    contents: `Hum. Splendid work!
Can't even bear to look at this soil.

Luckily, this sprout won't die,
even if later you'd stub your toe,
or drag one of your dresses over it.

But, neither would it thrive without you.
Lend it a few drops, and watch it grow.

Anyhow, reach for my shelf if you get lost.
I'll be back in just a little, to narrate
the plant's growth for you.`
                }
            ],
            basil: {
                title: `Corollary`,
                contents: `Sorry for letting you wait this long.
I have a... friend, who supplies me with seeds.
It's a bit exorbitant, but still reliable, I hope.

(scribbles)

...She didn't return until today. Apologies.
Wee bit sick of that marigold soup?

No, don't touch the other packet.
That is for my old... students!`
            },
            notebook: {
                title: `A notebook`,
                contents: `As you gather enough pennies to keep the batches
going, you decide to buy yourself a notebook.

This will help you keep track of your plantations.
Better than pretending to buy 10 seeds, at least.

Tip: Notebook is accessible at the bookshelf.`
            },
            flood: {
                title: `Inclement`,
                contents: `'Maximum statements?'
I hear ya.
We made too many complaint statements this season.
The floodplains hasn't been doing very well.
It's too likely to get logged this season...

Don't worry.
Try not to let your bushes spread too much,
this is unlike any regular flood.

Note: Your plots and settings have been wiped.
I'm sorry. I can't find a way around this.
Just deal with it as a 'gameplay mechanic'.
Standalone Lemma's Garden, coming in Never.
- propfeds`
            },
            nepo: {
                title: `Dear Ellen of Tau Publishing,`,
                contents: `You are going easy on my student.
What were you thinking? Super-exponential revenues?
Either you get accused of nepotism, or I of bribery.
And suddenly the next fortnight, she'd be cornering
the market.

I do not condone you letting her abuse the economy.
Not without giving something back for the community.
I need to do something.
- Lena`
            }
        },
        achievements: {
            debt: {
                title: 'Student',
                desc: 'Reach negative pennies.'
            },
            immortal: {
                title: 'Collective Experience',
                desc: 'Toil for 200 years.'
            }
        }
    }
};
/**
 * Returns a localised string.
 * @param {string} name the internal name of the string.
 * @returns {any} the string or folder.
 */
let getLoc = (name, lang = MENU_LANG) => {
    if (lang in LOC_STRINGS && name in LOC_STRINGS[lang])
        return LOC_STRINGS[lang][name];
    if (name in LOC_STRINGS.en)
        return LOC_STRINGS.en[name];
    return `String missing: ${lang}.${name}`;
};
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
let getImageSize = (width) => {
    if (width >= 1080)
        return 48;
    if (width >= 720)
        return 36;
    if (width >= 360)
        return 24;
    return 20;
};
let getBtnSize = (width) => {
    if (width >= 1080)
        return 96;
    if (width >= 720)
        return 72;
    if (width >= 360)
        return 48;
    return 40;
};
let getMediumBtnSize = (width) => {
    if (width >= 1080)
        return 88;
    if (width >= 720)
        return 66;
    if (width >= 360)
        return 44;
    return 36;
};
let getSmallBtnSize = (width) => {
    if (width >= 1080)
        return 80;
    if (width >= 720)
        return 60;
    if (width >= 360)
        return 40;
    return 32;
};
let getProgBarSize = (width) => {
    return getSmallBtnSize(width) / 2;
};
let getNavColumnDefs = (width) => {
    // if(width >= 1080)
    //     return 80;
    if (width >= 540) // 25%
        return ['30*', '90*', '30*', '50*'];
    if (width >= 450) // 30%
        return ['28*', '84*', '28*', '60*'];
    // 35%?
    return ['25*', '75*', '25*', '75*'];
};
let getActBarColumnDefs = (width) => {
    // if(width >= 1080)
    //     return 80;
    if (width >= 540) // 25%
        return ['75*', '25*'];
    if (width >= 450) // 30%
        return ['70*', '30*'];
    // 35%?
    return ['65*', '35*'];
};
let isColonyVisible = (c) => c.sequence.length > 1 ||
    trueSight.level > 0;
/**
 * Returns the index of the last element smaller than or equal to target.
 * Array must be sorted ascending.
 * @param {number[]} arr the array being searched.
 * @param {number} target the value to search for.
 * @returns {number}
 */
let binarySearchLast = (arr, target) => {
    let l = 0;
    let r = arr.length - 1;
    while (l < r) {
        let m = l + Math.ceil((r - l) / 2);
        if (arr[m] <= target)
            l = m;
        else
            r = m - 1;
    }
    return l;
};
/**
 * Returns the index of the first element larger than target. Array must be
 * sorted ascending.
 * @param {number[]} arr the array being searched.
 * @param {number} target the value to search for.
 * @returns {number}
 */
let binarySearchNext = (arr, target) => {
    let l = 0;
    let r = arr.length - 1;
    while (l < r) {
        let m = l + Math.floor((r - l) / 2);
        if (arr[m] <= target)
            l = m + 1;
        else
            r = m;
    }
    return l;
};
/**
 * Restricts a number into the specified range.
 */
let saturate = (x, min, max) => x > max ? max : x < min ? min : x;
/**
 * Converts a number into a Unicode compliant subscripted string.
 */
let getSubscript = (x) => {
    let xStr = x.toString();
    let result = '';
    for (let i = 0; i < xStr.length; ++i) {
        result += String.fromCharCode(0x2080 + parseInt(xStr[i]));
    }
    return result;
};
/**
 * Returns a string of a fixed decimal number, with a fairly uniform width.
 * @param {number} x the number.
 * @returns {string}
 */
let getCoordString = (x) => x.toFixed(x >= -0.01 ?
    (x <= 9.999 ? 3 : (x <= 99.99 ? 2 : 1)) :
    (x < -9.99 ? (x < -99.9 ? 0 : 1) : 2));
/**
 * Returns a C-style formatted string from a BigNumber. Note that it can only
 * handle up to the Number limit.
 * @param {BigNumber} x the number.
 * @returns {string}
 */
let getCString = (x) => parseFloat(x.toString(6)).toString();
/**
 * Purge a string array of empty lines.
 * @param {string[]} arr the array.
 * @returns {string[]}
 */
let purgeEmpty = (arr) => {
    let result = [];
    let idx = 0;
    for (let i = 0; i < arr.length; ++i) {
        // I hope this deep-copies
        if (arr[i]) {
            result[idx] = arr[i];
            ++idx;
        }
    }
    return result;
};
const yearStartLookup = [0];
const dandelionSchedule = [];
const broomrapeSchedule = [];
const hopleekSchedule = [];
for (let i = 1; i <= 400; ++i) {
    let leap = !(i % 4) && (!!(i % 100) || !(i % 400));
    let offset = leap ? 366 : 365;
    yearStartLookup[i] = yearStartLookup[i - 1] + offset;
    if (leap)
        hopleekSchedule.push(yearStartLookup[i - 1] + 60);
    let b = i % 4;
    if (b == 1 || b == 3) // Year 2, 4, 6, 8, 10
        broomrapeSchedule.push(yearStartLookup[i] + 105);
    // else if(b == 3) // Year 4, 8, 12
    //     broomrapeSchedule.push(yearStartLookup[i] + 364);
    dandelionSchedule.push(yearStartLookup[i] + 91);
}
const dandelionSpawner = {
    id: 'dandelion',
    schedule: dandelionSchedule,
    population: (index) => 2 + gameRNG.nextInt % 2,
    plot: () => gameRNG.nextInt % nofPlots
};
const broomrapeSpawner = {
    id: 'broomrape',
    schedule: broomrapeSchedule,
    population: (index) => Math.min(index + 1, 5),
    plot: () => 0
};
const fibonacci = [1, 2, 3, 5, 8, 13];
const hopleekSpawner = {
    id: 'hopleek',
    schedule: hopleekSchedule,
    population: (index) => fibonacci[Math.min(index, 5)],
    plot: () => nofPlots - 1 - gameRNG.nextInt % 2
};
/**
 * What else do you expect?
 */
class Queue {
    constructor(object = {}) {
        this.oldestIndex = object.oldestIndex ?? 0;
        this.newestIndex = object.newestIndex ?? 0;
        this.storage = object.storage ?? {};
    }
    get length() {
        let result = this.newestIndex - this.oldestIndex;
        if (!result) {
            this.oldestIndex = 0;
            this.newestIndex = 0;
        }
        return result;
    }
    ;
    toJSON() {
        return {
            oldestIndex: this.oldestIndex,
            newestIndex: this.newestIndex,
            storage: this.storage
        };
    }
    enqueue(data) {
        this.storage[this.newestIndex] = data;
        this.newestIndex++;
    }
    ;
    dequeue() {
        var oldestIndex = this.oldestIndex, newestIndex = this.newestIndex, deletedData;
        if (oldestIndex !== newestIndex) {
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
class Xorshift {
    constructor(seed = 1, aux = {}) {
        this.x = seed;
        this.y = aux.p1 ?? 0;
        this.z = aux.p2 ?? 0;
        this.w = aux.p3 ?? 0;
        if (!Object.keys(aux).length)
            for (let i = 0; i < 64; ++i)
                this.nextInt;
    }
    /**
     * Returns a random integer within [0, 2^31) probably.
     * @returns {number}
     */
    get nextInt() {
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
    get nextFloat() {
        return (this.nextInt >>> 0) / ((1 << 30) * 2);
    }
    /**
     * Returns a full random double floating point number using 2 rolls.
     * @returns {number}
     */
    get nextDouble() {
        let top, bottom, result;
        do {
            top = this.nextInt >>> 10;
            bottom = this.nextFloat;
            result = (top + bottom) / (1 << 21);
        } while (result === 0);
        return result;
    }
    /**
     * Returns a random integer within a range of [start, end).
     * @param {number} start the range's lower bound.
     * @param {number} end the range's upper bound, plus 1.
     * @returns {number}
     */
    nextRange(start, end) {
        // [start, end)
        let size = end - start;
        return start + Math.floor(this.nextFloat * size);
    }
    /**
     * Returns a random element from an array.
     * @param {any[]} array the array.
     * @returns {any}
     */
    choice(array) {
        return array[this.nextRange(0, array.length)];
    }
    toJSON() {
        return {
            seed: this.x,
            aux: {
                p1: this.y,
                p2: this.z,
                p3: this.w
            }
        };
    }
}
/**
 * Represents one hell of a quaternion.
 */
class Quaternion {
    constructor(r = 1, i = 0, j = 0, k = 0) {
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
    add(quat) {
        return new Quaternion(this.r + quat.r, this.i + quat.i, this.j + quat.j, this.k + quat.k);
    }
    /**
     * Computes the product of the current quaternion with another. Does not
     * modify the original quaternion.
     * @param {Quaternion} quat this other quaternion.
     * @returns {Quaternion}
     */
    mul(quat) {
        let t0 = this.r * quat.r - this.i * quat.i -
            this.j * quat.j - this.k * quat.k;
        let t1 = this.r * quat.i + this.i * quat.r +
            this.j * quat.k - this.k * quat.j;
        let t2 = this.r * quat.j - this.i * quat.k +
            this.j * quat.r + this.k * quat.i;
        let t3 = this.r * quat.k + this.i * quat.j -
            this.j * quat.i + this.k * quat.r;
        let result = new Quaternion(t0, t1, t2, t3);
        if (NORMALISE_QUATERNIONS)
            return result.normalise;
        else
            return result;
    }
    /**
     * Rotates the quaternion by some degrees.
     * @param {number} degrees degrees.
     * @param {string} symbol the corresponding symbol in L-system language.
     */
    rotate(degrees = 0, symbol = '+') {
        if (degrees == 0)
            return this;
        let halfAngle = degrees * Math.PI / 360;
        let s = Math.sin(halfAngle);
        let c = Math.cos(halfAngle);
        let rotation;
        switch (symbol) {
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
    get neg() {
        return new Quaternion(this.r, -this.i, -this.j, -this.k);
    }
    /**
     * Computes the norm of a quaternion.
     * @returns {number}
     */
    get norm() {
        return Math.sqrt(this.r ** 2 + this.i ** 2 + this.j ** 2 + this.k ** 2);
    }
    /**
     * Normalises a quaternion.
     * @returns {Quaternion}
     */
    get normalise() {
        let n = this.norm;
        return new Quaternion(this.r / n, this.i / n, this.j / n, this.k / n);
    }
    /**
     * Returns a heading vector from the quaternion.
     * @returns {Vector3}
     */
    get headingVector() {
        if (!this.head) {
            let r = this.neg.mul(xUpQuat).mul(this);
            this.head = new Vector3(r.i, r.j, r.k);
        }
        return this.head;
    }
    /**
     * Returns an up vector from the quaternion.
     * @returns {Vector3}
     */
    get upVector() {
        if (!this.up) {
            let r = this.neg.mul(yUpQuat).mul(this);
            this.up = new Vector3(r.i, r.j, r.k);
        }
        return this.up;
    }
    /**
     * Returns a side vector (left or right?) from the quaternion.
     * @returns {Vector3}
     */
    get sideVector() {
        if (!this.side) {
            let r = this.neg.mul(zUpQuat).mul(this);
            this.side = new Vector3(r.i, r.j, r.k);
        }
        return this.side;
    }
    /**
     * (Deprecated) Rotate from a heading vector to another. Inaccurate!
     * @param {Vector3} src the current heading.
     * @param {Vector3} dst the target heading.
     * @returns {Quaternion}
     */
    rotateFrom(src, dst) {
        let dp = src.x * dst.x + src.y * dst.y +
            src.z * dst.z;
        let rotAxis;
        if (dp < -1 + 1e-9) {
            /* Edge case
            If the two vectors are in opposite directions, just reverse.
            */
            return zUpQuat.mul(this);
        }
        rotAxis = new Vector3(src.y * dst.z - src.z * dst.y, src.z * dst.x - src.x * dst.z, src.x * dst.y - src.y * dst.x);
        let s = Math.sqrt((1 + dp) * 2);
        // I forgore that our quaternions have to be all negative, dunnoe why
        return this.mul(new Quaternion(-s / 2, rotAxis.x / s, rotAxis.y / s, rotAxis.z / s));
    }
    /**
     * https://stackoverflow.com/questions/71518531/how-do-i-convert-a-direction-vector-to-a-quaternion
     * (Deprecated) Applies a gravi-tropism vector to the quaternion.
     * @param {number} weight the vector's length (negative for upwards).
     * @returns {Quaternion}
     */
    applyTropismVector(weight = 0) {
        if (weight == 0)
            return this;
        let curHead = this.headingVector;
        // @ts-expect-error
        let newHead = curHead - new Vector3(0, weight, 0);
        let n = newHead.length;
        if (n == 0)
            return this;
        // @ts-expect-error
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
    applyTropism(weight = 0, x = 0, y = -1, z = 0) {
        if (weight == 0)
            return this;
        // a = e * |HxT| (n)
        let curHead = this.headingVector;
        let rotAxis = new Vector3(curHead.y * z - curHead.z * y, curHead.z * x - curHead.x * z, curHead.x * y - curHead.y * x);
        let n = rotAxis.length;
        if (n == 0)
            return this;
        // @ts-expect-error
        rotAxis /= n;
        let a = weight * n / 2;
        let s = Math.sin(a);
        let c = Math.cos(a);
        // I don't know why it works the opposite way this time
        return this.mul(new Quaternion(-c, rotAxis.x * s, rotAxis.y * s, rotAxis.z * s));
    }
    /**
     * https://gamedev.stackexchange.com/questions/198977/how-to-solve-for-the-angle-of-a-axis-angle-rotation-that-gets-me-closest-to-a-sp/199027#199027
     * Rolls the quaternion so that its up vector aligns with the earth.
     * @returns {Quaternion}
     */
    alignToVertical() {
        // L = V×H / |V×H|
        let curHead = this.headingVector;
        let curUp = this.upVector;
        let side = new Vector3(curHead.z, 0, -curHead.x);
        let n = side.length;
        if (n == 0)
            return this;
        // @ts-expect-error
        side /= n;
        // U = HxL
        let newUp = new Vector3(curHead.y * side.z - curHead.z * side.y, curHead.z * side.x - curHead.x * side.z, curHead.x * side.y - curHead.y * side.x);
        let a = Math.atan2(curUp.x * side.x + curUp.y * side.y + curUp.z * side.z, curUp.x * newUp.x + curUp.y * newUp.y + newUp.z * newUp.z) / 2;
        let s = Math.sin(a);
        let c = Math.cos(a);
        return new Quaternion(-c, s, 0, 0).mul(this);
    }
    /**
     * Returns the quaternion's string representation.
     * @returns {string}
     */
    toString() {
        return `${getCoordString(this.r)} + ${getCoordString(this.i)}i + ${getCoordString(this.j)}j + ${getCoordString(this.k)}k`;
    }
}
/**
 * Represents a parametric L-system.
 */
class LSystem {
    constructor(axiom = '', rules = [], turnAngle = 0, seed = 0, ignoreList = '', ctxIgnoreList = '', tropism = 0, variables = {}, models = []) {
        // User input
        this.userInput =
            {
                axiom: axiom,
                rules: purgeEmpty(rules),
                models: purgeEmpty(models),
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
        for (let key in variables)
            this.variables.set(key, MathExpression.parse(variables[key]).
                evaluate());
        let axiomMatches = this.parseSequence(axiom.replace(TRIM_SP, ''));
        this.axiom = axiomMatches.result;
        let axiomParamStrings = axiomMatches.params;
        this.axiomParams = [];
        this.varGetter = (v) => this.variables.get(v);
        // Manually calculate axiom parameters
        for (let i = 0; i < axiomParamStrings.length; ++i) {
            if (!axiomParamStrings[i]) {
                this.axiomParams[i] = null;
                continue;
            }
            let params = this.parseParams(axiomParamStrings[i]);
            this.axiomParams[i] = [];
            for (let j = 0; j < params.length; ++j)
                this.axiomParams[i][j] = MathExpression.parse(params[j]).
                    evaluate(this.varGetter);
            // Maybe leave them at BigNumber?
        }
        let ruleMatches = [];
        let concatRules = this.userInput.rules.concat(this.userInput.models);
        for (let i = 0; i < concatRules.length; ++i) {
            ruleMatches.push([...concatRules[i].replace(TRIM_SP, '').
                    match(LS_RULE)]);
            // Indices 1, 3, 4 are context, condition, and all derivations
        }
        this.rules = new Map();
        this.models = new Map();
        for (let i = 0; i < ruleMatches.length; ++i) {
            // [i][1]: context
            let contextMatch = [...ruleMatches[i][1].match(LS_CONTEXT)];
            // Indices 2, 4, 6, 8, 10, 12 are the symbols and parameters of
            // left, middle, and right respectively
            if (!contextMatch[6])
                continue;
            let tmpRule = {
                count: [0, 0, 0]
            };
            let ruleParams = {};
            // Middle
            if (contextMatch[8]) {
                let params = contextMatch[8].split(',');
                tmpRule.count[1] = params.length;
                for (let j = 0; j < params.length; ++j)
                    ruleParams[params[j]] = ['m', j];
            }
            // Left
            tmpRule.left = contextMatch[2];
            if (tmpRule.left && contextMatch[4]) {
                let params = contextMatch[4].split(',');
                tmpRule.count[0] = params.length;
                for (let j = 0; j < params.length; ++j)
                    ruleParams[params[j]] = ['l', j];
            }
            // Right
            tmpRule.right = contextMatch[10];
            if (tmpRule.right && contextMatch[12]) {
                let params = contextMatch[12].split(',');
                tmpRule.count[2] = params.length;
                for (let j = 0; j < params.length; ++j)
                    ruleParams[params[j]] = ['r', j];
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
            tmpRule.paramMap = (v, l, m, r) => {
                let pos = tmpRule.params[v][0];
                let result = null;
                switch (pos) {
                    case 'm':
                        if (m) {
                            result = m[tmpRule.params[v][1]];
                            break;
                        }
                    case 'l':
                        if (l) {
                            result = l[tmpRule.params[v][1]];
                            break;
                        }
                    case 'r':
                        if (r) {
                            result = r[tmpRule.params[v][1]];
                            break;
                        }
                }
                // log(`${v} = ${result}`);
                return result;
                // MathExpression eval: (v) => rule.paramMap(v, params[l], ...)
            };
            // [i][3]: condition
            if (ruleMatches[i][3])
                tmpRule.condition = MathExpression.parse(ruleMatches[i][3]);
            else
                tmpRule.condition = MathExpression.parse('1');
            // [i][4]: everything else
            // Doing just comma instead of semi-colon will ruin the parameters!
            let tmpRuleMatches = ruleMatches[i][4].split(';');
            for (let j = 0; j < tmpRuleMatches.length; ++j) {
                if (typeof tmpRuleMatches[j] === 'undefined')
                    continue;
                tmpRuleMatches[j] = tmpRuleMatches[j].split(':');
                let tmpDeriv = this.parseSequence(tmpRuleMatches[j][0]);
                let derivParamStrings = tmpDeriv.params;
                let derivParams = [];
                for (let k = 0; k < derivParamStrings.length; ++k) {
                    if (!derivParamStrings[k]) {
                        derivParams[k] = null;
                        continue;
                    }
                    let params = this.parseParams(derivParamStrings[k]);
                    derivParams[k] = [];
                    for (let l = 0; l < params.length; ++l)
                        derivParams[k][l] = MathExpression.parse(params[l]);
                }
                if (typeof tmpRule.derivations === 'string') {
                    tmpRule.derivations = [tmpRule.derivations,
                        tmpDeriv.result];
                    tmpRule.parameters = [tmpRule.parameters, derivParams];
                    if (tmpRuleMatches[j][1])
                        tmpRule.chances = [tmpRule.chances,
                            MathExpression.parse(tmpRuleMatches[j][1])];
                    else
                        tmpRule.chances = [tmpRule.chances,
                            MathExpression.parse('1')];
                }
                else if (!tmpRule.derivations) {
                    tmpRule.derivations = tmpDeriv.result;
                    tmpRule.parameters = derivParams;
                    if (tmpRuleMatches[j][1])
                        tmpRule.chances = MathExpression.parse(tmpRuleMatches[j][1]);
                    else
                        tmpRule.chances = MathExpression.parse('1');
                }
                else // Already an array
                 {
                    tmpRule.derivations.push(tmpDeriv.result);
                    tmpRule.parameters.push(derivParams);
                    if (tmpRuleMatches[j][1])
                        tmpRule.chances.push(MathExpression.parse(tmpRuleMatches[j][1]));
                    else
                        tmpRule.chances.push(MathExpression.parse('1'));
                }
            }
            // Finally, push rule
            if (contextMatch[6] == '~') {
                if (!this.models.has(contextMatch[10]))
                    this.models.set(contextMatch[10], []);
                this.models.get(contextMatch[10]).push(tmpRule);
            }
            else {
                if (!this.rules.has(contextMatch[6]))
                    this.rules.set(contextMatch[6], []);
                this.rules.get(contextMatch[6]).push(tmpRule);
            }
        }
        this.ignoreList = new Set(ignoreList);
        this.ctxIgnoreList = new Set(ctxIgnoreList);
        this.RNG = new Xorshift(seed);
        this.halfAngle = MathExpression.parse(turnAngle.toString()).evaluate(this.varGetter).toNumber() * Math.PI / 360;
        this.rotations = new Map();
        let s = Math.sin(this.halfAngle);
        let c = Math.cos(this.halfAngle);
        this.rotations.set('+', new Quaternion(-c, 0, 0, s));
        this.rotations.set('-', new Quaternion(-c, 0, 0, -s));
        this.rotations.set('&', new Quaternion(-c, 0, s, 0));
        this.rotations.set('^', new Quaternion(-c, 0, -s, 0));
        this.rotations.set('\\', new Quaternion(-c, s, 0, 0));
        this.rotations.set('/', new Quaternion(-c, -s, 0, 0));
        this.tropism = MathExpression.parse(tropism.toString()).evaluate(this.varGetter).toNumber();
    }
    /**
     * Parse a sequence to return one array of characters and one of parameters.
     * Is only used when initialising the L-system.
     * @param {string} sequence the sequence to be parsed.
     * @returns {object}
     */
    parseSequence(sequence) {
        let result = '';
        let resultParams = [];
        let bracketLvl = 0;
        let start = null;
        for (let i = 0; i < sequence.length; ++i) {
            switch (sequence[i]) {
                case ' ':
                    log('Blank space detected.');
                    break;
                case '(':
                    ++bracketLvl;
                    if (bracketLvl == 1)
                        start = i + 1;
                    break;
                case ')':
                    if (!bracketLvl) {
                        log('You\'ve clearly made a bracket error.');
                        break;
                    }
                    --bracketLvl;
                    if (!bracketLvl)
                        resultParams.push(sequence.slice(start, i));
                    break;
                default:
                    if (bracketLvl)
                        break;
                    result += sequence[i];
                    if (sequence[i + 1] != '(')
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
     * @param {string} sequence the string to be parsed.
     * @returns {string[]}
     */
    parseParams(sequence) {
        let result = [];
        let bracketLvl = 0;
        let start = 0;
        for (let i = 0; i < sequence.length; ++i) {
            switch (sequence[i]) {
                case ' ':
                    log('Blank space detected.');
                    break;
                case '(':
                    ++bracketLvl;
                    break;
                case ')':
                    if (!bracketLvl) {
                        log('You\'ve clearly made a bracket error.');
                        break;
                    }
                    --bracketLvl;
                    break;
                case ',':
                    if (!bracketLvl) {
                        result.push(sequence.slice(start, i));
                        start = i + 1;
                    }
                    break;
                default:
                    break;
            }
        }
        result.push(sequence.slice(start, sequence.length));
        return result;
    }
    /**
     * Returns and ancestree and a child tree for a sequence.
     * @param {string} sequence the sequence.
     * @returns {object}
     */
    getAncestree(sequence, task = {}) {
        // Scanning behaviour should be very similar to renderer drawing.
        let tmpStack = task.stack ?? [];
        let tmpIdxStack = task.idxStack ?? [];
        let tmpAncestors = task.ancestors ?? [];
        let tmpChildren = task.children ?? [];
        let i = task.start ?? 0;
        for (; i < sequence.length; ++i) {
            if (i - task.start > MAX_CHARS_PER_TICK * 2) {
                return {
                    start: i,
                    stack: tmpStack,
                    idxStack: tmpIdxStack,
                    ancestors: tmpAncestors,
                    children: tmpChildren
                };
            }
            switch (sequence[i]) {
                case ' ':
                    log('Blank space detected.');
                    break;
                case '[':
                    tmpIdxStack.push(tmpStack.length);
                    break;
                case ']':
                    if (tmpStack.length == 0) {
                        log('You\'ve clearly made a bracket error.');
                        break;
                    }
                    while (tmpStack.length > tmpIdxStack[tmpIdxStack.length - 1])
                        tmpStack.pop();
                    tmpIdxStack.pop();
                    break;
                default:
                    let ignored = this.ctxIgnoreList.has(sequence[i]);
                    if (ignored)
                        break;
                    if (tmpStack.length > 0) {
                        let ancIdx = tmpStack[tmpStack.length - 1];
                        tmpAncestors[i] = ancIdx;
                        if (typeof tmpChildren[ancIdx] === 'undefined')
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
     * Derive a sequence from the input string. Returns the work completed for
     * the current tick. `start` denotes the next tick's starting position.
     */
    derive(sequence, seqParams, ancestors, children, task = {}) {
        let result = task.derivation ?? '';
        let resultParams = task.parameters ?? [];
        let i = task.start ?? 0;
        let charCount = 0;
        for (; i < sequence.length; ++i) {
            if (charCount > MAX_CHARS_PER_TICK) {
                return {
                    start: i,
                    derivation: result,
                    parameters: resultParams
                };
            }
            if (sequence[i] == '%') {
                let branchLvl = 0;
                for (; i < sequence.length; ++i) {
                    switch (sequence[i]) {
                        case '[':
                            ++branchLvl;
                            break;
                        case ']':
                            --branchLvl;
                            break;
                    }
                    if (branchLvl < 0)
                        break;
                }
                if (sequence[i] == ']') {
                    result += sequence[i];
                    ++charCount;
                    resultParams.push(null);
                }
                else
                    continue;
            }
            // else if(sequence[i] == '~')
            //     continue;
            else if (this.rules.has(sequence[i])) {
                let tmpRules = this.rules.get(sequence[i]);
                let ruleChoice = -1;
                for (let j = 0; j < tmpRules.length; ++j) {
                    // Param count check
                    let count = seqParams[i] ? seqParams[i].length : 0;
                    if (tmpRules[j].count[1] != count)
                        continue;
                    // Left check
                    let left = ancestors[i];
                    if (tmpRules[j].left) {
                        count = seqParams[left] ? seqParams[left].length : 0;
                        if (tmpRules[j].left != sequence[left] ||
                            tmpRules[j].count[0] != count)
                            continue;
                    }
                    // Right check
                    let right = -1;
                    if (tmpRules[j].right) {
                        if (children[i]) {
                            for (let k = 0; k < children[i].length; ++k) {
                                count = seqParams[children[i][k]] ?
                                    seqParams[children[i][k]].length : 0;
                                if (tmpRules[j].right == sequence[children[i][k]]
                                    && tmpRules[j].count[2] == count) {
                                    right = children[i][k];
                                    break;
                                }
                            }
                        }
                        if (right == -1)
                            continue;
                    }
                    let tmpParamMap = (v) => this.varGetter(v) ??
                        tmpRules[j].paramMap(v, seqParams[left], seqParams[i], seqParams[right]);
                    // Next up is the condition
                    if (tmpRules[j].condition.evaluate(tmpParamMap)?.isZero)
                        continue;
                    if (typeof tmpRules[j].derivations === 'string') {
                        result += tmpRules[j].derivations;
                        charCount += tmpRules[j].derivations.length;
                        if (tmpRules[j].parameters) {
                            for (let k = 0; k < tmpRules[j].parameters.length; ++k) {
                                let derivPi = null;
                                let tmpParams = tmpRules[j].
                                    parameters[k];
                                if (tmpParams) {
                                    for (let l = 0; l < tmpParams.length; ++l) {
                                        if (tmpParams[l]) {
                                            if (!derivPi)
                                                derivPi = [];
                                            derivPi.push(tmpParams[l].evaluate(tmpParamMap));
                                        }
                                    }
                                }
                                resultParams.push(derivPi);
                            }
                        }
                        ruleChoice = j;
                        break;
                    }
                    else // Stochastic time
                     {
                        let roll = this.RNG.nextFloat;
                        let chanceSum = 0;
                        let choice = -1;
                        for (let k = 0; k < tmpRules[j].derivations.length; ++k) {
                            // Example
                            // roll: 0.50
                            // chance 1: 0.00 - 0.49
                            // sum after 1: 0.50
                            // chance 2: 0.50 - 0.99
                            // sum after 2: 1 (select!)
                            chanceSum += tmpRules[j].chances[k].evaluate(tmpParamMap);
                            if (chanceSum > roll) // select this
                             {
                                choice = k;
                                result += tmpRules[j].derivations[k];
                                charCount += tmpRules[j].derivations[k].length;
                                if (tmpRules[j].parameters[k]) {
                                    for (let l = 0; l < tmpRules[j].
                                        parameters[k].length; ++l) {
                                        let derivPi = null;
                                        let tmpParams = tmpRules[j].parameters[k][l];
                                        if (tmpParams) {
                                            for (let m = 0; m < tmpParams.length; ++m) {
                                                if (tmpParams[m]) {
                                                    if (!derivPi)
                                                        derivPi = [];
                                                    derivPi.push(tmpParams[m].
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
                        if (choice == -1)
                            continue;
                        ruleChoice = j;
                        break;
                    }
                }
                if (ruleChoice == -1) {
                    result += sequence[i];
                    ++charCount;
                    resultParams.push(...[seqParams[i]]);
                }
            }
            else {
                result += sequence[i];
                ++charCount;
                resultParams.push(...[seqParams[i]]);
            }
        }
        return {
            start: 0,
            derivation: result,
            parameters: resultParams
        };
    }
    deriveModel(symbol, params) {
        let result = '';
        let resultParams = [];
        if (this.models.has(symbol)) {
            let tmpRules = this.models.get(symbol);
            for (let j = 0; j < tmpRules.length; ++j) {
                // Param count check
                let count = params ? params.length : 0;
                if (tmpRules[j].count[2] != count)
                    continue;
                let tmpParamMap = (v) => this.varGetter(v) ??
                    tmpRules[j].paramMap(v, null, null, params);
                // Next up is the condition
                if (tmpRules[j].condition.evaluate(tmpParamMap)?.isZero)
                    continue;
                if (typeof tmpRules[j].derivations === 'string') {
                    result = tmpRules[j].derivations;
                    if (tmpRules[j].parameters) {
                        for (let k = 0; k < tmpRules[j].parameters.length; ++k) {
                            let derivPi = null;
                            let tmpParams = tmpRules[j].
                                parameters[k];
                            if (tmpParams) {
                                for (let l = 0; l < tmpParams.length; ++l) {
                                    if (tmpParams[l]) {
                                        if (!derivPi)
                                            derivPi = [];
                                        derivPi.push(tmpParams[l].evaluate(tmpParamMap));
                                    }
                                }
                            }
                            resultParams.push(derivPi);
                        }
                    }
                    break;
                }
                else // Stochastic time
                 {
                    // Models can be drawn any time, thus, the RNG should be
                    // separate from actual rule processing.
                    let roll = modelRNG.nextFloat;
                    let chanceSum = 0;
                    let choice = -1;
                    for (let k = 0; k < tmpRules[j].derivations.length; ++k) {
                        // Example
                        // roll: 0.50
                        // chance 1: 0.00 - 0.49
                        // sum after 1: 0.50
                        // chance 2: 0.50 - 0.99
                        // sum after 2: 1 (select!)
                        chanceSum += tmpRules[j].chances[k].evaluate(tmpParamMap);
                        if (chanceSum > roll) // select this
                         {
                            choice = k;
                            result = tmpRules[j].derivations[k];
                            if (tmpRules[j].parameters[k]) {
                                for (let l = 0; l < tmpRules[j].
                                    parameters[k].length; ++l) {
                                    let derivPi = null;
                                    const tmpParams = tmpRules[j].parameters[k][l];
                                    if (tmpParams) {
                                        for (let m = 0; m < tmpParams.length; ++m) {
                                            if (tmpParams[m]) {
                                                if (!derivPi)
                                                    derivPi = [];
                                                derivPi.push(tmpParams[m].
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
                    if (choice == -1)
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
    /**
     * Reconstructs the string representation of a sequence.
     * @param {Colony} colony the plant colony.
     * @param {string} filter the filter.
     * @param {boolean} displayParams whether to display parameters.
     * @param {number} indentation the number of spaces to indent.
     * @param {Task} task the current task.
     * @returns {Task}
     */
    reconstruct(colony, filter = '', displayParams = true, indentation = 4, task = {}) {
        if (indentation < 0)
            indentation = -indentation;
        let sequence = colony.sequence;
        let params = colony.params;
        let level = 0;
        let lineStart = false;
        if (!displayParams && !filter) {
            return {
                start: 0,
                level: level,
                result: sequence
            };
        }
        let filterSet = new Set(filter);
        let result = task.result ?? '';
        let i = task.start ?? 0;
        for (; i < sequence.length; ++i) {
            if (i - task.start > MAX_CHARS_PER_TICK) {
                return {
                    start: i,
                    level: level,
                    result: result
                };
            }
            if (displayParams && lineStart) {
                result += `\n${' '.repeat(indentation * Math.max(0, level))}`;
                lineStart = false;
            }
            let writesToResult = !filter || filterSet.has(sequence[i]);
            if (writesToResult) {
                switch (sequence[i]) {
                    case '[':
                        ++level;
                        lineStart = true;
                        break;
                    case ']':
                        lineStart = true;
                        break;
                }
                result += sequence[i];
                if (displayParams && params[i]) {
                    let paramStrings = [];
                    for (let j = 0; j < params[i].length; ++j)
                        paramStrings[j] = getCString(params[i][j]);
                    result += `(${paramStrings.join(', ')})`;
                }
                switch (sequence[i + 1]) {
                    case '[':
                        lineStart = true;
                        break;
                    case ']':
                        --level;
                        lineStart = true;
                        break;
                }
            }
        }
        return {
            start: 0,
            level: level,
            result: result
        };
    }
    /**
     * Returns a deep copy (hopefully) of the user input to prevent overwrites.
     * @returns {LSystemInput}
     */
    toJSON() {
        return {
            axiom: this.userInput.axiom,
            rules: purgeEmpty(this.userInput.rules),
            models: purgeEmpty(this.userInput.models),
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
    toString() {
        return JSON.stringify(this, null, 4);
    }
}
/**
 * Mini-renderer!
 */
class Renderer {
    constructor(system, sequence, params, camera = {}, stroke = {}) {
        this.figureScale = camera.scale || 1;
        this.cameraMode = camera.mode ?? 0;
        this.followFactor = camera.followFactor ?? 0.15;
        this.camCentre = new Vector3(camera.x ?? 0, camera.y ?? 0, camera.z ?? 0);
        this.upright = camera.upright ?? false;
        this.lastCamera = new Vector3(0, 0, 0);
        this.lastCamVel = new Vector3(0, 0, 0);
        this.tickLength = stroke.tickLength ?? 1;
        this.initDelay = stroke.initDelay ?? 0;
        // Loop mode is always 0
        // Whether to reset graph on hitting reset button is a game setting
        this.loadModels = stroke.loadModels ?? true;
        this.quickDraw = stroke.quickDraw ?? false;
        this.quickBacktrack = stroke.quickBacktrack ?? false;
        this.backtrackTail = stroke.backtrackTail ?? true;
        this.hesitateApex = stroke.hesitateApex ?? true;
        this.hesitateFork = stroke.hesitateFork ?? true;
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
        this.redrawing = false;
    }
    /**
     * Resets the renderer.
     * @param {boolean} clearGraph whether to clear the graph.
     */
    reset(clearGraph = false) {
        if (!clearGraph && this.stack.length) {
            // This is what the renderer will do at the end of a loop
            let t = this.stack.pop();
            this.state = t[0];
            this.ori = t[1];
            return;
        }
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
        if (clearGraph) {
            theory.clearGraph();
        }
        this.redrawing = false;
    }
    /**
     * Configures the colony.
     * @param {object} colony hmm.
     */
    set colony(colony) {
        if (!colony) {
            this.configure('', []);
            return;
        }
        this.system = plantData[colony.id].system;
        this.configure(colony.sequence, colony.params, plantData[colony.id].camera(colony.stage), plantData[colony.id].stroke(colony.stage));
    }
    configure(sequence = null, params = null, camera = {}, stroke = {}, redraw = true) {
        this.figureScale = camera.scale || this.figureScale;
        this.cameraMode = camera.mode ?? this.cameraMode;
        this.followFactor = camera.followFactor ?? this.followFactor;
        this.camCentre = new Vector3(camera.x ?? this.camCentre.x, camera.y ?? this.camCentre.y, camera.z ?? this.camCentre.z);
        this.upright = camera.upright ?? this.upright;
        this.tickLength = stroke.tickLength ?? this.tickLength;
        this.initDelay = stroke.initDelay ?? this.initDelay;
        // Loop mode is always 0
        // Whether to reset graph on hitting reset button is a game setting
        this.loadModels = stroke.loadModels ?? this.loadModels;
        this.quickDraw = stroke.quickDraw ?? this.quickDraw;
        this.quickBacktrack = stroke.quickBacktrack ?? this.quickBacktrack;
        this.backtrackTail = stroke.backtrackTail ?? this.backtrackTail;
        this.hesitateApex = stroke.hesitateApex ?? this.hesitateApex;
        this.hesitateFork = stroke.hesitateFork ?? this.hesitateFork;
        this.sequence = sequence ?? this.sequence;
        this.params = params ?? this.params;
        this.redrawing = redraw;
    }
    /**
     * Moves the cursor forward.
     */
    forward(distance = 1) {
        // @ts-expect-error
        this.state += this.ori.headingVector * distance;
    }
    /**
     * Ticks the clock.
     */
    tick() {
        if (this.sequence.length)
            ++this.elapsed;
    }
    /**
     * Computes the next cursor position internally.
     */
    draw() {
        if (this.redrawing) {
            this.reset(!graphMode2D);
            return;
        }
        this.tick();
        if (this.elapsed % this.tickLength) // Only update on multiples
            return;
        let j, t, moved;
        let loopLimit = 2; // Shenanigans may arise with models? Try this
        for (j = 0; j < loopLimit; ++j) {
            if (this.cooldown > 0 && this.polygonMode <= 0) {
                --this.cooldown;
                return;
            }
            if (this.models.length > 0) {
                /*
                Unreadable pile of crap, but essentially same as the section
                below.
                */
                for (; this.mdi[this.mdi.length - 1] <
                    this.models[this.models.length - 1].length; ++this.mdi[this.mdi.length - 1]) {
                    switch (this.models[this.models.length - 1][this.mdi[this.mdi.length - 1]]) {
                        case ' ':
                            log('Blank space detected.');
                            break;
                        case '+':
                            if (this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]][0].toNumber(), '+');
                            else
                                this.ori = this.system.rotations.get('+').mul(this.ori);
                            break;
                        case '-':
                            if (this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]][0].toNumber(), '-');
                            else
                                this.ori = this.system.rotations.get('-').mul(this.ori);
                            break;
                        case '&':
                            if (this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]][0].toNumber(), '&');
                            else
                                this.ori = this.system.rotations.get('&').mul(this.ori);
                            break;
                        case '^':
                            if (this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]][0].toNumber(), '^');
                            else
                                this.ori = this.system.rotations.get('^').mul(this.ori);
                            break;
                        case '\\':
                            if (this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]][0].toNumber(), '\\');
                            else
                                this.ori = this.system.rotations.get('\\').mul(this.ori);
                            break;
                        case '/':
                            if (this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]])
                                this.ori = this.ori.rotate(this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]][0].toNumber(), '/');
                            else
                                this.ori = this.system.rotations.get('/').mul(this.ori);
                            break;
                        case '|':
                            this.ori = zUpQuat.mul(this.ori);
                            break;
                        case '$':
                            this.ori = this.ori.alignToVertical();
                            break;
                        case 'T':
                            let args = this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]];
                            if (args) {
                                if (args.length >= 4)
                                    this.ori = this.ori.applyTropism(args[0].toNumber(), args[1].toNumber(), args[2].toNumber(), args[3].toNumber());
                                else
                                    this.ori = this.ori.applyTropism(args[0].toNumber());
                            }
                            else
                                this.ori = this.ori.applyTropism(this.system.tropism);
                            break;
                        case '~':
                            break;
                        case '[':
                            this.idxStack.push(this.stack.length);
                            this.stack.push([this.state, this.ori]);
                            break;
                        case ']':
                            if (this.cooldown > 0 && this.polygonMode <= 0) {
                                --this.cooldown;
                                return;
                            }
                            if (this.stack.length == 0) {
                                log('You\'ve clearly made a bracket error.');
                                break;
                            }
                            moved = this.state !==
                                this.stack[this.stack.length - 1][0];
                            t = this.stack.pop();
                            this.state = t[0];
                            this.ori = t[1];
                            if (this.stack.length ==
                                this.idxStack[this.idxStack.length - 1]) {
                                this.idxStack.pop();
                                if (moved)
                                    this.cooldown = 1;
                                if (this.hesitateFork && this.polygonMode <= 0) {
                                    ++this.mdi[this.mdi.length - 1];
                                    return;
                                }
                                else {
                                    break;
                                }
                            }
                            if (this.polygonMode <= 0)
                                return;
                            else {
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
                            if (this.polygonMode <= 0)
                                log('You cannot register a vertex outside of ' +
                                    'polygon drawing.');
                            else
                                ++this.mdi[this.mdi.length - 1];
                            return;
                        default:
                            if (this.cooldown > 0 && this.polygonMode <= 0) {
                                --this.cooldown;
                                return;
                            }
                            if (this.loadModels && this.system.models.has(this.models[this.models.length - 1][this.mdi[this.mdi.length - 1]])) {
                                let model = this.system.deriveModel(this.models[this.models.length - 1][this.mdi[this.mdi.length - 1]], this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]]);
                                this.models.push(model.result);
                                this.modelParams.push(model.params);
                                this.mdi.push(0);
                                ++this.mdi[this.mdi.length - 2];
                                return;
                            }
                            let ignored = this.system.ignoreList.has(this.models[this.models.length - 1][this.mdi[this.mdi.length - 1]]);
                            let breakAhead = BACKTRACK_LIST.has(this.models[this.models.length - 1][this.mdi[this.mdi.length - 1] + 1]);
                            let btAhead = this.models[this.models.length - 1][this.mdi[this.mdi.length - 1] + 1] == ']' ||
                                this.mdi[this.mdi.length - 1] ==
                                    this.models[this.models.length - 1].length - 1;
                            if (this.hesitateApex && btAhead)
                                this.cooldown = 1;
                            if (this.quickDraw && breakAhead)
                                this.cooldown = 1;
                            moved = this.stack.length == 0 ||
                                (this.stack.length > 0 && this.state !==
                                    this.stack[this.stack.length - 1][0]);
                            if (!this.quickBacktrack && moved && !ignored)
                                this.stack.push([this.state, this.ori]);
                            if (!ignored) {
                                if (this.models[this.models.length - 1][this.mdi[this.mdi.length - 1]] == 'F' &&
                                    this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]]) {
                                    this.forward(this.modelParams[this.models.length - 1][this.mdi[this.mdi.length - 1]][0].toNumber());
                                }
                                else
                                    this.forward();
                            }
                            if (this.quickBacktrack && breakAhead)
                                this.stack.push([this.state, this.ori]);
                            if (this.quickDraw && !btAhead)
                                break;
                            else if (this.polygonMode <= 0 && !ignored) {
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
            for (; this.i < this.sequence.length; ++this.i) {
                // if(this.models.length > 0)
                //     break;
                switch (this.sequence[this.i]) {
                    case ' ':
                        log('Blank space detected.');
                        break;
                    case '+':
                        if (this.params[this.i])
                            this.ori = this.ori.rotate(this.params[this.i][0].toNumber(), '+');
                        else
                            this.ori = this.system.rotations.get('+').mul(this.ori);
                        break;
                    case '-':
                        if (this.params[this.i])
                            this.ori = this.ori.rotate(this.params[this.i][0].toNumber(), '-');
                        else
                            this.ori = this.system.rotations.get('-').mul(this.ori);
                        break;
                    case '&':
                        if (this.params[this.i])
                            this.ori = this.ori.rotate(this.params[this.i][0].toNumber(), '&');
                        else
                            this.ori = this.system.rotations.get('&').mul(this.ori);
                        break;
                    case '^':
                        if (this.params[this.i])
                            this.ori = this.ori.rotate(this.params[this.i][0].toNumber(), '^');
                        else
                            this.ori = this.system.rotations.get('^').mul(this.ori);
                        break;
                    case '\\':
                        if (this.params[this.i])
                            this.ori = this.ori.rotate(this.params[this.i][0].toNumber(), '\\');
                        else
                            this.ori = this.system.rotations.get('\\').mul(this.ori);
                        break;
                    case '/':
                        if (this.params[this.i])
                            this.ori = this.ori.rotate(this.params[this.i][0].toNumber(), '/');
                        else
                            this.ori = this.system.rotations.get('/').mul(this.ori);
                        break;
                    case '|':
                        this.ori = zUpQuat.mul(this.ori);
                        break;
                    case '$':
                        this.ori = this.ori.alignToVertical();
                        break;
                    case 'T':
                        let args = this.params[this.i];
                        if (args) {
                            if (args.length >= 4)
                                this.ori = this.ori.applyTropism(args[0].toNumber(), args[1].toNumber(), args[2].toNumber(), args[3].toNumber());
                            else
                                this.ori = this.ori.applyTropism(args[0].toNumber());
                        }
                        else
                            this.ori = this.ori.applyTropism(this.system.tropism);
                        break;
                    case '~':
                        break;
                    case '[':
                        this.idxStack.push(this.stack.length);
                        this.stack.push([this.state, this.ori]);
                        break;
                    case ']':
                        if (this.cooldown > 0 && this.polygonMode <= 0) {
                            --this.cooldown;
                            return;
                        }
                        if (this.stack.length == 0) {
                            log('You\'ve clearly made a bracket error.');
                            break;
                        }
                        moved = this.state !==
                            this.stack[this.stack.length - 1][0];
                        t = this.stack.pop();
                        this.state = t[0];
                        this.ori = t[1];
                        if (this.stack.length ==
                            this.idxStack[this.idxStack.length - 1]) {
                            this.idxStack.pop();
                            if (moved)
                                this.cooldown = 1;
                            if (this.hesitateFork && this.polygonMode <= 0) {
                                ++this.i;
                                return;
                            }
                            else {
                                break;
                            }
                        }
                        if (this.polygonMode <= 0)
                            return;
                        else {
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
                        if (this.polygonMode <= 0)
                            log('You cannot register a vertex outside of ' +
                                'polygon drawing.');
                        else
                            ++this.i;
                        return;
                    default:
                        if (this.cooldown > 0 && this.polygonMode <= 0) {
                            --this.cooldown;
                            return;
                        }
                        if (this.loadModels && this.system.models.has(this.sequence[this.i])) {
                            let model = this.system.deriveModel(this.sequence[this.i], this.params[this.i]);
                            this.models.push(model.result);
                            this.modelParams.push(model.params);
                            this.mdi.push(0);
                            ++this.i;
                            return;
                        }
                        let ignored = this.system.ignoreList.has(this.sequence[this.i]);
                        let breakAhead = BACKTRACK_LIST.has(this.sequence[this.i + 1]);
                        let btAhead = this.sequence[this.i + 1] == ']' ||
                            this.i == this.sequence.length - 1;
                        if (this.hesitateApex && btAhead)
                            this.cooldown = 1;
                        if (this.quickDraw && breakAhead)
                            this.cooldown = 1;
                        moved = this.stack.length == 0 ||
                            (this.stack.length > 0 && this.state !==
                                this.stack[this.stack.length - 1][0]);
                        if (!this.quickBacktrack && moved && !ignored)
                            this.stack.push([this.state, this.ori]);
                        if (!ignored) {
                            if (this.sequence[this.i] == 'F' &&
                                this.params[this.i]) {
                                this.forward(this.params[this.i][0].toNumber());
                            }
                            else
                                this.forward();
                        }
                        if (this.quickBacktrack && breakAhead)
                            this.stack.push([this.state, this.ori]);
                        if (this.quickDraw && !btAhead)
                            break;
                        else if (this.polygonMode <= 0 && !ignored) {
                            ++this.i;
                            return;
                        }
                        else
                            break;
                }
            }
            // This is what the renderer will do at the end of a loop
            if (!this.backtrackTail || this.stack.length == 0)
                return;
            else {
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
    swizzle(coords) {
        // The game uses left-handed Y-up, aka Y-down coordinates.
        return new Vector3(coords.x, -coords.y, coords.z);
    }
    /**
     * Returns the camera centre's coordinates.
     * @returns {Vector3}
     */
    get centre() {
        if (this.cameraMode)
            // @ts-expect-error
            return -this.cursor;
        // @ts-expect-error
        return this.swizzle(-this.camCentre / this.figureScale);
    }
    /**
     * Returns the turtle's coordinates.
     * @returns {Vector3}
     */
    get cursor() {
        // @ts-expect-error
        let coords = this.state / this.figureScale;
        return this.swizzle(coords);
    }
    /**
     * Returns the camera's coordinates.
     * @returns {Vector3}
     */
    get camera() {
        let newCamera;
        switch (this.cameraMode) {
            case 2 /* CameraModes.QUADRATIC */:
                // I accidentally discovered Bézier curves unknowingly.
                // @ts-expect-error
                let dist = this.centre - this.lastCamera;
                // @ts-expect-error
                newCamera = this.lastCamera + dist * this.followFactor ** 2 +
                    // @ts-expect-error
                    this.lastCamVel * (1 - this.followFactor) ** 2;
                // @ts-expect-error
                this.lastCamVel = newCamera - this.lastCamera;
                this.lastCamera = newCamera;
                return newCamera;
            case 1 /* CameraModes.LINEAR */:
                // @ts-expect-error
                newCamera = this.centre * this.followFactor +
                    // @ts-expect-error
                    this.lastCamera * (1 - this.followFactor);
                // @ts-expect-error
                this.lastCamVel = newCamera - this.lastCamera;
                this.lastCamera = newCamera;
                return newCamera;
            case 0 /* CameraModes.STATIC */:
                return this.centre;
        }
    }
}
/**
 * This is not ECS, I'm not good enough to understand ECS.
*/
class ColonyManager {
    constructor(object = {}, length, width) {
        this.length = length;
        this.width = width;
        this.colonies = object.colonies ??
            Array.from({ length: this.length }, (_) => []);
        // Everyone gangsta until a colony starts evolving
        this.gangsta = object.gangsta;
        this.ancestreeTask = object.ancestreeTask ??
            {
                start: 0
            };
        this.deriveTask = object.deriveTask ??
            {
                start: 0
            };
        this.calcTask = object.calcTask ??
            {
                start: 0
            };
        // Processed before regular gangsta
        this.actionQueue = new Queue(object.actionQueue);
        this.actionGangsta = object.actionGangsta;
        this.actionAncestreeTask = object.actionAncestreeTask ??
            {
                start: 0
            };
        this.actionDeriveTask = object.actionDeriveTask ??
            {
                start: 0
            };
        this.actionCalcTask = object.actionCalcTask ??
            {
                start: 0
            };
        // this.restTick = 0;
        this.spawnerStates = [];
    }
    toJSON() {
        return {
            colonies: this.colonies,
            gangsta: this.gangsta,
            ancestreeTask: this.ancestreeTask,
            deriveTask: this.deriveTask,
            calcTask: this.calcTask,
            actionQueue: this.actionQueue,
            actionGangsta: this.actionGangsta,
            actionAncestreeTask: this.actionAncestreeTask,
            actionDeriveTask: this.actionDeriveTask,
            actionCalcTask: this.actionCalcTask,
        };
    }
    get busy() {
        if (this.gangsta || this.actionGangsta)
            return true;
        return false;
    }
    water(colony) {
        if (!colony.wet) {
            let amount = BigNumber.from(Math.min(colony.sequence.length, waterScale * Math.max(colony.stage, 1)));
            // @ts-expect-error
            colony.energy += plantData[colony.id].growthCost * amount;
            colony.wet = true;
        }
    }
    reap(colony, multiplier = colony.profit) {
        if (multiplier.isZero)
            return;
        // @ts-expect-error
        currency.value += BigNumber.from(colony.population) * multiplier *
            // @ts-expect-error
            theory.publicationMultiplier;
    }
    registerSpawner(s) {
        let state = {
            spawner: s,
            index: binarySearchNext(s.schedule, days)
        };
        this.spawnerStates.push(state);
    }
    updateSpawners(day) {
        for (let i = 0; i < this.spawnerStates.length; ++i) {
            let sp = this.spawnerStates[i];
            while (day >= sp.spawner.schedule[sp.index]) {
                let plot = sp.spawner.plot();
                let pop = sp.spawner.population(sp.index);
                this.addColony(plot, sp.spawner.id, pop);
                ++sp.index;
            }
        }
    }
    linkParasites(plot) {
        for (let i = 0; i < this.colonies[plot].length; ++i) {
            let l = this.colonies[plot][i];
            if (plantData[l.id].parasite) {
                l.host = undefined;
                for (let j = 0; j < this.colonies[plot].length; ++j) {
                    let h = this.colonies[plot][j];
                    if (plantData[l.id].parasite.has(h.id)) {
                        l.host = j;
                        break;
                    }
                }
            }
        }
    }
    addColony(plot, id, population, parent = null) {
        if (!plantData[id])
            return;
        if (population <= 0)
            return;
        if (parent === null) {
            for (let i = 0; i < this.colonies[plot].length; ++i) {
                let groupCandidate = this.colonies[plot][i];
                if (groupCandidate.id == id && !groupCandidate.propagated &&
                    !groupCandidate.stage) {
                    groupCandidate.population += population;
                    theory.invalidateQuaternaryValues();
                    return;
                }
            }
        }
        if (this.colonies[plot].length >= this.width) {
            if (parent === null)
                plants[plot][id]?.refund?.(population);
            return;
        }
        let c = {
            id: id,
            population: population,
            propagated: parent === null ? false : true,
            sequence: plantData[id].system.axiom,
            params: plantData[id].system.axiomParams,
            stage: 0,
            narrationTrack: 0,
            wet: false,
            energy: BigNumber.ZERO,
            growth: BigNumber.ZERO,
            diReserve: BigNumber.ZERO,
            dgReserve: BigNumber.ZERO
        };
        if (plantData[id].dailyIncome)
            c.ddReserve = BigNumber.ZERO;
        if (plantData[id].propagation)
            c.propCnt = 0;
        let stats = this.calculateStats(c);
        c.synthRate = stats.synthRate;
        c.profit = stats.profit;
        // Insert colony into array
        if (parent === null)
            this.colonies[plot].push(c);
        else {
            // Inherit parent's reserve
            let p = this.colonies[parent[0]][parent[1]];
            // @ts-expect-error
            c.energy += p.diReserve * c.synthRate;
            // @ts-expect-error
            let maxdg = c.energy.min(p.dgReserve *
                // @ts-expect-error
                plantData[id].growthRate);
            // @ts-expect-error
            c.growth += maxdg;
            // @ts-expect-error
            c.energy -= maxdg;
            if (plantData[id].dailyIncome)
                c.ddReserve = p.ddReserve;
            // if(plot == parent[0])
            //     this.colonies[plot].splice(parent[1] + 1, 0, c);
            // else
            this.colonies[plot].push(c);
        }
        // Establish parasitic links
        this.linkParasites(plot);
        // Auto water
        if (autoWaterConfig[id]?.maxStage > c.stage)
            this.water(c);
        if (plot == plotIdx) {
            let prevColony = selectedColony;
            selectedColony = this.colonies[plotIdx][slotIdx[plotIdx]];
            if (prevColony !== selectedColony)
                renderer.colony = selectedColony;
        }
        theory.invalidateQuaternaryValues();
        updateAvailability();
    }
    killColony(plot, index, id) {
        let c = this.colonies[plot][index];
        if (!c)
            return;
        // Reset levels & unlock autowatering
        if (!c.propagated && plantUnlocks.includes(c.id)) {
            plants[plot][c.id].level -= Math.min(plants[plot][c.id].level, c.population);
            if (!autoWaterConfig[c.id]) {
                autoWaterConfig[c.id] =
                    {
                        maxStage: 0
                    };
            }
        }
        if (this.gangsta && plot == this.gangsta[0]) {
            if (this.gangsta[1] > index)
                --this.gangsta[1];
            else if (this.gangsta[1] == index) {
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
                this.gangsta = null;
            }
        }
        this.colonies[plot].splice(index, 1);
        // Re-establish parasitic links
        this.linkParasites(plot);
        let len = this.colonies[plot].length;
        if (len > 1) {
            let i = slotIdx[plot];
            do
                --slotIdx[plot];
            while (this.colonies[plot][slotIdx[plot]] &&
                !isColonyVisible(manager.colonies[plot][slotIdx[plot]]));
            if (slotIdx[plot] < 0)
                slotIdx[plot] = i;
        }
        if (plot == plotIdx) {
            selectedColony = this.colonies[plotIdx][slotIdx[plotIdx]];
            renderer.colony = selectedColony;
        }
        updateAvailability();
    }
    growAll(di, dg, dd) {
        if (this.actionGangsta)
            this.performAction();
        else if (this.actionQueue.length) {
            let action = this.actionQueue.dequeue();
            this.queueAction(...action);
        }
        else if (this.gangsta)
            this.evolve();
        perfs[1 /* Profilers.MANAGER */].exec(() => {
            for (let i = 0; i < this.colonies.length; ++i) {
                for (let j = 0; j < this.colonies[i].length; ++j) {
                    let c = this.colonies[i][j];
                    let notMature = c.stage < (plantData[c.id].maxStage ??
                        INT_MAX);
                    // @ts-expect-error
                    if (notMature && c.growth >= plantData[c.id].growthCost *
                        // @ts-expect-error
                        BigNumber.from(c.sequence.length) &&
                        (c.wet || !plantData[c.id].requiresWater)) {
                        if (!this.gangsta)
                            this.gangsta = [i, j];
                        // @ts-expect-error
                        c.diReserve += di;
                        // @ts-expect-error
                        c.dgReserve += dg;
                        if (plantData[c.id].dailyIncome) {
                            // @ts-expect-error
                            c.ddReserve += dd;
                        }
                    }
                    else if (this.actionGangsta && this.actionGangsta[0] == i &&
                        this.actionGangsta[1] == j) {
                        // @ts-expect-error
                        c.diReserve += di;
                        // @ts-expect-error
                        c.dgReserve += dg;
                        if (plantData[c.id].dailyIncome) {
                            // @ts-expect-error
                            c.ddReserve += dd;
                        }
                    }
                    else // Normal growth
                     {
                        // @ts-expect-error
                        c.energy += di * c.synthRate;
                        if (plantData[c.id].parasite &&
                            typeof c.host !== 'undefined') {
                            let h = this.colonies[i][c.host];
                            // @ts-expect-error
                            let hEnrg = h.energy * BigNumber.from(h.population);
                            // Leech rates = hardcoded: 1st param of 1st symbol
                            // @ts-expect-error
                            let maxde = hEnrg.min(dg * c.params[0][0] *
                                // @ts-expect-error
                                BigNumber.from(c.population));
                            // @ts-expect-error
                            h.energy -= maxde / h.population;
                            // @ts-expect-error
                            c.energy += maxde / c.population;
                        }
                        if (notMature) {
                            // @ts-expect-error
                            let maxdg = c.energy.min(dg *
                                // @ts-expect-error
                                plantData[c.id].growthRate);
                            // @ts-expect-error
                            c.growth += maxdg;
                            // @ts-expect-error
                            c.energy -= maxdg;
                        }
                        if (plantData[c.id].dailyIncome) {
                            // @ts-expect-error
                            this.reap(c, dd + c.ddReserve);
                            c.ddReserve = BigNumber.ZERO;
                        }
                    }
                }
            }
        });
    }
    calculateStats(colony, task = {}, dTask = {}) {
        // This is the only case where the colony needed
        let harvestable = plantData[colony.id].actions[0 /* Actions.HARVEST */].symbols;
        let synthRate = task.synthRate ?? BigNumber.ZERO;
        let profit = task.profit ?? BigNumber.ZERO;
        let sequence = dTask.derivation ?? colony.sequence;
        let params = dTask.parameters ?? colony.params;
        let i = task.start ?? 0;
        for (; i < sequence.length; ++i) {
            if (i - task.start > MAX_CHARS_PER_TICK * 2) {
                return {
                    start: i,
                    synthRate: synthRate,
                    profit: profit
                };
            }
            if (SYNTHABLE_SYMBOLS.has(sequence[i]) && params[i])
                synthRate += params[i][0];
            if (harvestable?.has(sequence[i]) && params[i])
                profit += params[i][0];
        }
        return {
            start: 0,
            synthRate: synthRate,
            profit: profit
        };
    }
    performAction() {
        let c = this.colonies[this.actionGangsta[0]][this.actionGangsta[1]];
        let id = this.actionGangsta[2];
        if (!c) {
            this.actionGangsta = null;
            return;
        }
        if (!plantData[c.id].actions[id].system) {
            if (id == 0)
                this.reap(c);
            this.killColony(...this.actionGangsta);
            this.actionGangsta = null;
            theory.invalidateSecondaryEquation();
            theory.invalidateQuaternaryValues();
            return;
        }
        // ancestree, derive and calc stats
        if (!('ancestors' in this.actionAncestreeTask) ||
            this.actionAncestreeTask.start) {
            let customAncestreeSystem = plantData[c.id].actions[id].system ??
                plantData[c.id].system;
            perfs[2 /* Profilers.LS_ANCESTREE */].exec(() => {
                this.actionAncestreeTask = customAncestreeSystem.getAncestree(c.sequence, this.actionAncestreeTask);
            });
            return;
        }
        if (!('derivation' in this.actionDeriveTask) ||
            this.actionDeriveTask.start) {
            perfs[3 /* Profilers.LS_DERIVE */].exec(() => {
                this.actionDeriveTask = plantData[c.id].actions[id].system.
                    derive(c.sequence, c.params, this.actionAncestreeTask.ancestors, this.actionAncestreeTask.children, this.actionDeriveTask);
            });
            return;
        }
        if (!this.actionDeriveTask.derivation.length) {
            if (id == 0)
                this.reap(c);
            this.killColony(...this.actionGangsta);
            this.actionAncestreeTask =
                {
                    start: 0
                };
            this.actionDeriveTask =
                {
                    start: 0
                };
            this.actionGangsta = null;
            theory.invalidateSecondaryEquation();
            theory.invalidateQuaternaryValues();
            return;
        }
        if (!('synthRate' in this.actionCalcTask) || this.actionCalcTask.start) {
            perfs[4 /* Profilers.LS_CALC_STATS */].exec(() => {
                this.actionCalcTask = this.calculateStats(c, this.actionCalcTask, this.actionDeriveTask);
            });
            return;
        }
        if (id == 0) // Harvest specific
            // @ts-expect-error
            this.reap(c, c.profit - this.actionCalcTask.profit);
        // Assign new stats
        c.synthRate = this.actionCalcTask.synthRate;
        c.profit = this.actionCalcTask.profit;
        c.sequence = this.actionDeriveTask.derivation;
        c.params = this.actionDeriveTask.parameters;
        let notMature = c.stage < (plantData[c.id].maxStage ?? INT_MAX);
        // Empty reserves
        // @ts-expect-error
        c.energy += c.diReserve * c.synthRate;
        if (plantData[c.id].parasite &&
            typeof c.host !== 'undefined') {
            let h = this.colonies[this.actionGangsta[0]][c.host];
            // @ts-expect-error
            let hEnrg = h.energy * BigNumber.from(h.population);
            // Leech rates = hardcoded: 1st param of 1st symbol
            // @ts-expect-error
            let maxde = hEnrg.min(c.dgReserve * c.params[0][0] *
                // @ts-expect-error
                BigNumber.from(c.population));
            // @ts-expect-error
            h.energy -= maxde / h.population;
            // @ts-expect-error
            c.energy += maxde / c.population;
        }
        if (notMature) {
            // @ts-expect-error
            let maxdg = c.energy.min(c.dgReserve * plantData[c.id].growthRate);
            // @ts-expect-error
            c.growth += maxdg;
            // @ts-expect-error
            c.energy -= maxdg;
        }
        c.diReserve = BigNumber.ZERO;
        c.dgReserve = BigNumber.ZERO;
        c.wet = false;
        // Change narrative track if possible
        let trackSwitch = plantData[c.id].actions[id].switchNarration;
        if (trackSwitch)
            c.narrationTrack = trackSwitch(c.stage, c.narrationTrack);
        this.actionAncestreeTask =
            {
                start: 0
            };
        this.actionDeriveTask =
            {
                start: 0
            };
        this.actionCalcTask =
            {
                start: 0
            };
        // Roll back transaction!
        if (this.gangsta && this.gangsta[0] == this.actionGangsta[0] &&
            this.gangsta[1] == this.actionGangsta[1]) {
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
        if (this.actionGangsta[0] == plotIdx &&
            this.actionGangsta[1] == slotIdx[plotIdx])
            renderer.colony = c;
        this.actionGangsta = null;
        theory.invalidateSecondaryEquation();
        theory.invalidateQuaternaryValues();
    }
    queueAction(plot, index, id) {
        let c = this.colonies[plot][index];
        if (!c || !plantData[c.id].actions[id])
            return;
        let action = [plot, index, id];
        if (this.actionGangsta) {
            this.actionQueue.enqueue(action);
            return;
        }
        this.actionGangsta = action;
    }
    findVacantPlot(plot, priority) {
        let start = Math.max(0, plot - 1);
        let end = Math.min(plot + 1, this.length - 1);
        for (let i = 0; i < priority.length; ++i) {
            switch (priority[i]) {
                case 'c':
                    if (this.colonies[plot].length < this.width)
                        return plot;
                    break;
                case 'l':
                    if (plot > 0 && this.colonies[plot - 1].length < this.width)
                        return plot - 1;
                    break;
                case 'r':
                    if (plot < this.length - 1 &&
                        this.colonies[plot + 1].length < this.width)
                        return plot + 1;
                    break;
                case 'm':
                    let minSize = this.width;
                    let minPlot = null;
                    for (let i = start; i <= end; ++i) {
                        if (this.colonies[i].length < minSize) {
                            minSize = this.colonies[i].length;
                            minPlot = i;
                        }
                    }
                    return minPlot;
                case 'M':
                    let maxSize = 0;
                    let maxPlot = null;
                    for (let i = start; i <= end; ++i) {
                        let cl = this.colonies[i].length;
                        if (cl > maxSize && cl < this.width) {
                            maxSize = cl;
                            maxPlot = i;
                        }
                    }
                    return maxPlot;
            }
        }
        return null;
    }
    evolve() {
        let c = this.colonies[this.gangsta[0]][this.gangsta[1]];
        if (!c) {
            this.gangsta = null;
            return;
        }
        // Ancestree, derive and calc stats
        if (!('ancestors' in this.ancestreeTask) || this.ancestreeTask.start) {
            perfs[2 /* Profilers.LS_ANCESTREE */].exec(() => {
                this.ancestreeTask = plantData[c.id].system.getAncestree(c.sequence, this.ancestreeTask);
            });
            return;
        }
        if (!('derivation' in this.deriveTask) || this.deriveTask.start) {
            perfs[3 /* Profilers.LS_DERIVE */].exec(() => {
                this.deriveTask = plantData[c.id].system.derive(c.sequence, c.params, this.ancestreeTask.ancestors, this.ancestreeTask.children, this.deriveTask);
            });
            return;
        }
        if (!this.deriveTask.derivation.length) {
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
        if (!('synthRate' in this.calcTask) || this.calcTask.start) {
            perfs[4 /* Profilers.LS_CALC_STATS */].exec(() => {
                this.calcTask = this.calculateStats(c, this.calcTask, this.deriveTask);
            });
            return;
        }
        // Adjust stats according to reserves
        // @ts-expect-error
        c.growth -= plantData[c.id].growthCost *
            // @ts-expect-error
            BigNumber.from(c.sequence.length);
        // if(!c.synthRate.isZero)
        // {
        //     // @ts-expect-error
        //     c.diReserve += c.growth / c.synthRate;
        //     // @ts-expect-error
        //     c.energy -= c.growth;
        // }
        // Assign new stage's stats
        c.sequence = this.deriveTask.derivation;
        c.params = this.deriveTask.parameters;
        c.synthRate = this.calcTask.synthRate;
        if (plantData[c.id].stagelyIncome)
            // @ts-expect-error
            this.reap(c, plantData[c.id].stagelyIncome * c.profit);
        c.profit = this.calcTask.profit;
        ++c.stage;
        let maxStage = plantData[c.id].maxStage ?? INT_MAX;
        let notMature = c.stage < maxStage;
        // Empty reserves
        // @ts-expect-error
        c.energy += c.diReserve * c.synthRate;
        if (plantData[c.id].parasite &&
            typeof c.host !== 'undefined') {
            let h = this.colonies[this.gangsta[0]][c.host];
            // @ts-expect-error
            let hEnrg = h.energy * BigNumber.from(h.population);
            // Leech rates = hardcoded: 1st param of 1st symbol
            // @ts-expect-error
            let maxde = hEnrg.min(c.dgReserve * c.params[0][0] *
                // @ts-expect-error
                BigNumber.from(c.population));
            // @ts-expect-error
            h.energy -= maxde / h.population;
            // @ts-expect-error
            c.energy += maxde / c.population;
        }
        if (notMature) {
            // @ts-expect-error
            let maxdg = c.energy.min(c.dgReserve * plantData[c.id].growthRate);
            // @ts-expect-error
            c.growth += maxdg;
            // @ts-expect-error
            c.energy -= maxdg;
        }
        c.wet = false;
        // Auto water
        if (autoWaterConfig[c.id]?.maxStage > c.stage)
            this.water(c);
        // Propagate
        let prop = plantData[c.id].propagation;
        if (prop && c.stage == prop.stage[c.propCnt]) {
            let pop = Math.round(c.population * prop.rate[c.propCnt]);
            let target = this.findVacantPlot(this.gangsta[0], prop.priority);
            if (target !== null)
                this.addColony(target, prop.id ?? c.id, pop, this.gangsta);
            ++c.propCnt;
        }
        c.diReserve = BigNumber.ZERO;
        c.dgReserve = BigNumber.ZERO;
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
        if (this.gangsta[0] == plotIdx && this.gangsta[1] == slotIdx[plotIdx])
            renderer.colony = c;
        this.gangsta = null;
        theory.invalidateSecondaryEquation();
        theory.invalidateQuaternaryValues();
        // this.restTick = 5;
    }
}
class Book {
    constructor(title, key, pages) {
        this.title = title;
        this.key = key;
        this.pages = pages;
        this.tableofContents = [];
        this.pageLookup = {};
        for (let i = 0; i < pages.length; ++i) {
            if (pages[i].pinned)
                this.tableofContents.push(i);
            if (pages[i].systemID)
                this.pageLookup[pages[i].systemID] = i;
        }
    }
}
const almanac = new Book(getLoc('almanacTitle'), 'almanac', [
    {
        ...getLoc('almanac').cover,
        horizontalAlignment: TextAlignment.CENTER
    },
    {
        ...getLoc('almanac').prep,
        pinned: true
    },
    {
        ...getLoc('almanac').dayCycle,
        pinned: true
    },
    {
        ...getLoc('almanac').herbaceous,
        pinned: true
    },
    {
        ...getLoc('almanac').calendula,
        systemID: 'calendula',
        source: 'https://www.tasteofyummy.com/calendula-bread-for-bread-lovers/',
    },
    {
        ...getLoc('almanac').basil,
        systemID: 'basil'
    },
    {
        ...getLoc('almanac').campion,
        systemID: 'campion'
    },
]);
const LsManual = new Book(getLoc('manualTitle'), 'manual', [
    {
        ...getLoc('manual').cover,
        horizontalAlignment: TextAlignment.CENTER
    },
    {
        ...getLoc('manual').intro,
        pinned: true
    },
    {
        ...getLoc('manual').context,
        pinned: true
    },
    {
        ...getLoc('manual').parametric,
        pinned: true
    },
    {
        ...getLoc('manual').symbols,
        pinned: true
    },
    {
        ...getLoc('manual').turtleSymbols,
        pinned: true
    },
    // getLoc('manual').note,
]);
// Balance parameters
const dayLength = 120;
const halfDayLength = dayLength / 2;
const quarterDayLength = halfDayLength / 2;
const hourLength = dayLength / 24;
const nofPlots = 6;
const maxColoniesPerPlot = 4;
const waterScale = 1 / 2;
const plotCosts = new FirstFreeCost(new ExponentialCost(500, Math.log2(80)));
const plantUnlocks = ['sprout', 'calendula', 'basil', 'campion'];
const plantUnlockCosts = new CompositeCost(1, new ConstantCost(1), new CompositeCost(1, new ConstantCost(1500), new ConstantCost(60000)));
const permaCosts = [
    BigNumber.from(18),
    BigNumber.from(2100),
    BigNumber.from(1e45)
];
const taxRate = BigNumber.from(.12);
const tauRate = BigNumber.ONE;
const pubCoef = BigNumber.from(2 / 3);
// @ts-expect-error
const pubExp = BigNumber.from(.15) / tauRate;
// @ts-expect-error
var getPublicationMultiplier = (tau) => pubCoef *
    // @ts-expect-error
    tau.max(BigNumber.ONE).pow(pubExp *
        // @ts-expect-error
        (BigNumber.TWO * (tau + BigNumber.ONE).log() + BigNumber.ONE).log());
var getPublicationMultiplierFormula = (symbol) => `\\frac{2}{3}\\times
{${symbol}}^{${pubExp.toString(2)}\\times h},\\quad
h=\\ln{(2\\ln{(${symbol}+1)}+1)}`;
const plantData = {
    sprout: {
        cost: new FirstFreeCost(new ExponentialCost(0.25, 1)),
        system: new LSystem('\\A(0.02, 3)', [
            'A(r, t): t>0 = A(r+0.02, t-1)',
            'A(r, t) = F(0.05)[-&L(0.02)][-^L(0.02)]/(137.508)A(r, 3)',
            'F(p): p<FMaxSize = F(p+0.05)',
            'L(r): r<LMaxSize = L(r+0.02)'
        ], 45, 0, 'A', '+-&^/\\T', 0, {
            'FMaxSize': '0.25',
            'LMaxSize': '0.1'
        }, [
            '~> L(s) = {F(s/4)T(4*s)[\\(90-480*s)&F(s/6).&(30)F(s/3).^(60)F(s/3).^(30)F(s/3).^(30)F(s/3).^(30)F(s/6).][F(s)..].[/(90-480*s)^F(s/6).^(30)F(s/3).&(60)F(s/3).&(30)F(s/3).&(30)F(s/3).&(30)F(s/6).][F(s)..]}',
        ]),
        maxStage: 12,
        requiresWater: true,
        growthRate: BigNumber.from(0.3),
        growthCost: BigNumber.from(0.6),
        actions: [
            {
                symbols: new Set('F')
            }
        ],
        camera: (stage) => {
            return {
                scale: 1,
                x: 0,
                y: 0.625,
                z: 0,
                upright: true
            };
        },
        stroke: (stage) => {
            return {
                tickLength: 1,
            };
        }
    },
    calendula: {
        cost: new ExponentialCost(1, Math.log2(3)),
        system: new LSystem('-(3)A(0.06, 4)', [
            'A(r, t): t<=0 && r>=AThreshold = F(0.78, 2.1)K(0)',
            'A(r, t): r>=AThreshold = [&A(r-0.15, 2)][^I(3)]',
            'A(r, t): t>0 = A(r+0.06, t-1)',
            'A(r, t) = F(0.12, 0.6)T[-L(0.06, LMaxSize)]/(180)[-L(0.06, LMaxSize)]/(90)A(r, 4)',
            'I(t): t>0 = F(0.24, 0.84)T[-L(0.06, LMaxSize/3)]/(137.508)I(t-1)',
            'I(t) = F(0.48, 1.44)K(0)',
            'K(p): p<KMaxSize = K(p+0.25)',
            'L(r, lim): r<lim = L(r+0.02, lim)',
            'F(l, lim): l<lim = F(l+0.12, lim)'
        ], 15, 0, 'AI', '', -0.2, {
            'AThreshold': '0.96',
            'KMaxSize': '3',
            'LMaxSize': '0.68'
        }, [
            '~> K(p): p<1 = {[w(p/5, 42)w(p/5, 42)w(p/5, 42)w(p/5, 42)w(p/5, 42)w(p/5, 42)w(p/5, 42)w(p/5, 42)]F(p/10+0.1)[k(p*0.225, p*18)k(p*0.225, p*18)k(p*0.225, p*18-3)k(p*0.225, p*18-3)k(p*0.225, p*18-3)k(p*0.225, p*18-3)k(p*0.21, p*18-6)k(p*0.21, p*18-6)]}',
            '~> K(p): p<1.5 = {[w(0.2, 42)w(0.2, 42)w(0.2, 42)w(0.2, 42)w(0.2, 42)w(0.2, 42)w(0.2, 42)w(0.2, 42)]F(p/10+0.1)[k(p*0.225, p*18)k(p*0.225, p*18)k(p*0.225, p*18-3)k(p*0.225, p*18-3)k(p*0.225, p*18-3)k(p*0.225, p*18-3)k(p*0.21, p*18-6)k(p*0.21, p*18-6)k(p*0.21, p*18-6)k(p*0.2, p*18-6)k(p*0.21, p*18-6)k(p*0.21, p*18-9)k(p*0.2, p*18-15)][o(p*0.2252, p*17.5)]}',
            '~> K(p) = {[w(0.25, 42)w(0.25, 42)w(0.25, 42)w(0.25, 42)w(0.25, 42)w(0.25, 42)w(0.25, 42)w(0.25, 42)]F(p/10+0.1)[k(1.5*0.225, p*18)k(1.5*0.225, p*18)k(1.5*0.225, p*18-3)k(1.5*0.225, p*18-3)k(1.5*0.225, p*18-3)k(1.5*0.225, p*18-3)k(1.5*0.21, p*18-6)k(1.5*0.21, p*18-6)k(1.5*0.21, p*18-6)k(1.5*0.2, p*18-6)k(1.5*0.21, p*18-6)k(1.5*0.21, p*18-9)k(1.5*0.2, p*18-15)k(1.5*0.2, p*18-15)k(1.5*0.2, p*18-15)k(1.5*0.2, p*18-18)k(1.5*0.2, p*18-18)k(1.5*0.2, p*18-18)k(1.5*0.2, p*18-18)k(1.5*0.2, p*18-18)k(1.5*0.21, p*18-15)][o(1.5/4, p*22.5)o(1.5*0.22, p*17.5)o(1.5*0.18, p*10)]}',
            '~> w(p, a): p<0.1 = [--(a)F(0.2).+++(a)F(0.2).^+(a)F(0.2).]/[--(a)F(0.2)+++(a)F(0.2).^+(a)F(0.2).]/[--(a)F(0.2)+++(a)F(0.2).^+(a)F(0.2).]/[--(a)F(0.2)[+++(a)F(0.2).].]',
            '~> w(p, a): p<0.2 = [--(a)F(0.2).+++F(0.2).^+F(0.2).]/[--(a)F(0.2)+++F(0.2).^+F(0.2).]/[--(a)F(0.2)+++F(0.2).^+F(0.2).]/[--(a)F(0.2)[+++F(0.2).].]',
            '~> w(p, a): p<0.25 = [--(a)F(p).++F(p).^F(p).]/[--(a)F(p)++F(p).^F(p).]/[--(a)F(p)++F(p).^F(p).]/[--(a)F(p)[++F(p).].]',
            '~> w(p, a) = [--(a)F(p).++F(p).^-F(p).]/[--(a)F(p)++F(p).^-F(p).]/[--(a)F(p)++F(p).^-F(p).]/[--(a)F(p)[++F(p).].]',
            '~> k(p, a): p<0.3 = [---(a)F(p/2).+^F(p*2).+&F(p).][---(a)F(p/2)[+&F(p*2)[+^F(p).].].]/(137.508)',
            '~> k(p, a) = [---(a)F(p/2).+^F(p*2).&F(p).][---(a)F(p/2)[+&F(p*2)[^F(p).].].]/(137.508)',
            '~> o(p, a) = [-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]//[-(a)F(p).]',
            '~> L(p, lim): p<=LMaxSize/4 = {T(4*p^2)[&F(p).F(p).&-F(p).^^-F(p).^F(p).][F(p)[-F(p)[F(p)[-F(p)[F(p)[-F(p).].].].].].].[^F(p).F(p).^-F(p).&&-F(p).&F(p).][F(p)[-F(p)[F(p)[-F(p)[F(p)[-F(p).].].].].].]}',
            '~> L(p, lim): p<=LMaxSize/3 = {T(4*p^2)[&F(p).F(p).&-F(p).^^-F(p).^-F(p).][F(p)[-F(p)[F(p)[-F(p)[-F(p)..].].].].].[^F(p).F(p).^-F(p).&&-F(p).&-F(p).][F(p)[-F(p)[F(p)[-F(p)[-F(p)..].].].].]}',
            '~> L(p, lim) = {T(4*p^2)[&F(p).F(p).&-F(p).^^-F(p).^--F(p).][F(p)[-F(p)[F(p)[-F(p)[--F(p)..].].].].].[^F(p).F(p).^-F(p).&&-F(p).&--F(p).][F(p)[-F(p)[F(p)[-F(p)[--F(p)..].].].].]}'
        ]),
        maxStage: 40,
        requiresWater: true,
        growthRate: BigNumber.from(1.5),
        growthCost: BigNumber.from(2.5),
        propagation: {
            stage: [40],
            rate: [1 / 3],
            priority: 'c'
        },
        actions: [
            {
                symbols: new Set('K'),
                // No system means kill
            }
            // No prune
        ],
        decimals: {
            'A': [2, 0],
            'F': [2, 2],
            'I': [0],
            'K': [2],
            'L': [2, 2],
            '-': [0],
            '/': [1]
        },
        camera: (stage) => {
            return {
                scale: 6,
                x: 0,
                y: saturate(stage / 4, 3.75, 5),
                z: 0,
                upright: true
            };
        },
        stroke: (stage) => {
            return {
                tickLength: 1,
            };
        }
    },
    basil: {
        cost: new ExponentialCost(2.5, 1),
        system: new LSystem('/(90)BA(0.06, 5)', [
            'A(r, t): r>=AThreshold = S(0)F(0.24, 0.96)K(0.02, 8)',
            'A(r, t): t>0 = A(r+0.06, t-1)',
            'A(r, t) = F(0.12, 1.44)[&[I(5)]T(0.2)L(0.06, min(r+0.12, LMaxSize), 0)]/(180)[&L(0.06, min(r+0.12, LMaxSize), 0)]/(90)A(r-0.06, 3)',
            'S(type) < I(t): type>=1 = S(type)',
            'I(t): t>0 = I(t-1)',
            'I(t) = /(90)F(0.12, 0.72)T[&L(0.03, LMaxSize/2, 0)]/(180)[&L(0.03, LMaxSize/2, 0)]I(11)',
            'K(s, t): t>0 = K(s+0.02, 0)/(90)F(0.12, 0.72)K(0.02, t-1)',
            'K(s, t): s<KMaxSize = K(s+0.02, t)',
            'L(p, lim, s): s<1 && p<lim = L(p+0.03, lim, s)',
            'S(type) < L(p, lim, s): s<1 = L(p, p, 1)',
            'L(p, lim, s): s>=1 && p>0.06 = L(p-0.06, lim, s)',
            'F(l, lim) > S(type): type<=0 = S(type)F(l, lim)',
            'S(type) < F(l, lim): type>=1 = F(l, lim)S(type)',
            'S(type) =',
            'B > S(type): type<=0 = BS(1)',
            'F(l, lim): l<lim = F(l+0.12, lim)'
        ], 30, 0, 'BASIL', '+-&^/\\T', -0.16, {
            'AThreshold': '0.96',
            'LMaxSize': '0.6',
            'KMaxSize': '0.3'
        }, [
            '~> K(t) = {[k(min(0.6, t*4))//k(min(0.6, t*4))//k(min(0.6, t*4))//k(min(0.6, t*4))//k(min(0.6, t*4))//k(min(0.6, t*4))]}',
            '~> k(size): size<0.36 = [+++&F(size/2).[^^--F(size/2).]][+++^F(size/2).]',
            '~> k(size): size<0.48 = [++F(size/3).++[&F(size/3).][--F(size/3)[+F(size/6).].].[^F(size/3).][--F(size/3)[+F(size/6).].].[--&F(size/3).^^-F(size/3).][--^F(size/3).].]',
            '~> k(size) = [++F(size/3).++[&F(size/3).&F(size/4).][--F(size/3)[-F(size/6).].]..[^F(size/3).^F(size/4).][--F(size/3)[-F(size/6).].]..[-F(size/2).]..[F(size/3).-F(size/3).].]',
            '~> L(p, lim, s): s<1 = {T(p*0.9)F(sqrt(p)).[-(48)F(p).+F(p).+&F(p).+F(p).][F(p)[&F(p)[F(p)[^F(p).].].].].[+(48)F(p).-F(p).-&F(p).-F(p).][F(p)[&F(p)[F(p)[^F(p).].].].]}',
            '~> L(p, lim, s) = {T(lim*1.2)F(sqrt(lim)).[--F(lim).+&F(lim).+&F(lim).+F(lim)..][F(lim)[&F(lim)[&F(lim)[&F(lim).].].].].[++F(lim).-&F(lim).-&F(lim).-F(lim)..][F(lim)[&F(lim)[&F(lim)[&F(lim).].].].]}'
        ]),
        maxStage: 50,
        requiresWater: true,
        growthRate: BigNumber.TWO,
        growthCost: BigNumber.TWO,
        actions: [
            {
                symbols: new Set('KL'),
                // No system means kill
            },
            {
                system: new LSystem('', [
                    'F(l, lim) > K(s, t) =',
                    'K(s, t) < /(a) =',
                    'K(s, t) =',
                    'A(r, t) ='
                ], 30, 0, '', ''),
                switchNarration: (stage, track) => {
                    if (track)
                        return track;
                    if (stage >= 26)
                        return 0; // normal track
                    if (stage >= 22)
                        return 1; // well pruned
                    return 2; // poorly pruned
                }
            }
        ],
        decimals: {
            'A': [2, 0],
            'B': null,
            'F': [2, 2],
            'I': [0],
            'K': [2, 0],
            'L': [2, 2, 0],
            'S': [0],
            '/': [0]
        },
        camera: (stage) => {
            return {
                scale: 8,
                x: 0,
                y: saturate(stage / 4, 5, 7),
                z: 0,
                upright: true
            };
        },
        stroke: (stage) => {
            return {
                tickLength: 1
            };
        }
    },
    campion: {
        cost: new ExponentialCost(2000, Math.log2(5)),
        system: new LSystem('/(45)&(5)A(0.1, 5)', [
            'A(r, t): t>0 = A(r+0.05, t-1)',
            'A(r, t) = F(0.4, 20)T[&L(0.025)][/(180)&L(0.025)][F(0.4, 10)K(0.125, 0)][^$A(r-0.2, 7)][&$A(r-0.1, 3)]',
            'K(p, t): t<2 = K(p*1.1, t+1)',
            'K(p, t): t<3 = K(0.1875, t+1)',
            'K(p, t): t<12 = K(1.35*p-0.8*p^2, t+1)',
            'K(p, t) = O(1)',
            'L(s): s<LMaxSize = L(s+0.025)',
            'O(s): s>0.5 = O(s*0.9)',
            'O(s) =',
            'F(l, t): t>0 = F(l+0.4, t-1)'
        ], 31, 0, 'A', '', -0.6, {
            'LMaxSize': '0.625'
        }, [
            '~> b(s) = -[^-F(s).][--F(s*2)..][&-F(s).]+^(72)',
            '~> c(s) = +F(s).-F(s).-F(s).+',
            '~> K(p, t): t<3 = {[+(90)b(p*4)b(p*4)b(p*4)b(p*4)b(p*4)]}',
            '~> K(p, t) = {[c(p*2)-(p*200)k(6*p^2+0.4*p+0.1)]/(72)[c(p*2)-(p*200)k(6*p^2+0.4*p+0.1)]/(72)[c(p*2)-(p*200)k(6*p^2+0.4*p+0.1)]/(72)[c(p*2)-(p*200)k(6*p^2+0.4*p+0.1)]/(72)[c(p*2)-(p*200)k(6*p^2+0.4*p+0.1)]}',
            '~> k(s) = [^(40)F(s/2).&(10)F(s/2).&F(s/4).][F(s/2)-(10)F(s).][&(40)F(s/2)[^(10)F(s/2)[^F(s/4).].].].',
            '~> L(s) = {T(s*0.5)F(sqrt(s)).[-(48)F(s*2).+F(s*2).+&F(s*2).+F(s*2).][F(s*2)[&F(s*2)[F(s*2)[^F(s*2).].].].].[+(48)F(s*2).-F(s*2).-&F(s*2).-F(s*2).][F(s*2)[&F(s*2)[F(s*2)[^F(s*2).].].].]}',
            '~> O(s) = {[+(10)c(s).[-(75)F(s).].]./(72)[+(10)c(s).[-(75)F(s).].]./(72)[+(10)c(s).[-(75)F(s).].]./(72)[+(10)c(s).[-(75)F(s).].]./(72)[+(10)c(s).[-(75)F(s).].].}'
        ]),
        maxStage: 29,
        requiresWater: true,
        growthRate: BigNumber.from(2.75),
        growthCost: BigNumber.TEN,
        stagelyIncome: BigNumber.ONE,
        propagation: {
            stage: [27],
            rate: [1 / 2],
            priority: 'c'
        },
        actions: [
            {
                symbols: new Set('K')
            }
        ],
        decimals: {
            'A': [2, 0],
            'F': [1, 0],
            'K': [3, 0],
            'L': [3],
            'O': [3],
            '&': [0],
            '/': [0]
        },
        camera: (stage) => {
            return {
                scale: 12,
                x: 0,
                y: saturate(stage, 7.5, 22.5),
                z: 0,
                upright: true
            };
        },
        stroke: (stage) => {
            return {
                tickLength: 1
            };
        }
    },
    // ginger
    // sunflower
    hopleek: {
        system: new LSystem('B(0.05)', ['A(r) = FA(r)', 'B(r) = B(r+0.05)']),
        maxStage: 20,
        parasite: new Set(['sprout', 'basil']),
        requiresWater: false,
        growthRate: BigNumber.FIVE,
        growthCost: BigNumber.TWO,
        actions: [
            {}
        ],
        camera: (stage) => {
            return {
                scale: 8,
                x: 0,
                y: saturate(stage / 4, 5, 9),
                z: 0,
                upright: true
            };
        },
        stroke: (stage) => {
            return {
                tickLength: 1
            };
        }
    },
    broomrape: {
        system: new LSystem('B(0.05, timer)', [
            // Invisibility regenerates when the shoots go up
            'B(r, t) > F(l, lim): t<timer = B(1.15*r-0.003*r^2, t+2)',
            // Cheekily goes back to hiding
            'B(r, t) > F(l, lim) = B(0.05, t)%',
            'B(r, t): t>0 = B(1.15*r-0.003*r^2, t-1)',
            'B(r, t) = B(r, t)F(0.15, 0.9)I(12)',
            'I(t): t>0 = F(0.05, 0.3)[-K(0)]/(137.508)I(t-1)',
            'K(s): s<KMaxSize = K(s+0.5)',
            'K(s) = O(0.2)',
            'O(s): s>OMinSize = O(s-0.05)',
            'F(l, lim): l<lim = F(l+0.05, lim)',
        ], 30, 0, 'B', '+-&^/\\T', 0, {
            'timer': '30',
            'KMaxSize': '4.5',
            'OMinSize': '0.05 - 1e-9'
        }, [
            // Stem
            '~> I(t) = F(0.15)[aaaa]',
            '~> a = {[-F(0.15).+(45)F(0.15).][F(0.4).][+F(0.15)[-(45)F(0.15).].]}/(90)',
            // Flower lips: down, up, left, right
            '~> K(s) = {[T((s-2)/10)F(0.05)d(sqrt(s+0.5)/20)u(sqrt(s+0.5)/20)l(sqrt(s+0.5)/20)r(sqrt(s+0.5)/20)]}',
            '~> d(s) = [-(45)F(s).+[&(45)F(s).^(45)F(s*2).-F(s*3)..][F(s*3)-F(s*2).][^(45)F(s)[&(45)F(s*2)[-F(s*3)..].].].]',
            '~> u(s) = [+F(s*1.5).-[&(45)F(s).^(45)F(s*2).-(45)F(s*4)..][F(s*3)-(45)F(s*3).][^(45)F(s)[&(45)F(s*2)[-(45)F(s*4)..].].].]',
            '~> l(s) = [-(15)&(45)F(s).^(45)[-(45)F(s).+(45)F(s*3).-&(15)F(s*2)..][F(s*3)&F(s*2).][+(45)F(s*2)[-(45)F(s*2)[-&(15)F(s*3)..].].].]',
            '~> r(s) = [-(15)^(45)F(s).&(45)[-(45)F(s).+(45)F(s*3).-^(15)F(s*2)..][F(s*3)^F(s*2).][+(45)F(s*2)[-(45)F(s*2)[-^(15)F(s*3)..].].].]',
            '~> O(s) = T((2.5-s)/10)K(4.5)'
        ]),
        maxStage: 140,
        parasite: new Set(['sprout', 'calendula', 'sunflower', 'dandelion']),
        requiresWater: false,
        growthRate: BigNumber.from(12),
        growthCost: BigNumber.from(30),
        propagation: {
            stage: [48, 95],
            rate: [0.55, 0.55],
            priority: 'm'
        },
        actions: [
            {
                symbols: new Set('KF')
            }
        ],
        camera: (stage) => {
            let m = (stage - 1) % 47;
            m = Math.max(m - 30, 0);
            return {
                scale: 4,
                x: 0,
                y: 2.5 + m / 10,
                z: 0,
                upright: true
            };
        },
        stroke: (stage) => {
            return {
                tickLength: 1
            };
        }
    },
    dandelion: {
        system: new LSystem('B(0.05)', ['A(r) = FA(r)', 'B(r) = B(r+0.05)']),
        maxStage: 20,
        requiresWater: false,
        growthRate: BigNumber.FIVE,
        growthCost: BigNumber.TWO,
        actions: [
            {}
        ],
        camera: (stage) => {
            return {
                scale: 8,
                x: 0,
                y: saturate(stage / 4, 5, 9),
                z: 0,
                upright: true
            };
        },
        stroke: (stage) => {
            return {
                tickLength: 1
            };
        }
    },
    arrow: // Arrow weed (test)
    {
        cost: new FirstFreeCost(new ExponentialCost(1, 1)),
        system: new LSystem('A(1)', [
            'F(l)=F(l*2)',
            'A(t)=F(1)[+A(t/2)][-A(t/2)]F(1)A(t)'
        ], 30),
        requiresWater: true,
        growthRate: BigNumber.ONE,
        growthCost: BigNumber.from(45),
        actions: [
            {
                symbols: new Set('A')
            },
            {
                system: new LSystem('', ['F(l)='])
            }
        ],
        decimals: {
            'A': [3],
            'F': [0]
        },
        camera: (stage) => {
            return {
                scale: 2 ** stage,
                // cameraMode: 0,
                // followFactor: 0.15,
                x: 2 ** stage,
                y: 0,
                z: 0,
                upright: false
            };
        },
        stroke: (stage) => {
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
    },
    brasil: // Old basil
    {
        cost: new ExponentialCost(1, 1),
        system: new LSystem('BA(0.18, 0)', [
            'A(r, t): r>=flowerThreshold = K(0)',
            'A(r, t): t<3 = A(r+0.06, t+1)',
            'A(r, t) = F(0.12, 1.44)[+L(0.06, min(r+0.06, maxLeafSize), 0)]/(180)[+L(0.06, min(r+0.06, maxLeafSize), 0)]/(90)I(0)A(r+0.06, 0)',
            'I(t) > S(type): type<=0 = S(type)I(t)',
            'I(t): t<4 = I(t+1)',
            'I(t) = F(0.12, 0.36)[+L(0.03, maxLeafSize/2, 0)]/(180)[+L(0.03, maxLeafSize/2, 0)]',
            'K(t): t<=signalThreshold = S(0)/(90)[+K(1)][-K(1)]K(t+1)',
            'K(t): t-2 = K(t+1)',
            'K(t) = K(t+1)K(1)',
            'L(p, lim, s): s<1 && p<lim = L(p+0.03, lim, s)',
            'S(type) < L(p, lim, s): s<1 = L(p, p, 1)',
            'L(p, lim, s): s>=1 && p>0.06 = L(p-0.06, lim, s)',
            'F(l, lim) > S(type): type<=0 = S(type)F(l, lim)',
            'S(type) < F(l, lim): type>=1 = F(l, lim)S(type)',
            'S(type) =',
            'B > S(type): type<=0 = BS(1)',
            'F(l, lim): l<lim = F(l+0.12, lim)'
        ], 30, 0, 'BASIL', '+-&^/\\T', 1, {
            'flowerThreshold': '1.38',
            'maxLeafSize': '0.66',
            'signalThreshold': '0'
        }, [
            '~> K(t) = /(90)F(min(1.25, sqrt(t/4)))T(-0.2){[k(sqrt(min(1, t/8)))//k(sqrt(min(1, t/8)))//k(sqrt(min(1, t/8)))//k(sqrt(min(1, t/8)))//k(sqrt(min(1, t/8)))//k(sqrt(min(1, t/8)))//]}',
            '~> k(size): size<1 = [++F(size/2).[-F(size/2).].]',
            '~> k(size) = [++F(size/3).++[--F(size/2).][&F(size/2).].[^F(size/2).][--F(size/2).].[-F(size/2).].[F(size/2).].]',
            '~> L(p, lim, s): s<1 = {\\(90)T(p*0.8)F(sqrt(p)).[-(48)F(p).+F(p).+&F(p).+F(p).][F(p)[&F(p)[F(p)[^F(p).].].].].[+(48)F(p).-F(p).-&F(p).-F(p).][F(p)[&F(p)[F(p)[^F(p).].].].]}',
            '~> L(p, lim, s) = {\\(90)T(lim)F(sqrt(lim)).[--F(lim).+&F(lim).+&F(lim).+F(lim)..][F(lim)[&F(lim)[&F(lim)[&F(lim).].].].].[++F(lim).-&F(lim).-&F(lim).-F(lim)..][F(lim)[&F(lim)[&F(lim)[&F(lim).].].].]}'
        ]),
        maxStage: 54,
        requiresWater: false,
        growthRate: BigNumber.TWO,
        growthCost: BigNumber.THREE,
        actions: [
            {
                symbols: new Set('L')
            },
            {
                system: new LSystem('', ['K(t)=', 'A(r, t)='])
            }
        ],
        decimals: {
            'A': [2, 0],
            'B': null,
            'F': [2, 2],
            'I': [0],
            'K': [0],
            'L': [2, 2, 0],
            '/': [0]
        },
        camera: (stage) => {
            return {
                scale: 8,
                x: 0,
                y: saturate(stage / 4, 5, 9),
                z: 0,
                upright: true
            };
        },
        stroke: (stage) => {
            return {
                tickLength: 1
            };
        }
    },
};
const plantIDLookup = {
    sprout: 0,
    0: 'sprout',
    calendula: 1,
    1: 'calendula',
    basil: 2,
    2: 'basil',
    campion: 3,
    3: 'campion',
    rose: 3,
    arrow: 9001,
    9001: 'arrow',
    brasil: 9002,
    9002: 'brasil'
};
const speeds = [1, 5 / 4, 5 / 3, 5 / 2];
const speedAdjDayLengths = speeds.map(x => dayLength / x);
const clockMinDiv = [12, 15, 20, 30];
let haxEnabled = false;
let time = 0;
let lastSave = 0;
let days = 0;
let years = 0;
let insolationCoord = 0;
let growthCoord = 0;
let insolationIntegral = 0;
let growthIntegral = 0;
let plotIdx = 0;
let slotIdx = new Array(nofPlots).fill(0);
let plantIdx = new Array(nofPlots).fill(0);
let selectedColony = null;
let finishedTutorial = false;
let actuallyPlanting = true;
let speedIdx = 2;
let graphMode2D = 1 /* LineGraphModes.INSOLATION */;
let graphMode3D = true;
let colonyMode = 1 /* ColonyModes.VERBOSE */;
let fancyPlotTitle = false;
let actionPanelOnTop = false;
let actionConfirm = true;
let quatMode = 1 /* QuaternaryModes.PROFITS */;
let cameraMode = 0 /* CameraModes.STATIC */;
let colonyViewConfig = {};
let shelfPages = {
    almanac: 0,
    manual: 0
};
let autoWaterConfig = {};
let notebook = {};
let tmpCurrency;
let tmpLevels;
// const sidewayQuat = new Quaternion(1, 0, 0, 0);
const uprightQuat = new Quaternion(-Math.sqrt(2) / 2, 0, 0, Math.sqrt(2) / 2);
const xUpQuat = new Quaternion(0, 1, 0, 0);
const yUpQuat = new Quaternion(0, 0, 1, 0);
const zUpQuat = new Quaternion(0, 0, 0, 1);
let manager = new ColonyManager({}, nofPlots, maxColoniesPerPlot);
let renderer = new Renderer(new LSystem(), '', []);
let gameRNG = new Xorshift(1752);
let modelRNG = new Xorshift(Date.now());
let quaternaryEntries = [
    new QuaternaryEntry('p_1', null),
    new QuaternaryEntry('p_2', null),
    new QuaternaryEntry('p_3', null),
    new QuaternaryEntry('p_4', null),
    new QuaternaryEntry('p_5', null),
    new QuaternaryEntry('p_6', null),
];
let perfNames = [
    ['tick', 't'],
    ['manager', 'm'],
    ['lsAncestree', 'L_a'],
    ['lsDerive', 'L_d'],
    ['lsCalcStats', 'L_c'],
    ['availability', 'av'],
    ['renderer', 'r'],
    ['eq2', 'e_2']
];
let perfs = perfNames.map(element => profilers.get(element[0]));
let perfQuaternaryEntries = perfNames.map(element => new QuaternaryEntry(element[1], null));
let createImageBtn = (params, callback, isAvailable, image) => {
    let triggerable = true;
    let borderColor = () => isAvailable() ? Color.BORDER : Color.TRANSPARENT;
    let frame = ui.createFrame({
        cornerRadius: 1,
        margin: new Thickness(2),
        padding: new Thickness(1),
        hasShadow: isAvailable,
        heightRequest: getImageSize(ui.screenWidth),
        widthRequest: getImageSize(ui.screenWidth),
        content: ui.createImage({
            source: image,
            aspect: Aspect.ASPECT_FIT,
            useTint: false
        }),
        borderColor,
        ...params
    });
    frame.onTouched = (e) => {
        if (e.type == TouchType.PRESSED) {
            frame.borderColor = Color.TRANSPARENT;
            // frame.hasShadow = false;
        }
        else if (e.type.isReleased()) {
            frame.borderColor = borderColor;
            // frame.hasShadow = true;
            if (triggerable && isAvailable()) {
                Sound.playClick();
                callback();
            }
            else
                triggerable = true;
        }
        else if (e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
            e.x > frame.width || e.y > frame.height)) {
            frame.borderColor = borderColor;
            // frame.hasShadow = true;
            triggerable = false;
        }
    };
    return frame;
};
let createScrollBarImageBtn = (params, callback, heldCallback = null, repeatable = false, isAvailable, image) => {
    const bound = getImageSize(ui.screenWidth);
    let held = false;
    let triggerable = true;
    let origx = null;
    let origy = null;
    let borderColor = () => isAvailable() ? Color.BORDER : Color.TRANSPARENT;
    let frame = ui.createFrame({
        cornerRadius: 1,
        margin: new Thickness(2),
        padding: new Thickness(1),
        hasShadow: isAvailable,
        heightRequest: getImageSize(ui.screenWidth),
        widthRequest: getImageSize(ui.screenWidth),
        content: ui.createImage({
            source: image,
            aspect: Aspect.ASPECT_FIT,
            useTint: () => {
                if (heldCallback && repeatable && held)
                    heldCallback();
                return false;
            }
        }),
        borderColor,
        ...params
    });
    frame.onTouched = (e) => {
        if (e.type == TouchType.PRESSED) {
            frame.borderColor = Color.TRANSPARENT;
            if (origx == null) {
                origx = e.x;
                origy = e.y;
            }
        }
        else if (e.type == TouchType.LONGPRESS) {
            // frame.borderColor = borderColor;
            if (heldCallback &&
                !(Math.abs(e.x - origx) > bound || Math.abs(e.y - origy) > bound)) {
                Sound.playClick();
                heldCallback();
                held = true;
                // Prevent further callback
                triggerable = false;
            }
        }
        else if (e.type.isReleased()) {
            frame.borderColor = borderColor;
            if (triggerable && isAvailable() && !(Math.abs(e.x - origx) > bound
                || Math.abs(e.y - origy) > bound)) {
                Sound.playClick();
                callback();
            }
            else {
                triggerable = true;
            }
            held = false;
            origx = null;
            origy = null;
        }
        else if (e.type == TouchType.MOVED && (Math.abs(e.x - origx) > bound ||
            Math.abs(e.y - origy) > bound)) {
            frame.borderColor = borderColor;
            held = false;
            triggerable = false;
        }
    };
    return frame;
};
let createLabelBtn = (params, callback, isAvailable, text, fontSize = 14) => {
    let triggerable = true;
    let textColor = () => isAvailable() ? Color.TEXT : Color.TEXT_MEDIUM;
    let borderColor = () => isAvailable() ? Color.BORDER : Color.TRANSPARENT;
    let frame = ui.createFrame({
        cornerRadius: 1,
        // padding: new Thickness(10, 2),
        verticalOptions: LayoutOptions.CENTER,
        content: ui.createLatexLabel({
            text,
            horizontalTextAlignment: TextAlignment.CENTER,
            verticalTextAlignment: TextAlignment.CENTER,
            textColor,
            fontSize
        }),
        borderColor,
        ...params
    });
    frame.onTouched = (e) => {
        if (e.type == TouchType.PRESSED) {
            frame.borderColor = Color.TRANSPARENT;
            frame.content.textColor = Color.TEXT_MEDIUM;
        }
        else if (e.type.isReleased()) {
            frame.borderColor = borderColor;
            frame.content.textColor = textColor;
            if (triggerable && isAvailable()) {
                Sound.playClick();
                callback();
            }
            else
                triggerable = true;
        }
        else if (e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
            e.x > frame.width || e.y > frame.height)) {
            frame.borderColor = borderColor;
            frame.content.textColor = textColor;
            triggerable = false;
        }
    };
    return frame;
};
let createNakedLabelBtn = (params, callback, isAvailable, text, fontSize = 14) => {
    let triggerable = true;
    let frame = ui.createGrid({
        children: [
            ui.createLatexLabel({
                isVisible: isAvailable,
                text,
                horizontalTextAlignment: TextAlignment.CENTER,
                verticalTextAlignment: TextAlignment.CENTER,
                textColor: Color.TEXT,
                fontSize
            }),
        ],
        ...params
    });
    frame.onTouched = (e) => {
        if (e.type == TouchType.PRESSED) {
            frame.children[0].textColor = Color.TEXT_MEDIUM;
        }
        else if (e.type.isReleased()) {
            frame.children[0].textColor = Color.TEXT;
            if (triggerable && isAvailable()) {
                Sound.playClick();
                callback();
            }
            else
                triggerable = true;
        }
        else if (e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
            e.x > frame.width || e.y > frame.height)) {
            frame.children[0].textColor = Color.TEXT;
            triggerable = false;
        }
    };
    return frame;
};
let createHesitantSwitch = (params, callback, isToggled) => {
    let triggerable = true;
    let element = ui.createSwitch({
        horizontalOptions: LayoutOptions.CENTER,
        onColor: Color.BORDER,
        isToggled,
        onTouched: (e) => {
            if (e.type.isReleased()) {
                if (triggerable) {
                    Sound.playClick();
                    callback();
                }
                else
                    triggerable = true;
            }
            else if (e.type == TouchType.MOVED && (e.x < 0 || e.y < 0 ||
                e.x > element.width || e.y > element.height))
                triggerable = false;
        },
        ...params
    });
    return element;
};
const waterFrame = createScrollBarImageBtn({
    row: 0, column: 0,
}, () => manager.water(selectedColony), () => manager.water(selectedColony), true, () => {
    if (selectedColony && !selectedColony.wet)
        return true;
    return false;
}, game.settings.theme == Theme.LIGHT ?
    ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/perch/src/icons/dark/drop.png') :
    ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/perch/src/icons/light/drop.png'));
const waterLabel = ui.createLatexLabel({
    row: 0, column: 1,
    // horizontalOptions: LayoutOptions.END,
    verticalTextAlignment: TextAlignment.START,
    margin: new Thickness(0, 9, 1, 9),
    text: () => {
        let c = selectedColony;
        if (!c)
            return '';
        // @ts-expect-error
        let threshold = plantData[c.id].growthCost *
            // @ts-expect-error
            BigNumber.from(c.sequence.length);
        if (!c.wet) {
            if (c.growth >= threshold)
                return getLoc('labelWaterUrgent');
            // @ts-expect-error
            else if (c.growth >= threshold / BigNumber.TWO)
                return getLoc('labelWater');
            else
                return '';
        }
        else
            return '';
    },
    fontSize: 10,
    textColor: Color.TEXT_MEDIUM
});
const harvestFrame = createScrollBarImageBtn({
    row: 0, column: 2,
}, () => {
    if (actionConfirm) {
        let menu = createConfirmationMenu(plotIdx, slotIdx[plotIdx], 0 /* Actions.HARVEST */);
        menu.show();
    }
    else
        manager.queueAction(plotIdx, slotIdx[plotIdx], 0 /* Actions.HARVEST */);
}, () => {
    if (actionConfirm) {
        let menu = createBulkConfirmationMenu(plotIdx, 0 /* Actions.HARVEST */);
        menu.show();
    }
    else {
        for (let i = manager.colonies[plotIdx].length - 1; i >= 0; --i) {
            if (isColonyVisible(manager.colonies[plotIdx][i]))
                manager.queueAction(plotIdx, i, 0 /* Actions.HARVEST */);
        }
    }
}, false, () => true, game.settings.theme == Theme.LIGHT ?
    ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/perch/src/icons/dark/cornucopia.png') :
    ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/perch/src/icons/light/cornucopia.png'));
const harvestLabel = ui.createLatexLabel({
    row: 0, column: 3,
    // horizontalOptions: LayoutOptions.END,
    verticalTextAlignment: TextAlignment.START,
    margin: new Thickness(0, 9, 1, 9),
    text: getLoc('labelActions')[0 /* Actions.HARVEST */],
    fontSize: 10,
    textColor: Color.TEXT_MEDIUM
});
const pruneFrame = createScrollBarImageBtn({
    isVisible: () => {
        if (!selectedColony ||
            !plantData[selectedColony.id].actions[1 /* Actions.PRUNE */])
            return false;
        return true;
    },
    row: 0, column: 4,
}, () => {
    if (actionConfirm) {
        let menu = createConfirmationMenu(plotIdx, slotIdx[plotIdx], 1 /* Actions.PRUNE */);
        menu.show();
    }
    else
        manager.queueAction(plotIdx, slotIdx[plotIdx], 1 /* Actions.PRUNE */);
}, null, false, () => true, game.settings.theme == Theme.LIGHT ?
    ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/perch/src/icons/dark/hair-strands.png') :
    ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/perch/src/icons/light/hair-strands.png'));
const pruneLabel = ui.createLatexLabel({
    isVisible: () => {
        if (!selectedColony ||
            !plantData[selectedColony.id].actions[1 /* Actions.PRUNE */])
            return false;
        return true;
    },
    row: 0, column: 5,
    // horizontalOptions: LayoutOptions.END,
    verticalTextAlignment: TextAlignment.START,
    margin: new Thickness(0, 9, 1, 9),
    text: getLoc('labelActions')[1],
    fontSize: 10,
    textColor: Color.TEXT_MEDIUM
});
const mainMenuLabel = ui.createLatexLabel({
    row: 0, column: 1,
    verticalTextAlignment: TextAlignment.START,
    margin: new Thickness(0, 9),
    text: () => {
        let dt = (time - lastSave) / speeds[speedIdx];
        if (dt < 30)
            return getLoc('permaShelf');
        return Localization.format(getLoc('labelSave'), Math.floor(dt));
    },
    fontSize: 10,
    textColor: Color.TEXT_MEDIUM
});
const mainMenuFrame = createImageBtn({
    row: 0, column: 0,
    horizontalOptions: LayoutOptions.START
}, () => createShelfMenu().show(), () => true, game.settings.theme == Theme.LIGHT ?
    ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/perch/src/icons/dark/white-book.png') :
    ImageSource.fromUri('https://raw.githubusercontent.com/propfeds/lemmas-garden/perch/src/icons/light/white-book.png'));
var controlStack = ui.createStackLayout({
    isVisible: false,
    margin: new Thickness(6, 0, 6, 6),
    orientation: StackOrientation.VERTICAL,
    children: [
        ui.createGrid({
            columnSpacing: 8,
            rowSpacing: 6,
            rowDefinitions: ['auto'],
            columnDefinitions: ['50*', '50*']
        })
    ]
});
var switchPlant;
var plants = Array.from({ length: nofPlots }, (_) => { return {}; });
var plotPerma;
var plantPerma;
var freePenny;
var pauseGame;
var trueSight;
var warpTick;
var warpDay;
var warpWeek;
var warpYear;
var warpZero;
var currency;
var taxCurrency;
var init = () => {
    currency = theory.createCurrency('p', 'p');
    taxCurrency = theory.createCurrency(`T_{\\text{p}}`);
    /* Plants
    No zombies.
    */
    for (let i = 0; i < nofPlots; ++i) {
        for (let j = 0; j < plantUnlocks.length; ++j) {
            plants[i][plantUnlocks[j]] = theory.createUpgrade(i * 100 + plantIDLookup[plantUnlocks[j]], currency, plantData[plantUnlocks[j]].cost);
            plants[i][plantUnlocks[j]].description = Localization.format(getLoc('plotPlant'), i + 1, getLoc('plants')[plantUnlocks[j]].name);
            plants[i][plantUnlocks[j]].info = getLoc('plants')[plantUnlocks[j]].
                info;
            plants[i][plantUnlocks[j]].bought = (amount) => {
                if (actuallyPlanting) {
                    // log(plants[i][plantUnlocks[j]].level)
                    // log(amount)
                    // Check notebook for max level
                    let finalAmount = amount;
                    if (theory.isBuyAllAvailable && notebook[plantUnlocks[j]] &&
                        plants[i][plantUnlocks[j]].level >
                            notebook[plantUnlocks[j]].maxLevel) {
                        let prevLevel = plants[i][plantUnlocks[j]].level -
                            amount;
                        finalAmount = Math.max(0, notebook[plantUnlocks[j]].maxLevel - prevLevel);
                        // log(`final ${finalAmount}`)
                        let remainder = plants[i][plantUnlocks[j]].level -
                            Math.max(notebook[plantUnlocks[j]].maxLevel, prevLevel);
                        // log(`remainder ${remainder}`)
                        if (remainder > 0)
                            plants[i][plantUnlocks[j]].refund(remainder);
                    }
                    if (finalAmount > 0)
                        manager.addColony(i, plantUnlocks[j], finalAmount);
                }
            };
            plants[i][plantUnlocks[j]].isAvailable = false;
        }
    }
    /* Switch plant
    Moduloes
    */
    {
        switchPlant = theory.createUpgrade(-1, currency, new FreeCost);
        switchPlant.getDescription = () => Localization.format(getLoc('switchPlant'), plotIdx + 1);
        switchPlant.info = getLoc('switchPlantInfo');
        switchPlant.bought = (_) => {
            switchPlant.level = 0;
            if (switchPlant.isAutoBuyable) {
                switchPlant.isAutoBuyable = false;
                return;
            }
            if (plants[plotIdx][plantUnlocks[plantIdx[plotIdx]]].level)
                return;
            plants[plotIdx][plantUnlocks[plantIdx[plotIdx]]].isAvailable =
                false;
            plantIdx[plotIdx] = (plantIdx[plotIdx] + 1) %
                (plantPerma.level + 1);
            plants[plotIdx][plantUnlocks[plantIdx[plotIdx]]].isAvailable = true;
            // updateAvailability();
        };
        switchPlant.isAvailable = false;
        switchPlant.isAutoBuyable = false;
    }
    /* Switchback colony
    Too late to look back.
    */
    /* Switch colony
    Modulow
    */
    /* View colony
    Essential in learning the game.
    */
    /* Notebook
    Unlocks when acquiring Buy All.
    */
    /* Settings
    World menu.
    */
    /* Plot unlock
    Before you can plant any plants, you have to switch tab and unlock plot 0.
    */
    {
        plotPerma = theory.createPermanentUpgrade(0, currency, plotCosts);
        plotPerma.getDescription = (amount) => {
            if (amount == 1)
                return Localization.getUpgradeUnlockDesc(Localization.format(getLoc('unlockPlot'), plotPerma.level + amount));
            return Localization.getUpgradeUnlockDesc(Localization.format(getLoc('unlockPlots'), plotPerma.level + 1, plotPerma.level + amount));
        };
        plotPerma.getInfo = (amount) => {
            if (amount == 1)
                return Localization.getUpgradeUnlockInfo(Localization.format(getLoc('unlockPlot'), plotPerma.level + amount));
            return Localization.getUpgradeUnlockInfo(Localization.format(getLoc('unlockPlots'), plotPerma.level + 1, plotPerma.level + amount));
        };
        plotPerma.bought = (_) => {
            theory.invalidateQuaternaryValues();
            updateAvailability();
        };
        plotPerma.maxLevel = nofPlots;
    }
    /* Plant unlock
    What do I do if I have other plants to unlock with other means?.
    */
    {
        plantPerma = theory.createPermanentUpgrade(4, currency, plantUnlockCosts);
        plantPerma.getDescription = (amount) => {
            if (plantPerma.level == plantPerma.maxLevel)
                return Localization.getUpgradeUnlockDesc(getLoc('unlockPlant'));
            if (amount == 1)
                return Localization.getUpgradeUnlockDesc(`\\text{${getLoc('plants')[plantUnlocks[plantPerma.level + 1]].name}}`);
            return Localization.getUpgradeUnlockDesc(`\\text{${getLoc('plants')[plantUnlocks[plantPerma.level + 1]].name}~${getLoc('plants')[plantUnlocks[plantPerma.level + amount]].name}}`);
        };
        plantPerma.getInfo = (amount) => {
            if (plantPerma.level == plantPerma.maxLevel)
                return Localization.getUpgradeUnlockInfo(getLoc('unlockPlant'));
            if (amount == 1)
                return getLoc('plants')[plantUnlocks[plantPerma.level + amount]].info;
            return Localization.getUpgradeUnlockInfo(`\\text{${getLoc('plants')[plantUnlocks[plantPerma.level + 1]].name}~${getLoc('plants')[plantUnlocks[plantPerma.level + amount]].name}}`);
        };
        plantPerma.bought = (_) => {
            updateAvailability();
        };
        plantPerma.maxLevel = plantUnlocks.length - 1;
    }
    theory.createPublicationUpgrade(1, currency, permaCosts[0]);
    theory.publicationUpgrade.bought = (_) => theory.invalidateQuaternaryValues();
    theory.createBuyAllUpgrade(2, currency, permaCosts[1]);
    theory.buyAllUpgrade.description = getLoc('permaNote');
    theory.buyAllUpgrade.info = getLoc('permaNoteInfo');
    // theory.createAutoBuyerUpgrade(3, currency, permaCosts[2]);
    /* Free penny
    For testing purposes
    */
    {
        freePenny = theory.createPermanentUpgrade(9001, currency, new FreeCost);
        freePenny.description = 'Get 1 penny for free';
        freePenny.info = 'Yields 1 penny';
        // @ts-expect-error
        freePenny.bought = (_) => currency.value += BigNumber.ONE;
        freePenny.isAvailable = haxEnabled;
    }
    /* Pause
    For testing purposes
    */
    {
        pauseGame = theory.createPermanentUpgrade(9006, currency, new FreeCost);
        let descs = ['Pause theory', 'Resume theory'];
        pauseGame.getDescription = () => descs[pauseGame.level];
        pauseGame.info = 'Pauses/resumes the game (renderer still works)';
        pauseGame.bought = (_) => {
            pauseGame.level &= 1;
            if (pauseGame.level)
                theory.pause();
            else
                theory.resume();
        };
        pauseGame.isAvailable = haxEnabled;
    }
    /* Truesight
    For testing purposes
    */
    {
        trueSight = theory.createPermanentUpgrade(9007, currency, new FreeCost);
        let descs = [`Light Luminary's lamp`, `Extinguish Luminary's lamp`];
        trueSight.getDescription = () => descs[trueSight.level];
        trueSight.info = 'Reveals colonies hidden underground';
        trueSight.bought = (_) => {
            trueSight.level &= 1;
            theory.invalidateQuaternaryValues();
        };
        trueSight.isAvailable = haxEnabled;
    }
    /* Warp forward
    For testing purposes
    */
    {
        warpTick = theory.createPermanentUpgrade(9004, currency, new FreeCost);
        warpTick.description = 'Warp tick';
        warpTick.info = 'Warps forward by a tick';
        warpTick.bought = (_) => tick(0.1, 1);
        warpTick.isAvailable = haxEnabled;
        warpDay = theory.createPermanentUpgrade(9003, currency, new FreeCost);
        warpDay.description = 'Warp day';
        warpDay.info = 'Warps forward by a day';
        warpDay.bought = (_) => tick(dayLength / speeds[speedIdx], 1);
        warpDay.isAvailable = haxEnabled;
        warpWeek = theory.createPermanentUpgrade(9008, currency, new FreeCost);
        warpWeek.description = 'Warp week';
        warpWeek.info = 'Warps forward by a week';
        warpWeek.bought = (_) => tick(7 * dayLength / speeds[speedIdx], 1);
        warpWeek.isAvailable = haxEnabled;
        warpYear = theory.createPermanentUpgrade(9005, currency, new FreeCost);
        warpYear.description = 'Warp year';
        warpYear.info = 'Warps forward by 365 days';
        warpYear.bought = (_) => tick(dayLength * 365 / speeds[speedIdx], 1);
        warpYear.isAvailable = haxEnabled;
    }
    /* Reset time
    For testing purposes
    */
    {
        warpZero = theory.createPermanentUpgrade(9002, currency, new FreeCost);
        warpZero.description = 'Warp to day 1 (press 5 times to confirm)';
        warpZero.info = 'Warps backward';
        warpZero.bought = (_) => {
            if (warpZero.level > 4) {
                warpZero.level = 0;
                time = 0;
                days = 0;
                years = 0;
                insolationIntegral = 0;
                growthIntegral = 0;
            }
        };
        warpZero.isAvailable = haxEnabled;
    }
    // Next: milestones
    // Story chapters
    let chapters = getLoc('chapters');
    theory.createStoryChapter(0, chapters?.intro[0]?.title, chapters?.intro[0]?.contents, () => true);
    theory.createStoryChapter(-1, chapters?.intro[1]?.title, chapters?.intro[1]?.contents, () => manager.colonies[0].length > 0);
    theory.createStoryChapter(1, chapters?.basil?.title, chapters?.basil?.contents, () => plantPerma.level > 1);
    theory.createStoryChapter(2, chapters?.notebook?.title, chapters?.notebook?.contents, () => theory.buyAllUpgrade.level > 0);
    theory.createStoryChapter(3, chapters?.flood?.title, chapters?.flood?.contents, () => theory.tau >= BigNumber.TEN && time < 10);
    let fifteen = BigNumber.from(1e15).pow(tauRate);
    theory.createStoryChapter(4, chapters?.nepo?.title, chapters?.nepo?.contents, () => theory.tau >= fifteen);
    // Achievements
    let achievements = getLoc('achievements');
    theory.createAchievement(0, null, achievements?.debt?.title, achievements?.debt?.desc, () => currency.value < BigNumber.ZERO);
    theory.createAchievement(1, null, achievements?.immortal?.title, achievements?.immortal?.desc, () => years >= 200);
    theory.primaryEquationHeight = 30;
    theory.primaryEquationScale = 0.96;
    theory.secondaryEquationHeight = 105;
};
var updateAvailability = () => {
    perfs[5 /* Profilers.AVAILABILITY */].exec(() => {
        let x = plotIdx;
        let y = slotIdx;
        let p = plantIdx;
        if (!finishedTutorial) {
            finishedTutorial = plotPerma.level > 0;
        }
        else {
            switchPlant.isAvailable = plotIdx < plotPerma.level &&
                !plants[x][plantUnlocks[p[x]]].level && plantPerma.level > 0;
            controlStack.isVisible = true;
        }
        for (let i = 0; i < plotPerma.level; ++i) {
            for (let j = 0; j < plantUnlocks.length; ++j)
                plants[i][plantUnlocks[j]].isAvailable =
                    plants[i][plantUnlocks[j]].level > 0 ||
                        (j == p[i] && j <= plantPerma.level);
        }
    });
};
// let floatingWipLabel = ui.createLatexLabel
// ({
//     row: 0, column: 0,
//     rotation: -24,
//     horizontalOptions: LayoutOptions.CENTER,
//     verticalOptions: LayoutOptions.END,
//     // verticalTextAlignment: TextAlignment.CENTER,
//     margin: new Thickness(8, 40),
//     text: getLoc('wip'),
//     fontSize: 9,
//     textColor: Color.TEXT_MEDIUM
// });
var tick = (elapsedTime, multiplier) => {
    let dd, di, dg;
    perfs[0 /* Profilers.TICK */].exec(() => {
        let dt = elapsedTime * speeds[speedIdx];
        time += dt;
        // https://www.desmos.com/calculator/pfku4nopgy
        // insolation = max(0, -cos(x*pi/72))
        // Help me check my integral maths
        let cycles = time / dayLength;
        let newDays = Math.floor(cycles);
        dd = newDays - days;
        days = newDays;
        while (days >= yearStartLookup[years + 1])
            ++years;
        let phase = saturate(cycles - days - 0.25, 0, 0.5);
        let newII = days * dayLength / Math.PI - halfDayLength *
            (Math.cos(phase * 2 * Math.PI) - 1) / Math.PI;
        di = newII - insolationIntegral;
        insolationIntegral = newII;
        // universal growth factor = cos(x*pi/72)/2 + 1/2
        let newGI = time + quarterDayLength *
            Math.sin(time * Math.PI / halfDayLength) / Math.PI;
        dg = newGI - growthIntegral;
        growthIntegral = newGI;
    });
    manager.updateSpawners(days);
    manager.growAll(BigNumber.from(di), BigNumber.from(dg), BigNumber.from(dd));
    if (!game.isCalculatingOfflineProgress) {
        let timeCos = Math.cos(time * Math.PI / halfDayLength);
        insolationCoord = Math.max(0, -timeCos);
        growthCoord = timeCos / 2 + 1;
        switch (quatMode) {
            case 3 /* QuaternaryModes.PERFORMANCE */:
            case 4 /* QuaternaryModes.PERFORMANCE_MINMAX */:
                theory.invalidateQuaternaryValues();
                break;
        }
        // floatingWipLabel.rotateTo(-3 - Math.cos(time * Math.PI / 6) * 12,
        // 180, Easing.LINEAR);
        managerLoadingInd.isRunning = manager.busy;
    }
    theory.invalidateSecondaryEquation();
    // theory.invalidateTertiaryEquation();
};
let managerLoadingInd = ui.createActivityIndicator({
    margin: new Thickness(4),
    horizontalOptions: LayoutOptions.END,
    verticalOptions: LayoutOptions.END,
    heightRequest: getImageSize(ui.screenWidth),
    widthRequest: getImageSize(ui.screenWidth),
    isRunning: manager.busy
});
let canGTPS = () => slotIdx[plotIdx] > 0;
let GTPS = () => {
    let i = slotIdx[plotIdx];
    do
        --slotIdx[plotIdx];
    while (manager.colonies[plotIdx][slotIdx[plotIdx]] &&
        !isColonyVisible(manager.colonies[plotIdx][slotIdx[plotIdx]]));
    if (slotIdx[plotIdx] < 0)
        slotIdx[plotIdx] = i;
    selectedColony = manager.colonies[plotIdx][slotIdx[plotIdx]];
    renderer.colony = selectedColony;
    theory.invalidateQuaternaryValues();
};
let canGTNS = () => slotIdx[plotIdx] < manager.colonies[plotIdx].length - 1;
let GTNS = () => {
    let i = slotIdx[plotIdx];
    do
        ++slotIdx[plotIdx];
    while (manager.colonies[plotIdx][slotIdx[plotIdx]] &&
        !isColonyVisible(manager.colonies[plotIdx][slotIdx[plotIdx]]));
    if (slotIdx[plotIdx] > manager.colonies[plotIdx].length - 1)
        slotIdx[plotIdx] = i;
    selectedColony = manager.colonies[plotIdx][slotIdx[plotIdx]];
    renderer.colony = selectedColony;
    theory.invalidateQuaternaryValues();
};
var getEquationOverlay = () => {
    let result = ui.createGrid({
        inputTransparent: true,
        cascadeInputTransparent: false,
        children: [
            // floatingWipLabel,
            ui.createGrid({
                row: 0, column: 0,
                columnDefinitions: getNavColumnDefs(ui.screenWidth),
                rowDefinitions: ['1*', '2*', '1*'],
                verticalOptions: LayoutOptions.FILL,
                inputTransparent: true,
                cascadeInputTransparent: false,
                children: [
                    // ui.createBox({row: 0, column: 0}),
                    // ui.createBox({row: 1, column: 1}),
                    // ui.createBox({row: 2, column: 2}),
                    // ui.createBox({row: 1, column: 3}),
                    createNakedLabelBtn({
                        row: 1, column: 0,
                        verticalOptions: LayoutOptions.FILL
                    }, GTPS, canGTPS, '←'),
                    // createNakedLabelBtn
                    // ({
                    //     row: 1, column: 1,
                    //     verticalOptions: LayoutOptions.FILL
                    // }, () =>
                    // {
                    //     selectedColony = manager.colonies[plotIdx][slotIdx[
                    //     plotIdx]];
                    //     if(!selectedColony)
                    //         return;
                    //     let seqMenu = createColonyViewMenu(selectedColony);
                    //     seqMenu.show();
                    // }, () => manager.colonies[plotIdx].length > 0, ''),
                    createNakedLabelBtn({
                        row: 1, column: 2,
                        verticalOptions: LayoutOptions.FILL
                    }, GTNS, canGTNS, '→'),
                ]
            }),
            managerLoadingInd,
            ui.createLatexLabel({
                row: 0, column: 0,
                horizontalTextAlignment: TextAlignment.CENTER,
                verticalTextAlignment: () => actionPanelOnTop ?
                    TextAlignment.END : TextAlignment.START,
                margin: new Thickness(10, 4),
                text: getTimeString,
                fontSize: 10,
                textColor: Color.TEXT_MEDIUM
            }),
            ui.createGrid({
                row: 0, column: 0,
                margin: new Thickness(4),
                horizontalOptions: LayoutOptions.START,
                verticalOptions: () => actionPanelOnTop ? LayoutOptions.END :
                    LayoutOptions.START,
                rowDefinitions: [
                    'auto', 'auto'
                ],
                columnDefinitions: [
                    'auto', 'auto'
                ],
                inputTransparent: true,
                cascadeInputTransparent: false,
                children: [
                    mainMenuFrame,
                    mainMenuLabel,
                ]
            }),
            ui.createGrid({
                row: 0, column: 0,
                rowDefinitions: ['auto'],
                columnDefinitions: getActBarColumnDefs(ui.screenWidth),
                verticalOptions: () => actionPanelOnTop ?
                    LayoutOptions.START : LayoutOptions.END,
                inputTransparent: true,
                cascadeInputTransparent: false,
                children: [
                    ui.createScrollView({
                        row: 0, column: 0,
                        orientation: ScrollOrientation.BOTH,
                        content: ui.createGrid({
                            isVisible: () => plotIdx < plotPerma.level &&
                                manager.colonies[plotIdx].length > 0,
                            row: 0, column: 0,
                            margin: new Thickness(4),
                            horizontalOptions: LayoutOptions.START,
                            // verticalOptions: LayoutOptions.END,
                            columnDefinitions: [
                                'auto', 'auto',
                                'auto', 'auto',
                                'auto', 'auto'
                            ],
                            inputTransparent: true,
                            cascadeInputTransparent: false,
                            children: [
                                waterFrame,
                                waterLabel,
                                harvestFrame,
                                harvestLabel,
                                pruneFrame,
                                pruneLabel,
                            ]
                        }),
                    }),
                ]
            }),
        ]
    });
    return result;
};
var getCurrencyBarDelegate = () => {
    let tauLabel = ui.createLatexLabel({
        row: 0, column: 0,
        text: () => {
            if (theory.publicationUpgrade.level && theory.canPublish) {
                // @ts-expect-error
                taxCurrency.value = getCurrencyFromTau(theory.tau)[0] * taxRate;
                return Utils.getMath(`${theory.tau}${theory.latexSymbol}
                \\enspace (${taxCurrency.symbol} =
                ${taxCurrency.value}\\text{${currency.symbol}})`);
            }
            return Utils.getMath(`${theory.tau}${theory.latexSymbol}`);
        },
        heightRequest: getImageSize(ui.screenWidth),
        // margin: new Thickness(0, 2, 0, 0),
        fontSize: 12,
        horizontalTextAlignment: TextAlignment.CENTER,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let pennyLabel = ui.createLatexLabel({
        row: 0, column: 1,
        text: () => Utils.getMath(`${currency.value}\\text{p}`),
        heightRequest: getImageSize(ui.screenWidth),
        // margin: new Thickness(0, 2, 0, 0),
        fontSize: 12,
        horizontalTextAlignment: TextAlignment.CENTER,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let examineBtn = createLabelBtn({
        row: 0, column: 1,
        heightRequest: getMediumBtnSize(ui.screenWidth)
    }, () => {
        selectedColony = manager.colonies[plotIdx][slotIdx[plotIdx]];
        if (!selectedColony)
            return;
        let seqMenu = createColonyViewMenu(selectedColony);
        seqMenu.show();
    }, () => manager.colonies[plotIdx].length > 0, getLoc('viewColony'), 12);
    let plotUpBtn = createLabelBtn({
        column: 0,
        heightRequest: getMediumBtnSize(ui.screenWidth)
    }, () => {
        --plotIdx;
        let len = manager.colonies[plotIdx].length;
        if (len > 1) {
            while (manager.colonies[plotIdx][slotIdx[plotIdx]] &&
                !isColonyVisible(manager.colonies[plotIdx][slotIdx[plotIdx]]))
                --slotIdx[plotIdx];
            if (slotIdx[plotIdx] < 0)
                slotIdx[plotIdx] = 0;
        }
        else
            slotIdx[plotIdx] = 0;
        selectedColony = manager.colonies[plotIdx][slotIdx[plotIdx]];
        renderer.colony = selectedColony;
        theory.invalidatePrimaryEquation();
        theory.invalidateSecondaryEquation();
        theory.invalidateQuaternaryValues();
        updateAvailability();
    }, () => plotIdx > 0, '↑');
    let plotDownBtn = createLabelBtn({
        column: 1,
        heightRequest: getMediumBtnSize(ui.screenWidth)
    }, () => {
        ++plotIdx;
        let len = manager.colonies[plotIdx].length;
        if (len > 1) {
            while (manager.colonies[plotIdx][slotIdx[plotIdx]] &&
                !isColonyVisible(manager.colonies[plotIdx][slotIdx[plotIdx]]))
                --slotIdx[plotIdx];
            if (slotIdx[plotIdx] < 0)
                slotIdx[plotIdx] = 0;
        }
        else
            slotIdx[plotIdx] = 0;
        selectedColony = manager.colonies[plotIdx][slotIdx[plotIdx]];
        renderer.colony = selectedColony;
        theory.invalidatePrimaryEquation();
        theory.invalidateSecondaryEquation();
        theory.invalidateQuaternaryValues();
        updateAvailability();
    }, () => plotIdx < manager.length - 1, '↓');
    controlStack.children[0].children =
        [
            examineBtn,
            ui.createGrid({
                row: 0,
                column: 0,
                columnSpacing: 7,
                columnDefinitions: ['50*', '50*'],
                children: [
                    plotUpBtn,
                    plotDownBtn
                ]
            })
        ];
    let currencyGrid = ui.createGrid({
        margin: new Thickness(6, 3, 6, 0),
        horizontalOptions: LayoutOptions.CENTER,
        columnDefinitions: ['auto', 'auto'],
        columnSpacing: () => getBtnSize(ui.screenWidth) *
            (2 - theory.publicationUpgrade.level * Number(theory.canPublish)),
        children: [tauLabel, pennyLabel]
    });
    return ui.createStackLayout({
        children: [currencyGrid, controlStack]
    });
};
/**
 * Returns the colony title for representation.
 */
let getColonyTitleString = (colony, prog = false, maxStage = false, escapeHash = false) => Localization.format(getLoc(prog ? 'colonyProg' : (maxStage ? 'colonyWMaxStg' :
    'colony')), colony.propagated ? `+${colony.population}` : colony.population, getLoc('plants')[colony.id]?.name ?? `${escapeHash ? '\\' : ''}#${colony.id}`, 
// @ts-expect-error
colony.stage, prog ? colony.growth * BigNumber.HUNDRED /
    // @ts-expect-error
    (plantData[colony.id].growthCost * BigNumber.from(colony.sequence.length)) :
    plantData[colony.id].maxStage ?? '∞');
var getPrimaryEquation = () => {
    if (colonyMode == 0 /* ColonyModes.OFF */)
        return '';
    return Localization.format(getLoc(fancyPlotTitle ? 'plotTitleF' :
        'plotTitle'), plotIdx + 1);
};
var getSecondaryEquation = () => {
    // selectedColony = manager.colonies[plotIdx][slotIdx[plotIdx]];
    let c = selectedColony;
    if (!c) {
        if (plotIdx < plotPerma.level) {
            let taxInfo = `\\text{${getLoc('pubTax')}}\\\\
            T_{\\text{p}}=${taxRate}\\times ${theory.latexSymbol}`;
            let tauInfo = `${theory.latexSymbol}=\\max\\text{p}`;
            return `\\begin{array}{c}${taxInfo}\\\\\\\\${tauInfo}\\end{array}`;
        }
        // let plotCost = plotCosts.getCost(plotIdx);
        // if(plotCost.isZero)
        return getLoc('lockedPlot');
        // return `\\begin{array}{c}${getLoc('lockedPlot')}\\\\
        // (${plotCost}\\text{p})\\end{array}`;
    }
    let result;
    perfs[7 /* Profilers.EQ_2 */].exec(() => {
        switch (colonyMode) {
            case 1 /* ColonyModes.VERBOSE */:
                let status = (manager.gangsta &&
                    manager.gangsta[0] == plotIdx &&
                    manager.gangsta[1] == slotIdx[plotIdx]) ?
                    getLoc('status').evolve : (manager.actionGangsta &&
                    manager.actionGangsta[0] == plotIdx &&
                    manager.actionGangsta[1] == slotIdx[plotIdx]) ?
                    getLoc('status').actions[manager.actionGangsta[2]] : '';
                result = `\\begin{array}{c}\\text{${getColonyTitleString(c)}}
                \\\\${Localization.format(getLoc('colonyStats'), 
                // @ts-expect-error
                c.energy, c.synthRate * BigNumber.from(insolationCoord), c.growth, c.stage < (plantData[c.id].maxStage ?? INT_MAX) ?
                    // @ts-expect-error
                    plantData[c.id].growthCost * BigNumber.from(c.sequence.length) :
                    '∞', c.stage < (plantData[c.id].maxStage ?? INT_MAX) ?
                    // @ts-expect-error
                    plantData[c.id].growthRate * BigNumber.from(growthCoord) :
                    BigNumber.ZERO, c.profit, slotIdx[plotIdx] + 1, manager.colonies[plotIdx].length, status)}\\end{array}`;
                break;
            case 2 /* ColonyModes.SIMPLE */:
                result = `\\begin{array}{c}\\text{${getColonyTitleString(c)}}
                \\\\E=${c.energy},\\enspace g=${c.growth}/
                ${c.stage < (plantData[c.id].maxStage ?? INT_MAX) ?
                    // @ts-expect-error
                    plantData[c.id].growthCost * BigNumber.from(c.sequence.length) :
                    '∞'}\\\\\\dot{E}=${c.synthRate}/\\text{s},\\enspace\\pi =
                ${c.profit}\\text{p}\\\\(${slotIdx[plotIdx] + 1}/
                ${manager.colonies[plotIdx].length})\\\\\\end{array}`;
                break;
            case 3 /* ColonyModes.LIST */:
                result = '\\begin{array}{c}';
                for (let i = 0; i < slotIdx[plotIdx]; ++i) {
                    let d = manager.colonies[plotIdx][i];
                    if (isColonyVisible(d))
                        result += `\\text{${getColonyTitleString(d, true)}}
                        \\\\`;
                }
                result += `\\text{\\underline{${getColonyTitleString(c, true)}}}
                \\\\`;
                for (let i = slotIdx[plotIdx] + 1; i < manager.colonies[plotIdx].length; ++i) {
                    let d = manager.colonies[plotIdx][i];
                    if (isColonyVisible(d))
                        result += `\\text{${getColonyTitleString(d, true)}}
                        \\\\`;
                }
                result += `E=${c.energy},\\enspace\\pi =${c.profit}\\text{p}
                \\end{array}`;
                break;
            default:
                result = '';
        }
    });
    return result;
};
let getTimeString = () => {
    let dayofYear = days - yearStartLookup[years];
    let weeks = Math.floor(dayofYear / 7);
    let timeofDay = time % dayLength;
    // timeofDay is within [0, dayLength).
    let resolution = speedAdjDayLengths[speedIdx];
    let quantum = dayLength / resolution;
    let quanToD = Math.floor(timeofDay / quantum) * quantum;
    let hour = Math.floor(quanToD / hourLength);
    let min = Math.floor((quanToD % hourLength) / speeds[speedIdx]) *
        clockMinDiv[speedIdx];
    return Localization.format(getLoc(actionPanelOnTop ? 'dateTimeBottom' :
        'dateTime'), years + 1, weeks + 1, dayofYear - weeks * 7 + 1, hour.toString().padStart(2, '0'), min.toString().padStart(2, '0'), haxEnabled ? getLoc('hacks') : '');
};
var getQuaternaryEntries = () => {
    switch (quatMode) {
        case 3 /* QuaternaryModes.PERFORMANCE */:
            for (let i = 0; i < perfs.length; ++i) {
                let m1 = getCoordString(perfs[i].latest * 1000);
                let m2 = getCoordString(perfs[i].mean * 1000);
                perfQuaternaryEntries[i].value = `${m1}/${m2}`;
            }
            return perfQuaternaryEntries;
        case 4 /* QuaternaryModes.PERFORMANCE_MINMAX */:
            for (let i = 0; i < perfs.length; ++i) {
                let m1 = getCoordString(perfs[i].min * 1000);
                let m2 = getCoordString(perfs[i].max * 1000);
                perfQuaternaryEntries[i].value = `${m1}/${m2}`;
            }
            return perfQuaternaryEntries;
        case 1 /* QuaternaryModes.PROFITS */:
            if (!plotPerma.level)
                return quaternaryEntries.slice(0, 1);
            for (let i = 0; i < plotPerma.level; ++i) {
                // if(i >= plotPerma.level && !manager.colonies[i].length)
                // {
                //     quaternaryEntries[i].value = null;
                //     continue;
                // }
                let sum = BigNumber.ZERO;
                for (let j = 0; j < manager.colonies[i].length; ++j) {
                    let c = manager.colonies[i][j];
                    // @ts-expect-error
                    sum += c.profit * BigNumber.from(c.population);
                }
                // @ts-expect-error
                quaternaryEntries[i].value = sum * theory.publicationMultiplier;
            }
            break;
        case 2 /* QuaternaryModes.BOARD */:
            if (!plotPerma.level)
                return quaternaryEntries.slice(0, 1);
            for (let i = 0; i < plotPerma.level; ++i) {
                // if(i >= plotPerma.level && !manager.colonies[i].length)
                // {
                //     quaternaryEntries[i].value = null;
                //     continue;
                // }
                let column = '';
                for (let j = 0; j < manager.colonies[i].length; ++j) {
                    let c = manager.colonies[i][j];
                    if (isColonyVisible(c)) {
                        let plantName = getLoc('plants')[c.id]?.nameShort ??
                            '#';
                        let cStr = `${plantName}${getSubscript(c.stage)}`;
                        if (i == plotIdx && j == slotIdx[plotIdx])
                            column += `(${cStr})`;
                        else
                            column += cStr;
                    }
                }
                quaternaryEntries[i].value = column;
            }
            break;
        default:
            return [];
    }
    return quaternaryEntries; //.slice(0, plotPerma.level);
};
let createVariableMenu = (variables) => {
    // Q: Does Object.entries mean that its contents are references, and 
    // therefore overwritable from afar?
    let varEntries = [];
    for (let i = 0; i < variables.length; ++i) {
        varEntries.push(ui.createEntry({
            row: i,
            column: 0,
            text: variables[i][0]
        }));
        varEntries.push(ui.createLatexLabel({
            text: '=',
            row: i,
            column: 1,
            horizontalTextAlignment: TextAlignment.CENTER,
            verticalTextAlignment: TextAlignment.CENTER
        }));
        varEntries.push(ui.createEntry({
            row: i,
            column: 2,
            text: variables[i][1],
            horizontalTextAlignment: TextAlignment.END
        }));
    }
    let varsLabel = ui.createLatexLabel({
        text: Localization.format(getLoc('labelVars'), variables.length),
        verticalTextAlignment: TextAlignment.CENTER,
        // margin: new Thickness(0, 12)
        heightRequest: getSmallBtnSize(ui.screenWidth)
    });
    let varStack = ui.createGrid({
        columnDefinitions: ['50*', '20*', '30*'],
        children: varEntries
    });
    let menu = ui.createPopup({
        title: getLoc('menuVariables'),
        content: ui.createStackLayout({
            children: [
                ui.createGrid({
                    columnDefinitions: ['70*', '30*'],
                    children: [
                        varsLabel
                    ]
                }),
                ui.createScrollView({
                    content: varStack
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createButton({
                    text: Localization.get('GenPopupClose'),
                    onClicked: () => {
                        Sound.playClick();
                        menu.hide();
                    }
                })
            ]
        })
    });
    return menu;
};
let createSystemMenu = (id) => {
    let values = plantData[id].system.toJSON();
    let tmpAxiom = values.axiom;
    let axiomEntry = ui.createEntry({
        text: tmpAxiom,
        row: 0,
        column: 1
    });
    let tmpVars = Object.entries(values.variables);
    let varButton = ui.createButton({
        text: getLoc('btnVar'),
        row: 0,
        column: 2,
        heightRequest: getSmallBtnSize(ui.screenWidth),
        onClicked: () => {
            Sound.playClick();
            let varMenu = createVariableMenu(tmpVars);
            varMenu.show();
        }
    });
    let tmpRules = values.rules;
    // for(let i = 0; i < values.rules.length; ++i)
    //     tmpRules[i] = values.rules[i];
    let ruleEntries = [];
    for (let i = 0; i < tmpRules.length; ++i) {
        ruleEntries.push(ui.createLabel({
            row: i, column: 0,
            horizontalOptions: LayoutOptions.END,
            verticalOptions: LayoutOptions.CENTER,
            text: String(i + 1),
            fontSize: 14
        }));
        ruleEntries.push(ui.createEntry({
            row: i, column: 1,
            text: tmpRules[i]
        }));
    }
    let rulesLabel = ui.createLatexLabel({
        text: Localization.format(getLoc('labelRules'), tmpRules.length),
        verticalTextAlignment: TextAlignment.CENTER,
        margin: new Thickness(0, 6),
        // heightRequest: getSmallBtnSize(ui.screenWidth)
    });
    let ruleStack = ui.createGrid({
        columnDefinitions: ['auto', 'auto'],
        children: ruleEntries
    });
    // let tmpModels = [];
    // for(let i = 0; i < values.models.length; ++i)
    //     tmpModels[i] = values.models[i];
    // let modelEntries = [];
    // for(let i = 0; i < tmpModels.length; ++i)
    // {
    //     modelEntries.push(ui.createEntry
    //     ({
    //         row: i,
    //         text: tmpModels[i]
    //     }));
    // }
    // let modelsLabel = ui.createLatexLabel
    // ({
    //     text: Localization.format(getLoc('labelModels'), modelEntries.length),
    //     verticalTextAlignment: TextAlignment.CENTER,
    //     margin: new Thickness(0, 6),
    //     // heightRequest: getSmallBtnSize(ui.screenWidth)
    // });
    // let modelStack = ui.createGrid
    // ({
    //     children: modelEntries
    // });
    let tmpIgnore = values.ignoreList ?? '';
    let ignoreEntry = ui.createEntry({
        text: tmpIgnore,
        row: 0,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });
    let tmpCI = values.ctxIgnoreList ?? '';
    let CIEntry = ui.createEntry({
        text: tmpCI,
        row: 1,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });
    let tmpAngle = values.turnAngle ?? '0';
    let angleEntry = ui.createEntry({
        text: tmpAngle.toString(),
        row: 2,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });
    let tmpTropism = values.tropism ?? '0';
    let tropismEntry = ui.createEntry({
        text: tmpTropism.toString(),
        row: 3,
        column: 1,
        horizontalTextAlignment: TextAlignment.END
    });
    /*
    let tmpSeed = values.seed ?? '0';
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
    */
    let LsExplanations = `${getLoc('plants')[id]?.LsDetails ?? getLoc('noLsDetails')}\\\\—
    \\\\${getLoc('plants')[id]?.actions?.join('\\\\') ?? getLoc('noActions')}`;
    let menu = ui.createPopup({
        title: getLoc('plants')[id]?.name ?? `#${id}`,
        isPeekable: true,
        content: ui.createStackLayout({
            children: [
                ui.createScrollView({
                    // heightRequest: ui.screenHeight * 0.32,
                    content: ui.createStackLayout({
                        children: [
                            ui.createLatexLabel({
                                text: LsExplanations,
                                margin: new Thickness(0, 6),
                                horizontalTextAlignment: TextAlignment.START,
                                verticalTextAlignment: TextAlignment.CENTER
                            }),
                            ui.createGrid({
                                columnDefinitions: ['20*', '50*', '30*'],
                                children: [
                                    ui.createLatexLabel({
                                        text: getLoc('labelAxiom'),
                                        row: 0,
                                        column: 0,
                                        verticalTextAlignment: TextAlignment.CENTER
                                    }),
                                    axiomEntry,
                                    varButton
                                ]
                            }),
                            rulesLabel,
                            ruleStack,
                            ui.createGrid({
                                columnDefinitions: ['70*', '30*'],
                                children: [
                                    ui.createLatexLabel({
                                        text: getLoc('labelIgnored'),
                                        row: 0,
                                        column: 0,
                                        verticalTextAlignment: TextAlignment.CENTER
                                    }),
                                    ignoreEntry,
                                    ui.createLatexLabel({
                                        text: getLoc('labelCtxIgnored'),
                                        row: 1,
                                        column: 0,
                                        verticalTextAlignment: TextAlignment.CENTER
                                    }),
                                    CIEntry,
                                    ui.createLatexLabel({
                                        text: getLoc('labelAngle'),
                                        row: 2,
                                        column: 0,
                                        verticalTextAlignment: TextAlignment.CENTER
                                    }),
                                    angleEntry,
                                    ui.createLatexLabel({
                                        text: getLoc('labelTropism'),
                                        row: 3,
                                        column: 0,
                                        verticalTextAlignment: TextAlignment.CENTER
                                    }),
                                    tropismEntry,
                                ]
                            }),
                        ]
                    })
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createButton({
                    text: Localization.get('GenPopupClose'),
                    onClicked: () => {
                        Sound.playClick();
                        menu.hide();
                    }
                })
            ]
        })
    });
    return menu;
};
let createColonyViewMenu = (colony) => {
    if (!colonyViewConfig[colony.id]) {
        colonyViewConfig[colony.id] =
            {
                filter: '',
                params: true
            };
    }
    let reconstructionTask = {
        start: 0
    };
    let filterEntry = ui.createEntry({
        column: 1,
        text: colonyViewConfig[colony.id].filter,
        clearButtonVisibility: ClearButtonVisibility.WHILE_EDITING,
        onTextChanged: (ot, nt) => {
            colonyViewConfig[colony.id].filter = nt;
            reconstructionTask =
                {
                    start: 0
                };
        }
    });
    let paramSwitch = createHesitantSwitch({
        column: 3,
    }, () => {
        colonyViewConfig[colony.id].params =
            !colonyViewConfig[colony.id].params;
        paramSwitch.isToggled = colonyViewConfig[colony.id].params;
        // paramSwitch.isToggled = !paramSwitch.isToggled;
        // colonyViewConfig[colony.id].params = paramSwitch.isToggled;
        reconstructionTask =
            {
                start: 0
            };
    }, colonyViewConfig[colony.id].params);
    let updateReconstruction = () => {
        if (manager.busy)
            return reconstructionTask.result;
        if (!('result' in reconstructionTask) || reconstructionTask.start) {
            reconstructionTask = plantData[colony.id].system.reconstruct(colony, colonyViewConfig[colony.id].filter, colonyViewConfig[colony.id].params, 4, reconstructionTask);
        }
        return reconstructionTask.result;
    };
    let tmpTitle = getColonyTitleString(colony, false, true);
    let tmpStage = colony.stage;
    let cmtStage = -1;
    let track;
    let updateCommentary = () => {
        track = getLoc('plants')[colony.id]?.narrations?.[colony.narrationTrack ?? 0];
        if (!track || !track.index || colony.stage < track.index[0])
            return getLoc('noCommentary');
        if (track[colony.stage])
            cmtStage = colony.stage;
        else
            cmtStage = track.index[binarySearchLast(track.index, colony.stage)];
        return track[cmtStage];
    };
    let tmpCmt = updateCommentary();
    let plantStats = ui.createLatexLabel({
        text: Localization.format(getLoc('plantStats'), track?.name ?
            Localization.format(getLoc('narrationTrack'), cmtStage, track.name) :
            cmtStage, tmpCmt, colony.synthRate, plantData[colony.id].growthRate, plantData[colony.id].growthCost, colony.sequence.length),
        margin: new Thickness(0, 6),
        horizontalTextAlignment: TextAlignment.START,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let pageContents = ui.createLabel({
        fontFamily: FontFamily.CMU_REGULAR,
        fontSize: 16,
        text: () => updateReconstruction(),
        lineBreakMode: LineBreakMode.CHARACTER_WRAP
    });
    let viewButton = ui.createButton({
        text: getLoc('btnView'),
        row: 0, column: 0,
        onClicked: () => {
            Sound.playClick();
            let statsMenu = createSystemMenu(colony.id);
            statsMenu.show();
        }
    });
    let almanacButton = ui.createButton({
        text: colony.id in almanac.pageLookup ? getLoc('btnAlmanac') :
            getLoc('btnAlmanacNoEntry'),
        row: 0, column: 1,
        onClicked: () => {
            if (!(colony.id in almanac.pageLookup))
                return;
            Sound.playClick();
            shelfPages.almanac = almanac.pageLookup[colony.id];
            let menu = createBookMenu(almanac);
            menu.show();
        }
    });
    let menu = ui.createPopup({
        title: () => {
            if (tmpStage != colony.stage) {
                /*
                Menu title and commentary are updated dynamically without
                the player having to close and re-open.
                */
                tmpTitle = getColonyTitleString(colony, false, true);
                tmpCmt = updateCommentary();
                plantStats.text = Localization.format(getLoc('plantStats'), track?.name ? Localization.format(getLoc('narrationTrack'), cmtStage, track.name) : cmtStage, tmpCmt, colony.synthRate, plantData[colony.id].growthRate, plantData[colony.id].growthCost, colony.sequence.length);
                tmpStage = colony.stage;
                reconstructionTask =
                    {
                        start: 0
                    };
            }
            return tmpTitle;
        },
        isPeekable: true,
        content: ui.createStackLayout({
            children: [
                plantStats,
                ui.createFrame({
                    padding: new Thickness(8, 6),
                    heightRequest: ui.screenHeight * 0.18,
                    content: ui.createScrollView({
                        content: ui.createStackLayout({
                            children: [
                                pageContents
                            ]
                        })
                    })
                }),
                ui.createBox({
                    heightRequest: 0,
                    margin: new Thickness(0)
                }),
                ui.createGrid({
                    minimumHeightRequest: getSmallBtnSize(ui.screenWidth),
                    columnDefinitions: ['20*', '30*', '35*', '15*'],
                    children: [
                        ui.createLatexLabel({
                            text: getLoc('labelFilter'),
                            column: 0,
                            verticalTextAlignment: TextAlignment.CENTER
                        }),
                        filterEntry,
                        ui.createLatexLabel({
                            text: getLoc('labelParams'),
                            column: 2,
                            horizontalOptions: LayoutOptions.END,
                            verticalTextAlignment: TextAlignment.CENTER
                        }),
                        paramSwitch
                    ]
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createGrid({
                    minimumHeightRequest: getBtnSize(ui.screenWidth),
                    columnDefinitions: ['50*', '50*'],
                    children: [
                        viewButton,
                        almanacButton
                    ]
                })
            ]
        })
    });
    return menu;
};
let createBookMenu = (book) => {
    let title = book.title;
    let key = book.key;
    let pages = book.pages;
    let tableofContents = book.tableofContents;
    let pageTitle = ui.createLatexLabel({
        row: 0, column: 0,
        text: pages[shelfPages[key]].title,
        margin: new Thickness(0, 4),
        heightRequest: getProgBarSize(ui.screenWidth),
        horizontalTextAlignment: TextAlignment.CENTER,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let pageContents = ui.createLabel({
        fontFamily: FontFamily.CMU_REGULAR,
        fontSize: 14,
        text: pages[shelfPages[key]].contents,
        horizontalTextAlignment: pages[shelfPages[key]].horizontalAlignment ??
            TextAlignment.START,
        verticalTextAlignment: pages[shelfPages[key]].verticalAlignment ??
            TextAlignment.START
    });
    let sourceEntry = ui.createEntry({
        row: 0,
        column: 1,
        text: 'source' in pages[shelfPages[key]] ?
            pages[shelfPages[key]].source : ''
    });
    let sourceGrid = ui.createGrid({
        isVisible: 'source' in pages[shelfPages[key]],
        columnDefinitions: ['auto', '1*'],
        children: [
            ui.createLatexLabel({
                text: getLoc('labelSource'),
                row: 0,
                column: 0,
                horizontalTextAlignment: TextAlignment.START,
                verticalTextAlignment: TextAlignment.CENTER
            }),
            sourceEntry
        ]
    });
    let prevButton = ui.createButton({
        text: getLoc('btnPrev'),
        row: 0,
        column: 0,
        isVisible: shelfPages[key] > 0,
        onClicked: () => {
            Sound.playClick();
            if (shelfPages[key] > 0)
                setPage(shelfPages[key] - 1);
        }
    });
    let viewButton = ui.createButton({
        row: 0, column: 1,
        padding: new Thickness(8, 0),
        heightRequest: getSmallBtnSize(ui.screenWidth),
        text: getLoc('btnView'),
        isVisible: () => 'systemID' in pages[shelfPages[key]],
        onClicked: () => {
            Sound.playClick();
            let menu = createSystemMenu(pages[shelfPages[key]].systemID);
            menu.show();
        }
    });
    let tocButton = ui.createButton({
        text: getLoc('btnContents'),
        row: 0,
        column: 1,
        onClicked: () => {
            Sound.playClick();
            TOCMenu.show();
        }
    });
    let nextButton = ui.createButton({
        text: getLoc('btnNext'),
        row: 0,
        column: 2,
        isVisible: shelfPages[key] < pages.length - 1,
        onClicked: () => {
            Sound.playClick();
            if (shelfPages[key] < pages.length - 1)
                setPage(shelfPages[key] + 1);
        }
    });
    let setPage = (p) => {
        shelfPages[key] = p;
        menu.title = Localization.format(getLoc('bookTitleFormat'), title, shelfPages[key] + 1, pages.length);
        pageTitle.text = pages[shelfPages[key]].title;
        pageContents.text = pages[shelfPages[key]].contents;
        pageContents.horizontalTextAlignment =
            pages[shelfPages[key]].horizontalAlignment ?? TextAlignment.START;
        pageContents.verticalTextAlignment =
            pages[shelfPages[key]].verticalAlignment ?? TextAlignment.START;
        sourceGrid.isVisible = 'source' in pages[shelfPages[key]];
        sourceEntry.text = 'source' in pages[shelfPages[key]] ?
            pages[shelfPages[key]].source : '';
        prevButton.isVisible = shelfPages[key] > 0;
        nextButton.isVisible = shelfPages[key] < pages.length - 1;
        viewButton.isVisible = 'systemID' in pages[shelfPages[key]];
    };
    let getContentsTable = () => {
        let children = [];
        for (let i = 0; i < tableofContents.length; ++i) {
            children.push(ui.createLatexLabel({
                text: pages[tableofContents[i]].title,
                row: i,
                column: 0,
                verticalTextAlignment: TextAlignment.CENTER
            }));
            children.push(ui.createButton({
                text: Localization.format(getLoc('btnPage'), tableofContents[i] + 1),
                row: i,
                column: 1,
                heightRequest: getSmallBtnSize(ui.screenWidth),
                onClicked: () => {
                    Sound.playClick();
                    setPage(tableofContents[i]);
                    TOCMenu.hide();
                }
            }));
        }
        return children;
    };
    let TOCMenu = ui.createPopup({
        title: getLoc('menuToC'),
        content: ui.createScrollView({
            // heightRequest: ui.screenHeight * 0.36,
            content: ui.createGrid({
                columnDefinitions: ['80*', '20*'],
                children: getContentsTable()
            })
        })
    });
    let menu = ui.createPopup({
        title: Localization.format(getLoc('bookTitleFormat'), title, shelfPages[key] + 1, pages.length),
        isPeekable: true,
        content: ui.createStackLayout({
            children: [
                ui.createGrid({
                    horizontalOptions: LayoutOptions.CENTER,
                    columnDefinitions: ['auto', 'auto'],
                    columnSpacing: 8,
                    children: [
                        pageTitle,
                        viewButton,
                    ]
                }),
                ui.createFrame({
                    padding: new Thickness(8, 6),
                    heightRequest: ui.screenHeight * 0.36,
                    content: ui.createScrollView({
                        content: ui.createStackLayout({
                            children: [
                                pageContents,
                                sourceGrid
                            ]
                        })
                    })
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createGrid({
                    columnDefinitions: ['30*', '40*', '30*'],
                    children: [
                        prevButton,
                        tocButton,
                        nextButton
                    ]
                })
            ]
        })
    });
    return menu;
};
let createWaterMenu = () => {
    let plantLabels = [];
    let maxStageEntries = [];
    // let harvestEntries = [];
    for (let i = 0; i <= plantPerma.level; ++i) {
        if (autoWaterConfig[plantUnlocks[i]]) {
            plantLabels.push(ui.createLatexLabel({
                text: getLoc('plants')[plantUnlocks[i]].name,
                row: i, column: 0,
                verticalTextAlignment: TextAlignment.CENTER
            }));
            let tmpEntry = ui.createEntry({
                column: 0,
                text: autoWaterConfig[plantUnlocks[i]].maxStage == INT_MAX ?
                    '∞' : autoWaterConfig[plantUnlocks[i]].maxStage?.toString() ??
                    '?',
                keyboard: Keyboard.NUMERIC,
                horizontalTextAlignment: TextAlignment.END,
                onTextChanged: (ot, nt) => {
                    let tmpML = parseInt(nt) ?? INT_MAX;
                    if (isNaN(tmpML))
                        tmpML = INT_MAX;
                    autoWaterConfig[plantUnlocks[i]].maxStage = tmpML;
                }
            });
            let tmpMinusBtn = ui.createButton({
                column: 1,
                text: '–',
                onClicked: () => {
                    Sound.playClick();
                    let l = autoWaterConfig[plantUnlocks[i]].maxStage;
                    if (l > 0 && l < INT_MAX)
                        tmpEntry.text = (l - 1).toString();
                    else
                        tmpEntry.text = '∞';
                }
            });
            let tmpPlusBtn = ui.createButton({
                column: 2,
                text: '+',
                onClicked: () => {
                    Sound.playClick();
                    let l = autoWaterConfig[plantUnlocks[i]].maxStage;
                    if (l < INT_MAX)
                        tmpEntry.text = (l + 1).toString();
                    else
                        tmpEntry.text = '0';
                }
            });
            let tmpGrid = ui.createGrid({
                row: i, column: 1,
                columnDefinitions: ['2*', '1*', '1*'],
                children: [
                    tmpEntry,
                    tmpMinusBtn,
                    tmpPlusBtn
                ]
            });
            maxStageEntries.push(tmpGrid);
            // TODO: Create harvest entry
        }
    }
    let noteGrid = ui.createGrid({
        columnDefinitions: ['1*', '1*'],
        children: [...plantLabels, ...maxStageEntries]
    });
    let menu = ui.createPopup({
        isPeekable: true,
        title: getLoc('menuAutoWater'),
        content: ui.createStackLayout({
            children: [
                ui.createGrid({
                    heightRequest: getImageSize(ui.screenWidth),
                    columnDefinitions: ['1*', '1*'],
                    children: [
                        ui.createLatexLabel({
                            text: getLoc('labelSpecies'),
                            row: 0, column: 0,
                            verticalTextAlignment: TextAlignment.CENTER
                        }),
                        ui.createLatexLabel({
                            text: getLoc('labelMaxStage'),
                            row: 0, column: 1,
                            horizontalOptions: LayoutOptions.CENTER,
                            verticalTextAlignment: TextAlignment.CENTER
                        })
                    ]
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createScrollView({
                    content: noteGrid
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createLatexLabel({
                    text: getLoc('labelAutoWaterDesc'),
                    fontSize: 12,
                    margin: new Thickness(0, 0, 0, 4),
                    // heightRequest: getProgBarSize(ui.screenWidth),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.CENTER
                }),
                ui.createButton({
                    text: Localization.get('GenPopupClose'),
                    onClicked: () => {
                        Sound.playClick();
                        menu.hide();
                    }
                }),
            ]
        })
    });
    return menu;
};
let createNotebookMenu = () => {
    let plantLabels = [];
    let maxLevelEntries = [];
    // let harvestEntries = [];
    for (let i = 0; i <= plantPerma.level; ++i) {
        if (!notebook[plantUnlocks[i]]) {
            notebook[plantUnlocks[i]] =
                {
                    maxLevel: INT_MAX,
                    harvestStage: INT_MAX
                };
        }
        plantLabels.push(ui.createLatexLabel({
            text: getLoc('plants')[plantUnlocks[i]].name,
            row: i, column: 0,
            verticalTextAlignment: TextAlignment.CENTER
        }));
        let tmpEntry = ui.createEntry({
            column: 0,
            text: notebook[plantUnlocks[i]].maxLevel == INT_MAX ? '∞' :
                notebook[plantUnlocks[i]].maxLevel?.toString() ?? '?',
            keyboard: Keyboard.NUMERIC,
            horizontalTextAlignment: TextAlignment.END,
            onTextChanged: (ot, nt) => {
                let tmpML = parseInt(nt) ?? INT_MAX;
                if (isNaN(tmpML))
                    tmpML = INT_MAX;
                notebook[plantUnlocks[i]].maxLevel = tmpML;
                // for(let j = 0; j < nofPlots; ++j)
                //     plants[j][plantUnlocks[i]].maxLevel = tmpML;
            }
        });
        let tmpMinusBtn = ui.createButton({
            column: 1,
            text: '–',
            onClicked: () => {
                Sound.playClick();
                let l = notebook[plantUnlocks[i]].maxLevel;
                if (l > 0 && l < INT_MAX)
                    tmpEntry.text = (l - 1).toString();
                else
                    tmpEntry.text = '∞';
            }
        });
        let tmpPlusBtn = ui.createButton({
            column: 2,
            text: '+',
            onClicked: () => {
                Sound.playClick();
                let l = notebook[plantUnlocks[i]].maxLevel;
                if (l < INT_MAX)
                    tmpEntry.text = (l + 1).toString();
                else
                    tmpEntry.text = '0';
            }
        });
        let tmpGrid = ui.createGrid({
            row: i, column: 1,
            columnDefinitions: ['2*', '1*', '1*'],
            children: [
                tmpEntry,
                tmpMinusBtn,
                tmpPlusBtn
            ]
        });
        maxLevelEntries.push(tmpGrid);
        // TODO: Create harvest entry
    }
    let noteGrid = ui.createGrid({
        columnDefinitions: theory.isAutoBuyerAvailable ? ['40*', '30*', '30*'] :
            ['50*', '50*'],
        children: [...plantLabels, ...maxLevelEntries]
    });
    let menu = ui.createPopup({
        isPeekable: true,
        title: getLoc('menuNote'),
        content: ui.createStackLayout({
            children: [
                ui.createGrid({
                    heightRequest: getImageSize(ui.screenWidth),
                    columnDefinitions: ['1*', '1*'],
                    children: [
                        ui.createLatexLabel({
                            text: getLoc('labelSpecies'),
                            row: 0, column: 0,
                            verticalTextAlignment: TextAlignment.CENTER
                        }),
                        ui.createLatexLabel({
                            text: getLoc('labelMaxLevel'),
                            row: 0, column: 1,
                            horizontalOptions: LayoutOptions.CENTER,
                            verticalTextAlignment: TextAlignment.CENTER
                        }),
                    ]
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createScrollView({
                    content: noteGrid
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createLatexLabel({
                    text: getLoc('labelNoteDesc'),
                    fontSize: 12,
                    margin: new Thickness(0, 0, 0, 4),
                    // heightRequest: getProgBarSize(ui.screenWidth),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.CENTER
                }),
                ui.createButton({
                    text: Localization.get('GenPopupClose'),
                    onClicked: () => {
                        Sound.playClick();
                        menu.hide();
                    }
                }),
            ]
        })
    });
    return menu;
};
let createShelfMenu = () => {
    let menu = ui.createPopup({
        // isPeekable: true,
        title: getLoc('permaShelf'),
        content: ui.createStackLayout({
            children: [
                ui.createButton({
                    text: LsManual.title,
                    onClicked: () => {
                        Sound.playClick();
                        let menu = createBookMenu(LsManual);
                        menu.show();
                    }
                }),
                ui.createButton({
                    text: almanac.title,
                    onClicked: () => {
                        Sound.playClick();
                        let menu = createBookMenu(almanac);
                        menu.show();
                    }
                }),
                ui.createButton({
                    text: getLoc('menuAutoWater'),
                    onClicked: () => {
                        Sound.playClick();
                        let menu = createWaterMenu();
                        menu.show();
                    }
                }),
                ui.createButton({
                    isVisible: theory.isBuyAllAvailable,
                    text: getLoc('menuNote'),
                    onClicked: () => {
                        Sound.playClick();
                        let menu = createNotebookMenu();
                        menu.show();
                    }
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createButton({
                    text: Localization.get('SettingsPopupTitle'),
                    onClicked: () => {
                        Sound.playClick();
                        let menu = createWorldMenu();
                        menu.show();
                    }
                }),
                ui.createLatexLabel({
                    text: getLoc('versionName'),
                    fontSize: 12,
                    margin: new Thickness(0, 4, 0, 0),
                    horizontalOptions: LayoutOptions.CENTER,
                    horizontalTextAlignment: TextAlignment.CENTER,
                    verticalTextAlignment: TextAlignment.CENTER
                })
            ]
        })
    });
    return menu;
};
let createConfirmationMenu = (plot, index, id) => {
    let c = manager.colonies[plot][index];
    let menu = ui.createPopup({
        // isPeekable: true,
        title: Localization.get('GenPopupConfirm'),
        content: ui.createStackLayout({
            children: [
                ui.createLatexLabel({
                    text: Localization.format(getLoc('actionConfirm'), getLoc('labelActions')[id], plot + 1, index + 1, manager.colonies[plot].length, getColonyTitleString(c, false, false, true), getLoc('plants')[c.id]?.actions?.[id] ?? '', Localization.get('GenPopupContinue')),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    margin: new Thickness(0, 15)
                }),
                ui.createGrid({
                    columnDefinitions: ['1*', '1*'],
                    // minimumHeightRequest: getBtnSize(ui.screenWidth),
                    children: [
                        ui.createButton({
                            column: 0,
                            text: Localization.get('GenPopupYes'),
                            onClicked: () => {
                                Sound.playClick();
                                manager.queueAction(plot, index, id);
                                menu.hide();
                            }
                        }),
                        ui.createButton({
                            column: 1,
                            text: Localization.get('GenPopupNo'),
                            onClicked: () => {
                                Sound.playClick();
                                menu.hide();
                            }
                        }),
                    ]
                })
            ]
        })
    });
    return menu;
};
let createBulkConfirmationMenu = (plot, id) => {
    let menu = ui.createPopup({
        // isPeekable: true,
        title: Localization.get('GenPopupConfirm'),
        content: ui.createStackLayout({
            children: [
                ui.createLatexLabel({
                    text: Localization.format(getLoc('bulkActionConfirm'), getLoc('labelActions')[id], plot + 1, Localization.get('GenPopupContinue')),
                    horizontalTextAlignment: TextAlignment.CENTER,
                    margin: new Thickness(0, 15)
                }),
                ui.createGrid({
                    columnDefinitions: ['1*', '1*'],
                    // minimumHeightRequest: getBtnSize(ui.screenWidth),
                    children: [
                        ui.createButton({
                            column: 0,
                            text: Localization.get('GenPopupYes'),
                            onClicked: () => {
                                Sound.playClick();
                                for (let i = manager.colonies[plot].length - 1; i >= 0; --i) {
                                    if (isColonyVisible(manager.colonies[plot][i]))
                                        manager.queueAction(plot, i, id);
                                }
                                menu.hide();
                            }
                        }),
                        ui.createButton({
                            column: 1,
                            text: Localization.get('GenPopupNo'),
                            onClicked: () => {
                                Sound.playClick();
                                menu.hide();
                            }
                        }),
                    ]
                })
            ]
        })
    });
    return menu;
};
let createWorldMenu = () => {
    let speedLabel = ui.createLatexLabel({
        text: Localization.format(getLoc('labelSpeed'), parseFloat(speeds[speedIdx].toFixed(2))),
        row: 0, column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let speedSlider = ui.createSlider({
        row: 0, column: 1,
        minimum: -0.25,
        maximum: speeds.length - 0.75,
        value: speedIdx,
        onValueChanged: () => {
            speedIdx = Math.round(speedSlider.value);
            speedLabel.text = Localization.format(getLoc('labelSpeed'), parseFloat(speeds[speedIdx].toFixed(2)));
        },
        onDragCompleted: () => {
            Sound.playClick();
            // speedSlider.value = speedIdx;
        }
    });
    let GM3Label = ui.createLatexLabel({
        column: 0,
        text: getLoc('labelGM3D'),
        verticalTextAlignment: TextAlignment.CENTER
    });
    let GM3Button = ui.createButton({
        column: 1,
        heightRequest: getSmallBtnSize(ui.screenWidth),
        text: getLoc('btnRedraw'),
        onClicked: () => {
            Sound.playClick();
            renderer.redrawing = true;
        }
    });
    let GM3Grid = ui.createGrid({
        row: 7, column: 0,
        columnDefinitions: ['73*', '60*', '7*'],
        children: [
            GM3Label,
            GM3Button
        ]
    });
    let GM3Switch = createHesitantSwitch({
        row: 7, column: 1
    }, () => {
        graphMode3D = !graphMode3D;
        GM3Switch.isToggled = graphMode3D;
        // GM3Switch.isToggled = !GM3Switch.isToggled;
        // graphMode3D = GM3Switch.isToggled;
    }, graphMode3D);
    let GM2Label = ui.createLatexLabel({
        text: getLoc('lineGraphModes')[graphMode2D],
        row: 6, column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let GM2Slider = ui.createSlider({
        row: 6, column: 1,
        minimum: -0.25,
        maximum: 3 /* LineGraphModes._SIZE */ - 0.75,
        value: graphMode2D,
        onValueChanged: () => {
            graphMode2D = Math.round(GM2Slider.value);
            GM2Label.text = getLoc('lineGraphModes')[graphMode2D];
        },
        onDragCompleted: () => {
            Sound.playClick();
            // GM2Slider.value = graphMode2D;
        }
    });
    let CVMLabel = ui.createLatexLabel({
        text: getLoc('colonyModes')[colonyMode],
        row: 4, column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let CVMSlider = ui.createSlider({
        row: 4, column: 1,
        minimum: -0.25,
        maximum: 4 /* ColonyModes._SIZE */ - 0.75,
        value: colonyMode,
        onValueChanged: () => {
            colonyMode = Math.round(CVMSlider.value);
            CVMLabel.text = getLoc('colonyModes')[colonyMode];
        },
        onDragCompleted: () => {
            Sound.playClick();
            // CMSlider.value = colonyMode;
            theory.invalidatePrimaryEquation();
        }
    });
    let APLabel = ui.createLatexLabel({
        text: getLoc('actionPanelModes')[Number(actionPanelOnTop)],
        row: 3, column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let APSwitch = createHesitantSwitch({
        row: 3, column: 1
    }, () => {
        actionPanelOnTop = !actionPanelOnTop;
        APSwitch.isToggled = actionPanelOnTop;
        // APSwitch.isToggled = !APSwitch.isToggled;
        // actionPanelOnTop = APSwitch.isToggled;
        APLabel.text = getLoc('actionPanelModes')[Number(actionPanelOnTop)];
    }, actionPanelOnTop);
    let PTLabel = ui.createLatexLabel({
        text: getLoc('plotTitleModes')[Number(fancyPlotTitle)],
        row: 2, column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let PTSwitch = createHesitantSwitch({
        row: 2, column: 1
    }, () => {
        fancyPlotTitle = !fancyPlotTitle;
        PTSwitch.isToggled = fancyPlotTitle;
        // PTSwitch.isToggled = !PTSwitch.isToggled;
        // fancyPlotTitle = PTSwitch.isToggled;
        PTLabel.text = getLoc('plotTitleModes')[Number(fancyPlotTitle)];
        theory.invalidatePrimaryEquation();
    }, fancyPlotTitle);
    let ACLabel = ui.createLatexLabel({
        text: getLoc('labelActionConfirm'),
        row: 1, column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let ACSwitch = createHesitantSwitch({
        row: 1, column: 1
    }, () => {
        actionConfirm = !actionConfirm;
        ACSwitch.isToggled = actionConfirm;
        // ACSwitch.isToggled = !ACSwitch.isToggled;
        // actionConfirm = ACSwitch.isToggled;
    }, actionConfirm);
    let QBLabel = ui.createLatexLabel({
        text: getLoc('quatModes')[quatMode],
        row: 5, column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let QBSlider = ui.createSlider({
        row: 5, column: 1,
        minimum: -0.25,
        maximum: 5 /* QuaternaryModes._SIZE */ - 0.75,
        value: quatMode,
        onValueChanged: () => {
            quatMode = Math.round(QBSlider.value);
            QBLabel.text = getLoc('quatModes')[quatMode];
        },
        onDragCompleted: () => {
            Sound.playClick();
            // QBSlider.value = quatMode;
            theory.invalidateQuaternaryValues();
        }
    });
    let CMLabel = ui.createLatexLabel({
        text: getLoc('camModes')[cameraMode],
        row: 8, column: 0,
        verticalTextAlignment: TextAlignment.CENTER
    });
    let CMSlider = ui.createSlider({
        row: 8, column: 1,
        minimum: -0.25,
        maximum: 3 /* CameraModes._SIZE */ - 0.75,
        value: cameraMode,
        onValueChanged: () => {
            cameraMode = Math.round(CMSlider.value);
            CMLabel.text = getLoc('camModes')[cameraMode];
        },
        onDragCompleted: () => {
            Sound.playClick();
            renderer.configure(null, null, { mode: cameraMode }, {}, false);
            theory.invalidateQuaternaryValues();
        }
    });
    let menu = ui.createPopup({
        isPeekable: true,
        title: Localization.get('SettingsPopupTitle'),
        content: ui.createStackLayout({
            children: [
                ui.createGrid({
                    columnDefinitions: ['70*', '30*'],
                    rowDefinitions: [
                        getSmallBtnSize(ui.screenWidth),
                        getSmallBtnSize(ui.screenWidth),
                        getSmallBtnSize(ui.screenWidth),
                        getSmallBtnSize(ui.screenWidth),
                        getSmallBtnSize(ui.screenWidth),
                        getSmallBtnSize(ui.screenWidth),
                        getSmallBtnSize(ui.screenWidth)
                    ],
                    children: [
                        GM3Grid,
                        GM3Switch,
                        GM2Label,
                        GM2Slider,
                        CVMLabel,
                        CVMSlider,
                        APLabel,
                        APSwitch,
                        PTLabel,
                        PTSwitch,
                        ACLabel,
                        ACSwitch,
                        QBLabel,
                        QBSlider,
                        speedLabel,
                        speedSlider,
                        CMLabel,
                        CMSlider
                    ]
                }),
                ui.createBox({
                    heightRequest: 1,
                    margin: new Thickness(0, 6)
                }),
                ui.createGrid({
                    minimumHeightRequest: getBtnSize(ui.screenWidth),
                    columnDefinitions: ['50*', '50*'],
                    children: [
                        ui.createButton({
                            column: 0,
                            text: Localization.get('GenPopupClose'),
                            onClicked: () => {
                                Sound.playClick();
                                menu.hide();
                            }
                        }),
                        ui.createButton({
                            column: 1,
                            text: getLoc('btnReset'),
                            onClicked: () => {
                                Sound.playClick();
                                renderer.reset(true);
                            }
                        })
                    ]
                })
            ]
        })
    });
    return menu;
};
var isCurrencyVisible = (index) => !index;
var getTau = () => currency.value.max(BigNumber.ZERO).pow(tauRate);
var getCurrencyFromTau = (tau) => [
    // @ts-expect-error
    tau.pow(BigNumber.ONE / tauRate),
    currency.symbol
];
var prePublish = () => {
    // @ts-expect-error
    taxCurrency.value = getCurrencyFromTau(theory.tau)[0] * taxRate;
    // @ts-expect-error
    tmpCurrency = currency.value - taxCurrency.value;
    tmpLevels = Array.from({ length: nofPlots }, (_) => []);
};
// You can be in debt for this lol
var postPublish = () => {
    currency.value = tmpCurrency;
    actuallyPlanting = false;
    tmpLevels = Array.from({ length: nofPlots }, (_) => { return {}; });
    for (let i = 0; i < nofPlots; ++i) {
        for (let j = 0; j < manager.colonies[i].length; ++j) {
            let c = manager.colonies[i][j];
            if (!tmpLevels[i][c.id])
                tmpLevels[i][c.id] = 0;
            if (!c.propagated)
                tmpLevels[i][c.id] += c.population;
        }
        for (let j = 0; j < plantUnlocks.length; ++j)
            plants[i][plantUnlocks[j]].level = tmpLevels[i][plantUnlocks[j]];
    }
    actuallyPlanting = true;
    theory.invalidateQuaternaryValues();
};
var canResetStage = () => false;
var getResetStageMessage = () => getLoc('resetRenderer');
var resetStage = () => renderer.reset(true);
// go to prev next stage
// Copied from the ol Oiler's Formula
let bigStringify = (_, val) => {
    try {
        if (val instanceof BigNumber)
            return 'BigNumber' + val.toBase64String();
    }
    catch { }
    ;
    return val;
};
let unBigStringify = (_, val) => {
    if (val && typeof val === 'string') {
        if (val.startsWith('BigNumber'))
            return BigNumber.fromBase64String(val.substring(9));
    }
    return val;
};
var getInternalState = () => {
    // if(manager.busy)
    //     return '';
    lastSave = time;
    return JSON.stringify({
        version,
        haxEnabled,
        time,
        plotIdx,
        colonyIdx: slotIdx,
        plantIdx,
        finishedTutorial,
        manager,
        settings: {
            speedIdx,
            graphMode2D,
            graphMode3D,
            colonyMode,
            fancyPlotTitle,
            actionPanelOnTop,
            actionConfirm,
            quatMode,
            cameraMode
        },
        colonyViewConfig,
        shelfPages,
        autoWaterConfig,
        notebook,
        gameRNG
    }, bigStringify);
};
var setInternalState = (stateStr) => {
    let state;
    let v = version;
    if (stateStr) {
        state = JSON.parse(stateStr, unBigStringify);
        v = state.version ?? version;
        if ('haxEnabled' in state) {
            haxEnabled = state.haxEnabled ?? haxEnabled;
            freePenny.isAvailable = haxEnabled;
            pauseGame.isAvailable = haxEnabled;
            if (pauseGame.level)
                theory.pause();
            trueSight.isAvailable = haxEnabled;
            warpTick.isAvailable = haxEnabled;
            warpDay.isAvailable = haxEnabled;
            warpWeek.isAvailable = haxEnabled;
            warpYear.isAvailable = haxEnabled;
            warpZero.isAvailable = haxEnabled;
        }
        if ('time' in state) {
            time = state.time ?? time;
            let cycles = time / dayLength;
            days = Math.floor(cycles);
            years = binarySearchLast(yearStartLookup, days);
            let phase = saturate(cycles - days - 0.25, 0, 0.5);
            insolationIntegral = days * dayLength / Math.PI - halfDayLength *
                (Math.cos(phase * 2 * Math.PI) - 1) / Math.PI;
            growthIntegral = time + quarterDayLength *
                Math.sin(time * Math.PI / halfDayLength) / Math.PI;
            lastSave = time;
        }
        plotIdx = state.plotIdx ?? plotIdx;
        slotIdx = state.colonyIdx ?? slotIdx;
        plantIdx = state.plantIdx ?? plantIdx;
        finishedTutorial = state.finishedTutorial ?? finishedTutorial;
        manager = new ColonyManager(state.manager, nofPlots, maxColoniesPerPlot)
            ?? manager;
        if (v < 0.105) {
            for (let i = 0; i < manager.length; ++i)
                for (let j = 0; j < manager.colonies[i].length; ++j)
                    if (typeof manager.colonies[i][j].id === 'number')
                        manager.colonies[i][j].id =
                            plantIDLookup[manager.colonies[i][j].id];
        }
        if (v < 0.04) {
            graphMode2D = state.graphMode2D ?? graphMode2D;
            graphMode3D = state.graphMode3D ?? graphMode3D;
            colonyMode = state.colonyMode ?? colonyMode;
            fancyPlotTitle = state.fancyPlotTitle ?? fancyPlotTitle;
            actionPanelOnTop = state.actionPanelOnTop ?? actionPanelOnTop;
            actionConfirm = state.actionConfirm ?? actionConfirm;
            quatMode = state.quatMode ?? quatMode;
        }
        else if ('settings' in state) {
            speedIdx = state.settings.speedIdx ?? speedIdx;
            graphMode2D = state.settings.graphMode2D ?? graphMode2D;
            graphMode3D = state.settings.graphMode3D ?? graphMode3D;
            colonyMode = state.settings.colonyMode ?? colonyMode;
            fancyPlotTitle = state.settings.fancyPlotTitle ?? fancyPlotTitle;
            actionPanelOnTop = state.settings.actionPanelOnTop ??
                actionPanelOnTop;
            actionConfirm = state.settings.actionConfirm ?? actionConfirm;
            quatMode = state.settings.quatMode ??
                Number(state.settings.quatBoard ?? quatMode);
            cameraMode = state.settings.cameraMode ?? cameraMode;
            renderer.configure(null, null, { mode: cameraMode }, {}, false);
        }
        colonyViewConfig = state.colonyViewConfig ?? colonyViewConfig;
        shelfPages = state.shelfPages ?? shelfPages;
        autoWaterConfig = state.autoWaterConfig ?? autoWaterConfig;
        notebook = state.notebook ?? notebook;
        gameRNG = state.gameRNG ?
            new Xorshift(state.gameRNG.seed, state.gameRNG.aux) : gameRNG;
    }
    manager.registerSpawner(dandelionSpawner);
    manager.registerSpawner(broomrapeSpawner);
    manager.registerSpawner(hopleekSpawner);
    actuallyPlanting = false;
    tmpLevels = Array.from({ length: nofPlots }, (_) => { return {}; });
    for (let i = 0; i < nofPlots; ++i) {
        for (let j = 0; j < manager.colonies[i].length; ++j) {
            let c = manager.colonies[i][j];
            if (v < 0.1) {
                if (!c.diReserve)
                    c.diReserve = BigNumber.ZERO;
                if (!c.dgReserve)
                    c.dgReserve = BigNumber.ZERO;
                if (plantData[c.id].dailyIncome && !c.ddReserve)
                    c.ddReserve = BigNumber.ZERO;
            }
            if (!tmpLevels[i][c.id])
                tmpLevels[i][c.id] = 0;
            if (!c.propagated)
                tmpLevels[i][c.id] += c.population;
        }
        for (let j = 0; j < plantUnlocks.length; ++j) {
            plants[i][plantUnlocks[j]].level = tmpLevels[i][plantUnlocks[j]];
        }
    }
    actuallyPlanting = true;
    selectedColony = manager.colonies[plotIdx][slotIdx[plotIdx]];
    if (selectedColony)
        renderer.colony = selectedColony;
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    // theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
    updateAvailability();
};
var get2DGraphValue = () => {
    switch (graphMode2D) {
        case 0 /* LineGraphModes.OFF */:
            return 0;
        case 1 /* LineGraphModes.INSOLATION */: // Insolation
            return insolationCoord;
        case 2 /* LineGraphModes.GROWTH */: // Growth
            return growthCoord / 2;
    }
};
var get3DGraphPoint = () => {
    if (graphMode3D && !manager.busy) {
        perfs[6 /* Profilers.RENDERER */].exec(() => {
            renderer.draw();
        });
    }
    return renderer.cursor;
};
var get3DGraphTranslation = () => renderer.camera;
init();

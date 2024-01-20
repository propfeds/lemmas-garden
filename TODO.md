# To-do List

- [To-do List](#to-do-list)
  - [Research](#research)
  - [Compost bin](#compost-bin)
  - [v0.3: Invasion](#v03-invasion)
  - [v0.2: Wet](#v02-wet)
  - [v0.1: Slumber Seeds](#v01-slumber-seeds)
  - [v0: Axiom](#v0-axiom)

## Research

- [ ] Investigate educational game [design categories](https://www.sciencedirect.com/science/article/abs/pii/S0747563218304771)
  - Accuracy feedback
  - Unlimited/multiple attempts
  - Information tutorials and hints
  - Focused constraint
  - Progressive levels
  - Game efficiency

- [ ] Are single-player games [that weak?](https://www.sciencedirect.com/science/article/abs/pii/S0360131522002214)
  - Hold on, collaborative and social interactions. Discord! Reddit!

Since the number of questionnaires is not so large, qualitative evaluation instead of quantitative evaluation is acceptable at least at this point. The aims of the game, such as "incorporates the mechanics of L-systems in order to provide an interesting learning experience" or "provide ways to enhance players' arithmetic skills and strategic thinking" etc, are described ex. at the beginning of "2. Methods", so you will examine the degree to which they have been achieved or not, item by item.

to the idea of a simple plant before calendula: that's a good idea
the concept of l-systems is the growing sequence and such
maybe make a first plant that features just the (a -> b, b -> ab) sequence and then add the orientation and conditions later on in its life

basically it only focuses on plant growth instead of the actual l-systems , which I find a bit lacking
you have to dig really deep to find the underlying systems behind the plants

## Compost bin

- [ ] Get rid of daily income in the code
  - Unless there's a use for it

- [ ] Unlock conditions for each page in Lemma's book

- [ ] Tag various stuffs with readonly
- [ ] Change getLoc() to just assign loc folder at start and access a property

- [ ] Colour schemes?
- [ ] Timer function to measure growth
  - Device time measured by user is sufficient?

- [ ] Gangsta should actually store the colony reference?
  - Internal state unfriendly

- [ ] Different aspect ratios hav different graph bounds

- [ ] Compost
  - Has STAGES?
  - Supply energy
    - Don't we already have so many things that give energy

- [ ] Bundle time and coordinates into the manager class
  - [ ] Following LT's method, could also bundle the plant upgrades too

- [ ] Ask Uni of Calgary about how to make Ls easier to understand
  - Provide context: making a game about the logical aspects of Ls
  - [x] Initial email

- [ ] Change /sec indicators to /hr (in-game) and display 5x the value
  - Counter-argument: all parameters display /sec

- [ ] Popup title gets truncated on iOS if it exceeds 1 line

- [ ] Autobuy upgrade unlocks harvest automation config
  - Only unlocks in a future update (classmates!)
  - Hard to implement since there's more to LG than when to harvest

- [ ] Apex models for plants
  - [ ] Pea
  - [ ] Calendula
  - [ ] Basil
  - [ ] Campion
  - [ ] Hopleek
  - [ ] Broomrape
  - [ ] Ginger
  - [ ] Sunflower

## v0.3: Invasion

- [ ] Move references from loc strings to the Book class
- [ ] Add reference to Param LSR
- [x] Test book icon
- [x] Add almanac access button to view menu
- [x] Move 'view Ls' button on book menu to top side near title
- [x] Make the column spacing x1.5 if there's no tax and make it branchless
- [x] On confirmation dialogue, have the action described (like in L-s menu)
- [x] Dynamical system inaccuracies
  - Context: basil is pruned at stg 0 (synth rate is 0), plant can only grow when watering. Watering should give multiples of 2 energy, but when evolving, some of the energy is truncated.
  - Well, just inaccuracies in general
  - Let's ask someone about them

- [ ] Address Lemma's attitude
  - Early game should be the time when a lot of help is needed, don't neglect your student
  - [ ] Narration revamp
    - [x] Narration tracks (as an integer)
      - [x] Basil pruned track
      - [x] Basil unpruned track
    - Lemma should also know about L-systems and tell students what rule is being enacted
    - [ ] Calendula
    - [ ] Basil
    - [ ] Campion

- [x] Pre-calendula plant:
  - [x] Pea or mung sprout
    - [x] Narration
  - [ ] Simple solitary flower
    - Tulip? But tulip is much more fancier...
    - Buttercup

- [ ] Calendula
  - [ ] Flower transforms into fruit with lower profit
    - Or maybe not, it's the tutorial plant.
  - [ ] Implement some kind of puzzle?

- [ ] Basil
  - [ ] Reversible leaf decay when pruning?
  - [ ] Align the vibes of basil & campion to make it feel smoother
  - [ ] Unlock way sooner?
  - [ ] Two types of leaf: 2 params and 3 params
  - [ ] Two types of signal: 0 and 1 params
  - [x] Rewrite instructions to encourage blooming
    - Stg 24: 'It's about to bloom soon. Cutting the bud now or watching flowers later, it's up to you.'
    - Separate stg 26 and 27 description for basil, and only stg 27 has the signal explanation
  - [ ] Add a Pruned commentary track

- [x] Rose campion
  - [ ] Shrub form
  - [ ] Lower leaf size limit
  - [ ] Why does it have 3 symbols on stage 1?
    - Remove the & after adding shrub form
  - [ ] Make the flowers' incomes easier to calculate
  - [ ] Standalone game: spread to nearby plot instead of same plot
  - [x] Nerf spreading rate to 1/2 or sth?
  - [ ] Make it easy to calculate profit sum
  - [x] Change the propagation stage since fruit only starts generating at 19?
  - [x] Income per evolution instead of night
  - [x] Double growth cost
  - [ ] Flower turns into fruit faster
  - [x] Fruit falls off
  - [x] Add a parameter to adjust stagely income multiplier (1/2x for now?)
  - [x] Passive income
  - [x] Nerf growth cost from 4 to 5? Stage 21 is so fast, how about 28?
  - [x] Extend rose campion seed period by a few stages
  - [x] Dialogue:
  'Oh no. Maybe luminaries were right all along. Small campion, big campion,...'

- [ ] Dandelion
  - Spawn on random plot
    - [ ] Implement RNG engine

- [ ] Hopleek
  - Biting is on evolution queue instead of action?
  - [x] Leap years calculation
    - [ ] 400-year cycle wrapping
  - [ ] Hopleek schedule
  - [ ] Repelled by rose campions and sunflowers
  - [ ] Or maybe repelled by calendula and basil?

- [ ] Broomrape
  - [ ] Schedule
    - Once per 2 years? Doesn't it make broomrape faster than hopleek?
  - [ ] Propagation method
  - [ ] Get into people's shoes

- [ ] Ginger

- [ ] Sunflower

- [ ] Universal income upgrades
- [ ] Newspapers

- [x] Watering
  - [ ] Instead of putting watering on a cooldown, make it a coefficient curve or slope that either deducts or increases energy based on the last time the plant was watered. This will communicate the effects of overwatering better?
  - [ ] Auto-watering: unlocks with classmates
  - [ ] Bulk watering when holding button
    - Waters everything on 1 plot, not the entire garden
    - NO bulk harvest or prune.
  - [x] Make watering required for every stage, else the plant won't evolve.
    - [x] Timing: only make it available after half of the growth has been filled?
    - [x] Auto-watering: unlocks for free (right away, or maybe after the next plant has been unlocked) with configurable stage. That means you have likely understood this plant's growth.
    - Some plants don't need watering to evolve, such as grasses.
    - [ ] Plants start at negative stage so watering won't give too much energy?

## v0.2: Wet

- [x] Enums
- [x] Use toJSON() for classes

- [x] Button that skips tutorial for iOS players
- [x] Dedicated save file for playtesting
- [x] Rework singular upgrade logic
  - Turn switch plant into regular upgrade

- [x] Explain plant mechanics in Lemma's book: energy, growth
- [x] Explain symbols without parameters in Ls book

- [x] C-style float render (6 digits, then truncate zeroes)
  - [x] Reconstruction
  - [x] Settings

- [x] Time scale (reference is with ad boost - 1.5x speed)
  - current scale (144)
    1 hr -> 4 sec
    1 day -> 96 sec
    900 days -> 1 day
  - new scale (180) better aligned with irl time
    1 hr -> 5 sec
    1 day -> 2 min
    720 days -> 1 day
  - [x] Get rid of ad boost and make speed a slider

- [x] Chapter about floods
  - Happens when maximum statements
  - Condition: tau > 0, time < 10

- [x] Propagation
  - Rate = sum of seeds or fixed rate at fixed time?
  - [x] Has a specified stage instead of max stage?
    - Calendula still keeps max stage to develop patience
  - Has priority array `rlc`
    - [x] Add dynamic directions (`m` for min, `M` for max)
  - Spreaded colonies syntax: +1 of Rose campion
  - [x] Propagated colonies inherit the di and dg reserves

- [x] Watering
  - Absurd cooldown like 10 minutes (6 days)
    - Per species?
  - Adds a fixed amount of energy?
    - Scales lightly with stage, hmm.
  - [x] Extend each species to accomodate for watering change
    - [x] Opportunity to standardise countdown params
  - [x] Lemma book entry

- [x] Colony view params are initially off
- [x] Notebook shows next cost

- Calendula
  - [x] Nerf spread rate to 1/3? Sum equals 1.5 making the pub mult coefficient 2 instead of 1.8

- [x] Basil
  - [x] Signal type 1 kills I?
  - [x] Adjust starting cost: 1 → 1.25
  - [ ] Double starting cost but 2, 10 stepwise?
  - [x] More delay before flowering (maybe stg 24 flowers)
  - [x] Decrease max stage
  - [x] Apex decreases synthesis when spawning leaves
  - [x] Side shoots grow more leaves but smaller
  - [x] Flower gives income? Can be made into tea - although should shrink
  their power immensely
  - [ ] Bees love flowers too?!!
  - [ ] https://gardenbenchtop.com/what-happens-when-basil-flowers/

- [x] Preference table for decimal places
- [x] Confirmation to harvest/prune
  - Options menu
- [x] updateAvailability() slow
- [x] Bookshelf unlocks after tutorial to avoid confusion with unlock plot

- [x] Follow canonical parametric L-system logic
  - A production matches a module in a parametric word if the following conditions are met: [...] The number of actual parameters in the module is equal to the number of formal parameters in the production predecessor.
- [x] Change how the Action class works
  - Remove `killColony`
  - Kill colony if `system` doesn't exist

## v0.1: Slumber Seeds

- [x] Cap colony count to 5 per plot, unless?

- [x] Remove seed field from L-s menu

- [x] Evolution/redraw sends Redraw signal
  - Instead of going straight to origin, it backtracks

- [x] Buy All upgrade unlocks maxLevel config
  - [x] +/- buttons for adjusting maxLevel

- [x] Make the colony menu give commentary, while the stats are always
displayed on screen
  - [x] Replace stage 0 commentary with Lemma dialogue
- [x] Almanac containing plants, L-system help, etc.
  - [x] Move notebook inside
  - [x] Move the teaching from commentary to almanac

- [x] Progression (solid? maybe!)
  - [x] Double tau growth
  - [x] Divide pub mult by 2
  - [x] Don't divide ln by 2
  - [x] Double initial price of calendula and basil

- [x] Buff basil
  - [x] Rewrite descriptions for basil to reflect new balance changes
  - [x] If stage lower than first leaf, give the usual intro (move that inside
  the stages object)

## v0: Axiom

- [x] Make at least 2 plants
  - [x] Idleable plant: calendula
    - [x] Fix flower model size
    - [x] Model leaves
    - [x] Write description, LS description and commentary
  - [x] Fast 'active' plant: basil
    - [x] Write description, LS description and commentary
- [x] Icons
  - [ ] SVG? Doesn't work
  - [x] Theme-dependent colour?
- [x] View menu has filter function that only shows certain symbols
  - [x] Also option to view seq without params
  - [x] Save plant-dependent filter configs
- [x] Revamp PLANT_DATA structure and the unlocking of new plants
- [x] Separate 2D & 3D graph options
  - [x] Renderer does not clear graph if 2D graph is enabled
- [x] Binary search can consume a lot of resources per turn
- [x] Settings menu
  - Graph mode
  - Colony view: compact (list), detailed (1), none (only renderer)
    - [x] Stage specific desc?
      - [x] Change binary search direction
      - [x] TODO: grab binary search from old collatz
      - [x] Also include the first line don't 
- [x] Final bit (tau exp line) only shows when no colony
- [x] View colony shows L-system and hmm
- [x] Issue: reloading the theory or something makes the plant levels inaccurate
- [x] Issue: what if an action is performed when a colony is in the middle of an
evolution and tamper with the data mid-way through?
  - Transaction logic lol
- [x] Turn switch plant into singular upgrade that appears when no colony alive

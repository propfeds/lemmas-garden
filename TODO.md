# To-do List

- [To-do List](#to-do-list)
  - [Research](#research)
  - [Compost bin](#compost-bin)
  - [v0.3: Invasion](#v03-invasion)
  - [v0.2: Education edition](#v02-education-edition)
  - [v0.1: Slumber Seeds](#v01-slumber-seeds)
  - [v0: Completed](#v0-completed)

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

- [ ] Research notes
  - Two players share progress with each other daily
  - Some players understand the profit puzzle for calendula, some don't
  - Players enjoy watching plants grow idly
  - Some players can't get pruning basil
  - Some players mistake max stage with max profit
  - Many players are cautious about purchasing expensive items, which isn't the 
  case usually for other theories

- Let's think about it. A plant that takes 80 minutes to grow, and you have to
do nothing. Do you feel like it could be more interesting?

## Compost bin

- [ ] Unlock conditions for each page in Lemma's book

- [ ] Tag various stuffs with readonly
- [x] Enums
- [x] Use toJSON() for classes
- [ ] Change getLoc() to just assign loc folder at start and access a property

- [ ] Simple solitary flower
  - Tulip?
  - Buttercup
  - No need, Cally is already easy to play

- [ ] Colour schemes?
- [ ] Timer function to measure growth
  - Device time measured by user is sufficient?

- [ ] Gangsta should actually store the colony reference?
  - Internal state unfriendly

- [ ] Autobuy upgrade unlocks harvest automation config
  - Only unlocks in a future update (classmates!)
  - Hard to implement since there's more to LG than when to harvest

- [ ] Different aspect ratios hav different graph bounds

- [ ] Newspapers
- [ ] Add a Pruned commentary track
  - 2 lazy

- [ ] Compost
  - Has STAGES?
  - Supply energy
    - Don't we already have so many things that give energy

- [ ] Ask Uni of Calgary about how to make Ls easier to understand
  - Provide context: making a game about the logical aspects of Ls

- [ ] Bulk watering when holding button
  - Waters everything on 1 plot, not the entire garden
  - NO bulk harvest or prune.

## v0.3: Invasion

- [ ] Universal income upgrades

- [ ] Hopleek
  - Biting is on evolution queue instead of action?
  - [x] Leap years calculation
    - [ ] 400-year cycle wrapping
  - [ ] Hopleek schedule
  - [ ] Repelled by rose campions and sunflowers

- [ ] Broomrape

- [ ] Ginger

- [ ] Sunflower

- [ ] Align the vibes of basil & campion to make it feel smoother

- [x] Rose campion as first bush plant
  - [x] Nerf spreading rate to 1/2 or sth?
  - [ ] Make it easy to calculate profit sum
  - [ ] Change the propagation stage since fruit only starts generating at 19?
  - [ ] Maximum statements
  - [ ] Death? Propagation?
  - [ ] Shrub form?
  - [ ] Halve leaf synth
  - [x] Income per evolution instead of night
  - [ ] Double growth cost
  - [ ] Flower turns into fruit faster
  - [x] Fruit falls off
  - [ ] Loading SLOW
  - [ ] Add a parameter to adjust stagely income multiplier (1/2x for now?)
  - [x] Passive income
  - [x] Nerf growth cost from 4 to 5? Stage 21 is so fast, how about 28?
  - [x] Extend rose campion seed period by a few stages

- [x] Button that skips tutorial for iOS players
- [ ] Dedicated save file for playtesting
- [ ] Replace 'view L-system' button with almanac access
- [x] Rework singular upgrade logic
  - Turn switch plant into regular upgrade

- [ ] Change /sec indicators to /hr (in-game) and display 5x the value
  - Counter-argument: all parameters display /sec

## v0.2: Education edition

- Calendula
  - [x] Nerf spread rate to 1/3? Sum equals 1.5 making the pub mult coefficient 2 instead of 1.8

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
  - [ ] Hey, can you imagine an ash tree propagating a MISTLETOE?
    - Mistletoe also eats nutrients like hopleek

- [x] Watering
  - Absurd cooldown like 10 minutes (6 days)
    - Per species?
  - Adds a fixed amount of energy?
    - Scales lightly with stage, hmm.
  - [x] Extend each species to accomodate for watering change
    - [x] Opportunity to standardise countdown params
  - [x] Lemma book entry
  - [ ] Auto-watering
    - Unlocks with classmates

- [x] Colony view params are initially off
- [ ] Notebook shows next cost

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

## v0: Completed

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

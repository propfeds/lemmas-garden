# To-do List

- [To-do List](#to-do-list)
  - [Don't delete](#dont-delete)
  - [v0.1: Rabbits update](#v01-rabbits-update)
  - [v0: Completed](#v0-completed)

## Don't delete

- [ ] Investigate educational game [design categories](https://www.sciencedirect.com/science/article/abs/pii/S0747563218304771)
  - Accuracy feedback
  - Unlimited/multiple attempts
  - Information tutorials and hints
  - Focused constraint
  - Progressive levels
  - Game efficiency

- [ ] Are single-player games [that weak?](https://www.sciencedirect.com/science/article/abs/pii/S0360131522002214)
  - Hold on, collaborative and social interactions. Discord! Reddit!

- [ ] Colour schemes?
- [ ] Timer function to measure growth
  - Device time measured by user is suffice?

- [ ] Gangsta should actually store the colony reference?
  - Internal state unfriendly

## v0.1: Rabbits update

- [ ] Simple solitary flower
  - Tulip?
  - Buttercup
- Leap years and hopleeks
  - [ ] Hopleek
    - Biting is on evolution queue instead of action?
    - [x] Leap years calculation
      - [ ] 400-year cycle wrapping
    - [ ] Hopleek schedule
- [ ] Rose campion as first bush plant
  - Spreadable
- [ ] Sunflower
- [x] Cap colony count to 5 per plot, unless?

- [x] Evolution/redraw sends Redraw signal
  - Instead of going straight to origin, it backtracks

- [ ] Newspapers

- [x] Buy All upgrade unlocks maxLevel config
  - [ ] +/- buttons for adjusting maxLevel
- [ ] Autobuy upgrade unlocks harvest stage config
  - Only unlocks in a future update (students!)

- [ ] Add a Pruned commentary track
- [ ] Replace stage 0 commentary with Lemma dialogue
- [ ] Almanac containing plants, L-system help, etc.
  - [ ] Move notebook inside
  - [ ] Move the teaching from commentary to almanac

- Let's think about it. A plant that takes 80 minutes to grow, and you have to
do nothing. Do you feel like it could be more interesting?

- [x] Progression (solid? maybe!)
  - [x] Double tau growth
  - [x] Divide pub mult by 2
  - [x] Don't divide ln by 2
  - [x] Double initial price of calendula and basil

- [x] Buff basil
- [x] Make the colony menu give commentary, while the stats are always displayed on screen
  - [x] If stage lower than first leaf, give the usual intro (move that inside the stages object)
- [x] Rewrite descriptions for basil to reflect new balance changes
- [x] Remove seed field from L-s menu

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

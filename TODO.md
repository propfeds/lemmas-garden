# To-do List

- [To-do List](#to-do-list)
  - [v0.1: They Breed Like Rabbits!](#v01-they-breed-like-rabbits)
  - [v0: Completed](#v0-completed)

## v0.1: They Breed Like Rabbits!

- [ ] Simple solitary flower
  - Tulip?
  - Buttercup
- [ ] Leap years and hopleeks
- [ ] Sunflower
- [ ] Spreadable plants
- [ ] Cap colony count to 5 per plot, unless?

- [ ] Buff basil

- [ ] Newspapers

- [ ] Almanac containing plants, L-system help, etc.
- [x] Buy All upgrade unlocks maxLevel config
- Autobuy upgrade unlocks harvest stage config
  - [ ] Only unlocks in a future update (students!)
- [x] Make the colony menu give commentary, while the stats are always displayed on screen
  - [x] If stage lower than first leaf, give the usual intro (move that inside the stages object)
- [x] Rewrite descriptions for basil to reflect new balance changes
- [x] Remove seed field from L-s menu

- [ ] Colour schemes?
- [ ] Timer function to measure growth

- [ ] Gangsta should actually store the colony reference?
  - Internal state unfriendly

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

# To-do List

- [To-do List](#to-do-list)
  - [v0.1: They Breed Like Rabbits!](#v01-they-breed-like-rabbits)
  - [v0: Axiom](#v0-axiom)
  - [v0: Completed](#v0-completed)

## v0.1: They Breed Like Rabbits!

- [ ] Leap years and hopleeks
- [ ] Sunflower
- [ ] Spreadable plants
- [ ] Cap colony count to 5 per plot, unless?

- [ ] Newspapers

- [ ] Almanac containing plants, L-system help, etc.
- [ ] Buy All upgrade unlocks maxLevel config
- [ ] Colour schemes?
- [ ] View menu has filter function that only shows certain symbols
  - [ ] Also option to view seq without params

## v0: Axiom 

- [x] Revamp PLANT_DATA structure and the unlocking of new plants
- [x] Separate 2D & 3D graph options
  - [x] Renderer does not clear graph if 2D graph is enabled
- [x] Binary search can consume a lot of resources per turn
- [ ] Make at least 2 plants
  - [ ] Simple solitary flower
    - Tulip?
    - Buttercup
  - [ ] Idleable plant: calendula
  - [x] Fast 'active' plant: basil
    - [ ] Write description, LS description and commentary
- [x] Icons
  - [ ] SVG? Doesn't work
  - [x] Theme-dependent colour?
- [x] Settings menu
  - Graph mode
  - Colony view: compact (list), detailed (1), none (only renderer)
    - [x] Stage specific desc?
      - [x] Change binary search direction
      - [x] TODO: grab binary search from old collatz
      - [x] Also include the first line don't 
- [x] Final bit (tau exp line) only shows when no colony
- [ ] Gangsta should actually store the colony reference?
  - Internal state unfriendly

## v0: Completed

- [x] View colony shows L-system and hmm
- [x] Issue: reloading the theory or something makes the plant levels inaccurate
- [x] Issue: what if an action is performed when a colony is in the middle of an
evolution and tamper with the data mid-way through?
  - Transaction logic lol
- [x] Turn switch plant into singular upgrade that appears when no colony alive

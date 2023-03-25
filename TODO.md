# To-do List

- [To-do List](#to-do-list)
  - [v0.2: They Breed Like Rabbits!](#v02-they-breed-like-rabbits)
  - [v0.1: Sine of the Seasons](#v01-sine-of-the-seasons)
  - [v0: Axiom](#v0-axiom)
  - [v0: Completed](#v0-completed)

## v0.2: They Breed Like Rabbits!

- [ ] Sunflower that powers nearby colonies' photo-synthesis
- [ ] Thyme that speeds up nearby growth?
- [ ] Spreadable plants: Infinite basil! (steeply increase cost to compensate)
  - [ ] Don't forget: flower gender
- [ ] Cap colony count to 5 per plot, unless?

## v0.1: Sine of the Seasons

- [ ] Revamp PLANT_DATA structure and the unlocking of new plants
- [ ] Almanac containing plants, L-system help, etc.
- [ ] Buy All upgrade unlocks maxLevel config
- [ ] Leap years and hopleeks
  - [ ] How to design hopleeks so they won't be annoying?
    - [ ] Rabbits hate marigold's smell
    - [ ] Extra energy protects colonies from rabbit bites
- [ ] Newspapers
- [ ] Colour schemes?
- [ ] View menu has filter function that only shows certain symbols
  - [ ] Also option to view seq without params

## v0: Axiom 

- [x] Separate 2D & 3D graph options
  - [x] Renderer does not clear graph if 2D graph is enabled
- [x] Binary search can consume a lot of resources per turn
- [ ] Make at least 2 plants
  - [ ] First single flower
    - Tulip?
    - Caps at 6 using the recursive formula
    - Trillium: caps at 3, goes from 1 + 0.5x
  - [ ] An idleable plant
    - Marigold is probably best candidate here
  - [x] Third fast/annual plant
    - Candidate: basil (4 weeks/48 mins)
    - Reason: other theories are way faster than this lol
    - Drawback: includes a fucking inflorescence section that is giant and 
    noob-unfriendly
    - [ ] Write description, LS description and commentary
- [x] Icons
  - [ ] SVG?
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

## v0: Completed

- [x] View colony shows L-system and hmm
- [x] Issue: reloading the theory or something makes the plant levels inaccurate
- [x] Issue: what if an action is performed when a colony is in the middle of an
evolution and tamper with the data mid-way through?
  - Transaction logic lol
- [x] Turn switch plant into singular upgrade that appears when no colony alive

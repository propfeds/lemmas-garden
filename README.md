# Lemma's Garden

Gardening theory (mod) for Exponential Idle.

Playstyle: slow, semi active, timing required, reading of plant descriptions

**Lemma because:**

- Her name is Lemma
- You can switch stages like a lemma
- L for L-systems
- There is adversity in the world

## Table of Contents

- [Lemma's Garden](#lemmas-garden)
  - [Table of Contents](#table-of-contents)
  - [Problems](#problems)
    - [1. I don't know gardening.](#1-i-dont-know-gardening)
    - [2. Limitations.](#2-limitations)
    - [3. Quirks.](#3-quirks)
    - [4. Gameplay flow.](#4-gameplay-flow)
  - [Progression](#progression)
    - [1. Cumulative UX](#1-cumulative-ux)
    - [2. Episodic UX](#2-episodic-ux)
  - [World Mechanics](#world-mechanics)
    - [1. Time](#1-time)
    - [2. Space](#2-space)
  - [Plants](#plants)
    - [1. Early-game](#1-early-game)
    - [2. Mid-game](#2-mid-game)
    - [3. Late-game](#3-late-game)
    - [4. Misc](#4-misc)
  - [Tools](#tools)
  - [UI](#ui)
  - [Writing](#writing)

## Problems

### 1. I don't know gardening.

- Just **try watching a lot** of gardening footage to get a general feeling

### 2. Limitations.

- Plants may evolve quickly but **L-system rendering might be too slow** to
update growth in real time
- **Long internal state**?
  - Store version number in it
- L-system can only be used for modelling of **individual plants**,
**not populations**
- Cumulative rho: use `prePublish()` and `postPublish()` to transfer so it won't
reset

### 3. Quirks.

- **Gameplay pattern is unique** from every other theory:
  - All other theories revolve around ever-increasing rho
  - Growth and publish **timing is consistent**, but might be a bit slow

### 4. Gameplay flow.

- Need plant **interactions** with each other, with the seasons, day/night, etc.

## Progression

### 1. Cumulative UX

- **Low publish exponent** and small end game (e45 seems to be a good balance
between tau not feeling bloated and pub multipliers not too small)
  - Journey to **e100** tau (e30 rho) is **short but** from e100 -> e150 is long
  - Can I make it so much fun people want to *replay* the 0 -> e100 section?
- Tau based on **cumulative harvest p** (not called rho, just a p)?
  - **More convenient** than having to hit the advertise button
  - To prevent spamming, **apply a tax** every publish
    ```js
    const SALES_MULT = BigNumber.ONE - BigNumber.from(0.06);  // balancing?
    let cumRho; // value can be used dynamically in a story chapter to explain
    var prePublish = () => cumRho = currencySavings.value;
    var postPublish = () => currencySavings.value = cumRho * SALES_MULT;
    ```
- Tau based on **cumulative money spent on publishing** (adverts)?
  - Spend all money once per month (at any day), which then unlocks the publish
  - Like me, Lemma doesn't stick to a schedule other than a basic alarm clock
  - This will reduce player freedom

### 2. Episodic UX

- Current plants don't get **deleted** when publishing
  - If publishing isn't limited to once per month, then publishing every harvest
  would be annoying but optimal
- Basic **balancing** for activeness vs. income:
  - **Small** flowers and plants are faster and more active
  - But, maybe a flower could grow into a **mid-sized** bush, for a bit less
  income but requires less activity
  - **Big** trees are meant for longer idle sessions late game

## World Mechanics

### 1. Time

- Day night cycles
  - https://www.youtube.com/watch?v=9LgVqx-pV2k
  - Daily harvest schedule for Lemma (10 AM)
  - Day is longer and more active?
- If **1 tick was a minute**, each day would be 1440 ticks (2:24)
  - 1 month in-game = 72 minutes (publish)
  - 1 year in-game ~= 14.6 hours
  - 5 years in-game ~= 3.0416 days IRL
  - Takes about 4~5 years for a big tree to begin bearing fruit
- Clock: **only shows hour of day** and not minutes?
- Well that's too long, we should really at least **double the speed**?
  - 36 minutes per publish isn't coffee-break either, but that's the best we got
  - It could enable fast-paced active play of the leeks
    - Leek season will also come much more quickly
    - But slower speed allows management of multiple plots of leek/mint
  - And, night time will literally no longer matter since time goes by so fast
- Seasonal plants
  - Intro plant must be seasonal to introduce any timing mechanic
- https://homeguides.sfgate.com/plants-grow-fastest-seeds-53378.html

### 2. Space

- **Six plots**, with 5 locked at the beginning
  - First plot unlock comes early
- Different plots may have **different properties**?
  - Might be **too complicated** and **inelegant** - this is not a normal game
  - Also a **river** for diverse gameplay

## Plants

- Growth is **based on sequence length** times a per-plant constant?

### 1. Early-game

- **Quick flower bush** that can grow bigger but slows down of course
  - First free cost
- **Root veggies** that make you guess how big they are?

### 2. Mid-game

- **Sunflowers** & sunflower batteries!
  - Accelerate plant growth in adjacent plots
  - Fact: plants actually grow faster at night, as they photosynthesise in
  daylight, and use the stored energy at night
- **Invasive species** that can slow nearby growth
  - **Three cornered leek** that spreads at a certain population number
    - Rewards active play
  - https://invasiveweedsolutions.co.uk/invasive-weeds/non-native/three-cornered-garlic/
  - Remixed as Hopleek (Bunny Leek) in-game with a weird fictional L-system?

### 3. Late-game

- Long-term **trees for idle**
- **Mint** spreads too - which one is more annoying?
  - Spearmint leaves lose their aromatic appeal after the plant flowers
  - Population growth / logistic map? (with plants that can spread on their own)

### 4. Misc

- Research more: https://hellohomestead.com/dandelions-mint-other-edible-plants-that-spread-and-take-over/
- Snapdragon / toadflax

## Tools

- Other plant parts also useful for growth? Like fertilisers
- Beehives that can spread flowers to adjacent plots
- Burn plots and torchure plants (very in character)
  - Fire spreads too, of course
  - Sunflower is immune
  - Tap repeatedly to extinguish with the nearby river?
  - Fire toggle: first starts burning one by one slowly, then burns faster
    - If it completely burns everything, it will spread to the next plot

## UI

- Reset arrow: invest - does it overlap with publish?
- Top-left overlay: version
- Previous/next arrows: switch plot
- Primary: Plot N - Plant name (pollinated, invaded 250)
- Secondary: x growing, y flowering, z harvestable, w dead
- Tertiary: Year 1, 1th Jan, HH:MM
- Quaternary: six plots, displaying harvestable profit
- Currencies: tau, p, cum p (hidden, or maybe not a currency but a global)
- Variables:
  - Change text display mode: L-system, short description, close inspection
  - Choose plant (only one type of plant per plot, unless leek/mint is
  spreading)
  - Plant
  - Harvest grown plants
    - Idea: harvest with refunds? probably doesn't work but
  - Set up auto-harvest
  - Burn plot (if leek fucks up your plot)
  - ID order:
    - (Plot 1) Harvest (when plot 1 is chosen)
    - (Plot 2~6) Harvest (hidden)
    - (Plot 1) Choose plant (refundable)
    - (Plot 2~6) Choose plant
    - (Plot 1) Plant X (currently chosen)
    - (Plot 1) Other plants (hidden)
    - (Plot 2~6) Plant Y (currently chosen) (for autobuy purposes)
- Upgrades:
  - Alarm clock? In the 18th century? Unlocks auto-harvest and auto-buy.
  - Fire: can burn all plants on a plot, can spread
  - Beehive: boosts spreading of flowers, affected by fire smoke?
- Milestones:

## Writing

I am writing this stuff following the recent break-up between a friend and
I. It's a good opportunity to channel emotions.

- Achievements:
  - Immortal: Celebrate your farm's 50th anniversary.
  - Rabbits on Your Lawn: Let hopleek spread to a plot with a PvZ plant.
- Chapters:
  - Introduction: Yesterday, a small plot of land was registered to Lemma
  Rancher. Today, Lemma's garden does weatherly. Tomorrow, Madeline would be
  proud.
  - First publish: 'Let's see we got... this much from last harvest.
  Minus the sales tax, maintenance, dog food, *plant* food... I wonder why it'd 
  always miraculously add up to {0}% each time? Lemma, [can you] prove this?'
  {1}p had been deducted from Lemma's savings after publishing.
  - Clickable headlines (singular upgrade) after certain points:
    - Hopleek spawning
    - Published adverts
  - e100 tau: Today marked an extraordinary milestone for the eternal farm. For
  the first time, Lemma hosted an excursion with the students from the prestiged
  University of Eldi (Laitnenopxe). Tonight, she had a whole celebration meeting
  with the luminaries.
  At last, under the ensnaring pillow she soundly sleeps, and tomorrow, for 
  once, she would wake up early. Glancing at the golden haze, she would brush 
  her hands over the sunflower's face again... Even if to her, every meaning had
  already lost. (lost -> more like failed)

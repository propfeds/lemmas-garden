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
  - [Permas \& Milestones](#permas--milestones)
  - [Writing](#writing)
    - [1. Achievements:](#1-achievements)
    - [2. Chapters:](#2-chapters)

## Problems

### 1. I don't know gardening.

- No cure for this one.

### 2. Limitations.

- Plants may evolve quickly but **L-system rendering might be too slow** to
update growth in real time
- L-system can only be used for modelling of **individual plants**,
**not populations**

- Lack plant **interactions** with each other, with the seasons, day/night, etc.

## Progression

### 1. Cumulative UX

- **Low publish exponent** and small end game (e45 seems to be a good balance
between tau not feeling bloated and pub multipliers not too small)
  - Journey to **e100** tau (e30 rho) is **short but** from e100 -> e150 is long
  - Can I make it so much fun people want to *replay* the 0 -> e100 section?
- Tau based on **cumulative harvest p** (not called rho, just a p)?
  - **More convenient** than having to hit the advertise button
  - **Only one currency** required
  - To prevent spamming, **apply a tax** every publish
    ```js
    const SALES_MULT = BigNumber.ONE - BigNumber.from(0.12);  // balancing?
    let cumRho; // value can be used dynamically in a story chapter to explain
    var prePublish = () => cumRho = currencySavings.value;
    var postPublish = () => currencySavings.value = cumRho * SALES_MULT;
    ```
- Tau based on **cumulative money spent on publishing** (adverts)?
  - Spend all money once per month (at any day), which then unlocks the publish
  - Like me, Lemma doesn't stick to a schedule other than a basic alarm clock
  - This will reduce player freedom
- Current: tau based on **maximum p**
  - Simpler to track than cumulative p
  - Harder to progress

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
- If **1 tick was a minute**, each day would be 1440 ticks (2:24)
  - 1 month in-game = 72 minutes IRL
  - 1 year in-game ~= 14.6 hours IRL
  - 5 years in-game ~= 3.0416 days IRL
- If **1 tick was 1.5 minutes** due to ad reward:
  - 1 day = 1:36 (960 ticks)
  - 1 week = 11:12
  - 1 month = 48:00
  - 1 year = 9:44:00
  - 5 years = 2d 00:40:00 (not counting leap years)
- Clock: **only shows hour of day** and not minutes? If game looks too fast
- Well that's too long, we should really at least **double the speed**?
  - 36 minutes per publish isn't coffee-break either, but that's the best we got
  - It could enable fast-paced active play of the leeks
    - Leek season will also come much more quickly
    - But slower speed allows management of multiple plots of leek/mint
  - And, night time will literally no longer matter since time goes by so fast
- Seasonal plants
  - Intro plant must be seasonal to introduce any timing mechanic
- https://homeguides.sfgate.com/plants-grow-fastest-seeds-53378.html
- Leap years spawn hopleeks!

### 2. Space

- **Six plots**, with 5 locked at the beginning
  - First plot unlock comes early
- Different plots may have **different properties**?
  - Might be **too complicated** and **inelegant** - this is not a realistic
  - simulation
- Also a **river** for diverse gameplay
- **Plot 0** is a wild forest
  - Spawns all sorts of plants that can spread into plots 1~6
  - Cannot be viewed
- **Excursions (challenge plots)** (negative): not harvestable
  - Beating them will unlock new plant types
  - Ideas: 5x+1 Cotton Conjecture, ~~Botched~~ Bloated Linden (lol)

## Plants

- Growth is **based on sequence length** times a per-plant constant

### 1. Early-game

- **Easy solitary flower/capitulum**?
- **Idle inflorescence** that can grow bigger but slows down
  - Calendula! The name means 'first day of the month'.
  - Has a good smell that ~~attracts~~ bunnies (lol)
    - Prevents bunnies from entering the lawn at all if placed at plot 1
- **Fast active herb**: Basil
  - Drawback: includes a fucking inflorescence section that is giant and 
  noob-unfriendly
  - Spreadable like mint but weaker??? Infinite basil

### 2. Mid-game

- **Sunflowers** & sunflower batteries!
  - This cultivar of sunflowers is dysfunctional. They cannot turn their heads to face the sun, even when they're young. Regardless, Lemma often brushes over their heads as if they were her children.
  - Its ability to head towards the sun will get weaker as it gets older,
  and the flowers can only stay heading east
  - Without milestone: very high synthesis rate
  - With milestone: accelerate plant growth in adjacent plots by distributing
  its energy
    - Can technically make it immortal since it stops growing!
  - GIANT SUN FLOWERS LATE GAME
- **Invasive species** that can slow nearby growth
  - **Three cornered leek** that spreads to nearby plots
    - Rewards active play
  - https://invasiveweedsolutions.co.uk/invasive-weeds/non-native/three-cornered-garlic/
  - Remixed as Hopleek (Bunny Leek) in-game with a weird fictional L-system?
    - Only spawns on leap years, from Y12 onwards
    - Hopleek **nibbles** other plants **when**:
      - Player is offline at night?
      - Player is not focusing on the plot with hopleeks?
      - It evolves?
    - Bite strength is based on colony size
    - Nibbles the string from right to left
    - Avoids sunflowers, basils
      - Can't invade plot if there's one there
    - Extra energy can shield a colony from rabbit bites (sunflower gud)
      - Hopleek colony gains energy from a bite, shielded or not

### 3. Late-game

- Long-term **trees for idle**
- **Mint** spreads too - which one is more annoying?
  - Spearmint leaves lose their aromatic appeal after the plant flowers
  - Population growth / logistic map? (with plants that can spread on their own)

### 4. Misc

- Research more: https://hellohomestead.com/dandelions-mint-other-edible-plants-that-spread-and-take-over/
- **Snapdragon** / **toadflax**
- **Striga**
- **Buttercup** that reflects light, distributing synthesised energy
  - Sunflower ripoff
- **Tulip**, for an easy tutorial-worthy L-system
- **Root veggies** that make you guess how big they are?
  - Doesn't work since you can see the income at all times
- **Thyme** that warps time? PvZ ripoff
- **Gunflower** that shoots rabbits?
- **Rhizomes?**
- **Flower gender** mechanic?

## Permas & Milestones

- Pruning can also get seeds?
- Other plant parts also useful for growth? Like fertilisers
- Beehives that can spread flowers to adjacent plots
- **Burn plots** and **torchure plants** (very in character)
  - Fire spreads too, of course
  - Sunflower is immune
  - Tap repeatedly to extinguish with the nearby river?
  - Fire toggle: first starts burning one by one slowly, then burns faster
    - If it completely burns everything, it will spread to the next plot

- Mutations: let players mutate a plant for one level or forever?
  - Adopts the new plant's ruleset
  - Example colony: 24 of Hopleek (35) x Dog rose
  - Cutting leaves or harvesting fruits will have the same notation:
  - 24 of Hopleek (20, 30, 35) x Dog rose (48, 59, etc.)

- Milestones:
  - Marigold (calendula) generates gold (p) passively
  - Sunflower battery

## Writing

I am writing this stuff following the recent break-up between a friend and
I. It's a good opportunity to channel emotions.

### 1. Achievements:

- **Immortal**: Celebrate the 50th anniversary.
- **Rabbits on Your Lawn**: Let hopleek spread to a plot with a PvZ plant.

### 2. Chapters:

- **No. Scrap all stuff below.** Have Lemma pass away after about half way.
All plants afterwards will display 'No commentary'.
  - After this, unlock Students
    - Unlocks more excursions
    - Unlocks auto-plant/harvest (NO AUTO-PRUNE)

- **Introduction**: Yesterday, a small plot of land was registered to Lemma
Rancher. Today, Lemma's garden does wonderfully. Tomorrow, Madeline would be
proud.
- **First publish**: 'Let's see we got... this much from last harvest.
Minus the sales tax, maintenance, dog food, *plant* food... I wonder why it'd 
always miraculously add up to {0}% each time? Lemma, can [you] prove this?'
We called it the weather's toll. Just to stop worrying about it too much.
- **Clickable headlines** (singular upgrade) after certain points:
  - Hopleek spawning (anticipation on Y4)
  - Published adverts
- **e100 tau**: Today marked an extraordinary milestone for the eternal farm.
For the first time, Lemma hosted an excursion with the students from the
prestiged University of Idle (Exponential). Tonight, she had a whole celebration
meeting with her luminary friends.
At last, under the ensnaring pillow she soundly sleeps.
Tomorrow, she would wake up earlier than usual. Glancing at the golden haze, she
would brush her hands over the sunflower's face...
Even if to her, every meaning had already lost.
(lost -> more like failed)
- Story about **coin toss** to determine who's husband (thanks J Draper)
  - In Ireland and Britain, it is a tradition that women may propose marriage
  only in leap years
  - Story time lol

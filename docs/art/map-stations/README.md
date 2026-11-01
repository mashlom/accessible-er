# Map stations: redraw for the phone, prompts for the image AI

The map picture of a station (`station-<stage>`) is what the child taps on the map. On a phone it is only about
90 px wide, and locked stations are shown faded (55% opacity, partly grey). Today many of them cannot be read at
that size:

- **Too much in them.** The dollhouse stations have up to seven characters and dozens of small toys each; the
  knight's and the dinosaurs' are full little scenes. At 90 px this is noise, and the stations all look alike.
- **Too little contrast.** The safari stations are khaki and straw on a yellow-green map, the dinosaurs' and the
  fairies' are green on green, the space stations grey on a grey moon: they melt into the background, and when faded
  they disappear.

**The model is Shevi's ocean** (`public/worlds/ocean/station-house.png`, `station-sub.png`, `station-pod.png`,
`station-aquarium.png`, `station-sonar.png`, `station-doctor.png`): one big object or building per station, a plain
base, almost no characters, strong shapes and colours. Every station of a world looks clearly different from the
others, and stands out from the map even when faded.

**All the details move to the sheet.** The scene picture (`scene-<stage>`), shown when the station is opened, stays
as it is and keeps all the characters and the story. The map picture only has to say "this is the place" at a
glance.

## What to deliver

| Kind | Size | Background | Files |
| --- | --- | --- | --- |
| Map picture (`station-<stage>`) | 600 x 440 | transparent | 10 per world, 7 worlds (70 pictures) |

PNG or WebP, named as today (`public/worlds/<world>/art/station-<stage>.webp`), plus the world's `manifest.json`
updated (file, kind, stage, size, a one-line description). Today's pictures are in the same place: the new one
replaces the old one file for file.

## Rules (for every picture)

- **One main thing.** One big object or building fills most of the picture (about 70% of the width). At most one or
  two characters, large and simple, and only where the table says so. No crowds, no small props scattered around,
  no little animals in the corners.
- **Readable at 90 px.** Look at the picture shrunk to 90 px wide: you can still say what it is. Big simple shapes,
  few colours, no thin parts, no small text or signs.
- **A clear silhouette.** Each station of a world has its own outline (tall and narrow, low and wide, round, pointed),
  so the ten can be told apart even as black shapes.
- **Contrast with the map.** The main object uses colours the world's map does not have (see each world), with clear
  light and dark areas, not only a change of hue: it must still stand out when the picture is faded and greyed.
  Soft dark shadow under the base.
- **A plain base**, the same for the whole world, in a colour that separates the station from the map (see each
  world). Small and simple: no rim of plants, flowers or rocks around it.
- Same style as today: soft 3D clay-and-felt miniature, matte textures, warm soft light from the top left, rounded
  chunky shapes, no outlines. The same characters as in the world's scenes (same faces and clothes).
- **Nothing scary:** no needles, blood, wounds, weapons; nothing medical that frightens.
- Seen from the front and a little above, like today, the base at the bottom, centred, a little space around.

## How to use

For each world: give the image AI Shevi's ocean pictures above as the style and simplicity reference, the world's
character sheet or one of its scenes (so the characters match), and today's map background
(`map-portrait.webp`) to check the contrast. Then the shared prompt, the world's line and the station's line.
Generate the ten stations of a world together or one after another in the same chat, so they look like one set.
Before sending, put all ten on the map background at 90 px, normal and faded, and check that each one is clear.

### Shared prompt

> A single map icon for a children's hospital app, shown on a phone at about 90 pixels wide, so it must read at a
> glance. Soft 3D clay-and-felt miniature style, matte textures, warm soft light from the top left, rounded chunky
> shapes, no outlines. One big main object or building fills most of the picture and stands on a small plain round
> base; at most one or two large, simple characters, only if described. No crowd, no small scattered props, no
> plants or rocks around the base, no text or letters. A clear, distinctive silhouette, strong light and dark areas
> and bold colours that stand out from the background described below. Front view from slightly above, centred,
> transparent background, a soft shadow under the base. Nothing scary: no needles, blood, wounds or weapons.

Then add: *"The map behind it is …; use …"* (the world's line), and the station's line.

## The worlds

### Ocean (Underwater)

**Map:** teal-blue water. **Use:** sunny yellow, coral orange, white, deep navy; avoid teal and light blue as the
main colour. **Base:** a round grey-blue stone, as in Shevi's pictures. Shevi's pictures are kept where noted:
redraw the others in the same spirit.

| Station | Picture |
| --- | --- |
| Reception (On the Dock) | The little dock house with the red-and-white windsock and the wooden pier: Shevi's `station-house.png`, no people. |
| Wait before triage (Boarding the Submarine) | The yellow submarine with its hatch open and a little ladder: Shevi's `station-sub.png`. |
| Triage (Pre-dive Checkup) | A big brass diving helmet with a round window on a checking stand with a ring of small lights; the bosun (one character) beside it. |
| Wait for the doctor (Waiting in the Cabin) | The glass dome full of bright fish: Shevi's `station-aquarium.png`. |
| Doctor (Meeting the Captain) | The captain's round bridge with the captain at the desk: Shevi's `station-doctor.png`. |
| Tests (Submarine Sonar) | A big white sonar dish on a stand, tilted up, with glowing circles coming from it. |
| Treatment (Submarine Repairs) | A big yellow propeller on a repair stand with a giant friendly wrench; the engineer (one character). |
| Consult (Link with the Base) | A tall red-and-white radio buoy with an antenna on top sending soft signal waves. |
| Wait for results (Sonar Data Processing) | A small round dome with one big glowing green radar screen showing a sweeping line, and a column of rising bubbles. |
| Decision (Back to the Surface!) | The top of the yellow submarine coming out of the water with a little flag, a round sun above. |

### Dollhouse

**Map:** bright green grass hills. **Use:** pink, cream, raspberry red, lilac, sky blue; avoid green.
**Base:** a round cream wooden tray (like a toy's stand), not a grassy island.

| Station | Picture |
| --- | --- |
| Reception (Reception Desk) | A small pink front desk with a giant open guest book on it, a golden bell and a ribbon bracelet hanging from the edge. No characters. |
| Wait before triage (The Corridor Bench) | A long raspberry-red velvet bench in front of a striped wallpaper arch. No characters. |
| Triage (Measuring Room) | The toy soldier (red coat, tall black hat) standing beside a tall measuring stick painted in stripes. |
| Wait for the doctor (The Guest Room) | One big sky-blue armchair with a round cushion and a little standing lamp. |
| Doctor (The Doctor's Room) | The teddy-bear doctor with a stethoscope, sitting at a small round white desk. |
| Tests (The Magic Machine Room) | A lilac toy machine box with one big round glowing window and two large buttons. |
| Treatment (The Treatment Corner) | The bunny in a white apron holding a big white box with a pink heart on it. |
| Consult (The Owl Comes to Visit) | The wise owl (big, brown and gold, round glasses) sitting on a tall stack of three books. |
| Wait for results (The Quiet Waiting Room) | A cream rocking horse with a pink mane on a round soft rug. |
| Decision (Going Home) | The front of the dollhouse: cream walls, a pink roof, the front door wide open with light inside. The only house among the stations. |

### Safari (Safari in Africa)

**Map:** yellow-green savanna, ochre paths, a blue lake. **Use:** white canvas, terracotta red, bright orange, deep
blue; avoid khaki, straw and olive as the main colour. **Base:** a round dark terracotta rock, clearly darker than
the grass.

| Station | Picture |
| --- | --- |
| Reception (Camp Entrance) | A tall gate: two wooden posts and an orange-and-white striped banner across them, a bracelet hanging in the middle. No characters. |
| Wait before triage (In the Tree's Shade) | One big acacia tree with a flat deep-teal crown and a bright orange bench in its shade. |
| Triage (Equipment Check) | The guide (one character) next to a big open deep-blue backpack with binoculars and a flask sticking out. |
| Wait for the doctor (Waiting for the Safari Leader) | A white canvas tent with its flaps tied open and two folding chairs in front. |
| Doctor (Meeting the Safari Leader) | The safari leader (one character) beside a big blue map board on an easel. |
| Tests (Field Lab) | A giant white-and-blue microscope on a small wooden table with two coloured sample jars. |
| Treatment (Treatment Post) | The herbalist (one character) with a big round red clay pot of leaves and a white box with a green leaf on it. |
| Consult (Expert from the Savanna) | A red-and-white striped hot-air balloon landing, its basket just above the base. |
| Wait for results (Waiting for Results) | A bright red safari jeep with an orange canopy, parked and waiting. |
| Decision (Back to Camp!) | A round white camp hut with a red door and a little flag, a big orange setting sun behind it. |

### Dinosaurs

**Map:** yellow-green meadow. **Use:** orange, turquoise, red, cream, purple; avoid green as the main colour, and
give the dinosaurs blue, purple or orange skin. **Base:** a round pale sandstone with a darker stone edge.

| Station | Picture |
| --- | --- |
| Reception (Reserve Entrance) | A gate of two giant cream bones standing upright with an orange sign hanging between them (no letters). No characters. |
| Wait before triage (The Entrance Path) | A log bench beside a big turquoise spotted dinosaur egg standing upright. |
| Triage (Ranger Check) | The reserve ranger (one character) and a small friendly blue triceratops standing on a big round scale. |
| Wait for the doctor (Waiting Camp) | An orange tent with a ring of stones in front (no fire). |
| Doctor (Meeting the Head Guide) | The head guide (one character) beside a tall friendly purple long-neck dinosaur. |
| Tests (Findings Lab) | A giant magnifying glass on a stand over one big cream dinosaur bone on a stone table. |
| Treatment (Treatment Post) | The expedition medic (one character) with a big white backpack with an orange stripe. |
| Consult (Field Expert) | A tall wooden lookout tower with a red roof and a telescope sticking out of it. |
| Wait for results (Waiting for Sample Results) | A round nest with three big coloured eggs (orange, turquoise, purple), one just starting to crack. |
| Decision (Heading Home from the Trip) | An orange jeep with a flag driving off, a round sun behind it. |

### Fairy (Magic Garden)

**Map:** bright green lawn, cream stepping stones. **Use:** pink, lilac, white, gold, sky blue, red; avoid green
leaves as the main colour. **Base:** a round pale-pink flower top (like a big open blossom seen from above), not a
grassy island.

| Station | Picture |
| --- | --- |
| Reception (Garden Gate) | A white arch gate covered in pink roses, a bracelet of flowers hanging from its top. No characters. |
| Wait before triage (Butterfly Bridge) | A small sky-blue arched bridge with two big lilac butterflies resting on its rail. |
| Triage (Magic Check) | The elf helper (one character) beside one giant open pink lotus flower glowing softly inside. |
| Wait for the doctor (Flower Corner) | One giant yellow tulip shaped like a cup-chair, with a small cushion in it. |
| Doctor (Meeting the Healing Fairy) | The healing fairy (one character) in front of a red toadstool house with white spots and a round door. |
| Tests (Magic Sight) | A big glowing lilac crystal ball on a golden tree-stump stand. |
| Treatment (Healing Wand) | The garden gnome (one character, red hat) holding a big golden wand with a star and soft sparkles. |
| Consult (Council of Fairies) | The wise fairy (one character, silver hair) on a tall white blossom throne. |
| Wait for results (Waiting for the Magic) | A big glass jar of glowing golden fireflies with a pink ribbon. |
| Decision (Leaving the Beautiful Garden) | A rainbow arch rising from the base with a fairy flying under it and waving. |

### Space (Astronaut in Space)

**Map:** pale lilac-grey moon surface with craters. **Use:** orange, red, deep blue, yellow, white with deep navy
details; avoid grey and pale lilac as the main colour. **Base:** a round dark indigo asteroid rock with a soft blue
glow along its edge.

| Station | Picture |
| --- | --- |
| Reception (Station Entrance) | A round airlock door in a thick orange frame, a green light above it. No characters. |
| Wait before triage (Waiting Cabin) | A white egg-shaped capsule with one big round window and a single seat seen inside. |
| Triage (Checks Before Launch) | The flight engineer (one character, orange suit) next to a tall check tower with a column of coloured lights. |
| Wait for the doctor (Control Room) | A big curved control desk with one wide glowing blue screen and big round buttons. |
| Doctor (Meeting the Ship Commander) | The ship commander (one character, blue suit) in a round high-backed chair under a big star window. |
| Tests (Space Scanner) | A big glowing blue ring scanner standing upright like an arch. |
| Treatment (Station Repair) | A small friendly robot technician with a giant wrench, next to a little satellite. |
| Consult (Command Centre) | A tall antenna dish tower sending signal waves to a small blue-and-green Earth. |
| Wait for results (Data Processing) | A tall white computer tower with a round screen showing a planet slowly turning and a row of blinking lights. |
| Decision (Successful Landing!) | A red-and-white rocket standing on its legs, just landed, a soft puff of cloud at its base and a flag. |

### Knight (Knight in the Castle)

**Map:** yellow-green grass. **Use:** white and warm grey stone, teal, red, gold, deep blue; avoid green as the
main colour. **Base:** a round pale stone paving with a darker stone edge.

| Station | Picture |
| --- | --- |
| Reception (The Castle Gate) | A gatehouse with two round towers, teal roofs, the gate open, a red banner on top. No characters. |
| Wait before triage (The Castle Yard) | A round stone well with a little roof and a bench beside it. |
| Triage (Strength Check) | The healer (one character) beside a big golden balance scale. |
| Wait for the doctor (The Knights' Hall) | A long wooden bench under a tall arched window with a red banner hanging beside it. |
| Doctor (Meeting the Great Wizard) | The great wizard (one character, blue robe, star hat, staff) in front of a tall narrow blue tower. |
| Tests (The Magic Mirror) | A tall oval golden mirror shining softly. |
| Treatment (The Weapon Room) | The smith (one character) at an anvil, fixing a big dented helmet (no weapons). |
| Consult (The Council of Sages) | A round table with three tall chairs and a rolled scroll on it. No characters. |
| Wait for results (Waiting for the Prophecy) | A crystal ball with swirling stars on a tall carved pedestal. |
| Decision (End of the Journey) | A small stage with two fanfare banners and a big golden rolled scroll with a red ribbon in the middle. |

## Before sending

- Each world's ten stations, at 90 px wide on its map background, normal and faded: every one stands out and every
  one can be told apart from the others.
- One main object per station; never more than two characters.
- The base is the same in the whole world and its colour differs from the map.
- The characters look like those in the world's scenes.
- The team (MLR) looks at the pictures before they go in, as with the other pictures.

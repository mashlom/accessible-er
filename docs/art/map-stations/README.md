# Map stations: redraw for the phone, prompts for the image AI

The map picture of a station (`station-<stage>`) is what the child taps on the map. On a phone it is only about
90 px wide, and locked stations are shown faded (55% opacity, partly grey). Today many of them cannot be read at
that size:

- **Too much in them.** The dollhouse stations have up to seven characters and dozens of small toys each; the
  knight's and the dinosaurs' are full little scenes. At 90 px this is noise, and the stations all look alike.
- **Too little contrast.** The safari stations are khaki and straw on a yellow-green map, the dinosaurs' and the
  fairies' are green on green, the space stations grey on a grey moon: they melt into the background, and when faded
  they disappear.

**The ocean is not redrawn:** its stations stay as they are (one small fix, see the ocean). **It is the model**: Shevi's ocean (`public/worlds/ocean/station-house.png`, `station-sub.png`, `station-pod.png`,
`station-aquarium.png`, `station-sonar.png`, `station-doctor.png`): one big object or building per station, a plain
base, almost no characters, strong shapes and colours. Every station of a world looks clearly different from the
others, and stands out from the map even when faded.

**All the details move to the sheet.** The scene picture (`scene-<stage>`), shown when the station is opened, stays
as it is and keeps all the characters and the story. The map picture only has to say "this is the place" at a
glance.

## What to deliver

| Kind | Size | Background | Files |
| --- | --- | --- | --- |
| Map picture (`station-<stage>`) | 600 x 440 | transparent | 10 per world, 6 worlds (60 pictures), plus the ocean's reception fixed (see the ocean) |

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
- **Taken from the scene.** The map picture is the main place or object of the station's scene (the square
  picture on its sheet), seen from outside: the same thing, the same colours, the same character. Nothing on the map
  picture that is not in the scene. To stand out more, colours may be a little brighter, not different.
- **Nothing scary:** no needles, blood, wounds, weapons; nothing medical that frightens.
- Seen from the front and a little above, like today, the base at the bottom, centred, a little space around.

## How to use

For each world: give the image AI Shevi's ocean pictures above as the style and simplicity reference, the world's
character sheet or one of its scenes (so the characters match), and today's map background
(`map-portrait.webp`) to check the contrast. Also give the station's own scene (`scene-<stage>.webp`), so the map picture matches it. Then the shared prompt,
the world's line and the station's line.
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

Then add: *"The map behind it is …; use …"* (the world's line), *"Take the place and colours from the attached
scene"*, and the station's line.

## The worlds

Each line names what the station's scene shows, and what of it goes on the map.

### Ocean (Underwater): one fix only

The ocean's stations are not redrawn, except for one detail:

| Station | File | Change |
| --- | --- | --- |
| Reception (On the Dock) | `public/worlds/ocean/art/station-reception.webp` | On the dock house, replace the red cross with a red Star of David (the Magen David Adom sign: a red six-pointed star outline on white). Everything else in the picture stays exactly as it is. |

### Dollhouse

**Map:** bright green grass hills. **Use:** pink, cream, raspberry red, warm wood; avoid green as the main colour.
**Base:** a round cream wooden tray (like a toy's stand), not a grassy island.

| Station | Scene | Map picture |
| --- | --- | --- |
| Reception (Reception Desk) | At the front door: a little desk with the open guest book, the toy soldier | The little wooden desk with the big open guest book, in front of the open green front door. No characters. |
| Wait before triage (The Corridor Bench) | A curved pink sofa around a low tea table | The curved pink sofa with the low round tea table and teapot in front. No characters. |
| Triage (Measuring Room) | The toy soldier at the height chart with a heart, a little scale | The toy soldier (red coat, tall black hat) beside the tall wooden height chart. |
| Wait for the doctor (The Guest Room) | Toys on a sofa, a tea table, a fringed lamp | A big cosy armchair with a pink check cushion and the tall fringed lamp beside it. |
| Doctor (The Doctor's Room) | The teddy-bear doctor at his desk with an open book | The teddy-bear doctor (round glasses) sitting at his wooden desk with the open book. |
| Tests (The Magic Machine Room) | The cream-and-mint machine with a round window and coloured buttons | The cream-and-mint magic machine with its big round glowing window and coloured buttons. |
| Treatment (The Treatment Corner) | A little bed with a patchwork quilt, a sewing basket | The little bed with the patchwork quilt and the sewing basket beside it; the bunny (one character) sitting on its edge. |
| Consult (The Owl Comes to Visit) | The owl on a wooden perch, the soldier brings a letter | The owl (blue-grey, scarf) on its tall wooden perch, holding a letter with a red seal. |
| Wait for results (The Quiet Waiting Room) | A sofa with a storybook, toy blocks on the rug | A big open storybook on the round rug with a little tower of toy blocks. No characters. |
| Decision (Going Home) | Out through the garden gate with bunting | The wooden garden gate wide open under a string of coloured bunting, the path leading out. No characters. |

### Safari (Safari in Africa)

**Map:** yellow-green savanna, ochre paths, a blue lake. **Use:** dark wood, white canvas, terracotta red, orange,
deep blue; avoid khaki, straw and olive as the main colour where the scene allows. **Base:** a round dark
terracotta rock, clearly darker than the grass.

| Station | Scene | Map picture |
| --- | --- | --- |
| Reception (Camp Entrance) | The thatched wooden gate with lanterns | The camp gate: two dark wooden posts, a thatched roof across them, the doors open, a lantern on each post. No characters. |
| Wait before triage (In the Tree's Shade) | A bench with cushions under a big tree, a zebra | One big acacia tree with a wide flat crown and the log bench with red-orange cushions in its shade. |
| Triage (Equipment Check) | The gear shelf, a backpack opened on the table | A big open backpack with binoculars and a flask on a wooden table, a shelf of gear behind. No characters. |
| Wait for the doctor (Waiting for the Safari Leader) | Inside a round thatched hut, lion cubs, a toy jeep | A round thatched hut with white walls and the door open, warm light inside. |
| Doctor (Meeting the Safari Leader) | The safari leader and a friendly elephant | The safari leader (one character, white beard) sitting beside the friendly grey elephant. |
| Tests (Field Lab) | Under a canvas awning: a magnifying glass over paw-print casts | A big magnifying glass on a stand over white paw-print casts on a table, under a canvas awning. |
| Treatment (Treatment Post) | The herbalist and a hippo resting on a mat, bowls of herbs | The friendly hippo resting on a soft red mat, the herbalist (one character, flowers in her hair) with a bowl of herbs beside it. |
| Consult (Expert from the Savanna) | The expert shows a big map on a wooden table | A wooden table with a big unrolled map and binoculars on it, the expert (one character, orange scarf) leaning over it. |
| Wait for results (Waiting for Results) | A wooden lookout deck with a telescope at sunset | The wooden lookout deck with its rail and a telescope on a tripod, an orange setting sun behind it. |
| Decision (Back to Camp!) | The jeep under a flower arch with bunting, sunset | The camp's jeep (bright, with a cream canopy) under an arch of flowers and orange bunting. |

### Dinosaurs

**Map:** yellow-green meadow. **Use:** warm wood, orange, terracotta, cream, sky blue; avoid green as the main
colour (keep the dinosaurs' own colours from the scenes, a little brighter). **Base:** a round pale sandstone with
a darker stone edge.

| Station | Scene | Map picture |
| --- | --- | --- |
| Reception (Reserve Entrance) | A wooden gate with a blank sign and orange pennants | The wooden gate with its blank wooden sign and two orange pennants. No characters. |
| Wait before triage (The Entrance Path) | A log bench under a leafy pergola, a big triceratops | The log bench under the wooden pergola with the big friendly blue triceratops lying beside it. |
| Triage (Ranger Check) | Under a striped canopy: the ranger checks the little dinosaurs | The round orange-and-cream striped canopy on wooden poles, the ranger (one character) under it. |
| Wait for the doctor (Waiting Camp) | Tents, a hammock, a ring of stones, logs | A cream tent with orange stripes, a ring of stones in front (no fire). |
| Doctor (Meeting the Head Guide) | The head guide at a round table with a map scroll | The head guide (one character, white beard) at a round wooden table with a rolled map, a long-neck dinosaur behind. |
| Tests (Findings Lab) | A big brass telescope in front of a round window | The big brass telescope on its stand in front of a round window. No characters. |
| Treatment (Treatment Post) | The medic looks after a triceratops resting on leaves | The blue triceratops resting on a bed of leaves, the medic (one character) beside it. |
| Consult (Field Expert) | Round table with the experts and a map, a pterodactyl | The field expert (one character, grey braid) at a round table with a map, a pterodactyl above. |
| Wait for results (Waiting for Sample Results) | A glowing white egg on a stump, a flag | The big softly glowing white egg on a tree stump, a little green flag beside it. |
| Decision (Heading Home from the Trip) | A wooden arch with ivy and bunting, the path out | The wooden arch with colourful bunting and the path leading out under it. No characters. |

### Fairy (Magic Garden)

**Map:** bright green lawn, cream stepping stones. **Use:** pink, lilac, white, gold, sky blue, red; avoid green
leaves as the main colour. **Base:** a round pale-pink flower top (like a big open blossom seen from above), not a
grassy island.

| Station | Scene | Map picture |
| --- | --- | --- |
| Reception (Garden Gate) | A rose arch gate, a spotted mushroom table | The arch gate covered in pink roses, a little spotted mushroom table beside it. No characters. |
| Wait before triage (Butterfly Bridge) | A flowery bridge over a stream, a bunny | The small arched bridge covered in pink flowers over a strip of blue stream. |
| Triage (Magic Check) | The elf helper and a crystal ball inside a pink lotus | The giant open pink lotus with a small crystal ball glowing inside, the elf helper (one character) bending over it. |
| Wait for the doctor (Flower Corner) | A tea party on red spotted mushrooms, smiling daisies | A red spotted mushroom table with a teapot, two big smiling daisies beside it. |
| Doctor (Meeting the Healing Fairy) | The healing fairy by a house with a pink petal roof | The healing fairy (one character, silver hair, lilac robe) in front of the little house with the pink petal roof. |
| Tests (Magic Sight) | The crystal ball on a carved stone stump | The big glowing crystal ball on the carved stone stump. No characters. |
| Treatment (Healing Wand) | The helper with a golden wand at a wooden table | The helper (one character, as in the scene) holding the big golden star wand, a little wooden table beside her. |
| Consult (Council of Fairies) | Three fairies around a glowing orb in a big flower | A big open flower with a glowing golden orb in its middle, the wise fairy (one character, grey hair) beside it. |
| Wait for results (Waiting for the Magic) | A pink petal hammock in an arch of branches, lanterns | The pink petal hammock hanging in a round arch of branches, two glowing lanterns. |
| Decision (Leaving the Beautiful Garden) | A fairy flying, a rainbow, the animals waving | A rainbow arch rising from the base with the fairy flying under it and waving. |

### Space (Astronaut in Space)

**Map:** pale lilac-grey moon surface with craters. **Use:** orange, red, deep blue, yellow, gold, with deep navy
details; avoid grey and pale lilac as the main colour. **Base:** a round dark indigo asteroid rock with a soft blue
glow along its edge.

| Station | Scene | Map picture |
| --- | --- | --- |
| Reception (Station Entrance) | A big round glowing doorway | The big round doorway with a ring of glowing lights, orange details. No characters. |
| Wait before triage (Waiting Cabin) | Bean bags, a star cushion, a little lantern | A big round bean bag with a yellow star cushion and a little glowing lantern. No characters. |
| Triage (Checks Before Launch) | The yellow robot and a rack of space suits | The yellow flight-engineer robot beside a rack of colourful space suits. |
| Wait for the doctor (Control Room) | A yellow crescent-moon sofa, a moon lamp | The yellow crescent-moon sofa with the round moon lamp. No characters. |
| Doctor (Meeting the Ship Commander) | The commander, white beard, cream-and-gold suit | The ship commander (one character, white beard, cream-and-gold suit) in front of a big round window with a planet. |
| Tests (Space Scanner) | A big white telescope with a screen console | The big white-and-blue telescope scanner on its round base with a glowing screen. No characters. |
| Treatment (Station Repair) | A small white-and-red spaceship being fixed | The small white-and-red spaceship on a stand with a red tool box, one little helper robot. |
| Consult (Command Centre) | A round table with a glowing Earth above it | The round table with a big glowing Earth floating above it. No characters. |
| Wait for results (Data Processing) | Tall glowing crystal data columns | Three tall glowing purple-and-teal crystal columns on a round base. No characters. |
| Decision (Successful Landing!) | The rocket landed, bunting, everyone celebrating | The red-and-white rocket standing on its legs with its door open, a string of bunting. |

### Knight (Knight in the Castle)

**Map:** yellow-green grass. **Use:** cream stone, teal, orange-peach, warm wood; avoid green as the main colour.
**Base:** a round pale stone paving with a darker stone edge.

| Station | Scene | Map picture |
| --- | --- | --- |
| Reception (The Castle Gate) | The castle gate with a desk | The gatehouse with two round towers, teal roofs, the gate open, a little desk in front. No characters. |
| Wait before triage (The Castle Yard) | A striped pavilion with a bench and tea table | The round teal-and-cream striped pavilion with orange pennants and a bench inside. No characters. |
| Triage (Strength Check) | The healer checks the knight, a shelf of helmets | A wooden shelf of shiny knight helmets, the healer (one character, as in the scene) beside it. |
| Wait for the doctor (The Knights' Hall) | A long bench, banners, a toy horse, a cat | The long cushioned bench under a teal banner, a sleeping cat on it. |
| Doctor (Meeting the Great Wizard) | The wizard at a round table, an owl | The great wizard (one character, teal robe and hat) sitting at a round wooden table, the owl beside him. |
| Tests (The Magic Mirror) | The tall oval golden mirror | The tall oval golden mirror shining softly. No characters. |
| Treatment (The Weapon Room) | The smith fixes a wooden toy horse at the workbench | The wooden workbench with the toy horse being fixed, the smith (one character) at it. |
| Consult (The Council of Sages) | A round table, an owl flying in with a scroll | The big round table with the owl flying above it holding a scroll. No people. |
| Wait for results (Waiting for the Prophecy) | The crystal ball on a stone table | The glowing crystal ball on its round stone table. No characters. |
| Decision (End of the Journey) | Leaving through the gate with the pony | The cream pony with its saddle on the stone path, a small banner beside it. |

## Before sending

- Each world's ten stations, at 90 px wide on its map background, normal and faded: every one stands out and every
  one can be told apart from the others.
- One main object per station; never more than two characters.
- The base is the same in the whole world and its colour differs from the map.
- The characters look like those in the world's scenes.

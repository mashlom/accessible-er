# Ocean world: the missing station pictures, brief for the artist

The ocean was the first world and was drawn differently. The other six worlds have, for every station, a **map
picture** (the station as a small floating island on the map) and a **scene** (the same place from inside, at a
child's eye level, shown on the station's sheet), plus a **card** and a **celebration** picture. The ocean is
missing most of these: several stations reuse the same submarine picture, and the sheets show symbols instead of
scenes. This brief brings it in line with the others.

**Style references:** any of the other worlds, e.g. `public/worlds/knight/art/station-triage.webp` (map picture) and
`public/worlds/knight/art/scene-triage.webp` (scene). The ocean's own pictures stay as the guide for the place:
`public/worlds/ocean/station-house.png` (the dock house), `station-sub.png` (the submarine), `station-pod.png`,
`station-aquarium.png`, `station-sonar.png`, `station-doctor.png`.

## What to deliver

| Kind | Size | Background | Files |
| --- | --- | --- | --- |
| Map picture (`station-<stage>`) | 600 x 440 | transparent | the 4 missing ones, and 5 redrawn (tables below) |
| Scene (`scene-<stage>`) | 728 x 680 | full picture | all 10 stations |
| Card (`card`) | 600 x 440 | transparent | 1 |
| Celebration (`celebrate`) | 640 x 480 | full picture | 1 |

21 pictures, PNG, named as in the tables; plus a `manifest.json` like the other worlds' (file, kind, stage, size,
a one-line description).

## Rules (for every picture)

- **The same world as today's ocean pictures**: an underwater adventure with a dock house on the shore, a friendly
  yellow submarine, glass domes and pods on the sea floor, soft teal and blue water, sand, seaweed, fish.
- **The same characters in every picture**, as in the other worlds: the child diver (the hero), **the bosun** (the
  one who checks before the dive: the nurse), **the captain** (who decides where the submarine goes: the doctor),
  **the engineer** (who repairs: treatment), **the expert at the base** (seen on a screen: the consultant). Kind,
  calm adults; a mix of looks; the same faces and clothes from picture to picture.
- **Map pictures**: the station as a small round island of sea floor (sand, rocks, seaweed), one clear building or
  vehicle on it, a few small figures; three-quarter view from above, like the other worlds' map pictures.
- **Scenes**: inside the place, at a child's eye level, the characters doing what the station is about, calm and
  friendly; room at the top and bottom (the sheet may crop a little).
- **Nothing scary**: no needles, no blood, no wounds, no sharp tools, no dark deep sea, no big predators; no text.
- Same style as the worlds: soft 3D clay-and-felt miniature, matte textures, warm soft light from the top left,
  pastel colours, no outlines.

## Prompt

Use this at the start of every prompt, then add the picture from the tables:

> Soft 3D clay-and-felt miniature, cute and calm, for a children's hospital app. An underwater adventure world:
> soft teal and blue water, sandy sea floor, seaweed, small friendly fish, a friendly yellow submarine, glass domes.
> Rounded chunky shapes, matte felt and plasticine textures, warm soft light from the top left, pastel colours, no
> outlines. Kind, calm characters: a child diver (the hero), the bosun, the captain, the engineer. Nothing scary or
> sharp: no needles, no blood, no wounds, no predators, no text.

For a map picture add: *"A small round floating island of sea floor seen from above at three-quarter view, with the
place below on it and a few small figures; transparent background."* For a scene add: *"Inside the place, at a
child's eye level, the characters below; a full picture with a soft background."*

### The 4 missing map pictures

| File | Station | Place to draw |
| --- | --- | --- |
| `station-consult.png` | Link with the base | A small radio and screen station on the sea floor, a round antenna dome, the captain and the child talking to the expert on a screen. |
| `station-wait-results.png` | Sonar data processing | A glass pod with glowing screens showing calm sonar circles, the child and the bosun waiting on a soft bench, a sand timer. |
| `station-treatment.png` | Submarine repairs | A cosy workshop dome beside the submarine, the engineer with a soft toolbox mending a little part, the child helping. |
| `station-decision.png` | Back to the surface | The submarine rising towards the bright surface, bubbles, the dock house and sunlight above, the child waving. |

### The 10 scenes

| File | Station | Scene to draw |
| --- | --- | --- |
| `scene-reception.png` | On the dock | The dock house's front desk; a friendly person gives the child a diver's bracelet; a parent beside them. |
| `scene-wait-before-triage.png` | Boarding the submarine | Inside the submarine's waiting area, round windows with fish, the child and a parent sitting and waiting calmly. |
| `scene-triage.png` | Pre-dive checkup | The bosun gently checks the child before the dive: a small thermometer, a finger clip with a soft red light, a soft arm cuff. |
| `scene-wait-doctor.png` | Waiting in the cabin | A cosy cabin with a big round window full of fish, the child and a parent waiting, a few toys. |
| `scene-doctor.png` | Meeting the captain | The captain sits at the child's height, listening with a stethoscope, the map table behind, the child calm. |
| `scene-tests.png` | Submarine sonar | The sonar room, a big soft screen with calm circles, the child watching, the bosun pointing. |
| `scene-treatment.png` | Submarine repairs | The engineer and the child fix a little part together in a bright workshop. |
| `scene-consult.png` | Link with the base | The captain and the child talk to the expert on a big friendly screen. |
| `scene-wait-results.png` | Sonar data processing | The child and a parent wait while screens glow softly, a sand timer on the table. |
| `scene-decision.png` | Back to the surface | The child, the parent, the captain and the bosun wave as the submarine reaches the sunny surface by the dock. |

### 3 map pictures to redraw at full size

Today's files are far too small for the map (the aquarium is 189 px wide and is shown about 475 px wide, so its
edges look blurred and jagged). Same place and look as today, drawn again at 600 x 440:

| File | Today | Place to draw (as today) |
| --- | --- | --- |
| `station-wait-doctor.png` | `station-aquarium.png`, 189 x 129 | A glass dome full of colourful fish on a rocky round island with seaweed. |
| `station-wait-before-triage.png` | `station-sub-lit.png`, 255 x 209 | The friendly yellow submarine with its lights on, on a small sea-floor island. |
| `station-tests.png` | `station-sonar.png`, 218 x 132 | The submarine's sonar: a round dish with calm circles, on a small sea-floor island. |

### 2 map pictures to redraw as whole round islands

Today these two are cut straight on one side (the map used to push that side off the screen). Draw them again as
whole round islands, nothing cut off, like every other station, at 600 x 440:

| File | Today | Place to draw (as today, but whole) |
| --- | --- | --- |
| `station-reception.png` | `station-house.png` | The dock house on a whole round island: the little house with the red cross and the flag, the wooden pier, a life ring, sand and seaweed all round. |
| `station-doctor.png` | `station-doctor.png` | The captain's station on a whole round island, nothing cut at the edges. |

### Card and celebration

| File | Picture |
| --- | --- |
| `card.png` | A friendly ocean emblem: the yellow submarine with the child diver in a round porthole, bubbles around; transparent background. |
| `celebrate.png` | The ocean companions (the child, the bosun, the captain, the engineer) wave together on the sunny dock, the submarine behind them. |

## Before sending

- All 21 look like the other worlds' pictures: same light, softness and scale of detail.
- The characters look the same in every picture.
- The team (MLR) looks at the pictures before they go in, as with the other pictures.

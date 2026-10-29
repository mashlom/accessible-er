# World map backgrounds: brief for the artist

Each world has a map: a landscape picture with the stations standing on it. Today the pictures fit one screen
shape exactly (16:9 on a computer, a tall phone in portrait), and on any other shape the app has to invent what is
missing: it mirrors, blurs or fades the edges into a flat sky colour. That shows. The new pictures are the same
pictures **with more landscape around them**, so every screen, from a phone to an iPad either way up to a wide
monitor, shows real landscape.

**What to deliver, per world:** two WebP (or PNG) files.

| Picture | Today | New size | Frame with the stations (keep as it is) |
| --- | --- | --- | --- |
| Landscape (`map-landscape`) | 1920 x 1080 | **2560 x 1920** | 1920 x 1080, at the **bottom, centred** (x 320 to 2240, y 840 to 1920) |
| Portrait (`map-portrait`) | 824 x 2200 | **2200 x 2200** | 824 x 2200, **centred** (x 688 to 1512) |

Together they cover every screen shape from a tall phone up to a square window (portrait) and from a square window
up to a wide 21:9 monitor (landscape).

The worlds: dinosaurs, dollhouse, fairy (magic garden), knight, ocean, safari, space (14 pictures).

**The ocean** has no single map picture today: its map is put together in the app from a sea picture, turned and
cropped, plus a sandy shore. For the ocean we send two reference pictures of today's map background without the
stations, at the frame sizes (1920 x 1080 and 824 x 2200); they are the "picture in the frame" for this world, and
the artist extends them the same way. The new ocean pictures then replace the layers.

**Start from today's picture** (`public/worlds/<world>/art/map-landscape.webp`, `map-portrait.webp`): it goes into
the frame unchanged, pixel for pixel, and only the area around it is new. The stations are placed by their
coordinates inside the frame, so nothing inside it may move.

## Rules (for every picture)

- **Inside the frame: nothing changes.** Not a pixel moved, recoloured or retouched.
- **Around the frame: landscape only.** Sky, clouds, hills, trees, grass, water, rocks, stars. **No characters,
  animals, buildings, paths that lead somewhere, or anything a child would want to tap**: on many screens the margins
  are cut off, and on others they are all that shows at the edge.
- **No seam.** What is cut by the frame's edge today (tree tops, mountains, the dinosaur's head, the pterodactyl's
  wing, clouds) continues naturally beyond it. The light, colours and level of detail are the same as inside.
- **Calmer towards the outer edges**: the further from the frame, the simpler (open sky, plain grass), so the
  stations stay the centre of attention.
- **Plenty of sky, always.** Above the landscape frame there are 840 px of the world's own sky (day, sunset,
  night, space; for the ocean, the bright water near the surface), open and calm, with a few soft clouds or stars;
  no text. Where a picture has little sky of its own today (the dinosaurs: the mountains and trees reach the top),
  first let what is cut finish naturally (tree tops, mountain peaks, the pterodactyl's wings), then open up into
  a wide sky. In the portrait pictures too, the top part above the first station stays sky.
- Same style as the worlds: soft 3D clay-and-felt miniature, matte textures, warm soft light from the top left,
  pastel colours, no outlines.

## Prompt (for an outpainting / extend-image tool)

Give the tool today's picture placed in the frame of the new canvas, the margins empty, and this prompt, followed by
the world's line from the table below:

> Extend this picture outward to fill the whole canvas. Do not change anything inside the existing picture. Continue
> its landscape naturally beyond its edges, with no visible seam: the same soft 3D clay-and-felt miniature style,
> matte felt and plasticine textures, warm soft light from the top left, the same pastel colours and level of
> detail. Anything cut by the picture's edge (tree tops, mountains, clouds, a creature's head or wing) continues
> naturally. The new area is landscape only: no people, no animals, no characters, no buildings, no paths, no text.
> It becomes calmer and simpler towards the outer edges, so the original picture stays the centre of attention.

| World | Add to the prompt |
| --- | --- |
| Dinosaurs | A prehistoric jungle valley: more ferns, round trees and moss-covered rocks at the sides; the tree tops, mountain peaks and the pterodactyl cut at the top are finished first; above them, a wide open light blue sky with soft white clouds, much more sky than today. |
| Dollhouse | Soft rolling hills in a warm pink and peach sunset: more meadow with small flowers and round trees at the sides; above, a wide pink-orange sky with a few soft clouds. |
| Fairy | A gentle green magic garden: more rolling grassy hills, small flowers and round bushes at the sides; above, a wide bright blue sky with soft white clouds. |
| Knight | Green rolling meadows with round trees and grey rocks: more hills at the sides; above, a wide calm teal-blue sky over distant soft hills. |
| Safari | An African savanna at golden hour: more grassland, acacia trees and soft rocks at the sides; above, a wide warm hazy sky, golden near the horizon. |
| Ocean | An underwater world in soft teal and blue: more sandy sea floor, soft rocks and swaying seaweed at the sides; above, a wide bright water near the surface with soft light rays; no fish or creatures in the new area. |
| Space | A pale lunar surface with soft craters and pebbles at the sides; above, a wide deep blue starry sky with a soft violet nebula; no new planets. |

## Before sending

- Lay each new picture over today's one at the frame position: inside the frame they must match exactly.
- Look at the picture cropped to a few screen shapes: a phone (9:20), an iPad upright (3:4) and lying (4:3), a
  computer (16:9) and a wide monitor (21:9). Each crop should look like one whole picture, with no seam and nothing
  cut that matters.
- Name the files as today (`map-landscape.webp`, `map-portrait.webp`) in a folder per world.

## For the code (once the pictures are in)

The scene is drawn in the frame's units (1920 x 1080 landscape, 824 x 2200 portrait); only the picture and its
offset change. The mirroring, the side blur and the sky fade can then be switched off for the worlds that have the
new pictures. Separately: on an upright iPad the portrait map is taller than the screen and scrolls; it should fit
the height (with today's pictures, until the new ones arrive).

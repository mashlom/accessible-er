"""Puts a world's delivered pictures into the app: a folder with manifest.json and its 25 PNGs (the 10 stations, the 10
eye-level scenes, the two map backgrounds, the celebration, the card and the sheet's floor) becomes
public/worlds/<world>/art/*.webp, and the world's design in world.json points at them.

    python3 scripts/art/import_world.py <world> <folder>            # check, convert, write
    python3 scripts/art/import_world.py <world> <folder> --dry-run  # check only: what would change

The manifest decides: the files, their sizes, which are transparent, and the world's colours. Every difference from
what the app expects is printed (and a file that cannot be used stops the import). The station pictures are placed
on the second map by the width of their drawn part, measured from their transparency.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image  # noqa: E402
from world_design import WORLDS, apply, dump  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
STAGES = ['reception', 'wait-before-triage', 'triage', 'wait-doctor', 'doctor', 'tests', 'treatment', 'consult',
          'wait-results', 'decision']
# what the app expects of each file: its size and whether it is drawn on transparency
EXPECTED = {**{f'station-{s}.png': ('station', 600, 440, True) for s in STAGES},
            **{f'scene-{s}.png': ('scene', 728, 680, False) for s in STAGES},
            'map-portrait.png': ('map-portrait', 824, 2200, False),
            'map-landscape.png': ('map-landscape', 1920, 1080, False),
            'celebrate.png': ('celebrate', 640, 480, False),
            'card.png': ('card', 600, 440, True),
            'sheet-floor.png': ('sheet-floor', 364, 340, False)}


def luminance(hex_):
    c = [int(hex_.lstrip('#')[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def darkened(color, against, need):
    """The colour, darkened just enough (same hue) to reach the contrast it needs against a lighter colour"""
    r, g, b = (int(color.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    k = 1.0
    while contrast(f'#{int(r * k):02x}{int(g * k):02x}{int(b * k):02x}', against) < need and k > 0:
        k -= 0.01
    return f'#{int(r * k):02X}{int(g * k):02X}{int(b * k):02X}'


def check_picture(path, want_w, want_h, transparent):
    """The problems of one delivered picture (empty when it can be used)"""
    im = Image.open(path)
    problems = []
    if im.size != (want_w, want_h):
        problems.append(f'is {im.size[0]}x{im.size[1]}, expected {want_w}x{want_h}')
    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    if transparent:
        if not has_alpha:
            problems.append('has no alpha channel (expected a transparent background PNG)')
        else:
            a = im.convert('RGBA').getchannel('A')
            w, h = a.size
            corners = [a.getpixel(p) for p in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]
            if max(corners) > 8:
                problems.append(f'its corners are not transparent (alpha {corners})')
            if a.getextrema()[0] > 8:
                problems.append('no pixel is transparent')
    elif has_alpha and im.convert('RGBA').getchannel('A').getextrema()[0] < 250:
        problems.append('has transparent pixels (expected an opaque picture)')
    return problems


def drawn_part(path):
    """The station's drawn part, as the map needs it: its width (of the picture's width) and its top margin (of the
    picture's height)"""
    a = Image.open(path).convert('RGBA').getchannel('A').point(lambda v: 255 if v > 24 else 0)
    x0, y0, x1, y1 = a.getbbox()
    w, h = a.size
    return round((x1 - x0) / w, 3), round(y0 / h, 3)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    dry = '--dry-run' in sys.argv
    world, src = args
    with open(os.path.join(src, 'manifest.json')) as fh:
        manifest = json.load(fh)
    notes, stop = [], []
    if manifest.get('world') != world:
        notes.append(f'the manifest is for the world "{manifest.get("world")}", importing it as "{world}"')
    files = {f['file']: f for f in manifest['files']}
    for name in sorted(set(EXPECTED) - set(files)):
        stop.append(f'{name}: missing from the manifest')
    for name in sorted(set(files) - set(EXPECTED)):
        notes.append(f'{name}: in the manifest, but the app has no place for it (skipped)')
    for name, (kind, w, h, transparent) in EXPECTED.items():
        f = files.get(name)
        if not f:
            continue
        declared = (f.get('kind'), f.get('width'), f.get('height'), f.get('transparent'))
        if declared != (kind, w, h, transparent):
            notes.append(f'{name}: the manifest says {declared}, the app expects {(kind, w, h, transparent)}')
        if kind in ('station', 'scene') and f.get('stage') != name.split('-', 1)[1][:-4]:
            notes.append(f'{name}: the manifest gives it the stage "{f.get("stage")}"')
        path = os.path.join(src, name)
        if not os.path.exists(path):
            stop.append(f'{name}: the file is not in {src}')
            continue
        stop += [f'{name}: {p}' for p in check_picture(path, w, h, transparent)]

    colors = manifest.get('colors', {})
    for k in ('top', 'text', 'text2', 'action', 'page', 'accent'):
        if k not in colors:
            stop.append(f'colors.{k}: missing from the manifest')
    if all(k in colors for k in ('top', 'text', 'text2', 'action', 'page')):
        # (what, the colour that may be darkened, the colour it stands on, the contrast it needs)
        for what, key, against, need in (('text on page', 'text', colors['page'], 4.5),
                                         ('text2 on page', 'text2', colors['page'], 4.5),
                                         ('white on action (buttons)', 'action', '#ffffff', 4.5),
                                         ('white on top (the icons over the map)', 'top', '#ffffff', 3)):
            r = contrast(colors[key], against)
            print(f'  contrast {what}: {r:.2f}' + ('' if r >= need else f'  (below {need})'))
            if r < need:
                fixed = darkened(colors[key], against, need)
                notes.append(f'contrast of {what} is {r:.2f}, below {need}: {key} {colors[key]} is darkened to '
                             f'{fixed} ({contrast(fixed, against):.2f})')
                colors[key] = fixed

    for n in notes:
        print('  note:', n)
    for s in stop:
        print('  CANNOT USE:', s)
    if stop:
        sys.exit(f'{world}: not imported ({len(stop)} problems)')

    art = os.path.join(ROOT, 'public', 'worlds', world, 'art')
    new = {name[:-4] + '.webp' for name in EXPECTED}
    old = {f for f in os.listdir(art) if f.endswith('.webp')} if os.path.isdir(art) else set()
    print(f'  {world}: {len(new & old)} replaced, {len(new - old)} added, {len(old - new)} removed: {sorted(old - new)}')
    if dry:
        return

    os.makedirs(art, exist_ok=True)
    for f in old - new:
        os.remove(os.path.join(art, f))
    for name, (kind, w, h, transparent) in EXPECTED.items():
        im = Image.open(os.path.join(src, name))
        im = im.convert('RGBA') if transparent else im.convert('RGB')
        im.save(os.path.join(art, name[:-4] + '.webp'), 'WEBP', quality=90, alpha_quality=100, method=6)

    # the design: the shared layout, the pictures, and the manifest's colours over the world's own other colours
    path = os.path.join(WORLDS, world, 'world.json')
    with open(path) as fh:
        current = json.load(fh).get('design', {}).get('colors', {})
    top = colors['top']
    r, g, b = (int(top.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    title_bg = f'rgba({int(r * 0.6)}, {int(g * 0.6)}, {int(b * 0.6)}, 0.55)'
    keep = {k: v for k, v in current.items() if k not in ('water', 'waterTop', 'waterLight')}
    # the world's accent is the colour of the sheets' titles on white, and of buttons with white text: a light accent
    # would not be readable there, so the button colour stands in for it
    accent = colors['accent']
    if contrast('#ffffff', accent) < 4.5:
        print(f'  note: the accent {accent} is too light for titles on white ({contrast("#ffffff", accent):.2f}); '
              f'the button colour {colors["action"]} is used for them')
        accent = colors['action']
    apply(world, {s: s for s in STAGES}, {**keep, **{k: colors[k] for k in ('text', 'text2', 'action', 'page')}},
          top=top, title_bg=title_bg, accent=accent)
    # the second map sizes a station by its drawn width; one width for the whole world (the middle one of its
    # stations), so the islands keep one size there, as on the first map, where every picture fills the same frame
    widths = sorted(drawn_part(os.path.join(src, f'station-{s}.png'))[0] for s in STAGES)
    visible = round((widths[4] + widths[5]) / 2, 3)
    with open(path) as fh:
        w = json.load(fh)
    for im in w['design']['images'].values():
        im['visible'] = visible
    dump(path, w)

    with open(os.path.join(art, 'NOTICE.txt'), 'w') as fh:
        fh.write(f'The {world} world\'s pictures (map backgrounds, stations, scenes, sheet floor, celebration, card) were\n'
                 f'delivered as PNG with a manifest and converted to WebP by scripts/art/import_world.py.\n'
                 f'Made with: {manifest.get("tool", "(not stated in the manifest)")}\n')
    print(f'  {world}: imported into {os.path.relpath(art, ROOT)}')


if __name__ == '__main__':
    main()

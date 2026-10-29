"""Writes a drawn world's design into src/data/child/worlds/<world>/world.json: the shared layout of the drawn worlds
(the stations' places and trails, taken from the knight's design), the world's colours, and its pictures (each
station's picture on the map, its eye-level scene on the sheet, the map picture again on the choice card).

    from world_design import apply
    apply('fairy', {'reception': 'gate', ...}, colors={...}, top='#5d4f9a', title_bg='rgba(...)', accent='#7b4fb0')
"""
import copy
import json
import os
import re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
WORLDS = os.path.join(ROOT, 'src', 'data', 'child', 'worlds')
ORDER = ['id', 'order', 'emoji', 'doneEmoji', 'shopImage', 'bg', 'thumbnail', 'thumbnailOverlay', 'accent', 'accentSoft',
         'accentText', 'completedColor', 'stages', 'design']


def dump(path, data):
    text = json.dumps(data, ensure_ascii=False, indent=2)
    text = re.sub(r'\[\n\s+(-?[\d.]+),\n\s+(-?[\d.]+)\n\s+\]', r'[\1, \2]', text)
    with open(path, 'w') as fh:
        fh.write(text + '\n')


def apply(world, stations, colors, top, title_bg, accent, lift=0.05):
    with open(os.path.join(WORLDS, 'knight', 'world.json')) as fh:
        layout = json.load(fh)['design']
    path = os.path.join(WORLDS, world, 'world.json')
    with open(path) as fh:
        w = json.load(fh)
    art = lambda n: f'/worlds/{world}/art/{n}.webp'
    d = copy.deepcopy(layout)
    d['assets'] = {'background': art('map-portrait'), 'backgroundWide': art('map-landscape'), 'sheetSeabed': art('sheet-floor')}
    d['colors'] = {**colors, 'water': top, 'waterTop': top, 'waterLight': top}
    d['stations'], d['images'] = {}, {}
    for sid, name in stations.items():
        d['stations'][sid] = {'map': art(f'station-{name}'), 'sheet': art(f'scene-{name}'), 'panel': 'scene', 'choice': art(f'station-{name}')}
        d['images'][art(f'station-{name}')] = {'aspect': 1.3636, 'visible': 0.92, 'lift': lift}
    for sc in (d['dayMap']['portrait'], d['dayMap']['landscape'], d['nightMap']['portrait'], d['nightMap']['landscape']):
        sc['vars']['--map-bg'] = top
        if '--title-bg' in sc['vars']:
            sc['vars']['--title-bg'] = title_bg
    w.update(design=d, bg='', thumbnail=art('map-portrait'), thumbnailOverlay=art('card'), shopImage=art('celebrate'), accent=accent)
    w.setdefault('doneEmoji', '⭐')
    for k in ('bgLandscape', 'nightBg'):
        w.pop(k, None)
    for st in w.get('stages', {}).values():
        st.pop('image', None)
        st.pop('heroImage', None)
    dump(path, {k: w[k] for k in ORDER if k in w})


def set_ui(world, texts):
    """The world's own wording for the button after the doctor and the choice sheet's title: {lang: (button, title)}"""
    path = os.path.join(WORLDS, world, 'texts.json')
    with open(path) as fh:
        t = json.load(fh)
    for lang, (button, title) in texts.items():
        t[lang]['ui'] = {'decision': button, 'decisionTitle': title}
    with open(path, 'w') as fh:
        fh.write(json.dumps(t, ensure_ascii=False, indent=2) + '\n')

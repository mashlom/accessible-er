"""Draws the knight world's pictures (public/worlds/knight/art) as SVG, in a painted storybook style.

    python3 scripts/knight-art.py

Every picture is built from the same small set of drawing tools below (stone blocks, round towers with
shingled roofs, arches of wedge stones, plank doors, windows, flags, trees, grass), lit from the top left,
with a soft painted grain over it, and a light filter that rounds every edge (the 3D look of the ocean's
pictures). Do not mirror these pictures with a CSS transform: Chrome draws an SVG with lighting filters black
when it is flipped. No flashing, no glaring colours: the audience is sensitive to stimuli.
"""
import math
import os
import random
import zlib

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'worlds', 'knight', 'art')

# ---------- palette ----------
SKY0, SKY1 = '#4f8bc4', '#dcedf7'
STONE = '#cfc6b4'
SLATE = '#4f74a8'
RED = '#c4573f'
PURPLE = '#6b4fa0'
GOLD = '#e3b34a'
WOOD = '#8f5d3c'
IRON = '#4e4a52'
GRASS = '#86bd57'
CREAM = '#f4ead3'
WIN = '#ffd98a'
DARK = '#3b3346'
SKIN = '#f0c6a2'


def hex2rgb(c):
    c = c.lstrip('#')
    if len(c) == 3:
        c = ''.join(ch * 2 for ch in c)
    return [int(c[i:i + 2], 16) for i in (0, 2, 4)]


def shade(c, f):
    """f > 0 lightens toward white, f < 0 darkens toward black"""
    r = hex2rgb(c)
    if f >= 0:
        r = [v + (255 - v) * f for v in r]
    else:
        r = [v * (1 + f) for v in r]
    return '#' + ''.join(f'{max(0, min(255, round(v))):02x}' for v in r)


class Doc:
    """One picture: its defs (gradients, clips, filters) and its body, with unique ids"""

    def __init__(self, w, h, seed, prefix=''):
        self.w, self.h = w, h
        self.prefix = prefix
        self.defs, self.body = [], []
        self.n = 0
        self.rng = random.Random(seed)

    def id(self, p):
        self.n += 1
        return f'{self.prefix}{p}{self.n}'

    def add(self, *parts):
        self.body.extend(parts)

    def lin(self, stops, x1=0, y1=0, x2=0, y2=1, units=None):
        i = self.id('g')
        u = f' gradientUnits="{units}"' if units else ''
        s = ''.join(f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{a}"' if a is not None else '') + '/>' for o, c, a in [(st + (None,))[:3] for st in stops])
        self.defs.append(f'<linearGradient id="{i}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"{u}>{s}</linearGradient>')
        return f'url(#{i})'

    def rad(self, stops, cx=0.5, cy=0.5, r=0.5):
        i = self.id('r')
        s = ''.join(f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{a}"' if a is not None else '') + '/>' for o, c, a in [(st + (None,))[:3] for st in stops])
        self.defs.append(f'<radialGradient id="{i}" cx="{cx}" cy="{cy}" r="{r}">{s}</radialGradient>')
        return f'url(#{i})'

    def clip(self, shape):
        i = self.id('c')
        self.defs.append(f'<clipPath id="{i}">{shape}</clipPath>')
        return f'url(#{i})'

    def svg(self, comment, slice_=False, grain=0.13, wobble=1.6, clay=True, edges=True):
        par = ' preserveAspectRatio="xMidYMid slice"' if slice_ else ''
        # the 3D look (as the ocean's rendered pictures): every edge between colours is a soft rounded rise, lit from
        # the top left, with a gentle sheen; the colours themselves stay as drawn
        # edges: the outline of the picture is rounded too (a station standing free); a scene fills its frame, so its
        # border is not (the blur repeats the edge pixels instead of fading into nothing)
        region = 'x="-3%" y="-3%" width="106%" height="106%"' if edges else 'x="0" y="0" width="100%" height="100%"'
        light = f'''<filter id="clay" {region} color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceGraphic" stdDeviation="1.2" edgeMode="duplicate" result="blur"/>
<feColorMatrix in="blur" type="luminanceToAlpha" result="lum"/>
<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="ablur"/>
<feComposite in="lum" in2="ablur" operator="arithmetic" k2="0.6" k3="{0.6 if edges else 0}" result="height"/>
<feSpecularLighting in="height" surfaceScale="3" specularConstant="0.5" specularExponent="16" lighting-color="#fff8ec" result="spec"><feDistantLight azimuth="235" elevation="38"/></feSpecularLighting>
<feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
<feDiffuseLighting in="height" surfaceScale="3" diffuseConstant="1.3" lighting-color="#fff" result="diff"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>
<feBlend in="SourceGraphic" in2="diff" mode="multiply" result="lit"/>
<feComposite in="lit" in2="SourceAlpha" operator="in" result="litIn"/>
<feComposite in="litIn" in2="specIn" operator="arithmetic" k2="1" k3="0.5"/>
</filter>'''
        # the painted look: the edges wobble a little, and a fine grain lies over the colours (only where there is paint)
        paint = f'''<filter id="paint" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="warp"/>
<feDisplacementMap in="SourceGraphic" in2="warp" scale="{wobble}" xChannelSelector="R" yChannelSelector="G" result="wobbly"/>
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" result="noise"/>
<feColorMatrix in="noise" type="saturate" values="0" result="grey"/>
<feComposite in="wobbly" in2="grey" operator="arithmetic" k1="0" k2="1" k3="{grain}" k4="{-grain / 2}" result="grained"/>
<feComposite in="grained" in2="wobbly" operator="in"/>
</filter>'''
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}"{par}>\n'
                f'<!-- {comment} -->\n<defs>{paint}\n{light}\n' + '\n'.join(self.defs) + '</defs>\n'
                + ('<g filter="url(#clay)">' if clay else '<g>')
                + '<g filter="url(#paint)">\n' + '\n'.join(self.body) + '\n</g></g>\n</svg>\n')


# ---------- drawing tools ----------
def lit(d, x, y, w, h, strength=1.0, op=None):
    """Light from the top left over a box: brighter on the left, a shadow on the right and at the foot"""
    g = d.lin([(0, '#fff', 0.22 * strength), (0.45, '#fff', 0), (0.75, '#000', 0), (1, '#000', 0.26 * strength)], 0, 0, 1, 0)
    v = d.lin([(0, '#fff', 0.10 * strength), (0.7, '#000', 0), (1, '#000', 0.18 * strength)])
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{g}"/><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{v}"/>'


def blocks(d, x, y, w, h, color=STONE, bh=9, bw=(14, 26), clip=None, curved=False):
    """A wall of stone blocks with mortar between them; curved: the blocks narrow toward the sides (a round tower)"""
    rng = d.rng
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{shade(color, -0.28)}"/>']
    row = 0
    yy = y
    while yy < y + h:
        xx = -rng.uniform(0, bw[1])
        while xx < w:
            bwid = rng.uniform(*bw)
            a, b = max(0, xx), min(w, xx + bwid)
            if b - a > 2:
                if curved:
                    fa = 0.5 - 0.5 * math.cos(math.pi * a / w)
                    fb = 0.5 - 0.5 * math.cos(math.pi * b / w)
                    a, b = fa * w, fb * w
                c = shade(color, rng.uniform(-0.09, 0.07))
                out.append(f'<rect x="{x + a + 0.8:.1f}" y="{yy + 0.8:.1f}" width="{max(0.5, b - a - 1.6):.1f}" height="{bh - 1.6:.1f}" rx="1.6" fill="{c}"/>')
                out.append(f'<rect x="{x + a + 1.4:.1f}" y="{yy + 1.1:.1f}" width="{max(0.5, b - a - 2.8):.1f}" height="1.3" rx="0.6" fill="#fff" opacity="0.28"/>')
            xx += bwid
        yy += bh
        row += 1
    g = '\n'.join(out)
    return f'<g clip-path="{clip}">{g}</g>' if clip else g


def wall(d, x, y, w, h, color=STONE, bh=9, bw=(14, 26), light=1.0):
    clip = d.clip(f'<rect x="{x}" y="{y}" width="{w}" height="{h}"/>')
    return blocks(d, x, y, w, h, color, bh, bw, clip) + lit(d, x, y, w, h, light)


def crenels(d, x, w, y, n, color=STONE, h=10):
    step = w / (2 * n - 1)
    out = []
    for i in range(n):
        cx = x + i * 2 * step
        out.append(wall(d, round(cx, 1), y - h, round(step, 1), h, color, bh=h / 2, bw=(step / 2, step)))
        out.append(f'<rect x="{cx:.1f}" y="{y - h}" width="{step:.1f}" height="1.6" fill="#fff" opacity="0.35"/>')
    return '\n'.join(out)


def cylinder(d, x, y, w, h, color=STONE, bh=9):
    """A round tower's body: curved blocks, round shading"""
    clip = d.clip(f'<rect x="{x}" y="{y}" width="{w}" height="{h}"/>')
    g = d.lin([(0, '#000', 0.12), (0.22, '#fff', 0.22), (0.5, '#fff', 0), (0.82, '#000', 0.22), (1, '#000', 0.38)], 0, 0, 1, 0)
    return blocks(d, x, y, w, h, color, bh, (w / 7, w / 4), clip, curved=True) + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{g}"/>'


def cone(d, cx, base, w, h, color=SLATE, rows=6):
    """A conical roof with rows of shingles"""
    x0, x1, top = cx - w / 2, cx + w / 2, base - h
    shape = f'M{x0} {base} Q{cx} {base + w * 0.08} {x1} {base} L{cx} {top} Z'
    clip = d.clip(f'<path d="{shape}"/>')
    g = d.lin([(0, shade(color, 0.18)), (0.4, color), (1, shade(color, -0.35))], 0, 0, 1, 0)
    out = [f'<path d="{shape}" fill="{g}"/>']
    sh = []
    for r in range(1, rows + 1):
        t = r / rows
        yy = top + h * t
        half = w / 2 * t
        n = max(2, int(6 * t) + 2)
        step = 2 * half / n
        arcs = ''.join(f'Q{cx - half + (k + 0.5) * step:.1f} {yy + step * 0.45:.1f} {cx - half + (k + 1) * step:.1f} {yy:.1f} ' for k in range(n))
        sh.append(f'<path d="M{cx - half:.1f} {yy:.1f} {arcs}" fill="none" stroke="{shade(color, -0.4)}" stroke-width="1.2" opacity="0.7"/>')
    out.append(f'<g clip-path="{clip}">' + ''.join(sh) + '</g>')
    out.append(f'<path d="M{x0} {base} Q{cx} {base + w * 0.08} {x1} {base}" fill="none" stroke="{shade(color, -0.45)}" stroke-width="2"/>')
    out.append(f'<circle cx="{cx}" cy="{top}" r="2.6" fill="{GOLD}"/>')
    return '\n'.join(out)


def gable(d, x0, x1, base, h, color=RED, rows=6):
    """A pitched roof with rows of tiles, seen from the front"""
    cx = (x0 + x1) / 2
    shape = f'M{x0} {base} L{cx} {base - h} L{x1} {base} Z'
    clip = d.clip(f'<path d="{shape}"/>')
    g = d.lin([(0, shade(color, 0.12)), (0.5, color), (0.5, shade(color, -0.18)), (1, shade(color, -0.32))], 0, 0, 1, 0)
    rowsvg = []
    for r in range(1, rows + 1):
        yy = base - h + h * r / rows
        rowsvg.append(f'<line x1="{x0}" y1="{yy:.1f}" x2="{x1}" y2="{yy:.1f}" stroke="{shade(color, -0.38)}" stroke-width="1.2" opacity="0.7"/>')
        step = 9 + r
        k = (r % 2) * step / 2
        xx = x0 + k
        while xx < x1:
            rowsvg.append(f'<line x1="{xx:.1f}" y1="{yy - h / rows:.1f}" x2="{xx:.1f}" y2="{yy:.1f}" stroke="{shade(color, -0.3)}" stroke-width="0.9" opacity="0.55"/>')
            xx += step
    return (f'<path d="{shape}" fill="{g}"/><g clip-path="{clip}">' + ''.join(rowsvg) + '</g>'
            f'<path d="M{x0 - 3} {base + 1} L{cx} {base - h - 2} L{x1 + 3} {base + 1}" fill="none" stroke="{shade(color, -0.45)}" stroke-width="3" stroke-linejoin="round"/>')


def arch_path(x, y, w, h):
    """A round-topped opening: x, y is the top left of the rectangle under the arch, h its full height"""
    r = w / 2
    return f'M{x} {y + h} L{x} {y + r} A{r} {r} 0 0 1 {x + w} {y + r} L{x + w} {y + h} Z'


def voussoirs(x, y, w, n=9, depth=8, color=STONE):
    """The wedge stones around an arch"""
    r = w / 2
    cx, cy = x + r, y + r
    out = []
    for i in range(n):
        a0 = math.pi + math.pi * i / n
        a1 = math.pi + math.pi * (i + 1) / n
        ri, ro = r, r + depth
        p = [(cx + ri * math.cos(a0), cy + ri * math.sin(a0)), (cx + ro * math.cos(a0), cy + ro * math.sin(a0)),
             (cx + ro * math.cos(a1), cy + ro * math.sin(a1)), (cx + ri * math.cos(a1), cy + ri * math.sin(a1))]
        c = shade(color, 0.08 if i % 2 else -0.04)
        out.append(f'<polygon points="{" ".join(f"{px:.1f},{py:.1f}" for px, py in p)}" fill="{c}" stroke="{shade(color, -0.35)}" stroke-width="1"/>')
    out.append(f'<polygon points="{cx - 5:.1f},{cy - r - depth - 2:.1f} {cx + 5:.1f},{cy - r - depth - 2:.1f} {cx + 3:.1f},{cy - r + 1:.1f} {cx - 3:.1f},{cy - r + 1:.1f}" fill="{shade(color, 0.15)}" stroke="{shade(color, -0.35)}" stroke-width="1"/>')
    return '\n'.join(out)


def plank_door(d, x, y, w, h, color=WOOD, arch=True, studs=True):
    shape = arch_path(x, y, w, h) if arch else f'M{x} {y} h{w} v{h} h{-w} Z'
    clip = d.clip(f'<path d="{shape}"/>')
    n = max(3, int(w / 9))
    planks = []
    for i in range(n):
        px = x + i * w / n
        c = shade(color, d.rng.uniform(-0.08, 0.06))
        planks.append(f'<rect x="{px:.1f}" y="{y}" width="{w / n + 0.3:.1f}" height="{h}" fill="{c}"/>')
        planks.append(f'<line x1="{px:.1f}" y1="{y}" x2="{px:.1f}" y2="{y + h}" stroke="{shade(color, -0.45)}" stroke-width="1"/>')
        for k in range(2):
            gx = px + d.rng.uniform(2, w / n - 2)
            planks.append(f'<path d="M{gx:.1f} {y + h * 0.1:.1f} q2 {h * 0.2:.1f} 0 {h * 0.4:.1f} t0 {h * 0.4:.1f}" fill="none" stroke="{shade(color, -0.25)}" stroke-width="0.7" opacity="0.7"/>')
    bands = []
    for t in (0.35, 0.75):
        by = y + h * t
        bands.append(f'<rect x="{x}" y="{by:.1f}" width="{w}" height="{max(3, h * 0.05):.1f}" fill="{IRON}"/>')
        if studs:
            for i in range(n):
                bands.append(f'<circle cx="{x + (i + 0.5) * w / n:.1f}" cy="{by + max(3, h * 0.05) / 2:.1f}" r="1.3" fill="#9a96a0"/>')
    shadow = d.lin([(0, '#000', 0.35), (0.25, '#000', 0), (1, '#000', 0.1)], 0, 0, 0, 1)
    return (f'<g clip-path="{clip}">' + ''.join(planks) + ''.join(bands) + f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{shadow}"/></g>'
            f'<circle cx="{x + w * 0.78:.1f}" cy="{y + h * 0.58:.1f}" r="{max(2.2, w * 0.05):.1f}" fill="none" stroke="{GOLD}" stroke-width="1.6"/>')


def window(d, x, y, w, h, glow=True, cross=True, frame=STONE):
    glass = d.lin([(0, shade(WIN, 0.35)), (1, shade(WIN, -0.12))]) if glow else d.lin([(0, '#5d6f92'), (1, '#2f3a56')])
    out = [f'<path d="{arch_path(x - 2.5, y - 2.5, w + 5, h + 5)}" fill="{shade(frame, -0.2)}"/>',
           f'<path d="{arch_path(x, y, w, h)}" fill="{glass}"/>']
    if cross:
        out.append(f'<line x1="{x + w / 2}" y1="{y + 1}" x2="{x + w / 2}" y2="{y + h}" stroke="{shade(frame, -0.35)}" stroke-width="1.6"/>')
        out.append(f'<line x1="{x}" y1="{y + h * 0.55:.1f}" x2="{x + w}" y2="{y + h * 0.55:.1f}" stroke="{shade(frame, -0.35)}" stroke-width="1.6"/>')
    out.append(f'<rect x="{x - 3}" y="{y + h}" width="{w + 6}" height="3" fill="{shade(frame, 0.15)}"/>')
    return '\n'.join(out)


def flag(d, x, y, color, h=26, length=22, left=False):
    s = -1 if left else 1
    g = d.lin([(0, shade(color, 0.15)), (0.5, color), (1, shade(color, -0.25))], 0, 0, 1, 0)
    return (f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y + h}" stroke="{shade(WOOD, -0.3)}" stroke-width="2.2" stroke-linecap="round"/>'
            f'<circle cx="{x}" cy="{y - 1}" r="2.2" fill="{GOLD}"/>'
            f'<path d="M{x} {y + 1} q{s * length * 0.35} -3 {s * length * 0.6} 2 t{s * length * 0.4} 3 l{-s * length * 0.25} 4 l{s * length * 0.25} 4 q{-s * length * 0.4} -3 {-s * length * 0.6} 1 t{-s * length * 0.4} -2 Z" fill="{g}"/>')


def banner(d, x, y, w, h, color, emblem='star'):
    g = d.lin([(0, shade(color, 0.12)), (0.5, color), (1, shade(color, -0.3))], 0, 0, 1, 0)
    out = [f'<rect x="{x - 2}" y="{y - 2}" width="{w + 4}" height="3" rx="1.5" fill="{shade(WOOD, -0.2)}"/>',
           f'<path d="M{x} {y} h{w} v{h} l{-w / 2} {-h * 0.16} l{-w / 2} {h * 0.16} Z" fill="{g}"/>',
           f'<path d="M{x + 2} {y + 2} h{w - 4} v{h - 4}" fill="none" stroke="{GOLD}" stroke-width="1" opacity="0.8"/>']
    cx, cy = x + w / 2, y + h * 0.42
    if emblem == 'star':
        out.append(star(cx, cy, w * 0.28, GOLD))
    elif emblem == 'leaf':
        out.append(leaf(cx, cy, w / 22, '#5f9440'))
    elif emblem == 'crown':
        out.append(crown(cx, cy, w * 0.55))
    return '\n'.join(out)


def star(cx, cy, r, color=GOLD):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append(f'{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{color}" stroke="{shade(color, -0.25)}" stroke-width="0.6"/>'


def sparkle(cx, cy, r, color='#fff'):
    return f'<path d="M{cx} {cy - r} Q{cx + r * 0.18} {cy - r * 0.18} {cx + r} {cy} Q{cx + r * 0.18} {cy + r * 0.18} {cx} {cy + r} Q{cx - r * 0.18} {cy + r * 0.18} {cx - r} {cy} Q{cx - r * 0.18} {cy - r * 0.18} {cx} {cy - r} Z" fill="{color}"/>'


def leaf(cx, cy, s=1.0, color='#6fa548'):
    return (f'<path d="M{cx} {cy + 9 * s} Q{cx - 9 * s} {cy} {cx} {cy - 9 * s} Q{cx + 9 * s} {cy} {cx} {cy + 9 * s} Z" fill="{color}"/>'
            f'<line x1="{cx}" y1="{cy - 7 * s}" x2="{cx}" y2="{cy + 9 * s}" stroke="#fff" stroke-width="{1.1 * s}" opacity="0.75"/>')


def crown(cx, cy, w):
    h = w * 0.62
    x0 = cx - w / 2
    return (f'<path d="M{x0} {cy + h / 2} L{x0} {cy - h / 4} L{x0 + w * 0.25} {cy + h * 0.05} L{cx} {cy - h / 2} L{x0 + w * 0.75} {cy + h * 0.05} L{x0 + w} {cy - h / 4} L{x0 + w} {cy + h / 2} Z" fill="{GOLD}" stroke="{shade(GOLD, -0.35)}" stroke-width="1.2"/>'
            f'<circle cx="{cx}" cy="{cy + h * 0.2:.1f}" r="{w * 0.07:.1f}" fill="{RED}"/><circle cx="{x0 + w * 0.22:.1f}" cy="{cy + h * 0.25:.1f}" r="{w * 0.05:.1f}" fill="{SLATE}"/><circle cx="{x0 + w * 0.78:.1f}" cy="{cy + h * 0.25:.1f}" r="{w * 0.05:.1f}" fill="{SLATE}"/>')


def ivy(d, pts, s=1.0):
    """A creeper with leaves along a list of points"""
    path = 'M' + ' L'.join(f'{x:.0f} {y:.0f}' for x, y in pts)
    out = [f'<path d="{path}" fill="none" stroke="#4d7a35" stroke-width="{1.4 * s}" stroke-linejoin="round"/>']
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        for t in (0.2, 0.55, 0.85):
            x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            for side in (-1, 1):
                c = d.rng.choice(['#5f9440', '#6fa548', '#7fb35a'])
                lx, ly = x + side * d.rng.uniform(2, 4) * s, y + d.rng.uniform(-2, 2) * s
                out.append(f'<ellipse cx="{lx:.1f}" cy="{ly:.1f}" rx="{2.6 * s:.1f}" ry="{1.8 * s:.1f}" fill="{c}" transform="rotate({d.rng.uniform(-60, 60):.0f} {lx:.1f} {ly:.1f})"/>')
    return '\n'.join(out)


def tree(d, x, y, s=1.0):
    """A leafy tree standing at (x, y)"""
    rng = d.rng
    trunk = d.lin([(0, shade(WOOD, 0.1)), (1, shade(WOOD, -0.35))], 0, 0, 1, 0)
    out = [f'<ellipse cx="{x}" cy="{y + 2 * s}" rx="{22 * s}" ry="{5 * s}" fill="#000" opacity="0.15"/>',
           f'<path d="M{x - 5 * s} {y} Q{x - 3 * s} {y - 18 * s} {x - 4 * s} {y - 30 * s} L{x + 4 * s} {y - 30 * s} Q{x + 3 * s} {y - 18 * s} {x + 5 * s} {y} Z" fill="{trunk}"/>',
           f'<path d="M{x - 1 * s} {y - 8 * s} q1 {-6 * s} 0 {-14 * s}" stroke="{shade(WOOD, -0.45)}" stroke-width="{0.8 * s}" fill="none"/>']
    clusters = [(-14, -38, 15), (12, -40, 16), (0, -54, 17), (-6, -30, 12), (14, -28, 11), (-16, -50, 11), (10, -58, 11)]
    for dx, dy, r in clusters:
        out.append(f'<circle cx="{x + dx * s:.1f}" cy="{y + dy * s:.1f}" r="{r * s:.1f}" fill="#4f8a3b"/>')
    for dx, dy, r in clusters:
        out.append(f'<circle cx="{x + (dx - r * 0.25) * s:.1f}" cy="{y + (dy - r * 0.25) * s:.1f}" r="{r * 0.72 * s:.1f}" fill="#64a245"/>')
    for _ in range(int(14 * s) + 6):
        a = rng.uniform(0, 2 * math.pi)
        rr = rng.uniform(0, 22) * s
        lx, ly = x - 4 * s + rr * math.cos(a), y - 44 * s + rr * math.sin(a) * 0.8
        out.append(f'<ellipse cx="{lx:.1f}" cy="{ly:.1f}" rx="{2.4 * s:.1f}" ry="{1.6 * s:.1f}" fill="#86c062" opacity="0.9" transform="rotate({rng.uniform(-50, 50):.0f} {lx:.1f} {ly:.1f})"/>')
    return '\n'.join(out)


def bush(d, x, y, s=1.0, berries=False):
    out = [f'<ellipse cx="{x}" cy="{y + 2 * s}" rx="{20 * s}" ry="{4 * s}" fill="#000" opacity="0.13"/>']
    for dx, dy, r in ((-10, -6, 10), (9, -8, 12), (0, -14, 11)):
        out.append(f'<circle cx="{x + dx * s}" cy="{y + dy * s}" r="{r * s}" fill="#4f8a3b"/>')
        out.append(f'<circle cx="{x + (dx - 3) * s}" cy="{y + (dy - 3) * s}" r="{r * 0.65 * s}" fill="#68a648"/>')
    if berries:
        for _ in range(5):
            out.append(f'<circle cx="{x + d.rng.uniform(-14, 14) * s:.1f}" cy="{y + d.rng.uniform(-18, -4) * s:.1f}" r="{1.6 * s:.1f}" fill="#e87b8f"/>')
    return '\n'.join(out)


def tufts(d, x0, x1, y0, y1, n, color='#5e9a40', s=1.0):
    out = []
    for _ in range(n):
        x, y = d.rng.uniform(x0, x1), d.rng.uniform(y0, y1)
        h = d.rng.uniform(4, 7) * s
        out.append(f'<path d="M{x - 3 * s:.1f} {y:.1f} l{1.5 * s:.1f} {-h:.1f} l{1.2 * s:.1f} {h * 0.7:.1f} l{1.2 * s:.1f} {-h * 1.1:.1f} l{1 * s:.1f} {h * 1.1:.1f} l{1.4 * s:.1f} {-h * 0.8:.1f} l{0.8 * s:.1f} {h * 0.8:.1f} Z" fill="{color}"/>')
    return '\n'.join(out)


def flowers(d, x0, x1, y0, y1, n, s=1.0):
    cols = ['#ffffff', '#f6d36b', '#f2a0b5', '#c9b6f0', '#f7b267']
    out = []
    for _ in range(n):
        x, y = d.rng.uniform(x0, x1), d.rng.uniform(y0, y1)
        c = d.rng.choice(cols)
        r = d.rng.uniform(1.4, 2.4) * s
        out.append(f'<g><circle cx="{x - r:.1f}" cy="{y:.1f}" r="{r * 0.8:.1f}" fill="{c}"/><circle cx="{x + r:.1f}" cy="{y:.1f}" r="{r * 0.8:.1f}" fill="{c}"/><circle cx="{x:.1f}" cy="{y - r:.1f}" r="{r * 0.8:.1f}" fill="{c}"/><circle cx="{x:.1f}" cy="{y + r:.1f}" r="{r * 0.8:.1f}" fill="{c}"/><circle cx="{x:.1f}" cy="{y:.1f}" r="{r * 0.6:.1f}" fill="#e6a23c"/></g>')
    return '\n'.join(out)


def pebbles(d, x0, x1, y0, y1, n):
    return '\n'.join(f'<ellipse cx="{d.rng.uniform(x0, x1):.1f}" cy="{d.rng.uniform(y0, y1):.1f}" rx="{d.rng.uniform(2, 4):.1f}" ry="{d.rng.uniform(1.2, 2.2):.1f}" fill="{shade(STONE, d.rng.uniform(-0.25, 0.05))}"/>' for _ in range(n))


ROCK = '#a99f8f'


def rock(d, cx, cy, w, h, color=ROCK):
    """One rounded rock: lit on top, dark below, with a soft crack"""
    g = d.lin([(0, shade(color, 0.28)), (0.45, color), (1, shade(color, -0.42))])
    j = lambda: d.rng.uniform(-0.12, 0.12)
    x0, x1, y0, y1 = cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2
    path = (f'M{x0:.1f} {cy + h * j():.1f} Q{x0 + w * (0.05 + j() / 2):.1f} {y0 + h * (0.05 + j()):.1f} {cx + w * j():.1f} {y0:.1f} '
            f'Q{x1 - w * (0.05 + j() / 2):.1f} {y0 + h * (0.1 + j()):.1f} {x1:.1f} {cy + h * j():.1f} '
            f'Q{x1 - w * 0.04:.1f} {y1:.1f} {cx:.1f} {y1:.1f} Q{x0 + w * 0.04:.1f} {y1:.1f} {x0:.1f} {cy:.1f} Z')
    crack = f'<path d="M{cx + w * 0.1:.1f} {y0 + h * 0.3:.1f} q{w * 0.08:.1f} {h * 0.2:.1f} {-w * 0.02:.1f} {h * 0.45:.1f}" stroke="{shade(color, -0.45)}" stroke-width="1" fill="none" opacity="0.6"/>'
    return f'<path d="{path}" fill="{g}"/>' + (crack if w > 22 else '')


def mound(d):
    """The island every station stands on (300×220): a grassy top on a thick base of rounded rocks"""
    top = d.lin([(0, shade(GRASS, 0.22)), (0.7, GRASS), (1, shade(GRASS, -0.15))])
    out = [f'<ellipse cx="150" cy="206" rx="136" ry="12" fill="#000" opacity="0.16"/>',
           f'<path d="M16 180 Q18 218 150 219 Q282 218 284 180 Z" fill="{shade(ROCK, -0.5)}"/>']
    # the rocks along the front of the base, the far ones first
    rocks = []
    for i in range(13):
        a = math.pi * (1 - i / 12)
        rocks.append((186 + 18 * math.sin(a), 150 + 128 * math.cos(a)))
        # a second, lower row in the middle, where the base is thickest
        if 2 <= i <= 10:
            rocks.append((200 + 12 * math.sin(a), 150 + 118 * math.cos(a) + 10))
    for y, x in sorted(rocks):
        w = d.rng.uniform(28, 40)
        h = d.rng.uniform(20, 28)
        out.append(rock(d, x, min(y + 6, 206), w, h, shade(ROCK, d.rng.uniform(-0.08, 0.06))))
    out += [f'<ellipse cx="150" cy="180" rx="134" ry="24" fill="{shade(GRASS, -0.35)}"/>',
            f'<ellipse cx="150" cy="178" rx="132" ry="22" fill="{top}"/>',
            f'<ellipse cx="126" cy="172" rx="84" ry="9" fill="#fff" opacity="0.14"/>',
            # the grass hangs a little over the rocks' edge
            ''.join(f'<path d="M{150 + 130 * math.cos(math.pi * (1 - k / 20)):.1f} {180 + 22 * math.sin(math.pi * (1 - k / 20)):.1f} l3 6 l3 -5" fill="{shade(GRASS, -0.2)}"/>' for k in range(1, 20)),
            tufts(d, 30, 270, 172, 196, 26),
            flowers(d, 34, 266, 176, 194, 9),
            pebbles(d, 40, 260, 186, 196, 5)]
    return '\n'.join(out)


def contact(d, cx, cy, w):
    """The soft shadow where something stands on the ground"""
    g = d.rad([(0, '#000', 0.32), (1, '#000', 0)])
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{w / 2}" ry="{w * 0.09:.1f}" fill="{g}"/>'


def side_face(d, x, y, h, dx=16, dy=8, color=STONE, bh=9):
    """The side of a wall seen at an angle (three-quarter view): from the wall's right edge back and up"""
    poly = f'{x},{y} {x + dx},{y - dy} {x + dx},{y + h - dy} {x},{y + h}'
    clip = d.clip(f'<polygon points="{poly}"/>')
    rows = ''.join(f'<line x1="{x}" y1="{y + k * bh:.1f}" x2="{x + dx}" y2="{y + k * bh - dy:.1f}" stroke="{shade(color, -0.5)}" stroke-width="1"/>' for k in range(1, int(h / bh) + 1))
    return f'<polygon points="{poly}" fill="{shade(color, -0.3)}"/><g clip-path="{clip}">{rows}</g>'


def top_face(d, x, y, w, dx=16, dy=8, color=STONE):
    return f'<polygon points="{x},{y} {x + dx},{y - dy} {x + w + dx},{y - dy} {x + w},{y}" fill="{shade(color, 0.18)}"/>'


def roof_side(d, cx, apex, x1, base, dx=16, dy=8, color=RED):
    """The far slope of a pitched roof, seen at an angle"""
    g = d.lin([(0, shade(color, -0.2)), (1, shade(color, -0.45))], 0, 0, 1, 0)
    return f'<polygon points="{cx},{apex} {cx + dx},{apex - dy} {x1 + dx},{base - dy} {x1},{base}" fill="{g}"/>'


def tower_top(d, cx, y, w, color=STONE):
    """The top of a round tower seen from a little above: the walkway inside its ring of merlons"""
    return (f'<ellipse cx="{cx}" cy="{y}" rx="{w / 2 + 3}" ry="{w * 0.16:.1f}" fill="{shade(color, -0.2)}"/>'
            f'<ellipse cx="{cx}" cy="{y - 1}" rx="{w / 2 - 3}" ry="{w * 0.12:.1f}" fill="{shade(color, -0.45)}"/>')


def scroll(d, cx, cy, w):
    return (f'<rect x="{cx - w / 2}" y="{cy - 5}" width="{w}" height="10" fill="{CREAM}" stroke="{shade(GOLD, -0.4)}" stroke-width="1"/>'
            f'<ellipse cx="{cx - w / 2}" cy="{cy}" rx="4" ry="6" fill="{shade(CREAM, -0.08)}" stroke="{shade(GOLD, -0.4)}" stroke-width="1"/>'
            f'<ellipse cx="{cx + w / 2}" cy="{cy}" rx="4" ry="6" fill="{shade(CREAM, -0.08)}" stroke="{shade(GOLD, -0.4)}" stroke-width="1"/>'
            f'<rect x="{cx - 3}" y="{cy - 5}" width="6" height="10" fill="{RED}"/>')


def book(d, cx, cy, w, tilt=0):
    h = w * 0.36
    return (f'<g transform="rotate({tilt} {cx} {cy})"><path d="M{cx - w / 2} {cy} Q{cx - w / 4} {cy - h * 0.5} {cx} {cy} Q{cx + w / 4} {cy - h * 0.5} {cx + w / 2} {cy} L{cx + w / 2} {cy + h} Q{cx + w / 4} {cy + h * 0.5} {cx} {cy + h} Q{cx - w / 4} {cy + h * 0.5} {cx - w / 2} {cy + h} Z" fill="{CREAM}" stroke="{shade(WOOD, -0.3)}" stroke-width="1.4"/>'
            + ''.join(f'<path d="M{cx - w * 0.43:.1f} {cy + h * (0.25 + i * 0.18):.1f} Q{cx - w / 4:.1f} {cy + h * (0.05 + i * 0.18):.1f} {cx - w * 0.06:.1f} {cy + h * (0.25 + i * 0.18):.1f}" fill="none" stroke="#b9ab90" stroke-width="1"/>' for i in range(3))
            + ''.join(f'<path d="M{cx + w * 0.06:.1f} {cy + h * (0.25 + i * 0.18):.1f} Q{cx + w / 4:.1f} {cy + h * (0.05 + i * 0.18):.1f} {cx + w * 0.43:.1f} {cy + h * (0.25 + i * 0.18):.1f}" fill="none" stroke="#b9ab90" stroke-width="1"/>' for i in range(3))
            + f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy + h}" stroke="{shade(WOOD, -0.3)}" stroke-width="1.2"/></g>')


def lantern(d, x, y, s=1.0):
    glow = d.rad([(0, WIN, 0.55), (1, WIN, 0)])
    return (f'<circle cx="{x}" cy="{y}" r="{22 * s}" fill="{glow}"/>'
            f'<path d="M{x - 7 * s} {y - 9 * s} L{x} {y - 15 * s} L{x + 7 * s} {y - 9 * s} Z" fill="{IRON}"/>'
            f'<rect x="{x - 6 * s}" y="{y - 9 * s}" width="{12 * s}" height="{17 * s}" rx="{2 * s}" fill="{WIN}" stroke="{IRON}" stroke-width="{2 * s}"/>'
            f'<line x1="{x}" y1="{y - 9 * s}" x2="{x}" y2="{y + 8 * s}" stroke="{IRON}" stroke-width="{1.2 * s}"/>'
            f'<rect x="{x - 7 * s}" y="{y + 8 * s}" width="{14 * s}" height="{3 * s}" fill="{IRON}"/>')


def candle(d, x, y, h=26, s=1.0):
    glow = d.rad([(0, WIN, 0.5), (1, WIN, 0)])
    return (f'<circle cx="{x}" cy="{y - h - 6 * s}" r="{16 * s}" fill="{glow}"/>'
            f'<rect x="{x - 5 * s}" y="{y - h}" width="{10 * s}" height="{h}" rx="2" fill="#fbf3e0"/><rect x="{x - 5 * s}" y="{y - h}" width="{3 * s}" height="{h}" fill="#fff" opacity="0.5"/>'
            f'<path d="M{x} {y - h - 13 * s} Q{x + 5 * s} {y - h - 5 * s} {x} {y - h - 1 * s} Q{x - 5 * s} {y - h - 5 * s} {x} {y - h - 13 * s} Z" fill="{WIN}"/>'
            f'<path d="M{x} {y - h - 8 * s} Q{x + 2 * s} {y - h - 4 * s} {x} {y - h - 2 * s} Q{x - 2 * s} {y - h - 4 * s} {x} {y - h - 8 * s} Z" fill="#fff"/>'
            f'<ellipse cx="{x}" cy="{y}" rx="{9 * s}" ry="{3 * s}" fill="{shade(GOLD, -0.2)}"/>')


def cloud(cx, cy, s):
    return (f'<g opacity="0.95"><ellipse cx="{cx}" cy="{cy + 4 * s}" rx="{38 * s}" ry="{9 * s}" fill="#dfe9f3"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{34 * s}" ry="{12 * s}" fill="#fff"/><circle cx="{cx - 13 * s}" cy="{cy - 8 * s}" r="{13 * s}" fill="#fff"/>'
            f'<circle cx="{cx + 10 * s}" cy="{cy - 12 * s}" r="{16 * s}" fill="#fff"/><circle cx="{cx + 6 * s}" cy="{cy - 16 * s}" r="{8 * s}" fill="#fff"/></g>')


# ---------- the stations on the map (300×220) ----------
def station(name, draw, comment):
    d = Doc(300, 220, zlib.crc32(name.encode()) % 1000)
    d.add(mound(d))
    draw(d)
    return d.svg(f'Knight world: {comment}')


def draw_gate(d):
    # the curtain wall with the gatehouse, two round towers, the knights' book at the side
    d.add(contact(d, 150, 182, 230))
    d.add(top_face(d, 96, 92, 108, 10, 5))
    d.add(wall(d, 96, 92, 108, 90))
    d.add(crenels(d, 96, 108, 92, 5))
    d.add(f'<path d="{arch_path(126, 128, 48, 54)}" fill="{DARK}"/>')
    d.add(plank_door(d, 129, 131, 42, 51))
    d.add(voussoirs(126, 128, 48, 9, 7))
    for x in (54, 202):
        d.add(cylinder(d, x, 70, 44, 112))
        d.add(tower_top(d, x + 22, 72, 44))
        d.add(window(d, x + 17, 96, 10, 15, glow=False))
        d.add(window(d, x + 18, 136, 8, 12))
        d.add(cone(d, x + 22, 72, 56, 44))
        d.add(flag(d, x + 22, 12, RED, 18))
    d.add(ivy(d, [(98, 182), (104, 160), (100, 140), (110, 118)]))
    d.add(ivy(d, [(202, 182), (196, 164), (200, 150)], 0.9))
    d.add(banner(d, 108, 104, 12, 22, SLATE))
    d.add(banner(d, 180, 104, 12, 22, SLATE))
    d.add(f'<rect x="246" y="158" width="4" height="26" fill="{shade(WOOD, -0.3)}"/><path d="M238 186 h20" stroke="{shade(WOOD, -0.3)}" stroke-width="3"/>')
    d.add(book(d, 248, 150, 30, -8))
    d.add(lantern(d, 92, 150, 0.6))


def draw_courtyard(d):
    d.add(f'<path d="M36 156 Q150 122 264 156 L264 176 Q150 142 36 176 Z" fill="{STONE}"/>')
    clip = d.clip('<path d="M36 156 Q150 122 264 156 L264 176 Q150 142 36 176 Z"/>')
    d.add(blocks(d, 36, 124, 228, 54, STONE, 8, (12, 20), clip))
    d.add(f'<path d="M36 156 Q150 122 264 156" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>')
    d.add(tree(d, 236, 160, 1.15))
    d.add(bush(d, 52, 176, 0.8, berries=True))
    # the well with its little roof and bucket
    d.add(f'<rect x="88" y="124" width="5" height="44" fill="{WOOD}"/><rect x="139" y="124" width="5" height="44" fill="{WOOD}"/>')
    d.add(gable(d, 78, 154, 128, 26, RED, 4))
    d.add(f'<line x1="90" y1="134" x2="142" y2="134" stroke="{shade(WOOD, -0.3)}" stroke-width="3"/><circle cx="148" cy="134" r="5" fill="none" stroke="{shade(WOOD, -0.3)}" stroke-width="2"/>')
    d.add(f'<line x1="116" y1="134" x2="116" y2="146" stroke="#6b5a4a" stroke-width="1"/>')
    d.add(f'<path d="M109 145 h14 l-2 10 h-10 Z" fill="{WOOD}" stroke="{IRON}" stroke-width="1"/>')
    d.add(cylinder(d, 82, 152, 68, 22, STONE, 7))
    d.add(f'<ellipse cx="116" cy="152" rx="34" ry="7" fill="{shade(STONE, 0.15)}"/><ellipse cx="116" cy="152" rx="27" ry="5" fill="#2c3550"/><ellipse cx="112" cy="151" rx="10" ry="1.5" fill="#7fa7c9" opacity="0.6"/>')
    # the bench to wait on
    for yy in (150, 164):
        d.add(f'<rect x="166" y="{yy}" width="54" height="6" rx="2" fill="{WOOD}"/><line x1="166" y1="{yy + 3}" x2="220" y2="{yy + 3}" stroke="{shade(WOOD, -0.3)}" stroke-width="0.8"/>')
    for x in (170, 212):
        d.add(f'<rect x="{x}" y="155" width="4" height="27" fill="{shade(WOOD, -0.3)}"/>')
    d.add(f'<path d="M196 160 q6 -6 12 0" fill="none" stroke="{SLATE}" stroke-width="3"/>')


def draw_tent(d):
    d.add(contact(d, 150, 182, 200))
    # the healer's pavilion tent, striped, with scalloped edge and guy ropes
    body = 'M64 180 L84 96 L150 56 L216 96 L236 180 Z'
    clip = d.clip(f'<path d="{body}"/>')
    stripes = []
    for i in range(-2, 12):
        c = SLATE if i % 2 == 0 else CREAM
        stripes.append(f'<polygon points="150,56 {40 + i * 22},190 {62 + i * 22},190" fill="{c}"/>')
    shading = d.lin([(0, '#fff', 0.15), (0.5, '#fff', 0), (1, '#000', 0.25)], 0, 0, 1, 0)
    d.add(f'<g clip-path="{clip}">' + ''.join(stripes) + f'<rect x="60" y="50" width="180" height="140" fill="{shading}"/></g>')
    sc = ''.join(f'Q{84 + i * 16.5 + 8.25:.1f} {108} {84 + (i + 1) * 16.5:.1f} 96 ' for i in range(8))
    d.add(f'<path d="M84 96 {sc} L216 100 L84 100 Z" fill="{RED}"/>')
    d.add(f'<path d="M150 116 Q140 150 128 180 L172 180 Q160 150 150 116 Z" fill="{DARK}"/>')
    d.add(f'<path d="M150 116 Q136 150 118 180 L128 180 Q140 150 150 116 Z" fill="{CREAM}"/><path d="M150 116 Q164 150 182 180 L172 180 Q160 150 150 116 Z" fill="{shade(CREAM, -0.1)}"/>')
    d.add(lantern(d, 150, 150, 0.55))
    for x0, x1 in ((84, 40), (216, 260)):
        d.add(f'<line x1="{x0}" y1="98" x2="{x1}" y2="182" stroke="#8a7c66" stroke-width="1"/><rect x="{x1 - 2}" y="178" width="4" height="7" fill="{WOOD}"/>')
    d.add(f'<line x1="150" y1="56" x2="150" y2="24" stroke="{shade(WOOD, -0.3)}" stroke-width="2.5"/>')
    d.add(flag(d, 150, 18, '#5f9440', 14))
    d.add(banner(d, 92, 118, 18, 28, CREAM, 'leaf'))
    d.add(f'<path d="M204 148 L232 148 L232 166 Q232 180 218 186 Q204 180 204 166 Z" fill="{RED}" stroke="{GOLD}" stroke-width="2.5"/>')
    d.add(star(218, 164, 7, GOLD))
    d.add(f'<rect x="230" y="170" width="18" height="12" fill="{WOOD}" stroke="{shade(WOOD, -0.35)}" stroke-width="1"/><circle cx="239" cy="168" r="4" fill="#b9d7ee"/>')


def draw_hall(d):
    d.add(contact(d, 160, 182, 230))
    d.add(side_face(d, 246, 94, 88, 18, 9))
    d.add(roof_side(d, 150, 40, 256, 96, 18, 9, RED))
    d.add(wall(d, 54, 94, 192, 88))
    d.add(gable(d, 44, 256, 96, 56, RED, 7))
    d.add(f'<circle cx="150" cy="72" r="11" fill="{shade(STONE, -0.25)}"/><circle cx="150" cy="72" r="8.5" fill="{WIN}"/>')
    for a in range(0, 360, 45):
        d.add(f'<line x1="150" y1="72" x2="{150 + 8 * math.cos(math.radians(a)):.1f}" y2="{72 + 8 * math.sin(math.radians(a)):.1f}" stroke="{shade(STONE, -0.3)}" stroke-width="1"/>')
    for x in (70, 98, 188, 216):
        d.add(window(d, x, 116, 14, 30))
    d.add(f'<path d="{arch_path(132, 136, 36, 46)}" fill="{shade(STONE, -0.3)}"/>')
    d.add(plank_door(d, 135, 139, 30, 43))
    d.add(voussoirs(132, 136, 36, 7, 6))
    d.add(banner(d, 120, 104, 11, 22, SLATE))
    d.add(banner(d, 169, 104, 11, 22, SLATE))
    d.add(f'<rect x="58" y="180" width="184" height="4" fill="{shade(STONE, -0.2)}"/>')
    d.add(ivy(d, [(56, 182), (62, 160), (58, 140), (66, 124)]))
    d.add(bush(d, 246, 186, 0.7))
    d.add(lantern(d, 128, 150, 0.45))
    d.add(lantern(d, 172, 150, 0.45))


def draw_wizard(d):
    d.add(contact(d, 170, 182, 190))
    d.add(cylinder(d, 112, 66, 76, 116))
    d.add(f'<rect x="104" y="62" width="92" height="8" rx="3" fill="{shade(STONE, -0.15)}"/>')
    for x in range(106, 196, 10):
        d.add(f'<rect x="{x}" y="70" width="5" height="5" fill="{shade(STONE, -0.3)}"/>')
    d.add(cone(d, 150, 66, 104, 62, PURPLE, 7))
    d.add(star(134, 44, 5))
    d.add(star(158, 30, 3.6))
    d.add(star(168, 52, 3.4))
    d.add(f'<path d="M150 4 q8 0 9 6" fill="none" stroke="{GOLD}" stroke-width="2"/>')
    d.add(f'<circle cx="150" cy="98" r="14" fill="{shade(STONE, -0.25)}"/><circle cx="150" cy="98" r="11" fill="#33427a"/>')
    d.add(star(146, 94, 3, '#fff'))
    d.add(f'<path d="M154 92 a6 6 0 1 0 4 9 a5 5 0 1 1 -4 -9 Z" fill="{WIN}"/>')
    d.add(f'<path d="{arch_path(136, 140, 28, 42)}" fill="{shade(STONE, -0.3)}"/>')
    d.add(plank_door(d, 138, 142, 24, 40, '#5b4380'))
    d.add(star(150, 158, 4))
    d.add(f'<path d="M188 120 h16 v6 h-16 Z" fill="{WOOD}"/>')
    for x in (190, 196, 202):
        d.add(f'<line x1="{x}" y1="112" x2="{x}" y2="120" stroke="{shade(WOOD, -0.3)}" stroke-width="1.4"/>')
    d.add(f'<rect x="196" y="136" width="46" height="46" fill="{STONE}"/>')
    d.add(side_face(d, 242, 136, 46, 12, 6))
    d.add(roof_side(d, 219, 112, 248, 138, 12, 6, PURPLE))
    d.add(wall(d, 196, 136, 46, 46, STONE, 8, (10, 16)))
    d.add(gable(d, 190, 248, 138, 26, PURPLE, 4))
    d.add(window(d, 212, 150, 14, 18))
    d.add(ivy(d, [(114, 182), (120, 160), (116, 140), (124, 120), (120, 104)]))
    d.add(f'<line x1="76" y1="184" x2="76" y2="146" stroke="{IRON}" stroke-width="2.5"/>')
    d.add(lantern(d, 76, 140, 0.6))
    d.add(f'<path d="M248 182 l6 -22 l6 22 Z" fill="{PURPLE}"/><circle cx="254" cy="158" r="3" fill="{GOLD}"/>')


def draw_mirror(d):
    d.add(contact(d, 150, 184, 90))
    d.add(f'<path d="M124 184 L134 156 L166 156 L176 184 Z" fill="{shade(GOLD, -0.2)}"/>')
    d.add(f'<path d="M134 156 L166 156 L162 150 L138 150 Z" fill="{GOLD}"/>')
    d.add(f'<rect x="144" y="136" width="12" height="18" fill="{shade(GOLD, -0.25)}"/>')
    frame = d.lin([(0, shade(GOLD, 0.3)), (0.5, GOLD), (1, shade(GOLD, -0.35))], 0, 0, 1, 1)
    glass = d.lin([(0, '#e9f6fc'), (0.5, '#b9dcef'), (1, '#8fbfdc')], 0, 0, 1, 1)
    d.add(f'<ellipse cx="150" cy="84" rx="52" ry="64" fill="{frame}"/>')
    for a in range(0, 360, 30):
        x, y = 150 + 47 * math.cos(math.radians(a)), 84 + 59 * math.sin(math.radians(a))
        d.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.4" fill="{shade(GOLD, 0.35)}"/>')
    d.add(f'<ellipse cx="150" cy="84" rx="42" ry="54" fill="{glass}" stroke="{shade(GOLD, -0.4)}" stroke-width="1.5"/>')
    d.add(f'<path d="M122 66 Q138 42 162 38 Q138 56 130 84 Z" fill="#fff" opacity="0.75"/>')
    d.add(f'<path d="M150 124 Q170 112 178 92 Q174 116 158 128 Z" fill="#fff" opacity="0.45"/>')
    d.add(crown(150, 22, 22))
    d.add(f'<path d="M98 30 Q90 84 100 140" fill="none" stroke="{RED}" stroke-width="8" stroke-linecap="round" opacity="0.85"/>')
    d.add(f'<path d="M202 30 Q210 84 200 140" fill="none" stroke="{RED}" stroke-width="8" stroke-linecap="round" opacity="0.85"/>')
    d.add(sparkle(84, 70, 8, GOLD))
    d.add(sparkle(220, 102, 7, GOLD))
    d.add(sparkle(212, 46, 5, '#fff'))
    d.add(bush(d, 240, 184, 0.6, True))


def draw_forge(d):
    d.add(contact(d, 130, 182, 170))
    d.add(side_face(d, 182, 98, 84, 16, 8))
    d.add(roof_side(d, 121, 58, 192, 100, 16, 8, WOOD))
    d.add(wall(d, 60, 98, 122, 84))
    d.add(wall(d, 146, 42, 22, 60, STONE, 7, (8, 12)))
    d.add(f'<rect x="143" y="38" width="28" height="6" fill="{shade(STONE, -0.2)}"/>')
    d.add(gable(d, 50, 192, 100, 42, WOOD, 5))
    d.add(f'<circle cx="160" cy="30" r="8" fill="#e9e6ee" opacity="0.7"/><circle cx="168" cy="17" r="6" fill="#e9e6ee" opacity="0.55"/><circle cx="176" cy="8" r="4" fill="#e9e6ee" opacity="0.4"/>')
    d.add(f'<path d="{arch_path(84, 134, 50, 48)}" fill="{DARK}"/>')
    glow = d.rad([(0, '#ffd27a'), (0.6, '#f08a3c'), (1, '#b8502a')], 0.5, 0.8, 0.7)
    d.add(f'<path d="{arch_path(92, 146, 34, 36)}" fill="{glow}"/>')
    d.add(f'<path d="M100 182 Q103 162 109 152 Q115 162 118 182 Z" fill="#fff3c4" opacity="0.8"/>')
    d.add(voussoirs(84, 134, 50, 9, 7))
    for i, x in enumerate((64, 72)):
        d.add(f'<line x1="{x}" y1="112" x2="{x}" y2="132" stroke="{WOOD}" stroke-width="2"/><rect x="{x - 3}" y="130" width="6" height="5" fill="{IRON}"/>')
    d.add(window(d, 150, 118, 14, 18, glow=True))
    anvil = d.lin([(0, '#8a8f9c'), (1, '#4f535e')])
    d.add(f'<path d="M194 150 L254 150 Q254 160 242 162 L230 162 L230 174 L240 184 L210 184 L220 174 L220 162 L204 162 Q194 158 194 150 Z" fill="{anvil}"/>')
    d.add(f'<path d="M194 150 L254 150 L252 146 L198 146 Z" fill="#a9aebb"/><path d="M254 147 q14 0 18 6 q-8 -2 -18 0 Z" fill="#6c707c"/>')
    d.add(f'<rect x="232" y="126" width="5" height="26" rx="2" transform="rotate(-30 234 139)" fill="{WOOD}"/>')
    d.add(f'<rect x="224" y="118" width="20" height="11" rx="2" transform="rotate(-30 234 124)" fill="#7a7f8c"/>')
    d.add(f'<rect x="38" y="166" width="20" height="18" rx="3" fill="{WOOD}" stroke="{IRON}" stroke-width="1.5"/><ellipse cx="48" cy="166" rx="10" ry="3" fill="#7fb3d5"/>')
    d.add(f'<path d="M180 184 L184 168 L190 184 Z" fill="{shade(WOOD, -0.2)}"/>')


def draw_council(d):
    d.add(contact(d, 150, 182, 200))
    for x in (62, 238):
        d.add(f'<rect x="{x - 3}" y="78" width="6" height="106" fill="{WOOD}"/><circle cx="{x}" cy="78" r="4" fill="{GOLD}"/>')
    d.add(cone(d, 150, 82, 210, 58, SLATE, 5))
    sc = ''.join(f'Q{45 + i * 26.25 + 13.1:.1f} 100 {45 + (i + 1) * 26.25:.1f} 82 ' for i in range(8))
    d.add(f'<path d="M45 82 {sc} Z" fill="{CREAM}" stroke="{shade(CREAM, -0.25)}" stroke-width="1"/>')
    d.add(''.join(f'<circle cx="{45 + (i + 0.5) * 26.25:.1f}" cy="94" r="2" fill="{GOLD}"/>' for i in range(8)))
    d.add(flag(d, 150, 6, GOLD, 18))
    for x, c in ((94, RED), (206, RED)):
        d.add(f'<rect x="{x - 13}" y="116" width="26" height="46" rx="7" fill="{c}"/><rect x="{x - 9}" y="120" width="18" height="12" rx="4" fill="#fff" opacity="0.18"/>')
        d.add(f'<rect x="{x - 15}" y="156" width="30" height="8" rx="2" fill="{shade(WOOD, -0.2)}"/><rect x="{x - 13}" y="164" width="4" height="18" fill="{shade(WOOD, -0.3)}"/><rect x="{x + 9}" y="164" width="4" height="18" fill="{shade(WOOD, -0.3)}"/>')
    d.add(f'<rect x="137" y="108" width="26" height="40" rx="7" fill="{PURPLE}"/><circle cx="150" cy="118" r="4" fill="{GOLD}"/>')
    top = d.lin([(0, shade(WOOD, 0.25)), (1, WOOD)])
    d.add(f'<ellipse cx="150" cy="152" rx="50" ry="13" fill="{shade(WOOD, -0.3)}"/><ellipse cx="150" cy="148" rx="50" ry="12" fill="{top}"/>')
    d.add(f'<ellipse cx="150" cy="148" rx="40" ry="8" fill="none" stroke="{shade(WOOD, -0.25)}" stroke-width="1"/>')
    d.add(f'<rect x="144" y="158" width="12" height="24" fill="{shade(WOOD, -0.3)}"/>')
    d.add(scroll(d, 134, 144, 20))
    d.add(scroll(d, 166, 148, 16))
    d.add(candle(d, 152, 146, 10, 0.5))


def draw_prophecy(d):
    d.add(contact(d, 150, 184, 100))
    d.add(f'<path d="M116 184 L126 156 L174 156 L184 184 Z" fill="{shade(GOLD, -0.2)}"/>')
    d.add(f'<path d="M124 160 Q150 140 176 160 L172 148 Q150 134 128 148 Z" fill="{GOLD}"/>')
    for x in (130, 150, 170):
        d.add(f'<circle cx="{x}" cy="170" r="3" fill="{shade(GOLD, 0.3)}"/>')
    halo = d.rad([(0, '#e6dbff', 0.6), (1, '#e6dbff', 0)])
    ball = d.rad([(0, '#f3edff'), (0.45, '#b49ae6'), (1, '#4e3a80')], 0.38, 0.32, 0.72)
    d.add(f'<circle cx="150" cy="96" r="66" fill="{halo}"/>')
    d.add(f'<circle cx="150" cy="96" r="46" fill="{ball}"/>')
    d.add(f'<path d="M122 108 Q140 80 172 90 Q148 96 138 118 Z" fill="#fff" opacity="0.3"/>')
    d.add(f'<path d="M132 118 Q156 108 176 116 Q160 126 140 124 Z" fill="#d5c4ff" opacity="0.45"/>')
    d.add(f'<ellipse cx="133" cy="74" rx="11" ry="6" fill="#fff" opacity="0.75" transform="rotate(-30 133 74)"/>')
    d.add(star(166, 106, 5, '#fff'))
    d.add(star(140, 98, 3, '#fff'))
    d.add(sparkle(88, 66, 8, GOLD))
    d.add(sparkle(214, 88, 7, GOLD))
    d.add(star(206, 40, 4.5))
    d.add(candle(d, 96, 182, 22, 0.8))
    d.add(candle(d, 206, 182, 18, 0.8))


def draw_victory(d):
    d.add(contact(d, 150, 182, 230))
    d.add(top_face(d, 70, 102, 160, 10, 5))
    d.add(wall(d, 70, 102, 160, 80))
    d.add(crenels(d, 70, 160, 102, 7))
    d.add(wall(d, 118, 60, 64, 44))
    d.add(crenels(d, 118, 64, 60, 4))
    for x in (44, 216):
        d.add(cylinder(d, x, 86, 40, 96))
        d.add(tower_top(d, x + 20, 88, 40))
        d.add(window(d, x + 16, 110, 8, 12))
        d.add(cone(d, x + 20, 88, 52, 40, RED))
        d.add(flag(d, x + 20, 34, SLATE, 16))
    d.add(f'<path d="{arch_path(130, 134, 40, 48)}" fill="{DARK}"/>')
    d.add(plank_door(d, 133, 137, 34, 45))
    d.add(voussoirs(130, 134, 40, 8, 6))
    d.add(crown(150, 82, 26))
    d.add(flag(d, 150, 20, GOLD, 30, 26))
    d.add(window(d, 130, 74, 8, 12))
    d.add(window(d, 162, 74, 8, 12))
    cols = [RED, GOLD, SLATE]
    d.add(f'<path d="M76 112 Q150 126 224 112" fill="none" stroke="{shade(WOOD, -0.3)}" stroke-width="1.2"/>')
    for i in range(9):
        x = 80 + i * 16
        t = (x - 76) / 148
        y = 112 + 14 * 4 * t * (1 - t) * 0.5
        d.add(f'<path d="M{x} {y:.1f} l6 10 l6 -10 Z" fill="{cols[i % 3]}"/>')
    d.add(banner(d, 92, 120, 12, 24, SLATE, 'crown'))
    d.add(banner(d, 196, 120, 12, 24, SLATE, 'crown'))


STATIONS = {
    'gate': (draw_gate, 'the castle gate (reception)'),
    'courtyard': (draw_courtyard, 'the castle courtyard (waiting before the checks)'),
    'tent': (draw_tent, "the healer's tent (the checks)"),
    'hall': (draw_hall, 'the hall of the knights (waiting for the wizard)'),
    'wizard': (draw_wizard, "the great wizard's tower (the doctor)"),
    'mirror': (draw_mirror, 'the magic mirror (imaging)'),
    'forge': (draw_forge, 'the forge (treatment)'),
    'council': (draw_council, 'the council of the wise (consultation)'),
    'prophecy': (draw_prophecy, 'waiting for the prophecy (waiting for results)'),
    'victory': (draw_victory, 'the victory feast (the end of the journey)'),
}


# ---------- the scenes: each place as seen by someone standing in it (the station's sheet, 364×340) ----------
SW, SH = 364, 340


def sky(d, h=SH):
    g = d.lin([(0, SKY0), (1, SKY1)])
    return f'<rect width="{SW}" height="{h}" fill="{g}"/>'


def room(d, back, wall_c, floor_c, ceiling_c, planks=True, bh=12):
    """An inside view: back wall, side walls, floor and ceiling in perspective (the walls of stone blocks)"""
    x0, y0, x1, y1 = back
    out = [f'<rect width="{SW}" height="{SH}" fill="{wall_c}"/>',
           blocks(d, x0, y0, x1 - x0, y1 - y0, wall_c, bh, (18, 30), d.clip(f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}"/>'))]
    for pts, sh in (((0, 0), (x0, y0), (x0, y1), (0, SH)), -0.12), ((((SW, 0), (x1, y0), (x1, y1), (SW, SH)), -0.22)):
        poly = ' '.join(f'{a},{b}' for a, b in pts)
        out.append(f'<polygon points="{poly}" fill="{shade(wall_c, sh)}"/>')
        clip = d.clip(f'<polygon points="{poly}"/>')
        rows = []
        for k in range(1, 14):
            t = k / 14
            ya = pts[1][1] + (pts[2][1] - pts[1][1]) * t
            yb = pts[0][1] + (pts[3][1] - pts[0][1]) * t
            rows.append(f'<line x1="{pts[1][0]}" y1="{ya:.1f}" x2="{pts[0][0]}" y2="{yb:.1f}" stroke="{shade(wall_c, sh - 0.2)}" stroke-width="1.2"/>')
        out.append(f'<g clip-path="{clip}">' + ''.join(rows) + '</g>')
    ceil = f'0,0 {SW},0 {x1},{y0} {x0},{y0}'
    out.append(f'<polygon points="{ceil}" fill="{ceiling_c}"/>')
    cclip = d.clip(f'<polygon points="{ceil}"/>')
    out.append(f'<g clip-path="{cclip}">' + ''.join(f'<line x1="{x0 + (x1 - x0) * k / 6:.1f}" y1="{y0}" x2="{SW * k / 6:.1f}" y2="0" stroke="{shade(ceiling_c, -0.3)}" stroke-width="6"/>' for k in range(1, 6)) + '</g>')
    fl = f'0,{SH} {x0},{y1} {x1},{y1} {SW},{SH}'
    out.append(f'<polygon points="{fl}" fill="{floor_c}"/>')
    fclip = d.clip(f'<polygon points="{fl}"/>')
    lines = []
    for k in range(1, 9):
        t = k / 9
        lines.append(f'<line x1="{x0 + (x1 - x0) * t:.1f}" y1="{y1}" x2="{SW * t:.1f}" y2="{SH}" stroke="{shade(floor_c, -0.25)}" stroke-width="1.4"/>')
    if not planks:
        for t in (0.12, 0.3, 0.55, 0.85):
            y = y1 + (SH - y1) * t
            lines.append(f'<line x1="0" y1="{y:.1f}" x2="{SW}" y2="{y:.1f}" stroke="{shade(floor_c, -0.25)}" stroke-width="1.4"/>')
    fshade = d.lin([(0, '#000', 0.25), (0.4, '#000', 0)])
    out.append(f'<g clip-path="{fclip}">' + ''.join(lines) + f'<rect x="0" y="{y1}" width="{SW}" height="{SH - y1}" fill="{fshade}"/></g>')
    return '\n'.join(out)


def cobbles(d, y0, color='#c9c0ae'):
    out = [f'<rect x="0" y="{y0}" width="{SW}" height="{SH - y0}" fill="{shade(color, -0.3)}"/>']
    rows = 7
    for r in range(rows):
        ya = y0 + (SH - y0) * (r / rows) ** 1.25
        yb = y0 + (SH - y0) * ((r + 1) / rows) ** 1.25
        step = 16 + r * 9
        x = -d.rng.uniform(0, step)
        while x < SW:
            w = step * d.rng.uniform(0.8, 1.15)
            out.append(f'<rect x="{x + 1:.1f}" y="{ya + 1:.1f}" width="{w - 2:.1f}" height="{yb - ya - 2:.1f}" rx="{2 + r:.1f}" fill="{shade(color, d.rng.uniform(-0.1, 0.06))}"/>')
            x += w
    g = d.lin([(0, '#000', 0.18), (0.5, '#000', 0)])
    out.append(f'<rect x="0" y="{y0}" width="{SW}" height="{SH - y0}" fill="{g}"/>')
    return '\n'.join(out)


def scene(name, draw, comment):
    d = Doc(SW, SH, zlib.crc32(("scene" + name).encode()) % 1000)
    draw(d)
    return d.svg(f'Knight world: {comment}, as seen standing there', slice_=True, edges=False)


def sc_gate(d):
    d.add(sky(d))
    d.add(cloud(70, 40, 0.8))
    d.add(wall(d, 0, 74, SW, 200, STONE, 14, (24, 40)))
    d.add(crenels(d, 0, SW, 74, 12, STONE, 14))
    for x in (-24, 290):
        d.add(cylinder(d, x, 26, 98, 248, STONE, 14))
        d.add(window(d, x + 42, 84, 14, 24, glow=False))
        d.add(cone(d, x + 49, 30, 120, 70, SLATE, 7))
        d.add(flag(d, x + 49, -30, RED, 24, 30, left=x > 0))
    # through the gate (only what the arch lets one see): the sky, the courtyard and the keep
    inside = d.clip(f'<path d="{arch_path(112, 150, 140, 124)}"/>')
    view = [f'<path d="{arch_path(112, 150, 140, 124)}" fill="#a8cde8"/>',
            f'<rect x="112" y="226" width="140" height="48" fill="{GRASS}"/>',
            tufts(d, 116, 248, 232, 270, 12),
            wall(d, 158, 186, 48, 44, STONE, 9, (12, 18)),
            cone(d, 182, 188, 62, 34, RED, 4),
            window(d, 176, 200, 12, 16)]
    d.add(f'<g clip-path="{inside}">' + '\n'.join(view) + '</g>')
    # the open doors and the arch of wedge stones
    d.add(f'<g transform="translate(118 160) scale(0.38 1)">{plank_door(d, 0, 0, 60, 114, WOOD, arch=False)}</g>')
    d.add(f'<g transform="translate(224 160) scale(0.38 1)">{plank_door(d, 0, 0, 60, 114, WOOD, arch=False)}</g>')
    d.add(voussoirs(112, 150, 140, 13, 16))
    d.add(f'<rect x="166" y="138" width="32" height="10" fill="{IRON}"/>' + ''.join(f'<line x1="{x}" y1="148" x2="{x}" y2="162" stroke="{IRON}" stroke-width="2.5"/>' for x in range(170, 198, 6)))
    d.add(banner(d, 24, 128, 30, 58, RED, 'star'))
    d.add(banner(d, 310, 128, 30, 58, RED, 'star'))
    d.add(ivy(d, [(98, 274), (104, 240), (96, 210), (106, 186), (100, 160)], 1.4))
    d.add(lantern(d, 92, 200, 1.0))
    d.add(cobbles(d, 272))
    # the knights' book on its stand, ready for the name
    d.add(f'<rect x="282" y="250" width="10" height="72" fill="{shade(WOOD, -0.2)}"/><path d="M262 324 h50" stroke="{shade(WOOD, -0.35)}" stroke-width="6" stroke-linecap="round"/>')
    d.add(f'<path d="M244 232 L330 232 L322 252 L252 252 Z" fill="{WOOD}"/>')
    d.add(book(d, 287, 218, 76, -4))
    d.add(f'<path d="M318 210 l12 -22" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M318 210 l12 -22" stroke="{SLATE}" stroke-width="1"/>')


def sc_courtyard(d):
    d.add(sky(d))
    d.add(cloud(290, 34, 0.9))
    d.add(wall(d, 116, 34, 132, 140, STONE, 12, (20, 32)))
    d.add(crenels(d, 116, 132, 34, 6, STONE, 12))
    d.add(window(d, 140, 70, 14, 24))
    d.add(window(d, 210, 70, 14, 24))
    d.add(f'<path d="{arch_path(166, 116, 32, 58)}" fill="{shade(STONE, -0.3)}"/>')
    d.add(plank_door(d, 168, 118, 28, 56))
    d.add(wall(d, 0, 112, SW, 70, shade(STONE, 0.1), 12, (22, 34)))
    d.add(crenels(d, 0, SW, 112, 13, shade(STONE, 0.1), 12))
    d.add(ivy(d, [(330, 182), (322, 160), (334, 140), (326, 120)], 1.3))
    ground = d.lin([(0, shade(GRASS, 0.12)), (1, shade(GRASS, -0.1))])
    d.add(f'<rect x="0" y="180" width="{SW}" height="{SH - 180}" fill="{ground}"/>')
    d.add(f'<path d="M104 340 Q170 230 176 180 L192 180 Q206 240 272 340 Z" fill="#d2c3a2"/>')
    d.add(pebbles(d, 120, 250, 200, 330, 26))
    d.add(tufts(d, 0, SW, 186, 330, 50, '#5e9a40', 1.3))
    d.add(flowers(d, 0, 100, 200, 320, 18, 1.4))
    d.add(flowers(d, 270, 364, 200, 320, 14, 1.4))
    d.add(tree(d, 58, 214, 2.0))
    # the well, in the middle
    d.add(f'<rect x="214" y="150" width="7" height="60" fill="{WOOD}"/><rect x="293" y="150" width="7" height="60" fill="{WOOD}"/>')
    d.add(gable(d, 202, 312, 156, 40, RED, 5))
    d.add(f'<line x1="214" y1="166" x2="300" y2="166" stroke="{shade(WOOD, -0.3)}" stroke-width="4"/><circle cx="306" cy="166" r="7" fill="none" stroke="{shade(WOOD, -0.3)}" stroke-width="3"/>')
    d.add(f'<line x1="257" y1="166" x2="257" y2="184" stroke="#6b5a4a" stroke-width="1.4"/><path d="M248 184 h18 l-3 14 h-12 Z" fill="{WOOD}" stroke="{IRON}" stroke-width="1.4"/>')
    d.add(cylinder(d, 208, 200, 98, 36, STONE, 10))
    d.add(f'<ellipse cx="257" cy="200" rx="49" ry="10" fill="{shade(STONE, 0.15)}"/><ellipse cx="257" cy="200" rx="40" ry="7" fill="#2c3550"/><ellipse cx="250" cy="199" rx="16" ry="2" fill="#7fa7c9" opacity="0.6"/>')
    # the bench in front, where one waits
    for yy in (232, 266):
        d.add(f'<rect x="14" y="{yy}" width="220" height="14" rx="4" fill="{WOOD}"/><line x1="14" y1="{yy + 7}" x2="234" y2="{yy + 7}" stroke="{shade(WOOD, -0.3)}" stroke-width="1.2"/>')
    for x in (30, 208):
        d.add(f'<rect x="{x}" y="246" width="10" height="20" fill="{shade(WOOD, -0.3)}"/><rect x="{x}" y="280" width="10" height="44" fill="{shade(WOOD, -0.3)}"/>')
    d.add(f'<path d="M150 264 q14 -14 30 0" fill="none" stroke="{SLATE}" stroke-width="6" stroke-linecap="round"/>')
    d.add(bush(d, 334, 300, 1.9, True))


def sc_tent(d):
    # inside the healer's tent: the striped cloth rising to the pole, a bench with a cushion, a table, a rug
    d.add(f'<rect width="{SW}" height="{SH}" fill="{CREAM}"/>')
    stripes = []
    for i in range(-2, 11):
        c = SLATE if i % 2 == 0 else CREAM
        stripes.append(f'<polygon points="182,-20 {i * 40},250 {i * 40 + 40},250" fill="{c}"/>')
    d.add(''.join(stripes))
    fold = d.lin([(0, '#000', 0.25), (0.35, '#000', 0), (0.65, '#000', 0), (1, '#000', 0.3)], 0, 0, 1, 0)
    d.add(f'<rect x="0" y="0" width="{SW}" height="250" fill="{fold}"/>')
    d.add(f'<rect x="178" y="0" width="9" height="252" fill="{WOOD}"/><rect x="178" y="0" width="3" height="252" fill="#fff" opacity="0.25"/>')
    ground = d.lin([(0, '#cbb68d'), (1, '#b49c70')])
    d.add(f'<rect x="0" y="248" width="{SW}" height="{SH - 248}" fill="{ground}"/>')
    d.add(f'<path d="M0 248 Q182 236 {SW} 248" fill="none" stroke="{shade(CREAM, -0.3)}" stroke-width="5"/>')
    rug = d.rad([(0, shade(RED, 0.1)), (1, shade(RED, -0.2))])
    d.add(f'<ellipse cx="182" cy="302" rx="158" ry="32" fill="{rug}"/><ellipse cx="182" cy="302" rx="134" ry="23" fill="none" stroke="{GOLD}" stroke-width="3"/><ellipse cx="182" cy="302" rx="80" ry="12" fill="none" stroke="{GOLD}" stroke-width="2" stroke-dasharray="6 5"/>')
    # the bench with its cushion, on the left
    d.add(f'<rect x="14" y="212" width="128" height="22" rx="6" fill="{WOOD}"/><line x1="14" y1="223" x2="142" y2="223" stroke="{shade(WOOD, -0.3)}" stroke-width="1.2"/>')
    d.add(f'<rect x="22" y="194" width="112" height="22" rx="11" fill="#a8c4e0"/><path d="M30 202 q50 -8 96 0" fill="none" stroke="#fff" stroke-width="2" opacity="0.6"/>')
    d.add(f'<rect x="24" y="234" width="10" height="44" fill="{shade(WOOD, -0.3)}"/><rect x="122" y="234" width="10" height="44" fill="{shade(WOOD, -0.3)}"/>')
    # the healer's table: a lantern (a steady light), a bowl, folded cloths, a little jar of salve
    d.add(f'<rect x="222" y="204" width="128" height="12" rx="3" fill="{WOOD}"/><rect x="230" y="216" width="10" height="62" fill="{shade(WOOD, -0.3)}"/><rect x="332" y="216" width="10" height="62" fill="{shade(WOOD, -0.3)}"/>')
    d.add(lantern(d, 252, 184, 1.3))
    d.add(f'<path d="M280 192 Q298 214 318 192 Z" fill="{shade(STONE, 0.2)}" stroke="{shade(STONE, -0.3)}" stroke-width="2"/><ellipse cx="299" cy="192" rx="19" ry="4" fill="#bfe0f2"/>')
    d.add(f'<rect x="320" y="194" width="26" height="10" rx="2" fill="#fff"/><rect x="322" y="188" width="22" height="7" rx="2" fill="#e9f1f7"/>')
    d.add(f'<rect x="232" y="196" width="12" height="9" rx="2" fill="#c8e2b4" stroke="{shade(WOOD, -0.3)}" stroke-width="1"/>')
    # the leaf banner on the pole, and the shield resting against it
    d.add(banner(d, 192, 60, 46, 66, '#fbf7ee', 'leaf'))
    d.add(f'<path d="M150 214 L176 214 L176 232 Q176 246 163 252 Q150 246 150 232 Z" fill="{RED}" stroke="{GOLD}" stroke-width="3"/>')
    d.add(star(163, 230, 7))


def sc_hall(d):
    back = (112, 72, 252, 214)
    d.add(room(d, back, STONE, '#b08a63', '#9c8a72'))
    for x in (148, 194):
        d.add(window(d, x, 92, 22, 64))
    for k, (xa, xb, ya, yb) in enumerate(((22, 52, 70, 200), (68, 92, 84, 190))):
        glass = d.lin([(0, shade(WIN, 0.3)), (1, shade(WIN, -0.1))])
        for sx in (1, -1):
            pa, pb = (xa, xb) if sx == 1 else (SW - xa, SW - xb)
            d.add(f'<polygon points="{pa},{ya} {pb},{ya + 10} {pb},{yb - 8} {pa},{yb}" fill="{shade(STONE, -0.35)}"/>')
            d.add(f'<polygon points="{pa + 3 * sx},{ya + 6} {pb - 2 * sx},{ya + 14} {pb - 2 * sx},{yb - 12} {pa + 3 * sx},{yb - 4}" fill="{glass}"/>')
            d.add(f'<line x1="{(pa + pb) / 2}" y1="{ya + 10}" x2="{(pa + pb) / 2}" y2="{yb - 8}" stroke="{shade(STONE, -0.4)}" stroke-width="2"/>')
    light = d.lin([(0, WIN, 0.35), (1, WIN, 0)])
    d.add(f'<polygon points="148,156 216,156 280,320 84,320" fill="{light}"/>')
    for x, c, e in ((126, SLATE, 'star'), (224, SLATE, 'star'), (174, RED, 'crown')):
        d.add(banner(d, x, 76, 16, 44 if x != 174 else 34, c, e))
    for x in (40, 324):
        d.add(f'<rect x="{x - 3}" y="150" width="6" height="18" fill="{IRON}"/>')
        d.add(candle(d, x, 150, 14, 0.8))
    # the long table, set, and the benches to wait on
    top = d.lin([(0, shade(WOOD, 0.1)), (1, shade(WOOD, -0.1))])
    d.add(f'<polygon points="150,216 214,216 266,300 98,300" fill="{top}"/>')
    d.add(f'<polygon points="98,300 266,300 266,312 98,312" fill="{shade(WOOD, -0.35)}"/>')
    for k in range(1, 4):
        t = k / 4
        d.add(f'<line x1="{150 + (98 - 150) * t:.0f}" y1="{216 + 84 * t:.0f}" x2="{214 + (266 - 214) * t:.0f}" y2="{216 + 84 * t:.0f}" stroke="{shade(WOOD, -0.3)}" stroke-width="1"/>')
    d.add(f'<polygon points="116,218 138,218 86,324 50,324" fill="{shade(WOOD, -0.25)}"/><polygon points="226,218 248,218 314,324 278,324" fill="{shade(WOOD, -0.25)}"/>')
    d.add(f'<ellipse cx="170" cy="246" rx="12" ry="4" fill="{shade(STONE, 0.3)}"/><path d="M160 244 q10 -14 20 0" fill="{GOLD}"/><circle cx="198" cy="270" r="9" fill="{GOLD}"/><circle cx="198" cy="270" r="5" fill="{shade(GOLD, 0.3)}"/>')
    d.add(f'<rect x="144" y="226" width="14" height="10" rx="2" fill="#e2c39b"/>')


def sc_wizard(d):
    back = (60, 40, 304, 222)
    d.add(room(d, back, '#cbbfd8', '#8a7799', '#a594b7', bh=13))
    # the round window full of stars, the shelves of books, a hanging plant
    d.add(f'<circle cx="252" cy="100" r="38" fill="{shade(STONE, -0.25)}"/>')
    night = d.rad([(0, '#4d5ea0'), (1, '#273463')])
    d.add(f'<circle cx="252" cy="100" r="31" fill="{night}"/>')
    for x, y, r in ((240, 86, 3.5), (264, 112, 2.6), (250, 80, 2), (272, 92, 1.8), (236, 112, 2)):
        d.add(star(x, y, r, '#fff'))
    d.add(f'<path d="M262 82 a12 12 0 1 0 9 20 a10 10 0 1 1 -9 -20 Z" fill="{WIN}"/>')
    d.add(f'<line x1="221" y1="100" x2="283" y2="100" stroke="{shade(STONE, -0.4)}" stroke-width="2"/><line x1="252" y1="69" x2="252" y2="131" stroke="{shade(STONE, -0.4)}" stroke-width="2"/>')
    cols = [RED, SLATE, GOLD, '#5f9440', PURPLE, shade(RED, -0.3), shade(SLATE, -0.3), '#b5865a']
    for shelf_y in (76, 128):
        d.add(f'<rect x="78" y="{shelf_y}" width="104" height="8" fill="{WOOD}"/><rect x="78" y="{shelf_y + 8}" width="104" height="3" fill="{shade(WOOD, -0.4)}"/>')
        x = 82
        i = 0
        while x < 176:
            w = d.rng.uniform(7, 11)
            h = d.rng.uniform(22, 32)
            c = cols[(i + shelf_y) % len(cols)]
            d.add(f'<rect x="{x:.1f}" y="{shelf_y - h:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{c}"/><rect x="{x:.1f}" y="{shelf_y - h + 4:.1f}" width="{w:.1f}" height="2" fill="{GOLD}" opacity="0.8"/>')
            x += w + 1
            i += 1
    d.add(f'<path d="M176 126 l-18 -14" stroke="{GOLD}" stroke-width="3"/><circle cx="156" cy="110" r="5" fill="#b9d7ee"/>')
    # the wizard, friendly, behind his desk: robe with folds, beard, hat with stars
    robe = d.lin([(0, shade(PURPLE, 0.15)), (0.6, PURPLE), (1, shade(PURPLE, -0.3))], 0, 0, 1, 0)
    d.add(f'<path d="M136 232 Q138 156 182 150 Q226 156 228 232 Z" fill="{robe}"/>')
    d.add(f'<path d="M160 232 Q164 190 172 166 M204 232 Q200 190 192 166" stroke="{shade(PURPLE, -0.35)}" stroke-width="2" fill="none"/>')
    d.add(f'<path d="M140 194 Q128 212 140 226 L156 224 Q150 208 158 196 Z" fill="{shade(PURPLE, -0.1)}"/><circle cx="150" cy="224" r="7" fill="{SKIN}"/>')
    d.add(f'<path d="M224 194 Q236 212 224 226 L208 224 Q214 208 206 196 Z" fill="{shade(PURPLE, -0.1)}"/><circle cx="214" cy="224" r="7" fill="{SKIN}"/>')
    d.add(f'<circle cx="182" cy="130" r="23" fill="{SKIN}"/><circle cx="170" cy="136" r="4" fill="#f2a38f" opacity="0.5"/><circle cx="194" cy="136" r="4" fill="#f2a38f" opacity="0.5"/>')
    beard = d.lin([(0, '#ffffff'), (1, '#dcd7e6')])
    d.add(f'<path d="M158 134 Q160 188 182 202 Q204 188 206 134 Q196 150 182 150 Q168 150 158 134 Z" fill="{beard}"/>')
    for x in (168, 176, 182, 188, 196):
        d.add(f'<path d="M{x} 150 q{2 if x < 182 else -2} 20 {0 if x == 182 else (3 if x < 182 else -3)} 40" stroke="#c9c3d6" stroke-width="1" fill="none"/>')
    d.add(f'<path d="M166 146 Q174 140 182 146 Q190 140 198 146 Q190 152 182 148 Q174 152 166 146 Z" fill="#f4f2f8"/>')
    d.add(f'<circle cx="173" cy="126" r="3" fill="{DARK}"/><circle cx="191" cy="126" r="3" fill="{DARK}"/><circle cx="174" cy="125" r="1" fill="#fff"/><circle cx="192" cy="125" r="1" fill="#fff"/>')
    d.add(f'<path d="M166 118 q7 -5 14 0 M184 118 q7 -5 14 0" stroke="#e8e4ee" stroke-width="3" fill="none" stroke-linecap="round"/>')
    d.add(f'<circle cx="182" cy="134" r="4.5" fill="#eab08e"/>')
    hat = d.lin([(0, shade(PURPLE, 0.1)), (1, shade(PURPLE, -0.35))], 0, 0, 1, 0)
    d.add(f'<path d="M146 114 Q170 76 178 34 Q186 24 196 30 Q190 40 192 52 Q200 84 218 114 Z" fill="{hat}"/>')
    d.add(f'<ellipse cx="182" cy="114" rx="44" ry="9" fill="{shade(PURPLE, -0.25)}"/><path d="M150 108 Q182 100 214 108 L214 114 Q182 106 150 114 Z" fill="{GOLD}"/>')
    d.add(star(174, 86, 6))
    d.add(star(192, 66, 4))
    d.add(star(160, 102, 3.4))
    # the desk with a big open book, a quill and a steady candle
    desk = d.lin([(0, shade(WOOD, 0.15)), (1, WOOD)])
    d.add(f'<rect x="66" y="224" width="232" height="18" rx="4" fill="{desk}"/><rect x="78" y="242" width="208" height="82" fill="{shade(WOOD, -0.25)}"/>')
    d.add(f'<rect x="96" y="256" width="72" height="54" rx="4" fill="none" stroke="{shade(WOOD, -0.45)}" stroke-width="2"/><rect x="196" y="256" width="72" height="54" rx="4" fill="none" stroke="{shade(WOOD, -0.45)}" stroke-width="2"/>')
    d.add(f'<circle cx="160" cy="283" r="3" fill="{GOLD}"/><circle cx="204" cy="283" r="3" fill="{GOLD}"/>')
    d.add(book(d, 182, 206, 92))
    d.add(f'<path d="M112 222 l26 -36 q4 2 2 6 l-24 32 Z" fill="#fff"/><ellipse cx="108" cy="222" rx="8" ry="4" fill="{DARK}"/>')
    d.add(candle(d, 260, 224, 28, 1.0))
    d.add(f'<circle cx="290" cy="214" r="9" fill="#c8e2b4" opacity="0.9"/><rect x="286" y="214" width="8" height="10" fill="#b8a0d8"/>')


def sc_mirror(d):
    back = (70, 40, 294, 236)
    d.add(room(d, back, '#e1d8c8', '#b99a74', '#c7b9a2', planks=False))
    for x, s in ((70, 1), (294, -1)):
        cur = d.lin([(0, shade(RED, 0.1)), (0.5, RED), (1, shade(RED, -0.3))], 0, 0, 1, 0)
        d.add(f'<path d="M{x} 36 Q{x + s * 34} 130 {x + s * 6} 240 L{x + s * 56} 240 Q{x + s * 66} 130 {x + s * 58} 36 Z" fill="{cur}"/>')
        for k in (16, 32, 46):
            d.add(f'<path d="M{x + s * k} 40 Q{x + s * (k + 12)} 140 {x + s * (k - 4)} 238" stroke="{shade(RED, -0.35)}" stroke-width="1.5" fill="none"/>')
        d.add(f'<path d="M{x + s * 8} 150 q{s * 26} 8 {s * 50} 0" stroke="{GOLD}" stroke-width="4" fill="none"/><circle cx="{x + s * 52}" cy="152" r="4" fill="{GOLD}"/>')
    d.add(f'<rect x="60" y="30" width="244" height="8" rx="4" fill="{shade(GOLD, -0.2)}"/>')
    d.add(f'<rect x="164" y="252" width="36" height="40" fill="{shade(GOLD, -0.3)}"/><path d="M138 304 L226 304 L210 282 L154 282 Z" fill="{shade(GOLD, -0.2)}"/><ellipse cx="182" cy="306" rx="50" ry="8" fill="#000" opacity="0.15"/>')
    frame = d.lin([(0, shade(GOLD, 0.35)), (0.5, GOLD), (1, shade(GOLD, -0.4))], 0, 0, 1, 1)
    glass = d.lin([(0, '#eef8fd'), (0.5, '#bfdff1'), (1, '#8fbfdc')], 0, 0, 1, 1)
    d.add(f'<ellipse cx="182" cy="152" rx="76" ry="110" fill="{frame}"/>')
    for a in range(0, 360, 20):
        x, y = 182 + 70 * math.cos(math.radians(a)), 152 + 103 * math.sin(math.radians(a))
        d.add(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3" fill="{shade(GOLD, 0.4)}"/>')
    d.add(f'<ellipse cx="182" cy="152" rx="62" ry="96" fill="{glass}" stroke="{shade(GOLD, -0.45)}" stroke-width="2"/>')
    # in the glass: the room behind, softly
    d.add(f'<ellipse cx="182" cy="200" rx="40" ry="16" fill="#9fb9c9" opacity="0.5"/>')
    d.add(f'<path d="M138 106 Q160 66 198 60 Q160 92 150 144 Z" fill="#fff" opacity="0.8"/><path d="M192 228 Q224 212 234 178 Q234 216 206 238 Z" fill="#fff" opacity="0.5"/>')
    d.add(crown(182, 38, 40))
    d.add(sparkle(104, 118, 10, GOLD))
    d.add(sparkle(262, 200, 9, GOLD))
    d.add(sparkle(254, 80, 6, '#fff'))
    d.add(sparkle(116, 220, 5, '#fff'))


def sc_forge(d):
    back = (80, 50, 284, 214)
    d.add(room(d, back, '#c3b8a5', '#8a7f71', '#9a8d78', planks=False))
    d.add(wall(d, 138, 56, 88, 158, shade(STONE, -0.2), 12, (16, 26)))
    d.add(f'<path d="{arch_path(148, 136, 68, 78)}" fill="{DARK}"/>')
    glow = d.rad([(0, '#fff1b8'), (0.45, '#f6a54a'), (1, '#b8502a')], 0.5, 0.85, 0.75)
    d.add(f'<path d="{arch_path(158, 150, 48, 64)}" fill="{glow}"/>')
    d.add(f'<path d="M168 214 Q172 186 182 172 Q192 186 196 214 Z" fill="#fff6d0" opacity="0.85"/>')
    d.add(voussoirs(148, 136, 68, 11, 9, shade(STONE, -0.1)))
    warm = d.rad([(0, '#f6a54a', 0.35), (1, '#f6a54a', 0)], 0.5, 0.75, 0.6)
    d.add(f'<rect width="{SW}" height="{SH}" fill="{warm}"/>')
    # tools on the wall, a shield being mended, the bellows
    for i, x in enumerate((236, 252, 268)):
        d.add(f'<line x1="{x}" y1="70" x2="{x}" y2="{122 + i * 6}" stroke="{WOOD}" stroke-width="4"/>')
        d.add(f'<rect x="{x - 8}" y="{118 + i * 6}" width="16" height="9" rx="2" fill="#6c707c"/>')
    d.add(f'<rect x="228" y="64" width="50" height="6" fill="{shade(WOOD, -0.2)}"/>')
    d.add(f'<path d="M92 98 L126 98 L126 128 Q126 148 109 154 Q92 148 92 128 Z" fill="{SLATE}" stroke="{GOLD}" stroke-width="3"/>')
    d.add(star(109, 124, 8))
    d.add(f'<path d="M96 186 Q118 166 140 186 L136 198 L100 198 Z" fill="#7b5236"/><rect x="138" y="188" width="18" height="5" fill="{shade(WOOD, -0.3)}"/>')
    # the anvil in front, the hammer, a bucket of water
    anvil = d.lin([(0, '#9aa0ad'), (1, '#4c505a')])
    d.add(f'<path d="M96 238 L268 238 Q268 264 236 268 L212 268 L212 300 L240 320 L124 320 L152 300 L152 268 L128 268 Q96 260 96 238 Z" fill="{anvil}"/>')
    d.add(f'<path d="M96 238 L268 238 L262 228 L104 228 Z" fill="#b5bac6"/><path d="M268 230 q32 0 42 10 q-18 -2 -42 2 Z" fill="#6c707c"/>')
    d.add(f'<rect x="250" y="190" width="10" height="58" rx="3" transform="rotate(-35 255 218)" fill="{WOOD}"/>')
    d.add(f'<rect x="230" y="176" width="44" height="22" rx="3" transform="rotate(-35 252 186)" fill="#7a7f8c"/>')
    d.add(f'<rect x="14" y="256" width="66" height="54" rx="7" fill="{WOOD}"/><rect x="14" y="270" width="66" height="5" fill="{IRON}"/><rect x="14" y="292" width="66" height="5" fill="{IRON}"/><ellipse cx="47" cy="256" rx="33" ry="8" fill="#7fb3d5"/><ellipse cx="40" cy="255" rx="12" ry="2" fill="#fff" opacity="0.6"/>')


def sc_council(d):
    d.add(sky(d))
    d.add(cloud(230, 120, 0.7))
    ground = d.lin([(0, shade(GRASS, 0.15)), (1, GRASS)])
    d.add(f'<rect x="0" y="168" width="{SW}" height="{SH - 168}" fill="{ground}"/>')
    d.add(f'<g transform="translate(240 112) scale(0.55)">' + wall(d, 0, 40, 120, 70) + crenels(d, 0, 120, 40, 5) + cylinder(d, -20, 10, 30, 100) + cone(d, -5, 12, 40, 30, SLATE, 3) + cylinder(d, 110, 10, 30, 100) + cone(d, 125, 12, 40, 30, SLATE, 3) + '</g>')
    d.add(tufts(d, 0, SW, 172, 210, 26))
    d.add(tree(d, 40, 190, 1.0))
    # the pavilion's canopy above, its poles at the sides
    canopy = d.lin([(0, shade(SLATE, 0.1)), (1, shade(SLATE, -0.25))])
    d.add(f'<path d="M-10 0 L{SW + 10} 0 L{SW + 10} 50 L-10 50 Z" fill="{canopy}"/>')
    d.add(''.join(f'<line x1="{x}" y1="0" x2="{x + 8}" y2="50" stroke="{shade(SLATE, -0.35)}" stroke-width="2"/>' for x in range(10, SW, 40)))
    sc = ''.join(f'Q{-10 + i * 48 + 24} 84 {-10 + (i + 1) * 48} 50 ' for i in range(8))
    d.add(f'<path d="M-10 50 {sc} Z" fill="{CREAM}" stroke="{shade(CREAM, -0.25)}" stroke-width="1.5"/>')
    d.add(''.join(f'<path d="M{-10 + (i + 0.5) * 48} 64 l0 12" stroke="{GOLD}" stroke-width="2"/><circle cx="{-10 + (i + 0.5) * 48}" cy="78" r="3" fill="{GOLD}"/>' for i in range(8)))
    for x in (16, 338):
        d.add(f'<rect x="{x}" y="40" width="10" height="300" fill="{WOOD}"/><rect x="{x}" y="40" width="3" height="300" fill="#fff" opacity="0.2"/>')
    # the round table seen from one's seat, the chairs of the wise around it
    for x, c in ((96, RED), (182, PURPLE), (268, RED)):
        back_c = d.lin([(0, shade(c, 0.15)), (1, shade(c, -0.25))], 0, 0, 1, 0)
        d.add(f'<path d="M{x - 28} 214 L{x - 28} 128 Q{x} 104 {x + 28} 128 L{x + 28} 214 Z" fill="{back_c}"/>')
        d.add(f'<path d="M{x - 20} 210 L{x - 20} 134 Q{x} 116 {x + 20} 134 L{x + 20} 210 Z" fill="none" stroke="{GOLD}" stroke-width="2"/>')
        d.add(star(x, 140, 6) if c == PURPLE else crown(x, 140, 16))
    top = d.lin([(0, shade(WOOD, 0.3)), (1, shade(WOOD, -0.05))])
    d.add(f'<ellipse cx="182" cy="238" rx="176" ry="54" fill="{shade(WOOD, -0.35)}"/>')
    d.add(f'<ellipse cx="182" cy="230" rx="176" ry="52" fill="{top}"/>')
    d.add(f'<ellipse cx="182" cy="230" rx="150" ry="40" fill="none" stroke="{shade(WOOD, -0.2)}" stroke-width="1.5"/>')
    # a map of the land on the table, scrolls, a goblet
    d.add(f'<path d="M118 214 L232 206 L248 238 L126 248 Z" fill="{CREAM}" stroke="{shade(GOLD, -0.4)}" stroke-width="2"/>')
    d.add(f'<path d="M136 236 Q160 214 184 230 T236 222" fill="none" stroke="{SLATE}" stroke-width="2.5" stroke-dasharray="5 4"/>')
    d.add(f'<path d="M150 222 l6 -10 l6 10 Z" fill="#8a9a6a"/><path d="M160 224 l7 -12 l7 12 Z" fill="#7a8a5a"/>')
    d.add(f'<g transform="translate(208 214) scale(0.4)">' + cylinder(d, 0, 0, 20, 30) + cone(d, 10, 2, 28, 18, RED, 2) + '</g>')
    d.add(scroll(d, 82, 246, 50))
    d.add(scroll(d, 282, 238, 42))
    d.add(f'<path d="M300 210 h16 l-3 14 q-5 4 -10 0 Z" fill="{GOLD}"/><rect x="306" y="224" width="4" height="8" fill="{GOLD}"/><ellipse cx="308" cy="233" rx="8" ry="2.5" fill="{shade(GOLD, -0.2)}"/>')
    d.add(f'<rect x="0" y="284" width="{SW}" height="{SH - 284}" fill="{shade(WOOD, -0.3)}"/>')


def sc_prophecy(d):
    back = (70, 40, 294, 222)
    d.add(room(d, back, '#d3c9e2', '#9a88ad', '#ab9ec1'))
    jars = ['#b9d7ee', '#f3c58d', '#c8e2b4', '#e7b5c8', '#d8cdf5', '#b9d7ee', '#f3c58d']
    for y in (78, 136):
        d.add(f'<rect x="84" y="{y}" width="196" height="8" fill="{WOOD}"/><rect x="84" y="{y + 8}" width="196" height="3" fill="{shade(WOOD, -0.4)}"/>')
    for i, c in enumerate(jars):
        x = 92 + i * 27
        h = 22 - (i % 2) * 5
        d.add(f'<rect x="{x}" y="{78 - h}" width="20" height="{h}" rx="6" fill="{c}"/><rect x="{x + 3}" y="{78 - h + 3}" width="4" height="{h - 6}" rx="2" fill="#fff" opacity="0.5"/><rect x="{x + 4}" y="{74 - h}" width="12" height="5" fill="{shade(WOOD, -0.2)}"/>')
        c2 = jars[(i + 3) % 7]
        h2 = 18 + (i % 3) * 3
        d.add(f'<rect x="{x}" y="{136 - h2}" width="20" height="{h2}" rx="6" fill="{c2}"/><rect x="{x + 3}" y="{136 - h2 + 3}" width="4" height="{h2 - 6}" rx="2" fill="#fff" opacity="0.5"/>')
    d.add(star(286, 60, 6, '#fff'))
    d.add(star(76, 120, 5, '#fff'))
    # the draped table with stars, the crystal ball close up, two steady candles
    cloth = d.lin([(0, shade(PURPLE, 0.1)), (1, shade(PURPLE, -0.3))])
    d.add(f'<path d="M26 232 L338 232 L354 340 L10 340 Z" fill="{cloth}"/>')
    d.add(f'<path d="M26 232 L338 232 L342 250 L22 250 Z" fill="{shade(PURPLE, -0.2)}"/>')
    d.add(''.join(f'<path d="M{x} 250 Q{x + 6} 300 {x - 4} 340" stroke="{shade(PURPLE, -0.4)}" stroke-width="2" fill="none"/>' for x in range(60, 330, 46)))
    d.add(''.join(f'<path d="M{20 + i * 22} 250 l11 12 l11 -12" fill="{GOLD}"/>' for i in range(15)))
    for x in range(44, 330, 36):
        d.add(star(x, 296 + (x % 3) * 9, 4.5))
    d.add(f'<path d="M136 234 L148 204 L216 204 L228 234 Z" fill="{shade(GOLD, -0.2)}"/><path d="M148 206 Q182 184 216 206 L210 196 Q182 176 154 196 Z" fill="{GOLD}"/>')
    halo = d.rad([(0, '#ece4ff', 0.6), (1, '#ece4ff', 0)])
    ball = d.rad([(0, '#f6f1ff'), (0.45, '#b49ae6'), (1, '#4e3a80')], 0.38, 0.32, 0.72)
    d.add(f'<circle cx="182" cy="140" r="96" fill="{halo}"/>')
    d.add(f'<circle cx="182" cy="140" r="66" fill="{ball}"/>')
    d.add(f'<path d="M140 156 Q166 116 214 130 Q180 136 160 168 Z" fill="#fff" opacity="0.3"/><path d="M150 176 Q186 160 222 170 Q196 186 160 182 Z" fill="#d5c4ff" opacity="0.45"/>')
    d.add(f'<ellipse cx="158" cy="106" rx="17" ry="10" fill="#fff" opacity="0.75" transform="rotate(-30 158 106)"/>')
    d.add(star(208, 160, 7, '#fff'))
    d.add(star(170, 150, 4, '#fff'))
    d.add(candle(d, 64, 234, 36, 1.0))
    d.add(candle(d, 302, 234, 30, 1.0))


def sc_victory(d):
    d.add(sky(d))
    d.add(cloud(60, 90, 0.8))
    d.add(cloud(310, 110, 0.7))
    ground = d.lin([(0, shade(GRASS, 0.15)), (1, GRASS)])
    d.add(f'<rect x="0" y="236" width="{SW}" height="{SH - 236}" fill="{ground}"/>')
    d.add(wall(d, 40, 122, 284, 118, STONE, 12, (20, 34)))
    d.add(crenels(d, 40, 284, 122, 11, STONE, 12))
    d.add(wall(d, 130, 54, 104, 70, STONE, 12, (18, 28)))
    d.add(crenels(d, 130, 104, 54, 5, STONE, 12))
    for x in (4, 306):
        d.add(cylinder(d, x, 94, 56, 146, STONE, 12))
        d.add(window(d, x + 22, 130, 12, 20))
        d.add(cone(d, x + 28, 96, 74, 54, RED, 6))
        d.add(flag(d, x + 28, 18, SLATE, 22, 24))
    for x in (150, 202):
        d.add(window(d, x, 76, 12, 22))
    d.add(f'<path d="{arch_path(150, 172, 64, 68)}" fill="{DARK}"/>')
    d.add(plank_door(d, 154, 176, 56, 64))
    d.add(voussoirs(150, 172, 64, 9, 10))
    d.add(crown(182, 128, 56))
    d.add(flag(d, 182, 2, GOLD, 50, 34))
    for x, c in ((70, SLATE), (102, SLATE), (250, RED), (282, RED)):
        d.add(banner(d, x - 9, 140, 18, 52, c, 'crown' if c == SLATE else 'star'))
    d.add(ivy(d, [(42, 240), (50, 210), (44, 180), (54, 150)], 1.3))
    # garlands of little flags across the view
    cols = [RED, GOLD, SLATE, '#5f9440']
    d.add(f'<path d="M0 22 Q182 74 {SW} 22" fill="none" stroke="{shade(WOOD, -0.3)}" stroke-width="2"/>')
    for i in range(13):
        x = 4 + i * 28
        t = x / SW
        y = 22 + 26 * 4 * t * (1 - t)
        d.add(f'<path d="M{x} {y:.1f} l11 19 l11 -19 Z" fill="{cols[i % 4]}"/>')
    d.add(f'<path d="M136 340 Q168 280 172 240 L192 240 Q196 280 228 340 Z" fill="#d2c3a2"/>')
    d.add(pebbles(d, 150, 214, 250, 336, 18))
    d.add(tufts(d, 0, SW, 244, 334, 40, '#5e9a40', 1.3))
    d.add(flowers(d, 0, 130, 250, 330, 18, 1.4))
    d.add(flowers(d, 234, 364, 250, 330, 18, 1.4))
    d.add(bush(d, 40, 300, 2.0, True))
    d.add(bush(d, 326, 306, 2.2, True))


SCENES = {
    'gate': (sc_gate, 'at the castle gate (reception)'),
    'courtyard': (sc_courtyard, 'in the castle courtyard (waiting before the checks)'),
    'tent': (sc_tent, "inside the healer's tent (the checks)"),
    'hall': (sc_hall, 'in the hall of the knights (waiting for the wizard)'),
    'wizard': (sc_wizard, 'meeting the great wizard in his tower (the doctor)'),
    'mirror': (sc_mirror, 'in front of the magic mirror (imaging)'),
    'forge': (sc_forge, 'in the forge (treatment)'),
    'council': (sc_council, 'at the table of the council of the wise (consultation)'),
    'prophecy': (sc_prophecy, 'waiting for the prophecy at the crystal ball (waiting for results)'),
    'victory': (sc_victory, 'the victory feast at the castle (the end of the journey)'),
}


# ---------- the map backgrounds ----------
def far_castle(d, cx, base, s, color='#a3aecb'):
    w = 90 * s
    x = cx - w / 2
    roof = '#8c95b8'
    out = [f'<rect x="{x}" y="{base - 40 * s}" width="{w}" height="{40 * s}" fill="{color}"/>']
    for k in range(5):
        out.append(f'<rect x="{x + k * w / 4.5:.1f}" y="{base - 46 * s}" width="{w / 9:.1f}" height="{6 * s}" fill="{color}"/>')
    for tx, th in ((x - 6 * s, 66), (cx - 9 * s, 86), (x + w - 12 * s, 66)):
        out.append(f'<rect x="{tx:.1f}" y="{base - th * s:.1f}" width="{18 * s:.1f}" height="{th * s:.1f}" fill="{color}"/>')
        out.append(f'<rect x="{tx + 12 * s:.1f}" y="{base - th * s:.1f}" width="{6 * s:.1f}" height="{th * s:.1f}" fill="#8f9abb"/>')
        out.append(f'<path d="M{tx - 3 * s:.1f} {base - th * s:.1f} L{tx + 9 * s:.1f} {base - (th + 22) * s:.1f} L{tx + 21 * s:.1f} {base - th * s:.1f} Z" fill="{roof}"/>')
        out.append(f'<rect x="{tx + 6 * s:.1f}" y="{base - (th - 14) * s:.1f}" width="{5 * s:.1f}" height="{8 * s:.1f}" fill="#7b86a8"/>')
    return '\n'.join(out)


def band(W, H, y0, amp, phase, color):
    n = 8
    pts = [(W * i / n, y0 + amp * math.sin(phase + i * 1.3)) for i in range(n + 1)]
    d = f'M0 {pts[0][1]:.0f} ' + ' '.join(f'Q{(pts[i][0] + pts[i + 1][0]) / 2:.0f} {pts[i][1] + amp * 0.6:.0f} {pts[i + 1][0]:.0f} {pts[i + 1][1]:.0f}' for i in range(n)) + f' L{W} {H} L0 {H} Z'
    return f'<path d="{d}" fill="{color}"/>'


def background(W, H, horizon, castle, trees, bushes, flower_areas, clouds, seed, comment):
    d = Doc(W, H, seed)
    s = (W / 412) ** 0.5
    d.add(f'<rect width="{W}" height="{H}" fill="{d.lin([(0, SKY0), (0.85, SKY1)])}"/>')
    d.add(*[cloud(*c) for c in clouds])
    d.add(band(W, H, horizon - 26 * s, 16 * s, 0.4, '#b7c6dd'))
    d.add(band(W, H, horizon - 12 * s, 10 * s, 2.0, '#c5d3e3'))
    d.add(far_castle(d, *castle))
    rows = [('#b9db8e', 0), ('#a6d07c', 0.16), ('#94c56c', 0.36), ('#84b95f', 0.6), ('#78ae55', 0.82)]
    for i, (col, f) in enumerate(rows):
        d.add(band(W, H, horizon + (H - horizon) * f, 10 * s, i * 1.7, col))
        y = horizon + (H - horizon) * f
        d.add(tufts(d, 0, W, y + 6 * s, y + (H - horizon) * 0.18, int(30 * s), shade(col, -0.25), 0.8 * s))
    for a in flower_areas:
        d.add(flowers(d, *a[:4], a[4], 0.9 * s))
    for t in sorted(trees, key=lambda t: t[1]):
        d.add(tree(d, *t))
    for b in bushes:
        d.add(bush(d, *b, berries=True))
    return d.svg(f'Knight world: {comment}', grain=0.08, wobble=1.0, clay=False)


def portrait_bg():
    return background(
        412, 1100, 196, (372, 196, 0.55),
        trees=[(372, 232, 0.75), (396, 252, 0.6), (26, 356, 0.8), (388, 520, 0.85), (20, 690, 0.8), (392, 860, 0.85), (360, 1000, 0.8), (40, 1020, 0.7)],
        bushes=[(255, 220, 0.7), (40, 420, 0.8), (240, 580, 0.8), (30, 740, 0.7), (270, 930, 0.9), (180, 1060, 0.9)],
        flower_areas=[(230, 400, 200, 280, 12), (0, 120, 300, 440, 14), (240, 412, 440, 600, 14), (0, 170, 600, 760, 14), (240, 412, 760, 940, 14), (0, 412, 930, 1100, 24)],
        clouds=[(250, 156, 0.5), (110, 170, 0.45)], seed=1,
        comment='the portrait map background (the 412×939 frame, drawn 412×1100 so the second map can move it)')


def landscape_bg():
    return background(
        1920, 1080, 330, (920, 332, 1.6),
        trees=[(1560, 470, 1.7), (1660, 440, 1.4), (1840, 500, 1.8), (90, 430, 1.6), (230, 400, 1.3), (1880, 760, 1.6), (560, 1040, 1.5)],
        bushes=[(1150, 860, 1.6), (1300, 960, 1.8), (1420, 820, 1.3), (500, 820, 1.5), (640, 980, 1.6), (450, 1020, 1.4), (1000, 380, 1.2), (780, 390, 1.1)],
        flower_areas=[(1100, 1460, 740, 1080, 40), (420, 700, 720, 1080, 34), (1480, 1900, 380, 680, 34), (0, 320, 360, 620, 26), (740, 1060, 360, 420, 14)],
        clouds=[(420, 170, 1.4), (760, 230, 1.1), (1150, 160, 1.3), (1600, 270, 1.0)], seed=2,
        comment='the landscape map background (the 1920×1080 frame)')


def sheet_floor():
    d = Doc(364, 340, 9)
    d.add(f'<rect width="364" height="340" fill="{d.lin([(0, "#eaf4fb"), (0.55, "#f4efe2"), (1, "#e3d6b8")])}"/>')
    d.add(band(364, 340, 215, 6, 0.7, '#c9dcb0'), band(364, 340, 255, 5, 2.1, '#b5d197'))
    d.add(cloud(70, 60, 0.8), cloud(290, 40, 0.6))
    return d.svg('Knight world: the panel behind a picture on its sheet', clay=False)


def celebrate():
    d = Doc(640, 480, 11)
    d.add(f'<rect width="640" height="480" fill="{d.lin([(0, SKY0), (1, SKY1)])}"/>')
    d.add(cloud(120, 120, 1.2), cloud(520, 100, 1.0))
    d.add(band(640, 480, 300, 10, 0.5, '#a6d07c'), band(640, 480, 360, 10, 2.0, '#8cc05a'))
    d.add(tufts(d, 0, 640, 310, 470, 60))
    d.add(flowers(d, 0, 640, 330, 470, 40, 1.4))
    sub = Doc(300, 220, 12, prefix='v')
    sub.add(mound(sub))
    draw_victory(sub)
    d.defs.extend(sub.defs)
    d.add(f'<g transform="translate(95 110) scale(1.5)" filter="url(#clay)">' + '\n'.join(sub.body) + '</g>')
    cols = [RED, GOLD, SLATE, '#5f9440']
    d.add('<path d="M0 36 Q320 76 640 36" fill="none" stroke="#6b4329" stroke-width="2"/>')
    for i in range(16):
        x = 8 + i * 40
        t = x / 640
        y = 36 + 40 * 4 * t * (1 - t) * 0.5
        d.add(f'<path d="M{x} {y:.1f} l14 24 l14 -24 Z" fill="{cols[i % 4]}"/>')
    d.add(tree(d, 60, 440, 2.2), tree(d, 590, 450, 2.0))
    return d.svg('Knight world: the victory feast (the celebration screen)', clay=False)


files = {}
for k, (f, c) in STATIONS.items():
    files[f'station-{k}.svg'] = station(k, f, c)
for k, (f, c) in SCENES.items():
    files[f'scene-{k}.svg'] = scene(k, f, c)
files['map-portrait.svg'] = portrait_bg()
files['map-landscape.svg'] = landscape_bg()
files['sheet-floor.svg'] = sheet_floor()
files['celebrate.svg'] = celebrate()
os.makedirs(OUT, exist_ok=True)
for n, s in files.items():
    with open(os.path.join(OUT, n), 'w') as fh:
        fh.write(s)
print(len(files), 'files,', sum(len(s) for s in files.values()) // 1024, 'KB')

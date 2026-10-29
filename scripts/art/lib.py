"""Shared drawing tools for the world pictures (scripts/art/<world>.py), in a painted storybook style
with a 3D look: SVG built from small tools (stone blocks, round towers, roofs, arches, doors, windows, flags,
trees, rocks), lit from the top left, with a painted grain and a light filter that rounds every edge.

Do not mirror these pictures with a CSS transform: Chrome draws an SVG with lighting filters black when it is
flipped. No flashing, no glaring colours: the audience is sensitive to stimuli.
"""
import math
import os
import random
import zlib


# how high the 3D light raises the edges (a world may raise it)
RELIEF = 3

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
<feSpecularLighting in="height" surfaceScale="{RELIEF}" specularConstant="0.5" specularExponent="16" lighting-color="#fff8ec" result="spec"><feDistantLight azimuth="235" elevation="38"/></feSpecularLighting>
<feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
<feDiffuseLighting in="height" surfaceScale="{RELIEF}" diffuseConstant="1.3" lighting-color="#fff" result="diff"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>
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


def mound(d, grass=GRASS, rock_c=ROCK):
    """The island every station stands on (300×220): a grassy top on a thick base of rounded rocks"""
    GRASS, ROCK = grass, rock_c
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
def station(name, draw, comment, world='Knight', base=mound):
    """One station on the map (300×220): its island, then what stands on it"""
    d = Doc(300, 220, zlib.crc32(name.encode()) % 1000)
    d.add(base(d))
    draw(d)
    return d.svg(f'{world} world: {comment}')


# ---------- the scenes: each place as seen by someone standing in it (the station's sheet, 364×340) ----------
SW, SH = 364, 340


def sky(d, h=SH, top=SKY0, bottom=SKY1):
    g = d.lin([(0, top), (1, bottom)])
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


def scene(name, draw, comment, world='Knight'):
    """One place as seen by someone standing in it (364×340, the station's sheet)"""
    d = Doc(SW, SH, zlib.crc32(("scene" + name).encode()) % 1000)
    draw(d)
    return d.svg(f'{world} world: {comment}, as seen standing there', slice_=True, edges=False)


def band(W, H, y0, amp, phase, color):
    n = 8
    pts = [(W * i / n, y0 + amp * math.sin(phase + i * 1.3)) for i in range(n + 1)]
    d = f'M0 {pts[0][1]:.0f} ' + ' '.join(f'Q{(pts[i][0] + pts[i + 1][0]) / 2:.0f} {pts[i][1] + amp * 0.6:.0f} {pts[i + 1][0]:.0f} {pts[i + 1][1]:.0f}' for i in range(n)) + f' L{W} {H} L0 {H} Z'
    return f'<path d="{d}" fill="{color}"/>'


ART = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(ART, '..', '..')


def write(world, files):
    """Writes a world's pictures: the SVGs into scripts/art/build/<world>/ (not kept in the repository), rendered
    into WebP images in public/worlds/<world>/art/, which the app uses"""
    import shutil
    import subprocess
    from PIL import Image
    svg_dir = os.path.join(ART, 'build', world, 'svg')
    png_dir = os.path.join(ART, 'build', world, 'png')
    out = os.path.join(ROOT, 'public', 'worlds', world, 'art')
    for dr in (svg_dir, png_dir):
        shutil.rmtree(dr, ignore_errors=True)
        os.makedirs(dr)
    for n, s in files.items():
        with open(os.path.join(svg_dir, n), 'w') as fh:
            fh.write(s)
    if os.environ.get('ART_SVG_ONLY'):
        # a quick look while drawing: the SVGs only (open them from scripts/art/build/<world>/svg)
        print(len(files), 'SVGs in', os.path.relpath(svg_dir, ROOT))
        return
    subprocess.run(['node', os.path.join(ART, 'render.cjs'), svg_dir, png_dir], check=True)
    os.makedirs(out, exist_ok=True)
    for f in os.listdir(out):
        if f.endswith(('.svg', '.webp')):
            os.remove(os.path.join(out, f))
    total = 0
    for n in sorted(os.listdir(png_dir)):
        im = Image.open(os.path.join(png_dir, n))
        dest = os.path.join(out, n.replace('.png', '.webp'))
        # the big pictures (the maps' backgrounds) a little more compressed: their fine grain costs the most
        im.save(dest, 'WEBP', quality=78 if n.startswith('map-') else 86, method=6)
        total += os.path.getsize(dest)
    print(len(files), 'pictures,', total // 1024, 'KB in', os.path.relpath(out, ROOT))

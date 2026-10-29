"""The fairy world's earlier pictures, drawn in code (drafts in scripts/art/build/fairy/; the app uses the delivered ones): a magic garden where the elf helper checks the magic, the
healing fairy decides, the gnome gardener treats and the wise fairy comes to help.

    python3 scripts/art/fairy.py

Drawn with the shared tools in lib.py (the same light, grain and 3D filter as the other drawn worlds), plus the
tools of this world below: fairies, the elf, the gnome, butterflies, mushrooms and mushroom houses, big garden
flowers, crystals, a trellis gate, a bridge over a stream, fireflies.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa: E402,F403
from lib import SW, SH  # noqa: E402
import lib  # noqa: E402

WORLD = 'Fairy'

# ---------- palette ----------
F_SKY0, F_SKY1 = '#5d4f9a', '#f6e3ee'
F_GRASS = '#93c86a'
F_ROCK = '#a99cb8'
LILAC = '#b79ae0'
ROSE_F = '#e98bb0'
MINT_F = '#9fdcc4'
BUTTER_F = '#f7d878'
PEACH_F = '#f6b08a'
CAP = '#e0645a'
WATER = '#8fcbe8'
BARK = '#9a7350'


def ball(d, color):
    return d.rad([(0, shade(color, 0.42)), (0.5, shade(color, 0.06)), (0.82, color), (1, shade(color, -0.38))], 0.36, 0.3, 0.8)


def rim(color):
    return f'stroke="{shade(color, -0.45)}" stroke-width="1"'


def face(cx, cy, r):
    return (''.join(f'<circle cx="{cx + sx * r * 0.36:.1f}" cy="{cy - r * 0.05:.1f}" r="{r * 0.13:.1f}" fill="#2c2433"/><circle cx="{cx + sx * r * 0.36 - r * 0.04:.1f}" cy="{cy - r * 0.1:.1f}" r="{r * 0.05:.1f}" fill="#fff"/>' for sx in (-1, 1))
            + ''.join(f'<circle cx="{cx + sx * r * 0.55:.1f}" cy="{cy + r * 0.28:.1f}" r="{r * 0.15:.1f}" fill="#f2a38f" opacity="0.55"/>' for sx in (-1, 1))
            + f'<path d="M{cx - r * 0.2:.1f} {cy + r * 0.32:.1f} q{r * 0.2:.1f} {r * 0.18:.1f} {r * 0.4:.1f} 0" stroke="#2c2433" stroke-width="{max(0.8, r * 0.08):.1f}" fill="none" stroke-linecap="round"/>')


def wings(d, cx, cy, s, color='#d9f1ff'):
    g = d.rad([(0, '#ffffff', 0.9), (1, color, 0.55)], 0.4, 0.4, 0.7)
    out = []
    for sx in (-1, 1):
        out.append(f'<ellipse cx="{cx + sx * 16 * s:.1f}" cy="{cy - 10 * s:.1f}" rx="{14 * s:.1f}" ry="{20 * s:.1f}" fill="{g}" stroke="#a8c8e8" stroke-width="0.8" transform="rotate({sx * 28} {cx + sx * 16 * s:.1f} {cy - 10 * s:.1f})"/>')
        out.append(f'<ellipse cx="{cx + sx * 13 * s:.1f}" cy="{cy + 8 * s:.1f}" rx="{9 * s:.1f}" ry="{12 * s:.1f}" fill="{g}" stroke="#a8c8e8" stroke-width="0.8" transform="rotate({sx * 50} {cx + sx * 13 * s:.1f} {cy + 8 * s:.1f})"/>')
    return '\n'.join(out)


def wand(x0, y0, x1, y1, r=5):
    return (f'<line x1="{x0}" y1="{y0}" x2="{x1}" y2="{y1}" stroke="#f4e3b0" stroke-width="{r * 0.4:.1f}" stroke-linecap="round"/>'
            + star(x1, y1, r, '#ffd95a') + sparkle(x1 + r * 1.4, y1 - r * 1.2, r * 0.7, '#fff'))


def fairy(d, x, y, s=1.0, dress=ROSE_F, hair='#f2c56b', with_wand=True, crown=False):
    """A fairy standing at (x, y): translucent wings, a bell-shaped petal dress, a wand with a star"""
    f = ball(d, dress)
    out = [f'<ellipse cx="0" cy="2" rx="16" ry="3" fill="#000" opacity="0.14"/>', wings(d, 0, -40, 1.0),
           f'<path d="M-4 -10 v10 M4 -10 v10" stroke="{SKIN}" stroke-width="4" stroke-linecap="round"/>',
           f'<path d="M-8 -40 Q-20 -14 -18 -10 Q-12 -4 -6 -10 Q0 -4 6 -10 Q12 -4 18 -10 Q20 -14 8 -40 Z" fill="{f}" {rim(dress)}/>',
           f'<path d="M-6 -40 Q0 -44 6 -40 L6 -32 Q0 -30 -6 -32 Z" fill="{shade(dress, 0.2)}"/>',
           f'<path d="M-6 -36 q-10 6 -10 14 M6 -36 q10 2 12 -6" stroke="{SKIN}" stroke-width="3.6" stroke-linecap="round" fill="none"/>',
           f'<circle cx="0" cy="-52" r="11" fill="{SKIN}" {rim(SKIN)}/>',
           f'<path d="M-12 -52 Q-14 -66 0 -66 Q14 -66 12 -52 Q10 -60 0 -60 Q-10 -60 -12 -52 Z" fill="{hair}"/>',
           f'<path d="M-11 -54 q-6 10 -2 18 M11 -54 q6 10 2 18" stroke="{hair}" stroke-width="4.4" stroke-linecap="round" fill="none"/>',
           face(0, -52, 11)]
    if crown:
        out.append(f'<path d="M-7 -64 l2 -6 l3 4 l2 -6 l2 6 l3 -4 l2 6 Z" fill="#ffd95a" stroke="{shade(GOLD, -0.3)}" stroke-width="0.6"/>')
    else:
        out.append(f'<circle cx="7" cy="-63" r="3.4" fill="{BUTTER_F}"/><circle cx="7" cy="-63" r="1.4" fill="{PEACH_F}"/>')
    if with_wand:
        out.append(wand(18, -28, 30, -50, 5))
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def elf(d, x, y, s=1.0, color='#6fb36a'):
    """The elf helper: a pointed leaf hat, pointed ears, a green tunic"""
    f = ball(d, color)
    out = [f'<ellipse cx="0" cy="2" rx="14" ry="3" fill="#000" opacity="0.14"/>',
           f'<path d="M-4 -10 v10 M4 -10 v10" stroke="#7a5a3a" stroke-width="4.4" stroke-linecap="round"/>',
           f'<path d="M-12 -10 Q-12 -34 0 -36 Q12 -34 12 -10 Q0 -6 -12 -10 Z" fill="{f}" {rim(color)}/>',
           f'<rect x="-12" y="-16" width="24" height="3" fill="#a07848"/><rect x="-2" y="-17" width="4" height="5" fill="#f2c56b"/>',
           f'<path d="M-11 -30 q-8 6 -6 14 M11 -30 q8 6 6 14" stroke="{SKIN}" stroke-width="3.6" stroke-linecap="round" fill="none"/>',
           f'<path d="M-10 -48 l-8 -4 l6 8 Z M10 -48 l8 -4 l-6 8 Z" fill="{SKIN}"/>',
           f'<circle cx="0" cy="-46" r="10" fill="{SKIN}" {rim(SKIN)}/>', face(0, -46, 10),
           f'<path d="M-11 -50 Q-6 -78 8 -82 Q4 -66 11 -50 Q0 -54 -11 -50 Z" fill="{shade(color, -0.1)}" {rim(color)}/>',
           f'<path d="M-2 -60 q8 -6 10 -18" stroke="{shade(color, -0.35)}" stroke-width="1" fill="none"/>']
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def gnome(d, x, y, s=1.0, hat=CAP, shirt='#6f9ac6'):
    """The gnome gardener: a tall red hat, a white beard, a round nose"""
    out = [f'<ellipse cx="0" cy="2" rx="18" ry="3.4" fill="#000" opacity="0.14"/>',
           f'<rect x="-10" y="-8" width="8" height="8" rx="3" fill="#6b4329"/><rect x="2" y="-8" width="8" height="8" rx="3" fill="#6b4329"/>',
           f'<path d="M-16 -8 Q-16 -36 0 -38 Q16 -36 16 -8 Z" fill="{ball(d, shirt)}" {rim(shirt)}/>',
           f'<rect x="-16" y="-16" width="32" height="4" fill="#8a5a3a"/>',
           f'<path d="M-12 -38 Q-14 -18 0 -14 Q14 -18 12 -38 Z" fill="#fbf8f2" stroke="#d8d2c8" stroke-width="0.8"/>',
           f'<circle cx="0" cy="-44" r="10" fill="{SKIN}" {rim(SKIN)}/>',
           f'<circle cx="0" cy="-41" r="3.4" fill="#eaa08a"/>',
           ''.join(f'<circle cx="{sx * 4}" cy="-46" r="1.4" fill="#2c2433"/>' for sx in (-1, 1)),
           f'<path d="M-12 -48 Q-6 -84 4 -88 Q8 -70 12 -48 Z" fill="{ball(d, hat)}" {rim(hat)}/>',
           f'<ellipse cx="0" cy="-48" rx="13" ry="3.4" fill="{shade(hat, -0.15)}"/>']
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def butterfly(x, y, s=1.0, color=LILAC, ang=0):
    return (f'<g transform="translate({x} {y}) rotate({ang}) scale({s})">'
            f'<ellipse cx="-6" cy="-4" rx="6" ry="7" fill="{color}" stroke="{shade(color, -0.4)}" stroke-width="0.6"/><ellipse cx="6" cy="-4" rx="6" ry="7" fill="{color}" stroke="{shade(color, -0.4)}" stroke-width="0.6"/>'
            f'<ellipse cx="-4" cy="5" rx="4" ry="4" fill="{shade(color, 0.2)}"/><ellipse cx="4" cy="5" rx="4" ry="4" fill="{shade(color, 0.2)}"/>'
            f'<circle cx="-6" cy="-5" r="2" fill="#fff" opacity="0.6"/><circle cx="6" cy="-5" r="2" fill="#fff" opacity="0.6"/>'
            f'<rect x="-1" y="-8" width="2" height="16" rx="1" fill="#4a3a5a"/><path d="M0 -8 q-3 -5 -5 -5 M0 -8 q3 -5 5 -5" stroke="#4a3a5a" stroke-width="0.8" fill="none"/></g>')


def mushroom(d, x, y, s=1.0, cap=CAP, dots=True):
    cg = ball(d, cap)
    out = [f'<ellipse cx="0" cy="1" rx="14" ry="3" fill="#000" opacity="0.14"/>',
           f'<path d="M-6 0 Q-7 -14 -4 -18 L4 -18 Q7 -14 6 0 Z" fill="#fbf3e0" stroke="#d9cdb4" stroke-width="0.8"/>',
           f'<path d="M-18 -16 Q-16 -36 0 -36 Q16 -36 18 -16 Q0 -12 -18 -16 Z" fill="{cg}" {rim(cap)}/>']
    if dots:
        out.append(''.join(f'<circle cx="{dx}" cy="{dy}" r="{r}" fill="#fff"/>' for dx, dy, r in ((-8, -26, 3), (4, -30, 2.4), (10, -22, 2.6), (-2, -20, 1.8))))
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def mushroom_house(d, x, y, s=1.0, cap=CAP):
    """A mushroom house: a round door, a window with light, a chimney"""
    stem = d.lin([(0, '#fffaf0'), (1, '#d9cdb4')], 0, 0, 1, 0)
    out = [f'<ellipse cx="0" cy="2" rx="40" ry="6" fill="#000" opacity="0.15"/>',
           f'<path d="M-26 0 Q-30 -40 -22 -52 L22 -52 Q30 -40 26 0 Z" fill="{stem}" stroke="#d9cdb4" stroke-width="1"/>',
           f'<path d="M-8 0 L-8 -20 A8 8 0 0 1 8 -20 L8 0 Z" fill="#8a5a3a" stroke="#6b4329" stroke-width="1.4"/><circle cx="4" cy="-10" r="1.4" fill="{GOLD}"/>',
           f'<circle cx="14" cy="-34" r="6" fill="#ffd98a" stroke="#a07848" stroke-width="1.6"/><line x1="14" y1="-40" x2="14" y2="-28" stroke="#a07848" stroke-width="1"/>',
           f'<path d="M-50 -48 Q-46 -94 0 -96 Q46 -94 50 -48 Q0 -38 -50 -48 Z" fill="{ball(d, cap)}" {rim(cap)}/>',
           ''.join(f'<ellipse cx="{dx}" cy="{dy}" rx="{r}" ry="{r * 0.8:.1f}" fill="#fff"/>' for dx, dy, r in ((-26, -66, 7), (4, -80, 6), (28, -62, 6.4), (-6, -58, 4), (18, -78, 3.6), (-36, -54, 3.4))),
           f'<rect x="22" y="-104" width="8" height="14" fill="#a07848"/><circle cx="26" cy="-110" r="4" fill="#fff" opacity="0.5"/>']
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def big_flower(d, x, y, s=1.0, color=ROSE_F, kind='daisy'):
    """A big garden flower on its stem, standing at (x, y)"""
    out = [f'<path d="M0 0 Q-3 -24 0 -46" stroke="#5f9440" stroke-width="{3}" fill="none"/>',
           f'<path d="M0 -14 q-14 -4 -18 -14 q12 0 18 10 Z" fill="#6fa548"/><path d="M0 -24 q14 -4 16 -14 q-12 0 -16 10 Z" fill="#7fb35a"/>']
    if kind == 'daisy':
        for k in range(10):
            a = k * math.pi / 5
            out.append(f'<ellipse cx="{6 * math.cos(a):.1f}" cy="{-50 + 6 * math.sin(a):.1f}" rx="7" ry="3.2" fill="{ball(d, color)}" transform="rotate({math.degrees(a):.0f} {6 * math.cos(a):.1f} {-50 + 6 * math.sin(a):.1f})"/>')
        out.append(f'<circle cx="0" cy="-50" r="5.4" fill="{ball(d, BUTTER_F)}"/>')
    else:
        out.append(f'<path d="M-10 -50 Q-12 -66 -4 -70 L0 -60 L4 -70 Q12 -66 10 -50 Q0 -42 -10 -50 Z" fill="{ball(d, color)}" {rim(color)}/>')
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def crystal(d, x, y, s=1.0, color='#b5e3f5'):
    glow = d.rad([(0, color, 0.6), (1, color, 0)])
    g = d.lin([(0, '#ffffff'), (0.5, color), (1, shade(color, -0.35))], 0, 0, 1, 1)
    return (f'<g transform="translate({x} {y}) scale({s})"><circle cx="0" cy="-26" r="34" fill="{glow}"/>'
            f'<polygon points="0,-58 12,-34 8,0 -8,0 -12,-34" fill="{g}" stroke="{shade(color, -0.45)}" stroke-width="1"/>'
            f'<polygon points="0,-58 -12,-34 -8,0 0,-6" fill="#fff" opacity="0.35"/>'
            f'<polygon points="-14,-22 -22,-12 -18,0 -10,0" fill="{g}" stroke="{shade(color, -0.45)}" stroke-width="0.8"/>'
            f'<polygon points="14,-18 22,-8 18,0 10,0" fill="{g}" stroke="{shade(color, -0.45)}" stroke-width="0.8"/>'
            + sparkle(14, -50, 5, '#fff') + '</g>')


def stump(d, x, y, w, h):
    g = d.lin([(0, shade(BARK, 0.2)), (0.5, BARK), (1, shade(BARK, -0.35))], 0, 0, 1, 0)
    return (f'<path d="M{x - w / 2} {y} L{x - w / 2} {y - h} L{x + w / 2} {y - h} L{x + w / 2} {y} Q{x} {y + 6} {x - w / 2} {y} Z" fill="{g}"/>'
            f'<ellipse cx="{x}" cy="{y - h}" rx="{w / 2}" ry="{w * 0.18:.1f}" fill="#e8cf9e" stroke="{shade(BARK, -0.3)}" stroke-width="1"/>'
            f'<ellipse cx="{x}" cy="{y - h}" rx="{w * 0.3:.1f}" ry="{w * 0.1:.1f}" fill="none" stroke="#c9a874" stroke-width="0.8"/>')


def potion(d, x, y, s=1.0, color='#c79af0'):
    glow = d.rad([(0, color, 0.55), (1, color, 0)])
    liquid = d.rad([(0, shade(color, 0.4)), (1, shade(color, -0.25))], 0.4, 0.4, 0.7)
    return (f'<g transform="translate({x} {y}) scale({s})"><circle cx="0" cy="-12" r="26" fill="{glow}"/>'
            f'<path d="M-4 -28 h8 v6 Q12 -18 12 -9 Q12 0 0 0 Q-12 0 -12 -9 Q-12 -18 -4 -22 Z" fill="#eaf6fd" opacity="0.8" stroke="#a8c8e8" stroke-width="0.8"/>'
            f'<path d="M-11 -10 Q0 -14 11 -10 Q11 -1 0 -1 Q-11 -1 -11 -10 Z" fill="{liquid}"/>'
            f'<rect x="-5" y="-33" width="10" height="6" rx="2" fill="#b98055"/>' + sparkle(6, -16, 3, '#fff') + '</g>')


def lantern_f(d, x, y, s=1.0):
    glow = d.rad([(0, '#fff1b0', 0.6), (1, '#fff1b0', 0)])
    return (f'<g transform="translate({x} {y}) scale({s})"><circle cx="0" cy="0" r="16" fill="{glow}"/>'
            f'<path d="M-6 -6 Q0 -12 6 -6 L5 6 Q0 9 -5 6 Z" fill="#ffe7a0" stroke="#d8b86a" stroke-width="1"/><line x1="0" y1="-12" x2="0" y2="-18" stroke="#8a7c66" stroke-width="1"/></g>')


def fireflies(d, x0, x1, y0, y1, n):
    return ''.join(f'<circle cx="{d.rng.uniform(x0, x1):.1f}" cy="{d.rng.uniform(y0, y1):.1f}" r="{d.rng.uniform(1.4, 2.6):.1f}" fill="#fff4b0" opacity="0.85"/>' for _ in range(n))


def trellis(d, cx, base, w, h):
    """An arched gate of woven branches, leaves and little lanterns"""
    out = []
    for k in range(3):
        r = w / 2 - k * 3
        out.append(f'<path d="M{cx - r} {base} L{cx - r} {base - h + w / 2} A{r} {r} 0 0 1 {cx + r} {base - h + w / 2} L{cx + r} {base}" fill="none" stroke="{shade(BARK, -0.1 + k * 0.1)}" stroke-width="3.4"/>')
    pts = []
    for i in range(22):
        t = i / 21
        a = math.pi * (1 - t)
        if t < 0.18:
            px, py = cx - w / 2, base - (h - w / 2) * (t / 0.18)
        elif t > 0.82:
            px, py = cx + w / 2, base - (h - w / 2) * ((1 - t) / 0.18)
        else:
            u = (t - 0.18) / 0.64
            a = math.pi * (1 - u)
            px, py = cx + w / 2 * math.cos(a), base - h + w / 2 - w / 2 * math.sin(a)
        pts.append((px, py))
    for px, py in pts:
        for _ in range(2):
            lx, ly = px + d.rng.uniform(-6, 6), py + d.rng.uniform(-5, 5)
            out.append(f'<ellipse cx="{lx:.1f}" cy="{ly:.1f}" rx="4.4" ry="2.6" fill="{d.rng.choice(["#5f9440", "#6fa548", "#86c062"])}" transform="rotate({d.rng.uniform(-60, 60):.0f} {lx:.1f} {ly:.1f})"/>')
    for k in (4, 10, 17):
        px, py = pts[k]
        out.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="3.6" fill="{d.rng.choice([ROSE_F, BUTTER_F, LILAC])}"/><circle cx="{px:.1f}" cy="{py:.1f}" r="1.4" fill="#fff"/>')
    out.append(lantern_f(d, cx, base - h + w / 2 - w / 2 + 14, 0.8))
    return '\n'.join(out)


def bridge(d, x0, x1, base, h):
    """An arched wooden bridge, its rails and posts"""
    cx = (x0 + x1) / 2
    g = d.lin([(0, shade(BARK, 0.25)), (1, shade(BARK, -0.2))])
    out = [f'<path d="M{x0} {base} Q{cx} {base - h * 2} {x1} {base} L{x1} {base + 8} Q{cx} {base - h * 2 + 8} {x0} {base + 8} Z" fill="{g}"/>']
    for k in range(1, 12):
        t = k / 12
        px = x0 + (x1 - x0) * t
        py = (1 - t) ** 2 * base + 2 * (1 - t) * t * (base - h * 2) + t * t * base
        out.append(f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{px:.1f}" y2="{py + 8:.1f}" stroke="{shade(BARK, -0.4)}" stroke-width="0.9"/>')
        if k % 3 == 0:
            out.append(f'<rect x="{px - 1.6:.1f}" y="{py - 16:.1f}" width="3.2" height="16" fill="{shade(BARK, -0.2)}"/>')
    out.append(f'<path d="M{x0} {base - 14} Q{cx} {base - h * 2 - 14} {x1} {base - 14}" stroke="{shade(BARK, -0.1)}" stroke-width="3" fill="none"/>')
    out.append(f'<rect x="{x0 - 2}" y="{base - 16}" width="4" height="22" fill="{shade(BARK, -0.25)}"/><rect x="{x1 - 2}" y="{base - 16}" width="4" height="22" fill="{shade(BARK, -0.25)}"/>')
    return '\n'.join(out)


def stream(d, x0, x1, y, w):
    g = d.lin([(0, shade(WATER, 0.25)), (1, shade(WATER, -0.12))])
    return (f'<path d="M{x0} {y} Q{(x0 + x1) / 2} {y - 6} {x1} {y} L{x1} {y + w} Q{(x0 + x1) / 2} {y + w - 6} {x0} {y + w} Z" fill="{g}"/>'
            + ''.join(f'<path d="M{x0 + (x1 - x0) * t:.1f} {y + w * 0.5:.1f} q6 -2 12 0" stroke="#fff" stroke-width="1.2" fill="none" opacity="0.7"/>' for t in (0.15, 0.45, 0.75)))


def f_mound(d):
    return mound(d, F_GRASS, F_ROCK)


# ---------- the stations on the map (300×220) ----------
def draw_gate(d):
    d.add(contact(d, 150, 182, 200))
    d.add(tree(d, 250, 178, 1.0))
    d.add(trellis(d, 150, 182, 96, 150))
    d.add(f'<path d="M126 196 Q138 186 142 168 L158 168 Q162 186 176 196 Z" fill="#ecd9a8"/>')
    d.add(stump(d, 70, 182, 32, 20))
    d.add(book(d, 70, 156, 26, -6))
    d.add(''.join(f'<circle cx="{58 + k * 8}" cy="176" r="3" fill="none" stroke="{c}" stroke-width="1.8"/>' for k, c in enumerate((ROSE_F, MINT_F, LILAC))))
    d.add(fairy(d, 214, 184, 0.62, MINT_F, '#c98a5a'))
    d.add(butterfly(110, 70, 0.8, BUTTER_F, -10), butterfly(196, 48, 0.7, ROSE_F, 15))


def draw_bridge(d):
    d.add(stream(d, 18, 282, 168, 22))
    d.add(bridge(d, 70, 230, 176, 22))
    d.add(elf(d, 150, 148, 0.7))
    d.add(big_flower(d, 52, 182, 0.9, LILAC, 'tulip'), big_flower(d, 252, 184, 0.8, BUTTER_F))
    d.add(butterfly(98, 92, 0.9, ROSE_F, -15), butterfly(206, 70, 0.8, LILAC, 10), butterfly(150, 50, 0.7, MINT_F, 0))


def draw_check(d):
    d.add(mushroom_house(d, 132, 182, 1.25, CAP))
    d.add(elf(d, 216, 184, 0.8))
    d.add(crystal(d, 252, 180, 0.45))
    d.add(mushroom(d, 62, 184, 0.9, ROSE_F))
    d.add(butterfly(232, 74, 0.7, BUTTER_F, 10))


def draw_flowers(d):
    for x, c, k, s in ((60, ROSE_F, 'daisy', 1.3), (98, BUTTER_F, 'tulip', 1.5), (226, LILAC, 'daisy', 1.5), (256, PEACH_F, 'tulip', 1.2), (196, MINT_F, 'daisy', 1.1)):
        d.add(big_flower(d, x, 178, s, c, k))
    d.add(mushroom(d, 132, 186, 1.0, LILAC, dots=False), mushroom(d, 168, 188, 0.9, ROSE_F))
    d.add(fairy(d, 150, 168, 0.5, BUTTER_F, '#8a5a3a', with_wand=False))
    d.add(butterfly(120, 70, 0.9, ROSE_F, -12), butterfly(190, 56, 0.8, BUTTER_F, 8))


def draw_healer(d):
    # the healing fairy's pavilion: a tree with a round door, a petal canopy, the fairy with her wand
    d.add(contact(d, 150, 182, 220))
    g = d.lin([(0, shade(BARK, 0.2)), (0.5, BARK), (1, shade(BARK, -0.35))], 0, 0, 1, 0)
    d.add(f'<path d="M96 184 Q100 140 108 110 L192 110 Q200 140 204 184 Z" fill="{g}"/>')
    d.add(''.join(f'<path d="M{x} 182 q4 -30 0 -60" stroke="{shade(BARK, -0.35)}" stroke-width="1.2" fill="none"/>' for x in (116, 140, 166, 188)))
    d.add(f'<path d="M136 184 L136 150 A14 14 0 0 1 164 150 L164 184 Z" fill="#7a5a8c" stroke="#5a3a6c" stroke-width="2"/><circle cx="158" cy="166" r="2" fill="{GOLD}"/>')
    d.add(f'<circle cx="118" cy="132" r="9" fill="#ffd98a" stroke="#6b4329" stroke-width="2"/>')
    for k in range(9):
        a = math.pi * (0.95 + 1.1 * k / 8)
        d.add(f'<ellipse cx="{150 + 70 * math.cos(a):.1f}" cy="{96 + 34 * math.sin(a):.1f}" rx="26" ry="16" fill="{ball(d, ROSE_F if k % 2 else LILAC)}" {rim(ROSE_F)}/>')
    d.add(f'<ellipse cx="150" cy="72" rx="44" ry="26" fill="{ball(d, ROSE_F)}" {rim(ROSE_F)}/>')
    d.add(fairy(d, 224, 186, 0.8, LILAC, '#f2c56b', crown=True))
    d.add(mushroom(d, 72, 184, 0.8, CAP))
    d.add(fireflies(d, 60, 250, 30, 140, 10))


def draw_crystal(d):
    d.add(stump(d, 150, 184, 56, 26))
    d.add(crystal(d, 150, 160, 1.4))
    d.add(crystal(d, 92, 184, 0.6, '#f0c0e0'), crystal(d, 210, 186, 0.7, '#c8f0d8'))
    d.add(fairy(d, 252, 184, 0.5, MINT_F, '#c98a5a', with_wand=False))
    d.add(fireflies(d, 60, 240, 40, 150, 8))


def draw_wand(d):
    d.add(stump(d, 112, 184, 70, 28))
    d.add(f'<rect x="88" y="150" width="20" height="8" rx="3" fill="#fff" stroke="{MINT_F}" stroke-width="1.2"/>')
    d.add(leaf(130, 152, 1.0, '#6fa548'))
    d.add(potion(d, 100, 154, 0.6, MINT_F))
    d.add(gnome(d, 192, 184, 0.95))
    d.add(wand(214, 150, 236, 118, 7))
    d.add(mushroom(d, 252, 186, 0.7, LILAC))
    d.add(butterfly(70, 80, 0.8, BUTTER_F, -10))


def draw_council(d):
    # the fairies' council: a ring of mushrooms around a glowing stone, three fairies
    for k in range(7):
        a = math.pi * (0.05 + 0.9 * k / 6)
        d.add(mushroom(d, 150 - 96 * math.cos(a), 184 - 14 * math.sin(a), 0.7, (CAP, ROSE_F, LILAC)[k % 3]))
    d.add(crystal(d, 150, 172, 0.7, '#fff2b0'))
    d.add(fairy(d, 98, 168, 0.55, ROSE_F, '#f2c56b'))
    d.add(fairy(d, 150, 140, 0.55, LILAC, '#e6e6f0', crown=True))
    d.add(fairy(d, 204, 170, 0.55, MINT_F, '#8a5a3a'))
    d.add(fireflies(d, 60, 240, 30, 120, 10))


def draw_waiting(d):
    d.add(stump(d, 150, 184, 70, 30))
    d.add(potion(d, 136, 154, 1.0, '#c79af0'))
    d.add(potion(d, 168, 154, 0.7, MINT_F))
    d.add(f'<g transform="translate(220 184) scale(0.8)"><rect x="-12" y="-4" width="24" height="4" rx="1.5" fill="{BARK}"/><rect x="-12" y="-44" width="24" height="4" rx="1.5" fill="{BARK}"/><path d="M-7 -40 L7 -40 L1 -22 L7 -4 L-7 -4 L-1 -22 Z" fill="#e7f3fa" opacity="0.85" stroke="#9fb9c9" stroke-width="0.8"/><path d="M-4 -34 L4 -34 L0.6 -24 L-0.6 -24 Z M-6 -5 L6 -5 L0 -14 Z" fill="#f2d68a"/></g>')
    d.add(elf(d, 80, 184, 0.7))
    d.add(fireflies(d, 60, 250, 40, 150, 14))
    d.add(big_flower(d, 260, 186, 0.8, ROSE_F))


def draw_leave(d):
    d.add(trellis(d, 120, 182, 90, 140))
    d.add(f'<path d="M96 196 Q110 186 112 168 L128 168 Q132 186 146 196 Z" fill="#ecd9a8"/>')
    d.add(fairy(d, 196, 170, 0.6, ROSE_F, '#f2c56b'))
    d.add(fairy(d, 236, 184, 0.55, LILAC, '#8a5a3a'))
    d.add(elf(d, 60, 186, 0.6))
    d.add(butterfly(200, 70, 0.9, BUTTER_F, 10), butterfly(250, 100, 0.7, MINT_F, -10))


STATIONS = {
    'gate': (draw_gate, 'the garden gate (reception)'),
    'bridge': (draw_bridge, 'the butterfly bridge (waiting before the checks)'),
    'check': (draw_check, 'the magic check at the mushroom house (the checks)'),
    'flowers': (draw_flowers, 'the flower corner (waiting for the doctor)'),
    'healer': (draw_healer, "the healing fairy's tree (the doctor)"),
    'crystal': (draw_crystal, 'the seeing crystal (tests)'),
    'wand': (draw_wand, 'the healing wand of the gnome gardener (treatment)'),
    'council': (draw_council, "the fairies' council (consultation)"),
    'waiting': (draw_waiting, 'waiting for the magic (waiting for results)'),
    'leave': (draw_leave, 'leaving the beautiful garden (the end)'),
}


# ---------- the scenes (364×340) ----------
def garden_back(d, horizon=200):
    d.add(sky(d, SH, F_SKY0, F_SKY1))
    d.add(cloud(70, 50, 0.7), cloud(290, 70, 0.6))
    d.add(band(SW, SH, horizon - 34, 8, 0.4, '#b8b0d8'))
    for x in (30, 120, 250, 340):
        d.add(f'<g opacity="0.8">{tree(d, x, horizon - 6, 0.7)}</g>')
    d.add(band(SW, SH, horizon, 6, 1.1, shade(F_GRASS, 0.08)))
    d.add(f'<rect x="0" y="{horizon + 6}" width="{SW}" height="{SH - horizon}" fill="{d.lin([(0, shade(F_GRASS, 0.05)), (1, shade(F_GRASS, -0.15))])}"/>')


def sc_gate(d):
    garden_back(d, 210)
    d.add(f'<path d="M140 340 Q170 270 176 214 L192 214 Q200 270 236 340 Z" fill="#ecd9a8"/>')
    d.add(mushroom_house(d, 210, 226, 0.5))
    d.add(trellis(d, 182, 340, 270, 330))
    d.add(stump(d, 70, 340, 90, 70))
    d.add(book(d, 70, 260, 74, -6))
    d.add(''.join(f'<circle cx="{40 + k * 22}" cy="300" r="8" fill="none" stroke="{c}" stroke-width="4"/>' for k, c in enumerate((ROSE_F, MINT_F, LILAC))))
    d.add(fairy(d, 300, 330, 1.6, MINT_F, '#c98a5a'))
    d.add(butterfly(130, 110, 1.6, BUTTER_F, -10), butterfly(250, 80, 1.3, ROSE_F, 15))


def sc_bridge(d):
    garden_back(d, 180)
    d.add(stream(d, 0, SW, 250, 90))
    d.add(bridge(d, 20, 344, 300, 60))
    d.add(elf(d, 210, 232, 1.6))
    d.add(big_flower(d, 30, 250, 1.8, LILAC, 'tulip'), big_flower(d, 340, 248, 1.6, BUTTER_F))
    d.add(butterfly(90, 120, 1.6, ROSE_F, -15), butterfly(280, 100, 1.4, LILAC, 10), butterfly(180, 70, 1.2, MINT_F, 0))


def sc_check(d):
    # inside the mushroom house: a round window, shelves of jars, the elf with a glowing leaf
    d.add(f'<rect width="{SW}" height="{SH}" fill="#fbf1dc"/>')
    d.add(f'<path d="M0 0 Q182 -40 364 0 L364 60 Q182 20 0 60 Z" fill="{ball(d, CAP)}"/>')
    d.add(''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" opacity="0.85"/>' for x, y, r in ((60, 30, 10), (180, 18, 8), (300, 34, 10))))
    d.add(f'<circle cx="250" cy="130" r="44" fill="#a07848"/><circle cx="250" cy="130" r="36" fill="{d.lin([(0, "#9fd3f0"), (1, "#e3f5e0")])}"/>')
    d.add(f'<g clip-path="{d.clip("<circle cx=\'250\' cy=\'130\' r=\'36\'/>")}">' + band(SW, SH, 140, 4, 0.4, '#93c86a') + butterfly(236, 112, 0.8, ROSE_F, 0) + '</g>')
    d.add(f'<line x1="214" y1="130" x2="286" y2="130" stroke="#a07848" stroke-width="3"/><line x1="250" y1="94" x2="250" y2="166" stroke="#a07848" stroke-width="3"/>')
    for y in (110, 170):
        d.add(f'<rect x="40" y="{y}" width="120" height="7" fill="#a07848"/>')
    d.add(''.join(potion(d, 56 + k * 28, 110, 0.8, c) for k, c in enumerate((ROSE_F, MINT_F, LILAC, BUTTER_F))))
    d.add(''.join(crystal(d, 60 + k * 36, 170, 0.45, c) for k, c in enumerate(('#b5e3f5', '#f0c0e0', '#c8f0d8'))))
    floor = d.lin([(0, '#c9a874'), (1, '#a07848')])
    d.add(f'<rect x="0" y="236" width="{SW}" height="{SH - 236}" fill="{floor}"/>')
    d.add(f'<ellipse cx="182" cy="300" rx="150" ry="26" fill="{ball(d, MINT_F)}"/>')
    d.add(stump(d, 110, 300, 100, 50))
    d.add(leaf(110, 238, 2.0, '#6fa548'))
    d.add(f'<circle cx="110" cy="238" r="30" fill="{d.rad([(0, "#fff4b0", 0.5), (1, "#fff4b0", 0)])}"/>')
    d.add(elf(d, 250, 330, 2.0))


def sc_flowers(d):
    garden_back(d, 190)
    for x, c, k, s in ((40, ROSE_F, 'daisy', 2.6), (110, BUTTER_F, 'tulip', 3.0), (270, LILAC, 'daisy', 3.0), (330, PEACH_F, 'tulip', 2.4)):
        d.add(big_flower(d, x, 300, s, c, k))
    d.add(mushroom(d, 170, 330, 2.2, LILAC, dots=False), mushroom(d, 230, 336, 1.8, ROSE_F))
    d.add(fairy(d, 196, 280, 1.0, BUTTER_F, '#8a5a3a', with_wand=False))
    d.add(butterfly(150, 120, 1.6, ROSE_F, -12), butterfly(230, 90, 1.3, BUTTER_F, 8))


def sc_healer(d):
    # inside the healing fairy's tree: wooden walls, a bed of petals, the fairy with her wand
    d.add(f'<rect width="{SW}" height="{SH}" fill="{d.lin([(0, shade(BARK, 0.35)), (1, shade(BARK, 0.1))], 0, 0, 1, 0)}"/>')
    d.add(''.join(f'<path d="M{x} 0 q8 170 0 340" stroke="{shade(BARK, -0.1)}" stroke-width="2" fill="none"/>' for x in range(20, SW, 46)))
    d.add(f'<path d="M110 60 A72 60 0 0 1 254 60 L254 150 L110 150 Z" fill="{d.lin([(0, "#9fd3f0"), (1, "#f6e3ee")])}" stroke="#6b4329" stroke-width="6"/>')
    d.add(fireflies(d, 120, 244, 40, 140, 8))
    floor = d.lin([(0, '#c9a874'), (1, '#a07848')])
    d.add(f'<rect x="0" y="240" width="{SW}" height="{SH - 240}" fill="{floor}"/>')
    for k in range(8):
        d.add(f'<ellipse cx="{40 + k * 20}" cy="{276 - (k % 2) * 6}" rx="26" ry="14" fill="{ball(d, ROSE_F if k % 2 else LILAC)}"/>')
    d.add(fairy(d, 262, 320, 2.4, LILAC, '#f2c56b', crown=True))
    d.add(potion(d, 60, 236, 1.2, MINT_F))


def sc_crystal(d):
    garden_back(d, 200)
    d.add(stump(d, 182, 340, 160, 70))
    d.add(crystal(d, 182, 276, 3.0))
    d.add(crystal(d, 50, 330, 1.2, '#f0c0e0'), crystal(d, 320, 336, 1.4, '#c8f0d8'))
    d.add(fireflies(d, 40, 330, 40, 220, 14))


def sc_wand(d):
    garden_back(d, 190)
    d.add(stump(d, 110, 340, 180, 70))
    d.add(f'<rect x="50" y="250" width="50" height="18" rx="5" fill="#fff" stroke="{MINT_F}" stroke-width="2"/>')
    d.add(leaf(150, 254, 2.2, '#6fa548'))
    d.add(potion(d, 100, 262, 1.4, MINT_F))
    d.add(gnome(d, 272, 336, 2.4))
    d.add(wand(320, 240, 350, 170, 14))
    d.add(butterfly(80, 110, 1.4, BUTTER_F, -10))


def sc_council(d):
    garden_back(d, 180)
    for k in range(7):
        a = math.pi * (0.05 + 0.9 * k / 6)
        d.add(mushroom(d, 182 - 160 * math.cos(a), 330 - 50 * math.sin(a), 1.6, (CAP, ROSE_F, LILAC)[k % 3]))
    d.add(crystal(d, 182, 300, 1.6, '#fff2b0'))
    d.add(fairy(d, 80, 280, 1.3, ROSE_F, '#f2c56b'))
    d.add(fairy(d, 182, 230, 1.3, LILAC, '#e6e6f0', crown=True))
    d.add(fairy(d, 290, 284, 1.3, MINT_F, '#8a5a3a'))
    d.add(fireflies(d, 40, 330, 40, 200, 14))


def sc_waiting(d):
    garden_back(d, 190)
    d.add(stump(d, 182, 340, 200, 80))
    d.add(potion(d, 150, 262, 2.6, '#c79af0'))
    d.add(potion(d, 238, 262, 1.8, MINT_F))
    d.add(f'<g transform="translate(320 330) scale(2.0)"><rect x="-12" y="-4" width="24" height="4" rx="1.5" fill="{BARK}"/><rect x="-12" y="-44" width="24" height="4" rx="1.5" fill="{BARK}"/><path d="M-7 -40 L7 -40 L1 -22 L7 -4 L-7 -4 L-1 -22 Z" fill="#e7f3fa" opacity="0.85" stroke="#9fb9c9" stroke-width="0.8"/><path d="M-4 -34 L4 -34 L0.6 -24 L-0.6 -24 Z M-6 -5 L6 -5 L0 -14 Z" fill="#f2d68a"/></g>')
    d.add(elf(d, 52, 336, 1.6))
    d.add(fireflies(d, 40, 330, 40, 240, 18))


def sc_leave(d):
    garden_back(d, 210)
    d.add(f'<path d="M140 340 Q170 270 176 214 L192 214 Q200 270 236 340 Z" fill="#ecd9a8"/>')
    d.add(f'<g opacity="0.9">{trellis(d, 182, 300, 150, 230)}</g>')
    d.add(fairy(d, 70, 320, 1.5, ROSE_F, '#f2c56b'))
    d.add(fairy(d, 296, 326, 1.4, LILAC, '#8a5a3a'))
    d.add(elf(d, 250, 336, 1.2))
    d.add(gnome(d, 120, 336, 1.2))
    d.add(butterfly(130, 100, 1.6, BUTTER_F, 10), butterfly(250, 120, 1.3, MINT_F, -10))


SCENES = {
    'gate': (sc_gate, 'at the garden gate (reception)'),
    'bridge': (sc_bridge, 'on the butterfly bridge (waiting before the checks)'),
    'check': (sc_check, 'in the mushroom house, at the magic check (the checks)'),
    'flowers': (sc_flowers, 'in the flower corner (waiting for the doctor)'),
    'healer': (sc_healer, 'with the healing fairy in her tree (the doctor)'),
    'crystal': (sc_crystal, 'at the seeing crystal (tests)'),
    'wand': (sc_wand, 'with the gnome gardener and the healing wand (treatment)'),
    'council': (sc_council, "at the fairies' council (consultation)"),
    'waiting': (sc_waiting, 'waiting for the magic (waiting for results)'),
    'leave': (sc_leave, 'leaving the beautiful garden (the end)'),
}


# ---------- the map backgrounds ----------
def background(W, H, horizon, trees, streams, clouds, seed, comment):
    d = Doc(W, H, seed)
    s = (W / 412) ** 0.5
    d.add(f'<rect width="{W}" height="{H}" fill="{d.lin([(0, F_SKY0), (0.85, F_SKY1)])}"/>')
    d.add(*[cloud(*c) for c in clouds])
    d.add(band(W, H, horizon - 30 * s, 16 * s, 0.4, '#b8b0d8'))
    d.add(band(W, H, horizon - 12 * s, 10 * s, 2.0, '#a9c9a0'))
    rows = [('#b5dc8e', 0), ('#a6d27e', 0.16), ('#97c870', 0.36), ('#89bd63', 0.6), ('#7db358', 0.82)]
    for i, (col, f) in enumerate(rows):
        d.add(band(W, H, horizon + (H - horizon) * f, 10 * s, i * 1.7, col))
    for st in streams:
        d.add(st(d))
    for t in sorted(trees, key=lambda t: t[1]):
        d.add(tree(d, *t))
    return d.svg(f'{WORLD} world: {comment}', grain=0.025, wobble=1.0, clay=False)


def portrait_bg():
    return background(
        412, 1100, 196,
        trees=[(380, 240, 0.8), (24, 360, 0.85), (392, 530, 0.9), (20, 700, 0.85), (396, 870, 0.9), (40, 1030, 0.85)],
        streams=[lambda d: stream(d, 0, 412, 1060, 30)],
        clouds=[(250, 150, 0.5), (110, 168, 0.45)], seed=61,
        comment='the portrait map background (the 412×939 frame, drawn 412×1100 so the second map can move it)')


def landscape_bg():
    return background(
        1920, 1080, 330,
        trees=[(1560, 480, 1.7), (1680, 450, 1.4), (1850, 520, 1.8), (90, 440, 1.6), (240, 410, 1.3), (1880, 780, 1.6), (560, 1050, 1.5)],
        streams=[lambda d: stream(d, 0, 1920, 1000, 60)],
        clouds=[(420, 170, 1.4), (760, 230, 1.1), (1150, 160, 1.3), (1600, 270, 1.0)], seed=62,
        comment='the landscape map background (the 1920×1080 frame)')


def sheet_floor():
    d = Doc(364, 340, 69)
    d.add(f'<rect width="364" height="340" fill="{d.lin([(0, "#efe8f8"), (0.55, "#f8eef3"), (1, "#e7dcc0")])}"/>')
    d.add(band(364, 340, 215, 6, 0.7, '#d4e6bc'), band(364, 340, 255, 5, 2.1, '#c1dba3'))
    return d.svg(f'{WORLD} world: the panel behind a picture on its sheet', clay=False)


def celebrate():
    d = Doc(640, 480, 71)
    d.add(f'<rect width="640" height="480" fill="{d.lin([(0, F_SKY0), (1, F_SKY1)])}"/>')
    d.add(cloud(120, 100, 1.2), cloud(520, 80, 1.0))
    d.add(band(640, 480, 330, 10, 0.5, '#b5dc8e'), band(640, 480, 380, 10, 2.0, '#97c870'))
    fig = Doc(640, 480, 72, prefix='v')
    fig.add(mushroom_house(fig, 320, 400, 2.0))
    fig.add(fairy(fig, 160, 450, 1.8, ROSE_F, '#f2c56b'))
    fig.add(fairy(fig, 480, 450, 1.8, LILAC, '#8a5a3a', crown=True))
    fig.add(elf(fig, 240, 460, 1.3), gnome(fig, 410, 460, 1.3))
    fig.add(butterfly(130, 180, 1.8, BUTTER_F, -10), butterfly(520, 200, 1.6, MINT_F, 10))
    d.defs.extend(fig.defs)
    d.add('<g filter="url(#clay)">' + '\n'.join(fig.body) + '</g>')
    d.add(fireflies(d, 40, 600, 60, 300, 24))
    return d.svg(f'{WORLD} world: leaving the garden happy (the celebration screen)', clay=False)


def card():
    d = Doc(300, 220, 73)
    d.add(f_mound(d))
    d.add(mushroom_house(d, 120, 182, 1.1))
    d.add(fairy(d, 222, 184, 0.9, ROSE_F, '#f2c56b'))
    d.add(butterfly(240, 60, 0.9, BUTTER_F, 10))
    return d.svg(f'{WORLD} world: the card on the world select screen')


def main():
    files = {}
    for k, (f, c) in STATIONS.items():
        files[f'station-{k}.svg'] = station(k, f, c, WORLD, f_mound)
    for k, (f, c) in SCENES.items():
        files[f'scene-{k}.svg'] = scene(k, f, c, WORLD)
    files['map-portrait.svg'] = portrait_bg()
    files['map-landscape.svg'] = landscape_bg()
    files['sheet-floor.svg'] = sheet_floor()
    files['celebrate.svg'] = celebrate()
    files['card.svg'] = card()
    write('fairy', files)


if __name__ == '__main__':
    lib.RELIEF = 4
    main()

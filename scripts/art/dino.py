"""The dinosaur world's pictures (public/worlds/dino/art): a reserve of friendly dinosaurs in a green valley.

    python3 scripts/art/dino.py

Drawn with the shared tools in lib.py (the same light, grain and 3D filter as the knight), plus the tools of this
world below: palms, ferns, log walls, thatched roofs, tents, the dinosaurs, eggs, a jeep, an explorer.
The dinosaurs are friendly: round shapes, soft colours, a smile, no teeth or claws.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa: E402,F403
from lib import SW, SH  # noqa: E402
import lib  # noqa: E402

# the dinosaurs are round: the 3D light raises their edges higher than the knight's walls
lib.RELIEF = 4.5

WORLD = 'Dinosaur'

# ---------- palette ----------
D_SKY0, D_SKY1 = '#3f8aa6', '#f4ead0'
LEAF, LEAF_D, LEAF_L = '#5c9b3d', '#3f7330', '#86bf5a'
D_GRASS = '#8cbf4f'
EARTH = '#b8946a'
SAND = '#e3cc98'
LOG = '#9a6a42'
STRAW = '#d9b56a'
CANVAS = '#efe4c8'
BRONTO = '#5fae9a'
REX = '#ef9f55'
TRIKE = '#9b88d0'
KHAKI = '#c9b27a'
D_ROCK = '#b39572'


# ---------- the tools of this world ----------
def d_mound(d):
    """The island: a grassy top on warm sandstone rocks, a fern at its edge"""
    return mound(d, D_GRASS, D_ROCK)


def log(d, x, y, w, h, color=LOG, ends=True):
    """One log lying across: round, lit on top, with its cut ends"""
    g = d.lin([(0, shade(color, 0.3)), (0.4, color), (1, shade(color, -0.4))])
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h / 2}" fill="{g}"/>']
    for k in range(2):
        gx = x + d.rng.uniform(0.15, 0.85) * w
        out.append(f'<path d="M{gx:.1f} {y + h * 0.35:.1f} q{w * 0.08:.1f} {-h * 0.1:.1f} {w * 0.16:.1f} 0" stroke="{shade(color, -0.35)}" stroke-width="0.8" fill="none"/>')
    if ends:
        for ex in (x + h / 2, x + w - h / 2):
            out.append(f'<ellipse cx="{ex}" cy="{y + h / 2}" rx="{h * 0.42:.1f}" ry="{h * 0.48:.1f}" fill="{shade(STRAW, 0.1)}" stroke="{shade(color, -0.3)}" stroke-width="1"/>')
            out.append(f'<ellipse cx="{ex}" cy="{y + h / 2}" rx="{h * 0.22:.1f}" ry="{h * 0.26:.1f}" fill="none" stroke="{shade(STRAW, -0.3)}" stroke-width="0.8"/>')
    return '\n'.join(out)


def log_wall(d, x, y, w, h, n=None, color=LOG):
    """A wall of logs laid one on another"""
    n = n or max(3, int(h / 11))
    lh = h / n
    return '\n'.join(log(d, x - lh * 0.3, y + i * lh, w + lh * 0.6, lh + 0.6, shade(color, d.rng.uniform(-0.06, 0.05))) for i in range(n))


def post(d, x, y, w, h, color=LOG):
    """An upright log"""
    g = d.lin([(0, shade(color, -0.2)), (0.3, shade(color, 0.25)), (1, shade(color, -0.45))], 0, 0, 1, 0)
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{w * 0.3:.1f}" fill="{g}"/>'
            f'<ellipse cx="{x + w / 2}" cy="{y + 1}" rx="{w / 2}" ry="{w * 0.22:.1f}" fill="{shade(STRAW, 0.05)}" stroke="{shade(color, -0.3)}" stroke-width="0.8"/>')


def palisade(d, x, base, w, h, pw=12, color=LOG):
    """A fence of upright logs with pointed tops, and a rail across them"""
    out = []
    n = max(2, int(w / pw))
    for i in range(n):
        px = x + i * w / n
        hh = h * d.rng.uniform(0.92, 1.04)
        c = shade(color, d.rng.uniform(-0.08, 0.06))
        g = d.lin([(0, shade(c, -0.2)), (0.35, shade(c, 0.22)), (1, shade(c, -0.45))], 0, 0, 1, 0)
        out.append(f'<path d="M{px:.1f} {base} L{px:.1f} {base - hh + pw * 0.6:.1f} L{px + w / n / 2:.1f} {base - hh:.1f} L{px + w / n:.1f} {base - hh + pw * 0.6:.1f} L{px + w / n:.1f} {base} Z" fill="{g}" stroke="{shade(c, -0.5)}" stroke-width="0.8"/>')
    for t in (0.3, 0.72):
        out.append(f'<rect x="{x - 2}" y="{base - h * t:.1f}" width="{w + 4}" height="{max(4, h * 0.06):.1f}" rx="2" fill="{shade(color, -0.25)}"/>')
    return '\n'.join(out)


def thatch(d, x0, x1, base, h, color=STRAW):
    """A thatched roof: a gable of straw, with strands and a ridge"""
    cx = (x0 + x1) / 2
    shape = f'M{x0 - 6} {base + 4} L{cx} {base - h} L{x1 + 6} {base + 4} Q{cx} {base + 10} {x0 - 6} {base + 4} Z'
    clip = d.clip(f'<path d="{shape}"/>')
    g = d.lin([(0, shade(color, 0.15)), (0.5, color), (0.5, shade(color, -0.12)), (1, shade(color, -0.3))], 0, 0, 1, 0)
    strands = []
    for i in range(int((x1 - x0) / 3.2)):
        bx = x0 - 6 + i * 3.2 + d.rng.uniform(-1, 1)
        t = (bx - x0 + 6) / (x1 - x0 + 12)
        tx = cx + (bx - cx) * 0.1
        strands.append(f'<line x1="{bx:.1f}" y1="{base + 6}" x2="{tx:.1f}" y2="{base - h * (0.55 + 0.4 * (1 - abs(t - 0.5) * 2)):.1f}" stroke="{shade(color, d.rng.choice([-0.3, -0.2, 0.15]))}" stroke-width="1" opacity="0.8"/>')
    rows = ''.join(f'<path d="M{x0 - 6} {base - h * k + 4 * (1 - k):.1f} Q{cx} {base - h * k + 8:.1f} {x1 + 6} {base - h * k + 4 * (1 - k):.1f}" stroke="{shade(color, -0.35)}" stroke-width="1.6" fill="none"/>' for k in (0.25, 0.5))
    return (f'<path d="{shape}" fill="{g}"/><g clip-path="{clip}">' + ''.join(strands) + rows + '</g>'
            f'<path d="M{cx - 8} {base - h + 6} L{cx} {base - h - 2} L{cx + 8} {base - h + 6}" stroke="{shade(color, -0.4)}" stroke-width="3" fill="none" stroke-linecap="round"/>')


def palm(d, x, y, s=1.0, lean=0.25, fronds=7):
    """A palm tree standing at (x, y): a curved, ringed trunk and drooping fronds"""
    top = (x + 40 * s * lean, y - 92 * s)
    c = (x + 6 * s * lean, y - 50 * s)
    trunk = d.lin([(0, shade(LOG, 0.2)), (1, shade(LOG, -0.35))], 0, 0, 1, 0)
    out = [f'<ellipse cx="{x}" cy="{y + 2 * s}" rx="{20 * s}" ry="{4 * s}" fill="#000" opacity="0.14"/>',
           f'<path d="M{x - 6 * s} {y} Q{c[0] - 5 * s} {c[1]} {top[0] - 3 * s} {top[1]} L{top[0] + 3 * s} {top[1]} Q{c[0] + 5 * s} {c[1]} {x + 6 * s} {y} Z" fill="{trunk}"/>']
    for k in range(1, 12):
        t = k / 12
        px = (1 - t) ** 2 * x + 2 * (1 - t) * t * c[0] + t * t * top[0]
        py = (1 - t) ** 2 * y + 2 * (1 - t) * t * c[1] + t * t * top[1]
        wdt = (6 - 3 * t) * s
        out.append(f'<path d="M{px - wdt:.1f} {py:.1f} q{wdt:.1f} {2.5 * s:.1f} {2 * wdt:.1f} 0" stroke="{shade(LOG, -0.45)}" stroke-width="{1.1 * s:.1f}" fill="none"/>')
    for i in range(fronds):
        a = math.pi * (0.06 + 0.88 * i / (fronds - 1))
        ln = (44 + d.rng.uniform(-6, 6)) * s
        ex = top[0] - math.cos(a) * ln
        ey = top[1] - math.sin(a) * ln * 0.35 + ln * 0.42
        mx = (top[0] + ex) / 2
        my = min(top[1], ey) - 14 * s
        col = d.rng.choice([LEAF, shade(LEAF, -0.1), shade(LEAF, 0.08)])
        g = d.lin([(0, shade(col, 0.2)), (1, shade(col, -0.25))])
        out.append(f'<path d="M{top[0]:.1f} {top[1]:.1f} Q{mx:.1f} {my - 8 * s:.1f} {ex:.1f} {ey:.1f} Q{mx:.1f} {my + 6 * s:.1f} {top[0]:.1f} {top[1] + 3 * s:.1f} Z" fill="{g}"/>')
        out.append(f'<path d="M{top[0]:.1f} {top[1] + 1:.1f} Q{mx:.1f} {my - 1 * s:.1f} {ex:.1f} {ey:.1f}" stroke="{shade(col, -0.4)}" stroke-width="{0.9 * s:.1f}" fill="none"/>')
        for k in range(1, 7):
            t = k / 7
            px = (1 - t) ** 2 * top[0] + 2 * (1 - t) * t * mx + t * t * ex
            py = (1 - t) ** 2 * top[1] + 2 * (1 - t) * t * (my - 1 * s) + t * t * ey
            out.append(f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{px + (ex - top[0]) * 0.05:.1f}" y2="{py + 7 * s * (1 - t * 0.5):.1f}" stroke="{shade(col, -0.3)}" stroke-width="{0.8 * s:.1f}"/>')
    for k in range(3):
        out.append(f'<circle cx="{top[0] + (k - 1) * 4 * s:.1f}" cy="{top[1] + 4 * s:.1f}" r="{3.4 * s:.1f}" fill="#7a5532"/>')
    return '\n'.join(out)


def fern(d, x, y, s=1.0, n=6, color=LEAF):
    """A fern growing at (x, y): arched fronds of small leaflets"""
    out = []
    for i in range(n):
        a = math.pi * (0.12 + 0.76 * i / (n - 1))
        ln = (26 + d.rng.uniform(-4, 4)) * s
        ex, ey = x - math.cos(a) * ln, y - math.sin(a) * ln * 0.8
        cx_, cy_ = x - math.cos(a) * ln * 0.45, y - math.sin(a) * ln * 1.15
        col = shade(color, d.rng.uniform(-0.12, 0.1))
        out.append(f'<path d="M{x} {y} Q{cx_:.1f} {cy_:.1f} {ex:.1f} {ey:.1f}" stroke="{shade(col, -0.3)}" stroke-width="{1 * s:.1f}" fill="none"/>')
        for k in range(1, 9):
            t = k / 9
            px = (1 - t) ** 2 * x + 2 * (1 - t) * t * cx_ + t * t * ex
            py = (1 - t) ** 2 * y + 2 * (1 - t) * t * cy_ + t * t * ey
            r = (4.2 - 3 * t) * s
            for side in (-1, 1):
                ang = math.degrees(a) + side * 55
                out.append(f'<ellipse cx="{px:.1f}" cy="{py:.1f}" rx="{r:.1f}" ry="{r * 0.42:.1f}" fill="{col}" transform="rotate({ang:.0f} {px:.1f} {py:.1f})"/>')
    return '\n'.join(out)


def canopy(d, W, y, s, color='#7fae74'):
    """The far edge of the jungle: soft round tree tops of different sizes, a few palms rising out of them"""
    out = []
    x = -20 * s
    while x < W + 20 * s:
        r = d.rng.uniform(12, 22) * s
        out.append(f'<circle cx="{x:.1f}" cy="{y - r * 0.4:.1f}" r="{r:.1f}" fill="{shade(color, d.rng.uniform(-0.08, 0.06))}"/>')
        out.append(f'<circle cx="{x - r * 0.3:.1f}" cy="{y - r * 0.7:.1f}" r="{r * 0.55:.1f}" fill="{shade(color, 0.12)}" opacity="0.7"/>')
        x += r * 1.3
    out.append(f'<rect x="0" y="{y - 4 * s:.1f}" width="{W}" height="{12 * s:.1f}" fill="{color}"/>')
    x = d.rng.uniform(20, 80) * s
    while x < W:
        out.append(f'<g opacity="0.85">{palm(d, x, y - 6 * s, d.rng.uniform(0.45, 0.7) * s, d.rng.uniform(-0.3, 0.3), 6)}</g>')
        x += d.rng.uniform(110, 190) * s
    return '\n'.join(out)


def eye(cx, cy, r, look=0.3):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff"/><circle cx="{cx + r * look:.1f}" cy="{cy + r * 0.05:.1f}" r="{r * 0.62:.1f}" fill="#2c2433"/>'
            f'<circle cx="{cx + r * look - r * 0.2:.1f}" cy="{cy - r * 0.25:.1f}" r="{r * 0.24:.1f}" fill="#fff"/>')


def spots(d, cx, cy, rx, ry, n, color):
    return ''.join(f'<ellipse cx="{cx + d.rng.uniform(-rx, rx) * 0.7:.1f}" cy="{cy + d.rng.uniform(-ry, 0) * 0.8:.1f}" rx="{d.rng.uniform(2.5, 5):.1f}" ry="{d.rng.uniform(2, 3.5):.1f}" fill="{color}" opacity="0.7"/>' for _ in range(n))


def body_fill(d, color):
    """A body lit like a ball: light at the top left, deep colour at the bottom right"""
    return d.rad([(0, shade(color, 0.42)), (0.45, shade(color, 0.08)), (0.8, color), (1, shade(color, -0.42))], 0.36, 0.3, 0.78)


def shine(cx, cy, rx, ry):
    """The soft glint on a round body"""
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#fff" opacity="0.32"/><ellipse cx="{cx - rx * 0.25:.1f}" cy="{cy - ry * 0.2:.1f}" rx="{rx * 0.35:.1f}" ry="{ry * 0.35:.1f}" fill="#fff" opacity="0.45"/>'


def rim(color):
    return f'stroke="{shade(color, -0.5)}" stroke-width="1.1"'


def bronto(d, x, y, s=1.0, face=1, color=BRONTO, neck=1.0):
    """A long-necked dinosaur standing at (x, y), facing right (face=1) or left (-1)"""
    f = body_fill(d, color)
    belly = shade(color, 0.35)
    far = shade(color, -0.25)
    hx, hy = 58, -92 * neck
    out = [f'<ellipse cx="0" cy="2" rx="46" ry="6" fill="#000" opacity="0.15"/>',
           f'<rect x="-22" y="-26" width="11" height="26" rx="5" fill="{far}"/><rect x="16" y="-26" width="11" height="26" rx="5" fill="{far}"/>',
           f'<path d="M-30 -36 Q-62 -30 -84 -10 Q-60 -18 -28 -20 Z" fill="{f}"/>',
           f'<path d="M22 -46 Q32 {-60 * neck:.0f} {hx - 12} {hy + 6:.0f} L{hx + 2} {hy + 8:.0f} Q46 {-56 * neck:.0f} 36 -30 Z" fill="{f}"/>',
           f'<ellipse cx="0" cy="-34" rx="40" ry="25" fill="{f}" {rim(color)}/>',
           f'<ellipse cx="2" cy="-22" rx="30" ry="11" fill="{belly}" opacity="0.8"/>',
           spots(d, -4, -42, 30, 14, 6, shade(color, -0.3)),
           shine(-12, -48, 16, 6),
           f'<rect x="-28" y="-24" width="13" height="26" rx="6" fill="{f}"/><rect x="10" y="-24" width="13" height="26" rx="6" fill="{f}"/>',
           ''.join(f'<rect x="{lx + k * 3.5}" y="-1" width="2.6" height="3" rx="1" fill="{shade(color, 0.45)}"/>' for lx in (-27, 11) for k in range(3)),
           f'<ellipse cx="{hx}" cy="{hy:.0f}" rx="15" ry="10" fill="{f}"/>',
           f'<ellipse cx="{hx + 9}" cy="{hy + 3:.0f}" rx="8" ry="6" fill="{shade(color, 0.1)}"/>',
           eye(hx + 2, hy - 3, 3.8),
           f'<path d="M{hx + 6} {hy + 4:.0f} q5 4 10 0" stroke="#2c2433" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
           f'<circle cx="{hx + 13}" cy="{hy - 1:.0f}" r="1" fill="#2c2433"/>',
           f'<circle cx="{hx - 2}" cy="{hy + 4:.0f}" r="3" fill="#f2a38f" opacity="0.5"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def rex(d, x, y, s=1.0, face=1, color=REX):
    """A small, round, friendly T-rex standing at (x, y)"""
    f = body_fill(d, color)
    far = shade(color, -0.25)
    out = [f'<ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity="0.15"/>',
           f'<rect x="-12" y="-20" width="11" height="22" rx="5" fill="{far}"/>',
           f'<path d="M-14 -30 Q-44 -22 -54 -4 Q-34 -12 -12 -14 Z" fill="{f}"/>',
           f'<ellipse cx="0" cy="-34" rx="22" ry="28" fill="{f}" {rim(color)}/>',
           f'<ellipse cx="4" cy="-28" rx="14" ry="18" fill="{shade(color, 0.38)}" opacity="0.85"/>',
           ''.join(f'<path d="M{-2 - k} {-34 + k * 7} q6 2 12 0" stroke="{shade(color, 0.1)}" stroke-width="1.2" fill="none"/>' for k in range(3)),
           f'<rect x="2" y="-20" width="12" height="22" rx="6" fill="{f}"/>',
           f'<path d="M16 -40 q10 2 12 9" stroke="{shade(color, -0.1)}" stroke-width="5" stroke-linecap="round" fill="none"/>',
           f'<circle cx="8" cy="-70" r="20" fill="{f}" {rim(color)}/>',
           shine(0, -80, 7, 4),
           f'<ellipse cx="22" cy="-64" rx="14" ry="10" fill="{f}"/>',
           f'<path d="M12 -60 q12 6 22 -2" stroke="#2c2433" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
           eye(12, -76, 5),
           f'<circle cx="30" cy="-68" r="1.2" fill="#2c2433"/>',
           f'<circle cx="4" cy="-62" r="3.4" fill="#f2a38f" opacity="0.55"/>',
           spots(d, -2, -54, 14, 10, 4, shade(color, -0.25)),
           f'<ellipse cx="-2" cy="-82" rx="9" ry="4" fill="#fff" opacity="0.25"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def trike(d, x, y, s=1.0, face=1, color=TRIKE):
    """A friendly triceratops standing at (x, y): a round frill, soft horns"""
    f = body_fill(d, color)
    far = shade(color, -0.25)
    out = [f'<ellipse cx="0" cy="2" rx="42" ry="6" fill="#000" opacity="0.15"/>',
           f'<rect x="-20" y="-22" width="11" height="22" rx="5" fill="{far}"/><rect x="14" y="-22" width="11" height="22" rx="5" fill="{far}"/>',
           f'<path d="M-28 -28 Q-52 -24 -62 -8 Q-44 -14 -26 -16 Z" fill="{f}"/>',
           f'<ellipse cx="0" cy="-28" rx="34" ry="21" fill="{f}" {rim(color)}/>',
           shine(-10, -40, 13, 5),
           f'<ellipse cx="0" cy="-18" rx="24" ry="8" fill="{shade(color, 0.35)}" opacity="0.8"/>',
           spots(d, -6, -34, 24, 10, 5, shade(color, -0.3)),
           f'<rect x="-26" y="-20" width="12" height="22" rx="6" fill="{f}"/><rect x="8" y="-20" width="12" height="22" rx="6" fill="{f}"/>',
           f'<circle cx="34" cy="-44" r="22" fill="{shade(color, 0.12)}"/>',
           ''.join(f'<circle cx="{34 + 22 * math.cos(a):.1f}" cy="{-44 + 22 * math.sin(a):.1f}" r="3.4" fill="{shade(color, 0.3)}"/>' for a in [math.pi * (0.9 + 0.12 * k) for k in range(10)]),
           f'<circle cx="34" cy="-44" r="15" fill="{shade(color, -0.12)}" opacity="0.5"/>',
           f'<ellipse cx="46" cy="-30" rx="16" ry="12" fill="{f}"/>',
           f'<path d="M44 -42 q6 -14 16 -18 q-6 8 -8 18 Z" fill="#fbf3e0" stroke="{shade(color, -0.3)}" stroke-width="0.8"/>',
           f'<path d="M34 -46 q4 -14 14 -18 q-4 8 -6 18 Z" fill="#fbf3e0" stroke="{shade(color, -0.3)}" stroke-width="0.8"/>',
           f'<path d="M58 -32 q6 -4 6 -10 q2 6 -2 12 Z" fill="#fbf3e0"/>',
           eye(46, -36, 3.6),
           f'<path d="M50 -24 q5 3 10 -1" stroke="#2c2433" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
           f'<circle cx="42" cy="-26" r="3" fill="#f2a38f" opacity="0.5"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


STEGO, STEGO_PLATE = '#e3b04f', '#e07a5f'
PTERO = '#ef8fae'
ANKY = '#d08a5e'
PARA = '#6fa8dc'


def stego(d, x, y, s=1.0, face=1, color=STEGO, plate=STEGO_PLATE):
    """A stegosaurus: an arched back with soft round plates, a little head, a tail with blunt tips"""
    f = body_fill(d, color)
    pf = d.lin([(0, shade(plate, 0.3)), (1, shade(plate, -0.25))])
    far = shade(color, -0.25)
    out = [f'<ellipse cx="0" cy="2" rx="44" ry="6" fill="#000" opacity="0.15"/>',
           f'<rect x="-22" y="-20" width="11" height="20" rx="5" fill="{far}"/><rect x="16" y="-20" width="11" height="20" rx="5" fill="{far}"/>']
    for k, (px, py, h) in enumerate(((-26, -40, 12), (-14, -50, 16), (0, -54, 18), (14, -50, 16), (26, -40, 12))):
        out.append(f'<path d="M{px - h * 0.5:.1f} {py + h * 0.5:.1f} Q{px - h * 0.55:.1f} {py - h * 0.4:.1f} {px} {py - h * 0.8:.1f} Q{px + h * 0.55:.1f} {py - h * 0.4:.1f} {px + h * 0.5:.1f} {py + h * 0.5:.1f} Z" fill="{pf}" {rim(plate)}/>')
    out += [f'<path d="M-30 -24 Q-58 -22 -72 -10 Q-52 -12 -28 -12 Z" fill="{f}"/>',
            ''.join(f'<path d="M{tx} {ty} l{-2} -9 l6 6 Z" fill="{shade(plate, 0.15)}"/>' for tx, ty in ((-60, -14), (-68, -10))),
            f'<path d="M-38 -14 Q-40 -46 0 -48 Q40 -46 38 -14 Q0 -4 -38 -14 Z" fill="{f}" {rim(color)}/>',
            f'<ellipse cx="0" cy="-14" rx="28" ry="6" fill="{shade(color, 0.35)}" opacity="0.8"/>',
            spots(d, 0, -30, 26, 10, 5, shade(color, -0.3)),
            shine(-12, -38, 12, 5),
            f'<path d="M30 -26 Q44 -30 50 -20 Q48 -12 36 -14 Z" fill="{f}" {rim(color)}/>',
            eye(42, -22, 2.8),
            f'<path d="M44 -15 q3 2 6 -1" stroke="#2c2433" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
            f'<rect x="-28" y="-18" width="12" height="20" rx="6" fill="{f}"/><rect x="10" y="-18" width="12" height="20" rx="6" fill="{f}"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def ptero(d, x, y, s=1.0, face=1, color=PTERO):
    """A pterosaur gliding in the sky: wide soft wings, a crest, a smile"""
    f = body_fill(d, color)
    wing = d.lin([(0, shade(color, 0.3)), (1, shade(color, -0.25))])
    out = [f'<path d="M-6 -2 Q-30 -26 -58 -18 Q-40 -10 -34 4 Q-20 -4 -6 4 Z" fill="{wing}" {rim(color)}/>',
           f'<path d="M6 -2 Q30 -26 58 -18 Q40 -10 34 4 Q20 -4 6 4 Z" fill="{shade(color, -0.12)}" {rim(color)}/>',
           f'<path d="M-50 -16 Q-40 -12 -36 -2 M-42 -20 Q-30 -12 -24 -2" stroke="{shade(color, -0.35)}" stroke-width="0.9" fill="none"/>',
           f'<ellipse cx="0" cy="0" rx="10" ry="7" fill="{f}" {rim(color)}/>',
           f'<circle cx="8" cy="-8" r="7" fill="{f}" {rim(color)}/>',
           f'<path d="M4 -14 Q-6 -24 -12 -22 Q-4 -16 2 -10 Z" fill="{shade(color, -0.15)}"/>',
           f'<path d="M14 -8 Q24 -6 26 -3 Q20 -2 14 -4 Z" fill="#f6d36b"/>',
           eye(10, -9, 2.2),
           f'<path d="M-4 6 l-2 5 M4 6 l2 5" stroke="{shade(color, -0.3)}" stroke-width="1.6" stroke-linecap="round"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def ankylo(d, x, y, s=1.0, face=1, color=ANKY):
    """An ankylosaurus: low and wide, an armoured dome of round scales, a club at the tail"""
    f = body_fill(d, color)
    far = shade(color, -0.25)
    out = [f'<ellipse cx="0" cy="2" rx="44" ry="6" fill="#000" opacity="0.15"/>',
           f'<rect x="-22" y="-14" width="11" height="14" rx="5" fill="{far}"/><rect x="16" y="-14" width="11" height="14" rx="5" fill="{far}"/>',
           f'<path d="M-30 -14 Q-50 -14 -62 -10" stroke="{f}" stroke-width="8" stroke-linecap="round" fill="none"/>',
           f'<ellipse cx="-66" cy="-10" rx="9" ry="7" fill="{shade(color, -0.1)}" {rim(color)}/>',
           f'<path d="M-40 -10 Q-38 -40 0 -42 Q38 -40 40 -10 Q0 -2 -40 -10 Z" fill="{f}" {rim(color)}/>']
    for row, (yy, n, r) in enumerate(((-34, 5, 4.2), (-25, 7, 4.6), (-15, 8, 4))):
        for k in range(n):
            xx = -30 + 60 * (k + 0.5) / n
            out.append(f'<circle cx="{xx:.1f}" cy="{yy}" r="{r}" fill="{shade(color, 0.12 - row * 0.06)}" stroke="{shade(color, -0.4)}" stroke-width="0.8"/>')
    out += [shine(-12, -34, 12, 4),
            f'<ellipse cx="40" cy="-14" rx="12" ry="9" fill="{f}" {rim(color)}/>',
            eye(42, -17, 2.8),
            f'<path d="M44 -9 q4 2 8 -1" stroke="#2c2433" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
            f'<rect x="-28" y="-12" width="12" height="14" rx="6" fill="{f}"/><rect x="10" y="-12" width="12" height="14" rx="6" fill="{f}"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def para(d, x, y, s=1.0, face=1, color=PARA):
    """A parasaurolophus standing on its hind legs, a long crest curving back from its head"""
    f = body_fill(d, color)
    far = shade(color, -0.25)
    out = [f'<ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity="0.15"/>',
           f'<rect x="-12" y="-22" width="11" height="24" rx="5" fill="{far}"/>',
           f'<path d="M-14 -30 Q-46 -26 -58 -8 Q-36 -14 -12 -16 Z" fill="{f}"/>',
           f'<ellipse cx="0" cy="-36" rx="20" ry="26" fill="{f}" {rim(color)}/>',
           f'<ellipse cx="5" cy="-30" rx="12" ry="16" fill="{shade(color, 0.35)}" opacity="0.8"/>',
           shine(-6, -48, 7, 5),
           f'<path d="M8 -56 Q14 -70 20 -76 L28 -72 Q20 -64 18 -54 Z" fill="{f}"/>',
           f'<ellipse cx="26" cy="-78" rx="12" ry="8" fill="{f}" {rim(color)}/>',
           f'<path d="M22 -84 Q8 -98 -10 -100 Q2 -92 18 -78 Z" fill="{shade(color, -0.2)}" {rim(color)}/>',
           f'<ellipse cx="36" cy="-76" rx="6" ry="4" fill="{shade(color, 0.15)}"/>',
           eye(26, -81, 2.8),
           f'<path d="M30 -73 q4 2 8 -1" stroke="#2c2433" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
           f'<path d="M14 -40 q10 4 12 12" stroke="{shade(color, -0.1)}" stroke-width="5" stroke-linecap="round" fill="none"/>',
           f'<rect x="2" y="-22" width="12" height="24" rx="6" fill="{f}"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def hatchling(d, x, y, s=1.0, color=REX):
    """A baby dinosaur looking out of its cracked egg"""
    f = body_fill(d, color)
    shell = d.rad([(0, '#fffaf0'), (1, '#d8cdb4')], 0.35, 0.3, 0.8)
    out = [f'<ellipse cx="0" cy="2" rx="14" ry="3" fill="#000" opacity="0.15"/>',
           f'<circle cx="0" cy="-22" r="10" fill="{f}" {rim(color)}/>',
           eye(-3, -24, 2.4, 0.1), eye(4, -24, 2.4, 0.1),
           f'<path d="M-3 -18 q3 3 6 0" stroke="#2c2433" stroke-width="1" fill="none" stroke-linecap="round"/>',
           f'<path d="M-6 -33 l3 -5 l3 5 Z" fill="#fffaf0" stroke="#bfb39a" stroke-width="0.6"/>',
           f'<path d="M-13 -12 L-9 -17 L-5 -12 L0 -17 L5 -12 L9 -17 L13 -12 C13 0 -13 0 -13 -12 Z" fill="{shell}" stroke="#bfb39a" stroke-width="0.8"/>',
           ''.join(f'<ellipse cx="{dx}" cy="{dy}" rx="1.4" ry="1" fill="#a9c08a"/>' for dx, dy in ((-6, -6), (4, -4), (8, -9)))]
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def egg(d, cx, cy, s=1.0, color='#f4ecd8', speckle='#a9c08a'):
    g = d.rad([(0, shade(color, 0.4)), (0.6, color), (1, shade(color, -0.28))], 0.38, 0.3, 0.75)
    sp = ''.join(f'<ellipse cx="{cx + d.rng.uniform(-6, 6) * s:.1f}" cy="{cy + d.rng.uniform(-9, 7) * s:.1f}" rx="{d.rng.uniform(1, 2.2) * s:.1f}" ry="{d.rng.uniform(0.8, 1.6) * s:.1f}" fill="{speckle}"/>' for _ in range(7))
    return f'<path d="M{cx} {cy - 13 * s} C{cx + 10 * s} {cy - 13 * s} {cx + 10 * s} {cy + 10 * s} {cx} {cy + 10 * s} C{cx - 10 * s} {cy + 10 * s} {cx - 10 * s} {cy - 13 * s} {cx} {cy - 13 * s} Z" fill="{g}"/>' + sp


def nest(d, cx, cy, w):
    out = [f'<ellipse cx="{cx}" cy="{cy}" rx="{w / 2}" ry="{w * 0.16:.1f}" fill="#7a5532"/>']
    for i in range(int(w / 3)):
        x = cx - w / 2 + i * 3 + d.rng.uniform(-1, 1)
        out.append(f'<path d="M{x:.1f} {cy + d.rng.uniform(-3, 4):.1f} q{d.rng.uniform(4, 9):.1f} {d.rng.uniform(-6, -2):.1f} {d.rng.uniform(10, 16):.1f} 0" stroke="{d.rng.choice(["#a07848", "#c39a5f", "#8b6439"])}" stroke-width="1.4" fill="none"/>')
    return '\n'.join(out)


def footprint(cx, cy, s, color):
    """The reserve's sign: a three-toed footprint"""
    return (f'<ellipse cx="{cx}" cy="{cy + 3 * s}" rx="{5 * s}" ry="{6 * s}" fill="{color}"/>'
            + ''.join(f'<ellipse cx="{cx + dx * s}" cy="{cy - 6 * s + abs(dx) * 0.3 * s}" rx="{1.9 * s}" ry="{4.2 * s}" fill="{color}" transform="rotate({dx * 6} {cx + dx * s} {cy - 6 * s})"/>' for dx in (-5, 0, 5)))


def signboard(d, x, y, w, h, posts=True):
    out = []
    if posts:
        out.append(post(d, x + w * 0.12, y + h * 0.5, 5, h * 1.6))
        out.append(post(d, x + w * 0.82, y + h * 0.5, 5, h * 1.6))
    g = d.lin([(0, shade(LOG, 0.35)), (1, shade(LOG, -0.1))])
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{g}" stroke="{shade(LOG, -0.45)}" stroke-width="1.4"/>')
    out.append(f'<line x1="{x + 2}" y1="{y + h / 2}" x2="{x + w - 2}" y2="{y + h / 2}" stroke="{shade(LOG, -0.3)}" stroke-width="0.8"/>')
    out.append(footprint(x + w / 2, y + h / 2, h / 28, shade(LOG, -0.5)))
    return '\n'.join(out)


def tent(d, cx, base, w, h, color=CANVAS, stripe=None, door=True):
    """A canvas tent seen at an angle: its front, its side, the flaps open"""
    x0, x1, top = cx - w / 2, cx + w / 2, base - h
    side = d.lin([(0, shade(color, -0.12)), (1, shade(color, -0.32))], 0, 0, 1, 0)
    front = d.lin([(0, shade(color, 0.12)), (1, shade(color, -0.08))], 0, 0, 1, 0)
    out = [f'<polygon points="{cx},{top} {cx + w * 0.42},{top - h * 0.12} {x1 + w * 0.42},{base - h * 0.12} {x1},{base}" fill="{side}"/>',
           f'<polygon points="{x0},{base} {cx},{top} {x1},{base}" fill="{front}"/>']
    if stripe:
        out.append(f'<path d="M{x0 + w * 0.06} {base - h * 0.12} L{x1 - w * 0.06} {base - h * 0.12} L{x1 - w * 0.02} {base - h * 0.02} L{x0 + w * 0.02} {base - h * 0.02} Z" fill="{stripe}"/>')
    if door:
        out.append(f'<path d="M{cx} {top + h * 0.3} Q{cx - w * 0.14} {base - h * 0.3} {cx - w * 0.2} {base} L{cx + w * 0.2} {base} Q{cx + w * 0.14} {base - h * 0.3} {cx} {top + h * 0.3} Z" fill="#3b3346"/>')
        out.append(f'<path d="M{cx} {top + h * 0.3} Q{cx - w * 0.2} {base - h * 0.35} {cx - w * 0.3} {base} L{cx - w * 0.2} {base} Q{cx - w * 0.14} {base - h * 0.3} {cx} {top + h * 0.3} Z" fill="{shade(color, 0.05)}"/>')
        out.append(f'<path d="M{cx} {top + h * 0.3} Q{cx + w * 0.2} {base - h * 0.35} {cx + w * 0.3} {base} L{cx + w * 0.2} {base} Q{cx + w * 0.14} {base - h * 0.3} {cx} {top + h * 0.3} Z" fill="{shade(color, -0.1)}"/>')
    out.append(f'<line x1="{cx}" y1="{top}" x2="{cx + w * 0.42}" y2="{top - h * 0.12}" stroke="{shade(color, -0.45)}" stroke-width="2"/>')
    for (ax, ay), (bx, by) in (((x0 + w * 0.1, base - h * 0.15), (x0 - w * 0.2, base + 2)), ((x1 + w * 0.3, base - h * 0.2), (x1 + w * 0.55, base + 2))):
        out.append(f'<line x1="{ax}" y1="{ay}" x2="{bx}" y2="{by}" stroke="#8a7c66" stroke-width="1"/><rect x="{bx - 1.5}" y="{by - 4}" width="3" height="6" fill="{LOG}"/>')
    return '\n'.join(out)


def campfire(d, x, y, s=1.0):
    glow = d.rad([(0, '#ffcf7a', 0.55), (1, '#ffcf7a', 0)])
    out = [f'<ellipse cx="{x}" cy="{y - 8 * s}" rx="{34 * s}" ry="{26 * s}" fill="{glow}"/>']
    for k in range(8):
        a = math.pi * k / 4
        out.append(rock(d, x + 16 * s * math.cos(a), y + 5 * s * math.sin(a), 9 * s, 6 * s, '#9c9084'))
    out.append(f'<rect x="{x - 14 * s}" y="{y - 4 * s}" width="{28 * s}" height="{5 * s}" rx="2" fill="{LOG}" transform="rotate(18 {x} {y})"/>')
    out.append(f'<rect x="{x - 14 * s}" y="{y - 4 * s}" width="{28 * s}" height="{5 * s}" rx="2" fill="{shade(LOG, -0.15)}" transform="rotate(-18 {x} {y})"/>')
    out.append(f'<path d="M{x - 9 * s} {y - 2 * s} Q{x - 10 * s} {y - 14 * s} {x - 2 * s} {y - 24 * s} Q{x} {y - 14 * s} {x + 4 * s} {y - 20 * s} Q{x + 11 * s} {y - 10 * s} {x + 9 * s} {y - 2 * s} Z" fill="#f39a45"/>')
    out.append(f'<path d="M{x - 5 * s} {y - 2 * s} Q{x - 5 * s} {y - 10 * s} {x} {y - 16 * s} Q{x + 6 * s} {y - 8 * s} {x + 5 * s} {y - 2 * s} Z" fill="#ffd77a"/>')
    return '\n'.join(out)


def jeep(d, x, y, s=1.0, face=1):
    """The reserve's jeep, standing at (x, y): stripes, a canvas top, a spare wheel"""
    body = d.lin([(0, shade(KHAKI, 0.25)), (1, shade(KHAKI, -0.3))])
    out = [f'<ellipse cx="0" cy="2" rx="62" ry="6" fill="#000" opacity="0.18"/>',
           f'<path d="M-56 -14 L-56 -38 Q-56 -44 -50 -44 L18 -44 L34 -30 L56 -28 Q62 -27 62 -20 L62 -14 Z" fill="{body}"/>',
           f'<rect x="-56" y="-30" width="118" height="6" fill="{shade(LEAF, -0.1)}"/>',
           f'<path d="M-50 -44 L-50 -66 Q-50 -70 -46 -70 L12 -70 Q16 -70 16 -66 L16 -44 Z" fill="{CANVAS}" stroke="{shade(CANVAS, -0.35)}" stroke-width="1.4"/>',
           f'<path d="M-44 -64 h20 v16 h-20 Z M-18 -64 h28 v16 h-28 Z" fill="#a9d3e6" stroke="{shade(CANVAS, -0.4)}" stroke-width="1.2"/>',
           f'<path d="M18 -44 L28 -60 L32 -58 L24 -44 Z" fill="#a9d3e6" stroke="#5a5266" stroke-width="1.2"/>',
           f'<rect x="54" y="-24" width="8" height="5" rx="2" fill="#ffd98a"/>',
           f'<rect x="-64" y="-38" width="10" height="22" rx="4" fill="#3b3346"/>',
           footprint(-18, -36, 0.5, shade(KHAKI, -0.45))]
    for wx in (-34, 36):
        out.append(f'<circle cx="{wx}" cy="-10" r="13" fill="#3b3346"/><circle cx="{wx}" cy="-10" r="7" fill="#9aa0ad"/><circle cx="{wx}" cy="-10" r="2.5" fill="#5b5f6b"/>')
    out.append(f'<circle cx="-62" cy="-30" r="10" fill="#3b3346"/><circle cx="-62" cy="-30" r="5" fill="#9aa0ad"/>')
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def explorer(d, x, y, s=1.0, wave=False):
    """A friendly explorer (the reserve's guide), standing at (x, y): hat, vest, a smile"""
    vest = d.lin([(0, shade(KHAKI, 0.2)), (1, shade(KHAKI, -0.25))], 0, 0, 1, 0)
    out = [f'<path d="M-24 0 Q-26 -44 0 -50 Q26 -44 24 0 Z" fill="#6f9ac6"/>',
           f'<path d="M-24 0 Q-26 -44 -6 -49 L-8 0 Z M24 0 Q26 -44 6 -49 L8 0 Z" fill="{vest}"/>',
           f'<rect x="-18" y="-30" width="9" height="7" rx="1.5" fill="{shade(KHAKI, -0.2)}"/><rect x="9" y="-30" width="9" height="7" rx="1.5" fill="{shade(KHAKI, -0.2)}"/>',
           f'<rect x="-4" y="-58" width="8" height="10" fill="{SKIN}"/>',
           f'<circle cx="0" cy="-70" r="16" fill="{SKIN}"/>',
           f'<circle cx="-6" cy="-70" r="2.4" fill="#2c2433"/><circle cx="6" cy="-70" r="2.4" fill="#2c2433"/>',
           f'<circle cx="-5.4" cy="-70.8" r="0.8" fill="#fff"/><circle cx="6.6" cy="-70.8" r="0.8" fill="#fff"/>',
           f'<path d="M-6 -63 q6 5 12 0" stroke="#2c2433" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
           f'<circle cx="-10" cy="-65" r="3" fill="#f2a38f" opacity="0.5"/><circle cx="10" cy="-65" r="3" fill="#f2a38f" opacity="0.5"/>',
           f'<path d="M-14 -76 Q-12 -92 0 -92 Q12 -92 14 -76 Z" fill="{KHAKI}"/>',
           f'<ellipse cx="0" cy="-76" rx="24" ry="5" fill="{shade(KHAKI, -0.15)}"/>',
           f'<rect x="-13" y="-81" width="26" height="4" fill="{shade(LEAF, -0.1)}"/>']
    if wave:
        out.append(f'<path d="M20 -40 Q34 -54 32 -72" stroke="#6f9ac6" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="32" cy="-75" r="5.5" fill="{SKIN}"/>')
    else:
        out.append(f'<path d="M20 -40 Q30 -26 18 -18" stroke="#6f9ac6" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="16" cy="-17" r="5" fill="{SKIN}"/>')
    out.append(f'<path d="M-20 -40 Q-30 -26 -18 -18" stroke="#6f9ac6" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="-16" cy="-17" r="5" fill="{SKIN}"/>')
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def microscope(d, x, y, s=1.0):
    metal = d.lin([(0, '#f1f3f7'), (0.5, '#b9bfcc'), (1, '#7d8394')], 0, 0, 1, 0)
    dark = d.lin([(0, '#6c7180'), (1, '#3d404b')], 0, 0, 1, 0)
    return (f'<g transform="translate({x} {y}) scale({s})">'
            f'<ellipse cx="0" cy="-2" rx="20" ry="5" fill="{dark}"/><rect x="-18" y="-7" width="36" height="6" rx="3" fill="{dark}"/>'
            f'<path d="M6 -6 Q20 -26 10 -50 L4 -48 Q12 -28 0 -8 Z" fill="{dark}"/>'
            f'<rect x="-16" y="-24" width="26" height="4" rx="1.5" fill="#4e5260"/><rect x="-10" y="-26" width="12" height="2" fill="#e9f3f8"/>'
            f'<rect x="-6" y="-58" width="10" height="28" rx="3" fill="{metal}"/>'
            f'<rect x="-5" y="-32" width="8" height="6" rx="1" fill="#4e5260"/>'
            f'<rect x="-4" y="-68" width="6" height="12" rx="2" fill="{dark}"/><ellipse cx="-1" cy="-68" rx="4" ry="1.6" fill="#a9d3e6"/>'
            f'<circle cx="12" cy="-34" r="4" fill="#4e5260"/><circle cx="12" cy="-34" r="1.6" fill="#9aa0ad"/></g>')


def bone(cx, cy, w, ang=0, color='#f3ead6'):
    return (f'<g transform="rotate({ang} {cx} {cy})"><rect x="{cx - w / 2}" y="{cy - w * 0.08:.1f}" width="{w}" height="{w * 0.16:.1f}" rx="{w * 0.08:.1f}" fill="{color}" stroke="{shade(color, -0.3)}" stroke-width="0.8"/>'
            + ''.join(f'<circle cx="{cx + sx * w / 2:.1f}" cy="{cy + sy * w * 0.1:.1f}" r="{w * 0.12:.1f}" fill="{color}" stroke="{shade(color, -0.3)}" stroke-width="0.8"/>' for sx in (-1, 1) for sy in (-1, 1))
            + '</g>')


def hourglass(d, x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-12" y="-4" width="24" height="4" rx="1.5" fill="{LOG}"/><rect x="-12" y="-44" width="24" height="4" rx="1.5" fill="{LOG}"/>'
            f'<rect x="-10" y="-40" width="2.5" height="36" fill="{shade(LOG, -0.2)}"/><rect x="7.5" y="-40" width="2.5" height="36" fill="{shade(LOG, -0.2)}"/>'
            f'<path d="M-7 -40 L7 -40 L1 -22 L7 -4 L-7 -4 L-1 -22 Z" fill="#e7f3fa" opacity="0.85" stroke="#9fb9c9" stroke-width="0.8"/>'
            f'<path d="M-4 -34 L4 -34 L0.6 -24 L-0.6 -24 Z M-6 -5 L6 -5 L0 -14 Z" fill="{SAND}"/></g>')


def binoculars(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-12" y="-10" width="10" height="16" rx="4" fill="#3b3346"/><rect x="2" y="-10" width="10" height="16" rx="4" fill="#3b3346"/>'
            f'<rect x="-4" y="-6" width="8" height="6" fill="#5b5f6b"/><circle cx="-7" cy="6" r="4" fill="#a9d3e6"/><circle cx="7" cy="6" r="4" fill="#a9d3e6"/></g>')


def kit(d, x, y, w, h):
    """The first-aid box, with the reserve's leaf on it (not a red cross)"""
    g = d.lin([(0, '#ffffff'), (1, '#dfe6ea')])
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{g}" stroke="#8aa3b0" stroke-width="1.2"/>'
            f'<rect x="{x + w * 0.35}" y="{y - 4}" width="{w * 0.3}" height="5" rx="2" fill="#8aa3b0"/>'
            + leaf(x + w / 2, y + h / 2, h / 26, LEAF_D))


def radio(d, x, y, s=1.0):
    g = d.lin([(0, '#8d6f4f'), (1, '#5f4630')])
    return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-30" y="-36" width="60" height="36" rx="5" fill="{g}"/>'
            f'<rect x="-24" y="-30" width="26" height="14" rx="2" fill="#e8d9a8"/><line x1="-20" y1="-23" x2="-2" y2="-23" stroke="#c4553f" stroke-width="1.4"/>'
            f'<circle cx="14" cy="-24" r="7" fill="#3b3346"/><circle cx="14" cy="-24" r="3" fill="#9aa0ad"/>'
            + ''.join(f'<circle cx="{-20 + k * 8}" cy="-8" r="2.4" fill="#e8d9a8"/>' for k in range(4))
            + f'<line x1="22" y1="-36" x2="34" y2="-74" stroke="#5b5f6b" stroke-width="2"/><circle cx="34" cy="-75" r="2.5" fill="#c4553f"/></g>')


def lamp(d, x, y, s=1.0):
    return lantern(d, x, y, s)


# ---------- the stations on the map (300×220) ----------
def draw_gate(d):
    # the gate of the reserve: two log towers, a palisade on each side, the beam with the footprint sign,
    # the open way in, a ticket hut, a long neck looking over the fence
    d.add(contact(d, 150, 182, 230))
    d.add(bronto(d, 236, 158, 0.6, -1, BRONTO, 1.15))
    d.add(para(d, 36, 140, 0.48, 1))
    d.add(palisade(d, 24, 182, 64, 70, 11))
    d.add(palisade(d, 210, 182, 50, 64, 11))
    # the way in: the path runs through the gate and on into the reserve
    d.add(f'<path d="M112 196 Q132 178 140 160 L160 160 Q170 178 192 196 Z" fill="{SAND}"/>')
    d.add(fern(d, 132, 150, 0.8))
    for x in (96, 178):
        d.add(post(d, x, 74, 26, 108))
        d.add(post(d, x - 4, 68, 34, 10))
        d.add(thatch(d, x - 8, x + 34, 68, 22))
        d.add(f'<rect x="{x + 8}" y="96" width="10" height="12" rx="2" fill="#3b3346"/>')
    d.add(log(d, 92, 84, 116, 14))
    d.add(signboard(d, 120, 100, 60, 22, posts=False))
    d.add(f'<line x1="130" y1="102" x2="130" y2="92" stroke="#6b5a4a" stroke-width="1.4"/><line x1="170" y1="102" x2="170" y2="92" stroke="#6b5a4a" stroke-width="1.4"/>')
    d.add(ivy(d, [(100, 182), (104, 150), (98, 120), (106, 96)], 1.0))
    d.add(fern(d, 40, 186, 1.1))
    d.add(f'<rect x="236" y="148" width="38" height="34" fill="{LOG}"/>')
    d.add(log_wall(d, 236, 148, 38, 34, 3))
    d.add(thatch(d, 230, 280, 150, 20))
    d.add(f'<rect x="244" y="156" width="22" height="12" rx="2" fill="#ffd98a" stroke="{shade(LOG, -0.4)}" stroke-width="2"/>')
    d.add(''.join(f'<circle cx="{249 + k * 6}" cy="174" r="2.6" fill="none" stroke="{c}" stroke-width="1.8"/>' for k, c in enumerate(('#ef9f55', '#5fae9a', '#9b88d0'))))
    d.add(ptero(d, 238, 40, 0.55, -1))
    d.add(hatchling(d, 214, 186, 0.7, TRIKE))


def draw_path(d):
    # the path into the reserve: a winding dirt trail between ferns, a log bench, a little one peeking out
    path = 'M60 196 Q120 186 140 176 Q164 166 230 164 L250 168 Q190 176 170 184 Q150 194 110 202 Z'
    d.add(f'<path d="{path}" fill="{SAND}"/><path d="{path}" fill="none" stroke="{shade(SAND, -0.2)}" stroke-width="1.4"/>')
    d.add(pebbles(d, 110, 220, 168, 192, 8))
    d.add(palm(d, 238, 168, 1.05, -0.35))
    d.add(palm(d, 64, 172, 0.85, 0.3, 6))
    d.add(bronto(d, 200, 156, 0.42, -1, BRONTO, 0.85))
    d.add(fern(d, 184, 166, 1.2))
    d.add(fern(d, 214, 172, 1.0))
    d.add(fern(d, 96, 180, 0.9))
    d.add(log(d, 116, 150, 64, 12))
    d.add(post(d, 124, 160, 8, 18))
    d.add(post(d, 164, 160, 8, 18))
    d.add(signboard(d, 30, 138, 34, 18))
    d.add(ankylo(d, 150, 196, 0.6, 1))
    d.add(ptero(d, 110, 50, 0.5, 1))


def draw_ranger(d):
    # the reserve ranger's hut on short stilts: logs, a thatched roof, binoculars on the rail, the first-aid box
    d.add(contact(d, 150, 182, 200))
    for x in (78, 112, 188, 222):
        d.add(post(d, x, 138, 8, 44))
    d.add(f'<rect x="70" y="132" width="170" height="8" rx="3" fill="{shade(LOG, -0.15)}"/>')
    d.add(side_face(d, 226, 82, 52, 16, 8, LOG, 10))
    d.add(log_wall(d, 84, 82, 142, 52, 5))
    d.add(thatch(d, 72, 238, 86, 48))
    d.add(roof_side(d, 155, 38, 244, 90, 16, 8, STRAW))
    d.add(thatch(d, 72, 238, 86, 48))
    d.add(f'<rect x="102" y="96" width="34" height="24" rx="3" fill="#ffd98a" stroke="{shade(LOG, -0.4)}" stroke-width="3"/>')
    d.add(f'<line x1="119" y1="96" x2="119" y2="120" stroke="{shade(LOG, -0.4)}" stroke-width="2"/>')
    d.add(plank_door(d, 158, 94, 30, 40, LOG, arch=False))
    d.add(f'<rect x="64" y="122" width="184" height="5" rx="2" fill="{LOG}"/>' + ''.join(f'<rect x="{x}" y="122" width="4" height="12" fill="{shade(LOG, -0.2)}"/>' for x in range(68, 246, 20)))
    d.add(binoculars(206, 118, 0.9))
    d.add(kit(d, 238, 162, 28, 20))
    d.add(flag(d, 155, 6, LEAF, 18))
    d.add(fern(d, 46, 182, 1.0))
    d.add(trike(d, 58, 190, 0.52, 1))
    d.add(ptero(d, 250, 34, 0.5, -1))


def draw_camp(d):
    # the waiting camp: two tents, a fire in the middle, logs to sit on, a palm
    d.add(palm(d, 250, 170, 0.95, -0.3))
    d.add(tent(d, 96, 170, 92, 74, CANVAS, shade(LEAF, -0.05)))
    d.add(tent(d, 196, 160, 74, 60, '#e9d3a8', '#c4553f'))
    d.add(campfire(d, 150, 186, 0.9))
    d.add(log(d, 98, 186, 34, 10))
    d.add(log(d, 172, 188, 34, 10))
    d.add(stego(d, 236, 150, 0.5, -1))
    d.add(lantern(d, 56, 158, 0.6))
    d.add(f'<line x1="56" y1="166" x2="56" y2="186" stroke="#4e4a52" stroke-width="2.2"/>')
    d.add(rex(d, 116, 196, 0.42, 1))
    d.add(hatchling(d, 196, 196, 0.7, PARA))
    d.add(fern(d, 262, 186, 0.9))


def draw_guide(d):
    # the chief guide's lodge: a big log cabin with a thatched roof, the reserve's flag, a long neck looking over it
    d.add(contact(d, 140, 182, 220))
    d.add(side_face(d, 214, 104, 78, 18, 9, LOG, 11))
    d.add(log_wall(d, 74, 104, 140, 78, 7))
    d.add(roof_side(d, 144, 52, 226, 108, 18, 9, STRAW))
    d.add(thatch(d, 62, 226, 108, 56))
    d.add(f'<rect x="88" y="120" width="30" height="24" rx="3" fill="#ffd98a" stroke="{shade(LOG, -0.4)}" stroke-width="3"/><line x1="103" y1="120" x2="103" y2="144" stroke="{shade(LOG, -0.4)}" stroke-width="2"/>')
    d.add(f'<rect x="170" y="120" width="30" height="24" rx="3" fill="#ffd98a" stroke="{shade(LOG, -0.4)}" stroke-width="3"/><line x1="185" y1="120" x2="185" y2="144" stroke="{shade(LOG, -0.4)}" stroke-width="2"/>')
    d.add(plank_door(d, 128, 134, 32, 48, shade(LOG, -0.1), arch=False))
    d.add(signboard(d, 120, 108, 48, 20, posts=False))
    d.add(flag(d, 144, 2, LEAF, 22, 24))
    d.add(fern(d, 54, 182, 1.1))
    d.add(lantern(d, 124, 150, 0.45))
    d.add(bronto(d, 256, 184, 0.72, -1, BRONTO, 1.2))
    d.add(para(d, 40, 192, 0.5, 1))
    d.add(ptero(d, 70, 40, 0.5, 1))


def draw_lab(d):
    # the findings lab: a canopy over a table with the microscope, a fossil, jars
    for x in (62, 238):
        d.add(post(d, x - 4, 84, 8, 98))
    d.add(cone(d, 150, 88, 206, 50, '#e9d3a8', 4))
    sc = ''.join(f'Q{47 + i * 25.75 + 12.9:.1f} 104 {47 + (i + 1) * 25.75:.1f} 88 ' for i in range(8))
    d.add(f'<path d="M47 88 {sc} Z" fill="{shade(LEAF, 0.05)}"/>')
    d.add(flag(d, 150, 12, '#ef9f55', 18))
    top = d.lin([(0, shade(LOG, 0.3)), (1, LOG)])
    d.add(f'<rect x="76" y="140" width="148" height="10" rx="3" fill="{top}"/><rect x="84" y="150" width="8" height="32" fill="{shade(LOG, -0.3)}"/><rect x="208" y="150" width="8" height="32" fill="{shade(LOG, -0.3)}"/>')
    d.add(microscope(d, 112, 140, 0.9))
    d.add(bone(160, 134, 26, -12))
    d.add(f'<path d="M180 140 q10 -18 24 -8 q-4 10 -24 8 Z" fill="#e4d6b8" stroke="#a08c6a" stroke-width="1"/>')
    d.add(''.join(f'<path d="M{186 + k * 5} 136 q2 -4 4 -2" stroke="#a08c6a" stroke-width="1" fill="none"/>' for k in range(3)))
    d.add(''.join(f'<rect x="{196 + k * 9}" y="{122 + (k % 2) * 3}" width="7" height="{18 - (k % 2) * 3}" rx="2" fill="{c}"/>' for k, c in enumerate(('#b9d7ee', '#c8e2b4', '#f3c58d'))))
    d.add(hatchling(d, 140, 184, 0.8, REX))
    d.add(ankylo(d, 234, 196, 0.42, -1))
    d.add(ptero(d, 250, 36, 0.45, -1))
    d.add(fern(d, 254, 182, 0.9))


def draw_medic(d):
    # the treatment station: a white tent with the leaf, a cot, the first-aid box
    d.add(contact(d, 150, 182, 200))
    d.add(tent(d, 130, 180, 130, 104, '#f6f3ea', None))
    d.add(banner(d, 76, 110, 22, 32, '#ffffff', 'leaf'))
    d.add(kit(d, 212, 160, 30, 22))
    d.add(f'<rect x="200" y="148" width="50" height="7" rx="3" fill="{LOG}"/>')
    d.add(f'<rect x="190" y="182" width="0" height="0"/>')
    d.add(flag(d, 130, 54, LEAF, 22))
    d.add(fern(d, 262, 184, 0.9))
    d.add(palm(d, 46, 176, 0.8, 0.25, 6))
    d.add(stego(d, 226, 198, 0.45, -1))
    d.add(f'<rect x="232" y="186" width="9" height="5" rx="2" fill="#fff" stroke="{LEAF}" stroke-width="1"/>')
    d.add(trike(d, 70, 196, 0.4, 1))


def draw_expert(d):
    # the field expert's radio tower: a wooden lookout with an antenna, the radio below
    d.add(contact(d, 150, 182, 160))
    for x, ang in ((112, 6), (180, -6)):
        d.add(f'<g transform="rotate({ang} {x} 182)">' + post(d, x, 70, 8, 112) + '</g>')
    for y in (150, 120, 90):
        d.add(f'<line x1="{116 - (182 - y) * 0.1:.0f}" y1="{y}" x2="{184 + (182 - y) * 0.1:.0f}" y2="{y - 22}" stroke="{shade(LOG, -0.2)}" stroke-width="3"/>')
        d.add(f'<line x1="{184 + (182 - y) * 0.1:.0f}" y1="{y}" x2="{116 - (182 - y) * 0.1:.0f}" y2="{y - 22}" stroke="{shade(LOG, -0.2)}" stroke-width="3"/>')
    d.add(f'<rect x="96" y="62" width="108" height="10" rx="3" fill="{LOG}"/>')
    d.add(log_wall(d, 104, 40, 92, 24, 2))
    d.add(thatch(d, 96, 204, 42, 28))
    d.add(f'<line x1="150" y1="16" x2="150" y2="-4" stroke="#5b5f6b" stroke-width="2.5"/><circle cx="150" cy="-4" r="3" fill="#c4553f"/>')
    d.add(f'<path d="M140 6 q10 -8 20 0 M136 0 q14 -12 28 0" stroke="#fff" stroke-width="1.6" fill="none" opacity="0.8"/>')
    d.add(radio(d, 232, 182, 0.6))
    d.add(f'<rect x="210" y="160" width="0" height="0"/>')
    d.add(rex(d, 70, 182, 0.5, 1))
    d.add(bronto(d, 238, 150, 0.5, -1, BRONTO, 1.1))
    d.add(ptero(d, 196, 22, 0.45, -1))
    d.add(fern(d, 268, 186, 0.8))


def draw_results(d):
    # waiting for the samples: a nest of eggs, an hourglass on a stump, a magnifying glass
    d.add(palm(d, 236, 170, 0.95, -0.3))
    d.add(nest(d, 130, 176, 96))
    d.add(para(d, 70, 176, 0.58, 1))
    for x, y, c in ((108, 164, '#f4ecd8'), (154, 166, '#f6e6d2')):
        d.add(egg(d, x, y, 1.2, c))
    d.add(hatchling(d, 132, 178, 1.1, PARA))
    d.add(post(d, 196, 154, 28, 28))
    d.add(hourglass(d, 210, 156, 0.8))
    d.add(f'<circle cx="74" cy="170" r="11" fill="#d9eef7" opacity="0.7" stroke="#5b5f6b" stroke-width="3"/><line x1="66" y1="178" x2="56" y2="188" stroke="{LOG}" stroke-width="5" stroke-linecap="round"/>')
    d.add(fern(d, 262, 186, 0.9))
    d.add(ankylo(d, 220, 200, 0.4, -1))


def draw_home(d):
    # going home: the jeep ready to go, the reserve's sign, a triceratops saying goodbye
    d.add(signboard(d, 34, 134, 40, 20))
    d.add(bronto(d, 250, 160, 0.5, -1, BRONTO, 1.1))
    d.add(trike(d, 210, 172, 0.75, -1))
    d.add(jeep(d, 126, 184, 1.0, -1))
    d.add(stego(d, 60, 196, 0.4, 1))
    d.add(ptero(d, 200, 40, 0.5, -1))
    d.add(f'<rect x="96" y="104" width="22" height="16" rx="3" fill="#c4553f"/><rect x="120" y="106" width="18" height="14" rx="3" fill="#5fae9a"/>')
    d.add(flag(d, 98, 78, LEAF, 26))
    d.add(fern(d, 268, 186, 0.9))


STATIONS = {
    'gate': (draw_gate, 'the entrance to the reserve (reception)'),
    'path': (draw_path, 'the entrance path (waiting before the checks)'),
    'ranger': (draw_ranger, "the reserve ranger's hut (the checks)"),
    'camp': (draw_camp, 'the waiting camp (waiting for the doctor)'),
    'guide': (draw_guide, "the chief guide's lodge (the doctor)"),
    'lab': (draw_lab, 'the findings lab (tests)'),
    'medic': (draw_medic, 'the treatment station (treatment)'),
    'expert': (draw_expert, "the field expert's radio tower (consultation)"),
    'results': (draw_results, "waiting for the samples' results"),
    'home': (draw_home, 'going home from the journey (the end)'),
}


# ---------- the scenes: each place as seen by someone standing in it (364×340) ----------
def jungle_back(d, horizon=200):
    """The valley behind a scene: sky, far hills with a quiet volcano, the jungle's edge"""
    d.add(sky(d, SH, D_SKY0, D_SKY1))
    d.add(cloud(70, 50, 0.7), cloud(300, 70, 0.6))
    d.add(band(SW, SH, horizon - 40, 8, 0.4, '#9bb7a6'))
    d.add(f'<path d="M250 {horizon - 34} L286 {horizon - 86} L300 {horizon - 86} L340 {horizon - 30} Z" fill="#8fa89a"/><path d="M286 {horizon - 86} L300 {horizon - 86} L296 {horizon - 74} L290 {horizon - 74} Z" fill="#6f8a7a"/>')
    d.add(f'<circle cx="293" cy="{horizon - 98}" r="8" fill="#fff" opacity="0.6"/><circle cx="303" cy="{horizon - 112}" r="10" fill="#fff" opacity="0.45"/>')
    d.add(canopy(d, SW, horizon - 2, 1.0))
    d.add(band(SW, SH, horizon, 6, 1.1, shade(D_GRASS, 0.05)))


def sc_gate(d):
    jungle_back(d, 210)
    # through the open gate: the path into the reserve and a long neck in the distance
    d.add(f'<path d="M140 340 Q170 260 178 212 L192 212 Q206 260 246 340 Z" fill="{SAND}"/>')
    d.add(bronto(d, 214, 214, 0.7, -1, BRONTO, 1.1))
    d.add(stego(d, 160, 226, 0.45, 1))
    d.add(fern(d, 140, 218, 1.2))
    d.add(ptero(d, 300, 40, 0.8, -1))
    d.add(palisade(d, -10, 250, 70, 190, 22))
    d.add(palisade(d, 300, 250, 74, 190, 22))
    for x in (56, 262):
        d.add(post(d, x, 40, 46, 300))
        d.add(post(d, x - 6, 30, 58, 16))
        d.add(thatch(d, x - 14, x + 60, 30, 40))
        d.add(f'<rect x="{x + 16}" y="80" width="14" height="22" rx="3" fill="#3b3346"/>')
    d.add(log(d, 46, 62, 272, 26))
    d.add(signboard(d, 118, 92, 128, 44, posts=False))
    d.add(f'<line x1="136" y1="94" x2="136" y2="78" stroke="#6b5a4a" stroke-width="2"/><line x1="228" y1="94" x2="228" y2="78" stroke="#6b5a4a" stroke-width="2"/>')
    d.add(ivy(d, [(66, 340), (72, 280), (62, 220), (74, 160), (66, 110)], 1.5))
    # the ticket hut at the side, the explorers' wristbands hanging in its window
    d.add(f'<rect x="306" y="236" width="74" height="104" fill="{LOG}"/>')
    d.add(log_wall(d, 306, 236, 74, 104, 8))
    d.add(f'<rect x="316" y="252" width="48" height="32" rx="3" fill="#ffd98a" stroke="{shade(LOG, -0.4)}" stroke-width="4"/>')
    d.add(''.join(f'<circle cx="{326 + k * 11}" cy="270" r="4.5" fill="none" stroke="{c}" stroke-width="3"/>' for k, c in enumerate(('#ef9f55', '#5fae9a', '#9b88d0'))))
    d.add(fern(d, 18, 340, 2.2))
    d.add(para(d, 118, 340, 0.9, 1))


def sc_path(d):
    jungle_back(d, 190)
    ground = d.lin([(0, shade(D_GRASS, 0.08)), (1, shade(D_GRASS, -0.12))])
    d.add(f'<rect x="0" y="190" width="{SW}" height="{SH - 190}" fill="{ground}"/>')
    d.add(f'<path d="M110 340 Q160 270 172 192 L188 192 Q206 270 262 340 Z" fill="{SAND}"/>')
    d.add(pebbles(d, 140, 230, 220, 330, 22))
    d.add(palm(d, 40, 300, 2.0, 0.3))
    d.add(palm(d, 330, 290, 1.9, -0.35))
    d.add(palm(d, 120, 218, 0.9, 0.2))
    d.add(palm(d, 250, 214, 0.85, -0.2))
    # a little long-neck peeking out from the ferns
    d.add(bronto(d, 300, 262, 0.75, -1, BRONTO, 0.8))
    d.add(ankylo(d, 186, 236, 0.55, -1))
    d.add(ptero(d, 90, 70, 0.8, 1))
    d.add(fern(d, 280, 280, 2.4))
    d.add(fern(d, 330, 300, 2.0))
    d.add(fern(d, 80, 300, 2.2))
    # the log bench in front, where one waits
    d.add(log(d, 6, 272, 170, 26))
    d.add(post(d, 26, 296, 18, 44))
    d.add(post(d, 136, 296, 18, 44))
    d.add(signboard(d, 196, 206, 50, 24))
    d.add(hatchling(d, 70, 334, 1.6, TRIKE))


def sc_ranger(d):
    back = (70, 50, 294, 222)
    d.add(room(d, back, '#b08a62', '#8a6a4a', '#9a7a56'))
    d.add(log_wall(d, 70, 50, 224, 172, 12))
    # the window with the view of the reserve, a long neck in it
    clip = d.clip('<rect x="110" y="76" width="144" height="90" rx="4"/>')
    view = [sky(d, SH, D_SKY0, D_SKY1), band(SW, SH, 140, 5, 0.4, '#7fae74'), bronto(d, 200, 168, 0.55, -1, BRONTO, 1.0), palm(d, 128, 170, 0.6, 0.3),
            trike(d, 242, 166, 0.35, -1), ptero(d, 150, 98, 0.45, 1)]
    d.add(f'<g clip-path="{clip}">' + '\n'.join(view) + '</g>')
    d.add(f'<rect x="110" y="76" width="144" height="90" rx="4" fill="none" stroke="{shade(LOG, -0.4)}" stroke-width="7"/><line x1="182" y1="76" x2="182" y2="166" stroke="{shade(LOG, -0.4)}" stroke-width="4"/>')
    d.add(f'<path d="M84 52 l0 30 q8 -6 14 0 l0 -30" fill="{KHAKI}"/>')
    d.add(f'<g transform="translate(80 120)"><path d="M-14 -4 Q-12 -20 0 -20 Q12 -20 14 -4 Z" fill="{KHAKI}"/><ellipse cx="0" cy="-4" rx="22" ry="5" fill="{shade(KHAKI, -0.15)}"/><rect x="-13" y="-9" width="26" height="4" fill="{shade(LEAF, -0.1)}"/></g>')
    # the ranger's desk: binoculars, a map, the first-aid box, a lamp
    desk = d.lin([(0, shade(LOG, 0.2)), (1, LOG)])
    d.add(f'<rect x="40" y="226" width="284" height="18" rx="4" fill="{desk}"/><rect x="54" y="244" width="256" height="96" fill="{shade(LOG, -0.3)}"/>')
    d.add(f'<path d="M90 220 L190 214 L200 236 L96 242 Z" fill="#f4ead3" stroke="#a08c6a" stroke-width="1.4"/><path d="M106 232 Q130 214 156 226 T194 222" fill="none" stroke="#3f8aa6" stroke-width="2.5" stroke-dasharray="5 4"/>')
    d.add(footprint(176, 228, 0.5, '#8a6a4a'))
    d.add(binoculars(232, 222, 1.6))
    d.add(kit(d, 260, 192, 52, 34))
    d.add(rex(d, 300, 340, 1.0, -1))
    d.add(lantern(d, 62, 204, 1.0))


def sc_camp(d):
    jungle_back(d, 180)
    ground = d.lin([(0, shade(D_GRASS, 0.05)), (1, shade(D_GRASS, -0.15))])
    d.add(f'<rect x="0" y="182" width="{SW}" height="{SH - 182}" fill="{ground}"/>')
    d.add(palm(d, 300, 200, 1.3, -0.3))
    d.add(tent(d, 90, 252, 170, 130, CANVAS, shade(LEAF, -0.05)))
    d.add(tent(d, 282, 232, 110, 90, '#e9d3a8', '#c4553f'))
    d.add(ptero(d, 150, 60, 0.8, 1))
    d.add(stego(d, 196, 252, 0.62, 1))
    d.add(campfire(d, 190, 290, 1.9))
    d.add(rex(d, 266, 318, 0.9, -1))
    d.add(hatchling(d, 120, 296, 1.4, PARA))
    d.add(log(d, 60, 300, 110, 24))
    d.add(log(d, 220, 310, 120, 24))
    d.add(lantern(d, 344, 250, 1.1))
    d.add(fern(d, 16, 340, 1.8))
    d.add(fern(d, 360, 340, 1.6))


def sc_guide(d):
    # inside the lodge: the chief guide behind a table with the big map, the reserve's flag on the wall
    back = (60, 40, 304, 224)
    d.add(room(d, back, '#b08a62', '#8a6a4a', '#9a7a56'))
    d.add(log_wall(d, 60, 40, 244, 184, 13))
    d.add(f'<rect x="96" y="58" width="80" height="54" fill="#f4ead3" stroke="#a08c6a" stroke-width="2"/>')
    d.add(bone(136, 85, 50, -10))
    d.add(f'<rect x="210" y="58" width="60" height="64" rx="3" fill="{LEAF}"/>' + footprint(240, 92, 1.3, '#fbf3e0'))
    clip = d.clip('<polygon points="312,60 352,40 352,170 312,170"/>')
    view = [sky(d, SH, D_SKY0, D_SKY1), band(SW, SH, 140, 5, 0.4, '#7fae74'), bronto(d, 380, 196, 0.8, -1, BRONTO, 1.15), ptero(d, 336, 70, 0.35, -1)]
    d.add(f'<g clip-path="{clip}">' + '\n'.join(view) + '</g>')
    d.add(f'<polygon points="312,60 352,40 352,170 312,170" fill="none" stroke="{shade(LOG, -0.4)}" stroke-width="5"/>')
    d.add(explorer(d, 182, 222, 1.6, wave=True))
    d.add(hatchling(d, 290, 226, 1.3, TRIKE))
    top = d.lin([(0, shade(LOG, 0.3)), (1, LOG)])
    d.add(f'<rect x="40" y="222" width="284" height="20" rx="4" fill="{top}"/><rect x="52" y="242" width="260" height="98" fill="{shade(LOG, -0.3)}"/>')
    d.add(f'<path d="M100 216 L264 210 L276 236 L92 240 Z" fill="#f4ead3" stroke="#a08c6a" stroke-width="1.6"/>')
    d.add(f'<path d="M110 232 Q150 210 190 228 T262 220" fill="none" stroke="#3f8aa6" stroke-width="3" stroke-dasharray="6 5"/>')
    d.add(footprint(150, 226, 0.5, '#8a6a4a'), footprint(212, 222, 0.5, '#8a6a4a'))
    d.add(f'<circle cx="250" cy="224" r="6" fill="#c4553f"/>')
    d.add(f'<circle cx="74" cy="226" r="12" fill="#f4ead3" stroke="#8a6a4a" stroke-width="2"/><path d="M74 216 l3 10 l-3 10 l-3 -10 Z" fill="#c4553f"/>')
    d.add(lantern(d, 300, 200, 1.0))


def sc_lab(d):
    back = (70, 40, 294, 222)
    d.add(room(d, back, '#e9dcc0', '#b9a07a', '#cdbb98'))
    # shelves of fossils and jars
    for y in (90, 150):
        d.add(f'<rect x="84" y="{y}" width="196" height="8" fill="{LOG}"/>')
    d.add(bone(110, 80, 30, -8), bone(250, 82, 26, 12))
    d.add(f'<path d="M150 90 q14 -24 36 -12 q-6 12 -36 12 Z" fill="#e4d6b8" stroke="#a08c6a" stroke-width="1"/>')
    d.add(''.join(f'<rect x="{100 + k * 30}" y="{126 + (k % 2) * 4}" width="20" height="{24 - (k % 2) * 4}" rx="6" fill="{c}"/>' for k, c in enumerate(('#b9d7ee', '#c8e2b4', '#f3c58d', '#e7b5c8', '#d8cdf5', '#b9d7ee'))))
    # the table: the big microscope, a fossil, a magnifier and a notebook
    top = d.lin([(0, shade(LOG, 0.3)), (1, LOG)])
    d.add(f'<rect x="20" y="236" width="324" height="18" rx="4" fill="{top}"/><rect x="36" y="254" width="292" height="86" fill="{shade(LOG, -0.3)}"/>')
    d.add(microscope(d, 130, 238, 2.4))
    d.add(bone(240, 226, 64, -10))
    d.add(f'<circle cx="300" cy="214" r="18" fill="#d9eef7" opacity="0.7" stroke="#5b5f6b" stroke-width="4"/><line x1="312" y1="228" x2="330" y2="246" stroke="{LOG}" stroke-width="7" stroke-linecap="round"/>')
    d.add(book(d, 64, 222, 70, -6))
    d.add(hatchling(d, 200, 236, 1.8, REX))
    clip = d.clip('<rect x="104" y="44" width="70" height="40" rx="4"/>')
    d.add(f'<g clip-path="{clip}">' + sky(d, SH, D_SKY0, D_SKY1) + band(SW, SH, 70, 3, 0.4, '#7fae74') + ankylo(d, 150, 84, 0.3, -1) + ptero(d, 124, 58, 0.25, 1) + '</g>')
    d.add(f'<rect x="104" y="44" width="70" height="40" rx="4" fill="none" stroke="{shade(LOG, -0.3)}" stroke-width="4"/>')


def sc_medic(d):
    # inside the treatment tent: a cot with a pillow, bandages, the leaf banner, a steady lamp
    d.add(f'<rect width="{SW}" height="{SH}" fill="#f6f3ea"/>')
    d.add(''.join(f'<path d="M182 -10 L{x} 250" stroke="#ddd6c4" stroke-width="2"/>' for x in range(-40, SW + 60, 48)))
    fold = d.lin([(0, '#000', 0.16), (0.4, '#000', 0), (0.6, '#000', 0), (1, '#000', 0.2)], 0, 0, 1, 0)
    d.add(f'<rect x="0" y="0" width="{SW}" height="250" fill="{fold}"/>')
    d.add(f'<rect x="178" y="0" width="9" height="252" fill="{LOG}"/>')
    ground = d.lin([(0, '#cfbd96'), (1, '#b49c70')])
    d.add(f'<rect x="0" y="248" width="{SW}" height="{SH - 248}" fill="{ground}"/>')
    d.add(f'<ellipse cx="182" cy="300" rx="150" ry="28" fill="#cfe6d6"/><ellipse cx="182" cy="300" rx="124" ry="20" fill="none" stroke="{LEAF}" stroke-width="3"/>')
    d.add(banner(d, 194, 60, 46, 66, '#ffffff', 'leaf'))
    d.add(f'<rect x="10" y="214" width="146" height="22" rx="6" fill="{LOG}"/><rect x="18" y="196" width="130" height="22" rx="10" fill="#e9f1f7"/><rect x="24" y="190" width="46" height="18" rx="8" fill="#ffffff"/>')
    d.add(f'<rect x="20" y="236" width="10" height="44" fill="{shade(LOG, -0.3)}"/><rect x="136" y="236" width="10" height="44" fill="{shade(LOG, -0.3)}"/>')
    d.add(f'<rect x="222" y="204" width="128" height="12" rx="3" fill="{LOG}"/><rect x="230" y="216" width="10" height="62" fill="{shade(LOG, -0.3)}"/><rect x="332" y="216" width="10" height="62" fill="{shade(LOG, -0.3)}"/>')
    d.add(kit(d, 236, 172, 48, 32))
    d.add(f'<rect x="294" y="188" width="44" height="16" rx="8" fill="#fff" stroke="#c9d3da" stroke-width="1.4"/><line x1="300" y1="196" x2="332" y2="196" stroke="#c9d3da" stroke-width="1"/>')
    d.add(lantern(d, 160, 150, 1.0))
    # a little stegosaurus patient with a leaf bandage, a triceratops keeping it company
    d.add(stego(d, 98, 300, 0.75, 1))
    d.add(f'<rect x="106" y="286" width="16" height="9" rx="3" fill="#fff" stroke="{LEAF}" stroke-width="1.4"/>')
    d.add(trike(d, 300, 316, 0.7, -1))


def sc_expert(d):
    # at the radio: the set with its dials, the microphone, the antenna seen through the window
    back = (60, 40, 304, 222)
    d.add(room(d, back, '#b08a62', '#8a6a4a', '#9a7a56'))
    d.add(log_wall(d, 60, 40, 244, 182, 12))
    clip = d.clip('<rect x="186" y="66" width="96" height="84" rx="4"/>')
    view = [sky(d, SH, D_SKY0, D_SKY1), band(SW, SH, 120, 4, 0.4, '#7fae74'),
            f'<line x1="250" y1="140" x2="236" y2="76" stroke="#6b5a4a" stroke-width="4"/><line x1="236" y1="76" x2="236" y2="60" stroke="#5b5f6b" stroke-width="2"/>',
            f'<path d="M224 74 q12 -8 24 0 M220 68 q16 -12 32 0" stroke="#fff" stroke-width="2" fill="none"/>',
            ptero(d, 206, 96, 0.4, 1), bronto(d, 272, 150, 0.45, -1, BRONTO, 1.1)]
    d.add(f'<g clip-path="{clip}">' + '\n'.join(view) + '</g>')
    d.add(f'<rect x="186" y="66" width="96" height="84" rx="4" fill="none" stroke="{shade(LOG, -0.4)}" stroke-width="6"/>')
    d.add(f'<rect x="84" y="70" width="80" height="60" rx="3" fill="#f4ead3" stroke="#a08c6a" stroke-width="2"/><path d="M94 112 Q114 84 134 104 T158 96" fill="none" stroke="#3f8aa6" stroke-width="2" stroke-dasharray="4 3"/>')
    top = d.lin([(0, shade(LOG, 0.3)), (1, LOG)])
    d.add(f'<rect x="30" y="226" width="304" height="18" rx="4" fill="{top}"/><rect x="44" y="244" width="276" height="96" fill="{shade(LOG, -0.3)}"/>')
    d.add(radio(d, 170, 228, 2.4))
    d.add(f'<path d="M262 226 L268 196" stroke="#3b3346" stroke-width="4"/><rect x="260" y="180" width="16" height="22" rx="8" fill="#3b3346"/><rect x="250" y="222" width="34" height="6" rx="3" fill="#3b3346"/>')
    d.add(rex(d, 316, 340, 0.85, -1))
    d.add(f'<path d="M48 214 q0 -30 30 -30 q30 0 30 30" stroke="#3b3346" stroke-width="5" fill="none"/><rect x="40" y="206" width="16" height="22" rx="6" fill="#3b3346"/><rect x="100" y="206" width="16" height="22" rx="6" fill="#3b3346"/>')


def sc_results(d):
    jungle_back(d, 170)
    ground = d.lin([(0, shade(SAND, 0.1)), (1, shade(SAND, -0.15))])
    d.add(f'<rect x="0" y="172" width="{SW}" height="{SH - 172}" fill="{ground}"/>')
    d.add(palm(d, 40, 230, 1.4, 0.3))
    d.add(palm(d, 326, 222, 1.3, -0.3))
    d.add(nest(d, 160, 270, 230))
    d.add(para(d, 50, 300, 1.2, 1))
    for x, y, c in ((104, 240, '#f4ecd8'), (204, 244, '#f6e6d2')):
        d.add(egg(d, x, y, 3.0, c))
    d.add(hatchling(d, 154, 270, 3.0, PARA))
    d.add(ankylo(d, 250, 196, 0.5, -1))
    d.add(ptero(d, 200, 60, 0.8, -1))
    d.add(post(d, 272, 240, 70, 100))
    d.add(hourglass(d, 306, 244, 2.0))
    d.add(f'<rect x="20" y="290" width="90" height="56" rx="4" fill="#f4ead3" stroke="#a08c6a" stroke-width="2"/>' + ''.join(f'<line x1="30" y1="{304 + k * 10}" x2="96" y2="{304 + k * 10}" stroke="#c9b99a" stroke-width="2"/>' for k in range(4)))
    d.add(fern(d, 360, 340, 1.8))


def sc_home(d):
    jungle_back(d, 180)
    ground = d.lin([(0, shade(D_GRASS, 0.05)), (1, shade(D_GRASS, -0.15))])
    d.add(f'<rect x="0" y="182" width="{SW}" height="{SH - 182}" fill="{ground}"/>')
    d.add(f'<path d="M60 340 Q150 250 170 184 L196 184 Q220 250 330 340 Z" fill="{SAND}"/>')
    d.add(bronto(d, 64, 236, 1.1, 1, BRONTO, 1.05))
    d.add(trike(d, 300, 226, 0.75, -1))
    d.add(para(d, 150, 214, 0.6, 1))
    d.add(stego(d, 240, 226, 0.5, -1))
    d.add(ptero(d, 110, 70, 0.8, 1))
    d.add(ptero(d, 250, 50, 0.55, -1))
    d.add(jeep(d, 176, 318, 1.9, -1))
    d.add(rex(d, 326, 330, 0.95, -1))
    d.add(ankylo(d, 40, 336, 0.8, 1))
    d.add(fern(d, 16, 340, 1.8))
    d.add(fern(d, 356, 340, 1.8))


SCENES = {
    'gate': (sc_gate, 'at the entrance to the reserve (reception)'),
    'path': (sc_path, 'on the entrance path (waiting before the checks)'),
    'ranger': (sc_ranger, "in the reserve ranger's hut (the checks)"),
    'camp': (sc_camp, 'in the waiting camp (waiting for the doctor)'),
    'guide': (sc_guide, 'meeting the chief guide in his lodge (the doctor)'),
    'lab': (sc_lab, 'at the table of the findings lab (tests)'),
    'medic': (sc_medic, 'inside the treatment tent (treatment)'),
    'expert': (sc_expert, "at the field expert's radio (consultation)"),
    'results': (sc_results, "by the nest, waiting for the samples' results"),
    'home': (sc_home, 'by the jeep, going home (the end)'),
}


# ---------- the map backgrounds ----------
def background(W, H, horizon, palms, ferns, clouds, volcano, seed, comment):
    d = Doc(W, H, seed)
    s = (W / 412) ** 0.5
    d.add(f'<rect width="{W}" height="{H}" fill="{d.lin([(0, D_SKY0), (0.85, D_SKY1)])}"/>')
    d.add(*[cloud(*c) for c in clouds])
    d.add(band(W, H, horizon - 30 * s, 16 * s, 0.4, '#9bb7a6'))
    vx, vs = volcano
    d.add(f'<path d="M{vx - 70 * vs} {horizon - 20 * s} L{vx - 14 * vs} {horizon - 100 * vs} L{vx + 14 * vs} {horizon - 100 * vs} L{vx + 80 * vs} {horizon - 20 * s} Z" fill="#8fa89a"/>')
    d.add(f'<path d="M{vx - 14 * vs} {horizon - 100 * vs} L{vx + 14 * vs} {horizon - 100 * vs} L{vx + 8 * vs} {horizon - 86 * vs} L{vx - 6 * vs} {horizon - 86 * vs} Z" fill="#6f8a7a"/>')
    d.add(f'<circle cx="{vx}" cy="{horizon - 116 * vs}" r="{10 * vs}" fill="#fff" opacity="0.55"/><circle cx="{vx + 12 * vs}" cy="{horizon - 134 * vs}" r="{13 * vs}" fill="#fff" opacity="0.4"/>')
    d.add(canopy(d, W, horizon - 2 * s, s * 0.9, '#86b37a'))
    rows = [('#a9d17c', 0), ('#98c86c', 0.16), ('#88bc5f', 0.36), ('#7ab155', 0.6), ('#6ea84c', 0.82)]
    for i, (col, f) in enumerate(rows):
        d.add(band(W, H, horizon + (H - horizon) * f, 10 * s, i * 1.7, col))
    for p in sorted(palms, key=lambda t: t[1]):
        d.add(palm(d, *p))
    for fx, fy, fs in ferns:
        d.add(fern(d, fx, fy, fs))
    return d.svg(f'{WORLD} world: {comment}', grain=0.025, wobble=1.0, clay=False)


def portrait_bg():
    return background(
        412, 1100, 196,
        palms=[(380, 240, 0.85, -0.3), (24, 360, 0.9, 0.3), (392, 530, 0.95, -0.3), (20, 700, 0.85, 0.3), (396, 870, 0.95, -0.3), (40, 1030, 0.9, 0.3), (360, 1060, 0.8, -0.2)],
        ferns=[(40, 430, 0.9), (30, 750, 0.8), (190, 1070, 1.0)],
        clouds=[(250, 150, 0.5), (110, 168, 0.45)], volcano=(80, 0.5), seed=21,
        comment='the portrait map background (the 412×939 frame, drawn 412×1100 so the second map can move it)')


def landscape_bg():
    return background(
        1920, 1080, 330,
        palms=[(1560, 480, 1.9, -0.3), (1680, 450, 1.6, -0.2), (1850, 520, 2.0, -0.35), (90, 440, 1.8, 0.3), (240, 410, 1.5, 0.25), (1880, 780, 1.8, -0.3), (560, 1050, 1.7, 0.3)],
        ferns=[(1300, 970, 2.0), (500, 830, 1.7), (640, 1000, 1.8)],
        clouds=[(420, 170, 1.4), (760, 230, 1.1), (1150, 160, 1.3), (1600, 270, 1.0)], volcano=(1280, 1.4), seed=22,
        comment='the landscape map background (the 1920×1080 frame)')


def sheet_floor():
    d = Doc(364, 340, 29)
    d.add(f'<rect width="364" height="340" fill="{d.lin([(0, "#e8f2f0"), (0.55, "#f4efe0"), (1, "#e6d7b4")])}"/>')
    d.add(band(364, 340, 215, 6, 0.7, '#cfe0b4'), band(364, 340, 255, 5, 2.1, '#bcd49c'))
    d.add(cloud(70, 60, 0.8), cloud(290, 40, 0.6))
    return d.svg(f'{WORLD} world: the panel behind a picture on its sheet', clay=False)


def celebrate():
    d = Doc(640, 480, 31)
    d.add(f'<rect width="640" height="480" fill="{d.lin([(0, D_SKY0), (1, D_SKY1)])}"/>')
    d.add(cloud(120, 110, 1.2), cloud(520, 90, 1.0))
    d.add(band(640, 480, 300, 10, 0.5, '#a9d17c'), band(640, 480, 360, 10, 2.0, '#8cbf4f'))
    figures = Doc(640, 480, 32, prefix='v')
    figures.add(bronto(figures, 170, 380, 1.6, 1, BRONTO, 1.05))
    figures.add(trike(figures, 500, 400, 1.3, -1))
    figures.add(stego(figures, 330, 330, 0.9, 1))
    figures.add(para(figures, 590, 360, 0.9, -1))
    figures.add(ptero(figures, 230, 160, 1.2, 1))
    figures.add(ptero(figures, 420, 200, 0.9, -1))
    figures.add(jeep(figures, 320, 440, 1.6, -1))
    figures.add(rex(figures, 430, 452, 1.0, -1))
    figures.add(ankylo(figures, 90, 460, 0.9, 1))
    d.defs.extend(figures.defs)
    d.add('<g filter="url(#clay)">' + '\n'.join(figures.body) + '</g>')
    cols = ['#c4553f', '#e3b34a', '#3f8aa6', LEAF]
    d.add('<path d="M0 36 Q320 76 640 36" fill="none" stroke="#6b4329" stroke-width="2"/>')
    for i in range(16):
        x = 8 + i * 40
        t = x / 640
        y = 36 + 40 * 4 * t * (1 - t) * 0.5
        d.add(f'<path d="M{x} {y:.1f} l14 24 l14 -24 Z" fill="{cols[i % 4]}"/>')
    d.add(palm(d, 50, 460, 2.2, 0.3), palm(d, 600, 466, 2.0, -0.3))
    return d.svg(f'{WORLD} world: going home happy (the celebration screen)', clay=False)


def card():
    """The world's card on the world select screen: the long-neck by the lodge"""
    d = Doc(300, 220, 33)
    d.add(d_mound(d))
    d.add(palm(d, 250, 172, 1.0, -0.3))
    d.add(bronto(d, 150, 182, 1.25, 1, BRONTO, 1.0))
    d.add(rex(d, 250, 196, 0.55, -1))
    d.add(ptero(d, 70, 44, 0.6, 1))
    d.add(fern(d, 60, 184, 1.2))
    return d.svg(f'{WORLD} world: the card on the world select screen')



def main():
    files = {}
    for k, (f, c) in STATIONS.items():
        files[f'station-{k}.svg'] = station(k, f, c, WORLD, d_mound)
    for k, (f, c) in SCENES.items():
        files[f'scene-{k}.svg'] = scene(k, f, c, WORLD)
    files['map-portrait.svg'] = portrait_bg()
    files['map-landscape.svg'] = landscape_bg()
    files['sheet-floor.svg'] = sheet_floor()
    files['celebrate.svg'] = celebrate()
    files['card.svg'] = card()
    write('dino', files)


if __name__ == '__main__':
    main()

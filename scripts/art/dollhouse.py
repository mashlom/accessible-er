"""The dollhouse world's earlier pictures, drawn in code (drafts in scripts/art/build/dollhouse/; the app uses the delivered ones): the rooms of a dollhouse in a playroom, where the
bunny helps, the teddy-bear doctor checks gently and the wise owl comes to visit; the doll is the patient.

    python3 scripts/art/dollhouse.py

Drawn with the shared tools in lib.py (the same light, grain and 3D filter as the other drawn worlds), plus the
tools of this world below: cutaway rooms in a three-quarter view, wallpaper, furniture, the characters.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa: E402,F403
from lib import SW, SH  # noqa: E402
import lib  # noqa: E402

lib.RELIEF = 4
WORLD = 'Dollhouse'

# ---------- palette ----------
PLUM = '#6d4a6b'
ROSE = '#c2618f'
PINK, MINT, BUTTER, LILAC, BLUE, PEACH = '#f4c9d6', '#cfe8dc', '#f6e3a8', '#ddd0ef', '#cfe3f3', '#f8d5bd'
FLOOR = '#d4a574'
SLAB = '#b07d52'
CREAM_W = '#fbf3e6'
FUR_B = '#b98055'
BUNNY = '#f7f1ea'
OWL = '#a8805a'
TEAL = '#5fa8a0'


# ---------- the tools of this world ----------
def ball(d, color):
    """A fill lit like a soft toy: light at the top left, deeper at the bottom right"""
    return d.rad([(0, shade(color, 0.4)), (0.5, shade(color, 0.06)), (0.82, color), (1, shade(color, -0.38))], 0.36, 0.3, 0.8)


def rim(color):
    return f'stroke="{shade(color, -0.45)}" stroke-width="1"'


def face_eyes(cx, cy, gap, r):
    return ''.join(f'<circle cx="{cx + sx * gap}" cy="{cy}" r="{r}" fill="#2c2433"/><circle cx="{cx + sx * gap - r * 0.3:.1f}" cy="{cy - r * 0.35:.1f}" r="{r * 0.35:.1f}" fill="#fff"/>' for sx in (-1, 1))


def cheeks(cx, cy, gap, r):
    return ''.join(f'<circle cx="{cx + sx * gap}" cy="{cy}" r="{r}" fill="#f2a38f" opacity="0.55"/>' for sx in (-1, 1))


def bunny(d, x, y, s=1.0, cap=True):
    """The bunny who helps: soft and round, long ears, a little cap with a heart"""
    f = ball(d, BUNNY)
    out = [f'<ellipse cx="0" cy="2" rx="22" ry="4" fill="#000" opacity="0.15"/>',
           f'<ellipse cx="0" cy="-22" rx="18" ry="22" fill="{f}" {rim(BUNNY)}/>',
           f'<ellipse cx="0" cy="-16" rx="11" ry="13" fill="#fff"/>',
           f'<ellipse cx="-10" cy="-2" rx="8" ry="4" fill="{f}" {rim(BUNNY)}/><ellipse cx="10" cy="-2" rx="8" ry="4" fill="{f}" {rim(BUNNY)}/>']
    for sx in (-1, 1):
        out.append(f'<ellipse cx="{sx * 8}" cy="-78" rx="6.5" ry="19" fill="{f}" {rim(BUNNY)} transform="rotate({sx * 10} {sx * 8} -62)"/>')
        out.append(f'<ellipse cx="{sx * 8}" cy="-77" rx="3.4" ry="14" fill="#f6b8c8" transform="rotate({sx * 10} {sx * 8} -62)"/>')
    out += [f'<circle cx="0" cy="-50" r="17" fill="{f}" {rim(BUNNY)}/>',
            face_eyes(0, -52, 6, 2.6), cheeks(0, -45, 10, 3.2),
            f'<path d="M-2 -46 h4 l-2 2.5 Z" fill="#f08aa2"/><path d="M-4 -42 q4 3 8 0" stroke="#2c2433" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
            f'<path d="M-18 -26 q-8 8 -4 16 M18 -26 q8 8 4 16" stroke="{shade(BUNNY, -0.2)}" stroke-width="7" stroke-linecap="round" fill="none"/>']
    if cap:
        out.append(f'<path d="M-12 -64 Q0 -74 12 -64 L10 -58 L-10 -58 Z" fill="#fff" {rim("#ffffff")}/>')
        out.append(f'<path d="M0 -60 c-3 -4 -7 0 0 4 c7 -4 3 -8 0 -4 Z" fill="{ROSE}"/>')
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def teddy(d, x, y, s=1.0, coat=True):
    """The teddy-bear doctor: round ears, a light muzzle, a white coat, a stethoscope"""
    f = ball(d, FUR_B)
    out = [f'<ellipse cx="0" cy="2" rx="26" ry="5" fill="#000" opacity="0.15"/>',
           f'<ellipse cx="0" cy="-26" rx="22" ry="26" fill="{f}" {rim(FUR_B)}/>']
    if coat:
        cg = d.lin([(0, '#ffffff'), (1, '#dfe6ea')], 0, 0, 1, 0)
        out += [f'<path d="M-21 -36 Q-24 -10 -18 0 L18 0 Q24 -10 21 -36 Q12 -46 0 -46 Q-12 -46 -21 -36 Z" fill="{cg}" {rim("#cfd8de")}/>',
                f'<path d="M0 -46 L-6 -34 L0 -2 L6 -34 Z" fill="{shade(FUR_B, 0.2)}"/>',
                ''.join(f'<circle cx="3" cy="{-26 + k * 8}" r="1.4" fill="#9fb2bd"/>' for k in range(3)),
                f'<rect x="-17" y="-22" width="8" height="6" rx="1.5" fill="#e9eef1" stroke="#cfd8de" stroke-width="0.8"/>',
                f'<path d="M-8 -44 Q-14 -24 -4 -18 Q6 -16 8 -26" stroke="#6c7180" stroke-width="2" fill="none"/><circle cx="8" cy="-27" r="3" fill="#9aa0ad"/>']
    out += [f'<ellipse cx="-12" cy="-2" rx="9" ry="5" fill="{f}" {rim(FUR_B)}/><ellipse cx="12" cy="-2" rx="9" ry="5" fill="{f}" {rim(FUR_B)}/>',
            f'<circle cx="-16" cy="-74" r="8" fill="{f}" {rim(FUR_B)}/><circle cx="16" cy="-74" r="8" fill="{f}" {rim(FUR_B)}/>',
            f'<circle cx="-16" cy="-74" r="4" fill="{shade(FUR_B, 0.3)}"/><circle cx="16" cy="-74" r="4" fill="{shade(FUR_B, 0.3)}"/>',
            f'<circle cx="0" cy="-60" r="19" fill="{f}" {rim(FUR_B)}/>',
            f'<ellipse cx="0" cy="-54" rx="9" ry="7" fill="{shade(FUR_B, 0.42)}"/>',
            f'<ellipse cx="0" cy="-57" rx="3.4" ry="2.4" fill="#3b2a24"/><path d="M-4 -51 q4 3 8 0" stroke="#3b2a24" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
            face_eyes(0, -64, 7, 2.6), cheeks(0, -55, 12, 3),
            f'<path d="M-24 -34 q-8 10 -2 18 M24 -34 q8 10 2 18" stroke="{shade(FUR_B, -0.1)}" stroke-width="9" stroke-linecap="round" fill="none"/>']
    if coat:
        out.append(f'<circle cx="0" cy="-80" r="6" fill="#e9eef1" stroke="#9aa0ad" stroke-width="1"/><circle cx="0" cy="-80" r="2.4" fill="#cfe3f3"/><path d="M-14 -76 Q0 -86 14 -76" stroke="#9aa0ad" stroke-width="1.6" fill="none"/>')
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def owl(d, x, y, s=1.0):
    """The wise owl: round, ear tufts, big eyes behind round glasses, folded wings"""
    f = ball(d, OWL)
    out = [f'<ellipse cx="0" cy="2" rx="18" ry="3.5" fill="#000" opacity="0.15"/>',
           f'<ellipse cx="0" cy="-26" rx="20" ry="26" fill="{f}" {rim(OWL)}/>',
           f'<ellipse cx="0" cy="-20" rx="12" ry="16" fill="#f1dfc0"/>']
    for k in range(3):
        for j in range(3 - (k % 2)):
            out.append(f'<path d="M{-6 + j * 6 + (k % 2) * 3} {-28 + k * 7} q3 3 6 0" stroke="{shade(OWL, -0.1)}" stroke-width="1" fill="none"/>')
    out += [f'<path d="M-20 -36 Q-30 -18 -16 -4 Q-14 -24 -20 -36 Z" fill="{shade(OWL, -0.18)}"/>',
            f'<path d="M20 -36 Q30 -18 16 -4 Q14 -24 20 -36 Z" fill="{shade(OWL, -0.18)}"/>',
            f'<path d="M-16 -48 l-4 -12 l10 6 Z M16 -48 l4 -12 l-10 6 Z" fill="{shade(OWL, -0.1)}"/>',
            ''.join(f'<circle cx="{sx * 8}" cy="-40" r="8" fill="#fff"/><circle cx="{sx * 8}" cy="-40" r="4.2" fill="#2c2433"/><circle cx="{sx * 8 - 1.4}" cy="-41.6" r="1.4" fill="#fff"/>' for sx in (-1, 1)),
            ''.join(f'<circle cx="{sx * 8}" cy="-40" r="9.5" fill="none" stroke="#5b4a3a" stroke-width="1.8"/>' for sx in (-1, 1)),
            f'<line x1="-1.5" y1="-40" x2="1.5" y2="-40" stroke="#5b4a3a" stroke-width="1.8"/>',
            f'<path d="M-3 -32 L3 -32 L0 -27 Z" fill="#f2b84b"/>',
            f'<path d="M-8 0 l-3 3 M-8 0 l0 4 M-8 0 l3 3 M8 0 l-3 3 M8 0 l0 4 M8 0 l3 3" stroke="#f2b84b" stroke-width="1.6" stroke-linecap="round"/>']
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def doll(d, x, y, s=1.0, dress=ROSE, hair='#c9824a', sitting=False):
    """The doll (the little patient): yarn hair, a dress with dots, a calm smile"""
    df = ball(d, dress)
    out = [f'<ellipse cx="0" cy="2" rx="14" ry="3" fill="#000" opacity="0.15"/>']
    if sitting:
        out.append(f'<path d="M-6 -8 h-10 M6 -8 h10" stroke="{SKIN}" stroke-width="6" stroke-linecap="round"/>')
        out.append(f'<ellipse cx="-17" cy="-8" rx="4" ry="3" fill="#7a5a8c"/><ellipse cx="17" cy="-8" rx="4" ry="3" fill="#7a5a8c"/>')
    else:
        out.append(f'<path d="M-5 -10 v10 M5 -10 v10" stroke="{SKIN}" stroke-width="5" stroke-linecap="round"/>')
        out.append(f'<ellipse cx="-5" cy="1" rx="4" ry="2.4" fill="#7a5a8c"/><ellipse cx="5" cy="1" rx="4" ry="2.4" fill="#7a5a8c"/>')
    out += [f'<path d="M-6 -32 L-15 -8 Q0 -4 15 -8 L6 -32 Z" fill="{df}" {rim(dress)}/>',
            ''.join(f'<circle cx="{dx}" cy="{dy}" r="1.4" fill="#fff" opacity="0.8"/>' for dx, dy in ((-6, -14), (2, -12), (8, -18), (-2, -22), (5, -26))),
            f'<path d="M-6 -30 q-8 8 -6 14 M6 -30 q8 8 6 14" stroke="{SKIN}" stroke-width="4" stroke-linecap="round" fill="none"/>',
            f'<circle cx="0" cy="-42" r="11" fill="{SKIN}" {rim(SKIN)}/>',
            f'<path d="M-11 -42 Q-12 -56 0 -55 Q12 -56 11 -42 Q8 -50 0 -50 Q-8 -50 -11 -42 Z" fill="{hair}"/>',
            f'<path d="M-11 -44 q-5 8 -2 14 M11 -44 q5 8 2 14" stroke="{hair}" stroke-width="4" stroke-linecap="round" fill="none"/>',
            face_eyes(0, -42, 4, 1.6), cheeks(0, -38, 6.5, 2),
            f'<path d="M-2.5 -37 q2.5 2 5 0" stroke="#2c2433" stroke-width="1" fill="none" stroke-linecap="round"/>',
            f'<circle cx="7" cy="-52" r="3" fill="{BUTTER}"/>']
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def wallpaper(d, poly, color, pattern='dots', accent=None):
    """A papered wall: its colour and a gentle pattern, clipped to the wall"""
    accent = accent or shade(color, -0.12)
    clip = d.clip(f'<polygon points="{poly}"/>')
    pts = [tuple(map(float, p.split(','))) for p in poly.split()]
    x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
    y0, y1 = min(p[1] for p in pts), max(p[1] for p in pts)
    out = [f'<polygon points="{poly}" fill="{color}"/>']
    pat = []
    if pattern == 'dots':
        step = 9
        for j, yy in enumerate(range(int(y0), int(y1) + step, step)):
            for xx in range(int(x0) + (j % 2) * step // 2, int(x1) + step, step):
                pat.append(f'<circle cx="{xx}" cy="{yy}" r="1.3" fill="{accent}"/>')
    elif pattern == 'stripes':
        for xx in range(int(x0), int(x1) + 12, 12):
            pat.append(f'<rect x="{xx}" y="{y0}" width="5" height="{y1 - y0}" fill="{accent}" opacity="0.6"/>')
    elif pattern == 'hearts':
        step = 16
        for j, yy in enumerate(range(int(y0) + 6, int(y1) + step, step)):
            for xx in range(int(x0) + (j % 2) * step // 2, int(x1) + step, step):
                pat.append(f'<path d="M{xx} {yy} c-2 -3 -5 0 0 3 c5 -3 2 -6 0 -3 Z" fill="{accent}"/>')
    elif pattern == 'stars':
        step = 16
        for j, yy in enumerate(range(int(y0) + 6, int(y1) + step, step)):
            for xx in range(int(x0) + (j % 2) * step // 2, int(x1) + step, step):
                pat.append(star(xx, yy, 2.4, accent))
    out.append(f'<g clip-path="{clip}">' + ''.join(pat) + '</g>')
    return '\n'.join(out)


def planks_floor(d, poly, color=FLOOR, n=9, horizontal=True):
    """A wooden floor of planks, clipped to its shape"""
    clip = d.clip(f'<polygon points="{poly}"/>')
    pts = [tuple(map(float, p.split(','))) for p in poly.split()]
    x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
    y0, y1 = min(p[1] for p in pts), max(p[1] for p in pts)
    out = [f'<polygon points="{poly}" fill="{color}"/>']
    lines = []
    for k in range(1, n):
        y = y0 + (y1 - y0) * k / n
        lines.append(f'<line x1="{x0}" y1="{y:.1f}" x2="{x1}" y2="{y:.1f}" stroke="{shade(color, -0.25)}" stroke-width="1"/>')
        for _ in range(3):
            xx = d.rng.uniform(x0, x1)
            lines.append(f'<line x1="{xx:.1f}" y1="{y - (y1 - y0) / n:.1f}" x2="{xx:.1f}" y2="{y:.1f}" stroke="{shade(color, -0.25)}" stroke-width="1"/>')
    out.append(f'<g clip-path="{clip}">' + ''.join(lines) + '</g>')
    return '\n'.join(out)


# the cutaway room of a station (300×220): a floor, a back wall and a left wall, a tiled roof, on a wooden base
FL = (40, 184)   # front left of the floor
FR = (226, 184)  # front right
BL = (74, 152)   # back left
BR = (260, 152)  # back right
TOP = 62         # top of the walls


def room_box(d, wall, pattern, roof=ROSE, side=None):
    side = side or shade(wall, -0.1)
    out = [f'<ellipse cx="150" cy="204" rx="134" ry="11" fill="#000" opacity="0.16"/>']
    # the wooden base under the room
    base = d.lin([(0, shade(SLAB, 0.15)), (1, shade(SLAB, -0.3))])
    out.append(f'<polygon points="{FL[0] - 6},{FL[1]} {FR[0] + 6},{FR[1]} {BR[0] + 6},{BR[1]} {BR[0] + 6},{BR[1] + 14} {FR[0] + 6},{FR[1] + 16} {FL[0] - 6},{FL[1] + 16}" fill="{base}"/>')
    out.append(f'<polygon points="{FL[0] - 6},{FL[1]} {FR[0] + 6},{FR[1]} {FR[0] + 6},{FR[1] + 16} {FL[0] - 6},{FL[1] + 16}" fill="{shade(SLAB, -0.05)}"/>')
    out.append(f'<line x1="{FL[0] - 6}" y1="{FL[1] + 5}" x2="{FR[0] + 6}" y2="{FR[1] + 5}" stroke="{shade(SLAB, 0.3)}" stroke-width="1.4"/>')
    out.append(planks_floor(d, f'{FL[0]},{FL[1]} {FR[0]},{FR[1]} {BR[0]},{BR[1]} {BL[0]},{BL[1]}', FLOOR, 5))
    # the walls, papered, with a skirting board
    out.append(wallpaper(d, f'{BL[0]},{TOP} {BR[0]},{TOP} {BR[0]},{BR[1]} {BL[0]},{BL[1]}', wall, pattern))
    out.append(wallpaper(d, f'{FL[0]},{TOP + 32} {BL[0]},{TOP} {BL[0]},{BL[1]} {FL[0]},{FL[1]}', side, pattern))
    sh = d.lin([(0, '#000', 0.18), (1, '#000', 0)], 0, 0, 1, 0)
    out.append(f'<polygon points="{FL[0]},{TOP + 32} {BL[0]},{TOP} {BL[0]},{BL[1]} {FL[0]},{FL[1]}" fill="{sh}"/>')
    out.append(f'<rect x="{BL[0]}" y="{BR[1] - 7}" width="{BR[0] - BL[0]}" height="7" fill="{CREAM_W}"/>')
    out.append(f'<polygon points="{FL[0]},{FL[1] - 7} {BL[0]},{BL[1] - 7} {BL[0]},{BL[1]} {FL[0]},{FL[1]}" fill="{shade(CREAM_W, -0.1)}"/>')
    # the cut edges of the walls (the dollhouse is open at the front)
    out.append(f'<polygon points="{FL[0] - 5},{TOP + 34} {FL[0]},{TOP + 32} {FL[0]},{FL[1]} {FL[0] - 5},{FL[1] + 1}" fill="{CREAM_W}"/>')
    out.append(f'<rect x="{BR[0]}" y="{TOP}" width="5" height="{BR[1] - TOP}" fill="{CREAM_W}"/>')
    # the roof: a gable over the back wall, its slope back over the side wall
    out.append(f'<polygon points="{BL[0] - 12},{TOP + 2} {166},{18} {166 - 34},{18 + 30} {FL[0] - 14},{TOP + 36}" fill="{shade(roof, -0.22)}"/>')
    out.append(gable(d, BL[0] - 12, BR[0] + 12, TOP + 2, 46, roof, 5))
    out.append(f'<circle cx="166" cy="44" r="8" fill="{CREAM_W}" stroke="{shade(roof, -0.4)}" stroke-width="2"/><circle cx="166" cy="44" r="5" fill="#bfe0f2"/>')
    return '\n'.join(out)


def window_box(d, x, y, w, h, view='sky', curtains=PINK):
    """A window with a view, curtains tied at the sides"""
    clip = d.clip(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2"/>')
    g = d.lin([(0, '#8fc3e6'), (1, '#e3f1f8')])
    inside = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{g}"/>', cloud(x + w * 0.35, y + h * 0.35, w / 90)]
    if view == 'garden':
        inside.append(f'<rect x="{x}" y="{y + h * 0.7}" width="{w}" height="{h * 0.3}" fill="#9ccb6e"/>')
    elif view == 'night':
        inside = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#3a4a7a"/>', star(x + w * 0.3, y + h * 0.3, w / 18, '#fff'), star(x + w * 0.7, y + h * 0.55, w / 26, '#fff'),
                  f'<path d="M{x + w * 0.7} {y + h * 0.2} a{w * 0.1} {w * 0.1} 0 1 0 {w * 0.08} {w * 0.16} a{w * 0.08} {w * 0.08} 0 1 1 {-w * 0.08} {-w * 0.16} Z" fill="#ffd98a"/>']
    out = [f'<g clip-path="{clip}">' + ''.join(inside) + '</g>',
           f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" stroke="{CREAM_W}" stroke-width="{max(2.5, w / 14):.1f}"/>',
           f'<line x1="{x + w / 2}" y1="{y}" x2="{x + w / 2}" y2="{y + h}" stroke="{CREAM_W}" stroke-width="{max(1.6, w / 24):.1f}"/>',
           f'<line x1="{x}" y1="{y + h / 2}" x2="{x + w}" y2="{y + h / 2}" stroke="{CREAM_W}" stroke-width="{max(1.6, w / 24):.1f}"/>']
    if curtains:
        cg = d.lin([(0, shade(curtains, 0.15)), (1, shade(curtains, -0.2))], 0, 0, 1, 0)
        for sx, cx in ((1, x), (-1, x + w)):
            out.append(f'<path d="M{cx - sx * w * 0.08:.1f} {y - h * 0.08:.1f} Q{cx + sx * w * 0.22:.1f} {y + h * 0.4:.1f} {cx + sx * w * 0.06:.1f} {y + h * 0.55:.1f} Q{cx + sx * w * 0.05:.1f} {y + h * 0.85:.1f} {cx - sx * w * 0.1:.1f} {y + h * 1.05:.1f} Z" fill="{cg}"/>')
        out.append(f'<rect x="{x - w * 0.12:.1f}" y="{y - h * 0.12:.1f}" width="{w * 1.24:.1f}" height="{max(2, h * 0.06):.1f}" rx="1" fill="{shade(FLOOR, -0.25)}"/>')
    return '\n'.join(out)


def frame(d, x, y, w, h, inner='heart'):
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="{GOLD}" stroke="{shade(GOLD, -0.35)}" stroke-width="1"/>',
           f'<rect x="{x + w * 0.14:.1f}" y="{y + h * 0.14:.1f}" width="{w * 0.72:.1f}" height="{h * 0.72:.1f}" fill="#fff8ee"/>']
    cx, cy = x + w / 2, y + h / 2
    if inner == 'heart':
        out.append(f'<path d="M{cx} {cy + h * 0.15:.1f} c{-w * 0.3:.1f} {-h * 0.22:.1f} {-w * 0.1:.1f} {-h * 0.45:.1f} 0 {-h * 0.2:.1f} c{w * 0.1:.1f} {-h * 0.25:.1f} {w * 0.3:.1f} {-h * 0.02:.1f} 0 {h * 0.2:.1f} Z" fill="{ROSE}"/>')
    elif inner == 'house':
        out.append(f'<path d="M{cx - w * 0.22:.1f} {cy + h * 0.2:.1f} v{-h * 0.2:.1f} l{w * 0.22:.1f} {-h * 0.18:.1f} l{w * 0.22:.1f} {h * 0.18:.1f} v{h * 0.2:.1f} Z" fill="{TEAL}"/>')
    elif inner == 'tree':
        out.append(f'<circle cx="{cx}" cy="{cy - h * 0.06:.1f}" r="{w * 0.2:.1f}" fill="#7fb35a"/><rect x="{cx - 1}" y="{cy + h * 0.06:.1f}" width="2" height="{h * 0.16:.1f}" fill="{WOOD}"/>')
    return '\n'.join(out)


def chair(d, x, y, s=1.0, color=ROSE, wood=FLOOR):
    """A little chair with a cushion, standing at (x, y)"""
    w = shade(wood, -0.15)
    return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-12" y="-46" width="24" height="30" rx="5" fill="{w}"/><rect x="-9" y="-43" width="18" height="24" rx="4" fill="{ball(d, color)}"/>'
            f'<rect x="-14" y="-18" width="28" height="7" rx="3" fill="{ball(d, color)}" {rim(color)}/>'
            f'<rect x="-12" y="-12" width="3.5" height="12" fill="{w}"/><rect x="8.5" y="-12" width="3.5" height="12" fill="{w}"/></g>')


def armchair(d, x, y, s=1.0, color=MINT):
    f = ball(d, color)
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="2" rx="28" ry="4" fill="#000" opacity="0.15"/>'
            f'<path d="M-22 -14 L-22 -46 Q-22 -56 0 -56 Q22 -56 22 -46 L22 -14 Z" fill="{f}" {rim(color)}/>'
            f'<rect x="-26" y="-30" width="12" height="24" rx="6" fill="{f}" {rim(color)}/><rect x="14" y="-30" width="12" height="24" rx="6" fill="{f}" {rim(color)}/>'
            f'<rect x="-16" y="-22" width="32" height="12" rx="5" fill="{shade(color, 0.12)}" {rim(color)}/>'
            f'<rect x="-22" y="-6" width="4" height="6" fill="{shade(FLOOR, -0.3)}"/><rect x="18" y="-6" width="4" height="6" fill="{shade(FLOOR, -0.3)}"/></g>')


def sofa(d, x, y, s=1.0, color=LILAC):
    f = ball(d, color)
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="2" rx="46" ry="4" fill="#000" opacity="0.15"/>'
            f'<rect x="-40" y="-46" width="80" height="34" rx="12" fill="{f}" {rim(color)}/>'
            f'<rect x="-46" y="-30" width="14" height="26" rx="7" fill="{f}" {rim(color)}/><rect x="32" y="-30" width="14" height="26" rx="7" fill="{f}" {rim(color)}/>'
            f'<rect x="-32" y="-22" width="31" height="14" rx="6" fill="{shade(color, 0.12)}" {rim(color)}/><rect x="1" y="-22" width="31" height="14" rx="6" fill="{shade(color, 0.12)}" {rim(color)}/>'
            f'<rect x="-40" y="-6" width="5" height="6" fill="{shade(FLOOR, -0.3)}"/><rect x="35" y="-6" width="5" height="6" fill="{shade(FLOOR, -0.3)}"/></g>')


def table_round(d, x, y, s=1.0, color=FLOOR):
    top = d.lin([(0, shade(color, 0.3)), (1, color)])
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="2" rx="18" ry="3" fill="#000" opacity="0.15"/>'
            f'<rect x="-2.5" y="-20" width="5" height="20" fill="{shade(color, -0.3)}"/><ellipse cx="0" cy="0" rx="9" ry="2.4" fill="{shade(color, -0.3)}"/>'
            f'<ellipse cx="0" cy="-21" rx="20" ry="5" fill="{shade(color, -0.25)}"/><ellipse cx="0" cy="-23" rx="20" ry="5" fill="{top}"/></g>')


def teacup(x, y, s=1.0, color=PINK):
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="0" rx="7" ry="2" fill="#fff" stroke="#d9cfd8" stroke-width="0.6"/>'
            f'<path d="M-5 -6 h10 q0 6 -5 6 q-5 0 -5 -6 Z" fill="{color}" stroke="{shade(color, -0.3)}" stroke-width="0.6"/><path d="M5 -5 q4 0 2 4" stroke="{shade(color, -0.3)}" stroke-width="1" fill="none"/></g>')


def teapot(x, y, s=1.0, color=MINT):
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="-8" rx="10" ry="8" fill="{color}" stroke="{shade(color, -0.35)}" stroke-width="0.8"/>'
            f'<path d="M9 -10 q8 -2 9 -8" stroke="{shade(color, -0.2)}" stroke-width="2.4" fill="none"/><path d="M-9 -12 q-6 2 -4 8" stroke="{shade(color, -0.2)}" stroke-width="2" fill="none"/>'
            f'<ellipse cx="0" cy="-15" rx="5" ry="1.6" fill="{shade(color, -0.15)}"/><circle cx="0" cy="-17" r="1.6" fill="{ROSE}"/><path d="M-4 -8 c-1 -2 -3 0 0 2 c3 -2 1 -4 0 -2 Z" fill="{ROSE}"/></g>')


def lamp_floor(d, x, y, s=1.0, shade_c=BUTTER):
    glow = d.rad([(0, '#ffe7a8', 0.5), (1, '#ffe7a8', 0)])
    return (f'<g transform="translate({x} {y}) scale({s})"><circle cx="0" cy="-48" r="22" fill="{glow}"/>'
            f'<ellipse cx="0" cy="0" rx="8" ry="2.4" fill="{shade(GOLD, -0.3)}"/><rect x="-1.2" y="-44" width="2.4" height="44" fill="{shade(GOLD, -0.3)}"/>'
            f'<path d="M-11 -42 L-7 -58 L7 -58 L11 -42 Z" fill="{shade_c}" stroke="{shade(shade_c, -0.3)}" stroke-width="0.8"/></g>')


def bed(d, x, y, w, s=1.0, cover=BLUE):
    f = ball(d, cover)
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="{w / 2}" cy="2" rx="{w * 0.55}" ry="4" fill="#000" opacity="0.15"/>'
            f'<rect x="-4" y="-34" width="8" height="34" rx="2" fill="{shade(FLOOR, -0.2)}"/><rect x="{w - 4}" y="-24" width="8" height="24" rx="2" fill="{shade(FLOOR, -0.2)}"/>'
            f'<rect x="0" y="-18" width="{w}" height="10" rx="3" fill="#fff" {rim("#e6e6e6")}/>'
            f'<rect x="{w * 0.3:.1f}" y="-22" width="{w * 0.7:.1f}" height="12" rx="5" fill="{f}" {rim(cover)}/>'
            f'<rect x="3" y="-26" width="{w * 0.26:.1f}" height="9" rx="4" fill="#fff" {rim("#e6e6e6")}/></g>')


def clock(x, y, r, color=CREAM_W):
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" stroke="{shade(GOLD, -0.2)}" stroke-width="{max(1.5, r / 6):.1f}"/>'
            + ''.join(f'<circle cx="{x + r * 0.72 * math.cos(a):.1f}" cy="{y + r * 0.72 * math.sin(a):.1f}" r="{r * 0.06:.1f}" fill="#5a5266"/>' for a in [k * math.pi / 6 for k in range(12)])
            + f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y - r * 0.55:.1f}" stroke="#3b3346" stroke-width="{r * 0.08:.1f}" stroke-linecap="round"/>'
            f'<line x1="{x}" y1="{y}" x2="{x + r * 0.4:.1f}" y2="{y + r * 0.1:.1f}" stroke="#3b3346" stroke-width="{r * 0.08:.1f}" stroke-linecap="round"/>')


def plant(d, x, y, s=1.0):
    pot = d.lin([(0, shade(PEACH, 0.15)), (1, shade('#d98c6a', -0.1))], 0, 0, 1, 0)
    leaves = ''.join(f'<ellipse cx="{x + (k - 2) * 4 * s:.1f}" cy="{y - 22 * s - abs(k - 2) * -3 * s:.1f}" rx="{3.4 * s:.1f}" ry="{9 * s:.1f}" fill="{shade("#6fa548", (k % 2) * 0.12)}" transform="rotate({(k - 2) * 22} {x + (k - 2) * 2 * s:.1f} {y - 12 * s:.1f})"/>' for k in range(5))
    return leaves + f'<path d="M{x - 8 * s} {y - 12 * s} L{x + 8 * s} {y - 12 * s} L{x + 6 * s} {y} L{x - 6 * s} {y} Z" fill="{pot}"/>'


def shelf_books(d, x, y, w, rows=2):
    cols = [ROSE, TEAL, BUTTER, LILAC, '#e9a07a', '#7a9ccc', MINT]
    out = []
    for r in range(rows):
        yy = y + r * 26
        out.append(f'<rect x="{x}" y="{yy}" width="{w}" height="4" fill="{shade(FLOOR, -0.15)}"/>')
        xx = x + 2
        i = r * 3
        while xx < x + w - 6:
            bw = d.rng.uniform(4, 7)
            bh = d.rng.uniform(14, 20)
            out.append(f'<rect x="{xx:.1f}" y="{yy - bh:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="1" fill="{cols[i % len(cols)]}"/>')
            xx += bw + 0.8
            i += 1
    return '\n'.join(out)


def heart_box(d, x, y, w, h):
    """The care box: white, with a pink heart (not a red cross)"""
    g = d.lin([(0, '#ffffff'), (1, '#ece3ea')])
    cx, cy = x + w / 2, y + h / 2
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{g}" stroke="#c9b8c6" stroke-width="1.2"/>'
            f'<rect x="{x + w * 0.35:.1f}" y="{y - 4}" width="{w * 0.3:.1f}" height="5" rx="2" fill="#c9b8c6"/>'
            f'<path d="M{cx} {cy + h * 0.25:.1f} c{-w * 0.28:.1f} {-h * 0.25:.1f} {-w * 0.1:.1f} {-h * 0.5:.1f} 0 {-h * 0.24:.1f} c{w * 0.1:.1f} {-h * 0.26:.1f} {w * 0.28:.1f} {-h * 0.01:.1f} 0 {h * 0.24:.1f} Z" fill="{ROSE}"/>')


def growth_chart(x, y, w, h):
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="#fffaf0" stroke="{shade(BUTTER, -0.3)}" stroke-width="1.2"/>']
    cols = [ROSE, '#e9a07a', BUTTER, MINT, BLUE, LILAC]
    for k in range(6):
        out.append(f'<rect x="{x + w * 0.15:.1f}" y="{y + h * k / 6:.1f}" width="{w * 0.35:.1f}" height="{h / 6:.1f}" fill="{cols[k]}"/>')
        out.append(f'<line x1="{x + w * 0.55:.1f}" y1="{y + h * k / 6:.1f}" x2="{x + w * 0.85:.1f}" y2="{y + h * k / 6:.1f}" stroke="#8a7c88" stroke-width="1"/>')
    out.append(star(x + w * 0.7, y + h * 0.35, w * 0.12, GOLD))
    return '\n'.join(out)


def scale_toy(d, x, y, s=1.0):
    g = d.lin([(0, '#ffffff'), (1, '#d8dde3')])
    return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-14" y="-6" width="28" height="6" rx="2" fill="{g}" stroke="#aeb6bf" stroke-width="0.8"/>'
            f'<circle cx="0" cy="-3" r="2" fill="{ROSE}"/></g>')


def lightbox(d, x, y, w, h):
    """The x-ray light box on the wall, showing a friendly bone"""
    g = d.lin([(0, '#eaf6fd'), (1, '#bfdff1')])
    return (f'<rect x="{x - 3}" y="{y - 3}" width="{w + 6}" height="{h + 6}" rx="3" fill="#9aa6b2"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="{g}"/>'
            + bone(x + w / 2, y + h / 2, w * 0.6, -20, '#ffffff'))


def bone(cx, cy, w, ang=0, color='#f3ead6'):
    return (f'<g transform="rotate({ang} {cx} {cy})"><rect x="{cx - w / 2}" y="{cy - w * 0.08:.1f}" width="{w}" height="{w * 0.16:.1f}" rx="{w * 0.08:.1f}" fill="{color}" stroke="{shade(color, -0.3)}" stroke-width="0.8"/>'
            + ''.join(f'<circle cx="{cx + sx * w / 2:.1f}" cy="{cy + sy * w * 0.1:.1f}" r="{w * 0.12:.1f}" fill="{color}" stroke="{shade(color, -0.3)}" stroke-width="0.8"/>' for sx in (-1, 1) for sy in (-1, 1))
            + '</g>')


def rug(d, cx, cy, rx, ry, color=PINK, border=None):
    """A round rug with a stitched border (border: the stitch's width; small by default, as on a small rug)"""
    f = d.rad([(0, shade(color, 0.15)), (1, shade(color, -0.12))])
    bw = border or max(1.2, min(ry / 10, 3))
    return (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{f}"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx * 0.86:.1f}" ry="{ry * 0.84:.1f}" fill="none" stroke="#fff" stroke-width="{bw:.1f}" opacity="0.7" stroke-dasharray="{bw * 2.5:.1f} {bw * 1.8:.1f}"/>')


def rocking_chair(d, x, y, s=1.0, color=LILAC):
    w = shade(FLOOR, -0.2)
    return (f'<g transform="translate({x} {y}) scale({s})"><path d="M-22 0 Q0 8 22 0" stroke="{w}" stroke-width="4" fill="none" stroke-linecap="round"/>'
            f'<rect x="-14" y="-50" width="5" height="48" rx="2" fill="{w}" transform="rotate(-8 -12 -26)"/><rect x="-16" y="-20" width="30" height="6" rx="3" fill="{w}"/>'
            f'<rect x="10" y="-22" width="4" height="22" fill="{w}"/><rect x="-14" y="-48" width="16" height="30" rx="5" fill="{ball(d, color)}" transform="rotate(-8 -6 -33)"/>'
            f'<path d="M-18 -26 Q-4 -34 14 -24 L12 -14 Q-2 -22 -16 -16 Z" fill="{ball(d, BUTTER)}" {rim(BUTTER)}/></g>')


def desk_bell(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="0" rx="8" ry="2" fill="#9aa0ad"/><path d="M-7 -1 Q-7 -10 0 -10 Q7 -10 7 -1 Z" fill="{GOLD}" stroke="{shade(GOLD, -0.35)}" stroke-width="0.8"/>'
            f'<circle cx="0" cy="-11" r="1.6" fill="{shade(GOLD, -0.2)}"/></g>')


def house_toy(d, x, y, s=1.0):
    """The dollhouse seen from outside (the way home): a door, windows, a roof, a path"""
    wall = d.lin([(0, shade(PEACH, 0.2)), (1, shade(PEACH, -0.1))], 0, 0, 1, 0)
    out = [f'<rect x="-44" y="-70" width="88" height="70" fill="{wall}" {rim(PEACH)}/>',
           f'<polygon points="44,-70 60,-80 60,-10 44,0" fill="{shade(PEACH, -0.22)}"/>',
           roof_side(d, 0, -116, 50, -68, 16, 10, ROSE),
           gable(d, -52, 52, -68, 48, ROSE, 5),
           f'<rect x="-10" y="-38" width="20" height="38" rx="9" fill="{TEAL}" {rim(TEAL)}/><circle cx="5" cy="-18" r="1.8" fill="{GOLD}"/>',
           f'<path d="M0 -32 c-3 -4 -7 0 0 4 c7 -4 3 -8 0 -4 Z" fill="#fff"/>',
           window_box(d, -36, -58, 18, 16, 'sky', PINK), window_box(d, 18, -58, 18, 16, 'sky', PINK),
           f'<circle cx="0" cy="-90" r="7" fill="{CREAM_W}" stroke="{shade(ROSE, -0.4)}" stroke-width="2"/><path d="M0 -87 c-2 -3 -5 0 0 3 c5 -3 2 -6 0 -3 Z" fill="{ROSE}"/>',
           f'<rect x="-50" y="-2" width="110" height="6" rx="2" fill="{shade(SLAB, -0.1)}"/>']
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def toy_car(d, x, y, s=1.0, color=TEAL):
    f = ball(d, color)
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="2" rx="30" ry="4" fill="#000" opacity="0.16"/>'
            f'<path d="M-28 -8 L-28 -18 Q-26 -24 -16 -24 L-10 -34 Q-6 -38 4 -38 L12 -38 Q18 -38 22 -30 L26 -24 Q30 -22 30 -16 L30 -8 Z" fill="{f}" {rim(color)}/>'
            f'<path d="M-8 -32 L-4 -26 L8 -26 L8 -34 L0 -34 Q-6 -34 -8 -32 Z M12 -34 L12 -26 L22 -26 L18 -32 Q16 -34 12 -34 Z" fill="#cfe9f7"/>'
            f'<circle cx="-16" cy="-6" r="7" fill="#3b3346"/><circle cx="-16" cy="-6" r="3" fill="#cfd5dc"/><circle cx="18" cy="-6" r="7" fill="#3b3346"/><circle cx="18" cy="-6" r="3" fill="#cfd5dc"/>'
            f'<path d="M2 -20 c-2 -3 -5 0 0 3 c5 -3 2 -6 0 -3 Z" fill="#fff"/></g>')


# ---------- the stations on the map (300×220) ----------
def draw_desk(d):
    d.add(room_box(d, BUTTER, 'dots', ROSE))
    d.add(window_box(d, 90, 82, 36, 30, 'garden'))
    d.add(frame(d, 210, 86, 22, 18, 'house'))
    d.add(f'<rect x="230" y="96" width="22" height="56" rx="3" fill="{TEAL}" {rim(TEAL)}/><circle cx="234" cy="126" r="1.8" fill="{GOLD}"/>')
    top = d.lin([(0, shade(FLOOR, 0.3)), (1, FLOOR)])
    d.add(f'<rect x="120" y="140" width="80" height="10" rx="3" fill="{top}"/><rect x="124" y="150" width="72" height="26" fill="{shade(FLOOR, -0.2)}"/>')
    d.add(f'<rect x="130" y="156" width="60" height="14" rx="2" fill="{shade(FLOOR, -0.05)}"/><path d="M160 160 c-2 -3 -5 0 0 3 c5 -3 2 -6 0 -3 Z" fill="{ROSE}"/>')
    d.add(book(d, 150, 134, 26, -4))
    d.add(desk_bell(184, 140, 0.9))
    d.add(bunny(d, 170, 136, 0.7))
    d.add(doll(d, 92, 178, 0.75))
    d.add(plant(d, 66, 172, 0.9))


def draw_bench(d):
    d.add(room_box(d, MINT, 'stripes', '#7a9ccc'))
    for x in (100, 124, 148):
        d.add(f'<line x1="{x}" y1="94" x2="{x}" y2="102" stroke="{shade(FLOOR, -0.3)}" stroke-width="3" stroke-linecap="round"/>')
    d.add(f'<path d="M118 102 q6 18 -4 26 q-8 -10 4 -26 Z" fill="{PINK}"/>')
    d.add(clock(210, 92, 13))
    d.add(frame(d, 168, 88, 20, 16, 'tree'))
    top = d.lin([(0, shade(FLOOR, 0.3)), (1, FLOOR)])
    d.add(f'<rect x="96" y="128" width="120" height="22" rx="6" fill="{shade(FLOOR, -0.1)}"/><rect x="92" y="148" width="128" height="10" rx="4" fill="{top}"/>')
    d.add(f'<rect x="100" y="158" width="6" height="18" fill="{shade(FLOOR, -0.3)}"/><rect x="206" y="158" width="6" height="18" fill="{shade(FLOOR, -0.3)}"/>')
    d.add(f'<rect x="108" y="138" width="30" height="12" rx="6" fill="{ball(d, PINK)}"/>')
    d.add(doll(d, 166, 150, 0.7, LILAC, '#8a5a3a', sitting=True))
    d.add(bunny(d, 238, 180, 0.55))
    d.add(rug(d, 150, 176, 60, 8, LILAC))


def draw_measure(d):
    d.add(room_box(d, BLUE, 'stars', ROSE))
    d.add(growth_chart(96, 80, 26, 70))
    d.add(window_box(d, 196, 82, 34, 28, 'sky', BUTTER))
    d.add(rug(d, 156, 172, 54, 9, BUTTER))
    d.add(scale_toy(d, 126, 176, 1.1))
    d.add(doll(d, 126, 172, 0.72, TEAL, '#c9824a'))
    d.add(bunny(d, 180, 180, 0.68))
    d.add(f'<path d="M196 150 q14 6 8 16" stroke="#9aa0ad" stroke-width="2" fill="none"/>')
    d.add(f'<rect x="216" y="134" width="30" height="20" rx="3" fill="{CREAM_W}" {rim(CREAM_W)}/>' + heart_box(d, 222, 138, 18, 12))


def draw_guest(d):
    d.add(room_box(d, PEACH, 'hearts', '#7a9ccc'))
    d.add(window_box(d, 110, 80, 40, 32, 'garden', MINT))
    d.add(frame(d, 190, 84, 24, 20, 'heart'))
    d.add(sofa(d, 164, 158, 0.8, LILAC))
    d.add(armchair(d, 90, 176, 0.7, MINT))
    d.add(rug(d, 156, 178, 56, 8, PINK))
    d.add(table_round(d, 196, 184, 0.8))
    d.add(teapot(192, 166, 0.7))
    d.add(teacup(204, 166, 0.7))
    d.add(lamp_floor(d, 236, 168, 0.9))
    d.add(doll(d, 152, 150, 0.6, BUTTER, '#5a3a2a', sitting=True))


def draw_teddy(d):
    d.add(room_box(d, MINT, 'dots', ROSE))
    d.add(shelf_books(d, 88, 100, 50, 2))
    d.add(window_box(d, 196, 80, 34, 30, 'sky', PINK))
    d.add(bed(d, 92, 172, 70, 0.9, BLUE))
    d.add(teddy(d, 196, 180, 0.8))
    d.add(heart_box(d, 226, 138, 22, 16))
    d.add(f'<rect x="222" y="154" width="30" height="5" rx="2" fill="{shade(FLOOR, -0.1)}"/>')
    d.add(doll(d, 122, 152, 0.55, ROSE, '#c9824a', sitting=True))


def draw_xray(d):
    d.add(room_box(d, LILAC, 'stripes', '#7a9ccc'))
    d.add(lightbox(d, 100, 82, 40, 32))
    d.add(frame(d, 210, 88, 20, 16, 'tree'))
    top = d.lin([(0, shade(FLOOR, 0.3)), (1, FLOOR)])
    d.add(f'<rect x="150" y="142" width="80" height="8" rx="3" fill="{top}"/><rect x="156" y="150" width="6" height="26" fill="{shade(FLOOR, -0.3)}"/><rect x="218" y="150" width="6" height="26" fill="{shade(FLOOR, -0.3)}"/>')
    d.add(f'<g transform="translate(176 142) scale(0.6)"><rect x="-16" y="-6" width="32" height="6" rx="2" fill="#4e5260"/><path d="M-4 -6 L-4 -26 Q-4 -40 8 -46 L12 -40 Q4 -36 4 -26 L4 -6 Z" fill="#4e5260"/><rect x="2" y="-62" width="9" height="30" rx="3" fill="#cfd5dc" transform="rotate(-20 6 -47)"/></g>')
    d.add(''.join(f'<rect x="{196 + k * 8}" y="{128 + (k % 2) * 3}" width="6" height="{14 - (k % 2) * 3}" rx="2" fill="{c}"/>' for k, c in enumerate((PINK, MINT, BUTTER))))
    d.add(bunny(d, 120, 178, 0.68))
    d.add(doll(d, 82, 180, 0.62, BUTTER, '#c9824a'))


def draw_care(d):
    d.add(room_box(d, PINK, 'hearts', '#7a9ccc'))
    d.add(window_box(d, 196, 80, 34, 30, 'garden', MINT))
    d.add(bed(d, 92, 172, 72, 0.9, MINT))
    d.add(doll(d, 124, 152, 0.55, TEAL, '#8a5a3a', sitting=True))
    d.add(f'<rect x="124" y="140" width="8" height="5" rx="2" fill="#fff" stroke="{ROSE}" stroke-width="0.8"/>')
    d.add(bunny(d, 194, 180, 0.7))
    d.add(heart_box(d, 222, 150, 26, 18))
    d.add(f'<rect x="96" y="96" width="34" height="5" rx="2" fill="{shade(FLOOR, -0.1)}"/><rect x="100" y="86" width="10" height="10" rx="2" fill="#fff"/><rect x="114" y="88" width="12" height="8" rx="4" fill="{PINK}"/>')


def draw_owl(d):
    d.add(room_box(d, BUTTER, 'stars', ROSE))
    d.add(window_box(d, 100, 80, 40, 34, 'night', LILAC))
    d.add(shelf_books(d, 176, 100, 64, 2))
    d.add(f'<rect x="84" y="140" width="72" height="6" rx="3" fill="{shade(FLOOR, -0.1)}"/>')
    d.add(owl(d, 120, 140, 0.8))
    d.add(armchair(d, 210, 180, 0.7, ROSE))
    d.add(doll(d, 212, 164, 0.5, MINT, '#5a3a2a', sitting=True))
    d.add(book(d, 160, 170, 24, 8))
    d.add(rug(d, 156, 176, 56, 8, LILAC))


def draw_quiet(d):
    d.add(room_box(d, LILAC, 'dots', '#7a9ccc'))
    d.add(clock(116, 96, 16))
    d.add(window_box(d, 196, 80, 34, 30, 'sky', PINK))
    d.add(rocking_chair(d, 150, 178, 1.0, PINK))
    d.add(doll(d, 148, 156, 0.5, BUTTER, '#c9824a', sitting=True))
    d.add(plant(d, 88, 176, 1.0))
    d.add(lamp_floor(d, 232, 172, 0.9))
    d.add(rug(d, 152, 178, 54, 8, MINT))
    d.add(f'<g transform="translate(206 176) scale(0.8)">' + teacup(0, 0, 1.0, BUTTER) + '</g>')


def draw_home(d):
    d.add(f'<ellipse cx="150" cy="204" rx="134" ry="11" fill="#000" opacity="0.16"/>')
    d.add(mound(d, '#9ccb6e', '#c9a888'))
    d.add(f'<path d="M118 200 Q140 190 146 176 L160 176 Q168 190 194 200 Z" fill="#e3cc98"/>')
    d.add(house_toy(d, 150, 176, 1.0))
    d.add(toy_car(d, 236, 194, 0.9))
    d.add(doll(d, 108, 192, 0.7, ROSE, '#c9824a'))
    d.add(bunny(d, 74, 196, 0.55))
    d.add(teddy(d, 254, 168, 0.4, coat=False))
    d.add(bush(d, 40, 184, 0.8))


STATIONS = {
    'desk': (draw_desk, 'the reception desk (reception)'),
    'bench': (draw_bench, 'the bench in the corridor (waiting before the checks)'),
    'measure': (draw_measure, 'the measuring room (the checks)'),
    'guest': (draw_guest, 'the guest room (waiting for the doctor)'),
    'teddy': (draw_teddy, "the teddy-bear doctor's room (the doctor)"),
    'xray': (draw_xray, 'the small test room (tests)'),
    'care': (draw_care, 'the treatment corner (treatment)'),
    'owl': (draw_owl, 'the owl comes to visit (consultation)'),
    'quiet': (draw_quiet, 'the quiet waiting room (waiting for results)'),
    'home': (draw_home, 'going home (the end)'),
}


# ---------- the scenes: each room as seen by someone standing in it (364×340) ----------
BACK = (64, 44, 300, 230)


def doll_room(d, wall, pattern, floor=FLOOR, back=BACK):
    """Inside a room of the dollhouse: papered walls, a wooden floor, a skirting board, the ceiling"""
    x0, y0, x1, y1 = back
    out = [wallpaper(d, f'{x0},{y0} {x1},{y0} {x1},{y1} {x0},{y1}', wall, pattern),
           wallpaper(d, f'0,0 {x0},{y0} {x0},{y1} 0,{SH}', shade(wall, -0.1), pattern),
           wallpaper(d, f'{SW},0 {x1},{y0} {x1},{y1} {SW},{SH}', shade(wall, -0.16), pattern)]
    sh = d.lin([(0, '#000', 0.2), (1, '#000', 0)], 0, 0, 1, 0)
    sh2 = d.lin([(0, '#000', 0), (1, '#000', 0.24)], 0, 0, 1, 0)
    out.append(f'<polygon points="0,0 {x0},{y0} {x0},{y1} 0,{SH}" fill="{sh}"/><polygon points="{SW},0 {x1},{y0} {x1},{y1} {SW},{SH}" fill="{sh2}"/>')
    out.append(f'<polygon points="0,0 {SW},0 {x1},{y0} {x0},{y0}" fill="{CREAM_W}"/>')
    out.append(f'<polygon points="{x0},{y0} {x1},{y0} {x1 + 6},{y0 - 5} {x0 - 6},{y0 - 5}" fill="{shade(CREAM_W, -0.12)}"/>')
    fl = f'0,{SH} {x0},{y1} {x1},{y1} {SW},{SH}'
    out.append(f'<polygon points="{fl}" fill="{floor}"/>')
    fclip = d.clip(f'<polygon points="{fl}"/>')
    lines = [f'<line x1="{x0 + (x1 - x0) * k / 10:.1f}" y1="{y1}" x2="{SW * k / 10:.1f}" y2="{SH}" stroke="{shade(floor, -0.22)}" stroke-width="1.4"/>' for k in range(1, 10)]
    fsh = d.lin([(0, '#000', 0.2), (0.5, '#000', 0)])
    out.append(f'<g clip-path="{fclip}">' + ''.join(lines) + f'<rect x="0" y="{y1}" width="{SW}" height="{SH - y1}" fill="{fsh}"/></g>')
    out.append(f'<rect x="{x0}" y="{y1 - 12}" width="{x1 - x0}" height="12" fill="{CREAM_W}"/>')
    out.append(f'<polygon points="0,{SH - 20} {x0},{y1 - 12} {x0},{y1} 0,{SH}" fill="{shade(CREAM_W, -0.08)}"/><polygon points="{SW},{SH - 20} {x1},{y1 - 12} {x1},{y1} {SW},{SH}" fill="{shade(CREAM_W, -0.16)}"/>')
    return '\n'.join(out)


def sc_desk(d):
    d.add(doll_room(d, BUTTER, 'dots'))
    d.add(window_box(d, 84, 70, 70, 60, 'garden'))
    d.add(frame(d, 190, 74, 38, 30, 'house'))
    d.add(f'<rect x="248" y="96" width="44" height="134" rx="4" fill="{TEAL}" {rim(TEAL)}/><circle cx="256" cy="164" r="3" fill="{GOLD}"/><path d="M270 120 c-4 -5 -9 0 0 6 c9 -6 4 -11 0 -6 Z" fill="#fff"/>')
    d.add(plant(d, 40, 330, 2.2))
    # the reception desk, the entrance book open on it, the bell, the bunny behind
    d.add(bunny(d, 210, 236, 1.5))
    top = d.lin([(0, shade(FLOOR, 0.3)), (1, FLOOR)])
    d.add(f'<rect x="70" y="226" width="250" height="20" rx="5" fill="{top}"/><rect x="80" y="246" width="230" height="94" fill="{shade(FLOOR, -0.2)}"/>')
    d.add(f'<rect x="96" y="258" width="88" height="60" rx="4" fill="none" stroke="{shade(FLOOR, -0.4)}" stroke-width="2"/><rect x="206" y="258" width="88" height="60" rx="4" fill="none" stroke="{shade(FLOOR, -0.4)}" stroke-width="2"/>')
    d.add(f'<path d="M195 280 c-5 -7 -12 0 0 8 c12 -8 5 -15 0 -8 Z" fill="{ROSE}"/>')
    d.add(book(d, 150, 210, 84, -4))
    d.add(f'<path d="M186 214 l18 -24" stroke="{ROSE}" stroke-width="3" stroke-linecap="round"/>')
    d.add(desk_bell(270, 226, 2.0))


def sc_bench(d):
    d.add(doll_room(d, MINT, 'stripes'))
    for x in (100, 140, 180):
        d.add(f'<line x1="{x}" y1="86" x2="{x}" y2="102" stroke="{shade(FLOOR, -0.3)}" stroke-width="5" stroke-linecap="round"/>')
    d.add(f'<path d="M134 100 q12 32 -6 46 q-14 -18 6 -46 Z" fill="{PINK}"/><path d="M178 100 q10 28 -2 40 q-12 -16 2 -40 Z" fill="{BUTTER}"/>')
    d.add(clock(250, 96, 26))
    d.add(frame(d, 206, 140, 34, 28, 'tree'))
    d.add(rug(d, 182, 300, 150, 28, LILAC))
    top = d.lin([(0, shade(FLOOR, 0.3)), (1, FLOOR)])
    d.add(f'<rect x="20" y="226" width="250" height="40" rx="10" fill="{shade(FLOOR, -0.1)}"/><rect x="10" y="262" width="270" height="18" rx="6" fill="{top}"/>')
    d.add(f'<rect x="24" y="280" width="12" height="56" fill="{shade(FLOOR, -0.3)}"/><rect x="254" y="280" width="12" height="56" fill="{shade(FLOOR, -0.3)}"/>')
    d.add(f'<rect x="40" y="240" width="70" height="24" rx="12" fill="{ball(d, PINK)}"/><rect x="180" y="240" width="70" height="24" rx="12" fill="{ball(d, BUTTER)}"/>')
    d.add(bunny(d, 322, 330, 1.4))
    d.add(doll(d, 140, 262, 1.4, LILAC, '#8a5a3a', sitting=True))


def sc_measure(d):
    d.add(doll_room(d, BLUE, 'stars'))
    d.add(growth_chart(84, 56, 50, 170))
    d.add(window_box(d, 196, 70, 70, 60, 'sky', BUTTER))
    d.add(rug(d, 182, 300, 150, 28, BUTTER))
    d.add(scale_toy(d, 120, 300, 3.0))
    d.add(doll(d, 120, 296, 2.0, TEAL, '#c9824a'))
    d.add(bunny(d, 250, 326, 1.8))
    d.add(f'<path d="M232 262 q-30 10 -60 0" stroke="{BUTTER}" stroke-width="5" fill="none" stroke-dasharray="4 3"/>')
    d.add(heart_box(d, 282, 190, 50, 34))


def sc_guest(d):
    d.add(doll_room(d, PEACH, 'hearts'))
    d.add(window_box(d, 140, 64, 84, 70, 'garden', MINT))
    d.add(frame(d, 78, 84, 40, 34, 'heart'))
    d.add(frame(d, 250, 90, 34, 28, 'tree'))
    d.add(lamp_floor(d, 300, 300, 2.0))
    d.add(sofa(d, 180, 252, 1.8, LILAC))
    d.add(doll(d, 210, 226, 1.1, BUTTER, '#5a3a2a', sitting=True))
    d.add(rug(d, 182, 312, 160, 24, PINK))
    d.add(table_round(d, 100, 330, 2.2))
    d.add(teapot(86, 276, 1.8))
    d.add(teacup(126, 278, 1.7))
    d.add(armchair(d, 330, 340, 1.8, MINT))


def sc_teddy(d):
    d.add(doll_room(d, MINT, 'dots'))
    d.add(shelf_books(d, 84, 90, 92, 2))
    d.add(window_box(d, 206, 66, 70, 60, 'sky', PINK))
    d.add(f'<rect x="210" y="150" width="70" height="6" rx="3" fill="{shade(FLOOR, -0.1)}"/>' + heart_box(d, 220, 126, 40, 26))
    d.add(bed(d, 18, 318, 112, 1.6, BLUE))
    d.add(doll(d, 96, 288, 1.15, ROSE, '#c9824a', sitting=True))
    d.add(teddy(d, 262, 330, 2.2))


def sc_xray(d):
    d.add(doll_room(d, LILAC, 'stripes'))
    d.add(lightbox(d, 100, 66, 100, 80))
    d.add(frame(d, 236, 80, 40, 32, 'tree'))
    top = d.lin([(0, shade(FLOOR, 0.3)), (1, FLOOR)])
    d.add(f'<rect x="150" y="238" width="200" height="16" rx="4" fill="{top}"/><rect x="164" y="254" width="12" height="70" fill="{shade(FLOOR, -0.3)}"/><rect x="326" y="254" width="12" height="70" fill="{shade(FLOOR, -0.3)}"/>')
    d.add(f'<g transform="translate(220 238) scale(1.6)"><rect x="-16" y="-6" width="32" height="6" rx="2" fill="#4e5260"/><path d="M-4 -6 L-4 -26 Q-4 -40 8 -46 L12 -40 Q4 -36 4 -26 L4 -6 Z" fill="#4e5260"/><rect x="2" y="-62" width="9" height="30" rx="3" fill="#cfd5dc" transform="rotate(-20 6 -47)"/></g>')
    d.add(''.join(f'<rect x="{270 + k * 18}" y="{204 + (k % 2) * 6}" width="14" height="{34 - (k % 2) * 6}" rx="5" fill="{c}"/>' for k, c in enumerate((PINK, MINT, BUTTER))))
    d.add(bunny(d, 100, 330, 1.7))
    d.add(doll(d, 40, 330, 1.4, BUTTER, '#c9824a'))


def sc_care(d):
    d.add(doll_room(d, PINK, 'hearts'))
    d.add(window_box(d, 200, 64, 74, 62, 'garden', MINT))
    d.add(f'<rect x="80" y="96" width="80" height="8" rx="3" fill="{shade(FLOOR, -0.1)}"/><rect x="86" y="74" width="22" height="22" rx="4" fill="#fff" {rim("#e6e6e6")}/><rect x="114" y="80" width="30" height="16" rx="8" fill="{PINK}"/>')
    d.add(bed(d, 18, 318, 112, 1.6, MINT))
    d.add(doll(d, 96, 288, 1.15, TEAL, '#8a5a3a', sitting=True))
    d.add(f'<rect x="92" y="262" width="18" height="9" rx="3" fill="#fff" stroke="{ROSE}" stroke-width="1.2"/>')
    d.add(bunny(d, 268, 330, 1.9))
    d.add(heart_box(d, 296, 230, 52, 36))


def sc_owl(d):
    d.add(doll_room(d, BUTTER, 'stars'))
    d.add(window_box(d, 84, 62, 90, 78, 'night', LILAC))
    d.add(shelf_books(d, 200, 84, 92, 2))
    d.add(f'<rect x="70" y="170" width="120" height="10" rx="4" fill="{shade(FLOOR, -0.1)}"/>')
    d.add(owl(d, 130, 170, 1.8))
    d.add(rug(d, 182, 306, 160, 26, LILAC))
    d.add(armchair(d, 260, 330, 2.0, ROSE))
    d.add(doll(d, 262, 290, 1.1, MINT, '#5a3a2a', sitting=True))
    d.add(book(d, 140, 300, 60, 6))


def sc_quiet(d):
    d.add(doll_room(d, LILAC, 'dots'))
    d.add(clock(130, 100, 34))
    d.add(window_box(d, 210, 66, 70, 60, 'sky', PINK))
    d.add(rug(d, 182, 306, 160, 26, MINT))
    d.add(rocking_chair(d, 182, 320, 2.6, PINK))
    d.add(doll(d, 176, 262, 1.3, BUTTER, '#c9824a', sitting=True))
    d.add(plant(d, 50, 336, 2.4))
    d.add(lamp_floor(d, 310, 310, 2.0))
    d.add(teacup(290, 328, 2.0, BUTTER))


def sc_home(d):
    d.add(sky(d, SH, '#7fb3d8', '#eaf4fa'))
    d.add(cloud(80, 60, 0.9), cloud(290, 40, 0.7))
    d.add(band(SW, SH, 230, 6, 0.4, '#a9d17c'))
    d.add(f'<path d="M110 340 Q160 280 170 236 L194 236 Q204 280 254 340 Z" fill="#e3cc98"/>')
    d.add(house_toy(d, 182, 236, 2.2))
    d.add(bush(d, 40, 250, 1.6), bush(d, 330, 252, 1.5))
    d.add(toy_car(d, 290, 320, 2.0))
    d.add(doll(d, 150, 330, 1.6, ROSE, '#c9824a'))
    d.add(bunny(d, 80, 334, 1.3))
    d.add(teddy(d, 220, 330, 1.2, coat=False))
    d.add(owl(d, 320, 196, 0.9))


SCENES = {
    'desk': (sc_desk, 'at the reception desk (reception)'),
    'bench': (sc_bench, 'on the bench in the corridor (waiting before the checks)'),
    'measure': (sc_measure, 'in the measuring room (the checks)'),
    'guest': (sc_guest, 'in the guest room (waiting for the doctor)'),
    'teddy': (sc_teddy, "in the teddy-bear doctor's room (the doctor)"),
    'xray': (sc_xray, 'in the small test room (tests)'),
    'care': (sc_care, 'in the treatment corner (treatment)'),
    'owl': (sc_owl, 'with the owl who comes to visit (consultation)'),
    'quiet': (sc_quiet, 'in the quiet waiting room (waiting for results)'),
    'home': (sc_home, 'in front of the dollhouse, going home (the end)'),
}


# ---------- the map backgrounds: a playroom, its wall at the top, its wooden floor and a big rug ----------
def toy_block(d, x, y, s, color):
    top = shade(color, 0.25)
    return (f'<g transform="translate({x} {y}) scale({s})"><polygon points="0,0 20,0 20,20 0,20" fill="{color}"/>'
            f'<polygon points="0,0 8,-6 28,-6 20,0" fill="{top}"/><polygon points="20,0 28,-6 28,14 20,20" fill="{shade(color, -0.25)}"/>'
            f'<path d="M10 14 c-4 -6 -9 0 0 4 c9 -4 4 -10 0 -4 Z" fill="#fff" opacity="0.85"/></g>')


def toy_ball(d, x, y, r):
    g = d.rad([(0, '#fff'), (0.3, '#f7b2c4'), (1, '#c2618f')], 0.35, 0.3, 0.75)
    return f'<ellipse cx="{x}" cy="{y + r * 0.9:.1f}" rx="{r:.1f}" ry="{r * 0.25:.1f}" fill="#000" opacity="0.15"/><circle cx="{x}" cy="{y}" r="{r}" fill="{g}"/><path d="M{x - r} {y} Q{x} {y - r * 0.5:.1f} {x + r} {y}" stroke="#fff" stroke-width="{r * 0.15:.1f}" fill="none" opacity="0.8"/>'


def background(W, H, wall_h, blocks_, balls, windows, rug_, seed, comment):
    d = Doc(W, H, seed)
    s = (W / 412) ** 0.5
    # the wall: deep plum with a soft pattern (the white buttons above stay readable), a rail along it
    d.add(wallpaper(d, f'0,0 {W},0 {W},{wall_h} 0,{wall_h}', PLUM, 'stars', shade(PLUM, 0.12)))
    for wx, ww in windows:
        d.add(window_box(d, wx, wall_h * 0.28, ww, ww * 0.8, 'garden', PINK))
    d.add(f'<rect x="0" y="{wall_h - 16 * s:.1f}" width="{W}" height="{16 * s:.1f}" fill="{CREAM_W}"/><rect x="0" y="{wall_h - 4 * s:.1f}" width="{W}" height="{4 * s:.1f}" fill="{shade(CREAM_W, -0.2)}"/>')
    # the floor: planks running away, a soft light from the windows
    fl = f'0,{wall_h} {W},{wall_h} {W},{H} 0,{H}'
    d.add(f'<polygon points="{fl}" fill="{d.lin([(0, shade(FLOOR, 0.12)), (1, shade(FLOOR, -0.08))])}"/>')
    step = 26 * s
    y = wall_h + step
    while y < H:
        d.add(f'<line x1="0" y1="{y:.0f}" x2="{W}" y2="{y:.0f}" stroke="{shade(FLOOR, -0.18)}" stroke-width="{1.2 * s:.1f}"/>')
        for _ in range(int(W / (140 * s)) + 1):
            xx = d.rng.uniform(0, W)
            d.add(f'<line x1="{xx:.0f}" y1="{y - step:.0f}" x2="{xx:.0f}" y2="{y:.0f}" stroke="{shade(FLOOR, -0.18)}" stroke-width="{1.2 * s:.1f}"/>')
        y += step
    d.add(f'<rect x="0" y="{wall_h}" width="{W}" height="{40 * s:.0f}" fill="{d.lin([(0, "#000", 0.18), (1, "#000", 0)])}"/>')
    cx, cy, rx, ry = rug_
    d.add(rug(d, cx, cy, rx, ry, '#f1d3dd', 2.4 * s))
    d.add(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx * 0.62:.0f}" ry="{ry * 0.62:.0f}" fill="none" stroke="{shade("#f1d3dd", -0.08)}" stroke-width="{2 * s:.1f}"/>')
    for b in blocks_:
        d.add(toy_block(d, *b))
    for b in balls:
        d.add(toy_ball(d, *b))
    return d.svg(f'{WORLD} world: {comment}', grain=0.025, wobble=1.0, clay=False)


def portrait_bg():
    return background(
        412, 1100, 200,
        blocks_=[(360, 250, 0.9, '#7a9ccc'), (20, 480, 1.0, ROSE), (370, 700, 1.0, TEAL), (24, 980, 1.1, '#e9a07a')],
        balls=[(392, 560, 14), (30, 760, 12)],
        windows=[], rug_=(206, 640, 250, 380), seed=41,
        comment='the portrait map background (the 412×939 frame, drawn 412×1100 so the second map can move it)')


def landscape_bg():
    return background(
        1920, 1080, 330,
        blocks_=[(1560, 420, 2.4, '#7a9ccc'), (1700, 460, 2.0, ROSE), (80, 480, 2.4, TEAL), (1240, 960, 2.4, '#e9a07a'), (560, 980, 2.2, BUTTER)],
        balls=[(1840, 760, 34), (480, 860, 30)],
        windows=[(420, 200), (820, 200)], rug_=(960, 720, 860, 300), seed=42,
        comment='the landscape map background (the 1920×1080 frame)')


def sheet_floor():
    d = Doc(364, 340, 49)
    d.add(wallpaper(d, '0,0 364,0 364,340 0,340', '#fbeef3', 'dots', '#f3d9e3'))
    d.add(f'<rect x="0" y="230" width="364" height="110" fill="{d.lin([(0, shade(FLOOR, 0.25)), (1, FLOOR)])}"/><rect x="0" y="222" width="364" height="10" fill="{CREAM_W}"/>')
    return d.svg(f'{WORLD} world: the panel behind a picture on its sheet', clay=False)


def celebrate():
    d = Doc(640, 480, 51)
    d.add(f'<rect width="640" height="480" fill="{d.lin([(0, "#7fb3d8"), (1, "#eaf4fa")])}"/>')
    d.add(cloud(120, 90, 1.2), cloud(520, 80, 1.0))
    d.add(band(640, 480, 330, 10, 0.5, '#a9d17c'), band(640, 480, 380, 10, 2.0, '#9ccb6e'))
    figures = Doc(640, 480, 52, prefix='v')
    figures.add(house_toy(figures, 320, 360, 2.4))
    figures.add(toy_car(figures, 520, 440, 1.8))
    figures.add(doll(figures, 250, 450, 1.8, ROSE, '#c9824a'))
    figures.add(bunny(figures, 160, 450, 1.4))
    figures.add(teddy(figures, 400, 450, 1.3, coat=False))
    figures.add(owl(figures, 90, 330, 1.1))
    d.defs.extend(figures.defs)
    d.add('<g filter="url(#clay)">' + '\n'.join(figures.body) + '</g>')
    cols = [ROSE, BUTTER, TEAL, LILAC]
    d.add('<path d="M0 36 Q320 76 640 36" fill="none" stroke="#6b4329" stroke-width="2"/>')
    for i in range(16):
        x = 8 + i * 40
        t = x / 640
        y = 36 + 40 * 4 * t * (1 - t) * 0.5
        d.add(f'<path d="M{x} {y:.1f} l14 24 l14 -24 Z" fill="{cols[i % 4]}"/>')
    return d.svg(f'{WORLD} world: going home happy (the celebration screen)', clay=False)


def card():
    """The world's card on the world select screen: the dollhouse with its friends"""
    d = Doc(300, 220, 53)
    d.add(f'<ellipse cx="150" cy="204" rx="120" ry="10" fill="#000" opacity="0.16"/>')
    d.add(house_toy(d, 140, 196, 1.3))
    d.add(bunny(d, 60, 200, 0.6))
    d.add(teddy(d, 236, 200, 0.6, coat=False))
    return d.svg(f'{WORLD} world: the card on the world select screen')



def main():
    files = {}
    for k, (f, c) in STATIONS.items():
        files[f'station-{k}.svg'] = station(k, f, c, WORLD, base=lambda d: '')
    for k, (f, c) in SCENES.items():
        files[f'scene-{k}.svg'] = scene(k, f, c, WORLD)
    files['map-portrait.svg'] = portrait_bg()
    files['map-landscape.svg'] = landscape_bg()
    files['sheet-floor.svg'] = sheet_floor()
    files['celebrate.svg'] = celebrate()
    files['card.svg'] = card()
    write('dollhouse', files)


if __name__ == '__main__':
    main()

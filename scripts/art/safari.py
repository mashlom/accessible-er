"""The safari world's earlier pictures, drawn in code (drafts in scripts/art/build/safari/; the app uses the delivered ones): a safari camp in the savanna. The guide checks the gear;
the chief, a wise old lion (the king of the savanna), decides what to do; friendly animals all around.

    python3 scripts/art/safari.py

Drawn with the shared tools in lib.py and the camp tools of the dinosaur world (dino.py: tents, the jeep, the
explorer, the microscope, the first-aid box), plus the tools of this world below: acacia trees, tall grass, the
lion, the elephant, the giraffe, the zebra, meerkats.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa: E402,F403
from lib import SW, SH  # noqa: E402
import lib  # noqa: E402
from dino import (tent, jeep, explorer, microscope, hourglass, binoculars, kit, campfire, signboard, post, log, palisade,  # noqa: E402
                  thatch, log_wall, eye, shine, rim, body_fill)

WORLD = 'Safari'

# ---------- palette ----------
S_SKY0, S_SKY1 = '#b8612f', '#fbe3b8'
S_GRASS = '#cdb35c'
S_ROCK = '#c49a6c'
SAVANNA = '#d9bf6a'
ACACIA = '#7a9a3e'
LION = '#e0a548'
MANE = '#b86a2c'
ELEPHANT = '#a7a9b8'
GIRAFFE = '#f0c060'
ZEBRA = '#f4f1ea'
MEERKAT = '#cfa874'
CANVAS_S = '#efe0bc'


def acacia(d, x, y, s=1.0):
    """An acacia: a thin forked trunk and a wide flat crown"""
    trunk = d.lin([(0, shade('#8a6a44', 0.2)), (1, shade('#8a6a44', -0.35))], 0, 0, 1, 0)
    out = [f'<ellipse cx="{x}" cy="{y + 2 * s}" rx="{34 * s}" ry="{5 * s}" fill="#000" opacity="0.14"/>',
           f'<path d="M{x - 4 * s} {y} Q{x - 2 * s} {y - 30 * s} {x - 18 * s} {y - 52 * s} L{x - 13 * s} {y - 54 * s} Q{x + 2 * s} {y - 36 * s} {x + 2 * s} {y - 30 * s} Q{x + 8 * s} {y - 44 * s} {x + 22 * s} {y - 54 * s} L{x + 26 * s} {y - 51 * s} Q{x + 10 * s} {y - 34 * s} {x + 4 * s} {y} Z" fill="{trunk}"/>']
    crown = [(-34, -60, 26, 9), (0, -66, 34, 11), (32, -60, 26, 9), (-16, -70, 22, 8), (18, -70, 22, 8)]
    for dx, dy, rx, ry in crown:
        out.append(f'<ellipse cx="{x + dx * s:.1f}" cy="{y + dy * s:.1f}" rx="{rx * s:.1f}" ry="{ry * s:.1f}" fill="{shade(ACACIA, -0.12)}"/>')
    for dx, dy, rx, ry in crown:
        out.append(f'<ellipse cx="{x + (dx - 3) * s:.1f}" cy="{y + (dy - 3) * s:.1f}" rx="{rx * 0.8 * s:.1f}" ry="{ry * 0.6 * s:.1f}" fill="{shade(ACACIA, 0.12)}"/>')
    return '\n'.join(out)


def tall_grass(d, x, y, s=1.0, color=SAVANNA):
    """A clump of tall dry grass"""
    out = []
    for k in range(7):
        a = -0.6 + 1.2 * k / 6
        h = d.rng.uniform(14, 22) * s
        out.append(f'<path d="M{x + k * 1.6 * s - 5 * s:.1f} {y} q{a * 6 * s:.1f} {-h * 0.6:.1f} {a * 12 * s:.1f} {-h:.1f}" stroke="{shade(color, d.rng.uniform(-0.25, 0.05))}" stroke-width="{1.6 * s:.1f}" fill="none" stroke-linecap="round"/>')
    return '\n'.join(out)


def lion(d, x, y, s=1.0, face=1, chief=False):
    """A friendly lion sitting at (x, y): a round mane, a calm smile; the chief wears a little gold crown"""
    f = body_fill(d, LION)
    m = d.rad([(0, shade(MANE, 0.3)), (0.7, MANE), (1, shade(MANE, -0.35))], 0.4, 0.35, 0.75)
    out = [f'<ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity="0.15"/>',
           f'<path d="M-26 -6 Q-40 -10 -44 -26 Q-38 -16 -28 -14 Z" fill="{f}"/><circle cx="-44" cy="-28" r="4" fill="{MANE}"/>',
           f'<ellipse cx="-4" cy="-22" rx="24" ry="22" fill="{f}" {rim(LION)}/>',
           f'<ellipse cx="4" cy="-14" rx="12" ry="12" fill="{shade(LION, 0.3)}" opacity="0.8"/>',
           f'<rect x="-2" y="-12" width="10" height="13" rx="5" fill="{f}" {rim(LION)}/><rect x="10" y="-12" width="10" height="13" rx="5" fill="{f}" {rim(LION)}/>']
    for k in range(14):
        a = 2 * math.pi * k / 14
        out.append(f'<ellipse cx="{12 + 20 * math.cos(a):.1f}" cy="{-48 + 20 * math.sin(a):.1f}" rx="9" ry="7" fill="{m}" transform="rotate({math.degrees(a):.0f} {12 + 20 * math.cos(a):.1f} {-48 + 20 * math.sin(a):.1f})"/>')
    out += [f'<circle cx="12" cy="-48" r="20" fill="{m}"/>',
            f'<circle cx="12" cy="-48" r="14" fill="{f}" {rim(LION)}/>', shine(6, -56, 5, 3),
            f'<circle cx="2" cy="-60" r="4" fill="{f}"/><circle cx="22" cy="-60" r="4" fill="{f}"/>',
            f'<ellipse cx="12" cy="-42" rx="8" ry="6" fill="{shade(LION, 0.35)}"/>',
            f'<path d="M9 -46 h6 l-3 3 Z" fill="#6b3a2a"/><path d="M8 -40 q4 3 8 0" stroke="#3b2a24" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
            eye(7, -51, 2.4, 0.1), eye(17, -51, 2.4, 0.1)]
    if chief:
        out.append(f'<path d="M3 -66 l2 -9 l4 5 l3 -8 l3 8 l4 -5 l2 9 Z" fill="#ffd95a" stroke="{shade(GOLD, -0.35)}" stroke-width="0.8"/><circle cx="12" cy="-70" r="1.6" fill="#c4553f"/>')
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def elephant(d, x, y, s=1.0, face=1, glasses=False):
    """A round friendly elephant standing at (x, y): big ears, a curled trunk; with glasses, the savanna's expert"""
    f = body_fill(d, ELEPHANT)
    far = shade(ELEPHANT, -0.2)
    out = [f'<ellipse cx="0" cy="2" rx="40" ry="6" fill="#000" opacity="0.15"/>',
           f'<rect x="-24" y="-20" width="12" height="20" rx="5" fill="{far}"/><rect x="14" y="-20" width="12" height="20" rx="5" fill="{far}"/>',
           f'<path d="M-32 -30 q-10 6 -8 16" stroke="{far}" stroke-width="3" fill="none" stroke-linecap="round"/>',
           f'<ellipse cx="-2" cy="-32" rx="32" ry="24" fill="{f}" {rim(ELEPHANT)}/>', shine(-12, -44, 12, 5),
           f'<rect x="-28" y="-18" width="13" height="20" rx="6" fill="{f}"/><rect x="8" y="-18" width="13" height="20" rx="6" fill="{f}"/>',
           f'<circle cx="30" cy="-46" r="18" fill="{f}" {rim(ELEPHANT)}/>',
           f'<ellipse cx="18" cy="-46" rx="12" ry="16" fill="{shade(ELEPHANT, -0.08)}" {rim(ELEPHANT)}/><ellipse cx="18" cy="-46" rx="7" ry="10" fill="#e8b9c4" opacity="0.7"/>',
           f'<path d="M42 -40 Q52 -26 46 -12 Q42 -6 38 -10" stroke="{shade(ELEPHANT, 0.05)}" stroke-width="8" stroke-linecap="round" fill="none"/>',
           f'<path d="M38 -34 l6 4" stroke="#fbf3e0" stroke-width="3" stroke-linecap="round"/>',
           eye(34, -50, 2.8), f'<circle cx="30" cy="-42" r="3" fill="#f2a38f" opacity="0.5"/>']
    if glasses:
        out.append(f'<circle cx="34" cy="-50" r="5.5" fill="none" stroke="#3b3346" stroke-width="1.4"/>')
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def giraffe(d, x, y, s=1.0, face=1):
    """A giraffe: long legs, a long neck with soft patches, little horns"""
    f = body_fill(d, GIRAFFE)
    patch = shade('#c98a3a', 0)
    out = [f'<ellipse cx="0" cy="2" rx="24" ry="4" fill="#000" opacity="0.15"/>']
    for lx in (-14, -6, 8, 16):
        out.append(f'<rect x="{lx - 2.5}" y="-40" width="5" height="40" rx="2.4" fill="{shade(GIRAFFE, -0.12 if lx in (-6, 16) else 0)}"/>')
    out += [f'<ellipse cx="0" cy="-44" rx="22" ry="12" fill="{f}" {rim(GIRAFFE)}/>',
            f'<path d="M12 -50 Q18 -80 24 -104 L32 -102 Q26 -78 22 -46 Z" fill="{f}" {rim(GIRAFFE)}/>',
            ''.join(f'<ellipse cx="{px}" cy="{py}" rx="{r}" ry="{r * 0.8:.1f}" fill="{patch}" opacity="0.75"/>' for px, py, r in ((-10, -46, 4), (2, -48, 3.6), (-2, -40, 3), (14, -44, 3), (20, -66, 2.8), (24, -84, 2.4), (18, -56, 2.4))),
            f'<ellipse cx="32" cy="-106" rx="11" ry="7" fill="{f}" {rim(GIRAFFE)}/>',
            f'<line x1="26" y1="-112" x2="25" y2="-120" stroke="#8a5a3a" stroke-width="2"/><line x1="31" y1="-113" x2="31" y2="-121" stroke="#8a5a3a" stroke-width="2"/>',
            f'<circle cx="25" cy="-121" r="2" fill="#8a5a3a"/><circle cx="31" cy="-122" r="2" fill="#8a5a3a"/>',
            eye(32, -108, 2.4), f'<path d="M36 -102 q3 2 6 -1" stroke="#3b2a24" stroke-width="1" fill="none"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def zebra(d, x, y, s=1.0, face=1):
    """A zebra: soft stripes, a short mane"""
    f = body_fill(d, ZEBRA)
    clip = d.clip('<ellipse cx="0" cy="-30" rx="26" ry="14"/>')
    out = [f'<ellipse cx="0" cy="2" rx="28" ry="4" fill="#000" opacity="0.15"/>']
    for lx in (-16, -8, 8, 16):
        out.append(f'<rect x="{lx - 3}" y="-24" width="6" height="24" rx="3" fill="{f}" stroke="#3b3346" stroke-width="0.8"/><rect x="{lx - 3}" y="-4" width="6" height="4" rx="1" fill="#3b3346"/>')
    out += [f'<ellipse cx="0" cy="-30" rx="26" ry="14" fill="{f}" {rim("#8a8a8a")}/>',
            f'<g clip-path="{clip}">' + ''.join(f'<path d="M{sx} -46 q4 14 -2 30" stroke="#3b3346" stroke-width="3" fill="none"/>' for sx in range(-20, 24, 7)) + '</g>',
            f'<path d="M-26 -32 q-8 4 -8 14" stroke="#3b3346" stroke-width="2.4" fill="none"/>',
            f'<path d="M18 -36 Q26 -54 32 -60 L40 -54 Q32 -46 26 -28 Z" fill="{f}" stroke="#8a8a8a" stroke-width="0.8"/>',
            ''.join(f'<path d="M{24 + k * 3} {-48 + k * 4} l6 -4" stroke="#3b3346" stroke-width="2"/>' for k in range(3)),
            f'<path d="M22 -50 Q28 -64 36 -64" stroke="#3b3346" stroke-width="4" fill="none" stroke-linecap="round"/>',
            f'<ellipse cx="40" cy="-58" rx="9" ry="7" fill="{f}" stroke="#8a8a8a" stroke-width="0.8"/><ellipse cx="46" cy="-55" rx="5" ry="4" fill="#5b5f6b"/>',
            eye(38, -61, 2.2), f'<path d="M34 -66 l-2 -6 l4 3 Z" fill="{f}" stroke="#8a8a8a" stroke-width="0.6"/>']
    return f'<g transform="translate({x} {y}) scale({s * face} {s})">' + '\n'.join(out) + '</g>'


def meerkat(d, x, y, s=1.0):
    """A meerkat standing up, on the lookout"""
    f = body_fill(d, MEERKAT)
    out = [f'<ellipse cx="0" cy="1" rx="8" ry="2" fill="#000" opacity="0.15"/>',
           f'<ellipse cx="0" cy="-14" rx="7" ry="14" fill="{f}" {rim(MEERKAT)}/>',
           f'<ellipse cx="0" cy="-10" rx="4" ry="8" fill="{shade(MEERKAT, 0.3)}"/>',
           f'<path d="M-5 -20 q-3 4 0 6 M5 -20 q3 4 0 6" stroke="{shade(MEERKAT, -0.2)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
           f'<ellipse cx="0" cy="-32" rx="6" ry="6.5" fill="{f}" {rim(MEERKAT)}/><ellipse cx="2" cy="-30" rx="3" ry="2.4" fill="{shade(MEERKAT, 0.25)}"/>',
           f'<ellipse cx="-2.4" cy="-33" rx="2" ry="1.6" fill="#3b2a24"/><ellipse cx="2.4" cy="-33" rx="2" ry="1.6" fill="#3b2a24"/>',
           f'<circle cx="-2" cy="-33.4" r="0.6" fill="#fff"/><circle cx="2.8" cy="-33.4" r="0.6" fill="#fff"/>']
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def s_mound(d):
    return mound(d, S_GRASS, S_ROCK)


def gear(d, x, y, s=1.0):
    """The explorers' gear: a backpack, a water bottle, a hat"""
    return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-12" y="-26" width="24" height="26" rx="6" fill="{body_fill(d, "#7a9a3e")}" {rim("#7a9a3e")}/>'
            f'<rect x="-8" y="-14" width="16" height="10" rx="3" fill="{shade("#7a9a3e", -0.15)}"/><path d="M-6 -26 q6 -8 12 0" stroke="#5a7030" stroke-width="2.4" fill="none"/>'
            f'<rect x="16" y="-18" width="8" height="18" rx="3" fill="#6fa8dc" stroke="#4a7aa8" stroke-width="0.8"/><rect x="17" y="-22" width="6" height="4" rx="1" fill="#3b3346"/></g>')


# ---------- the stations on the map (300×220) ----------
def draw_camp_gate(d):
    d.add(contact(d, 150, 182, 220))
    d.add(giraffe(d, 236, 150, 0.6, -1))
    d.add(palisade(d, 30, 182, 60, 54, 10))
    d.add(palisade(d, 212, 182, 50, 50, 10))
    d.add(f'<path d="M118 196 Q132 180 138 164 L162 164 Q168 180 184 196 Z" fill="#ecd3a0"/>')
    for x in (100, 178):
        d.add(post(d, x, 78, 22, 104))
    d.add(log(d, 94, 86, 112, 14))
    d.add(signboard(d, 120, 102, 60, 22, posts=False))
    d.add(f'<path d="M150 106 q-8 6 -4 12 q4 -4 8 0 q4 -6 -4 -12 Z" fill="{MANE}"/>')
    d.add(tent(d, 66, 172, 50, 40, CANVAS_S, '#c4553f'))
    d.add(meerkat(d, 202, 190, 0.9))
    d.add(tall_grass(d, 40, 190, 1.0), tall_grass(d, 262, 192, 0.9))


def draw_shade(d):
    d.add(acacia(d, 150, 180, 1.7))
    d.add(log(d, 104, 168, 74, 12))
    d.add(post(d, 112, 178, 8, 10)), d.add(post(d, 166, 178, 8, 10))
    d.add(zebra(d, 236, 186, 0.7, -1))
    d.add(meerkat(d, 70, 190, 0.9), meerkat(d, 84, 192, 0.75))
    d.add(tall_grass(d, 46, 192, 1.0), tall_grass(d, 268, 194, 0.9))


def draw_gear(d):
    d.add(jeep(d, 132, 184, 0.95, -1))
    d.add(explorer(d, 226, 184, 0.7))
    d.add(gear(d, 250, 190, 0.8))
    d.add(binoculars(204, 140, 0.9))
    d.add(elephant(d, 58, 176, 0.45, 1))
    d.add(tall_grass(d, 270, 192, 0.9))


def draw_wait_chief(d):
    # waiting for the chief: a rock in the shade, lion cubs playing, the explorers sitting on a log
    d.add(acacia(d, 236, 176, 1.1))
    d.add(rock(d, 120, 166, 120, 56, '#c9a27a'), rock(d, 92, 178, 60, 30, '#b9926a'))
    d.add(lion(d, 112, 150, 0.45, 1))
    d.add(lion(d, 160, 186, 0.38, -1))
    d.add(log(d, 186, 176, 60, 12))
    d.add(meerkat(d, 60, 190, 0.8))
    d.add(tall_grass(d, 40, 192, 1.0))


def draw_chief(d):
    # the chief: a wise old lion with a little crown, on his rock under the acacia, a giraffe beside him
    d.add(acacia(d, 210, 140, 1.5))
    d.add(rock(d, 150, 150, 170, 80, '#c9a27a'), rock(d, 110, 170, 90, 40, '#b9926a'), rock(d, 200, 176, 80, 30, '#bf986f'))
    d.add(lion(d, 140, 126, 0.85, 1, chief=True))
    d.add(giraffe(d, 248, 184, 0.55, -1))
    d.add(meerkat(d, 58, 192, 0.9))
    d.add(tall_grass(d, 40, 194, 1.0), tall_grass(d, 270, 194, 0.9))


def draw_lab(d):
    d.add(tent(d, 120, 178, 120, 92, CANVAS_S, shade('#7a9a3e', 0)))
    top = d.lin([(0, shade('#9a6a42', 0.3)), (1, '#9a6a42')])
    d.add(f'<rect x="196" y="152" width="80" height="8" rx="3" fill="{top}"/><rect x="202" y="160" width="6" height="22" fill="#6b4329"/><rect x="264" y="160" width="6" height="22" fill="#6b4329"/>')
    d.add(microscope(d, 222, 152, 0.7))
    d.add(''.join(f'<rect x="{240 + k * 8}" y="{138 + (k % 2) * 3}" width="6" height="{14 - (k % 2) * 3}" rx="2" fill="{c}"/>' for k, c in enumerate(('#b9d7ee', '#c8e2b4', '#f3c58d'))))
    d.add(zebra(d, 52, 190, 0.5, 1))
    d.add(meerkat(d, 186, 192, 0.8))


def draw_medic(d):
    d.add(contact(d, 150, 182, 200))
    d.add(tent(d, 126, 180, 120, 96, '#f6f3ea', None))
    d.add(banner(d, 78, 116, 20, 30, '#ffffff', 'leaf'))
    d.add(kit(d, 210, 160, 28, 20))
    d.add(elephant(d, 238, 190, 0.5, -1))
    d.add(f'<rect x="230" y="172" width="10" height="6" rx="2" fill="#fff" stroke="#5f9440" stroke-width="1"/>')
    d.add(tall_grass(d, 40, 192, 1.0))


def draw_expert(d):
    # the expert from the savanna: a wise elephant with glasses, a map on a board
    d.add(acacia(d, 70, 176, 1.0))
    d.add(post(d, 196, 120, 6, 62), post(d, 250, 120, 6, 62))
    d.add(f'<rect x="186" y="112" width="74" height="44" rx="3" fill="#f4ead3" stroke="#a08c6a" stroke-width="1.6"/><path d="M196 144 Q214 122 232 138 T254 128" fill="none" stroke="#b8612f" stroke-width="2" stroke-dasharray="4 3"/>')
    d.add(elephant(d, 142, 186, 0.95, 1, glasses=True))
    d.add(meerkat(d, 270, 190, 0.8))
    d.add(tall_grass(d, 268, 194, 0.8))


def draw_wait_results(d):
    d.add(acacia(d, 226, 176, 1.1))
    d.add(f'<rect x="104" y="150" width="56" height="32" fill="#b98a58" stroke="#7a5a3a" stroke-width="1.4"/><line x1="104" y1="166" x2="160" y2="166" stroke="#7a5a3a" stroke-width="1"/>')
    d.add(hourglass(d, 132, 150, 0.8))
    d.add(meerkat(d, 70, 190, 1.0), meerkat(d, 86, 192, 0.85), meerkat(d, 180, 190, 0.9))
    d.add(giraffe(d, 260, 186, 0.4, -1))
    d.add(tall_grass(d, 46, 194, 1.0))


def draw_back(d):
    # back to the camp at sunset: the jeep, the tents, the campfire, the animals saying goodbye
    d.add(tent(d, 90, 168, 70, 56, CANVAS_S, '#c4553f'))
    d.add(campfire(d, 160, 186, 0.8))
    d.add(jeep(d, 222, 186, 0.75, -1))
    d.add(giraffe(d, 46, 184, 0.5, 1))
    d.add(lion(d, 276, 190, 0.38, -1))
    d.add(meerkat(d, 134, 194, 0.7))


STATIONS = {
    'gate': (draw_camp_gate, 'the entrance to the camp (reception)'),
    'shade': (draw_shade, "in the tree's shade (waiting before the checks)"),
    'gear': (draw_gear, 'the gear check (the checks)'),
    'cubs': (draw_wait_chief, 'waiting for the chief (waiting for the doctor)'),
    'chief': (draw_chief, 'meeting the chief, the wise lion (the doctor)'),
    'lab': (draw_lab, 'the field lab (tests)'),
    'medic': (draw_medic, 'the treatment station (treatment)'),
    'expert': (draw_expert, 'the expert from the savanna (consultation)'),
    'results': (draw_wait_results, 'waiting for the results'),
    'back': (draw_back, 'back to the camp (the end)'),
}


# ---------- the scenes (364×340) ----------
def savanna_back(d, horizon=200):
    d.add(sky(d, SH, S_SKY0, S_SKY1))
    d.add(f'<circle cx="290" cy="{horizon - 50}" r="34" fill="#fff1c8" opacity="0.8"/>')
    d.add(cloud(80, 50, 0.7))
    d.add(band(SW, SH, horizon - 30, 8, 0.4, '#d9a878'))
    for x in (40, 160, 320):
        d.add(f'<g opacity="0.7">{acacia(d, x, horizon - 4, 0.6)}</g>')
    d.add(band(SW, SH, horizon, 6, 1.1, shade(S_GRASS, 0.1)))
    d.add(f'<rect x="0" y="{horizon + 6}" width="{SW}" height="{SH - horizon}" fill="{d.lin([(0, shade(S_GRASS, 0.08)), (1, shade(S_GRASS, -0.15))])}"/>')


def sc_gate(d):
    savanna_back(d, 210)
    d.add(f'<path d="M140 340 Q170 270 176 214 L192 214 Q200 270 236 340 Z" fill="#ecd3a0"/>')
    d.add(giraffe(d, 226, 220, 0.8, -1))
    d.add(tent(d, 150, 214, 40, 30, CANVAS_S, '#c4553f'))
    d.add(palisade(d, -10, 250, 70, 180, 22))
    d.add(palisade(d, 300, 250, 74, 180, 22))
    for x in (56, 262):
        d.add(post(d, x, 40, 46, 300))
    d.add(log(d, 46, 62, 272, 26))
    d.add(signboard(d, 118, 92, 128, 44, posts=False))
    d.add(f'<path d="M182 100 q-16 12 -8 24 q8 -8 16 0 q8 -12 -8 -24 Z" fill="{MANE}"/>')
    d.add(meerkat(d, 110, 330, 2.0), meerkat(d, 140, 336, 1.7))
    d.add(explorer(d, 320, 340, 1.5, wave=True))


def sc_shade(d):
    savanna_back(d, 190)
    d.add(acacia(d, 182, 250, 3.2))
    d.add(log(d, 30, 280, 200, 26))
    d.add(post(d, 50, 304, 18, 36), post(d, 190, 304, 18, 36))
    d.add(zebra(d, 300, 300, 1.5, -1))
    d.add(meerkat(d, 250, 336, 1.8), meerkat(d, 276, 338, 1.5))
    d.add(tall_grass(d, 20, 340, 2.2), tall_grass(d, 340, 340, 2.0))


def sc_gear(d):
    savanna_back(d, 200)
    d.add(jeep(d, 150, 300, 1.9, -1))
    d.add(explorer(d, 300, 330, 1.7))
    d.add(gear(d, 300, 338, 1.6))
    d.add(binoculars(240, 200, 2.0))
    d.add(elephant(d, 50, 230, 0.8, 1))
    d.add(tall_grass(d, 20, 340, 2.0))


def sc_cubs(d):
    savanna_back(d, 190)
    d.add(acacia(d, 290, 220, 2.0))
    d.add(rock(d, 130, 300, 260, 110, '#c9a27a'), rock(d, 60, 320, 120, 60, '#b9926a'))
    d.add(lion(d, 110, 270, 1.1, 1))
    d.add(lion(d, 200, 320, 0.9, -1))
    d.add(log(d, 230, 300, 130, 24))
    d.add(meerkat(d, 30, 336, 1.8))


def sc_chief(d):
    savanna_back(d, 200)
    d.add(acacia(d, 270, 230, 2.6))
    d.add(rock(d, 182, 300, 320, 140, '#c9a27a'), rock(d, 60, 330, 140, 60, '#b9926a'))
    d.add(lion(d, 170, 266, 2.0, 1, chief=True))
    d.add(meerkat(d, 330, 336, 1.8), meerkat(d, 350, 338, 1.5))
    d.add(tall_grass(d, 20, 340, 2.2))


def sc_lab(d):
    # inside the field lab tent: the table with the microscope, samples, a notebook
    d.add(f'<rect width="{SW}" height="{SH}" fill="{CANVAS_S}"/>')
    d.add(''.join(f'<path d="M182 -10 L{x} 250" stroke="{shade(CANVAS_S, -0.12)}" stroke-width="2"/>' for x in range(-40, SW + 60, 48)))
    fold = d.lin([(0, '#000', 0.16), (0.4, '#000', 0), (0.6, '#000', 0), (1, '#000', 0.2)], 0, 0, 1, 0)
    d.add(f'<rect x="0" y="0" width="{SW}" height="250" fill="{fold}"/>')
    d.add(f'<path d="M140 40 L224 40 L224 150 L140 150 Z" fill="{d.lin([(0, "#f2b76a"), (1, "#fbe3b8")])}"/>' + f'<g clip-path="{d.clip("<rect x=\'140\' y=\'40\' width=\'84\' height=\'110\'/>")}">' + giraffe(d, 200, 150, 0.6, -1) + '</g>')
    d.add(f'<rect x="140" y="40" width="84" height="110" fill="none" stroke="{shade(CANVAS_S, -0.35)}" stroke-width="4"/>')
    d.add(f'<rect x="0" y="236" width="{SW}" height="{SH - 236}" fill="{d.lin([(0, "#cfb98e"), (1, "#b59c6e")])}"/>')
    top = d.lin([(0, shade('#9a6a42', 0.3)), (1, '#9a6a42')])
    d.add(f'<rect x="20" y="228" width="324" height="18" rx="4" fill="{top}"/><rect x="36" y="246" width="292" height="94" fill="#6b4329"/>')
    d.add(microscope(d, 130, 230, 2.4))
    d.add(''.join(f'<rect x="{220 + k * 30}" y="{176 + (k % 2) * 6}" width="22" height="{52 - (k % 2) * 6}" rx="7" fill="{c}"/>' for k, c in enumerate(('#b9d7ee', '#c8e2b4', '#f3c58d'))))
    d.add(book(d, 60, 214, 70, -6))
    d.add(meerkat(d, 330, 228, 1.6))


def sc_medic(d):
    d.add(f'<rect width="{SW}" height="{SH}" fill="#f6f3ea"/>')
    d.add(''.join(f'<path d="M182 -10 L{x} 250" stroke="#ddd6c4" stroke-width="2"/>' for x in range(-40, SW + 60, 48)))
    d.add(f'<rect x="178" y="0" width="9" height="252" fill="#9a6a42"/>')
    d.add(f'<rect x="0" y="248" width="{SW}" height="{SH - 248}" fill="{d.lin([(0, "#cfbd96"), (1, "#b49c70")])}"/>')
    d.add(banner(d, 194, 60, 46, 66, '#ffffff', 'leaf'))
    d.add(f'<rect x="10" y="214" width="146" height="22" rx="6" fill="#9a6a42"/><rect x="18" y="196" width="130" height="22" rx="10" fill="#e9f1f7"/><rect x="24" y="190" width="46" height="18" rx="8" fill="#ffffff"/>')
    d.add(f'<rect x="20" y="236" width="10" height="44" fill="#6b4329"/><rect x="136" y="236" width="10" height="44" fill="#6b4329"/>')
    d.add(kit(d, 236, 190, 52, 34))
    d.add(elephant(d, 270, 330, 1.3, -1))
    d.add(f'<rect x="244" y="300" width="22" height="12" rx="4" fill="#fff" stroke="#5f9440" stroke-width="1.4"/>')
    d.add(lantern(d, 160, 150, 1.0))


def sc_expert(d):
    savanna_back(d, 190)
    d.add(post(d, 210, 120, 10, 220), post(d, 340, 120, 10, 220))
    d.add(f'<rect x="196" y="110" width="160" height="96" rx="4" fill="#f4ead3" stroke="#a08c6a" stroke-width="2"/><path d="M212 182 Q248 130 284 164 T344 140" fill="none" stroke="#b8612f" stroke-width="3" stroke-dasharray="6 5"/>')
    d.add(elephant(d, 120, 330, 2.6, 1, glasses=True))
    d.add(tall_grass(d, 20, 340, 2.0))


def sc_results(d):
    savanna_back(d, 190)
    d.add(acacia(d, 300, 230, 2.0))
    d.add(f'<rect x="110" y="250" width="150" height="90" fill="#b98a58" stroke="#7a5a3a" stroke-width="3"/><line x1="110" y1="296" x2="260" y2="296" stroke="#7a5a3a" stroke-width="2"/>')
    d.add(hourglass(d, 186, 252, 2.0))
    d.add(meerkat(d, 50, 330, 2.2), meerkat(d, 84, 336, 1.8), meerkat(d, 300, 336, 2.0))
    d.add(tall_grass(d, 20, 340, 2.0))


def sc_back(d):
    savanna_back(d, 190)
    d.add(tent(d, 90, 250, 120, 96, CANVAS_S, '#c4553f'))
    d.add(campfire(d, 190, 300, 1.8))
    d.add(jeep(d, 270, 330, 1.6, -1))
    d.add(giraffe(d, 40, 330, 1.2, 1))
    d.add(elephant(d, 200, 230, 0.8, 1))
    d.add(lion(d, 340, 340, 0.8, -1))
    d.add(meerkat(d, 140, 336, 1.6))


SCENES = {
    'gate': (sc_gate, 'at the entrance to the camp (reception)'),
    'shade': (sc_shade, "in the tree's shade (waiting before the checks)"),
    'gear': (sc_gear, 'at the gear check (the checks)'),
    'cubs': (sc_cubs, 'waiting for the chief, by the lion cubs (waiting for the doctor)'),
    'chief': (sc_chief, 'meeting the chief, the wise lion (the doctor)'),
    'lab': (sc_lab, 'inside the field lab (tests)'),
    'medic': (sc_medic, 'inside the treatment tent (treatment)'),
    'expert': (sc_expert, 'with the expert from the savanna (consultation)'),
    'results': (sc_results, 'waiting for the results with the meerkats'),
    'back': (sc_back, 'back at the camp (the end)'),
}


# ---------- the map backgrounds ----------
def background(W, H, horizon, trees, grasses, clouds, seed, comment):
    d = Doc(W, H, seed)
    s = (W / 412) ** 0.5
    d.add(f'<rect width="{W}" height="{H}" fill="{d.lin([(0, S_SKY0), (0.85, S_SKY1)])}"/>')
    d.add(*[cloud(*c) for c in clouds])
    d.add(band(W, H, horizon - 30 * s, 14 * s, 0.4, '#d9a878'))
    d.add(band(W, H, horizon - 12 * s, 8 * s, 2.0, '#d8b77a'))
    rows = [('#e3cb80', 0), ('#d9bf6e', 0.16), ('#cfb460', 0.36), ('#c5a956', 0.6), ('#b99f4e', 0.82)]
    for i, (col, f) in enumerate(rows):
        d.add(band(W, H, horizon + (H - horizon) * f, 10 * s, i * 1.7, col))
    for t in sorted(trees, key=lambda t: t[1]):
        d.add(acacia(d, *t))
    for gx, gy, gs in grasses:
        d.add(tall_grass(d, gx, gy, gs))
    return d.svg(f'{WORLD} world: {comment}', grain=0.025, wobble=1.0, clay=False)


def portrait_bg():
    return background(
        412, 1100, 196,
        trees=[(370, 250, 0.9), (34, 370, 0.9), (380, 540, 1.0), (30, 710, 0.9), (380, 880, 1.0), (50, 1040, 0.9)],
        grasses=[(40, 430, 1.0), (30, 760, 1.0), (190, 1070, 1.1)],
        clouds=[(250, 150, 0.5), (110, 168, 0.45)], seed=81,
        comment='the portrait map background (the 412×939 frame, drawn 412×1100 so the second map can move it)')


def landscape_bg():
    return background(
        1920, 1080, 330,
        trees=[(1580, 490, 1.9), (1840, 530, 2.0), (100, 450, 1.8), (260, 420, 1.4), (1880, 790, 1.8), (560, 1050, 1.7)],
        grasses=[(1300, 970, 2.0), (500, 840, 1.8), (640, 1000, 1.8)],
        clouds=[(420, 170, 1.4), (760, 230, 1.1), (1150, 160, 1.3)], seed=82,
        comment='the landscape map background (the 1920×1080 frame)')


def sheet_floor():
    d = Doc(364, 340, 89)
    d.add(f'<rect width="364" height="340" fill="{d.lin([(0, "#fbeedb"), (0.55, "#f7ead0"), (1, "#e6d2a6")])}"/>')
    d.add(band(364, 340, 215, 6, 0.7, '#e6d394'), band(364, 340, 255, 5, 2.1, '#d9c27a'))
    return d.svg(f'{WORLD} world: the panel behind a picture on its sheet', clay=False)


def celebrate():
    d = Doc(640, 480, 91)
    d.add(f'<rect width="640" height="480" fill="{d.lin([(0, S_SKY0), (1, S_SKY1)])}"/>')
    d.add(f'<circle cx="480" cy="230" r="70" fill="#fff1c8" opacity="0.8"/>')
    d.add(band(640, 480, 320, 10, 0.5, '#e3cb80'), band(640, 480, 380, 10, 2.0, '#cfb460'))
    fig = Doc(640, 480, 92, prefix='v')
    fig.add(acacia(fig, 520, 360, 2.4))
    fig.add(giraffe(fig, 120, 440, 1.6, 1))
    fig.add(elephant(fig, 260, 430, 1.5, 1))
    fig.add(jeep(fig, 420, 450, 1.6, -1))
    fig.add(lion(fig, 560, 460, 1.2, -1, chief=True))
    fig.add(zebra(fig, 340, 470, 1.1, -1))
    fig.add(meerkat(fig, 200, 470, 1.8), meerkat(fig, 225, 472, 1.5))
    d.defs.extend(fig.defs)
    d.add('<g filter="url(#clay)">' + '\n'.join(fig.body) + '</g>')
    return d.svg(f'{WORLD} world: back at the camp happy (the celebration screen)', clay=False)


def card():
    d = Doc(300, 220, 93)
    d.add(s_mound(d))
    d.add(acacia(d, 210, 176, 1.2))
    d.add(lion(d, 120, 184, 0.9, 1))
    d.add(meerkat(d, 230, 190, 1.0))
    return d.svg(f'{WORLD} world: the card on the world select screen')


def main():
    files = {}
    for k, (f, c) in STATIONS.items():
        files[f'station-{k}.svg'] = station(k, f, c, WORLD, s_mound)
    for k, (f, c) in SCENES.items():
        files[f'scene-{k}.svg'] = scene(k, f, c, WORLD)
    files['map-portrait.svg'] = portrait_bg()
    files['map-landscape.svg'] = landscape_bg()
    files['sheet-floor.svg'] = sheet_floor()
    files['celebrate.svg'] = celebrate()
    files['card.svg'] = card()
    write('safari', files)


if __name__ == '__main__':
    lib.RELIEF = 4.2
    main()

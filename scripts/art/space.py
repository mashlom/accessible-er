"""The space world's earlier pictures, drawn in code (drafts in scripts/art/build/space/; the app uses the delivered ones): a space station on little asteroids. The flight engineer (a
friendly robot) checks before take-off, the ship's commander (an astronaut) sets the route, the technician robot
repairs, and in the end the capsule lands safely back on Earth.

    python3 scripts/art/space.py

Drawn with the shared tools in lib.py (the same light, grain and 3D filter as the other drawn worlds), plus the
tools of this world below: station modules with portholes and solar wings, a rocket, a satellite dish, the robot,
the astronaut, planets, the landing capsule with its parachute.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa: E402,F403
from lib import SW, SH  # noqa: E402
import lib  # noqa: E402

WORLD = 'Space'

# ---------- palette ----------
NIGHT0, NIGHT1 = '#1c2350', '#46407e'
MOON = '#b9b4d0'
MOON_ROCK = '#7d7896'
HULL = '#e8ecf4'
PANEL = '#4a6fb8'
GLASS = '#7fc4ec'
ORANGE = '#ef8f55'
ROBOT = '#cfd8e6'
SUIT = '#f4f6fa'
INDIGO = '#4a5bd0'


def ball(d, color):
    return d.rad([(0, shade(color, 0.42)), (0.5, shade(color, 0.06)), (0.82, color), (1, shade(color, -0.38))], 0.36, 0.3, 0.8)


def metal(d, color=HULL):
    return d.lin([(0, shade(color, -0.12)), (0.25, shade(color, 0.15)), (0.6, color), (1, shade(color, -0.35))], 0, 0, 1, 0)


def rim(color):
    return f'stroke="{shade(color, -0.45)}" stroke-width="1"'


def porthole(d, cx, cy, r, view='earth'):
    glass = d.rad([(0, shade(GLASS, 0.5)), (1, shade(GLASS, -0.25))], 0.35, 0.3, 0.8)
    out = [f'<circle cx="{cx}" cy="{cy}" r="{r + r * 0.28:.1f}" fill="{metal(d, "#c9d0de")}" {rim("#c9d0de")}/>']
    if view == 'earth':
        clip = d.clip(f'<circle cx="{cx}" cy="{cy}" r="{r}"/>')
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#25306a"/>')
        out.append(f'<g clip-path="{clip}">{earth(d, cx + r * 0.4, cy + r * 0.5, r * 0.8)}{star(cx - r * 0.4, cy - r * 0.3, r * 0.12, "#fff")}</g>')
    else:
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{glass}"/>')
    out.append(f'<path d="M{cx - r * 0.6:.1f} {cy - r * 0.2:.1f} A{r * 0.7:.1f} {r * 0.7:.1f} 0 0 1 {cx - r * 0.1:.1f} {cy - r * 0.65:.1f}" stroke="#fff" stroke-width="{max(1, r * 0.14):.1f}" fill="none" opacity="0.7" stroke-linecap="round"/>')
    for k in range(8):
        a = k * math.pi / 4
        out.append(f'<circle cx="{cx + r * 1.14 * math.cos(a):.1f}" cy="{cy + r * 1.14 * math.sin(a):.1f}" r="{max(0.7, r * 0.06):.1f}" fill="#8a93a8"/>')
    return '\n'.join(out)


def earth(d, cx, cy, r):
    g = d.rad([(0, '#a8dcf8'), (0.6, '#4a9ad8'), (1, '#2a5a9a')], 0.35, 0.3, 0.8)
    clip = d.clip(f'<circle cx="{cx}" cy="{cy}" r="{r}"/>')
    def blob(x, y, k, pts):
        return f'<path d="M{x:.1f} {y:.1f} ' + ' '.join(f'q{a * k:.1f} {b * k:.1f} {c * k:.1f} {e * k:.1f}' for a, b, c, e in pts) + f' Z" fill="#6db35c"/>'
    land = (blob(cx - r * 0.75, cy - r * 0.35, r, [(0.1, -0.3, 0.35, -0.3), (0.2, 0.05, 0.15, 0.3), (-0.05, 0.2, 0.1, 0.45), (-0.15, 0.1, -0.3, -0.05), (-0.2, -0.2, -0.3, -0.4)])
            + blob(cx + r * 0.15, cy + r * 0.05, r, [(0.2, -0.15, 0.45, 0.0), (0.1, 0.25, -0.05, 0.4), (-0.2, 0.1, -0.3, -0.1), (-0.05, -0.15, -0.1, -0.3)])
            + blob(cx - r * 0.1, cy - r * 0.75, r, [(0.15, -0.05, 0.3, 0.05), (-0.05, 0.12, -0.3, -0.05)])
            + f'<path d="M{cx - r * 0.9:.1f} {cy + r * 0.25:.1f} q{r * 0.4:.1f} {-r * 0.12:.1f} {r * 0.8:.1f} 0" stroke="#fff" stroke-width="{min(r * 0.09, 6):.1f}" fill="none" opacity="0.55" stroke-linecap="round"/>'
            + f'<path d="M{cx + r * 0.1:.1f} {cy - r * 0.45:.1f} q{r * 0.3:.1f} {-r * 0.1:.1f} {r * 0.6:.1f} 0" stroke="#fff" stroke-width="{min(r * 0.07, 5):.1f}" fill="none" opacity="0.5" stroke-linecap="round"/>'
            + f'<circle cx="{cx + r * 0.35:.1f}" cy="{cy + r * 0.35:.1f}" r="{r}" fill="none" stroke="#123a70" stroke-width="{r * 0.5:.1f}" opacity="0.25"/>')
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{g}"/><g clip-path="{clip}">{land}</g>'


def planet(d, cx, cy, r, color='#e9a07a', ring=True):
    g = d.rad([(0, shade(color, 0.35)), (0.7, color), (1, shade(color, -0.35))], 0.35, 0.3, 0.8)
    out = []
    if ring:
        out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{r * 1.8:.1f}" ry="{r * 0.45:.1f}" fill="none" stroke="#f3d6a8" stroke-width="{r * 0.2:.1f}" opacity="0.8" transform="rotate(-14 {cx} {cy})"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{g}"/>')
    out.append(f'<path d="M{cx - r * 0.9:.1f} {cy - r * 0.2:.1f} q{r * 0.9:.1f} {r * 0.2:.1f} {r * 1.8:.1f} 0" stroke="{shade(color, -0.15)}" stroke-width="{r * 0.12:.1f}" fill="none"/>')
    if ring:
        out.append(f'<path d="M{cx - r * 1.74:.1f} {cy + r * 0.26:.1f} A{r * 1.8:.1f} {r * 0.45:.1f} -14 0 0 {cx + r * 1.74:.1f} {cy - r * 0.6:.1f}" fill="none" stroke="#f3d6a8" stroke-width="{r * 0.2:.1f}" opacity="0.9"/>')
    return '\n'.join(out)


def starfield(d, W, H, n, s=1.0):
    return ''.join(f'<circle cx="{d.rng.uniform(0, W):.1f}" cy="{d.rng.uniform(0, H):.1f}" r="{d.rng.uniform(0.6, 1.8) * s:.1f}" fill="#fff" opacity="{d.rng.uniform(0.5, 1):.2f}"/>' for _ in range(n))


def solar(d, x, y, w, h):
    """A solar wing: blue cells in a frame"""
    g = d.lin([(0, shade(PANEL, 0.25)), (1, shade(PANEL, -0.25))], 0, 0, 1, 1)
    cells = ''.join(f'<line x1="{x + w * k / 4:.1f}" y1="{y}" x2="{x + w * k / 4:.1f}" y2="{y + h}" stroke="#a9c8f0" stroke-width="0.8"/>' for k in range(1, 4))
    cells += ''.join(f'<line x1="{x}" y1="{y + h * k / 3:.1f}" x2="{x + w}" y2="{y + h * k / 3:.1f}" stroke="#a9c8f0" stroke-width="0.8"/>' for k in range(1, 3))
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="{g}" stroke="#2f4a80" stroke-width="1"/>' + cells


def module(d, cx, base, w, h, color=HULL, door=False, windows=2, wings=True, stripe=ORANGE):
    """A station module seen at an angle: a rounded body, its end cap, portholes, a stripe, solar wings"""
    x0 = cx - w / 2
    out = []
    if wings:
        out.append(f'<rect x="{x0 - 44}" y="{base - h * 0.62:.1f}" width="46" height="4" fill="#8a93a8"/>' + solar(d, x0 - 56, base - h * 0.62 - 14, 36, 30))
        out.append(f'<rect x="{x0 + w - 2}" y="{base - h * 0.62:.1f}" width="46" height="4" fill="#8a93a8"/>' + solar(d, x0 + w + 20, base - h * 0.62 - 14, 36, 30))
    out.append(f'<rect x="{x0}" y="{base - h}" width="{w}" height="{h}" rx="{h * 0.45:.1f}" fill="{metal(d, color)}" {rim(color)}/>')
    out.append(f'<ellipse cx="{x0 + w - h * 0.2:.1f}" cy="{base - h / 2:.1f}" rx="{h * 0.22:.1f}" ry="{h * 0.46:.1f}" fill="{shade(color, -0.2)}"/>')
    out.append(f'<rect x="{x0 + h * 0.3:.1f}" y="{base - h * 0.32:.1f}" width="{w - h * 0.6:.1f}" height="{h * 0.08:.1f}" fill="{stripe}"/>')
    out.append(''.join(f'<line x1="{x0 + w * k / 5:.1f}" y1="{base - h + 3}" x2="{x0 + w * k / 5:.1f}" y2="{base - 3}" stroke="{shade(color, -0.2)}" stroke-width="0.8"/>' for k in range(1, 5)))
    for k in range(windows):
        out.append(porthole(d, x0 + w * (0.25 + 0.5 * k / max(1, windows - 1)) if windows > 1 else cx, base - h * 0.62, h * 0.16, 'glass'))
    if door:
        out.append(f'<rect x="{cx - h * 0.18:.1f}" y="{base - h * 0.78:.1f}" width="{h * 0.36:.1f}" height="{h * 0.62:.1f}" rx="{h * 0.12:.1f}" fill="{metal(d, "#c9d0de")}" stroke="#8a93a8" stroke-width="1.4"/>'
                   f'<rect x="{cx - h * 0.1:.1f}" y="{base - h * 0.7:.1f}" width="{h * 0.2:.1f}" height="{h * 0.14:.1f}" rx="2" fill="{GLASS}"/><circle cx="{cx + h * 0.1:.1f}" cy="{base - h * 0.42:.1f}" r="1.8" fill="#6fd48a"/>')
    out.append(f'<line x1="{cx}" y1="{base - h}" x2="{cx}" y2="{base - h - 16}" stroke="#8a93a8" stroke-width="2"/><circle cx="{cx}" cy="{base - h - 17}" r="3" fill="#ffd98a"/>')
    return '\n'.join(out)


def rocket(d, x, base, s=1.0):
    body = metal(d, HULL)
    out = [f'<ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity="0.16"/>',
           f'<rect x="-30" y="-6" width="60" height="6" rx="2" fill="#8a93a8"/>',
           f'<path d="M-16 -10 L-30 -2 L-28 -30 L-16 -40 Z" fill="{ball(d, ORANGE)}"/><path d="M16 -10 L30 -2 L28 -30 L16 -40 Z" fill="{ball(d, ORANGE)}"/>',
           f'<path d="M-16 -8 L-16 -80 Q-16 -116 0 -132 Q16 -116 16 -80 L16 -8 Z" fill="{body}" {rim(HULL)}/>',
           f'<path d="M-12 -112 Q0 -128 12 -112 Q0 -116 -12 -112 Z" fill="{ORANGE}"/>',
           porthole(d, 0, -80, 8, 'glass'),
           f'<rect x="-16" y="-44" width="32" height="5" fill="{INDIGO}"/>',
           f'<path d="M-10 -8 L-6 0 L6 0 L10 -8 Z" fill="#5b5f6b"/>']
    return f'<g transform="translate({x} {base}) scale({s})">' + '\n'.join(out) + '</g>'


def dish(d, x, base, s=1.0):
    g = d.lin([(0, '#ffffff'), (1, '#b9c2d4')], 0, 0, 1, 1)
    return (f'<g transform="translate({x} {base}) scale({s})"><ellipse cx="0" cy="2" rx="26" ry="4" fill="#000" opacity="0.16"/>'
            f'<path d="M-10 0 L-4 -40 L4 -40 L10 0 Z" fill="{metal(d, "#c9d0de")}"/>'
            f'<path d="M-40 -66 Q-20 -24 26 -36 Q4 -72 -40 -66 Z" fill="{g}" stroke="#8a93a8" stroke-width="1.4"/>'
            f'<line x1="-8" y1="-48" x2="-20" y2="-74" stroke="#8a93a8" stroke-width="2"/><circle cx="-20" cy="-76" r="4" fill="#ffd98a"/>'
            f'<path d="M-30 -84 q10 -8 20 0 M-36 -92 q16 -12 32 0" stroke="#bfe0f2" stroke-width="2" fill="none"/></g>')


def robot(d, x, y, s=1.0, color=ROBOT, tool=None):
    """The friendly robot: a round head with a screen face, an antenna, a body with buttons"""
    f = ball(d, color)
    out = [f'<ellipse cx="0" cy="2" rx="18" ry="3.5" fill="#000" opacity="0.15"/>',
           f'<rect x="-10" y="-10" width="7" height="10" rx="3" fill="{shade(color, -0.2)}"/><rect x="3" y="-10" width="7" height="10" rx="3" fill="{shade(color, -0.2)}"/>',
           f'<rect x="-15" y="-36" width="30" height="28" rx="9" fill="{f}" {rim(color)}/>',
           f'<rect x="-8" y="-30" width="16" height="10" rx="3" fill="#2c3550"/>',
           ''.join(f'<circle cx="{-4 + k * 4}" cy="-25" r="1.4" fill="{c}"/>' for k, c in enumerate(('#6fd48a', '#ffd98a', '#7fc4ec'))),
           f'<path d="M-15 -28 q-10 4 -8 14 M15 -28 q10 4 8 14" stroke="{shade(color, -0.15)}" stroke-width="5" fill="none" stroke-linecap="round"/>',
           f'<rect x="-14" y="-60" width="28" height="22" rx="10" fill="{f}" {rim(color)}/>',
           f'<rect x="-10" y="-56" width="20" height="14" rx="6" fill="#2c3550"/>',
           f'<circle cx="-4" cy="-50" r="2.2" fill="#7fe4ff"/><circle cx="4" cy="-50" r="2.2" fill="#7fe4ff"/><path d="M-3.5 -46 q3.5 2.5 7 0" stroke="#7fe4ff" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
           f'<line x1="0" y1="-60" x2="0" y2="-68" stroke="#8a93a8" stroke-width="1.6"/><circle cx="0" cy="-70" r="2.6" fill="{ORANGE}"/>']
    if tool == 'wrench':
        out.append(f'<path d="M22 -16 l10 -14" stroke="#8a93a8" stroke-width="3.4" stroke-linecap="round"/><circle cx="33" cy="-31" r="4" fill="none" stroke="#8a93a8" stroke-width="2.4"/>')
    elif tool == 'tablet':
        out.append(f'<rect x="16" y="-28" width="16" height="20" rx="2" fill="#2c3550" stroke="#8a93a8" stroke-width="1"/><rect x="18" y="-25" width="12" height="3" fill="#6fd48a"/><rect x="18" y="-20" width="9" height="3" fill="#7fc4ec"/>')
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def astronaut(d, x, y, s=1.0, commander=False, wave=False):
    """An astronaut: a round white suit, a helmet with the face seen through the visor; the commander has a gold star"""
    f = ball(d, SUIT)
    out = [f'<ellipse cx="0" cy="2" rx="20" ry="4" fill="#000" opacity="0.15"/>',
           f'<rect x="-12" y="-16" width="10" height="16" rx="4" fill="{f}" {rim(SUIT)}/><rect x="2" y="-16" width="10" height="16" rx="4" fill="{f}" {rim(SUIT)}/>',
           f'<rect x="-14" y="-2" width="12" height="4" rx="2" fill="#8a93a8"/><rect x="2" y="-2" width="12" height="4" rx="2" fill="#8a93a8"/>',
           f'<rect x="-17" y="-46" width="34" height="34" rx="12" fill="{f}" {rim(SUIT)}/>',
           f'<rect x="-9" y="-38" width="18" height="10" rx="2" fill="{shade(SUIT, -0.1)}"/>',
           ''.join(f'<circle cx="{-5 + k * 5}" cy="-33" r="1.4" fill="{c}"/>' for k, c in enumerate(('#ef8f55', '#6fd48a', '#7fc4ec')))]
    if commander:
        out.append(star(10, -20, 4, '#ffd95a'))
        out.append(f'<rect x="-15" y="-46" width="30" height="4" fill="{INDIGO}"/>')
    out.append(f'<path d="M-17 -40 q-10 8 -8 20" stroke="{SUIT}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="-25" cy="-19" r="4" fill="#cfd8e6"/>')
    if wave:
        out.append(f'<path d="M17 -40 q12 -6 12 -22" stroke="{SUIT}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="29" cy="-64" r="4" fill="#cfd8e6"/>')
    else:
        out.append(f'<path d="M17 -40 q10 8 8 20" stroke="{SUIT}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="25" cy="-19" r="4" fill="#cfd8e6"/>')
    visor = d.rad([(0, '#5a6ab0'), (1, '#1e2650')], 0.4, 0.35, 0.75)
    out += [f'<circle cx="0" cy="-62" r="18" fill="{f}" {rim(SUIT)}/>',
            f'<ellipse cx="0" cy="-62" rx="13" ry="12" fill="{visor}"/>',
            f'<circle cx="0" cy="-61" r="9" fill="{SKIN}"/>',
            f'<circle cx="-3.2" cy="-62" r="1.5" fill="#2c2433"/><circle cx="3.2" cy="-62" r="1.5" fill="#2c2433"/>',
            f'<path d="M-3 -57.6 q3 2.4 6 0" stroke="#2c2433" stroke-width="1" fill="none" stroke-linecap="round"/>',
            f'<circle cx="-5.6" cy="-58.6" r="1.6" fill="#f2a38f" opacity="0.6"/><circle cx="5.6" cy="-58.6" r="1.6" fill="#f2a38f" opacity="0.6"/>',
            f'<path d="M-9 -68 a12 12 0 0 1 8 -5" stroke="#fff" stroke-width="2" fill="none" opacity="0.7" stroke-linecap="round"/>']
    return f'<g transform="translate({x} {y}) scale({s})">' + '\n'.join(out) + '</g>'


def console(d, x, y, w, h, screens=2):
    """A control desk with screens of soft charts and buttons"""
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{metal(d, "#c9d0de")}" stroke="#8a93a8" stroke-width="1.2"/>']
    for k in range(screens):
        sx = x + 6 + k * (w - 12) / screens
        sw = (w - 12) / screens - 6
        out.append(f'<rect x="{sx:.1f}" y="{y + 5}" width="{sw:.1f}" height="{h * 0.5:.1f}" rx="2" fill="#2c3550"/>')
        out.append(f'<path d="M{sx + 3:.1f} {y + 5 + h * 0.38:.1f} q{sw * 0.2:.1f} {-h * 0.2:.1f} {sw * 0.4:.1f} {-h * 0.06:.1f} t{sw * 0.4:.1f} {-h * 0.12:.1f}" stroke="{("#6fd48a", "#7fc4ec", "#ffd98a")[k % 3]}" stroke-width="1.4" fill="none"/>')
    for k in range(int(w / 10)):
        out.append(f'<circle cx="{x + 8 + k * 10}" cy="{y + h * 0.8:.1f}" r="2" fill="{("#ef8f55", "#6fd48a", "#7fc4ec", "#ffd98a")[k % 4]}"/>')
    return '\n'.join(out)


def capsule(d, x, base, s=1.0, chute=True):
    out = [f'<ellipse cx="0" cy="2" rx="30" ry="5" fill="#000" opacity="0.16"/>']
    if chute:
        cg = d.lin([(0, shade(ORANGE, 0.2)), (1, shade(ORANGE, -0.15))], 0, 0, 1, 0)
        out.append(f'<path d="M-50 -100 Q0 -150 50 -100 Q38 -96 25 -100 Q12 -94 0 -100 Q-12 -94 -25 -100 Q-38 -96 -50 -100 Z" fill="{cg}"/>')
        out.append(f'<path d="M-25 -100 Q0 -150 25 -100" fill="#fff" opacity="0.8"/>')
        out.append(''.join(f'<line x1="{px}" y1="-99" x2="{px * 0.3:.1f}" y2="-42" stroke="#8a93a8" stroke-width="0.8"/>' for px in (-48, -24, 0, 24, 48)))
    out += [f'<path d="M-28 0 L-18 -44 L18 -44 L28 0 Z" fill="{metal(d, HULL)}" {rim(HULL)}/>',
            f'<rect x="-30" y="-6" width="60" height="7" rx="2" fill="#8a7a6a"/>',
            porthole(d, 0, -24, 8, 'glass'), f'<rect x="-18" y="-46" width="36" height="5" rx="2" fill="{INDIGO}"/>']
    return f'<g transform="translate({x} {base}) scale({s})">' + '\n'.join(out) + '</g>'


def m_moon(d):
    """The asteroid every station stands on: a lunar top with craters, a base of grey-lilac rocks"""
    out = [mound(d, MOON, MOON_ROCK)]
    for cx, cy, r in ((70, 184, 10), (210, 190, 8), (240, 176, 6), (110, 192, 6)):
        out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{r}" ry="{r * 0.3:.1f}" fill="{shade(MOON, -0.18)}"/><ellipse cx="{cx}" cy="{cy - r * 0.06:.1f}" rx="{r * 0.8:.1f}" ry="{r * 0.22:.1f}" fill="{shade(MOON, -0.08)}"/>')
    return '\n'.join(out)


def m_earth(d):
    return mound(d, '#93c86a', '#a9a08f')


# ---------- the stations on the map (300×220) ----------
def draw_entrance(d):
    d.add(module(d, 140, 176, 140, 70, door=True, windows=2))
    d.add(console(d, 222, 160, 44, 22, 1))
    d.add(''.join(f'<circle cx="{232 + k * 10}" cy="156" r="3.4" fill="none" stroke="{c}" stroke-width="2"/>' for k, c in enumerate(('#ef8f55', '#6fd48a', '#7fc4ec'))))
    d.add(robot(d, 222, 186, 0.8))
    d.add(planet(d, 52, 40, 12, '#e9a07a'))


def draw_cabin(d):
    d.add(module(d, 150, 178, 170, 80, windows=3))
    d.add(astronaut(d, 236, 190, 0.6))
    d.add(robot(d, 66, 192, 0.6))
    d.add(planet(d, 250, 34, 10, '#b79ae0', ring=False))


def draw_checks(d):
    d.add(f'<rect x="96" y="168" width="70" height="12" rx="2" fill="#8a93a8"/><rect x="150" y="60" width="6" height="110" fill="#8a93a8"/>' + ''.join(f'<line x1="150" y1="{70 + k * 18}" x2="138" y2="{80 + k * 18}" stroke="#8a93a8" stroke-width="2"/>' for k in range(5)))
    d.add(rocket(d, 122, 170, 0.95))
    d.add(robot(d, 206, 190, 0.85, tool='tablet'))
    d.add(astronaut(d, 250, 192, 0.5))


def draw_control(d):
    d.add(module(d, 150, 178, 170, 84, windows=0, wings=True, stripe=INDIGO))
    d.add(f'<rect x="96" y="112" width="108" height="40" rx="6" fill="#2c3550"/>')
    d.add(console(d, 102, 116, 96, 32, 3))
    d.add(robot(d, 228, 190, 0.6))
    d.add(planet(d, 60, 36, 11, '#7fc4ec', ring=True))


def draw_commander(d):
    d.add(module(d, 140, 176, 170, 90, door=True, windows=2, stripe=INDIGO))
    d.add(f'<path d="M100 86 Q140 50 180 86 Z" fill="{metal(d, HULL)}" {rim(HULL)}/>' + porthole(d, 140, 76, 10, 'earth'))
    d.add(astronaut(d, 236, 190, 0.85, commander=True, wave=True))
    d.add(planet(d, 54, 34, 12, '#e9a07a'))


def draw_scanner(d):
    d.add(dish(d, 130, 184, 1.3))
    d.add(console(d, 186, 160, 60, 24, 2))
    d.add(robot(d, 230, 192, 0.6))


def draw_repair(d):
    d.add(module(d, 120, 176, 140, 70, windows=1, wings=False))
    d.add(f'<rect x="150" y="124" width="30" height="24" rx="2" fill="#2c3550" stroke="#8a93a8" stroke-width="1"/>' + ''.join(f'<path d="M{154 + k * 6} 130 q3 8 0 14" stroke="{c}" stroke-width="1.6" fill="none"/>' for k, c in enumerate(('#ef8f55', '#6fd48a', '#7fc4ec', '#ffd98a'))))
    d.add(robot(d, 214, 190, 0.85, tool='wrench'))
    d.add(f'<rect x="240" y="176" width="30" height="14" rx="2" fill="{ORANGE}" stroke="{shade(ORANGE, -0.35)}" stroke-width="1"/>')


def draw_command(d):
    # the command centre: an antenna tower, a big screen with the expert who joins
    d.add(f'<path d="M116 182 L134 60 L146 60 L164 182 Z" fill="none" stroke="#8a93a8" stroke-width="3"/>' + ''.join(f'<line x1="{120 + k * 2}" y1="{170 - k * 24}" x2="{160 - k * 2}" y2="{150 - k * 24}" stroke="#8a93a8" stroke-width="2"/>' for k in range(5)))
    d.add(dish(d, 140, 66, 0.6))
    d.add(f'<rect x="176" y="110" width="80" height="56" rx="4" fill="{metal(d, "#c9d0de")}" stroke="#8a93a8" stroke-width="1.2"/><rect x="182" y="116" width="68" height="44" rx="3" fill="#2c3550"/>')
    d.add(f'<g transform="translate(216 160) scale(0.42)">{astronaut(d, 0, 0, 1.0)}</g>')
    d.add(robot(d, 74, 190, 0.6))


def draw_data(d):
    d.add(console(d, 70, 120, 150, 60, 3))
    d.add(f'<rect x="80" y="180" width="130" height="6" fill="#8a93a8"/>')
    d.add(f'<rect x="230" y="150" width="34" height="30" rx="3" fill="{metal(d, "#c9d0de")}" stroke="#8a93a8" stroke-width="1"/><rect x="236" y="140" width="22" height="12" fill="#fff"/>')
    d.add(robot(d, 246, 194, 0.55))
    d.add(planet(d, 50, 36, 10, '#b79ae0'))


def draw_landing(d):
    d.add(capsule(d, 150, 186, 1.2))
    d.add(astronaut(d, 226, 190, 0.6, wave=True))
    d.add(tree(d, 52, 180, 0.8))
    d.add(bush(d, 260, 188, 0.6))


STATIONS = {
    'entrance': (draw_entrance, 'the entrance to the station (reception)'),
    'cabin': (draw_cabin, 'the waiting cabin (waiting before the checks)'),
    'checks': (draw_checks, 'the checks before take-off (the checks)'),
    'control': (draw_control, 'the control room (waiting for the doctor)'),
    'commander': (draw_commander, "the ship commander's module (the doctor)"),
    'scanner': (draw_scanner, 'the space scanner (tests)'),
    'repair': (draw_repair, 'repairing the station (treatment)'),
    'command': (draw_command, 'the command centre (consultation)'),
    'data': (draw_data, 'processing the data (waiting for results)'),
    'landing': (draw_landing, 'a safe landing on Earth (the end)'),
}


# ---------- the scenes (364×340): inside the modules ----------
def module_room(d, view=(182, 120, 70), panels=HULL):
    """Inside a module: curved walls of panels with rivets, a big porthole with the view, a grid floor"""
    d.add(f'<rect width="{SW}" height="{SH}" fill="{d.lin([(0, shade(panels, -0.25)), (0.3, panels), (0.7, panels), (1, shade(panels, -0.3))], 0, 0, 1, 0)}"/>')
    for x in range(0, SW + 1, 52):
        d.add(f'<line x1="{x}" y1="0" x2="{x}" y2="250" stroke="{shade(panels, -0.15)}" stroke-width="1.4"/>' + ''.join(f'<circle cx="{x + 5}" cy="{y}" r="1.4" fill="{shade(panels, -0.3)}"/>' for y in range(14, 250, 40)))
    d.add(f'<path d="M0 0 Q182 30 364 0 L364 18 Q182 48 0 18 Z" fill="{shade(panels, -0.12)}"/>')
    d.add(f'<rect x="0" y="16" width="{SW}" height="6" fill="#ffe7a8" opacity="0.7"/>')
    if view:
        cx, cy, r = view
        clip = d.clip(f'<circle cx="{cx}" cy="{cy}" r="{r}"/>')
        d.add(f'<circle cx="{cx}" cy="{cy}" r="{r + 12}" fill="{metal(d, "#c9d0de")}" {rim("#c9d0de")}/>')
        d.add(f'<g clip-path="{clip}"><rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="#1c2350"/>{starfield(d, SW, SH, 40)}{earth(d, cx + r * 0.35, cy + r * 0.55, r * 0.7)}{planet(d, cx - r * 0.45, cy - r * 0.4, r * 0.14, "#e9a07a", False)}</g>')
        d.add(f'<path d="M{cx - r * 0.7:.1f} {cy - r * 0.2:.1f} A{r * 0.75:.1f} {r * 0.75:.1f} 0 0 1 {cx - r * 0.15:.1f} {cy - r * 0.7:.1f}" stroke="#fff" stroke-width="4" fill="none" opacity="0.5" stroke-linecap="round"/>')
    floor = d.lin([(0, '#9aa3b8'), (1, '#6c7488')])
    d.add(f'<path d="M0 250 Q182 236 364 250 L364 340 L0 340 Z" fill="{floor}"/>')
    d.add(''.join(f'<line x1="{182 + (x - 182) * 0.5:.1f}" y1="246" x2="{x}" y2="340" stroke="#8a93a8" stroke-width="1.2"/>' for x in range(-180, 560, 52)))
    d.add(''.join(f'<line x1="0" y1="{y}" x2="{SW}" y2="{y}" stroke="#8a93a8" stroke-width="1.2"/>' for y in (270, 300)))


def seat(d, x, y, s=1.0, color=INDIGO):
    f = ball(d, color)
    return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-18" y="-54" width="36" height="40" rx="12" fill="{f}" {rim(color)}/>'
            f'<rect x="-22" y="-18" width="44" height="12" rx="5" fill="{f}" {rim(color)}/><rect x="-4" y="-6" width="8" height="6" fill="#8a93a8"/>'
            f'<path d="M-9 -50 L-9 -16 M9 -50 L9 -16" stroke="{shade(color, -0.35)}" stroke-width="3.4" stroke-linecap="round"/>'
            f'<rect x="-6" y="-34" width="12" height="7" rx="2" fill="#c9d0de" stroke="#8a93a8" stroke-width="1"/></g>')


def sc_entrance(d):
    module_room(d, view=None)
    d.add(f'<rect x="120" y="50" width="124" height="200" rx="40" fill="{metal(d, "#c9d0de")}" stroke="#8a93a8" stroke-width="3"/>')
    d.add(f'<rect x="136" y="66" width="92" height="184" rx="30" fill="#1c2350"/><g clip-path="{d.clip("<rect x=\'136\' y=\'66\' width=\'92\' height=\'184\' rx=\'30\'/>")}">{starfield(d, SW, SH, 30)}{earth(d, 200, 230, 60)}</g>')
    d.add(f'<rect x="116" y="140" width="10" height="30" rx="3" fill="#6fd48a"/>')
    d.add(console(d, 252, 186, 100, 50, 1))
    d.add(''.join(f'<circle cx="{270 + k * 22}" cy="176" r="8" fill="none" stroke="{c}" stroke-width="4"/>' for k, c in enumerate(('#ef8f55', '#6fd48a', '#7fc4ec'))))
    d.add(robot(d, 70, 330, 2.0))


def sc_cabin(d):
    module_room(d, view=(182, 110, 66))
    for x in (60, 182, 304):
        d.add(seat(d, x, 330, 1.8, (INDIGO, ORANGE, INDIGO)[x // 182]))
    d.add(astronaut(d, 304, 300, 1.0))
    d.add(robot(d, 120, 336, 1.2))


def sc_checks(d):
    module_room(d, view=(270, 110, 54))
    d.add(seat(d, 120, 330, 2.0, INDIGO))
    d.add(robot(d, 270, 336, 2.2, tool='tablet'))
    d.add(console(d, 20, 100, 120, 60, 2))


def sc_control(d):
    module_room(d, view=(182, 90, 50))
    d.add(console(d, 20, 170, 324, 80, 4))
    d.add(seat(d, 182, 330, 2.0, INDIGO))
    d.add(robot(d, 320, 336, 1.3))


def sc_commander(d):
    module_room(d, view=(182, 110, 80))
    d.add(console(d, 40, 230, 284, 40, 3))
    d.add(astronaut(d, 182, 236, 2.0, commander=True, wave=True))
    d.add(f'<rect x="36" y="268" width="292" height="72" fill="{metal(d, "#c9d0de")}" stroke="#8a93a8" stroke-width="1.4"/>')
    d.add(star(182, 300, 12, '#ffd95a'))


def sc_scanner(d):
    module_room(d, view=(60, 80, 34))
    ring = d.lin([(0, '#ffffff'), (1, '#b9c2d4')], 0, 0, 1, 1)
    d.add(f'<circle cx="200" cy="190" r="96" fill="{ring}" stroke="#8a93a8" stroke-width="3"/><circle cx="200" cy="190" r="62" fill="#e6ecf7" stroke="#8a93a8" stroke-width="2"/>')
    d.add(f'<circle cx="200" cy="190" r="74" fill="none" stroke="#7fc4ec" stroke-width="4" opacity="0.7"/>')
    d.add(''.join(f'<circle cx="{200 + 84 * math.cos(a):.1f}" cy="{190 + 84 * math.sin(a):.1f}" r="3" fill="#6fd48a"/>' for a in [k * math.pi / 6 for k in range(12)]))
    d.add(f'<rect x="96" y="250" width="210" height="18" rx="6" fill="{ball(d, INDIGO)}"/><rect x="120" y="268" width="12" height="60" fill="#8a93a8"/><rect x="270" y="268" width="12" height="60" fill="#8a93a8"/>')
    d.add(robot(d, 330, 336, 1.4))


def sc_repair(d):
    module_room(d, view=(290, 90, 44))
    d.add(f'<rect x="40" y="80" width="150" height="120" rx="6" fill="#2c3550" stroke="#8a93a8" stroke-width="3"/>')
    d.add(''.join(f'<path d="M{56 + k * 22} 92 q14 50 -2 100" stroke="{c}" stroke-width="4" fill="none"/>' for k, c in enumerate(('#ef8f55', '#6fd48a', '#7fc4ec', '#ffd98a', '#e98bb0', '#b79ae0'))))
    d.add(f'<rect x="190" y="80" width="12" height="120" fill="{metal(d, "#c9d0de")}"/>')
    d.add(robot(d, 250, 336, 2.4, tool='wrench'))
    d.add(f'<rect x="40" y="290" width="100" height="44" rx="6" fill="{ORANGE}" stroke="{shade(ORANGE, -0.35)}" stroke-width="2"/><rect x="74" y="280" width="32" height="12" rx="4" fill="none" stroke="{shade(ORANGE, -0.35)}" stroke-width="3"/>')


def sc_command(d):
    module_room(d, view=None)
    d.add(f'<rect x="60" y="40" width="244" height="160" rx="8" fill="{metal(d, "#c9d0de")}" stroke="#8a93a8" stroke-width="2"/><rect x="72" y="52" width="220" height="136" rx="5" fill="#2c3550"/>')
    d.add(f'<g clip-path="{d.clip("<rect x=\'72\' y=\'52\' width=\'220\' height=\'136\' rx=\'5\'/>")}">{starfield(d, SW, SH, 30)}{astronaut(d, 182, 230, 1.9, wave=True)}</g>')
    d.add(f'<circle cx="276" cy="66" r="5" fill="#6fd48a"/>')
    d.add(console(d, 40, 230, 284, 40, 2))
    d.add(f'<path d="M300 236 L306 206" stroke="#3b3346" stroke-width="4"/><rect x="298" y="190" width="16" height="22" rx="8" fill="#3b3346"/>')
    d.add(robot(d, 60, 336, 1.4))


def sc_data(d):
    module_room(d, view=(300, 80, 40))
    d.add(console(d, 30, 130, 230, 110, 3))
    d.add(f'<rect x="40" y="246" width="210" height="8" fill="#8a93a8"/>')
    d.add(f'<rect x="270" y="200" width="70" height="60" rx="6" fill="{metal(d, "#c9d0de")}" stroke="#8a93a8" stroke-width="1.6"/><rect x="282" y="180" width="46" height="24" fill="#fff"/>' + ''.join(f'<line x1="288" y1="{186 + k * 5}" x2="322" y2="{186 + k * 5}" stroke="#b9c2d4" stroke-width="1.4"/>' for k in range(3)))
    d.add(robot(d, 180, 336, 1.6))


def sc_landing(d):
    d.add(sky(d, SH, '#7fb3d8', '#eaf4fa'))
    d.add(cloud(70, 60, 0.9), cloud(300, 40, 0.7))
    d.add(band(SW, SH, 230, 6, 0.4, '#a9d17c'))
    d.add(f'<rect x="0" y="236" width="{SW}" height="{SH - 236}" fill="{d.lin([(0, "#9ccb6e"), (1, "#7db358")])}"/>')
    d.add(tree(d, 40, 250, 1.4), tree(d, 330, 248, 1.2))
    d.add(capsule(d, 170, 300, 2.0))
    d.add(astronaut(d, 290, 336, 1.7, wave=True))
    d.add(robot(d, 70, 336, 1.3))


SCENES = {
    'entrance': (sc_entrance, 'at the entrance to the station (reception)'),
    'cabin': (sc_cabin, 'in the waiting cabin (waiting before the checks)'),
    'checks': (sc_checks, 'at the checks before take-off (the checks)'),
    'control': (sc_control, 'in the control room (waiting for the doctor)'),
    'commander': (sc_commander, 'meeting the ship commander (the doctor)'),
    'scanner': (sc_scanner, 'at the space scanner (tests)'),
    'repair': (sc_repair, 'repairing the station (treatment)'),
    'command': (sc_command, 'at the command centre (consultation)'),
    'data': (sc_data, 'while the computer processes the data (waiting for results)'),
    'landing': (sc_landing, 'after a safe landing on Earth (the end)'),
}


# ---------- the map backgrounds: deep space, stars, planets ----------
def background(W, H, planets, seed, comment, earth_at=None):
    d = Doc(W, H, seed)
    s = (W / 412) ** 0.5
    d.add(f'<rect width="{W}" height="{H}" fill="{d.lin([(0, NIGHT0), (1, NIGHT1)])}"/>')
    for k in range(4):
        # a soft nebula; drawn again one width to each side, so the background repeats without a seam (on a wide
        # screen the portrait map is tiled)
        cx, cy = d.rng.uniform(0, W), d.rng.uniform(H * 0.2, H)
        rx, ry = d.rng.uniform(120, 220) * s, d.rng.uniform(60, 110) * s
        fill = d.rad([(0, d.rng.choice(["#8a6ad0", "#5a8ad0", "#c06aa8"]), 0.25), (1, "#000", 0)])
        d.add(''.join(f'<ellipse cx="{cx + dx:.0f}" cy="{cy:.0f}" rx="{rx:.0f}" ry="{ry:.0f}" fill="{fill}"/>' for dx in (-W, 0, W)))
    d.add(starfield(d, W, H, int(W * H / 2200), s))
    for k in range(int(W * H / 60000)):
        d.add(star(d.rng.uniform(0, W), d.rng.uniform(0, H), d.rng.uniform(2, 4) * s, '#fff'))
    for p in planets:
        d.add(planet(d, *p))
    if earth_at:
        d.add(earth(d, *earth_at))
    return d.svg(f'{WORLD} world: {comment}', grain=0.02, wobble=0.6, clay=False)


def portrait_bg():
    return background(412, 1100, [(330, 200, 26, '#e9a07a'), (160, 640, 18, '#b79ae0', False), (350, 960, 14, '#7fc4ec')], 101,
                      'the portrait map background (the 412×939 frame, drawn 412×1100 so the second map can move it)', earth_at=(206, 1070, 64))


def landscape_bg():
    return background(1920, 1080, [(1100, 160, 60, '#e9a07a'), (300, 300, 36, '#b79ae0', False), (1820, 420, 28, '#7fc4ec')], 102,
                      'the landscape map background (the 1920×1080 frame)', earth_at=(980, 1180, 300))


def sheet_floor():
    d = Doc(364, 340, 109)
    d.add(f'<rect width="364" height="340" fill="{d.lin([(0, "#e6e9f6"), (1, "#c9cfe4")])}"/>')
    d.add(starfield(d, 364, 200, 30))
    return d.svg(f'{WORLD} world: the panel behind a picture on its sheet', clay=False)


def celebrate():
    d = Doc(640, 480, 111)
    d.add(f'<rect width="640" height="480" fill="{d.lin([(0, "#7fb3d8"), (1, "#eaf4fa")])}"/>')
    d.add(cloud(120, 90, 1.2), cloud(520, 70, 1.0))
    d.add(band(640, 480, 330, 10, 0.5, '#a9d17c'), band(640, 480, 380, 10, 2.0, '#9ccb6e'))
    fig = Doc(640, 480, 112, prefix='v')
    fig.add(capsule(fig, 320, 400, 2.2))
    fig.add(astronaut(fig, 470, 450, 1.8, commander=True, wave=True))
    fig.add(astronaut(fig, 170, 450, 1.6, wave=True))
    fig.add(robot(fig, 560, 460, 1.4), robot(fig, 80, 460, 1.3))
    d.defs.extend(fig.defs)
    d.add('<g filter="url(#clay)">' + '\n'.join(fig.body) + '</g>')
    return d.svg(f'{WORLD} world: back on Earth happy (the celebration screen)', clay=False)


def card():
    d = Doc(300, 220, 113)
    d.add(m_moon(d))
    d.add(rocket(d, 110, 180, 1.0))
    d.add(astronaut(d, 200, 188, 0.95, wave=True))
    d.add(planet(d, 250, 40, 14, '#e9a07a'))
    return d.svg(f'{WORLD} world: the card on the world select screen')


def main():
    files = {}
    for k, (f, c) in STATIONS.items():
        files[f'station-{k}.svg'] = station(k, f, c, WORLD, m_earth if k == 'landing' else m_moon)
    for k, (f, c) in SCENES.items():
        files[f'scene-{k}.svg'] = scene(k, f, c, WORLD)
    files['map-portrait.svg'] = portrait_bg()
    files['map-landscape.svg'] = landscape_bg()
    files['sheet-floor.svg'] = sheet_floor()
    files['celebrate.svg'] = celebrate()
    files['card.svg'] = card()
    write('space', files)


if __name__ == '__main__':
    lib.RELIEF = 4
    main()

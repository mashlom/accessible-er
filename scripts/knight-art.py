"""Draws the knight world's pictures, drawn as SVG for the project (flat storybook style)."""
import os, math, random
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'worlds', 'knight', 'art')

# palette
SKY0, SKY1 = '#4f8bc4', '#d9edf8'
STONE, STONE_D, STONE_L = '#cfc7b6', '#a89f8e', '#e4ddcf'
SLATE = '#4a6fa5'
SLATE_D = '#3a5a8c'
RED, RED_D = '#c8553d', '#a44331'
PURPLE, PURPLE_D = '#6b4fa0', '#553d84'
GOLD, GOLD_D = '#e8b84a', '#c99a32'
WOOD, WOOD_D = '#8a5a3b', '#6b4329'
GRASS, GRASS_D, GRASS_L = '#8cc05a', '#6fa548', '#a8d57a'
WIN = '#ffd97a'
DARK = '#3b3346'
CREAM = '#f6ecd6'


def svg(w, h, body, comment=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n<!-- {comment} -->\n{body}\n</svg>\n'


def base():
    """The grassy mound every station stands on (300×220 box)"""
    return f'''<ellipse cx="150" cy="200" rx="132" ry="14" fill="#000" opacity="0.12"/>
<path d="M18 182 Q150 222 282 182 L282 186 Q150 230 18 186 Z" fill="{GRASS_D}"/>
<ellipse cx="150" cy="182" rx="132" ry="24" fill="{GRASS}"/>
<ellipse cx="128" cy="178" rx="92" ry="12" fill="{GRASS_L}" opacity="0.6"/>'''


def flag(x, y, color, h=26, left=False):
    d = -1 if left else 1
    return f'''<line x1="{x}" y1="{y}" x2="{x}" y2="{y + h}" stroke="{WOOD_D}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M{x} {y + 1} L{x + d * 20} {y + 6} L{x} {y + 12} Z" fill="{color}"/>'''


def tower(x, w, top, bottom, roof, roof_h=34, win=True):
    cx = x + w / 2
    out = [f'<rect x="{x}" y="{top}" width="{w}" height="{bottom - top}" fill="{STONE}"/>',
           f'<rect x="{x + w * 0.62}" y="{top}" width="{w * 0.38}" height="{bottom - top}" fill="{STONE_D}" opacity="0.45"/>',
           f'<path d="M{x - 5} {top + 1} L{cx} {top - roof_h} L{x + w + 5} {top + 1} Z" fill="{roof}"/>',
           f'<path d="M{cx} {top - roof_h} L{x + w + 5} {top + 1} L{cx + 2} {top + 1} Z" fill="#000" opacity="0.14"/>']
    if win:
        wy = top + (bottom - top) * 0.3
        out.append(f'<rect x="{cx - 4}" y="{wy}" width="8" height="13" rx="4" fill="{DARK}"/>')
    return '\n'.join(out)


def crenels(x, w, y, n, color=STONE):
    step = w / (2 * n - 1)
    return '\n'.join(f'<rect x="{x + i * 2 * step:.1f}" y="{y - 8}" width="{step:.1f}" height="9" fill="{color}"/>' for i in range(n))


def station_gate():
    body = [base()]
    # wall between the towers, with the gate
    body.append(f'<rect x="96" y="92" width="108" height="90" fill="{STONE}"/>')
    body.append(crenels(96, 108, 92, 5))
    body.append(f'<path d="M124 182 L124 130 Q150 104 176 130 L176 182 Z" fill="{DARK}"/>')
    body.append(f'<path d="M128 182 L128 132 Q150 110 172 132 L172 182 Z" fill="{WOOD}"/>')
    for x in (136, 146, 156, 166):
        body.append(f'<line x1="{x}" y1="{122 if x in (146, 156) else 128}" x2="{x}" y2="182" stroke="{WOOD_D}" stroke-width="2"/>')
    body.append(f'<path d="M124 130 Q150 104 176 130" fill="none" stroke="{STONE_D}" stroke-width="5"/>')
    body.append(tower(56, 44, 70, 182, SLATE))
    body.append(tower(200, 44, 70, 182, SLATE))
    body.append(flag(78, 18, RED))
    body.append(flag(222, 18, RED))
    # the book of the knights on its stand, where one is written in at the gate
    body.append(f'<rect x="246" y="160" width="5" height="22" fill="{WOOD_D}"/>')
    body.append(f'<path d="M232 152 L248 158 L264 152 L264 162 L248 168 L232 162 Z" fill="{CREAM}" stroke="{WOOD_D}" stroke-width="1.5"/>')
    body.append(f'<line x1="248" y1="158" x2="248" y2="168" stroke="{WOOD_D}" stroke-width="1.2"/>')
    return svg(300, 220, '\n'.join(body), 'Knight world: the castle gate (reception)')


def tree(x, y, s=1.0):
    return f'''<rect x="{x - 4 * s}" y="{y - 10 * s}" width="{8 * s}" height="{26 * s}" fill="{WOOD}"/>
<circle cx="{x}" cy="{y - 26 * s}" r="{22 * s}" fill="{GRASS_D}"/>
<circle cx="{x - 12 * s}" cy="{y - 16 * s}" r="{14 * s}" fill="{GRASS_D}"/>
<circle cx="{x + 12 * s}" cy="{y - 18 * s}" r="{15 * s}" fill="#5f9440"/>
<circle cx="{x - 6 * s}" cy="{y - 32 * s}" r="{10 * s}" fill="{GRASS}" opacity="0.7"/>'''


def station_courtyard():
    body = [base()]
    # the low wall around the courtyard
    body.append(f'<path d="M40 150 Q150 118 260 150 L260 172 Q150 140 40 172 Z" fill="{STONE}"/>')
    body.append(f'<path d="M40 150 Q150 118 260 150" fill="none" stroke="{STONE_L}" stroke-width="4"/>')
    body.append(tree(232, 150, 1.25))
    # the well
    body.append(f'<rect x="88" y="128" width="6" height="40" fill="{WOOD_D}"/><rect x="138" y="128" width="6" height="40" fill="{WOOD_D}"/>')
    body.append(f'<path d="M80 130 L116 104 L152 130 Z" fill="{RED}"/><path d="M116 104 L152 130 L118 130 Z" fill="{RED_D}"/>')
    body.append(f'<ellipse cx="116" cy="168" rx="34" ry="9" fill="{STONE_D}"/>')
    body.append(f'<rect x="82" y="150" width="68" height="20" fill="{STONE}"/>')
    body.append(f'<ellipse cx="116" cy="150" rx="34" ry="9" fill="{STONE_L}"/><ellipse cx="116" cy="150" rx="26" ry="6" fill="{DARK}"/>')
    body.append(f'<line x1="116" y1="132" x2="116" y2="146" stroke="{WOOD_D}" stroke-width="1.5"/><rect x="110" y="140" width="12" height="9" fill="{WOOD}"/>')
    # the bench to wait on
    body.append(f'<rect x="168" y="164" width="52" height="6" rx="2" fill="{WOOD}"/>')
    body.append(f'<rect x="172" y="170" width="4" height="12" fill="{WOOD_D}"/><rect x="212" y="170" width="4" height="12" fill="{WOOD_D}"/>')
    body.append(f'<rect x="168" y="150" width="52" height="5" rx="2" fill="{WOOD}"/><rect x="172" y="155" width="4" height="10" fill="{WOOD_D}"/><rect x="212" y="155" width="4" height="10" fill="{WOOD_D}"/>')
    return svg(300, 220, '\n'.join(body), 'Knight world: the castle courtyard (waiting before the checks)')


def leaf(cx, cy, s=1.0, color=GRASS_D):
    return f'<path d="M{cx} {cy + 9 * s} Q{cx - 9 * s} {cy} {cx} {cy - 9 * s} Q{cx + 9 * s} {cy} {cx} {cy + 9 * s} Z" fill="{color}"/><line x1="{cx}" y1="{cy - 7 * s}" x2="{cx}" y2="{cy + 9 * s}" stroke="#fff" stroke-width="{1.2 * s}" opacity="0.8"/>'


def station_tent():
    body = [base()]
    # the healer's striped tent
    body.append(f'<path d="M62 180 L150 58 L238 180 Z" fill="{CREAM}"/>')
    for i, x in enumerate(range(62, 238, 22)):
        if i % 2 == 0:
            body.append(f'<path d="M{x} 180 L150 58 L{x + 22} 180 Z" fill="{SLATE}"/>')
    body.append(f'<path d="M150 58 L238 180 L196 180 Z" fill="#000" opacity="0.10"/>')
    # the open flap
    body.append(f'<path d="M130 180 L150 116 L170 180 Z" fill="{DARK}"/>')
    body.append(f'<path d="M150 116 L130 180 L120 180 Z" fill="{CREAM}"/><path d="M150 116 L170 180 L180 180 Z" fill="{CREAM}"/>')
    body.append(f'<path d="M48 182 Q150 172 252 182" fill="none" stroke="{WOOD_D}" stroke-width="2"/>')
    body.append(flag(150, 26, GRASS_D))
    # a banner with a leaf (the healer's sign) and a shield leaning on the tent
    body.append(f'<path d="M84 120 L108 120 L108 150 L96 144 L84 150 Z" fill="{CREAM}" stroke="{GOLD_D}" stroke-width="1.5"/>')
    body.append(leaf(96, 132, 0.9))
    body.append(f'<path d="M206 146 L232 146 L232 164 Q232 178 219 184 Q206 178 206 164 Z" fill="{RED}" stroke="{GOLD}" stroke-width="2.5"/>')
    body.append(f'<path d="M219 150 L219 178 M209 160 L229 160" stroke="{GOLD}" stroke-width="2.5"/>')
    return svg(300, 220, '\n'.join(body), "Knight world: the healer's tent (the checks)")


def banner(x, y, color, h=34):
    return f'<path d="M{x} {y} L{x + 14} {y} L{x + 14} {y + h} L{x + 7} {y + h - 7} L{x} {y + h} Z" fill="{color}"/><circle cx="{x + 7}" cy="{y + 12}" r="3" fill="{GOLD}"/>'


def station_hall():
    body = [base()]
    # the long hall of the knights
    body.append(f'<rect x="54" y="92" width="192" height="90" fill="{STONE}"/>')
    body.append(f'<rect x="170" y="92" width="76" height="90" fill="{STONE_D}" opacity="0.35"/>')
    body.append(f'<path d="M44 94 L150 40 L256 94 Z" fill="{RED}"/><path d="M150 40 L256 94 L150 94 Z" fill="{RED_D}"/>')
    body.append(f'<circle cx="150" cy="72" r="10" fill="{WIN}" stroke="{STONE_D}" stroke-width="3"/>')
    for x in (72, 104, 182, 214):
        body.append(f'<path d="M{x} 150 L{x} 118 Q{x + 7} 106 {x + 14} 118 L{x + 14} 150 Z" fill="{WIN}" stroke="{STONE_D}" stroke-width="2.5"/>')
    body.append(f'<path d="M134 182 L134 138 Q150 122 166 138 L166 182 Z" fill="{WOOD}" stroke="{STONE_D}" stroke-width="3"/>')
    body.append(f'<circle cx="160" cy="162" r="2.2" fill="{GOLD}"/>')
    body.append(banner(90, 98, SLATE))
    body.append(banner(196, 98, SLATE))
    return svg(300, 220, '\n'.join(body), 'Knight world: the hall of the knights (waiting for the wizard)')


def star(cx, cy, r, color=GOLD):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append(f'{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{color}"/>'


def station_wizard():
    body = [base()]
    # the wizard's tower: tall, round, a purple roof with stars
    body.append(f'<rect x="112" y="64" width="76" height="118" fill="{STONE}"/>')
    body.append(f'<rect x="160" y="64" width="28" height="118" fill="{STONE_D}" opacity="0.45"/>')
    body.append(f'<path d="M100 66 L150 6 L200 66 Z" fill="{PURPLE}"/><path d="M150 6 L200 66 L150 66 Z" fill="{PURPLE_D}"/>')
    body.append(star(138, 40, 6))
    body.append(star(156, 28, 4.5))
    body.append(star(170, 50, 4))
    body.append(f'<rect x="104" y="62" width="92" height="8" rx="3" fill="{STONE_D}"/>')
    body.append(f'<circle cx="150" cy="96" r="13" fill="{WIN}" stroke="{STONE_D}" stroke-width="3"/>')
    body.append(f'<path d="M150 83 L150 109 M137 96 L163 96" stroke="{STONE_D}" stroke-width="2"/>')
    body.append(f'<path d="M134 182 L134 140 Q150 126 166 140 L166 182 Z" fill="{PURPLE_D}"/>')
    body.append(star(150, 152, 5))
    # a little side house and a lantern
    body.append(f'<rect x="196" y="134" width="44" height="48" fill="{STONE}"/>')
    body.append(f'<path d="M190 136 L218 112 L246 136 Z" fill="{PURPLE}"/>')
    body.append(f'<rect x="210" y="150" width="14" height="14" rx="2" fill="{WIN}" stroke="{STONE_D}" stroke-width="2"/>')
    body.append(f'<line x1="78" y1="182" x2="78" y2="140" stroke="{DARK}" stroke-width="3"/><rect x="71" y="128" width="14" height="16" rx="3" fill="{WIN}" stroke="{DARK}" stroke-width="2"/>')
    return svg(300, 220, '\n'.join(body), "Knight world: the great wizard's tower (the doctor)")


def sparkle(cx, cy, r, color='#fff'):
    return f'<path d="M{cx} {cy - r} Q{cx + r * 0.18} {cy - r * 0.18} {cx + r} {cy} Q{cx + r * 0.18} {cy + r * 0.18} {cx} {cy + r} Q{cx - r * 0.18} {cy + r * 0.18} {cx - r} {cy} Q{cx - r * 0.18} {cy - r * 0.18} {cx} {cy - r} Z" fill="{color}"/>'


def station_mirror():
    body = [base()]
    # the magic mirror on its stand
    body.append(f'<path d="M126 182 L136 150 L164 150 L174 182 Z" fill="{GOLD_D}"/>')
    body.append(f'<rect x="144" y="134" width="12" height="20" fill="{GOLD_D}"/>')
    body.append(f'<ellipse cx="150" cy="84" rx="50" ry="62" fill="{GOLD}"/>')
    body.append(f'<ellipse cx="150" cy="84" rx="40" ry="52" fill="#bfe3f5"/>')
    body.append(f'<path d="M124 64 Q140 44 162 40 Q138 56 130 80 Z" fill="#fff" opacity="0.75"/>')
    body.append(f'<path d="M150 118 Q168 108 176 90 Q172 112 156 122 Z" fill="#fff" opacity="0.5"/>')
    body.append(star(150, 22, 7))
    body.append(sparkle(92, 70, 9, GOLD))
    body.append(sparkle(212, 104, 8, GOLD))
    body.append(sparkle(204, 50, 5, '#fff'))
    return svg(300, 220, '\n'.join(body), 'Knight world: the magic mirror (imaging)')


def station_forge():
    body = [base()]
    # the forge: a stone hut with a chimney and a warm glow
    body.append(f'<rect x="60" y="96" width="120" height="86" fill="{STONE}"/>')
    body.append(f'<rect x="140" y="96" width="40" height="86" fill="{STONE_D}" opacity="0.4"/>')
    body.append(f'<rect x="146" y="44" width="22" height="60" fill="{STONE_D}"/>')
    body.append(f'<path d="M50 98 L120 60 L190 98 Z" fill="{WOOD}"/><path d="M120 60 L190 98 L120 98 Z" fill="{WOOD_D}"/>')
    body.append(f'<circle cx="160" cy="34" r="8" fill="#e9e6ee" opacity="0.8"/><circle cx="170" cy="20" r="6" fill="#e9e6ee" opacity="0.6"/>')
    body.append(f'<path d="M86 182 L86 136 Q110 112 134 136 L134 182 Z" fill="{DARK}"/>')
    body.append(f'<path d="M94 182 L94 150 Q110 134 126 150 L126 182 Z" fill="#f08a3c"/>')
    body.append(f'<path d="M102 182 Q104 160 110 152 Q116 160 118 182 Z" fill="{WIN}"/>')
    # the anvil and the hammer in front
    body.append(f'<path d="M196 150 L252 150 Q252 160 240 162 L228 162 L228 174 L238 182 L210 182 L220 174 L220 162 L204 162 Q196 158 196 150 Z" fill="#5b5f6b"/>')
    body.append(f'<path d="M196 150 L252 150 L250 146 L200 146 Z" fill="#7a7f8c"/>')
    body.append(f'<rect x="232" y="126" width="5" height="26" rx="2" transform="rotate(-30 234 139)" fill="{WOOD}"/>')
    body.append(f'<rect x="224" y="118" width="20" height="11" rx="2" transform="rotate(-30 234 124)" fill="#7a7f8c"/>')
    return svg(300, 220, '\n'.join(body), 'Knight world: the forge (treatment)')


def scroll(cx, cy, w, color=CREAM):
    return f'''<rect x="{cx - w / 2}" y="{cy - 5}" width="{w}" height="10" fill="{color}" stroke="{GOLD_D}" stroke-width="1.2"/>
<circle cx="{cx - w / 2}" cy="{cy}" r="5.5" fill="{color}" stroke="{GOLD_D}" stroke-width="1.2"/>
<circle cx="{cx + w / 2}" cy="{cy}" r="5.5" fill="{color}" stroke="{GOLD_D}" stroke-width="1.2"/>
<rect x="{cx - 3}" y="{cy - 5}" width="6" height="10" fill="{RED}"/>'''


def station_council():
    body = [base()]
    # the council's pavilion: a scalloped roof on four poles, a round table with scrolls
    for x in (64, 236):
        body.append(f'<rect x="{x - 3}" y="78" width="6" height="104" fill="{WOOD}"/>')
    body.append(f'<path d="M50 80 L150 26 L250 80 Z" fill="{SLATE}"/>')
    body.append(f'<path d="M150 26 L250 80 L150 80 Z" fill="{SLATE_D}"/>')
    sc = ''.join(f'Q{50 + i * 25 + 12.5} 96 {50 + (i + 1) * 25} 80 ' for i in range(8))
    body.append(f'<path d="M50 80 {sc} Z" fill="{CREAM}"/>')
    body.append(flag(150, 0, GOLD))
    # high-backed chairs
    for x in (96, 204):
        body.append(f'<rect x="{x - 12}" y="118" width="24" height="44" rx="6" fill="{RED}"/><rect x="{x - 14}" y="156" width="28" height="8" rx="2" fill="{WOOD_D}"/>')
        body.append(f'<rect x="{x - 12}" y="164" width="4" height="16" fill="{WOOD_D}"/><rect x="{x + 8}" y="164" width="4" height="16" fill="{WOOD_D}"/>')
    body.append(f'<rect x="138" y="112" width="24" height="34" rx="6" fill="{PURPLE}"/>')
    body.append(f'<ellipse cx="150" cy="150" rx="46" ry="12" fill="{WOOD}"/><ellipse cx="150" cy="147" rx="46" ry="11" fill="#a06c48"/>')
    body.append(f'<rect x="144" y="156" width="12" height="26" fill="{WOOD_D}"/>')
    body.append(scroll(136, 144, 22))
    body.append(scroll(166, 148, 18))
    return svg(300, 220, '\n'.join(body), 'Knight world: the council of the wise (consultation)')


def station_prophecy():
    body = [base()]
    # the crystal ball on a golden pedestal, a soft glow (no flashing)
    body.append(f'<path d="M118 182 L128 154 L172 154 L182 182 Z" fill="{GOLD_D}"/>')
    body.append(f'<path d="M126 158 Q150 140 174 158 L170 148 Q150 134 130 148 Z" fill="{GOLD}"/>')
    body.append(f'<defs><radialGradient id="ball" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#e9ddff"/><stop offset="0.55" stop-color="#a98be0"/><stop offset="1" stop-color="{PURPLE_D}"/></radialGradient></defs>')
    body.append(f'<circle cx="150" cy="96" r="54" fill="#d9ccf5" opacity="0.35"/>')
    body.append(f'<circle cx="150" cy="96" r="46" fill="url(#ball)"/>')
    body.append(f'<path d="M126 108 Q140 84 168 92 Q150 98 140 114 Z" fill="#fff" opacity="0.35"/>')
    body.append(f'<ellipse cx="134" cy="74" rx="11" ry="7" fill="#fff" opacity="0.7" transform="rotate(-30 134 74)"/>')
    body.append(star(166, 108, 5, '#fff'))
    body.append(sparkle(90, 66, 8, GOLD))
    body.append(sparkle(214, 90, 7, GOLD))
    body.append(star(206, 44, 4.5))
    return svg(300, 220, '\n'.join(body), 'Knight world: waiting for the prophecy (waiting for results)')


def station_victory():
    body = [base()]
    # the castle of the victory feast: a keep, towers, banners and a golden crown
    body.append(f'<rect x="70" y="100" width="160" height="82" fill="{STONE}"/>')
    body.append(crenels(70, 160, 100, 7))
    body.append(f'<rect x="118" y="58" width="64" height="124" fill="{STONE}"/>')
    body.append(f'<rect x="160" y="58" width="22" height="124" fill="{STONE_D}" opacity="0.4"/>')
    body.append(crenels(118, 64, 58, 4))
    body.append(tower(46, 36, 84, 182, RED, 30))
    body.append(tower(218, 36, 84, 182, RED, 30))
    body.append(f'<path d="M132 182 L132 140 Q150 122 168 140 L168 182 Z" fill="{WOOD}" stroke="{STONE_D}" stroke-width="3"/>')
    body.append(f'<path d="M134 96 L134 78 L142 86 L150 72 L158 86 L166 78 L166 96 Z" fill="{GOLD}" stroke="{GOLD_D}" stroke-width="1.5"/>')
    body.append(flag(64, 26, SLATE))
    body.append(flag(236, 26, SLATE))
    body.append(flag(150, 18, GOLD, 32))
    # bunting along the wall
    pts = ' '.join(f'M{80 + i * 18} 110 L{89 + i * 18} 122 L{98 + i * 18} 110 Z' for i in range(8))
    body.append(f'<path d="M78 108 Q150 120 222 108" fill="none" stroke="{WOOD_D}" stroke-width="1.2"/>')
    body.append(f'<path d="{pts}" fill="{GOLD}"/>')
    return svg(300, 220, '\n'.join(body), 'Knight world: the victory feast (the end of the journey)')


STATIONS = {
    'gate': station_gate, 'courtyard': station_courtyard, 'tent': station_tent, 'hall': station_hall,
    'wizard': station_wizard, 'mirror': station_mirror, 'forge': station_forge, 'council': station_council,
    'prophecy': station_prophecy, 'victory': station_victory,
}

# ---------- backgrounds ----------
def cloud(cx, cy, s):
    return f'<g fill="#fff" opacity="0.9"><ellipse cx="{cx}" cy="{cy}" rx="{34 * s}" ry="{13 * s}"/><circle cx="{cx - 12 * s}" cy="{cy - 8 * s}" r="{13 * s}"/><circle cx="{cx + 10 * s}" cy="{cy - 12 * s}" r="{16 * s}"/></g>'


def far_castle(cx, base_y, s, color='#a3aecb'):
    w = 90 * s
    x = cx - w / 2
    p = [f'<rect x="{x}" y="{base_y - 40 * s}" width="{w}" height="{40 * s}" fill="{color}"/>']
    for k in range(5):
        p.append(f'<rect x="{x + k * w / 4.5:.1f}" y="{base_y - 46 * s}" width="{w / 9:.1f}" height="{6 * s}" fill="{color}"/>')
    for tx, th in ((x - 6 * s, 66), (cx - 9 * s, 86), (x + w - 12 * s, 66)):
        p.append(f'<rect x="{tx:.1f}" y="{base_y - th * s:.1f}" width="{18 * s:.1f}" height="{th * s:.1f}" fill="{color}"/>')
        p.append(f'<path d="M{tx - 3 * s:.1f} {base_y - th * s:.1f} L{tx + 9 * s:.1f} {base_y - (th + 22) * s:.1f} L{tx + 21 * s:.1f} {base_y - th * s:.1f} Z" fill="#8c95b8"/>')
    return '\n'.join(p)


def band(W, y0, amp, phase, color, H):
    pts = []
    n = 8
    for i in range(n + 1):
        x = W * i / n
        y = y0 + amp * math.sin(phase + i * 1.3)
        pts.append((x, y))
    d = f'M0 {pts[0][1]:.0f} ' + ' '.join(f'Q{(pts[i][0] + pts[i + 1][0]) / 2:.0f} {pts[i][1] + amp * 0.6:.0f} {pts[i + 1][0]:.0f} {pts[i + 1][1]:.0f}' for i in range(n)) + f' L{W} {H} L0 {H} Z'
    return f'<path d="{d}" fill="{color}"/>'


def bush(x, y, s=1.0):
    return f'<g><circle cx="{x - 10 * s}" cy="{y}" r="{10 * s}" fill="{GRASS_D}"/><circle cx="{x + 8 * s}" cy="{y - 2 * s}" r="{12 * s}" fill="#5f9440"/><circle cx="{x}" cy="{y - 8 * s}" r="{11 * s}" fill="{GRASS_D}"/></g>'


def flowers(rng, x0, y0, x1, y1, n):
    cols = ['#fff', '#f6d36b', '#f2a0b5', '#c9b6f0']
    return '\n'.join(f'<circle cx="{rng.uniform(x0, x1):.0f}" cy="{rng.uniform(y0, y1):.0f}" r="{rng.uniform(1.8, 3):.1f}" fill="{rng.choice(cols)}"/>' for _ in range(n))


def background(W, H, horizon, castle, trees, bushes, flower_areas, clouds, seed, comment):
    rng = random.Random(seed)
    b = [f'<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SKY0}"/><stop offset="1" stop-color="{SKY1}"/></linearGradient></defs>',
         f'<rect width="{W}" height="{H}" fill="url(#sky)"/>']
    b += [cloud(*c) for c in clouds]
    # far mountains, the far castle, then the meadow in bands, lighter far away
    b.append(band(W, horizon - 30 * W / 412 * 0.3 - 10, 14 * (W / 412) ** 0.5, 0.4, '#b7c6dd', H))
    b.append(far_castle(*castle))
    unit = (W / 412) ** 0.5
    rows = [('#b9db8e', 0), ('#a6d07c', 0.16), ('#94c56c', 0.36), ('#84b95f', 0.6), ('#78ae55', 0.82)]
    for i, (col, f) in enumerate(rows):
        b.append(band(W, horizon + (H - horizon) * f, 10 * unit, i * 1.7, col, H))
    b += [tree(*t) for t in trees]
    b += [bush(*t) for t in bushes]
    b += [flowers(rng, *a) for a in flower_areas]
    return svg(W, H, '\n'.join(b), comment)


def portrait_bg():
    return background(
        412, 1100, 196, (372, 196, 0.55),
        trees=[(372, 232, 0.75), (396, 252, 0.6), (26, 356, 0.8), (388, 520, 0.85), (20, 690, 0.8), (392, 860, 0.85), (360, 1000, 0.8), (40, 1020, 0.7)],
        bushes=[(255, 220, 0.7), (40, 420, 0.8), (240, 580, 0.8), (30, 740, 0.7), (270, 930, 0.9), (180, 1060, 0.9)],
        flower_areas=[(230, 200, 400, 280, 12), (0, 300, 120, 440, 14), (240, 440, 412, 600, 14), (0, 600, 170, 760, 14), (240, 760, 412, 940, 14), (0, 930, 412, 1100, 24)],
        clouds=[(250, 156, 0.5), (110, 170, 0.45)], seed=1,
        comment='Knight world: the portrait map background (the 412×939 frame, drawn 412×1100 so the second map can move it)')


def landscape_bg():
    return background(
        1920, 1080, 330, (920, 332, 1.6),
        trees=[(1560, 470, 1.7), (1660, 440, 1.4), (1840, 500, 1.8), (90, 430, 1.6), (230, 400, 1.3), (1880, 760, 1.6), (560, 1040, 1.5)],
        bushes=[(1150, 860, 1.6), (1300, 960, 1.8), (1420, 820, 1.3), (500, 820, 1.5), (640, 980, 1.6), (450, 1020, 1.4), (1000, 380, 1.2), (780, 390, 1.1)],
        flower_areas=[(1100, 740, 1460, 1080, 40), (420, 720, 700, 1080, 34), (1480, 380, 1900, 680, 34), (0, 360, 320, 620, 26), (740, 360, 1060, 420, 14)],
        clouds=[(420, 170, 1.4), (760, 230, 1.1), (1150, 160, 1.3), (1600, 270, 1.0)], seed=2,
        comment='Knight world: the landscape map background (the 1920×1080 frame)')


def sheet_floor():
    return svg(364, 340, f'''<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaf4fb"/><stop offset="0.55" stop-color="#f4efe2"/><stop offset="1" stop-color="#e3d6b8"/></linearGradient></defs>
<rect width="364" height="340" fill="url(#g)"/>
{band(364, 215, 6, 0.7, '#c9dcb0', 340)}
{band(364, 255, 5, 2.1, '#b5d197', 340)}
{cloud(70, 60, 0.8)}{cloud(290, 40, 0.6)}''', 'Knight world: the panel behind a picture on its sheet')


def celebrate():
    inner = station_victory().split('-->', 1)[1].rsplit('</svg>', 1)[0]
    pts = ' '.join(f'M{20 + i * 40} {40 + 14 * math.sin(i * 0.5):.0f} l20 26 l20 -26 Z' for i in range(15))
    cols = [RED, GOLD, SLATE]
    flags = ''.join(f'<path d="M{20 + i * 40} {36 + 10 * math.sin(i * 0.4):.0f} l20 26 l20 -26 Z" fill="{cols[i % 3]}"/>' for i in range(15))
    return svg(640, 480, f'''<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{SKY0}"/><stop offset="1" stop-color="{SKY1}"/></linearGradient></defs>
<rect width="640" height="480" fill="url(#sky)"/>
{cloud(120, 120, 1.2)}{cloud(520, 100, 1.0)}
{band(640, 300, 10, 0.5, '#a6d07c', 480)}
{band(640, 360, 10, 2.0, '#8cc05a', 480)}
<path d="M0 36 Q320 70 640 36" fill="none" stroke="{WOOD_D}" stroke-width="2"/>
{flags}
<g transform="translate(95 110) scale(1.5)">{inner}</g>''', 'Knight world: the victory feast (the celebration screen)')


files = {f'station-{k}.svg': f() for k, f in STATIONS.items()}
files['map-portrait.svg'] = portrait_bg()
files['map-landscape.svg'] = landscape_bg()
files['sheet-floor.svg'] = sheet_floor()
files['celebrate.svg'] = celebrate()
for n, s in files.items():
    open(os.path.join(OUT, n), 'w').write(s)
print(len(files), 'files')

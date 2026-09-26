import { SampleItem } from '../types/waste';

// Utility to create crisp SVG data URIs for sample test items
function createSvgDataUri(svgContent: string): string {
  const cleanSvg = svgContent.trim().replace(/\s+/g, ' ');
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}

export const SAMPLE_ITEMS: SampleItem[] = [
  {
    id: 'sample-cardboard',
    title: 'Corrugated Shipping Carton',
    category: 'Cardboard & Paper',
    description: 'Brown Kraft cardboard box with tape residue and barcode sticker',
    accentColor: '#D97706',
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
          <linearGradient id="cardboardTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C59B63"/>
            <stop offset="100%" stop-color="#A57943"/>
          </linearGradient>
          <linearGradient id="cardboardSide1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#B88A52"/>
            <stop offset="100%" stop-color="#8F622C"/>
          </linearGradient>
          <linearGradient id="cardboardSide2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#9E733D"/>
            <stop offset="100%" stop-color="#7B5020"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg)"/>
        <!-- Shadow -->
        <ellipse cx="200" cy="255" rx="140" ry="25" fill="#cbd5e1" opacity="0.6"/>
        <!-- 3D Box Perspective -->
        <!-- Front Left Face -->
        <polygon points="90,135 200,185 200,250 90,200" fill="url(#cardboardSide1)"/>
        <!-- Front Right Face -->
        <polygon points="200,185 310,135 310,200 200,250" fill="url(#cardboardSide2)"/>
        <!-- Top Face -->
        <polygon points="200,70 310,120 200,170 90,120" fill="url(#cardboardTop)"/>
        
        <!-- Flaps & Packaging Tape -->
        <path d="M145,95 L255,145" stroke="#fef08a" stroke-width="14" stroke-opacity="0.75"/>
        <path d="M200,70 L200,170" stroke="#ca8a04" stroke-width="2" stroke-dasharray="4,3"/>
        <line x1="200" y1="185" x2="200" y2="250" stroke="#664614" stroke-width="3"/>
        
        <!-- Fragile Symbol & Barcode on Left Face -->
        <rect x="110" y="160" width="32" height="24" fill="#ffffff" opacity="0.85" rx="2"/>
        <path d="M120,165 L120,178 M124,165 L124,178 M127,165 L127,178 M131,165 L131,178 M135,165 L135,178" stroke="#1e293b" stroke-width="1.8"/>
        <!-- Recycling Symbol on Right Face -->
        <circle cx="255" cy="180" r="16" fill="none" stroke="#451a03" stroke-width="2.5" stroke-dasharray="16,8"/>
        <text x="255" y="184" font-family="sans-serif" font-size="9" font-weight="bold" fill="#451a03" text-anchor="middle">PAP 20</text>
        
        <!-- Fluting Edge details -->
        <path d="M89,122 L91,198" stroke="#78350f" stroke-width="1.5"/>
      </svg>
    `),
  },
  {
    id: 'sample-plastic-bottle',
    title: 'Crushed PET Plastic Bottle',
    category: 'Plastics (Rigid)',
    description: 'Transparent polyethylene terephthalate water bottle with blue HDPE cap',
    accentColor: '#0284C7',
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f0f9ff"/>
            <stop offset="100%" stop-color="#e0f2fe"/>
          </linearGradient>
          <linearGradient id="plasticSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.8"/>
            <stop offset="25%" stop-color="#ffffff" stop-opacity="0.95"/>
            <stop offset="60%" stop-color="#7dd3fc" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.75"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg2)"/>
        <!-- Shadow -->
        <ellipse cx="200" cy="260" rx="90" ry="18" fill="#94a3b8" opacity="0.4"/>
        
        <!-- Bottle Body (Slightly crumpled) -->
        <path d="M175,55 L225,55 L228,80 L245,120 L238,150 L250,190 L242,230 L235,248 L165,248 L158,230 L165,195 L152,155 L160,120 L172,80 Z" 
              fill="url(#plasticSheen)" stroke="#0284c7" stroke-width="2.5"/>
        
        <!-- Creases & Crumple folds -->
        <path d="M165,130 C190,145 215,125 240,140" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.9"/>
        <path d="M158,180 C185,165 210,195 245,175" stroke="#0284c7" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M162,210 C195,225 215,200 240,215" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.8"/>
        
        <!-- Plastic Label -->
        <path d="M156,145 L244,145 L246,180 L155,180 Z" fill="#2563eb" opacity="0.85"/>
        <text x="200" y="165" font-family="sans-serif" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">PURE SPRING</text>
        <text x="200" y="174" font-family="sans-serif" font-size="7" fill="#93c5fd" text-anchor="middle">100% RECYCLABLE PET 1</text>
        
        <!-- Bottle Thread & Cap -->
        <rect x="178" y="42" width="44" height="14" rx="3" fill="#1d4ed8" stroke="#1e40af" stroke-width="2"/>
        <line x1="184" y1="42" x2="184" y2="56" stroke="#60a5fa" stroke-width="1.5"/>
        <line x1="192" y1="42" x2="192" y2="56" stroke="#60a5fa" stroke-width="1.5"/>
        <line x1="200" y1="42" x2="200" y2="56" stroke="#60a5fa" stroke-width="1.5"/>
        <line x1="208" y1="42" x2="208" y2="56" stroke="#60a5fa" stroke-width="1.5"/>
        <line x1="216" y1="42" x2="216" y2="56" stroke="#60a5fa" stroke-width="1.5"/>
        
        <!-- Base Ridge Details -->
        <circle cx="200" cy="246" r="6" fill="#38bdf8" opacity="0.8"/>
      </svg>
    `),
  },
  {
    id: 'sample-metal-can',
    title: 'Dented Aluminum Soda Can',
    category: 'Metals (Non-Ferrous)',
    description: 'Wrought aluminum beverage container with pull-tab and dented sidewall',
    accentColor: '#DC2626',
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
          <linearGradient id="canBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#991b1b"/>
            <stop offset="25%" stop-color="#ef4444"/>
            <stop offset="50%" stop-color="#fca5a5"/>
            <stop offset="75%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#7f1d1d"/>
          </linearGradient>
          <linearGradient id="aluminumRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="40%" stop-color="#f1f5f9"/>
            <stop offset="70%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#64748b"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg3)"/>
        <!-- Shadow -->
        <ellipse cx="200" cy="265" rx="85" ry="18" fill="#64748b" opacity="0.35"/>
        
        <!-- Can Body with Dents -->
        <path d="M150,85 C150,85 152,130 162,150 C172,170 148,190 152,240 C170,250 230,250 248,240 C252,190 238,175 245,145 C250,125 250,85 250,85 Z" 
              fill="url(#canBody)" stroke="#7f1d1d" stroke-width="2"/>
        
        <!-- Metallic reflection band -->
        <path d="M195,85 L197,247 L208,246 L204,85 Z" fill="#ffffff" opacity="0.4"/>
        
        <!-- Can Top Lip Rim -->
        <ellipse cx="200" cy="85" rx="50" ry="14" fill="url(#aluminumRim)" stroke="#475569" stroke-width="2"/>
        <ellipse cx="200" cy="85" rx="42" ry="10" fill="#94a3b8"/>
        
        <!-- Pop Tab & Opening Hole -->
        <ellipse cx="192" cy="85" rx="14" ry="6" fill="#1e293b"/>
        <path d="M190,83 L215,84 L212,88 L188,87 Z" fill="#e2e8f0" stroke="#334155" stroke-width="1.5"/>
        <circle cx="208" cy="85" r="3" fill="#cbd5e1" stroke="#334155"/>
        
        <!-- Graphic on Can -->
        <text x="202" y="145" font-family="sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" transform="rotate(-6 200 150)">COLA</text>
        <text x="200" y="215" font-family="sans-serif" font-size="9" font-weight="bold" fill="#fef08a" text-anchor="middle">ALU RECYCLE 100%</text>
        
        <!-- Bottom chime rim -->
        <path d="M152,240 C170,253 230,253 248,240 L245,250 C230,260 170,260 155,250 Z" fill="url(#aluminumRim)"/>
      </svg>
    `),
  },
  {
    id: 'sample-concrete-debris',
    title: 'Concrete Rubble & Rebar',
    category: 'Construction & Demolition (C&D)',
    description: 'Hydraulic portland cement chunk with exposed deformed steel rebar rod',
    accentColor: '#475569',
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f1f5f9"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
          <linearGradient id="concreteMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="50%" stop-color="#64748b"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
          <linearGradient id="rustRebar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="50%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg4)"/>
        <!-- Shadow -->
        <ellipse cx="210" cy="255" rx="140" ry="24" fill="#334155" opacity="0.45"/>
        
        <!-- Rebar sticking out -->
        <path d="M220,150 L310,75 L316,82 L226,157 Z" fill="url(#rustRebar)" stroke="#451a03" stroke-width="1"/>
        <!-- Rebar ribs / deformations -->
        <line x1="240" y1="135" x2="246" y2="142" stroke="#d97706" stroke-width="2"/>
        <line x1="255" y1="120" x2="261" y2="127" stroke="#d97706" stroke-width="2"/>
        <line x1="270" y1="105" x2="276" y2="112" stroke="#d97706" stroke-width="2"/>
        <line x1="285" y1="90" x2="291" y2="97" stroke="#d97706" stroke-width="2"/>
        
        <!-- Main Concrete Chunk (Irregular angular polygon) -->
        <polygon points="110,180 140,110 230,120 270,160 250,230 180,250 120,240 90,210" 
                 fill="url(#concreteMain)" stroke="#334155" stroke-width="3"/>
        
        <!-- Facet plane highlights -->
        <polygon points="140,110 230,120 210,180 150,170" fill="#cbd5e1" opacity="0.45"/>
        <polygon points="230,120 270,160 250,230 210,180" fill="#334155" opacity="0.4"/>
        
        <!-- Aggregate Speckles & Cracks -->
        <path d="M150,140 L165,160 L185,155 L210,180" stroke="#1e293b" stroke-width="2" fill="none"/>
        <circle cx="160" cy="130" r="4" fill="#e2e8f0"/>
        <circle cx="190" cy="140" r="5" fill="#334155"/>
        <circle cx="175" cy="205" r="6" fill="#1e293b"/>
        <circle cx="230" cy="200" r="4" fill="#cbd5e1"/>
        <circle cx="130" cy="190" r="3.5" fill="#475569"/>
        
        <!-- Secondary small rubble chunks -->
        <polygon points="70,235 90,225 100,245 80,255" fill="#64748b" stroke="#334155" stroke-width="1.5"/>
        <polygon points="275,230 295,225 305,245 285,250" fill="#94a3b8" stroke="#334155" stroke-width="1.5"/>
      </svg>
    `),
  },
  {
    id: 'sample-ewaste',
    title: 'Discarded Circuit Board & Battery',
    category: 'Electronics / E-Waste',
    description: 'FR-4 epoxy printed circuit board with integrated chips and li-ion pouch cell',
    accentColor: '#059669',
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="pcbGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#065f46"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
          <linearGradient id="liPouch" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="50%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#64748b"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg5)"/>
        <!-- Shadow -->
        <ellipse cx="200" cy="245" rx="140" ry="20" fill="#020617" opacity="0.6"/>
        
        <!-- PCB Main Board -->
        <rect x="90" y="80" width="180" height="140" rx="8" fill="url(#pcbGreen)" stroke="#10b981" stroke-width="2"/>
        
        <!-- Copper Traces -->
        <path d="M100,100 H140 V130 H170" stroke="#f59e0b" stroke-width="2" fill="none"/>
        <path d="M100,120 H120 V150 H150" stroke="#f59e0b" stroke-width="1.5" fill="none"/>
        <path d="M180,180 H210 V140 H250" stroke="#f59e0b" stroke-width="2" fill="none"/>
        <path d="M110,190 H150 V170 H180" stroke="#f59e0b" stroke-width="1.5" fill="none"/>
        
        <!-- IC Chips -->
        <rect x="145" y="105" width="45" height="45" rx="2" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <circle cx="152" cy="112" r="2.5" fill="#f8fafc"/>
        <text x="167" y="132" font-family="monospace" font-size="8" fill="#94a3b8" text-anchor="middle">ARM CPU</text>
        
        <rect x="205" y="95" width="40" height="25" rx="2" fill="#1e293b"/>
        <rect x="105" y="145" width="30" height="30" rx="2" fill="#1e293b"/>
        
        <!-- Solder Pads / Gold Finger Connectors -->
        <rect x="90" y="210" width="180" height="10" fill="#eab308"/>
        
        <!-- Adjacent Li-Ion Battery Pack -->
        <rect x="235" y="125" width="85" height="115" rx="5" fill="url(#liPouch)" stroke="#475569" stroke-width="2" transform="rotate(8 277 182)"/>
        <rect x="250" y="145" width="55" height="75" rx="2" fill="#0f172a" opacity="0.85" transform="rotate(8 277 182)"/>
        <text x="278" y="175" font-family="sans-serif" font-size="8" font-weight="bold" fill="#ef4444" text-anchor="middle" transform="rotate(8 277 182)">Li-ion 3.8V</text>
        <text x="278" y="188" font-family="sans-serif" font-size="6.5" fill="#ffffff" text-anchor="middle" transform="rotate(8 277 182)">DO NOT PUNCTURE</text>
      </svg>
    `),
  },
  {
    id: 'sample-glass-bottle',
    title: 'Amber Glass Beer Bottle',
    category: 'Glass',
    description: 'Amber colored soda-lime glass container with paper label and crown cap',
    accentColor: '#B45309',
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fffbeb"/>
            <stop offset="100%" stop-color="#fef3c7"/>
          </linearGradient>
          <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#451a03"/>
            <stop offset="25%" stop-color="#78350f"/>
            <stop offset="50%" stop-color="#d97706"/>
            <stop offset="75%" stop-color="#92400e"/>
            <stop offset="100%" stop-color="#3c1402"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg6)"/>
        <!-- Shadow -->
        <ellipse cx="200" cy="265" rx="75" ry="16" fill="#d97706" opacity="0.35"/>
        
        <!-- Bottle Shape -->
        <path d="M188,45 L212,45 L213,75 C213,95 240,115 240,150 L240,245 C240,252 232,255 200,255 C168,255 160,252 160,245 L160,150 C160,115 187,95 187,75 Z" 
              fill="url(#amberGlass)" stroke="#3c1402" stroke-width="2"/>
        
        <!-- Glass Highlight Refraction -->
        <path d="M172,120 L172,245 C172,248 178,250 182,250 L182,120 Z" fill="#ffffff" opacity="0.35"/>
        
        <!-- Vintage Paper Label -->
        <rect x="165" y="150" width="70" height="60" rx="3" fill="#fef9c3" stroke="#854d0e" stroke-width="1.5"/>
        <circle cx="200" cy="172" r="14" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
        <text x="200" y="176" font-family="serif" font-size="12" font-weight="bold" fill="#713f12" text-anchor="middle">BREW</text>
        <text x="200" y="196" font-family="sans-serif" font-size="7" font-weight="bold" fill="#854d0e" text-anchor="middle">RECYCLE GLASS</text>
        
        <!-- Crown Metal Cap -->
        <path d="M185,40 L215,40 L217,46 L183,46 Z" fill="#e2e8f0" stroke="#475569" stroke-width="1.5"/>
        <line x1="187" y1="46" x2="187" y2="48" stroke="#334155" stroke-width="2"/>
        <line x1="193" y1="46" x2="193" y2="48" stroke="#334155" stroke-width="2"/>
        <line x1="200" y1="46" x2="200" y2="48" stroke="#334155" stroke-width="2"/>
        <line x1="207" y1="46" x2="207" y2="48" stroke="#334155" stroke-width="2"/>
        <line x1="213" y1="46" x2="213" y2="48" stroke="#334155" stroke-width="2"/>
      </svg>
    `),
  },
  {
    id: 'sample-clothing',
    title: 'Worn Denim & Cotton Garment',
    category: 'Textiles & Garments',
    description: '100% twill cotton indigo-dyed jeans with metal copper rivet and fraying cuff',
    accentColor: '#1D4ED8',
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="100%" stop-color="#e2e8f0"/>
          </linearGradient>
          <linearGradient id="denimWash" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="50%" stop-color="#2563eb"/>
            <stop offset="100%" stop-color="#1d4ed8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg7)"/>
        <!-- Shadow -->
        <ellipse cx="200" cy="255" rx="120" ry="22" fill="#64748b" opacity="0.35"/>
        
        <!-- Folded Denim Trouser Shape -->
        <path d="M110,120 C140,110 260,110 290,120 L270,240 C240,245 160,245 130,240 Z" 
              fill="url(#denimWash)" stroke="#1e3a8a" stroke-width="3"/>
        
        <!-- Faded Whiskers / Wear Patches -->
        <ellipse cx="200" cy="180" rx="45" ry="30" fill="#60a5fa" opacity="0.45"/>
        
        <!-- Yellow Topstitch Seams -->
        <path d="M115,125 C145,117 255,117 285,125" stroke="#facc15" stroke-width="2.5" stroke-dasharray="5,3" fill="none"/>
        <path d="M200,120 L200,240" stroke="#facc15" stroke-width="2.5" stroke-dasharray="5,3" fill="none"/>
        
        <!-- Pocket Shape -->
        <path d="M210,140 L260,140 L250,190 L235,205 L220,190 Z" fill="#1e40af" stroke="#facc15" stroke-width="2" stroke-dasharray="4,2"/>
        
        <!-- Copper Rivet -->
        <circle cx="212" cy="142" r="3.5" fill="#d97706" stroke="#78350f" stroke-width="1"/>
        <circle cx="258" cy="142" r="3.5" fill="#d97706" stroke="#78350f" stroke-width="1"/>
        
        <!-- Frayed Fabric Edges -->
        <path d="M130,240 Q140,248 150,240 Q160,248 170,240 Q180,248 190,240 Q200,248 210,240 Q220,248 230,240 Q240,248 250,240 Q260,248 270,240" 
              stroke="#93c5fd" stroke-width="2" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'sample-food-waste',
    title: 'Organic Food Waste & Banana Peel',
    category: 'Organics & Biodegradable',
    description: 'Post-consumer fruit peels, coffee grounds, and organic kitchen trimmings',
    accentColor: '#16A34A',
    image: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="bg8" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f0fdf4"/>
            <stop offset="100%" stop-color="#dcfce7"/>
          </linearGradient>
          <linearGradient id="bananaYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="60%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
          <linearGradient id="coffeeGrounds" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#543310"/>
            <stop offset="100%" stop-color="#3c2208"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg8)"/>
        <!-- Shadow -->
        <ellipse cx="200" cy="245" rx="130" ry="24" fill="#15803d" opacity="0.25"/>
        
        <!-- Dark pile of organic coffee grounds -->
        <ellipse cx="200" cy="210" rx="90" ry="35" fill="url(#coffeeGrounds)"/>
        
        <!-- Banana Peel Strips curling out -->
        <!-- Center Strip -->
        <path d="M200,90 C185,130 185,170 145,215 C135,225 125,210 140,195 C170,165 170,130 180,95 Z" 
              fill="url(#bananaYellow)" stroke="#854d0e" stroke-width="2"/>
        <!-- Right Strip -->
        <path d="M200,90 C220,130 225,160 270,195 C280,205 270,215 255,205 C220,175 210,135 200,95 Z" 
              fill="url(#bananaYellow)" stroke="#854d0e" stroke-width="2"/>
        <!-- Front Strip -->
        <path d="M190,95 C190,140 180,180 205,230 C215,240 225,230 215,215 C198,175 205,140 205,95 Z" 
              fill="#fef08a" stroke="#a16207" stroke-width="2"/>
        
        <!-- Brown stem and ripening sugar spots -->
        <rect x="188" y="80" width="18" height="15" rx="3" fill="#3f2305" stroke="#1c0f02" stroke-width="1.5"/>
        
        <circle cx="165" cy="180" r="3.5" fill="#713f12"/>
        <circle cx="150" cy="205" r="4" fill="#713f12"/>
        <circle cx="230" cy="170" r="3" fill="#713f12"/>
        <circle cx="250" cy="190" r="4.5" fill="#713f12"/>
        <circle cx="200" cy="210" r="3" fill="#713f12"/>
        
        <!-- Apple core piece next to it -->
        <path d="M275,190 C285,180 295,190 290,210 C285,225 275,230 268,220 Z" fill="#84cc16" stroke="#4d7c0f" stroke-width="2"/>
        <ellipse cx="282" cy="205" rx="3" ry="5" fill="#3f2305"/>
      </svg>
    `),
  },
];

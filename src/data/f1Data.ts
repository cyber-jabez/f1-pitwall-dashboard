// Comprehensive Formula 1 & Scuderia Ferrari Dataset
export interface Driver {
  id: string
  number: number
  code: string
  name: string
  team: string
  teamId: string
  nationality: string
  flag: string
  dob: string
  careerPoints: number
  wins: number
  podiums: number
  poles: number
  fastestLaps: number
  championships: number
  seasonPoints: number
  seasonPosition: number
  helmetColor: string
  bio: string
  image: string
}

export interface Team {
  id: string
  name: string
  shortName: string
  fullName: string
  base: string
  principal: string
  chassis: string
  powerUnit: string
  color: string
  championships: number
  wins: number
  podiums: number
  poles: number
  seasonPoints: number
  seasonPosition: number
  drivers: [string, string]
  logoText: string
  description: string
}

export interface GrandPrix {
  id: string
  round: number
  name: string
  country: string
  city: string
  circuitName: string
  date: string
  status: 'completed' | 'next' | 'upcoming'
  hasSprint: boolean
  circuitLengthKm: number
  laps: number
  raceDistanceKm: number
  turns: number
  drsZones: number
  lapRecord: { time: string; driver: string; year: number }
  schedule: {
    fp1: string
    fp2?: string
    fp3?: string
    sprintQuali?: string
    sprint?: string
    qualifying: string
    race: string
  }
  winner?: { driver: string; team: string; time: string }
  heroImage: string
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  category: 'Breaking' | 'Ferrari' | 'Driver Transfers' | 'Technical' | 'FIA' | 'Paddock Rumours' | 'Race Report' | 'F1 Academy'
  author: string
  date: string
  readingTime: string
  image: string
  source: string
  isFeatured?: boolean
  tags: string[]
}

export interface HistoricFerrariCar {
  name: string
  season: string
  driverLineup: string
  engine: string
  powerOutput: string
  weight: string
  championshipsWon: string
  historicalSignificance: string
  image: string
}

export interface TechnicalArticle {
  id: string
  title: string
  category: 'Aerodynamics' | 'Power Unit' | 'Ground Effect' | '2026 Regulations' | 'Tyres & Strategy'
  readTime: string
  summary: string
  content: string
  diagramType: 'windTunnel' | 'engine' | 'venturi' | 'aero2026'
}

export interface GlossaryItem {
  term: string
  category: 'Aerodynamics' | 'Race Control' | 'Strategy' | 'Chassis & Engine' | 'Sporting'
  definition: string
}

// 2025/2026 Formula 1 Driver Grid
export const DRIVERS: Driver[] = [
  {
    id: 'charles-leclerc',
    number: 16,
    code: 'LEC',
    name: 'Charles Leclerc',
    team: 'Scuderia Ferrari HP',
    teamId: 'ferrari',
    nationality: 'Monégasque',
    flag: '🇲🇨',
    dob: '1997-10-16',
    careerPoints: 1424,
    wins: 8,
    podiums: 42,
    poles: 26,
    fastestLaps: 10,
    championships: 0,
    seasonPoints: 86,
    seasonPosition: 2,
    helmetColor: '#FF2800',
    bio: 'Known as "Il Predestinato" by the global Tifosi community, Charles Leclerc is Scuderia Ferrari\'s qualifying maestro and heroic 2019 & 2024 Monza Grand Prix winner.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lewis-hamilton',
    number: 44,
    code: 'HAM',
    name: 'Lewis Hamilton',
    team: 'Scuderia Ferrari HP',
    teamId: 'ferrari',
    nationality: 'British',
    flag: '🇬🇧',
    dob: '1985-01-07',
    careerPoints: 4849.5,
    wins: 105,
    podiums: 201,
    poles: 104,
    fastestLaps: 67,
    championships: 7,
    seasonPoints: 78,
    seasonPosition: 3,
    helmetColor: '#FED500',
    bio: 'Seven-time World Champion Sir Lewis Hamilton embarked on the defining chapter of modern motorsport by donning the scarlet overalls of Scuderia Ferrari.',
    image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'max-verstappen',
    number: 1,
    code: 'VER',
    name: 'Max Verstappen',
    team: 'Oracle Red Bull Racing',
    teamId: 'red-bull',
    nationality: 'Dutch',
    flag: '🇳🇱',
    dob: '1997-09-30',
    careerPoints: 3014.5,
    wins: 63,
    podiums: 111,
    poles: 40,
    fastestLaps: 33,
    championships: 4,
    seasonPoints: 94,
    seasonPosition: 1,
    helmetColor: '#1E40AF',
    bio: 'Four-time World Drivers Champion known for relentless race pace and aggressive wheel-to-wheel racecraft.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'lando-norris',
    number: 4,
    code: 'NOR',
    name: 'Lando Norris',
    team: 'McLaren Formula 1 Team',
    teamId: 'mclaren',
    nationality: 'British',
    flag: '🇬🇧',
    dob: '1999-11-13',
    careerPoints: 978,
    wins: 4,
    podiums: 27,
    poles: 8,
    fastestLaps: 12,
    championships: 0,
    seasonPoints: 72,
    seasonPosition: 4,
    helmetColor: '#FF8000',
    bio: 'McLaren spearhead leading the Papaya resurgence with razor-sharp qualifying precision.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'oscar-piastri',
    number: 81,
    code: 'PIA',
    name: 'Oscar Piastri',
    team: 'McLaren Formula 1 Team',
    teamId: 'mclaren',
    nationality: 'Australian',
    flag: '🇦🇺',
    dob: '2001-04-06',
    careerPoints: 382,
    wins: 2,
    podiums: 10,
    poles: 1,
    fastestLaps: 3,
    championships: 0,
    seasonPoints: 58,
    seasonPosition: 5,
    helmetColor: '#00D2BE',
    bio: 'Ice-cool Australian talent and Grand Prix winner with remarkable tyre management calmness under immense pressure.',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'george-russell',
    number: 63,
    code: 'RUS',
    name: 'George Russell',
    team: 'Mercedes-AMG PETRONAS F1 Team',
    teamId: 'mercedes',
    nationality: 'British',
    flag: '🇬🇧',
    dob: '1998-02-15',
    careerPoints: 689,
    wins: 3,
    podiums: 15,
    poles: 4,
    fastestLaps: 7,
    championships: 0,
    seasonPoints: 50,
    seasonPosition: 6,
    helmetColor: '#00A19B',
    bio: 'Mercedes team leader known as "Mr. Saturday" for his relentless qualifying execution.',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'carlos-sainz',
    number: 55,
    code: 'SAI',
    name: 'Carlos Sainz',
    team: 'Williams Racing',
    teamId: 'williams',
    nationality: 'Spanish',
    flag: '🇪🇸',
    dob: '1994-09-01',
    careerPoints: 1226.5,
    wins: 4,
    podiums: 25,
    poles: 6,
    fastestLaps: 4,
    championships: 0,
    seasonPoints: 24,
    seasonPosition: 7,
    helmetColor: '#005AFF',
    bio: 'The "Smooth Operator" with supreme tactical intellect, bringing Grand Prix-winning leadership to Williams Racing.',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'fernando-alonso',
    number: 14,
    code: 'ALO',
    name: 'Fernando Alonso',
    team: 'Aston Martin Aramco F1 Team',
    teamId: 'aston-martin',
    nationality: 'Spanish',
    flag: '🇪🇸',
    dob: '1981-07-29',
    careerPoints: 2335,
    wins: 32,
    podiums: 106,
    poles: 22,
    fastestLaps: 26,
    championships: 2,
    seasonPoints: 18,
    seasonPosition: 8,
    helmetColor: '#006F62',
    bio: 'Two-time World Champion and former Ferrari talisman whose race reading and relentless combat remain unparalleled.',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
  },
]

// 10 Formula 1 Teams
export const TEAMS: Team[] = [
  {
    id: 'ferrari',
    name: 'Scuderia Ferrari HP',
    shortName: 'Ferrari',
    fullName: 'Scuderia Ferrari HP S.p.A.',
    base: 'Maranello, Emilia-Romagna, Italy',
    principal: 'Frédéric Vasseur',
    chassis: 'SF-25 / SF-24',
    powerUnit: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
    color: '#FF2800',
    championships: 16,
    wins: 248,
    podiums: 805,
    poles: 253,
    seasonPoints: 164,
    seasonPosition: 2,
    drivers: ['charles-leclerc', 'lewis-hamilton'],
    logoText: '🐎 SCUDERIA FERRARI',
    description: 'The sole constructor to participate in every World Championship since 1950. The spiritual heart of Formula 1 with unmatched heritage and passion.',
  },
  {
    id: 'mclaren',
    name: 'McLaren Formula 1 Team',
    shortName: 'McLaren',
    fullName: 'McLaren Racing Limited',
    base: 'Woking, United Kingdom',
    principal: 'Andrea Stella',
    chassis: 'MCL39',
    powerUnit: 'Mercedes-AMG M16 1.6L V6 Turbo',
    color: '#FF8000',
    championships: 9,
    wins: 188,
    podiums: 522,
    poles: 164,
    seasonPoints: 130,
    seasonPosition: 3,
    drivers: ['lando-norris', 'oscar-piastri'],
    logoText: 'PAPAYA RACING',
    description: 'Eight-time Constructors champions renowned for pioneering carbon composite monocoques and high aerodynamic efficiency.',
  },
  {
    id: 'red-bull',
    name: 'Oracle Red Bull Racing',
    shortName: 'Red Bull',
    fullName: 'Red Bull Racing Limited',
    base: 'Milton Keynes, United Kingdom',
    principal: 'Christian Horner',
    chassis: 'RB21',
    powerUnit: 'Honda RBPT 1.6L V6 Turbo',
    color: '#1E40AF',
    championships: 6,
    wins: 121,
    podiums: 280,
    poles: 103,
    seasonPoints: 172,
    seasonPosition: 1,
    drivers: ['max-verstappen', 'liam-lawson'],
    logoText: 'RED BULL RACING',
    description: 'Modern championship powerhouse defined by Adrian Newey ground-effect architecture and supreme operational speed.',
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG PETRONAS F1 Team',
    shortName: 'Mercedes',
    fullName: 'Mercedes-Benz Grand Prix Ltd',
    base: 'Brackley, United Kingdom',
    principal: 'Toto Wolff',
    chassis: 'F1 W16 E Performance',
    powerUnit: 'Mercedes-AMG 1.6L V6 Turbo Hybrid',
    color: '#00A19B',
    championships: 8,
    wins: 128,
    podiums: 295,
    poles: 139,
    seasonPoints: 78,
    seasonPosition: 4,
    drivers: ['george-russell', 'kimi-antonelli'],
    logoText: 'MERCEDES-AMG',
    description: 'Dominant eight-consecutive Constructors Champion (2014-2021) with class-leading hybrid thermodynamic efficiency.',
  },
  {
    id: 'aston-martin',
    name: 'Aston Martin Aramco F1 Team',
    shortName: 'Aston Martin',
    fullName: 'Aston Martin Aramco Formula One Team',
    base: 'Silverstone, United Kingdom',
    principal: 'Mike Krack',
    chassis: 'AMR25',
    powerUnit: 'Mercedes-AMG M16',
    color: '#006F62',
    championships: 0,
    wins: 1,
    podiums: 9,
    poles: 1,
    seasonPoints: 34,
    seasonPosition: 5,
    drivers: ['fernando-alonso', 'lance-stroll'],
    logoText: 'ASTON MARTIN',
    description: 'British luxury marquee operating from a state-of-the-art campus featuring an in-house wind tunnel and technical partnerships.',
  },
  {
    id: 'williams',
    name: 'Williams Racing',
    shortName: 'Williams',
    fullName: 'Williams Grand Prix Engineering Ltd',
    base: 'Grove, Oxfordshire, United Kingdom',
    principal: 'James Vowles',
    chassis: 'FW47',
    powerUnit: 'Mercedes-AMG 1.6L V6',
    color: '#005AFF',
    championships: 9,
    wins: 114,
    podiums: 313,
    poles: 128,
    seasonPoints: 28,
    seasonPosition: 6,
    drivers: ['carlos-sainz', 'alex-albon'],
    logoText: 'WILLIAMS RACING',
    description: 'Historic British independent constructor with 9 Constructors titles, undergoing resurgence under James Vowles and Carlos Sainz.',
  },
]

// 24 Formula 1 Grands Prix (2025/2026 Calendar)
export const GRAND_PRIX_CALENDAR: GrandPrix[] = [
  {
    id: 'monza',
    round: 16,
    name: 'Formula 1 Pirelli Gran Premio d\'Italia',
    country: 'Italy',
    city: 'Monza',
    circuitName: 'Autodromo Nazionale Monza',
    date: '2025-09-07',
    status: 'next',
    hasSprint: false,
    circuitLengthKm: 5.793,
    laps: 53,
    raceDistanceKm: 306.72,
    turns: 11,
    drsZones: 2,
    lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello (Ferrari)', year: 2004 },
    schedule: {
      fp1: 'Friday 13:30 CET',
      fp2: 'Friday 17:00 CET',
      fp3: 'Saturday 12:30 CET',
      qualifying: 'Saturday 16:00 CET',
      race: 'Sunday 15:00 CET',
    },
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'monaco',
    round: 8,
    name: 'Grand Prix de Monaco',
    country: 'Monaco',
    city: 'Monte Carlo',
    circuitName: 'Circuit de Monaco',
    date: '2025-05-25',
    status: 'upcoming',
    hasSprint: false,
    circuitLengthKm: 3.337,
    laps: 78,
    raceDistanceKm: 260.286,
    turns: 19,
    drsZones: 1,
    lapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021 },
    schedule: {
      fp1: 'Friday 13:30 CET',
      fp2: 'Friday 17:00 CET',
      fp3: 'Saturday 12:30 CET',
      qualifying: 'Saturday 16:00 CET',
      race: 'Sunday 15:00 CET',
    },
    heroImage: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'silverstone',
    round: 12,
    name: 'British Grand Prix',
    country: 'United Kingdom',
    city: 'Silverstone',
    circuitName: 'Silverstone Circuit',
    date: '2025-07-06',
    status: 'upcoming',
    hasSprint: true,
    circuitLengthKm: 5.891,
    laps: 52,
    raceDistanceKm: 306.198,
    turns: 18,
    drsZones: 2,
    lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 },
    schedule: {
      fp1: 'Friday 12:30 GMT',
      sprintQuali: 'Friday 16:30 GMT',
      sprint: 'Saturday 12:00 GMT',
      qualifying: 'Saturday 16:00 GMT',
      race: 'Sunday 15:00 GMT',
    },
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'spa',
    round: 14,
    name: 'Belgian Grand Prix',
    country: 'Belgium',
    city: 'Stavelot',
    circuitName: 'Circuit de Spa-Francorchamps',
    date: '2025-07-27',
    status: 'upcoming',
    hasSprint: true,
    circuitLengthKm: 7.004,
    laps: 44,
    raceDistanceKm: 308.052,
    turns: 19,
    drsZones: 2,
    lapRecord: { time: '1:46.286', driver: 'Valtteri Bottas', year: 2018 },
    schedule: {
      fp1: 'Friday 13:30 CET',
      sprintQuali: 'Friday 17:30 CET',
      sprint: 'Saturday 12:00 CET',
      qualifying: 'Saturday 16:00 CET',
      race: 'Sunday 15:00 CET',
    },
    heroImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
  },
]

// Breaking News & Technical Articles
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'ferrari-monza-upgrade-package',
    title: 'Maranello Unveils High-Speed Monza Aero Package: 350+ km/h Low-Drag Wing & Venturi Floor Refinements',
    summary: 'Scuderia Ferrari introduces a specialized low-drag rear wing and redesigned floor throat aimed at straightline dominance at the Temple of Speed.',
    content: 'Maranello engineers have completed wind tunnel calibration at the private Fiorano facility, deploying a radical spoon rear beam wing specifically profiled for Monza\'s 350 km/h straightline demands. Telemetry simulations show a 0.28s delta gain through Curva Grande and the Ascari chicane.',
    category: 'Ferrari',
    author: 'Enrico Cardile / Technical Desk',
    date: '2025-08-30',
    readingTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    source: 'Scuderia Ferrari Corse Clienti Press Office',
    isFeatured: true,
    tags: ['Ferrari', 'Aerodynamics', 'Monza', 'SF-25'],
  },
  {
    id: 'fia-2026-active-aero-regulations',
    title: 'FIA Confirms 2026 Technical Regulations: Active Aerodynamics "X-Mode" & 350kW MGU-K Power Split',
    summary: 'The FIA World Motor Sport Council ratifies the 2026 technical framework featuring active front and rear wings and a 50/50 electrical combustion power balance.',
    content: 'The 2026 regulations will eliminate the MGU-H while tripling the electrical output of the MGU-K to 350kW (almost 475 horsepower). Cars will feature Z-Mode for high-downforce cornering and X-Mode for low-drag straights.',
    category: 'Technical',
    author: 'FIA Technical Department',
    date: '2025-08-28',
    readingTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    source: 'Fédération Internationale de l\'Automobile',
    isFeatured: true,
    tags: ['2026 Rules', 'Active Aero', 'MGU-K', 'Hybrid'],
  },
  {
    id: 'hamilton-ferrari-monza-preparations',
    title: 'Hamilton on Maranello Integration: "Walking into Enzo\'s Office is a Spiritual Awakening"',
    summary: 'Lewis Hamilton shares his first months operating inside Maranello, working with Charles Leclerc and preparing for his first Italian Grand Prix as a Ferrari driver.',
    content: '"When you see the mechanics, the engine builders, the fans camped outside Fiorano—you understand why Ferrari is a religion," stated Hamilton during private test runs on Fiorano tarmac.',
    category: 'Driver Transfers',
    author: 'Motorsport Editorial',
    date: '2025-08-25',
    readingTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=800&q=80',
    source: 'La Gazzetta dello Sport / Verified Interview',
    tags: ['Hamilton', 'Leclerc', 'Ferrari', 'F1 2025'],
  },
  {
    id: 'f1-academy-maya-weug-ferrari',
    title: 'Ferrari Driver Academy\'s Maya Weug Secures Pole Position in F1 Academy Zandvoort Showdown',
    summary: 'Maya Weug puts the Scuderia Ferrari FDA livery on the front row in high-intensity coastal wind conditions.',
    content: 'Maya Weug delivered a masterclass in car control through Zandvoort\'s banked curves, putting the FDA car three-tenths clear of the field.',
    category: 'F1 Academy',
    author: 'FDA Newsroom',
    date: '2025-08-24',
    readingTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    source: 'Ferrari Driver Academy',
    tags: ['F1 Academy', 'FDA', 'Maya Weug'],
  },
]

// Historic Ferrari Cars Archive
export const HISTORIC_FERRARI_CARS: HistoricFerrariCar[] = [
  {
    name: 'Ferrari F2004',
    season: '2004',
    driverLineup: 'Michael Schumacher / Rubens Barrichello',
    engine: 'Tipo 053 3.0L Naturally Aspirated V10 (950 bhp @ 19,000 RPM)',
    powerOutput: '950 bhp @ 19,000 RPM',
    weight: '605 kg (with water & driver)',
    championshipsWon: 'Constructors\' & Drivers\' World Championship (15 Wins in 18 Races)',
    historicalSignificance: 'Regarded as the pinnacle of Formula 1 screaming V10 naturally aspirated perfection, setting lap records that stood for over 15 years.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ferrari 312T',
    season: '1975',
    driverLineup: 'Niki Lauda / Clay Regazzoni',
    engine: 'Tipo 015 3.0L Flat-12 Boxer (500 bhp @ 12,200 RPM)',
    powerOutput: '500 bhp',
    weight: '575 kg',
    championshipsWon: 'Constructors\' & Drivers\' Championship (Niki Lauda)',
    historicalSignificance: 'Mauro Forghieri\'s transverse gearbox masterpiece that restored Ferrari to World Championship glory after an 11-year drought.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ferrari 499P Hypercar',
    season: '2023 - 2024',
    driverLineup: 'Antonio Fuoco, Miguel Molina, Nicklas Nielsen',
    engine: '3.0L Twin-Turbo 120° V6 Hybrid (680 PS + 272 PS Electric Front Axle)',
    powerOutput: '680 PS ICE + 200 kW MGU',
    weight: '1,030 kg',
    championshipsWon: '24 Hours of Le Mans Centenary Winner (2023) & Back-to-Back (2024)',
    historicalSignificance: 'Ferrari\'s historic return to top-flight endurance prototype racing after 50 years, conquering Le Mans back-to-back in 2023 and 2024.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ferrari F40 LM',
    season: '1989',
    driverLineup: 'Jean Alesi / Hurley Haywood',
    engine: 'Tipo F120B 2.9L Twin-Turbo V8 (720 bhp)',
    powerOutput: '720 bhp @ 7,500 RPM',
    weight: '1,050 kg',
    championshipsWon: 'IMSA GTO & GT Legends',
    historicalSignificance: 'The ultimate evolution of the last car personally approved by Enzo Ferrari before his death in 1988.',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
  },
]

// Technical Articles
export const TECHNICAL_ARTICLES: TechnicalArticle[] = [
  {
    id: 'ground-effect-venturi-physics',
    title: 'The Fluid Mechanics of Ground Effect: How Venturi Tunnels Produce 1,800 kg of Downforce',
    category: 'Ground Effect',
    readTime: '7 min read',
    summary: 'An engineering breakdown of Bernoulli\'s equation, floor expansion ratios, and vortex edge sealing in current Formula 1 regulations.',
    content: 'By constricting the cross-sectional area under the sidepods, air velocity accelerates according to Bernoulli\'s principle, creating massive localized negative pressure (suction) directly beneath the centre of gravity without the induced aerodynamic drag of massive wings.',
    diagramType: 'venturi',
  },
  {
    id: 'ferrari-power-unit-066-12',
    title: 'Inside Ferrari Power Unit 066/12: Turbulent Jet Ignition and 50% Thermal Efficiency',
    category: 'Power Unit',
    readTime: '9 min read',
    summary: 'Deep dive into Ferrari\'s 1.6L V6 hybrid architecture, pre-chamber combustion nozzles, and 120kW MGU-K energy harvesting.',
    content: 'Maranello\'s pre-chamber Turbulent Jet Ignition (TJI) allows ultra-lean fuel mixtures to combust at unprecedented flame speeds, achieving over 50% brake thermal efficiency while revving cleanly to the 15,000 RPM fuel-flow limit.',
    diagramType: 'engine',
  },
  {
    id: 'fia-2026-regulations-active-aero',
    title: 'The 2026 Regulation Overhaul: Active Aerodynamics (X-Mode & Z-Mode) Explained',
    category: '2026 Regulations',
    readTime: '8 min read',
    summary: 'How active front flaps and movable rear wings replace DRS while the electrical powertrain triples to 350kW.',
    content: 'In 2026, cars will feature automated state switching: Z-Mode deploys high downforce through corners, while X-Mode actively flattens both front and rear elements along straights to reduce aerodynamic drag by over 40%.',
    diagramType: 'aero2026',
  },
]

// F1 Glossary & Terminology
export const F1_GLOSSARY: GlossaryItem[] = [
  {
    term: 'Parc Fermé',
    category: 'Sporting',
    definition: 'Literally "closed park" in French. A secure enclosure where cars are held under strict FIA supervision from the start of qualifying until after the race, during which no technical modifications are permitted except basic routine checks.',
  },
  {
    term: 'Undercut',
    category: 'Strategy',
    definition: 'A strategic pit-stop timing maneuver where a chasing driver pits one or two laps earlier than the car ahead to exploit fresh tyre grip and set blistering out-lap times, taking the position when the leader subsequently pits.',
  },
  {
    term: 'Venturi Effect',
    category: 'Aerodynamics',
    definition: 'The reduction in fluid pressure that results when a fluid flows through a constricted section (or choke) of a pipe or aerodynamic underfloor tunnel, creating massive suction downforce.',
  },
  {
    term: 'DRS (Drag Reduction System)',
    category: 'Aerodynamics',
    definition: 'A driver-activated movable flap on the rear wing that opens a 85mm gap to shed drag and boost straightline speed by 15-20 km/h when within 1 second of the car ahead in designated detection zones.',
  },
  {
    term: 'MGU-K (Motor Generator Unit - Kinetic)',
    category: 'Chassis & Engine',
    definition: 'An electric motor-generator connected to the crankshaft that converts kinetic braking energy into electricity stored in the Energy Store, and deploys up to 120kW (160 bhp) of propulsion during acceleration.',
  },
  {
    term: 'Graining',
    category: 'Strategy',
    definition: 'Occurs when tyres slide across the asphalt and small rubber granules tear from the surface before adhering back onto the tyre face, dramatically reducing mechanical grip until the rubber rolls smooth again.',
  },
]

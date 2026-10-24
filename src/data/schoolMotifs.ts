// Bespoke "showpiece" config for every school except Princeton, Harvard,
// and UC Berkeley, which have their own hand-built components
// (PrincetonEasterEggs.tsx, HarvardEasterEggs.tsx, BerkeleyEasterEggs.tsx).
// SchoolMotif.tsx reads this table to drive one shared easter-egg engine:
// a keyboard-triggered reveal, a themed confetti burst, a console nod, and
// (where the school has a real one) a motto line under the Why School
// bullets. All facts below are researched, not invented -- see the
// task notes for sourcing. Schools with no verified mascot or motto use
// the closest genuine cultural/technical touchstone instead (noted inline).
//
// Confetti colors are pulled straight from each school's --accent-rgb /
// --accent-secondary-rgb theme values in globals.css, plus --paper, so
// the burst always matches the active theme.
export type SchoolMotif = {
  motto?: string
  mottoTranslation?: string
  triggerWord: string
  revealLines: string[]
  confettiColors: string[]
  consoleLine: string
}

export const SCHOOL_MOTIFS: Record<string, SchoolMotif> = {
  'virginia-tech': {
    motto: 'Ut Prosim',
    mottoTranslation: 'That I May Serve',
    triggerWord: 'hokies',
    revealLines: ["Let's go.", 'Hokies!'],
    confettiColors: ['#861F41', '#E5751F', '#F5F2EC'],
    consoleLine: 'Ut Prosim. Go Hokies.',
  },
  uiuc: {
    motto: 'Learning and Labor',
    triggerWord: 'illini',
    revealLines: ['I! L! L!', 'I! N! I!', 'Illini forever.'],
    confettiColors: ['#13294B', '#FF5F05', '#F5F2EC'],
    consoleLine: 'Learning and Labor. Illini forever.',
  },
  purdue: {
    triggerWord: 'boilermakers',
    revealLines: ['Boiler up.', 'Hammer down.'],
    confettiColors: ['#CEB888', '#C28E0E', '#0B0B0B'],
    consoleLine: 'Boiler Up. Hammer Down.',
  },
  'georgia-tech': {
    motto: 'Progress and Service',
    triggerWord: 'jackets',
    revealLines: ["I'm a Ramblin' Wreck from Georgia Tech", 'and a hell of an engineer.', 'Go Jackets!'],
    confettiColors: ['#B3A369', '#003057', '#F5F2EC'],
    consoleLine: 'Progress and Service. Go Jackets.',
  },
  mit: {
    motto: 'Mens et Manus',
    mottoTranslation: 'Mind and Hand',
    triggerWord: 'beavers',
    revealLines: ["Tim the Beaver: nature's engineer.", 'Mind and hand.', 'Mens et Manus.'],
    confettiColors: ['#750014', '#8A8B8C', '#F5F2EC'],
    consoleLine: 'Mens et Manus.',
  },

  // Batch 2: the four UC schools (UC Berkeley keeps its own bespoke
  // file, so it's not here). None have a campus-specific motto beyond
  // the UC system-wide "Fiat Lux," already used for Berkeley, so these
  // lean on each campus's real mascot and student chant instead.
  'uc-davis': {
    triggerWord: 'aggies',
    revealLines: ['Gunrock gallops in.', 'Victory bell ringing.', 'Go Ags.'],
    confettiColors: ['#022851', '#FFBF00', '#F5F2EC'],
    consoleLine: 'Go Ags.',
  },
  'uc-irvine': {
    triggerWord: 'zot',
    revealLines: ['Zot zot zot.', 'Zot zot zot!', 'Go Anteaters.'],
    confettiColors: ['#0064A4', '#FFD200', '#F5F2EC'],
    consoleLine: 'Zot zot zot.',
  },
  'uc-san-diego': {
    triggerWord: 'tritons',
    revealLines: ['First university to space.', "That's the Triton Rocket Club's actual goal.", 'Go Tritons.'],
    confettiColors: ['#182B49', '#FFCD00', '#F5F2EC'],
    consoleLine: 'Go Tritons.',
  },
  ucla: {
    triggerWord: 'bruins',
    revealLines: ['U! C! L! A!', 'Eight claps.', 'Go Bruins.'],
    confettiColors: ['#2774AE', '#FFD100', '#F5F2EC'],
    consoleLine: 'Go Bruins.',
  },

  // Batch 3: Bath, Bristol, Manchester. None have a US-style mascot,
  // so the trigger word leans on each school's real, researched
  // cultural touchstone instead (Bath's Roman name, Bristol's Brunel,
  // Manchester's worker bee) rather than inventing a nickname.
  bath: {
    motto: 'Generatim discite cultus',
    mottoTranslation: 'Learn the culture proper to each after its kind',
    triggerWord: 'aquae',
    revealLines: ['Aquae Sulis.', 'The Romans built it to last.', "So are we."],
    confettiColors: ['#00539F', '#59B0E4', '#F5F2EC'],
    consoleLine: 'Generatim discite cultus.',
  },
  bristol: {
    motto: 'Vim promovet insitam',
    mottoTranslation: "Learning promotes one's innate power",
    triggerWord: 'brunel',
    revealLines: ["Isambard Kingdom Brunel built this city's bones.", 'Bridges, ships, engines.', 'Bristol keeps building.'],
    confettiColors: ['#A6192E', '#D24258', '#F5F2EC'],
    consoleLine: 'Vim promovet insitam.',
  },
  manchester: {
    motto: 'Cognitio, sapientia, humanitas',
    mottoTranslation: 'Knowledge, wisdom, humanity',
    triggerWord: 'bees',
    revealLines: ['The worker bee never stops.', 'Three bees on the coat of arms.', 'Still buzzing.'],
    confettiColors: ['#660099', '#FFCC33', '#F5F2EC'],
    consoleLine: 'Cognitio, sapientia, humanitas.',
  },

  // Batch 4: Melbourne, Michigan, Sheffield, Southampton.
  melbourne: {
    motto: 'Postera Crescam Laude',
    mottoTranslation: 'I shall grow in the esteem of future generations',
    triggerWord: 'ares',
    revealLines: ['ARES, a hundred members strong.', 'Sounding rockets, student built.', 'Postera crescam laude.'],
    confettiColors: ['#000F46', '#3A6DC4', '#F5F2EC'],
    consoleLine: 'Postera crescam laude.',
  },
  michigan: {
    motto: 'Artes, Scientia, Veritas',
    mottoTranslation: 'Arts, Knowledge, Truth',
    triggerWord: 'wolverines',
    revealLines: ['Go Blue banner, since 1962.', 'Every player touches it.', 'Go Blue.'],
    confettiColors: ['#00274C', '#FFCB05', '#F5F2EC'],
    consoleLine: 'Artes, Scientia, Veritas. Go Blue.',
  },
  sheffield: {
    motto: 'Rerum cognoscere causas',
    mottoTranslation: 'To discover the causes of things',
    triggerWord: 'sunride',
    revealLines: ['Sunfire II, 3.4 kilonewtons.', 'UK altitude record: 36,274 feet.', 'Project Sunride flies again.'],
    confettiColors: ['#1E2B5E', '#FFD200', '#F5F2EC'],
    consoleLine: 'Rerum cognoscere causas.',
  },
  southampton: {
    motto: 'Strenuis ardua cedunt',
    mottoTranslation: 'The heights yield to endeavour',
    triggerWord: 'solent',
    revealLines: ['The Solent runs past the test tanks.', 'F1 teams test here too.', 'Southampton builds fast.'],
    confettiColors: ['#005C84', '#4FB0C6', '#F5F2EC'],
    consoleLine: 'Strenuis ardua cedunt.',
  },
}

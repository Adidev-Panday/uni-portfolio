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
}

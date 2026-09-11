// Shared school list used by AdmissionsModal and WhySchool.
// Keep in alphabetical order by name.
export const SCHOOLS = [
  { id: 'bocconi',      name: 'Bocconi',                                   shortName: 'Bocconi'      },
  { id: 'georgia-tech', name: 'Georgia Tech',                               shortName: 'Georgia Tech' },
  { id: 'harvard',      name: 'Harvard',                                   shortName: 'Harvard'      },
  { id: 'hku-berkeley', name: 'HKU-Berkeley (Dual Degree)',                 shortName: 'HKU-Berkeley' },
  { id: 'nus',          name: 'National University of Singapore (NUS)',     shortName: 'NUS'          },
  { id: 'princeton',    name: 'Princeton',                                  shortName: 'Princeton'    },
  { id: 'purdue',       name: 'Purdue',                                     shortName: 'Purdue'       },
  { id: 'tu-delft',     name: 'TU Delft',                                  shortName: 'TU Delft'     },
  { id: 'tum',          name: 'TUM',                                       shortName: 'TUM'          },
  { id: 'uc-berkeley',  name: 'UC Berkeley',                               shortName: 'UC Berkeley'  },
  { id: 'uc-davis',     name: 'UC Davis',                                  shortName: 'UC Davis'     },
  { id: 'uc-irvine',    name: 'UC Irvine',                                 shortName: 'UC Irvine'    },
  { id: 'uc-san-diego', name: 'UC San Diego',                              shortName: 'UC San Diego' },
  { id: 'ucla',         name: 'UCLA',                                      shortName: 'UCLA'         },
  { id: 'bath',         name: 'University of Bath',                        shortName: 'Bath'         },
  { id: 'bristol',      name: 'University of Bristol',                     shortName: 'Bristol'      },
  { id: 'uiuc',         name: 'University of Illinois (UIUC)',             shortName: 'UIUC'         },
  { id: 'manchester',   name: 'University of Manchester',                  shortName: 'Manchester'   },
  { id: 'melbourne',    name: 'University of Melbourne',                   shortName: 'Melbourne'    },
  { id: 'michigan',     name: 'University of Michigan (Ann Arbor)',        shortName: 'Michigan'     },
  { id: 'sheffield',    name: 'University of Sheffield',                   shortName: 'Sheffield'    },
  { id: 'southampton',  name: 'University of Southampton',                 shortName: 'Southampton'  },
] as const

export type SchoolId = (typeof SCHOOLS)[number]['id']
export type School = (typeof SCHOOLS)[number]

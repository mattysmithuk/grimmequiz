// Edit this file to change the quiz. `correct` is the index of the right option.
// The correct index is never sent to the browser; scoring happens on the server.

export type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number;
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'GRIMME began life as a forge in Damme, Germany. In which year was it founded?',
    options: ['1861', '1901', '1927', '1948'],
    correct: 0,
  },
  {
    id: 2,
    text: 'What is the bunker capacity of the GRIMME EVO 280 trailed potato harvester?',
    options: ['4 tonnes', '6 tonnes', '8 tonnes', '12 tonnes'],
    correct: 2,
  },
  {
    id: 3,
    text: 'Which GRIMME machine is the 4-row self-propelled potato harvester?',
    options: ['REXOR', 'VENTOR', 'ROOTSTER', 'MATRIX'],
    correct: 1,
  },
  {
    id: 4,
    text: 'The self-propelled VARITRON range is available in which configurations?',
    options: ['1-row only', '2- and 4-row', '3- and 6-row', '8-row only'],
    correct: 1,
  },
  {
    id: 5,
    text: 'On a GRIMME harvester, what is the main job of the sieving web?',
    options: [
      'Topping the haulm before lifting',
      'Separating soil from the crop',
      'Loading the trailer alongside',
      'Steering the digging shares',
    ],
    correct: 1,
  },
  {
    id: 6,
    text: 'Which free digital portal gives GRIMME customers live machine data, job records and services?',
    options: ['GRIMME Connect', 'myGRIMME', 'FieldLink', 'AgriCloud'],
    correct: 1,
  },
  {
    id: 7,
    text: 'What is the name of the GRIMME camera system for monitoring crop flow on the machine?',
    options: ['CropCam', 'ClearView', 'SmartView', 'VisionPro'],
    correct: 2,
  },
  {
    id: 8,
    text: 'Roughly how many machine types are in the GRIMME product range?',
    options: ['Around 30', 'Around 70', 'Over 150', 'Over 400'],
    correct: 2,
  },
  {
    id: 9,
    text: 'Which subsidiary builds GRIMME group vegetable harvesting machinery for crops like carrots and onions?',
    options: ['ASA-LIFT', 'SPUDNIK', 'INTERNORM', 'AVR'],
    correct: 0,
  },
  {
    id: 10,
    text: 'Where is GRIMME UK headquartered?',
    options: [
      'York, North Yorkshire',
      'Swineshead, near Boston, Lincolnshire',
      'Norwich, Norfolk',
      'Perth, Scotland',
    ],
    correct: 1,
  },
];

// What the browser is allowed to see.
export const PUBLIC_QUESTIONS = QUESTIONS.map(({ id, text, options }) => ({ id, text, options }));

// Marketing questions shown on the details step. Edit freely; answers are stored as text.
export const MARKETING_QUESTIONS = [
  {
    key: 'potato_area',
    label: 'How many hectares of potatoes do you grow?',
    options: ['None', 'Under 20 ha', '20 to 100 ha', '100 to 300 ha', 'Over 300 ha'],
  },
  {
    key: 'current_harvester',
    label: 'Which make of harvester do you currently run?',
    options: ['GRIMME', 'AVR', 'Dewulf', 'ROPA', 'Standen', 'Other', 'None'],
  },
  {
    key: 'replacement_plans',
    label: 'When are you next planning to upgrade or replace harvesting kit?',
    options: ['This season', 'Within 1 to 2 years', '3 years or more', 'No current plans'],
  },
  {
    key: 'demo_interest',
    label: 'Would you like an on-farm demonstration?',
    options: ['Yes please', 'Maybe, send me details', 'No thanks'],
  },
] as const;

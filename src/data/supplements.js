const supplements = [
  {
    id: 'supp-1',
    name: 'Electrolyte Mix',
    timing: 'During and after training',
    dosage: '1 serving (500-750ml) per hour of exercise',
    purpose:
      'Replenishes sodium, potassium, and magnesium lost through sweat to prevent cramping and maintain hydration balance during and after runs.',
    trainingRelation:
      'Essential during sessions longer than 60 minutes or in hot conditions. Use after all high-intensity sessions regardless of duration.',
  },
  {
    id: 'supp-2',
    name: 'Whey Protein',
    timing: 'Within 30 minutes post-training',
    dosage: '20-30g per serving',
    purpose:
      'Fast-absorbing protein that stimulates muscle protein synthesis and accelerates recovery of damaged muscle fibers after training.',
    trainingRelation:
      'Most beneficial after moderate to high intensity sessions. On rest days, whole food protein sources are preferred over supplementation.',
  },
  {
    id: 'supp-3',
    name: 'BCAAs (Branched-Chain Amino Acids)',
    timing: 'Before or during prolonged training',
    dosage: '5-10g per serving',
    purpose:
      'Leucine, isoleucine, and valine help reduce muscle breakdown during long runs and may decrease perceived exertion and fatigue.',
    trainingRelation:
      'Most useful during fasted morning runs or sessions lasting over 90 minutes. Less necessary if consuming adequate protein throughout the day.',
  },
  {
    id: 'supp-4',
    name: 'Magnesium',
    timing: '30-60 minutes before bed',
    dosage: '200-400mg magnesium glycinate or citrate',
    purpose:
      'Supports muscle relaxation, reduces cramps, and improves sleep quality. Runners often have elevated magnesium needs due to losses through sweat.',
    trainingRelation:
      'Take nightly regardless of training. Especially important during high-volume training weeks when magnesium depletion accelerates.',
  },
  {
    id: 'supp-5',
    name: 'Tart Cherry Juice',
    timing: 'Morning and evening on training days',
    dosage: '240ml (8oz) twice daily',
    purpose:
      'Rich in anthocyanins and natural anti-inflammatory compounds that reduce muscle soreness, speed recovery, and may improve sleep quality through natural melatonin content.',
    trainingRelation:
      'Start 3-5 days before a hard training block or race. Most effective when used consistently around high-intensity or long run days.',
  },
  {
    id: 'supp-6',
    name: 'Omega-3 Fish Oil',
    timing: 'With a meal, once or twice daily',
    dosage: '1-3g combined EPA and DHA per day',
    purpose:
      'Reduces systemic inflammation, supports joint health, and aids cardiovascular function. May help manage exercise-induced muscle damage and soreness.',
    trainingRelation:
      'Take daily as a baseline supplement. Benefits accumulate over weeks of consistent use rather than providing immediate post-workout effects.',
  },
  {
    id: 'supp-7',
    name: 'Vitamin D',
    timing: 'Morning with a fat-containing meal',
    dosage: '1000-4000 IU daily, based on blood levels',
    purpose:
      'Essential for bone health, immune function, and muscle performance. Many runners are deficient, especially those training indoors or in northern climates during winter.',
    trainingRelation:
      'Take daily year-round. Adequate vitamin D levels support calcium absorption for bone density, which is critical for runners to prevent stress fractures.',
  },
];

export default supplements;

export const COACHES = [
  {
    id: 'coach-1',
    name: 'Ananya Rao',
    specialty: 'Hatha Yoga & Breathwork',
    image: '/assets/coaches/ananya-rao.jpg',
    experience: '9 years experience',
    availability: 'Mon-Fri, 6:00 AM - 8:00 PM IST',
    online: true,
    rating: 4.9,
    sessions: 1240,
    languages: ['English', 'Hindi', 'Telugu'],
    focus: ['Posture', 'Pranayama', 'Beginners', 'Prenatal'],
    bio:
      'Ananya teaches a slow, alignment-first Hatha practice with a strong emphasis on breath. She works best with people rebuilding a practice after a long break, or fixing posture habits picked up at a desk.',
    testimonials: [
      { author: 'Rohit S.', quote: 'Ananya helped me fix my posture in weeks, not months.' },
      { author: 'Meera K.', quote: 'Patient, clear, and genuinely invested in your progress.' },
    ],
  },
  {
    id: 'coach-2',
    name: 'Vikram Nair',
    specialty: 'Strength & Advanced Asanas',
    image: '/assets/coaches/vikram-nair.jpg',
    experience: '12 years experience',
    availability: 'Tue-Sun, 5:00 AM - 7:00 PM IST',
    online: false,
    rating: 4.8,
    sessions: 1890,
    languages: ['English', 'Malayalam', 'Tamil'],
    focus: ['Strength', 'Inversions', 'Mobility', 'Athletes'],
    bio:
      'Vikram builds strength progressions toward advanced asanas — arm balances, inversions and deep backbends. Expect structured homework between sessions and clear milestones to work toward.',
    testimonials: [
      { author: 'Divya P.', quote: "Vikram's sessions pushed me further than I thought possible." },
    ],
  },
  {
    id: 'coach-3',
    name: 'Arjun Mehta',
    specialty: 'Meditation & Mindfulness',
    image: '/assets/coaches/arjun-mehta.jpg',
    experience: '7 years experience',
    availability: 'Mon-Sat, 7:00 AM - 9:00 PM IST',
    online: true,
    rating: 4.7,
    sessions: 860,
    languages: ['English', 'Hindi', 'Marathi'],
    focus: ['Meditation', 'Stress Relief', 'Sleep', 'Corporate Wellness'],
    bio:
      "Arjun blends seated meditation with breath-led calming techniques for people managing high-stress jobs. Sessions are short and practical, built around habits you can keep on busy weeks.",
    testimonials: [
      { author: 'Karan V.', quote: "Arjun's 15-minute morning routine is the only thing that stuck." },
    ],
  },
  {
    id: 'coach-4',
    name: 'Priya Nambiar',
    specialty: 'Prenatal & Postnatal Yoga',
    image: '/assets/coaches/priya-nambiar.jpg',
    experience: '8 years experience',
    availability: 'Mon-Fri, 8:00 AM - 4:00 PM IST',
    online: false,
    rating: 4.9,
    sessions: 610,
    languages: ['English', 'Malayalam', 'Kannada'],
    focus: ['Prenatal', 'Postnatal', 'Pelvic Floor', 'Gentle Flow'],
    bio:
      'Priya specialises in safe, trimester-aware sequences for expecting and new mothers, with a gentle return-to-practice plan after delivery.',
    testimonials: [
      { author: 'Sneha R.', quote: 'Priya made me feel safe practising through my whole pregnancy.' },
    ],
  },
  {
    id: 'coach-5',
    name: 'Devika Iyer',
    specialty: 'Yin Yoga & Recovery',
    image: null,
    experience: '6 years experience',
    availability: 'Wed-Mon, 6:00 PM - 10:00 PM IST',
    online: true,
    rating: 4.6,
    sessions: 430,
    languages: ['English', 'Tamil'],
    focus: ['Yin Yoga', 'Flexibility', 'Recovery', 'Evening Wind-down'],
    bio:
      'Devika teaches slow, floor-based Yin sequences designed to unwind the body after long sitting or training days, with an emphasis on deep, held stretches.',
    testimonials: [
      { author: 'Farah A.', quote: 'The only class that actually gets rid of my desk-job back pain.' },
    ],
  },
]

export function getCoachById(id) {
  return COACHES.find((coach) => coach.id === id) ?? null
}

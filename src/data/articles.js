export const ARTICLES = [
  {
    id: 'breath-basics',
    title: 'The Breath Basics Every Beginner Should Know',
    readingTime: '4 min read',
    image: '/assets/yoga/articles/breath-basics/hero.webp',
    summary: 'Why breath comes before flexibility, and three patterns to practice today.',
    body: [
      'Most new students focus on how a pose looks before they focus on how they breathe through it. Flip that order and everything gets easier.',
      'Start with equal-count breathing: inhale for four counts, exhale for four counts. Once that feels natural, try extending the exhale slightly longer than the inhale — this gently activates your body\'s relaxation response.',
      'On days you feel wired or anxious before practice, spend two minutes just breathing before you move. The poses will follow more easily.',
    ],
  },
  {
    id: 'morning-vs-evening',
    title: 'Morning Practice vs. Evening Practice',
    readingTime: '5 min read',
    image: '/assets/yoga/articles/morning-vs-evening/hero.webp',
    summary: 'Your body behaves differently depending on when you practice — here\'s how to use that.',
    body: [
      'Morning bodies are stiffer but minds are clearer. Favor slow warm-ups, longer holds in gentle poses, and save deep backbends for later in the day.',
      'Evening bodies are looser but minds are fuller. This is a great time for flow sequences and longer meditation to process the day.',
      'Neither is "better" — consistency matters more than timing. Pick whichever slot you\'ll actually keep.',
    ],
  },
  {
    id: 'sore-muscles',
    title: 'Sore After Yoga? Here\'s What\'s Normal',
    readingTime: '3 min read',
    image: '/assets/yoga/articles/sore-muscles/hero.webp',
    summary: 'Muscle soreness vs. joint pain, and when to modify a pose.',
    body: [
      'A dull ache in the belly of a muscle 24-48 hours after practice is normal — it means you asked your body to do something new.',
      'Sharp pain, or pain in a joint rather than a muscle, is not something to push through. Back off the pose and consider a gentler variation.',
      'Gentle movement, hydration, and sleep are still the best recovery tools — no fancy supplement required.',
    ],
  },
  {
    id: 'building-consistency',
    title: 'Building a Practice You\'ll Actually Keep',
    readingTime: '4 min read',
    image: '/assets/yoga/articles/building-consistency/hero.webp',
    summary: 'The habit science behind sticking with yoga past the first two weeks.',
    body: [
      'Motivation fades. Systems don\'t. Decide on a fixed day and time, and treat it like an appointment rather than a mood.',
      'Ten honest minutes on a busy day beats a skipped 45-minute session. Shrink the practice before you skip it entirely.',
      'Track sessions somewhere visible, even a simple checklist. Momentum is its own reward once you can see it.',
    ],
  },
]

export function getArticleById(id) {
  return ARTICLES.find((article) => article.id === id) ?? null
}

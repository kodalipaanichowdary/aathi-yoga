export const CHATBOT_RULES = [
  {
    keywords: ['course', 'courses', 'class', 'classes', 'learn'],
    answer: 'You can browse Beginner, Intermediate and Advanced courses from the Courses tab. Each course includes a guided pose player with timers and step-by-step instructions.',
  },
  {
    keywords: ['membership', 'subscribe', 'subscription', 'plan', 'plans', 'price', 'pricing'],
    answer: 'We offer Monthly, Quarterly and Yearly memberships with unlimited courses, diet plans and coaching. Check the Subscription tab for full pricing.',
  },
  {
    keywords: ['product', 'products', 'store', 'shop', 'buy', 'mala', 'bracelet', 'rudraksha', 'idol', 'pendant', 'ring'],
    answer: 'Our store has bracelets, mala, rings, rudraksha bracelets, yoga mats, accessories, metal god idols, pendants and tulasi mala. Use the Categories tab to browse.',
  },
  {
    keywords: ['diet', 'nutrition', 'meal', 'food', 'calorie'],
    answer: 'Diet plans are available for weight loss, weight gain, general wellness, vegetarian, high protein and senior citizen needs. Find them under Diet Plans.',
  },
  {
    keywords: ['yoga', 'pose', 'asana', 'meditation', 'breathing'],
    answer: 'Yoga and meditation guidance is built into every course — each pose comes with position, breathing and safety instructions.',
  },
  {
    keywords: ['support', 'help', 'contact', 'issue', 'problem'],
    answer: "I can answer quick questions here, but for account or order issues you're best off talking to our support team directly.",
  },
  {
    keywords: ['coach', 'coaching', 'trainer', 'personal training'],
    answer: 'Personal coaching sessions can be booked from the Personal Coaching section — pick a coach and an available time slot.',
  },
]

export const CHATBOT_FALLBACK =
  "I'm not sure about that one yet. You can talk to our support team for anything I can't help with."

export function getChatbotAnswer(message) {
  const normalized = message.toLowerCase()
  const match = CHATBOT_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)))
  return match ? match.answer : CHATBOT_FALLBACK
}

export const MEMBERSHIP_FEATURES = [
  'Unlimited course access',
  'Personalized diet plans',
  'Monthly personal coaching session',
  'Live group sessions',
  'Priority support',
]

export const MEMBERSHIP_PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: 999,
    period: 'month',
    highlight: false,
    features: MEMBERSHIP_FEATURES.slice(0, 3),
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    price: 2499,
    period: '3 months',
    highlight: true,
    badge: 'Most popular',
    features: MEMBERSHIP_FEATURES,
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: 8999,
    period: 'year',
    highlight: false,
    badge: 'Best value',
    features: MEMBERSHIP_FEATURES,
  },
]

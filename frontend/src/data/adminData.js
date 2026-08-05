export const adminStats = [
  {
    id: 'users',
    label: 'Total users',
    value: '1,248',
    description: '+12.4% vs last month',
    bandClass: 'b-npk',
  },
  {
    id: 'active',
    label: 'Active users',
    value: '842',
    description: '67.6% of registered users',
    bandClass: 'b-humidity',
  },
  {
    id: 'predictions',
    label: 'Total predictions',
    value: '5,314',
    description: '+8.1% this week',
    bandClass: 'b-rainfall',
  },
  {
    id: 'confidence',
    label: 'Average confidence',
    value: '91%',
    description: 'Across latest recommendations',
    bandClass: 'b-temp',
  },
  {
    id: 'crop',
    label: 'Top crop',
    value: 'Maize',
    description: 'Most frequently recommended',
    bandClass: 'b-ph',
  },
  {
    id: 'alerts',
    label: 'Open alerts',
    value: '14',
    description: 'Needs follow-up',
    bandClass: 'b-npk',
  },
];

export const recentActivities = [
  {
    id: 1,
    title: 'New user onboarded',
    detail: 'Asha Sharma created an account and completed profile setup.',
    time: '8 min ago',
  },
  {
    id: 2,
    title: 'Prediction volume spike',
    detail: 'Recommendation requests increased by 18% over the last hour.',
    time: '24 min ago',
  },
  {
    id: 3,
    title: 'Weather model sync',
    detail: 'Live forecast data refreshed successfully for Kathmandu.',
    time: '1 hr ago',
  },
];

export const users = [
  {
    id: 1,
    name: 'Asha Sharma',
    email: 'asha@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2 hours ago',
  },
  {
    id: 2,
    name: 'Niraj Thapa',
    email: 'niraj@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '5 hours ago',
  },
  {
    id: 3,
    name: 'Sujan Bhandari',
    email: 'sujan@example.com',
    role: 'User',
    status: 'Pending',
    lastLogin: '1 day ago',
  },
  {
    id: 4,
    name: 'Meera K.C.',
    email: 'meera@example.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '3 days ago',
  },
];

export const predictions = [
  {
    id: 101,
    user: 'Niraj Thapa',
    crop: 'Maize',
    confidence: 0.94,
    date: '2026-07-21',
    status: 'Approved',
  },
  {
    id: 102,
    user: 'Sujan Bhandari',
    crop: 'Wheat',
    confidence: 0.88,
    date: '2026-07-20',
    status: 'Review',
  },
  {
    id: 103,
    user: 'Meera K.C.',
    crop: 'Rice',
    confidence: 0.91,
    date: '2026-07-19',
    status: 'Approved',
  },
  {
    id: 104,
    user: 'Asha Sharma',
    crop: 'Potato',
    confidence: 0.86,
    date: '2026-07-18',
    status: 'Pending',
  },
];

export const cropTrends = [
  { name: 'Maize', value: 38 },
  { name: 'Rice', value: 27 },
  { name: 'Wheat', value: 21 },
  { name: 'Potato', value: 14 },
];

export const settings = [
  {
    id: 'weather-sync',
    title: 'Weather sync',
    description: 'Automatically refresh weather data for new predictions.',
    enabled: true,
  },
  {
    id: 'auto-alerts',
    title: 'Alert notifications',
    description: 'Notify admins of unusual prediction spikes and failures.',
    enabled: true,
  },
  {
    id: 'beta-model',
    title: 'Beta model access',
    description: 'Expose the experimental recommendation model to selected admins.',
    enabled: false,
  },
];

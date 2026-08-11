export const dashboardStats = [
  {
    title: "Total Users",
    value: "248",
    change: "+12%",
    description: "from last month",
  },
  {
    title: "Predictions",
    value: "1,284",
    change: "+18%",
    description: "from last month",
  },
  {
    title: "Today's Predictions",
    value: "36",
    change: "+8%",
    description: "from yesterday",
  },
  {
    title: "Top Crop",
    value: "Rice",
    change: "38%",
    description: "of all recommendations",
  },
];

export const recentPredictions = [
  {
    id: 1,
    user: "Ram Sharma",
    location: "Kathmandu",
    crop: "Rice",
    date: "Aug 11, 2026",
    status: "Completed",
  },
  {
    id: 2,
    user: "Sita Thapa",
    location: "Chitwan",
    crop: "Maize",
    date: "Aug 11, 2026",
    status: "Completed",
  },
  {
    id: 3,
    user: "Hari KC",
    location: "Pokhara",
    crop: "Wheat",
    date: "Aug 10, 2026",
    status: "Completed",
  },
  {
    id: 4,
    user: "Mina Gurung",
    location: "Butwal",
    crop: "Potato",
    date: "Aug 10, 2026",
    status: "Completed",
  },
];

export const users = [
  {
    id: 1,
    username: "Ram Sharma",
    email: "ram@example.com",
    predictions: 18,
    joined: "Aug 01, 2026",
    status: "Active",
  },
  {
    id: 2,
    username: "Sita Thapa",
    email: "sita@example.com",
    predictions: 12,
    joined: "Aug 03, 2026",
    status: "Active",
  },
  {
    id: 3,
    username: "Hari KC",
    email: "hari@example.com",
    predictions: 24,
    joined: "Aug 04, 2026",
    status: "Active",
  },
  {
    id: 4,
    username: "Mina Gurung",
    email: "mina@example.com",
    predictions: 9,
    joined: "Aug 06, 2026",
    status: "Inactive",
  },
];

export const predictions = [
  {
    id: 1,
    user: "Ram Sharma",
    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,
    ph: 6.5,
    temperature: 25,
    humidity: 80,
    rainfall: 200,
    crop: "Rice",
    location: "Kathmandu",
    date: "Aug 11, 2026",
  },
  {
    id: 2,
    user: "Sita Thapa",
    nitrogen: 70,
    phosphorus: 40,
    potassium: 35,
    ph: 6.2,
    temperature: 23,
    humidity: 75,
    rainfall: 180,
    crop: "Maize",
    location: "Chitwan",
    date: "Aug 11, 2026",
  },
  {
    id: 3,
    user: "Hari KC",
    nitrogen: 80,
    phosphorus: 50,
    potassium: 40,
    ph: 6.8,
    temperature: 27,
    humidity: 70,
    rainfall: 160,
    crop: "Wheat",
    location: "Pokhara",
    date: "Aug 10, 2026",
  },
];

export const cropStats = [
  { crop: "Rice", percentage: 38 },
  { crop: "Maize", percentage: 25 },
  { crop: "Wheat", percentage: 18 },
  { crop: "Potato", percentage: 12 },
  { crop: "Other", percentage: 7 },
];
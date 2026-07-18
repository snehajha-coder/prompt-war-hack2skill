import { Plan } from "./types";

export const DEFAULT_PLAN: Plan = {
  levelTitle: "Low-Carbon Guardian",
  xpEarned: 120,
  co2SavedKg: 4.8,
  ecoScore: 94,
  meals: {
    breakfast: {
      title: "Eco-Harvest Berry Spelt Oats",
      prepTime: "10 mins",
      ingredients: [
        "80g Rolled Oats (bulk source)",
        "2 tbsp Chia seeds (low water usage)",
        "200ml Locally sourced oat milk",
        "Handful of seasonal local strawberries",
        "1 tbsp Maple syrup"
      ],
      instructions: [
        "In a reusable container, layer rolled oats, chia seeds, and oat milk.",
        "Stir gently, secure the lid, and place in refrigerator overnight.",
        "In the morning, top with fresh seasonal strawberries and a drizzle of maple syrup."
      ],
      co2e: "0.12 kg CO2e (Super Low)",
      ecoTip: "Buy dry goods from bulk bins to reduce packaging waste by 100%. Use oat milk to save 80% water compared to almond or dairy milk."
    },
    lunch: {
      title: "Smashed Chickpea & Local Greens Wrap",
      prepTime: "15 mins",
      ingredients: [
        "2 Whole wheat flatbreads",
        "1 Can organic chickpeas (rinsed)",
        "1 Smashed ripe avocado",
        "Cup of local organic microgreens",
        "Squeeze of fresh lemon"
      ],
      instructions: [
        "Coarsely mash rinsed chickpeas and ripe avocado together with sea salt and lemon juice.",
        "Spread evenly onto flatbread wraps.",
        "Layer with crisp seasonal microgreens, roll up, and slice in half."
      ],
      co2e: "0.28 kg CO2e (Low Carbon)",
      ecoTip: "Saves up to 1.8 kg of CO2e compared to a turkey breast deli wrap. Save the aquafaba (chickpea water) to create vegan whipped cream!"
    },
    dinner: {
      title: "One-Pot Garden Herb Lentil Bolognese",
      prepTime: "25 mins",
      ingredients: [
        "150g Organic brown lentils",
        "1 Can crushed organic tomatoes",
        "1 Locally grown carrot (diced with skin on)",
        "1 Celery stalk (finely chopped)",
        "200g Locally manufactured pasta",
        "Drizzle of olive oil & fresh basil"
      ],
      instructions: [
        "Heat olive oil in a deep pan. Sauté diced carrot and celery for 5 minutes. No need to peel carrots—the skin packs nutrition and saves food waste!",
        "Stir in dry lentils, crushed tomatoes, and 2 cups of water. Bring to a simmer.",
        "Cover and cook for 20 minutes until lentils are tender and sauce is thick.",
        "Serve tossed with cooked pasta and topped with torn fresh basil."
      ],
      co2e: "0.41 kg CO2e (Low Carbon Masterpiece)",
      ecoTip: "Lentils are nitrogen-fixing crops that naturally fertilize the soil. Save vegetable ends in a freezer bag to boil into premium kitchen broth!"
    }
  },
  groceryList: [
    { name: "Bulk Rolled Oats", category: "Pantry", estimatedCost: 1.50, co2Level: "Low" },
    { name: "Organic Chia Seeds", category: "Pantry", estimatedCost: 1.20, co2Level: "Low" },
    { name: "Local Oat Milk", category: "Cold", estimatedCost: 2.50, co2Level: "Low" },
    { name: "Seasonal Strawberries", category: "Produce", estimatedCost: 3.00, co2Level: "Low" },
    { name: "Organic Chickpeas (Can)", category: "Pantry", estimatedCost: 1.25, co2Level: "Low" },
    { name: "Fresh Avocados", category: "Produce", estimatedCost: 2.00, co2Level: "Medium" },
    { name: "Whole Wheat Flatbreads", category: "Pantry", estimatedCost: 2.50, co2Level: "Low" },
    { name: "Organic Brown Lentils", category: "Pantry", estimatedCost: 1.50, co2Level: "Low" },
    { name: "Crushed Tomatoes (Can)", category: "Pantry", estimatedCost: 1.40, co2Level: "Low" },
    { name: "Organic Carrots & Celery", category: "Produce", estimatedCost: 1.80, co2Level: "Low" },
    { name: "Local Pasta", category: "Pantry", estimatedCost: 2.00, co2Level: "Low" }
  ],
  substitutions: [
    {
      originalItem: "Beef Mince (for Bolognese)",
      ecoReplacement: "Organic Dry Brown Lentils",
      reason: "Reduces greenhouse gas emissions by up to 92% and offers high iron, fiber, and clean protein.",
      costDifference: -5.50
    },
    {
      originalItem: "Deli Turkey Breast Slices",
      ecoReplacement: "Smashed Lemon Chickpeas",
      reason: "Eliminates high processing waste and saves roughly 2.1 kg of carbon footprint.",
      costDifference: -2.80
    },
    {
      originalItem: "Imported Dutch Greenhouse Berries",
      ecoReplacement: "Seasonal Local Farm Strawberries",
      reason: "Bypasses intensive jet-freight supply chains and high-emission heated nursery glasshouses.",
      costDifference: -1.50
    }
  ],
  budgetAnalysis: {
    totalEstimatedCost: 20.65,
    feasibilityStatus: "under_budget",
    savingTips: [
      "Select bulk dispenser oats and chia seeds to save up to 40% retail markup.",
      "Lentils expand heavily when boiled—making this perfect for multi-portion meal prepping.",
      "Store avocado with lemon juice to prevent browning and stretch it over two days."
    ],
    feasibilityDetails: "Your total plan cost is estimated at $20.65, which fits comfortably below your maximum target budget of $30.00. Choosing plant-based bulk ingredients saved you $9.80!"
  },
  todoList: [
    { task: "Measure and set up Eco-Harvest Berry Oats in a reusable jar", type: "prep", points: 15 },
    { task: "Double check your pantry for leftover garlic, oil, or herbs before buying new", type: "shopping", points: 10 },
    { task: "Coarsely mash avocado and chickpeas with local greens", type: "prep", points: 15 },
    { task: "Sauté vegetables with skin on and simmer Bolognese until thick", type: "cooking", points: 25 },
    { task: "Place vegetable scraps in a compost bin and rinse tin cans for metal recycling", type: "cleanup", points: 20 }
  ]
};

export const VIBES = [
  { id: "busy workday", label: "💼 Busy Workday", desc: "Quick & easy meal steps" },
  { id: "relaxing weekend", label: "🧘 Relaxing Weekend", desc: "Enjoyable cooking quests" },
  { id: "high-energy day", label: "⚡ Active / Energy Day", desc: "Iron, high protein, rich fuel" },
  { id: "cozy rainy day", label: "🌧️ Cozy Comfort", desc: "Warm, grounding eco bowls" }
];

export const DIETS = [
  { id: "Vegan", label: "🌱 Vegan", desc: "100% plant-powered" },
  { id: "Vegetarian", label: "🥚 Vegetarian", desc: "No meat, eco-conscious" },
  { id: "Flexitarian", label: "🍗 Flexitarian", desc: "Plant-forward, minimal meat" },
  { id: "Pescatarian", label: "🐟 Pescatarian", desc: "Sustainable seafood + plants" },
  { id: "All diets", label: "🍽️ No Preferences", desc: "Standard, carbon-optimized" }
];

export const ECO_FOCUSES = [
  { id: "Zero Waste", label: "♻️ Zero Waste", desc: "Utilize stems, skins, and leftover tips" },
  { id: "Low Carbon", label: "🌍 Low Carbon", desc: "Avoid high-emissions ingredients entirely" },
  { id: "Local & Seasonal", label: "📍 Local & Seasonal", desc: "Reduce food transportation miles" },
  { id: "Balanced", label: "⚖️ Balanced", desc: "Saves both planet and pocket money" }
];

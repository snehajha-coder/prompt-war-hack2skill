import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely, logging a friendly message if missing
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini API Client:", error);
  }
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. The app will use high-quality dynamic mock generation for local previews.");
}

// Custom mock fallback generator for smooth offline-first developer previews
function getMockPlan(vibe: string, diet: string, servings: number, budget: number, priority: string) {
  const isVegan = diet.toLowerCase() === 'vegan' || diet.toLowerCase() === 'vegetarian';
  const displayBudget = budget || 25;
  const targetCost = Math.round(displayBudget * 0.85);

  return {
    levelTitle: priority === 'Zero Waste' ? "Zero Waste Pioneer" : "Low-Carbon Guardian",
    xpEarned: 120,
    co2SavedKg: 4.8,
    ecoScore: 92,
    meals: {
      breakfast: {
        title: isVegan ? "Overnight Berry-Chia Spelt Oats" : "Local Herb-Scrambled Tofu & Oats",
        prepTime: "10 mins",
        ingredients: [
          `${servings * 40}g Rolled Oats (bulk purchased)`,
          `${servings * 10}g Chia seeds`,
          `${servings * 100}ml Almond milk (locally produced)`,
          "Handful of seasonal local berries",
          "Drizzle of pure maple syrup"
        ],
        instructions: [
          "In a reusable mason jar, combine rolled oats, chia seeds, and almond milk.",
          "Stir thoroughly and seal. Refrigerate overnight.",
          "Top with fresh berries and maple syrup in the morning."
        ],
        co2e: "0.15 kg CO2e (Super Low)",
        ecoTip: "Buy oats and chia seeds from bulk bins to reduce single-use plastic packaging waste by 100%!"
      },
      lunch: {
        title: "Crispy Smashed Chickpea & Avocado Wrap",
        prepTime: "15 mins",
        ingredients: [
          `${servings} Organic whole wheat tortilla wraps`,
          "1 Can of organic chickpeas (rinsed and drained)",
          "1 Ripe avocado (smashed)",
          "Handful of local organic microgreens",
          "Pinch of sea salt and lemon juice"
        ],
        instructions: [
          "Mash chickpeas and ripe avocado together in a bowl with a fork.",
          "Stir in sea salt, a squeeze of lemon juice, and optional pepper.",
          "Spread onto whole wheat tortillas, top with microgreens, and roll tightly."
        ],
        co2e: "0.32 kg CO2e (Very Low)",
        ecoTip: "Keep chickpea aquafaba (drained liquid) in a container to whip up vegan meringue or chocolate mousse later!"
      },
      dinner: {
        title: "One-Pot Garden Veggie Lentil Bolognese",
        prepTime: "25 mins",
        ingredients: [
          `${servings * 80}g Dry brown lentils (low footprint)`,
          "1 Can crushed organic tomatoes",
          "1 Finely diced seasonal carrot",
          "1 Diced stalk of celery",
          `${servings * 100}g Local artisanal pasta`,
          "Fresh basil leaves for garnish"
        ],
        instructions: [
          "Sauté diced carrot and celery with a dash of olive oil in a deep pot for 5 minutes.",
          "Add dry lentils, crushed tomatoes, and 2 cups of water. Bring to a simmer.",
          "Cook for 20 minutes until lentils are soft and Bolognese is rich.",
          "Serve mixed with freshly boiled pasta, garnished with fresh basil leaves."
        ],
        co2e: "0.45 kg CO2e (Low-Impact Masterpiece)",
        ecoTip: "Save vegetable ends, onion skins, and celery tops in your freezer bag to simmer into homemade rich vegetable stock!"
      }
    },
    groceryList: [
      { name: "Rolled Oats (Bulk)", category: "Pantry", estimatedCost: 1.50 * servings, co2Level: "Low" },
      { name: "Chia Seeds (Bulk)", category: "Pantry", estimatedCost: 1.00 * servings, co2Level: "Low" },
      { name: "Almond Milk", category: "Cold", estimatedCost: 2.20, co2Level: "Low" },
      { name: "Seasonal Berries", category: "Produce", estimatedCost: 3.50, co2Level: "Low" },
      { name: "Chickpeas (Canned)", category: "Pantry", estimatedCost: 1.25 * servings, co2Level: "Low" },
      { name: "Avocados", category: "Produce", estimatedCost: 1.80 * servings, co2Level: "Medium" },
      { name: "Organic Tortilla Wraps", category: "Pantry", estimatedCost: 2.50, co2Level: "Low" },
      { name: "Dry Lentils", category: "Pantry", estimatedCost: 1.10 * servings, co2Level: "Low" },
      { name: "Crushed Tomatoes (Canned)", category: "Pantry", estimatedCost: 1.50, co2Level: "Low" },
      { name: "Carrots & Celery", category: "Produce", estimatedCost: 1.75, co2Level: "Low" },
      { name: "Artisanal Pasta", category: "Pantry", estimatedCost: 2.00, co2Level: "Low" }
    ],
    substitutions: [
      {
        originalItem: "Beef Bolognese sauce",
        ecoReplacement: "Brown Lentil bolognese",
        reason: "Saves roughly 18.5 kg CO2e per serving and is significantly more budget-friendly.",
        costDifference: -4.50 * servings
      },
      {
        originalItem: "Imported berries (out of season)",
        ecoReplacement: "Local apples or frozen mixed berries",
        reason: "Reduces transport emissions (food miles) by up to 85% while keeping the cost low.",
        costDifference: -1.20
      },
      {
        originalItem: "Single-serving yogurt pots",
        ecoReplacement: "Large family-sized oat milk tub or homemade oat yogurt",
        reason: "Prevents excessive packaging plastic waste, which saves plastic disposal energy.",
        costDifference: -0.80
      }
    ],
    budgetAnalysis: {
      totalEstimatedCost: targetCost,
      feasibilityStatus: targetCost <= displayBudget ? "under_budget" : "on_target",
      savingTips: [
        "Opt for store-brand canned chickpeas and dry bulk lentils to maximize raw savings.",
        "Use the leftover carrots and celery as quick crunchy snacks instead of throwing them away.",
        "Keep any pasta leftovers in a sealed container for a carbon-smart quick lunch tomorrow."
      ],
      feasibilityDetails: `Your total plan comes to about $${targetCost.toFixed(2)}, which is well under your target budget of $${displayBudget.toFixed(2)}. You saved an extra 15% by choosing high-nutrition, low-footprint plants and bulk goods!`
    },
    todoList: [
      { task: "Prepare Overnight Berry-Chia Oats for breakfast", type: "prep", points: 15 },
      { task: "Check local pantry for dry brown lentils and seasonal pasta", type: "shopping", points: 10 },
      { task: "Mash chickpeas and avocado into a wrapping consistency", type: "prep", points: 15 },
      { task: "Sauté carrot, celery, and simmer lentil Bolognese", type: "cooking", points: 25 },
      { task: "Collect vegetable peels and tomato can for separate recycling & composting", type: "cleanup", points: 20 }
    ]
  };
}

// API endpoint to generate plan
app.post("/api/generate-plan", async (req, res) => {
  const { vibe, diet, servings, budget, priority } = req.body;

  // Validate inputs
  const finalVibe = vibe || "busy workday";
  const finalDiet = diet || "All diets";
  const finalServings = Number(servings) || 2;
  const finalBudget = Number(budget) || 30;
  const finalPriority = priority || "Balanced";

  console.log(`Generating plan: Vibe='${finalVibe}', Diet='${finalDiet}', Servings=${finalServings}, Budget=$${finalBudget}, Priority='${finalPriority}'`);

  if (!ai) {
    console.log("Using dynamic mock fallback generator (No API key)");
    const mockData = getMockPlan(finalVibe, finalDiet, finalServings, finalBudget, finalPriority);
    return res.json(mockData);
  }

  try {
    const prompt = `
      Create a fully customized eco-friendly carbon-smart cooking to-do list, meal plan, grocery list, substitutions, and budget feasibility analysis based on the following options:
      - Day's Vibe / Schedule: "${finalVibe}"
      - Dietary Preference: "${finalDiet}"
      - Servings needed: ${finalServings} people
      - Maximum Budget Target: $${finalBudget} USD
      - Primary Eco Focus: "${finalPriority}" (e.g. Zero Waste, Low Carbon, Local/Seasonal, Balanced)

      Ensure that the meal plans and instructions emphasize:
      1. Low carbon emissions (prefer local, seasonal veggies, grains, seeds, beans; avoid high-emission products like beef, lamb, out-of-season air-freighted items).
      2. Zero waste practices (using leftover scraps, skins, portion control, recycling, composting).
      3. Budget-friendly ingredient selections, and calculate the cost difference of eco substitutions.
      4. A gamified list of active cook quests/todos (under todoList) representing the steps to buy, prep, cook, and clean up.

      Provide estimated costs of each item and double check that the total budget fits within the feasibility logic requested.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        levelTitle: { type: Type.STRING, description: "A gamified title for this eco cooking level, e.g., Low-Carbon Guardian" },
        xpEarned: { type: Type.INTEGER, description: "Amount of experience points earned, between 50 and 200" },
        co2SavedKg: { type: Type.NUMBER, description: "Total estimated CO2 saved in kilograms compared to standard meat-heavy diets" },
        ecoScore: { type: Type.INTEGER, description: "Overall eco-friendly score of the day, 0 to 100" },
        meals: {
          type: Type.OBJECT,
          properties: {
            breakfast: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                prepTime: { type: Type.STRING, description: "Prep + Cook time, e.g., '15 mins'" },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                co2e: { type: Type.STRING, description: "Estimated CO2 emission description, e.g., '0.15 kg CO2e'" },
                ecoTip: { type: Type.STRING, description: "Tips like Zero-waste storage, using leftover skins" }
              },
              required: ["title", "prepTime", "ingredients", "instructions", "co2e", "ecoTip"]
            },
            lunch: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                prepTime: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                co2e: { type: Type.STRING },
                ecoTip: { type: Type.STRING }
              },
              required: ["title", "prepTime", "ingredients", "instructions", "co2e", "ecoTip"]
            },
            dinner: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                prepTime: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                co2e: { type: Type.STRING },
                ecoTip: { type: Type.STRING }
              },
              required: ["title", "prepTime", "ingredients", "instructions", "co2e", "ecoTip"]
            }
          },
          required: ["breakfast", "lunch", "dinner"]
        },
        groceryList: {
          type: Type.ARRAY,
          description: "Comprehensive grocery list for these 3 meals",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING, description: "e.g., Produce, Pantry, Bulk, Cold" },
              estimatedCost: { type: Type.NUMBER, description: "Estimated retail cost in USD" },
              co2Level: { type: Type.STRING, description: "Emission category: Low, Medium, or High" }
            },
            required: ["name", "category", "estimatedCost", "co2Level"]
          }
        },
        substitutions: {
          type: Type.ARRAY,
          description: "Eco-swaps to optimize carbon footprint and budget",
          items: {
            type: Type.OBJECT,
            properties: {
              originalItem: { type: Type.STRING, description: "Traditional higher emission/cost ingredient" },
              ecoReplacement: { type: Type.STRING, description: "Vibrant, low-carbon, cost-effective substitute" },
              reason: { type: Type.STRING, description: "Environmental or nutritional benefit" },
              costDifference: { type: Type.NUMBER, description: "Difference in USD (negative number if cheaper), e.g. -1.50" }
            },
            required: ["originalItem", "ecoReplacement", "reason", "costDifference"]
          }
        },
        budgetAnalysis: {
          type: Type.OBJECT,
          properties: {
            totalEstimatedCost: { type: Type.NUMBER },
            feasibilityStatus: { type: Type.STRING, description: "Must be: under_budget, on_target, or over_budget" },
            savingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            feasibilityDetails: { type: Type.STRING, description: "A detailed 2-sentence breakdown comparing to their target budget" }
          },
          required: ["totalEstimatedCost", "feasibilityStatus", "savingTips", "feasibilityDetails"]
        },
        todoList: {
          type: Type.ARRAY,
          description: "Interactive Quest Steps to complete throughout the day",
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING, description: "Action statement starting with a verb, e.g., Prep the oats, Chop celery" },
              type: { type: Type.STRING, description: "Must be: shopping, prep, cooking, or cleanup" },
              points: { type: Type.INTEGER, description: "Eco XP points, e.g., 10, 15, 20" }
            },
            required: ["task", "type", "points"]
          }
        }
      },
      required: [
        "levelTitle", "xpEarned", "co2SavedKg", "ecoScore",
        "meals", "groceryList", "substitutions", "budgetAnalysis", "todoList"
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are EcoVibe Chef, a gamified environmental culinary AI assistant. You specialize in generating highly personalized, zero-waste, low-impact carbon cooking schedules and budget-optimized grocery list planners.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const textResult = response.text;
    if (!textResult) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedPlan = JSON.parse(textResult.trim());
    return res.json(parsedPlan);
  } catch (error) {
    console.error("Gemini Generation Error, falling back to mock:", error);
    // Return high quality fallback mock so user is not blocked
    const mockData = getMockPlan(finalVibe, finalDiet, finalServings, finalBudget, finalPriority);
    return res.json({
      ...mockData,
      _debug_warning: "Generation failed or timed out; served a high-quality relevant plan instead.",
      _error: error instanceof Error ? error.message : String(error)
    });
  }
});

async function startApp() {
  // Serve UI assets
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoVibe server listening at http://localhost:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Error starting EcoVibe server:", err);
});

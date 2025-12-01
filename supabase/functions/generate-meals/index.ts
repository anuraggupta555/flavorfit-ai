import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences, pantry, quickSettings, nutritionGoals } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating meals with preferences:", { preferences, quickSettings, nutritionGoals });
    console.log("Pantry items:", pantry);

    const prompt = `You are a nutrition expert and chef. Generate 8 personalized meal recommendations that PRIMARILY use the user's available pantry items and respect their dietary preferences.

USER DIETARY PREFERENCES:
${preferences.length > 0 ? preferences.map((p: string) => `- ${p}`).join('\n') : '- No specific restrictions'}

QUICK SETTINGS:
- Quick meals only (under 30 min): ${quickSettings['quick-meals'] ? 'YES' : 'NO'}
- Family portions (4+ servings): ${quickSettings['family-portions'] ? 'YES' : 'NO'}
- Eco-friendly (low carbon footprint): ${quickSettings['eco-friendly'] ? 'YES' : 'NO'}

NUTRITION GOALS:
- Daily Calories: ${nutritionGoals.calories || 2000}kcal
- Protein Target: ${nutritionGoals.protein || 100}g
- Carb Limit: ${nutritionGoals.carbs || 250}g  
- Fat Target: ${nutritionGoals.fats || 70}g

AVAILABLE PANTRY ITEMS (USE THESE FIRST!):
${pantry.length > 0 ? pantry.map((item: any) => `- ${item.name}: ${item.quantity} (expires: ${item.expiresIn})`).join('\n') : '- Pantry is empty'}

CRITICAL INSTRUCTIONS:
1. PRIORITIZE meals that use pantry items, especially those expiring soon
2. Each meal MUST list which ingredients are already in pantry vs which need to be purchased
3. Calculate match score based on: pantry utilization (40%), dietary fit (30%), nutrition alignment (30%)
4. If quick meals setting is ON, all meals must be under 30 minutes
5. Provide a "mainProtein" field for image matching (chicken, beef, fish, vegetarian, salad, pasta, rice, soup)

Return ONLY valid JSON array:
[
  {
    "title": "Meal Name",
    "description": "Brief 2-sentence description highlighting pantry items used",
    "calories": 450,
    "protein": 35,
    "carbs": 40,
    "fats": 15,
    "time": "25 min",
    "servings": 2,
    "tags": ["High Protein", "Quick"],
    "matchScore": 95,
    "mainProtein": "chicken",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "inPantry": ["ingredient 1"],
    "missingIngredients": ["ingredient 2"],
    "instructions": ["Step 1", "Step 2", "Step 3"]
  }
]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a helpful nutrition and cooking assistant. Always respond with valid JSON only, no markdown formatting." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Raw AI response:", content);

    // Parse the JSON response - handle potential markdown code blocks
    let meals;
    try {
      let jsonContent = content.trim();
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.slice(7);
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.slice(3);
      }
      if (jsonContent.endsWith('```')) {
        jsonContent = jsonContent.slice(0, -3);
      }
      meals = JSON.parse(jsonContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse meal recommendations");
    }

    // Add IDs and appropriate images based on meal content
    const mealsWithIds = meals.map((meal: any) => ({
      ...meal,
      id: crypto.randomUUID(),
      image: getMealImage(meal.mainProtein, meal.tags, meal.title),
    }));

    console.log("Generated meals:", mealsWithIds.length);

    return new Response(JSON.stringify({ meals: mealsWithIds }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-meals function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getMealImage(mainProtein: string, tags: string[], title: string): string {
  const imageMap: Record<string, string[]> = {
    chicken: [
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80",
      "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600&q=80",
    ],
    beef: [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&q=80",
    ],
    fish: [
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=600&q=80",
    ],
    salmon: [
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
    ],
    vegetarian: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      "https://images.unsplash.com/photo-1540914124281-342587941389?w=600&q=80",
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&q=80",
    ],
    salad: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    ],
    pasta: [
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80",
    ],
    rice: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
      "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=600&q=80",
    ],
    soup: [
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
      "https://images.unsplash.com/photo-1588566565463-180a5b2090d6?w=600&q=80",
    ],
    eggs: [
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&q=80",
    ],
    breakfast: [
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
    ],
  };

  // Check main protein first
  const protein = mainProtein?.toLowerCase() || '';
  if (imageMap[protein]) {
    const images = imageMap[protein];
    return images[Math.floor(Math.random() * images.length)];
  }

  // Check tags for clues
  const tagStr = tags?.join(' ').toLowerCase() || '';
  const titleLower = title?.toLowerCase() || '';
  
  for (const [key, images] of Object.entries(imageMap)) {
    if (tagStr.includes(key) || titleLower.includes(key)) {
      return images[Math.floor(Math.random() * images.length)];
    }
  }

  // Default healthy food images
  const defaults = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

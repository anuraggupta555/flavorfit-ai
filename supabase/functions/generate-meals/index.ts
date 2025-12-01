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

    const prompt = `You are a nutrition expert and chef. Generate 8 personalized meal recommendations based on the user's preferences and available pantry items.

USER PREFERENCES:
- Dietary Restrictions: ${JSON.stringify(preferences)}
- Quick Settings: ${JSON.stringify(quickSettings)}
- Nutrition Goals: Daily Calories: ${nutritionGoals.calories}kcal, Protein: ${nutritionGoals.protein}g, Carbs: ${nutritionGoals.carbs}g, Fats: ${nutritionGoals.fats}g

AVAILABLE PANTRY ITEMS:
${pantry.map((item: any) => `- ${item.name}: ${item.quantity} (expires: ${item.expiresIn})`).join('\n')}

For each meal, provide:
1. A creative title
2. Brief description (2 sentences max)
3. Estimated calories, protein, carbs, and fats
4. Cooking time
5. Servings
6. Tags (e.g., "High Protein", "Quick", "Vegetarian", "Keto")
7. Match percentage (how well it fits their preferences, 70-100%)
8. List of ingredients needed
9. Which ingredients are already in their pantry
10. Step-by-step instructions (5-7 steps)

Prioritize meals that:
- Use ingredients about to expire
- Match dietary restrictions
- Meet nutrition goals
- Respect cooking time preferences (quick meals under 30 min if enabled)

Return ONLY valid JSON array with this exact structure:
[
  {
    "title": "Meal Name",
    "description": "Brief description",
    "calories": 450,
    "protein": 35,
    "carbs": 40,
    "fats": 15,
    "time": "25 min",
    "servings": 2,
    "tags": ["High Protein", "Quick"],
    "matchScore": 95,
    "ingredients": ["ingredient 1", "ingredient 2"],
    "inPantry": ["ingredient 1"],
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

    // Add IDs and image placeholders to meals
    const mealsWithIds = meals.map((meal: any, index: number) => ({
      ...meal,
      id: crypto.randomUUID(),
      image: getPlaceholderImage(meal.tags, index),
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

function getPlaceholderImage(tags: string[], index: number): string {
  const images = [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    "https://images.unsplash.com/photo-1482049016gy-2176-4dc8?w=600&q=80",
  ];
  
  return images[index % images.length];
}

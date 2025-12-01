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
    const { preferences, pantry, nutritionGoals, daysToplan = 7 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating shopping list with:", { preferences, daysToplan });

    const prompt = `You are a smart meal planning assistant. Generate a comprehensive shopping list for ${daysToplan} days of healthy meals.

USER PREFERENCES:
- Dietary Restrictions: ${JSON.stringify(preferences)}
- Nutrition Goals: Daily Calories: ${nutritionGoals.calories}kcal, Protein: ${nutritionGoals.protein}g, Carbs: ${nutritionGoals.carbs}g, Fats: ${nutritionGoals.fats}g

CURRENT PANTRY (already have these):
${pantry.map((item: any) => `- ${item.name}: ${item.quantity}`).join('\n')}

Generate a shopping list with items needed to prepare nutritious meals for ${daysToplan} days. 

Rules:
1. DO NOT include items already in the pantry
2. Focus on fresh, healthy ingredients
3. Respect dietary restrictions
4. Include variety for balanced nutrition
5. Group by category (Produce, Proteins, Dairy, Grains, etc.)

Return ONLY valid JSON with this exact structure:
{
  "shoppingList": [
    {
      "name": "Item name",
      "quantity": "Amount (e.g., 3, 500g, 2 lbs)",
      "category": "Category (Produce/Proteins/Dairy/Grains/Pantry Staples/Condiments)"
    }
  ],
  "estimatedMeals": 21,
  "tips": ["Helpful tip 1", "Helpful tip 2"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a helpful meal planning assistant. Always respond with valid JSON only, no markdown formatting." },
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

    // Parse the JSON response
    let result;
    try {
      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.slice(7);
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.slice(3);
      }
      if (jsonContent.endsWith('```')) {
        jsonContent = jsonContent.slice(0, -3);
      }
      result = JSON.parse(jsonContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse shopping list");
    }

    // Add IDs to shopping list items
    const shoppingListWithIds = result.shoppingList.map((item: any) => ({
      ...item,
      id: crypto.randomUUID(),
      checked: false,
    }));

    console.log("Generated shopping list:", shoppingListWithIds.length, "items");

    return new Response(JSON.stringify({ 
      shoppingList: shoppingListWithIds,
      estimatedMeals: result.estimatedMeals,
      tips: result.tips 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-shopping-list function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { documentId, extractedText } = await req.json();

    if (!documentId || !extractedText) {
      return new Response(
        JSON.stringify({ error: "Missing documentId or extractedText" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing document ${documentId} for user ${user.id}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Generate summary
    const summaryResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are an expert educational content analyzer. Create clear, concise summaries that highlight key concepts and main ideas.",
            },
            {
              role: "user",
              content: `Summarize the following educational content into clear, structured key points:\n\n${extractedText}`,
            },
          ],
        }),
      }
    );

    if (!summaryResponse.ok) {
      console.error("AI summary error:", await summaryResponse.text());
      throw new Error("Failed to generate summary");
    }

    const summaryData = await summaryResponse.json();
    const summaryContent = summaryData.choices[0].message.content;

    // Store summary
    const { error: summaryError } = await supabaseClient
      .from("summaries")
      .insert({
        document_id: documentId,
        content: summaryContent,
      });

    if (summaryError) {
      console.error("Error storing summary:", summaryError);
    }

    // Generate flashcards
    const flashcardsResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are an expert at creating study flashcards. Create clear question-answer pairs that test understanding.",
            },
            {
              role: "user",
              content: `Generate 8-10 flashcards from this content. Format each as 'Q: [question]\nA: [answer]' separated by double newlines:\n\n${extractedText}`,
            },
          ],
        }),
      }
    );

    if (flashcardsResponse.ok) {
      const flashcardsData = await flashcardsResponse.json();
      const flashcardsText = flashcardsData.choices[0].message.content;

      // Parse flashcards
      const flashcardPairs = flashcardsText
        .split("\n\n")
        .map((pair: string) => {
          const lines = pair.trim().split("\n");
          const question = lines[0]?.replace(/^Q:\s*/i, "").trim();
          const answer = lines[1]?.replace(/^A:\s*/i, "").trim();
          return question && answer ? { question, answer } : null;
        })
        .filter(Boolean);

      // Store flashcards
      for (const card of flashcardPairs) {
        await supabaseClient.from("flashcards").insert({
          document_id: documentId,
          question: card.question,
          answer: card.answer,
        });
      }
    }

    // Generate quiz
    const quizResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are an expert at creating educational quizzes. Create multiple choice questions with 4 options each.",
            },
            {
              role: "user",
              content: `Generate 5 multiple-choice questions from this content. For each question, provide: Question, 4 options (A-D), correct answer letter, and brief explanation. Format as JSON array:\n\n${extractedText}`,
            },
          ],
        }),
      }
    );

    if (quizResponse.ok) {
      const quizData = await quizResponse.json();
      const quizText = quizData.choices[0].message.content;

      try {
        // Extract JSON from potential markdown code blocks
        let jsonText = quizText;
        const jsonMatch = quizText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }

        const quizQuestions = JSON.parse(jsonText);

        // Store quiz questions
        for (const q of quizQuestions) {
          await supabaseClient.from("quizzes").insert({
            document_id: documentId,
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
          });
        }
      } catch (parseError) {
        console.error("Error parsing quiz JSON:", parseError);
      }
    }

    // Mark document as processed
    await supabaseClient
      .from("documents")
      .update({ processed: true })
      .eq("id", documentId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Document processed successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing document:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

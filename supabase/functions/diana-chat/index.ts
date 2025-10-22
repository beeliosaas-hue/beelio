import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, action, briefing, branding } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    // System prompt personalizado da Diana com personalidade única
    let systemPrompt = `Você é Diana 🐝, a consultora de marketing do Beelio. 

PERSONALIDADE:
- Carisma e energia positiva
- Use emojis naturalmente
- Bordões: "Achei mel de ouro aqui 🐝✨" (insights top), "Alerta de tendência! 🚨"
- Seja consultora estratégica, não só bot de respostas
- Humor leve e profissional

CONTEXTO DO USUÁRIO:
${briefing ? `Briefing: ${JSON.stringify(briefing)}` : ''}
${branding ? `Branding: ${JSON.stringify(branding)}` : ''}

REGRAS:
- Respostas objetivas e acionáveis
- Sempre pense em ROI e estratégia
- Use frameworks: Kotler, Ries, Ogilvy, Cialdini
- Sugira posts prontos para o calendário
- Analise com dados e tendências reais

FORMATO DE RESPOSTA:
- Texto claro e estruturado
- Use listas quando apropriado
- Inclua CTAs práticos`;

    // Ajustar prompt baseado na ação específica
    if (action === "inspire") {
      systemPrompt += "\n\nAÇÃO: Gere 3 ideias criativas de posts. Para cada uma, inclua: título chamativo, descrição, tipo de conteúdo e hashtags sugeridas.";
    } else if (action === "plan") {
      systemPrompt += "\n\nAÇÃO: Crie um calendário semanal de conteúdo. Liste dia a dia com tema, formato e objetivo de cada post.";
    } else if (action === "analyze") {
      systemPrompt += "\n\nAÇÃO: Analise a estratégia fornecida. Destaque: pontos fortes, fracos, oportunidades e recomendações práticas.";
    } else if (action === "trend") {
      systemPrompt += "\n\nAÇÃO: Identifique tendências atuais relevantes. Explique como adaptar para a marca do usuário.";
    } else if (action === "create") {
      systemPrompt += "\n\nAÇÃO: Gere uma copy completa de post. Inclua: texto principal, call-to-action, hashtags e sugestão visual.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Aguarde um momento e tente novamente." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Adicione mais créditos no Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Erro no AI Gateway:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar solicitação" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Erro no diana-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

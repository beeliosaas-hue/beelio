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

    // System prompt personalizado da Diana com conhecimento profundo do Beelio
    let systemPrompt = `Você é Diana 🐝, a consultora de marketing pessoal do Beelio.

SOBRE O BEELIO:
O Beelio é um calendário inteligente de marketing para pequenas empresas e profissionais que centraliza planejamento, criação e publicação de conteúdo.

FUNCIONALIDADES DISPONÍVEIS:
✅ Calendário Editorial Inteligente
✅ Briefing da Marca (missão, valores, público-alvo, diferencias)
✅ Branding (identidade visual, paleta de cores, tipografias, logos)
✅ Biblioteca Centralizada (fotos, vídeos, artes)
✅ Tendências e Datas Comemorativas
✅ Criação e Agendamento de Posts
✅ Relatórios Estratégicos
✅ Planner IA (campanhas completas)
✅ Integração com Redes Sociais (Instagram, TikTok, LinkedIn)

PLANOS DO BEELIO:
📦 FREE: Calendário simples, Briefing, Branding, 3 créditos/semana comigo
📦 STARTER (R$ 87/mês): + Tendências, Biblioteca, 30 posts/mês, 5 créditos/dia
📦 PRO (R$ 197/mês): + Posts ilimitados, Créditos ilimitados, Planner IA, Criador ADS, Integrações

${briefing ? `
📋 BRIEFING DA MARCA DO USUÁRIO:
- Nome: ${briefing.nome_marca || 'Não informado'}
- Segmento: ${briefing.segmento_atuacao || 'Não informado'}
- Público-alvo: ${briefing.cliente_ideal || 'Não informado'}
- Missão: ${briefing.missao || 'Não informado'}
- Tom de voz: ${briefing.tom_voz || 'Não informado'}
- Valores: ${briefing.valores || 'Não informado'}
- Objetivos: ${briefing.objetivos_marketing?.join(', ') || 'Não informado'}
- Diferenciais: ${briefing.diferenciais || 'Não informado'}
` : '⚠️ Usuário ainda não preencheu o Briefing. Sugira começar por lá!'}

${branding ? `
🎨 BRANDING DA MARCA DO USUÁRIO:
- Paleta de cores: ${branding.paleta_cores?.join(', ') || 'Não definida'}
- Tipografias: ${JSON.stringify(branding.tipografias) || 'Não definidas'}
- Objetivos curto prazo: ${branding.objetivos_curto_prazo || 'Não definido'}
` : '⚠️ Usuário ainda não definiu o Branding. Recomende completar essa etapa!'}

SUA PERSONALIDADE:
- Estratégica + Didática + Provocativa
- Use emojis naturalmente (🐝✨🚀💡📊🎯)
- Bordões: "Achei mel de ouro aqui 🐝✨" (insights valiosos), "Alerta de tendência! 🚨", "Bora voar alto! 🚀"
- Seja consultora prática, não apenas respondedora
- Humor leve e profissional, mas sempre séria quando necessário
- Empática e próxima do usuário

FRAMEWORKS QUE VOCÊ DOMINA:
📚 Clássicos: Kotler (STP), Ries (Posicionamento), Ogilvy (Copy), Cialdini (Persuasão)
📚 Estratégia: Blue Ocean (ERRC), Chasm (Nicho), Purple Cow (Remarkability)
📚 Psicologia: Kahneman (Ancoragem), Byron Sharp (Brand Assets), Berger (STEPPS)
📚 Operacional: StoryBrand, Growth Loops, Schwartz (Consciência)

REGRAS DE OURO:
✓ Sempre consulte o Briefing e Branding antes de sugerir estratégias
✓ Adapte sugestões ao plano do usuário (Free/Starter/Pro)
✓ Foque em ROI e ações práticas, não apenas teoria
✓ Sugira posts prontos para o calendário quando relevante
✓ Seja transparente sobre limitações de plano
✓ Incentive o usuário a completar Briefing e Branding se não tiver
✓ NUNCA invente funcionalidades que o Beelio não tem
✓ Use dados e tendências reais do mercado brasileiro

FORMATO DE RESPOSTA:
📝 Texto claro, estruturado e escaneável
📝 Use listas e bullets quando apropriado
📝 Inclua CTAs práticos ("Quer que eu crie isso agora?")
📝 Máximo 400 palavras por resposta (seja concisa)
📝 Sempre pergunte se o usuário precisa de mais detalhes`;

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

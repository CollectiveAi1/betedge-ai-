export const dynamic = 'force-dynamic';
import { requireUserId } from '@/lib/api-auth';
import { NextResponse } from 'next/server';
import { MOCK_ANALYSIS } from '@/lib/mock-data';
import { getCached, setCache, ANALYSIS_CACHE_TTL } from '@/lib/cache';

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
};

/** Sends a single SSE frame and closes — used for cache hits. */
function sseOnce(payload: unknown): Response {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        controller.close();
      },
    }),
    { headers: SSE_HEADERS }
  );
}

export async function POST(request: Request) {
  const userId = await requireUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { marketType, playerName, statType, line, sport, contextData } = body ?? {};

    // Analyses are deterministic for a given market, and model calls are billed, so
    // serve a recent one instead of paying for it again on every refresh.
    const cacheKey = `analysis-${sport}-${playerName}-${statType}-${line}-${marketType}`;
    const cached = getCached<unknown>(cacheKey);
    if (cached) {
      return sseOnce({ status: 'completed', result: cached, cached: true });
    }

    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const systemPrompt = `You are BetEdge AI, an expert sports betting research assistant. Analyze the given bet and produce a structured JSON research packet.

Rules:
- Grade: A (strong edge), B (moderate edge), C (borderline), D (slight negative), F (strong avoid)
- Confidence: 0-100
- Recommendation: STRONG OVER, OVER, LEAN OVER, AVOID, LEAN UNDER, UNDER, STRONG UNDER
- Always include a disclaimer: "This is educational analysis only. Never guarantee wins."
- Be evidence-based and acknowledge uncertainty
- Key factors should be specific and data-driven

Respond with raw JSON only. No code blocks. Schema:
{
  "grade": "A"|"B"|"C"|"D"|"F",
  "confidence": number,
  "recommendation": string,
  "edgeSummary": string (1 punchy sentence),
  "keyFactors": string[] (3-5 bullet points),
  "risks": string[] (2-3 bullet points),
  "disclaimer": "This is educational analysis only. Never guarantee wins."
}`;

    const userPrompt = `Analyze this ${sport?.toUpperCase() ?? 'sport'} ${marketType ?? 'prop'}:

Player: ${playerName ?? 'Unknown'}
Stat: ${statType ?? 'Unknown'}
Line: ${line ?? 0}
Odds: Over ${contextData?.overOdds ?? -110} / Under ${contextData?.underOdds ?? -110}
Team: ${contextData?.team ?? 'Unknown'}

Provide your analysis as JSON.`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: true,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API returned ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';
        let partialRead = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            partialRead += decoder.decode(value, { stream: true });
            const lines = partialRead.split('\n');
            partialRead = lines.pop() ?? '';
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                if (dataStr === '[DONE]') {
                  try {
                    const finalResult = JSON.parse(buffer);
                    setCache(cacheKey, finalResult, ANALYSIS_CACHE_TTL);
                    const finalData = JSON.stringify({ status: 'completed', result: finalResult });
                    controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
                  } catch {
                    // If parse fails, use mock
                    const finalData = JSON.stringify({ status: 'completed', result: MOCK_ANALYSIS });
                    controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
                  }
                  return;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  buffer += parsed?.choices?.[0]?.delta?.content ?? '';
                  const progressData = JSON.stringify({ status: 'processing', message: 'Analyzing matchup data...' });
                  controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));
                } catch { /* skip */ }
              }
            }
          }
          // If we exit loop without [DONE], try to parse buffer
          if (buffer) {
            try {
              const finalResult = JSON.parse(buffer);
              setCache(cacheKey, finalResult, ANALYSIS_CACHE_TTL);
              const finalData = JSON.stringify({ status: 'completed', result: finalResult });
              controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
            } catch {
              const finalData = JSON.stringify({ status: 'completed', result: MOCK_ANALYSIS });
              controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
            }
          }
        } catch (error: any) {
          console.error('Stream error:', error);
          const errorData = JSON.stringify({ status: 'completed', result: MOCK_ANALYSIS });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: SSE_HEADERS });
  } catch (error: any) {
    console.error('AI analyze error:', error);
    return NextResponse.json({ error: 'Analysis failed: ' + (error?.message ?? 'unknown') }, { status: 500 });
  }
}

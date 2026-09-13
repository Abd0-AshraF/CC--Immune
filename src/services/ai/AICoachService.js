/**
 * AICoachService — Grounded MLBB AI Coach
 * Integrates Google Gemini (@google/genai) server-side with hero database fallback.
 */

import { GoogleGenAI } from '@google/genai';
import { HEROES_DATA } from '../../data/heroes.js';
import { ITEMS_DATA } from '../../data/items.js';

let aiClient = null;

function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('[AICoachService] Could not initialize Gemini SDK:', e.message);
    }
  }
  return aiClient;
}

export class AICoachService {
  /**
   * Free-form MLBB Question & Answer
   */
  static async askQuestion(prompt, lang = 'en') {
    const ai = getAIClient();
    
    // 1. Try Gemini API if available
    if (ai) {
      try {
        const heroContext = HEROES_DATA.map(h => `${h.name} (${h.role}, ${h.lane}): counters ${h.counters.join(', ')} | countered by ${h.counteredBy.join(', ')} | items: ${h.bestItems.slice(0, 3).join(', ')}`).join('\n');
        
        const systemPrompt = `You are "Immune Coach", a professional Mobile Legends: Bang Bang (MLBB) AI coach.
Use the following official hero database context for grounding:
${heroContext}

Instructions:
- Respond in ${lang === 'ar' ? 'Arabic' : 'English'}.
- Provide sharp, strategic, competitive MLBB advice.
- Keep responses concise, well-formatted, with bullet points where appropriate.
- Never invent fake hero stats; strictly ground hero numbers and items.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }] }
          ]
        });

        if (response && response.text) {
          return {
            text: response.text,
            provider: 'Gemini (gemini-2.5-flash)',
            grounded: true
          };
        }
      } catch (err) {
        console.warn('[AICoachService] Gemini API call failed, falling back to database grounding:', err.message);
      }
    }

    // 2. Grounded Database Fallback
    const query = prompt.toLowerCase();
    const matchedHero = HEROES_DATA.find(h => 
      query.includes(h.name.toLowerCase()) || 
      (h.arabicName && query.includes(h.arabicName))
    );

    if (matchedHero) {
      if (lang === 'ar') {
        return {
          text: `🛡️ **نصيحة مدرب CC Immune للبطل ${matchedHero.name} (${matchedHero.arabicName})**:\n` +
                `• **الموقع والخط**: ${matchedHero.lane} | ${matchedHero.role}\n` +
                `• **التصنيف والتأثير**: Tier ${matchedHero.tier} | نسبة الفوز ${matchedHero.winRate}\n` +
                `• **أفضل مضاد ضد**: ${matchedHero.counters.join(', ')}\n` +
                `• **احذر من**: ${matchedHero.counteredBy.join(', ')}\n` +
                `• **أفضل معدات**: ${matchedHero.bestItems.join(' · ')}\n` +
                `• **نصيحة استراتيجية**: ${matchedHero.arabicDesc}`,
          provider: 'Database Grounded Engine (Offline Fallback)',
          grounded: true
        };
      }
      return {
        text: `🛡️ **Immune Coach Analysis for ${matchedHero.name}**:\n` +
              `• **Role & Lane**: ${matchedHero.role} (${matchedHero.lane})\n` +
              `• **Meta Power**: Tier ${matchedHero.tier} | Win Rate: ${matchedHero.winRate}\n` +
              `• **Strong Against**: ${matchedHero.counters.join(', ')}\n` +
              `• **Countered By**: ${matchedHero.counteredBy.join(', ')}\n` +
              `• **Recommended Build**: ${matchedHero.bestItems.join(' · ')}\n` +
              `• **Pro Tip**: ${matchedHero.description}`,
        provider: 'Database Grounded Engine (Offline Fallback)',
        grounded: true
      };
    }

    // Generic MLBB Advice Fallback
    if (lang === 'ar') {
      return {
        text: `🛡️ **دليل استراتيجية ألعاب MLBB المتوازنة (Immune Coach)**:\n` +
              `1. **تكوين الفريق (Team Comp)**: احرص دائماً على وجود تانك/داعم (Roam) مع مهارات تحكم (CC) مثل Minotaur أو Khufra لحماية الـ Gold Laner.\n` +
              `2. **السيطرة على الأهداف**: السلحفاة (Turtle) تعطي فريقك ذهباً وخبرة؛ احرص على التواجد قبل ظهورها بـ 15 ثانية.\n` +
              `3. **بناء المعدات المضادة**: لا تعتمد على بناء ثابت! اشترِ **Dominance Ice** ضد الأبطال ذوي التجديد العالي (Estes, Ruby) و **Athena's Shield** ضد الضرر السحري الخاطف.`,
        provider: 'Grounded Strategy Engine',
        grounded: true
      };
    }

    return {
      text: `🛡️ **Immune Coach Competitive Guidelines**:\n` +
            `1. **Team Composition**: Ensure a solid Roamer (e.g. Minotaur, Khufra) with heavy CC to create space for your Marksman/Mage.\n` +
            `2. **Objective Control**: Position around the Turtle 15s prior to spawn. Early Gold leads secure mid-game map pressure.\n` +
            `3. **Counter Building**: Adapt your builds! Buy **Dominance Ice** against high regen/attack speed comps, and **Athena's Shield** against burst mages.`,
      provider: 'Grounded Strategy Engine',
      grounded: true
    };
  }

  /**
   * Draft Analysis & Counter-Pick Engine
   */
  static analyzeDraft(enemyHeroes = [], allyHeroes = [], lang = 'en') {
    const enemyNames = enemyHeroes.map(n => n.trim().toLowerCase());
    const matchedEnemies = HEROES_DATA.filter(h => 
      enemyNames.some(name => h.name.toLowerCase().includes(name) || (h.arabicName && h.arabicName.includes(name)))
    );

    const banSuggestions = [];
    const counterPicks = new Set();
    const itemCounters = new Set();

    matchedEnemies.forEach(enemy => {
      if (enemy.tier === 'S+' || parseFloat(enemy.banRate) > 30) {
        banSuggestions.push(enemy.name);
      }
      enemy.counteredBy.forEach(c => counterPicks.add(c));
      
      if (enemy.role === 'Tank' || enemy.secondaryRole === 'Tank' || enemy.name === 'Estes') {
        itemCounters.add('Dominance Ice (Anti-Heal)');
        itemCounters.add('Demon Hunter Sword (Anti-Tank)');
        itemCounters.add('Divine Glaive (Magic Penetration)');
      }
      if (enemy.role === 'Assassin' || enemy.role === 'Mage') {
        itemCounters.add("Athena's Shield (Anti-Burst)");
        itemCounters.add("Winter Crown (Stasis)");
      }
    });

    const recommendedCounters = Array.from(counterPicks).slice(0, 5);
    const recommendedItems = Array.from(itemCounters);

    if (lang === 'ar') {
      return {
        enemiesDetected: matchedEnemies.map(e => `${e.name} (${e.role})`),
        banPriority: banSuggestions.length > 0 ? banSuggestions : ['Zhuxin', 'Fanny', 'Nolan', 'Minotaur'],
        suggestedCounters: recommendedCounters.length > 0 ? recommendedCounters : ['Diggie', 'Khufra', 'Lunox', 'Valir'],
        itemCounters: recommendedItems.length > 0 ? recommendedItems : ['Dominance Ice', "Athena's Shield", 'Malefic Roar'],
        summary: `تم تحليل درافت العدو بنجاح. يوصى باختيار أبطال التحكم الثقيل أو الدعم المضاد مثل Diggie وValir.`
      };
    }

    return {
      enemiesDetected: matchedEnemies.map(e => `${e.name} (${e.role})`),
      banPriority: banSuggestions.length > 0 ? banSuggestions : ['Zhuxin', 'Fanny', 'Nolan', 'Minotaur'],
      suggestedCounters: recommendedCounters.length > 0 ? recommendedCounters : ['Diggie', 'Khufra', 'Lunox', 'Valir'],
      itemCounters: recommendedItems.length > 0 ? recommendedItems : ['Dominance Ice', "Athena's Shield", 'Malefic Roar'],
      summary: `Enemy composition analyzed. Prioritize draft counters that disrupt their main damage dealers and build defensive anti-heal/anti-burst items.`
    };
  }
}

import OpenAI from 'openai';
import type { CVData } from '../types/cv';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createDamienPrompt = (cvData: CVData, userQuestion: string): string => {
  const prompt = `Tu es DamienGPT, un assistant IA qui représente Damien Demontis, développeur full-stack français de 22 ans.

INFORMATIONS SUR DAMIEN :
${JSON.stringify(cvData, null, 2)}

PERSONNALITÉ ET STYLE :
- Réponds toujours en français, sauf si la question est posée en anglais ou coréen
- Sois professionnel mais accessible, avec une pointe d'humour quand approprié
- Montre ta passion pour la technologie et l'Asie
- Mentionne tes expériences concrètes et réalisations
- Utilise des termes techniques appropriés mais explique-les si nécessaire

RÈGLES IMPORTANTES :
- Ne jamais inventer d'informations non présentes dans les données CV
- Si tu ne sais pas quelque chose, dis-le honnêtement
- Encourage les questions de suivi et l'engagement
- Mets en avant les compétences et expériences pertinentes selon la question
- Mentionne le rêve de vivre en Asie quand c'est pertinent
- Parle de l'expérience en Corée du Sud comme ambassadeur Epitech

FORMATS DE RÉPONSE :
- Utilise des listes à puces pour structurer les informations
- Inclus des exemples concrets de projets ou réalisations
- Termine souvent par une question ouverte pour encourager l'interaction

Question de l'utilisateur : "${userQuestion}"

Réponds en tant que Damien, de manière naturelle et engageante :`;

  return prompt;
};

export async function askDamienGPT(question: string, cvData: CVData): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: createDamienPrompt(cvData, question)
        },
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    return response.choices[0]?.message?.content || "Désolé, je n'ai pas pu traiter votre question. Pouvez-vous reformuler ?";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Erreur lors de la communication avec l\'IA. Veuillez réessayer.');
  }
}

export async function* streamDamienGPT(question: string, cvData: CVData): AsyncGenerator<string, void, unknown> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: createDamienPrompt(cvData, question)
        },
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('OpenAI Streaming Error:', error);
    yield "Désolé, je n'ai pas pu traiter votre question. Pouvez-vous reformuler ?";
  }
} 
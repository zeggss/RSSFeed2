import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function classifyHeadlines(headlines: string[]) {
    const prompt = `For each news headline below:
1. Translate to English if needed.
2. Assign a normalized topic from: [Politics, Health, Technology, Sports, Business, Science, Entertainment, Environment, Crime, Conflict, Disaster, Other].
3. Extract a short event/topic phrase.
4. Identify main country/region and main entity/person if possible.

Return a JSON array with:
- original_headline
- translated_headline
- normalized_topic
- generalized_event
- region
- main_entity

Headlines:
${headlines.map((h, i) => `${i + 1}. "${h}"`).join('\n')}
Return only the JSON array.`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('OpenAI response content is null or undefined.');
    }
    const jsonStart = content.indexOf('[');
    try {
        const json = content.slice(jsonStart);
        return JSON.parse(json);
    } catch (e) {
        throw new Error('Failed to parse OpenAI response as JSON: ' + content);
    }
}
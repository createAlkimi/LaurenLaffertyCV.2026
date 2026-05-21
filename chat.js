export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { messages, system } = req.body;

  const openaiMessages = [
    { role: 'system', content: system },
    ...messages
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      messages: openaiMessages
    })
  });

  const data = await response.json();

  const reply = data.choices?.[0]?.message?.content || "I'm having trouble connecting right now. Please reach out to Lauren directly at Ltobin10@gmail.com.";

  res.status(200).json({ content: [{ text: reply }] });
}
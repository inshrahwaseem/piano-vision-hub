import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini client
const ai = new GoogleGenAI({});

app.post('/api/generate-chords', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    const systemPrompt = `You are an expert music theorist and composer.
The user will give you a mood, genre, or description.
Generate a beautiful, 4-chord progression that perfectly matches their prompt.
Format the output EXACTLY as a JSON array of 4 objects.
Each object must have 'chord' (string, e.g., 'Cmaj7'), 'notes' (array of strings, e.g., ['C4', 'E4', 'G4', 'B4']), and 'duration' (string, e.g., '2n').
Return ONLY the JSON array. Do not include markdown code blocks or any other text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\nPrompt: ' + prompt }] }
      ]
    });

    let result = response.text || '[]';
    // Clean up potential markdown formatting
    result = result.replace(/```json/g, '').replace(/```/g, '').trim();

    const chords = JSON.parse(result);
    res.json({ chords });
  } catch (error: any) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate chords. Please try again.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Piano Vision Hub server running on port ${port}`);
});

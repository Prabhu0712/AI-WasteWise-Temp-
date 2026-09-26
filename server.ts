import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware for parsing JSON with generous limit for image payloads
app.use(express.json({ limit: '25mb' }));

// Shared Gemini client setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-flash',
  });
});

// VLM Waste & Material Identification Endpoint
app.post('/api/analyze-waste', async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg', userNotes } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required (base64 string or data URL).' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured.',
      });
    }

    // Clean base64 data if prefixed with data:mime;base64,
    let base64Data = image;
    let resolvedMime = mimeType;

    if (image.startsWith('data:')) {
      const match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        resolvedMime = match[1];
        base64Data = match[2];
      } else {
        base64Data = image.split(',')[1] || image;
      }
    }

    const systemInstruction = `You are a high-precision, open-world Multimodal Vision-Language Model (VLM) specialized in waste classification, material science identification, and sustainable circular lifecycle analysis.

Your goal is to inspect any supplied visual scene or object and generate an authoritative, open-world identification of whatever is present. You are NOT restricted to standard municipal waste bins or a fixed closed-set vocabulary. You must capably identify:
- Everyday packaging: corrugated cardboard cartons, Tetra Paks, PET bottles, HDPE jugs, aluminum beverage cans, tin-plated steel food tins, glass bottles, expanded polystyrene foam (Styrofoam), LDPE films.
- Construction & Demolition (C&D) debris: concrete masonry chunks, rebar, asphalt shingles, gypsum drywall, treated lumber, ceramic tiles, PVC conduit, insulation fiberglass.
- Electronics & E-Waste: lithium-ion batteries, printed circuit boards (PCBs), consumer electronics, CRTs, peripheral cables, neodymium magnets.
- Textiles & Garments: natural fibers (cotton, wool, silk), synthetics (polyester, nylon, acrylic), footwear composites.
- Organics & Biomass: post-consumer food scraps, coffee grounds, compostable bioplastics (PLA/PHA), landscaping green waste.
- Household & Industrial Hazardous: paint cans, solvent bottles, aerosol canisters, mercury thermometers, motor oil filters.
- Composite & Unusual Objects: multi-material assemblies, rubber tires, medical/sanitary items, mixed debris piles.

Always provide meticulous, empirical visual reasoning:
- Detail optical clues (specular highlights vs matte finish, translucent refraction, surface micro-texture).
- Structural integrity (corrugation flutes, ductile denting vs brittle fractures, delamination, torn fibrous edges).
- Mold marks, seamlines, embossing, standard recycling resin identification codes (RIC 1-7), or label typography if discernible.
- Contamination state (grease saturation, oxidized rust, adhesive residues, concrete slurry).

Provide concrete, highly actionable recommendations for disposal, segregation of secondary components, and creative or industrial reuse/upcycling.`;

    const promptText = `Perform a comprehensive open-world material and waste identification on this image.
${userNotes ? `User supplementary context or question: "${userNotes}"` : ''}

Identify the primary object/material, secondary components, waste classification, detailed visual reasoning, step-by-step disposal procedures, and reuse/upcycling possibilities. Return strictly valid structured data matching the schema.`;

    const imagePart = {
      inlineData: {
        mimeType: resolvedMime,
        data: base64Data,
      },
    };

    const textPart = {
      text: promptText,
    };

    let response;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [imagePart, textPart],
          },
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                objectName: {
                  type: Type.STRING,
                  description: 'Precise, descriptive name of the primary identified item.',
                },
                material: {
                  type: Type.STRING,
                  description: 'Specific physical material or alloy.',
                },
                materialSubtype: {
                  type: Type.STRING,
                  description: 'Technical subcategory, resin code, grade, or industrial spec.',
                },
                wasteCategory: {
                  type: Type.STRING,
                  description: 'Primary broad waste category.',
                },
                confidenceScore: {
                  type: Type.INTEGER,
                  description: 'Confidence percentage of identification from 0 to 100.',
                },
                condition: {
                  type: Type.STRING,
                  description: 'Physical state and degradation.',
                },
                reasoning: {
                  type: Type.STRING,
                  description: 'In-depth perceptual visual reasoning detailing explicit visual clues: surface reflectivity, fluting, fracture patterns, seamlines, color fading, labeling, or structural indicators.',
                },
                disposalMethod: {
                  type: Type.STRING,
                  description: 'Best practice disposal channel.',
                },
                disposalSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Sequential, actionable instructions to prepare and dispose of the item properly.',
                },
                binColorCode: {
                  type: Type.STRING,
                  description: 'Standard municipal or industrial bin label/color.',
                },
                contaminationRisks: {
                  type: Type.STRING,
                  description: 'Critical hazards or recycling stream contamination risks to avoid.',
                },
                recyclabilityRating: {
                  type: Type.STRING,
                  description: 'Recyclability level rating.',
                },
                reuseAndUpcycling: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: 'Short project or application title' },
                      description: { type: Type.STRING, description: 'Practical instructions or explanation for reuse' },
                      difficulty: { type: Type.STRING, description: '"Beginner", "Intermediate", or "Industrial / Advanced"' },
                    },
                    required: ['title', 'description', 'difficulty'],
                  },
                  description: 'Practical, inspiring reuse or upcycling alternatives.',
                },
                secondaryComponents: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      componentName: { type: Type.STRING, description: 'Secondary part' },
                      material: { type: Type.STRING, description: 'Material of the secondary component' },
                      action: { type: Type.STRING, description: 'Separation instructions' },
                    },
                    required: ['componentName', 'material', 'action'],
                  },
                  description: 'Multi-material components, caps, labels, fasteners, or liners found on the item.',
                },
                environmentalImpact: {
                  type: Type.OBJECT,
                  properties: {
                    decompositionTime: { type: Type.STRING, description: 'Estimated natural decomposition timescale' },
                    carbonFootprintNote: { type: Type.STRING, description: 'Embodied carbon impact of manufacturing new vs recycling this material.' },
                    circularEconomyPotential: { type: Type.STRING, description: 'Closed-loop potential.' },
                  },
                  required: ['decompositionTime', 'carbonFootprintNote', 'circularEconomyPotential'],
                  description: 'Ecological lifecycle metrics and circular economy trajectory.',
                },
                summary: {
                  type: Type.STRING,
                  description: 'Concise 2-3 sentence executive synopsis of the object, material, and critical next step.',
                },
              },
              required: [
                'objectName',
                'material',
                'wasteCategory',
                'confidenceScore',
                'condition',
                'reasoning',
                'disposalMethod',
                'disposalSteps',
                'binColorCode',
                'contaminationRisks',
                'recyclabilityRating',
                'reuseAndUpcycling',
                'environmentalImpact',
                'summary',
              ],
            },
          },
        });

        if (response?.text) {
          break; // successfully got response
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[VLM Model] ${modelName} returned error: ${err.message}. Trying next candidate...`);
        // Brief pause before trying next model
        await new Promise((res) => setTimeout(res, 800));
      }
    }

    if (!response?.text) {
      throw lastError || new Error('VLM returned an empty text response.');
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error('VLM returned an empty text response.');
    }

    const parsedData = JSON.parse(responseText);
    res.json({
      success: true,
      data: parsedData,
      timestamp: new Date().toISOString(),
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error analyzing waste image:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze waste image with VLM.',
      details: error.toString(),
    });
  }
});

// Configure Vite middleware in development, or serve static build in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EcoLens VLM Server] Running on http://localhost:${PORT}`);
  });
}

startServer();

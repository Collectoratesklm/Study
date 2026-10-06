// app/api/syllabus/extract/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const partName = formData.get('partName') as string;

    if (!file) {
      return NextResponse.json({ error: 'No PDF provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            units: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  topics: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        name: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING },
                        subtopics: {
                          type: SchemaType.ARRAY,
                          items: { type: SchemaType.STRING }
                        },
                        importance: { type: SchemaType.INTEGER, description: '1 to 5' },
                        difficulty: { type: SchemaType.INTEGER, description: '1 to 5' },
                        estimatedStudyHours: { type: SchemaType.NUMBER }
                      },
                      required: ['name', 'subtopics', 'importance', 'difficulty', 'estimatedStudyHours']
                    }
                  }
                },
                required: ['name', 'topics']
              }
            }
          },
          required: ['units']
        }
      }
    });

    const prompt = `
      You are an expert examination syllabus parser. Read the attached syllabus PDF for examination part "${partName}".
      Deconstruct the content strictly into Units, Topics, and Subtopics.
      - Maintain domain-authentic names verbatim from the document.
      - Do not inject external subjects or unmentioned chapters.
      - Infer realistic difficulty (1-5), exam importance (1-5), and estimated study hours based on breadth.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type || 'application/pdf',
          data: base64Data
        }
      }
    ]);

    const extracted = JSON.parse(result.response.text());
    return NextResponse.json(extracted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Syllabus processing failed' }, { status: 500 });
  }
}
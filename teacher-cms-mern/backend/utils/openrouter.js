const axios = require('axios');

const generateQuestions = async (topic, numQuestions = 5, difficulty = 'medium', questionType = 'multiple_choice') => {
  try {
    const systemPrompt = `You are a quiz question generator. Generate educational quiz questions in JSON format. 
Each question should be an object with these fields:
- questionText: The question text
- questionType: "${questionType}"
- options: Array of 4 answer options (for multiple choice)
- correctAnswer: The correct answer
- explanation: Brief explanation of the answer
- difficulty: "${difficulty}"
- topic: "${topic}"

Return ONLY a valid JSON array of question objects, nothing else.`;

    const userPrompt = `Generate ${numQuestions} ${difficulty} ${questionType} questions about "${topic}". 
Each multiple choice question should have 4 distinct options. Make the questions educational and clear.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemma-2-9b-it:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Teacher CMS'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    const questions = parseAIResponse(aiResponse);
    
    return {
      success: true,
      questions: questions,
      raw: aiResponse
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
};

const parseAIResponse = (responseText) => {
  try {
    let jsonText = responseText.trim();
    
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const questions = JSON.parse(jsonText);
    
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }
    
    return questions.map(q => ({
      questionText: q.questionText || q.question || '',
      questionType: q.questionType || 'multiple_choice',
      options: q.options || [],
      correctAnswer: q.correctAnswer || q.answer || '',
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'medium',
      topic: q.topic || ''
    }));
  } catch (error) {
    console.error('Error parsing AI response:', error.message);
    return [];
  }
};

module.exports = { generateQuestions };

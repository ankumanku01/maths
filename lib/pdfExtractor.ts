// import pdf from 'pdf-parse';
import { readFile } from 'fs/promises';
import { join } from 'path';

export interface ExtractedPdfData {
  text: string;
  pages: number;
  questions?: Question[];
}

export interface Question {
  questionNumber: number;
  questionText: string;
  estimatedMarks: number;
  type: 'mcq' | 'descriptive' | 'short_answer' | 'true_false';
}

export async function extractTextFromPdf(filepath: string): Promise<ExtractedPdfData> {
  try {
    // For now, return mock data - implement actual PDF parsing later
    return {
      text: 'Sample extracted text from PDF',
      pages: 1,
      questions: []
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

function parseQuestionsFromText(text: string): Question[] {
  const questions: Question[] = [];
  
  // Common question patterns
  const questionPatterns = [
    /(\d+)\.\s*(.+?)(?=\n\d+\.|$)/g, // 1. Question text
    /Q(\d+)[\.\)]\s*(.+?)(?=\nQ\d+|$)/g, // Q1) Question text
    /Question\s*(\d+):\s*(.+?)(?=\nQuestion\s*\d+|$)/g, // Question 1: text
  ];

  let questionNumber = 1;

  for (const pattern of questionPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const questionText = match[2]?.trim();
      if (questionText && questionText.length > 10) {
        const question: Question = {
          questionNumber: parseInt(match[1]) || questionNumber++,
          questionText: questionText,
          estimatedMarks: estimateMarks(questionText),
          type: determineQuestionType(questionText)
        };

        questions.push(question);
      }
    }

    if (questions.length > 0) break; // Use first successful pattern
  }

  // If no structured questions found, try to split by common indicators
  if (questions.length === 0) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for lines that might be questions (end with ?, contain question words, etc.)
      if (isLikelyQuestion(line)) {
        const question: Question = {
          questionNumber: questionNumber++,
          questionText: line,
          estimatedMarks: estimateMarks(line),
          type: determineQuestionType(line)
        };
        
        questions.push(question);
      }
    }
  }

  return questions.slice(0, 50); // Limit to 50 questions max
}

function estimateMarks(questionText: string): number {
  const text = questionText.toLowerCase();
  
  // Look for explicit marks mentioned
  const marksMatch = text.match(/\((\d+)\s*marks?\)/);
  if (marksMatch) {
    return parseInt(marksMatch[1]);
  }
  
  // Estimate based on question characteristics
  if (text.includes('explain') || text.includes('describe') || text.includes('discuss')) {
    return 5; // Descriptive questions
  }
  
  if (text.includes('list') || text.includes('name') || text.includes('state')) {
    return 2; // Short answer questions
  }
  
  if (text.includes('true') || text.includes('false') || text.includes('yes') || text.includes('no')) {
    return 1; // True/false questions
  }
  
  if (text.includes('choose') || text.includes('select') || text.includes('tick')) {
    return 1; // MCQ questions
  }
  
  // Default based on length
  if (questionText.length > 200) return 10;
  if (questionText.length > 100) return 5;
  if (questionText.length > 50) return 2;
  
  return 1;
}

function determineQuestionType(questionText: string): Question['type'] {
  const text = questionText.toLowerCase();
  
  if (text.includes('true') && text.includes('false')) {
    return 'true_false';
  }
  
  if (text.includes('choose') || text.includes('select') || 
      text.includes('a)') || text.includes('b)') || text.includes('c)') || text.includes('d)')) {
    return 'mcq';
  }
  
  if (text.includes('list') || text.includes('name') || text.includes('state') || 
      text.includes('define') || text.length < 100) {
    return 'short_answer';
  }
  
  return 'descriptive';
}

function isLikelyQuestion(text: string): boolean {
  const questionIndicators = [
    '?', 'what', 'how', 'why', 'when', 'where', 'which', 'who',
    'explain', 'describe', 'discuss', 'analyze', 'compare', 'contrast',
    'list', 'name', 'state', 'define', 'identify', 'calculate',
    'solve', 'find', 'determine', 'evaluate', 'assess'
  ];
  
  const textLower = text.toLowerCase();
  
  // Must contain at least one question indicator
  const hasIndicator = questionIndicators.some(indicator => textLower.includes(indicator));
  
  // Must be of reasonable length (not too short, not too long)
  const reasonableLength = text.length >= 10 && text.length <= 1000;
  
  // Should not be just a heading or title
  const notHeading = !(/^(chapter|section|part|unit|lesson)\s*\d+/i.test(text));
  
  return hasIndicator && reasonableLength && notHeading;
}

export async function extractQuestionsFromTestPdf(filepath: string, expectedMarks?: number): Promise<Question[]> {
  try {
    const extracted = await extractTextFromPdf(filepath);
    let questions = extracted.questions || [];
    
    // If expected total marks is provided, try to adjust individual question marks
    if (expectedMarks && questions.length > 0) {
      const currentTotal = questions.reduce((sum, q) => sum + q.estimatedMarks, 0);
      
      if (currentTotal !== expectedMarks) {
        const ratio = expectedMarks / currentTotal;
        questions = questions.map(q => ({
          ...q,
          estimatedMarks: Math.max(1, Math.round(q.estimatedMarks * ratio))
        }));
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Question extraction error:', error);
    return [];
  }
}

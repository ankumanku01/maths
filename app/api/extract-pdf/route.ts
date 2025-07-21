import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { extractTextFromPdf, extractQuestionsFromTestPdf } from '@/lib/pdfExtractor';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filepath, type, expectedMarks } = await request.json();

    if (!filepath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    if (type === 'test') {
      // Extract questions for test PDFs
      const questions = await extractQuestionsFromTestPdf(filepath, expectedMarks);
      
      return NextResponse.json({
        success: true,
        questions,
        totalQuestions: questions.length,
        estimatedTotalMarks: questions.reduce((sum, q) => sum + q.estimatedMarks, 0)
      });
    } else {
      // Extract general text for lesson plans
      const extracted = await extractTextFromPdf(filepath);
      
      return NextResponse.json({
        success: true,
        text: extracted.text,
        pages: extracted.pages,
        wordCount: extracted.text.split(/\s+/).length
      });
    }

  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json({ 
      error: 'Failed to extract content from PDF. Please ensure the file is a valid PDF with readable text.' 
    }, { status: 500 });
  }
}

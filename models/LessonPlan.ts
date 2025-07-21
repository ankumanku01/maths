import mongoose from 'mongoose';

const LessonPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pdfFile: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.LessonPlan || mongoose.model('LessonPlan', LessonPlanSchema);

-- EduManage Database Schema for Supabase
-- Educational Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Admin, Teachers, Parents)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'parent')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL, -- School student ID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    section VARCHAR(10),
    date_of_birth DATE,
    photo_url TEXT,
    address TEXT,
    emergency_contact VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent-Student relationships (Many-to-Many)
CREATE TABLE parent_students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL, -- father, mother, guardian, etc.
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- Teacher-Student assignments (Many-to-Many)
CREATE TABLE teacher_students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100),
    academic_year VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, student_id, subject, academic_year)
);

-- Subjects table
CREATE TABLE subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    grade_level VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson Plans
CREATE TABLE lesson_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    grade VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20),
    lesson_date DATE,
    duration_minutes INTEGER,
    pdf_file_url TEXT,
    pdf_file_name VARCHAR(255),
    extracted_text TEXT,
    learning_objectives TEXT[],
    materials_needed TEXT[],
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests (Pre and Post)
CREATE TABLE tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lesson_plan_id UUID NOT NULL REFERENCES lesson_plans(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_type VARCHAR(10) NOT NULL CHECK (test_type IN ('pre', 'post')),
    pdf_file_url TEXT,
    pdf_file_name VARCHAR(255),
    extracted_text TEXT,
    total_marks INTEGER DEFAULT 0,
    duration_minutes INTEGER,
    instructions TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions within tests
CREATE TABLE questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'descriptive' CHECK (question_type IN ('mcq', 'descriptive', 'short_answer', 'true_false')),
    options JSONB, -- For MCQ options
    correct_answer TEXT, -- For MCQ correct answer
    marks INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id, question_number)
);

-- Student test results
CREATE TABLE student_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    total_marks INTEGER NOT NULL,
    obtained_marks DECIMAL(5,2) NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN total_marks > 0 THEN (obtained_marks * 100.0 / total_marks) ELSE 0 END) STORED,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'reviewed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, test_id)
);

-- Individual question answers
CREATE TABLE student_answers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_result_id UUID NOT NULL REFERENCES student_results(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    marks_obtained DECIMAL(4,2) DEFAULT 0,
    is_correct BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_result_id, question_id)
);

-- Messages between teachers and parents
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE, -- Optional: if message is about specific student
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    parent_message_id UUID REFERENCES messages(id), -- For threading/replies
    attachment_url TEXT,
    attachment_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- File uploads tracking
CREATE TABLE file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER,
    upload_purpose VARCHAR(50) NOT NULL, -- lesson_plan, test, student_photo, message_attachment
    reference_id UUID, -- ID of related record (lesson_plan_id, test_id, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student progress tracking
CREATE TABLE student_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    lesson_plan_id UUID REFERENCES lesson_plans(id) ON DELETE CASCADE,
    academic_year VARCHAR(20),
    grade VARCHAR(20),
    pre_test_score DECIMAL(5,2),
    post_test_score DECIMAL(5,2),
    improvement DECIMAL(5,2) GENERATED ALWAYS AS (COALESCE(post_test_score, 0) - COALESCE(pre_test_score, 0)) STORED,
    teacher_notes TEXT,
    parent_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- message, result, announcement, reminder
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- System settings and configurations
CREATE TABLE system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_parent_students_parent_id ON parent_students(parent_id);
CREATE INDEX idx_parent_students_student_id ON parent_students(student_id);
CREATE INDEX idx_teacher_students_teacher_id ON teacher_students(teacher_id);
CREATE INDEX idx_teacher_students_student_id ON teacher_students(student_id);
CREATE INDEX idx_lesson_plans_teacher_id ON lesson_plans(teacher_id);
CREATE INDEX idx_lesson_plans_grade ON lesson_plans(grade);
CREATE INDEX idx_tests_teacher_id ON tests(teacher_id);
CREATE INDEX idx_tests_lesson_plan_id ON tests(lesson_plan_id);
CREATE INDEX idx_student_results_student_id ON student_results(student_id);
CREATE INDEX idx_student_results_test_id ON student_results(test_id);
CREATE INDEX idx_messages_from_user_id ON messages(from_user_id);
CREATE INDEX idx_messages_to_user_id ON messages(to_user_id);
CREATE INDEX idx_messages_student_id ON messages(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic examples - adjust based on your specific requirements)

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Parents can only see their own students
CREATE POLICY "Parents see own students" ON parent_students FOR SELECT USING (
    parent_id::text = auth.uid()::text
);

-- Teachers can see students assigned to them
CREATE POLICY "Teachers see assigned students" ON teacher_students FOR SELECT USING (
    teacher_id::text = auth.uid()::text
);

-- Teachers can see/manage their own lesson plans
CREATE POLICY "Teachers manage own lesson plans" ON lesson_plans FOR ALL USING (
    teacher_id::text = auth.uid()::text
);

-- Initial data
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('academic_year', '2024-2025', 'Current academic year', true),
('app_name', 'EduManage', 'Application name', true),
('max_file_size_mb', '10', 'Maximum file upload size in MB', false),
('supported_file_types', 'pdf,jpg,jpeg,png', 'Supported file types for upload', false);

-- Insert sample subjects
INSERT INTO subjects (name, code, grade_level) VALUES
('Mathematics', 'MATH', 'Elementary'),
('English Language Arts', 'ELA', 'Elementary'),
('Science', 'SCI', 'Elementary'),
('Social Studies', 'SS', 'Elementary'),
('Art', 'ART', 'Elementary'),
('Physical Education', 'PE', 'Elementary');

import { supabase } from "./supabase";

export async function createCourse(data: {
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  instructor_id: string;
}) {
  try {
    const { data: course, error } = await supabase
      .from("courses")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return course;
  } catch (error) {
    console.error("Error creating course:", error);
    return null;
  }
}

export async function createModule(data: {
  course_id: string;
  title: string;
  order_index: number;
}) {
  try {
    const { data: module, error } = await supabase
      .from("modules")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return module;
  } catch (error) {
    console.error("Error creating module:", error);
    return null;
  }
}

export async function createLesson(data: {
  module_id: string;
  title: string;
  description?: string;
  video_url: string;
  duration?: string;
  order_index: number;
}) {
  try {
    const { data: lesson, error } = await supabase
      .from("lessons")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return lesson;
  } catch (error) {
    console.error("Error creating lesson:", error);
    return null;
  }
}

export async function getInstructorCourses(instructorId: string) {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        modules (
          *,
          lessons (*)
        )
      `)
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return [];
  }
}


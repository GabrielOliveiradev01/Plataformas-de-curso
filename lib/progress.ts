import { supabase } from "./supabase";

export async function getLessonProgress(userId: string, lessonId: string) {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
    return data;
  } catch (error) {
    console.error("Error fetching lesson progress:", error);
    return null;
  }
}

export async function markLessonAsCompleted(userId: string, lessonId: string) {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,lesson_id"
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    return null;
  }
}

export async function getCourseProgress(userId: string, courseId: string) {
  try {
    // Buscar todos os módulos do curso
    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("id")
      .eq("course_id", courseId);

    if (modulesError) throw modulesError;

    const moduleIds = modules?.map((m) => m.id) || [];

    if (moduleIds.length === 0) return { completed: 0, total: 0, percentage: 0 };

    // Buscar todas as aulas dos módulos
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id")
      .in("module_id", moduleIds);

    if (lessonsError) throw lessonsError;

    const lessonIds = lessons?.map((l) => l.id) || [];

    if (lessonIds.length === 0) return { completed: 0, total: 0, percentage: 0 };

    // Buscar progresso do usuário
    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("completed", true)
      .in("lesson_id", lessonIds);

    if (progressError) throw progressError;

    const completed = progress?.length || 0;
    const total = lessonIds.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return { completed: 0, total: 0, percentage: 0 };
  }
}

export async function getLessonsWithProgress(userId: string, moduleIds: string[]) {
  try {
    if (moduleIds.length === 0) return [];

    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("order_index", { ascending: true });

    if (lessonsError) throw lessonsError;

    const lessonIds = lessons?.map((l) => l.id) || [];

    if (lessonIds.length === 0) return [];

    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .select("lesson_id, completed")
      .eq("user_id", userId)
      .in("lesson_id", lessonIds);

    if (progressError) throw progressError;

    const progressMap = new Map(
      progress?.map((p: any) => [p.lesson_id, p.completed]) || []
    );

    return lessons?.map((lesson: any) => ({
      ...lesson,
      completed: progressMap.get(lesson.id) || false,
    })) || [];
  } catch (error) {
    console.error("Error fetching lessons with progress:", error);
    return [];
  }
}

export async function getUserCoursesWithProgress(userId: string) {
  try {
    // Buscar todos os progressos do usuário
    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId);

    if (progressError) throw progressError;

    if (!progress || progress.length === 0) return [];

    // Buscar as aulas que o usuário tem progresso
    const lessonIds = progress.map((p: any) => p.lesson_id);
    
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("module_id")
      .in("id", lessonIds);

    if (lessonsError) throw lessonsError;

    if (!lessons || lessons.length === 0) return [];

    // Buscar os módulos das aulas
    const moduleIds = [...new Set(lessons.map((l: any) => l.module_id))];
    
    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("course_id")
      .in("id", moduleIds);

    if (modulesError) throw modulesError;

    // Extrair IDs únicos de cursos
    const courseIds = [...new Set(modules?.map((m: any) => m.course_id).filter(Boolean))];

    if (courseIds.length === 0) return [];

    // Buscar os cursos
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .in("id", courseIds);

    if (coursesError) throw coursesError;

    // Para cada curso, calcular o progresso
    const coursesWithProgress = await Promise.all(
      (courses || []).map(async (course) => {
        const progressData = await getCourseProgress(userId, course.id);
        return {
          ...course,
          progress: progressData.percentage,
          completed: progressData.completed,
          total: progressData.total,
        };
      })
    );

    // Filtrar apenas cursos com progresso > 0 e ordenar por progresso (maior primeiro)
    return coursesWithProgress
      .filter((course: any) => course.progress > 0)
      .sort((a: any, b: any) => b.progress - a.progress);
  } catch (error) {
    console.error("Error fetching user courses with progress:", error);
    return [];
  }
}

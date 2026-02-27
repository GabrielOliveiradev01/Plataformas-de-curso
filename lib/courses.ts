import { supabase } from "./supabase";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  instructor_id: string;
  duration: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface LessonWithModule extends Lesson {
  module: {
    id: string;
    title: string;
    course_id: string;
  };
  course: {
    id: string;
    title: string;
    thumbnail_url: string | null;
  };
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export async function getCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function getCourseWithModules(courseId: string): Promise<CourseWithModules | null> {
  try {
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError) throw courseError;

    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (modulesError) throw modulesError;

    const modulesWithLessons = await Promise.all(
      (modules || []).map(async (module) => {
        const { data: lessons, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", module.id)
          .order("order_index", { ascending: true });

        if (lessonsError) throw lessonsError;

        return {
          ...module,
          lessons: lessons || [],
        };
      })
    );

    return {
      ...course,
      modules: modulesWithLessons,
    };
  } catch (error) {
    console.error("Error fetching course with modules:", error);
    return null;
  }
}

export async function getRandomLessons(limit: number = 8): Promise<LessonWithModule[]> {
  try {
    // Buscar todas as aulas
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("*")
      .limit(100); // Buscar mais para depois sortear

    if (lessonsError) throw lessonsError;

    if (!lessons || lessons.length === 0) return [];

    // Embaralhar e pegar apenas o limite
    const shuffled = lessons.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, limit);

    // Buscar informações dos módulos e cursos
    const lessonsWithDetails = await Promise.all(
      selected.map(async (lesson) => {
        const { data: module, error: moduleError } = await supabase
          .from("modules")
          .select("id, title, course_id")
          .eq("id", lesson.module_id)
          .single();

        if (moduleError) throw moduleError;

        const { data: course, error: courseError } = await supabase
          .from("courses")
          .select("id, title, thumbnail_url")
          .eq("id", module.course_id)
          .single();

        if (courseError) throw courseError;

        return {
          ...lesson,
          module: {
            id: module.id,
            title: module.title,
            course_id: module.course_id,
          },
          course: {
            id: course.id,
            title: course.title,
            thumbnail_url: course.thumbnail_url,
          },
        };
      })
    );

    return lessonsWithDetails;
  } catch (error) {
    console.error("Error fetching random lessons:", error);
    return [];
  }
}

export async function getRandomVideos(limit: number = 6): Promise<LessonWithModule[]> {
  try {
    // Buscar aulas que têm vídeo (video_url não vazio)
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("*")
      .not("video_url", "is", null)
      .neq("video_url", "")
      .limit(100); // Buscar mais para depois sortear

    if (lessonsError) throw lessonsError;

    if (!lessons || lessons.length === 0) return [];

    // Embaralhar e pegar apenas o limite
    const shuffled = lessons.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, limit);

    // Buscar informações dos módulos e cursos
    const lessonsWithDetails = await Promise.all(
      selected.map(async (lesson) => {
        const { data: module, error: moduleError } = await supabase
          .from("modules")
          .select("id, title, course_id")
          .eq("id", lesson.module_id)
          .single();

        if (moduleError) throw moduleError;

        const { data: course, error: courseError } = await supabase
          .from("courses")
          .select("id, title, thumbnail_url")
          .eq("id", module.course_id)
          .single();

        if (courseError) throw courseError;

        return {
          ...lesson,
          module: {
            id: module.id,
            title: module.title,
            course_id: module.course_id,
          },
          course: {
            id: course.id,
            title: course.title,
            thumbnail_url: course.thumbnail_url,
          },
        };
      })
    );

    return lessonsWithDetails;
  } catch (error) {
    console.error("Error fetching random videos:", error);
    return [];
  }
}

export async function getUserProgress(userId: string, courseId: string) {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*, lesson:lessons(*)")
      .eq("user_id", userId);

    if (error) throw error;

    // Filtrar progresso do curso específico
    const courseProgress = data?.filter((progress: any) => {
      return progress.lesson?.module_id && 
        supabase.from("modules").select("course_id").eq("id", progress.lesson.module_id);
    });

    return data || [];
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return [];
  }
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Clock, CheckCircle2, ChevronRight, ChevronDown, Play, ChevronLeft, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getCourseWithModules, type CourseWithModules } from "@/lib/courses";
import { getLessonsWithProgress, markLessonAsCompleted, getCourseProgress } from "@/lib/progress";
import { getProfile, type Profile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ModuleCard } from "@/components/module-card";
import { Card } from "@/components/ui/card";

interface LessonWithProgress {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string | null;
  order_index: number;
  completed: boolean;
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.id as string;
  const moduleParam = searchParams.get("module");
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [instructor, setInstructor] = useState<Profile | null>(null);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [lessonsWithProgress, setLessonsWithProgress] = useState<Map<string, LessonWithProgress[]>>(new Map());
  const [courseProgress, setCourseProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);
  };

  const loadCourse = async () => {
    try {
      setLoading(true);
      const courseData = await getCourseWithModules(courseId);
      if (!courseData) {
        router.push("/dashboard");
        return;
      }

      setCourse(courseData);

      // Carregar dados do instrutor
      const instructorData = await getProfile(courseData.instructor_id);
      setInstructor(instructorData);

      // Carregar progresso
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const moduleIds = courseData.modules.map((m) => m.id);
        const lessonsWithProgressData = await getLessonsWithProgress(currentUser.id, moduleIds);

        // Criar mapa de progresso por lesson_id
        const progressMap = new Map(
          lessonsWithProgressData.map((l: any) => [l.id, l.completed])
        );

        // Organizar por módulo usando as aulas do curso e adicionando progresso
        const lessonsMap = new Map<string, LessonWithProgress[]>();
        courseData.modules.forEach((module) => {
          const moduleLessons: LessonWithProgress[] = module.lessons.map((lesson) => ({
            ...lesson,
            completed: progressMap.get(lesson.id) || false,
          }));
          lessonsMap.set(module.id, moduleLessons);
        });
        setLessonsWithProgress(lessonsMap);

        // Progresso do curso
        const progress = await getCourseProgress(currentUser.id, courseId);
        setCourseProgress(progress);

        // Se há parâmetro de módulo na URL, abrir esse módulo
        if (moduleParam) {
          const module = courseData.modules.find((m) => m.id === moduleParam);
          if (module && module.lessons.length > 0) {
            setSelectedModule(moduleParam);
            setCurrentLesson(module.lessons[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (moduleId: string) => {
    if (!course) return;

    const module = course.modules.find((m) => m.id === moduleId);
    if (module && module.lessons.length > 0) {
      setSelectedModule(moduleId);
      setCurrentLesson(module.lessons[0].id);
      // Atualizar URL sem recarregar
      router.push(`/course/${courseId}?module=${moduleId}`, { scroll: false });
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!currentLesson || !user) return;

    await markLessonAsCompleted(user.id, currentLesson);
    await loadCourse(); // Recarregar para atualizar progresso
  };

  const getCurrentLessonData = () => {
    if (!course || !currentLesson) return null;

    for (const module of course.modules) {
      const lesson = module.lessons.find((l) => l.id === currentLesson);
      if (lesson) {
        const progress = lessonsWithProgress.get(module.id);
        const lessonWithProgress = progress?.find((l) => l.id === lesson.id);
        return {
          ...lesson,
          completed: lessonWithProgress?.completed || false,
        };
      }
    }
    return null;
  };

  const getNextLesson = () => {
    if (!course || !currentLesson || !selectedModule) return null;

    const module = course.modules.find((m) => m.id === selectedModule);
    if (!module) return null;

    const currentIndex = module.lessons.findIndex((l) => l.id === currentLesson);
    return module.lessons[currentIndex + 1] || null;
  };

  const getPreviousLesson = () => {
    if (!course || !currentLesson || !selectedModule) return null;

    const module = course.modules.find((m) => m.id === selectedModule);
    if (!module) return null;

    const currentIndex = module.lessons.findIndex((l) => l.id === currentLesson);
    return module.lessons[currentIndex - 1] || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return <div>Curso não encontrado</div>;
  }

  const currentLessonData = getCurrentLessonData();
  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();
  const selectedModuleData = selectedModule ? course.modules.find((m) => m.id === selectedModule) : null;

  return (
    <div className="space-y-6">
      {/* Header do Curso */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          {course.description && (
            <p className="text-muted-foreground text-lg">{course.description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {instructor && (
            <>
              <div className="flex items-center gap-2">
                {instructor.avatar_url ? (
                  <Image
                    src={instructor.avatar_url}
                    alt={instructor.name || "Instrutor"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {instructor.name?.charAt(0) || "I"}
                    </span>
                  </div>
                )}
                <span className="font-medium">{instructor.name || "Instrutor"}</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
            </>
          )}
          {course.duration && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso do Curso</span>
            <span className="font-medium">
              {courseProgress.completed} / {courseProgress.total} aulas
            </span>
          </div>
          <Progress value={courseProgress.percentage} className="h-3" />
        </div>
      </div>

      {/* Player de Vídeo (quando um módulo está selecionado) */}
      {selectedModule && currentLessonData && (
        <div className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
            <video
              key={currentLessonData.video_url}
              src={currentLessonData.video_url}
              controls
              className="w-full h-full"
              autoPlay
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentLessonData.title}</h2>
              {currentLessonData.description && (
                <p className="text-muted-foreground">{currentLessonData.description}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => previousLesson && setCurrentLesson(previousLesson.id)}
                disabled={!previousLesson}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Aula Anterior
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleMarkAsCompleted}
                disabled={!currentLessonData || currentLessonData.completed}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {currentLessonData.completed ? "Concluída" : "Marcar como Concluída"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => nextLesson && setCurrentLesson(nextLesson.id)}
                disabled={!nextLesson}
              >
                Próxima Aula
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Módulos */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Módulos do Curso</h2>
        
        {course.modules.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Este curso ainda não possui módulos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {course.modules.map((module) => {
              const moduleLessons = lessonsWithProgress.get(module.id) || [];
              const completedCount = moduleLessons.filter((l) => l.completed).length;
              const totalCount = moduleLessons.length;
              const moduleProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

              return (
                <ModuleCard
                  key={module.id}
                  module={{
                    ...module,
                    lessons: moduleLessons.length > 0 ? moduleLessons : module.lessons,
                  }}
                  onModuleClick={handleModuleClick}
                  progress={moduleProgress}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Lista de Aulas do Módulo Selecionado (Sidebar) */}
      {selectedModule && selectedModuleData && (
        <div className="mt-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">{selectedModuleData.title}</h3>
            <div className="space-y-2">
              {selectedModuleData.lessons.map((lesson) => {
                const progress = lessonsWithProgress.get(selectedModule);
                const lessonWithProgress = progress?.find((l) => l.id === lesson.id);
                const isActive = lesson.id === currentLesson;
                const isCompleted = lessonWithProgress?.completed || false;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-md text-left hover:bg-accent transition-colors",
                      isActive && "bg-primary/10 border border-primary/20"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <Play className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isActive && "text-primary"
                        )}
                      >
                        {lesson.title}
                      </p>
                      {lesson.duration && (
                        <p className="text-xs text-muted-foreground">
                          {lesson.duration}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BookOpen, Video, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createCourse, createModule, createLesson, getInstructorCourses } from "@/lib/instructor";
import { getCourseWithModules } from "@/lib/courses";

export default function InstructorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [saving, setSaving] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    thumbnail_url: "",
    duration: "",
  });

  const [moduleForm, setModuleForm] = useState({
    title: "",
  });

  const [lessonForm, setLessonForm] = useState({
    title: "",
    duration: "",
    video_url: "",
    description: "",
  });

  useEffect(() => {
    loadUserAndCourses();
  }, []);

  const loadUserAndCourses = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      setUser(currentUser);
      const instructorCourses = await getInstructorCourses(currentUser.id);
      setCourses(instructorCourses);
      if (instructorCourses.length > 0) {
        setCurrentCourse(instructorCourses[0]);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const course = await createCourse({
        title: courseForm.title,
        description: courseForm.description || undefined,
        thumbnail_url: courseForm.thumbnail_url || undefined,
        duration: courseForm.duration || undefined,
        instructor_id: user.id,
      });

      if (course) {
        setCourseForm({ title: "", description: "", thumbnail_url: "", duration: "" });
        setIsCreatingCourse(false);
        await loadUserAndCourses();
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Erro ao criar curso");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateModule = async () => {
    if (!currentCourse) return;

    setSaving(true);
    try {
      // Contar módulos existentes para order_index
      const moduleCount = currentCourse.modules?.length || 0;

      const createdModule = await createModule({
        course_id: currentCourse.id,
        title: moduleForm.title,
        order_index: moduleCount,
      });

      if (createdModule) {
        setModuleForm({ title: "" });
        setIsCreatingModule(false);
        await loadUserAndCourses();
      }
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Erro ao criar módulo");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLesson = async (moduleId: string) => {
    setSaving(true);
    try {
      // Buscar módulo completo para contar aulas
      const targetModule = currentCourse?.modules?.find((m: any) => m.id === moduleId);
      const lessonCount = targetModule?.lessons?.length || 0;

      const lesson = await createLesson({
        module_id: moduleId,
        title: lessonForm.title,
        description: lessonForm.description || undefined,
        video_url: lessonForm.video_url,
        duration: lessonForm.duration || undefined,
        order_index: lessonCount,
      });

      if (lesson) {
        setLessonForm({ title: "", duration: "", video_url: "", description: "" });
        setIsCreatingLesson(false);
        await loadUserAndCourses();
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      alert("Erro ao criar aula");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Área do Instrutor</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus cursos, módulos e aulas
          </p>
        </div>
        <Dialog open={isCreatingCourse} onOpenChange={setIsCreatingCourse}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Curso</DialogTitle>
              <DialogDescription>
                Preencha as informações do curso
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course-title">Título do Curso</Label>
                <Input
                  id="course-title"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  placeholder="Ex: React Avançado"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-description">Descrição</Label>
                <textarea
                  id="course-description"
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, description: e.target.value })
                  }
                  placeholder="Descreva o curso..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-thumbnail">URL da Thumbnail</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="course-thumbnail"
                    value={courseForm.thumbnail_url}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, thumbnail_url: e.target.value })
                    }
                    placeholder="https://..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-duration">Duração</Label>
                <Input
                  id="course-duration"
                  value={courseForm.duration}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, duration: e.target.value })
                  }
                  placeholder="Ex: 12h 30min"
                />
              </div>
              <Button onClick={handleCreateCourse} className="w-full" disabled={saving || !courseForm.title}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Curso"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Você ainda não criou nenhum curso
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs
          defaultValue={courses[0]?.id}
          value={currentCourse?.id}
          onValueChange={(value) => {
            const course = courses.find((c) => c.id === value);
            setCurrentCourse(course);
          }}
          className="space-y-4"
        >
          <TabsList>
            {courses.map((course) => (
              <TabsTrigger key={course.id} value={course.id}>
                {course.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {courses.map((course) => (
            <TabsContent key={course.id} value={course.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={isCreatingModule} onOpenChange={setIsCreatingModule}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Módulo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Módulo</DialogTitle>
                        <DialogDescription>
                          Adicione um novo módulo ao curso
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="module-title">Título do Módulo</Label>
                          <Input
                            id="module-title"
                            value={moduleForm.title}
                            onChange={(e) =>
                              setModuleForm({ ...moduleForm, title: e.target.value })
                            }
                            placeholder="Ex: Introdução"
                          />
                        </div>
                        <Button
                          onClick={handleCreateModule}
                          className="w-full"
                          disabled={saving || !moduleForm.title}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Criando...
                            </>
                          ) : (
                            "Criar Módulo"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-4">
                    {course.modules?.map((module: any) => (
                      <Card key={module.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Dialog
                            open={isCreatingLesson}
                            onOpenChange={setIsCreatingLesson}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Aula
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Criar Aula</DialogTitle>
                                <DialogDescription>
                                  Adicione uma nova aula ao módulo
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="lesson-title">Título da Aula</Label>
                                  <Input
                                    id="lesson-title"
                                    value={lessonForm.title}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        title: e.target.value,
                                      })
                                    }
                                    placeholder="Ex: Visão Geral"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="lesson-description">Descrição (Opcional)</Label>
                                  <textarea
                                    id="lesson-description"
                                    value={lessonForm.description}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="Descrição da aula..."
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="lesson-duration">Duração</Label>
                                  <Input
                                    id="lesson-duration"
                                    value={lessonForm.duration}
                                    onChange={(e) =>
                                      setLessonForm({
                                        ...lessonForm,
                                        duration: e.target.value,
                                      })
                                    }
                                    placeholder="Ex: 15min"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="lesson-video">URL do Vídeo *</Label>
                                  <div className="relative">
                                    <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                      id="lesson-video"
                                      value={lessonForm.video_url}
                                      onChange={(e) =>
                                        setLessonForm({
                                          ...lessonForm,
                                          video_url: e.target.value,
                                        })
                                      }
                                      placeholder="https://..."
                                      className="pl-10"
                                    />
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleCreateLesson(module.id)}
                                  className="w-full"
                                  disabled={saving || !lessonForm.title || !lessonForm.video_url}
                                >
                                  {saving ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Criando...
                                    </>
                                  ) : (
                                    "Criar Aula"
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <div className="space-y-2">
                            {module.lessons?.map((lesson: any) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">{lesson.title}</p>
                                  {lesson.duration && (
                                    <p className="text-sm text-muted-foreground">
                                      {lesson.duration}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {(!module.lessons || module.lessons.length === 0) && (
                              <p className="text-sm text-muted-foreground">
                                Nenhuma aula ainda
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!course.modules || course.modules.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum módulo ainda. Adicione o primeiro módulo!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

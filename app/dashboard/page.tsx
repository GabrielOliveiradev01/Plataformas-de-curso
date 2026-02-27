"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourses, getRandomLessons, getRandomVideos, type Course, type LessonWithModule } from "@/lib/courses";
import { motion } from "framer-motion";
import { BookOpen, PlayCircle, Video } from "lucide-react";
import Link from "next/link";
import { LessonCard } from "@/components/lesson-card";
import { VideoCard } from "@/components/video-card";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [randomLessons, setRandomLessons] = useState<LessonWithModule[]>([]);
  const [randomVideos, setRandomVideos] = useState<LessonWithModule[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, lessonsData, videosData] = await Promise.all([
        getCourses(),
        getRandomLessons(8),
        getRandomVideos(6),
      ]);

      setCourses(coursesData);
      setRandomLessons(lessonsData);
      setRandomVideos(videosData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold">
          Dashboard
        </motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground text-lg">
          Explore módulos e continue aprendendo
        </motion.p>
      </motion.div>

      {/* Aulas Aleatórias */}
      {randomLessons.length > 0 && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold">
            Aulas em Destaque
          </motion.h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {randomLessons.map((lesson) => (
                <motion.div key={lesson.id} variants={itemVariants}>
                  <LessonCard lesson={lesson} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>
      )}

      {/* Vídeos Aleatórios */}
      {randomVideos.length > 0 && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <motion.h2 variants={itemVariants} className="text-3xl font-bold">
              Vídeos Recomendados
            </motion.h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {randomVideos.map((lesson) => (
                <motion.div key={lesson.id} variants={itemVariants}>
                  <VideoCard lesson={lesson} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>
      )}

      {/* Cursos Disponíveis */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold">
          Cursos Disponíveis
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-lg" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum curso disponível ainda
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {courses.map((course) => (
              <motion.div key={course.id} variants={itemVariants}>
                <Link href={`/course/${course.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-card border border-border transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <PlayCircle className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                      {course.duration && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {course.duration}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}

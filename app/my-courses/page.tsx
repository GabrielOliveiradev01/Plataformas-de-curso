"use client";

import { useState, useEffect } from "react";
import { MyCourseCard } from "@/components/my-course-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserCoursesWithProgress } from "@/lib/progress";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";

export default function MyCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const myCourses = await getUserCoursesWithProgress(user.id);
      setCourses(myCourses);
    } catch (error) {
      console.error("Error loading my courses:", error);
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
    <div className="space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold">
          Meus Cursos
        </motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground mt-2">
          Continue de onde parou
        </motion.p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-lg" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 border border-border rounded-lg"
        >
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Você ainda não começou nenhum curso
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Acesse o Dashboard para começar a aprender
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {courses.map((course) => (
            <motion.div key={course.id} variants={itemVariants}>
              <MyCourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface MyCourseCardProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    duration: string | null;
    progress: number;
    completed: number;
    total: number;
  };
}

export function MyCourseCard({ course }: MyCourseCardProps) {
  return (
    <Link href={`/course/${course.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group cursor-pointer"
      >
        <Card className="overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
          <div className="relative aspect-video w-full overflow-hidden">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <PlayCircle className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <motion.div
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                className="rounded-full bg-primary/90 p-4 backdrop-blur-sm"
              >
                <PlayCircle className="h-12 w-12 text-primary-foreground" />
              </motion.div>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              {course.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {course.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              {course.duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {course.completed} / {course.total} aulas
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span className="font-semibold text-primary">{Math.round(course.progress)}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}


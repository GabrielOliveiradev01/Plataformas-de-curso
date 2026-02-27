"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, User, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Course } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

export function CourseCard({ course, showProgress = false }: CourseCardProps) {
  return (
    <Link href={`/course/${course.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group cursor-pointer"
      >
        <Card className="overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
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
            {course.isFree && (
              <div className="absolute top-2 right-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Grátis
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{course.instructor}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              {!course.isFree && (
                <span className="font-semibold text-primary">
                  R$ {course.price.toFixed(2)}
                </span>
              )}
            </div>
            
            {showProgress && course.progress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progresso</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}


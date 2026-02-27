"use client";

import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LessonWithModule } from "@/lib/courses";

interface VideoCardProps {
  lesson: LessonWithModule;
}

export function VideoCard({ lesson }: VideoCardProps) {
  return (
    <Link href={`/course/${lesson.course.id}?lesson=${lesson.id}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="group cursor-pointer"
      >
        <Card className="overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <PlayCircle className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {lesson.course.title}
                </p>
                {lesson.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {lesson.description}
                  </p>
                )}
              </div>
            </div>
            
            {lesson.duration && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration}</span>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

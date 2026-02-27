"use client";

import { BookOpen, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ModuleCardProps {
  module: {
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      completed?: boolean;
    }>;
  };
  onModuleClick: (moduleId: string) => void;
  progress?: number;
}

export function ModuleCard({ module, onModuleClick, progress = 0 }: ModuleCardProps) {
  const totalLessons = module.lessons.length;
  const completedLessons = module.lessons.filter((l) => l.completed).length;
  const moduleProgress = progress > 0 ? progress : (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onModuleClick(module.id)}
      className="group cursor-pointer"
    >
      <Card className="overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 h-full">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {totalLessons} {totalLessons === 1 ? "aula" : "aulas"}
              </p>
            </div>
          </div>
          
          {totalLessons > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progresso</span>
                <span>{Math.round(moduleProgress)}%</span>
              </div>
              <Progress value={moduleProgress} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <div className="flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="h-4 w-4" />
              <span>Assistir</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

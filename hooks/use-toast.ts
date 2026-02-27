import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState<{
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
  } | null>(null);

  const showToast = useCallback(
    (title: string, description?: string, variant: "default" | "destructive" = "default") => {
      setToast({ title, description, variant });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  return { toast, showToast };
}


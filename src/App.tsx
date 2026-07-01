import { RouterProvider } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { router } from "@/router";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  useTheme();
  return (
    <TooltipProvider delayDuration={150}>
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}
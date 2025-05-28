import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/common";

function Marked({ className, value }: { className?: string; value: number }) {
  return (
    <Badge
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center bg-purple-600",
        className
      )}
    >
      {value}
    </Badge>
  );
}

export default Marked;

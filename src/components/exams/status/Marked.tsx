import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function Marked({ className, value }: { className?: string; value: number }) {
  return (
    <Badge
      className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center bg-purple-600",
        className
      )}
    >
      {value}
    </Badge>
  );
}

export default Marked;

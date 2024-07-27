import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function Answered({ className, value }: { className?: string; value: number }) {
  return (
    <Badge
      className={cn(
        "w-7 h-7 rounded-none rounded-t-full flex items-center justify-center bg-green-600",
        className
      )}
    >
      {value}
    </Badge>
  );
}

export default Answered;

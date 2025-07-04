import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/common";

function Answered({ className, value }: { className?: string; value: number }) {
  return (
    <Badge
      className={cn(
        "w-8 h-8 rounded-none rounded-t-full flex items-center justify-center bg-green-600",
        className
      )}
    >
      {value}
    </Badge>
  );
}

export default Answered;

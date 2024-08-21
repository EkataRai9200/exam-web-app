import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function NotVisited({
  className,
  value,
}: {
  className?: string;
  value: number;
}) {
  return (
    <Badge
      className={cn(
        "w-8 h-8 rounded-none flex items-center justify-center bg-white border border-gray-400 text-dark",
        className
      )}
    >
      {value}
    </Badge>
  );
}

export default NotVisited;

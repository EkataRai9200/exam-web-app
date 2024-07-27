import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function NotAnswered({
  className,
  value,
}: {
  className?: string;
  value: number;
}) {
  return (
    <Badge
      className={cn(
        "w-7 h-7 rounded-none rounded-b-full flex items-center justify-center bg-red-600",
        className
      )}
    >
      {value}
    </Badge>
  );
}

export default NotAnswered;

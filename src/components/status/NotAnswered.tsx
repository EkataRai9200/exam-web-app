import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/common";

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
        "w-8 h-8 rounded-none rounded-b-full flex items-center justify-center bg-red-600",
        className
      )}
    >
      {value}
    </Badge>
  );
}

export default NotAnswered;

import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/common";
import { Check } from "lucide-react";

function MarkedAnswered({
  className,
  value,
}: {
  className?: string;
  value?: number;
}) {
  return (
    <Badge
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center bg-purple-600 relative",
        className
      )}
    >
      {value}
      <span className="bg-green-700 w-3 h-3 flex items-center justify-center rounded-full right-[-5px] bottom-[-3px] absolute">
        <Check size={8} />
      </span>
    </Badge>
  );
}

export default MarkedAnswered;

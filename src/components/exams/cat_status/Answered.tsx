import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function Answered({
  className,
  value,
  size = "md",
}: {
  className?: string;
  value: number;
  size?: "md" | "lg";
}) {
  return (
    <Badge
      className={cn(
        "w-8 h-8 rounded-none flex items-center justify-center",
        className,
        size == "lg" ? "w-[51px] h-[43px]" : ""
      )}
      style={{
        background: `url("http://g06.tcsion.com/OnlineAssessment/images/questions-sprite.png") repeat scroll rgba(0, 0, 0, 0)`,
        backgroundPosition: size == "md" ? `-7px -55px` : `-4px -5px`,
      }}
    >
      {value}
    </Badge>
  );
}

export default Answered;

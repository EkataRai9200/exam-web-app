import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function MarkedAnswered({
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
        "w-8 h-8 rounded-none flex items-center justify-center relative",
        className,
        size == "lg" ? "w-[50px] h-[53px]" : ""
      )}
      style={{
        background: `url("http://g06.tcsion.com/OnlineAssessment/images/questions-sprite.png") repeat scroll rgba(0, 0, 0, 0)`,
        backgroundPosition: size == "md" ? `-9px -87px` : `-66px -178px`,
      }}
    >
      {value}
    </Badge>
  );
}

export default MarkedAnswered;

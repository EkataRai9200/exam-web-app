import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function NotAnswered({
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
        size == "lg" ? "w-[50px] h-[43px]" : ""
      )}
      style={{
        background:
          size == "md"
            ? `url("https://tutorops.thinkexam.com/admin/web/views/test/testpages/cattestpage/images/buttons-sprite.png") -35px -1px repeat scroll rgba(0, 0, 0, 0)`
            : `url("http://g06.tcsion.com/OnlineAssessment/images/questions-sprite.png") -57px -6px repeat scroll rgba(0, 0, 0, 0)`,
      }}
    >
      {value}
    </Badge>
  );
}

export default NotAnswered;

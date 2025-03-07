import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function NotVisited({
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
        "w-8 h-8 rounded-none flex items-center justify-center text-dark font-normal",
        className,
        size == "lg" ? "w-[50px] h-[43px]" : ""
      )}
      style={{
        background:
          size == "md"
            ? `url("https://tutorops.thinkexam.com/admin/web/views/test/testpages/cattestpage/images/buttons-sprite.png") -35px -70px repeat scroll rgba(0, 0, 0, 0)`
            : `url("http://g06.tcsion.com/OnlineAssessment/images/questions-sprite.png") -158px -5px repeat scroll rgba(0, 0, 0, 0)`,
      }}
    >
      {value}
    </Badge>
  );
}

export default NotVisited;

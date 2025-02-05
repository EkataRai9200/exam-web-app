import { Button } from "@/components/ui/button";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { GripVertical, X } from "lucide-react";
import React from "react";

function CalculatorBlock() {
  const { examData, dispatch } = useExamData();
  const [_value, setValue] = React.useState("");
  const [position, setPosition] = React.useState({
    x: 0,
    y: window.innerHeight - 400,
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = React.useState(window.innerHeight);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={cn(
        "fixed max-w-full left-0 bottom-0 md:bottom-auto top-auto md:top-[27%] right-0 z-20",
        examData.studentExamState.showCalculator ? "block" : "hidden",
        examData.is_calc_allow == "1" ? "w-[490px]" : "w-[240px]"
      )}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <div className="absolute flex gap-2 top-0 right-[30px]" style={{}}>
        {windowWidth >= 640 && (
          <Button
            className="cursor-move rounded-none text-xs bg-red-600 hover:bg-red-700 h-9"
            style={{ marginTop: "2px" }}
            size={"icon"}
            onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleMouseDown(e)
            }
          >
            <GripVertical size={16} />
          </Button>
        )}
        <Button
          className="rounded-none text-xs bg-red-600 hover:bg-red-700 h-9"
          variant={"destructive"}
          style={{ marginTop: "2px" }}
          size={"icon"}
          onClick={() => {
            setValue("");
            dispatch({
              type: "showHideCalculator",
              payload: false,
            });
          }}
        >
          <X size={16} />
        </Button>
      </div>

      <div>
        <iframe
          className="w-full"
          src={`http://${examData.authUser?.institute_url}/calculator.html?version=${examData.is_calc_allow}`}
          height={370}
        ></iframe>
      </div>
    </div>
  );
}

export default CalculatorBlock;

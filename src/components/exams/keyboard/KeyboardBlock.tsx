import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React from "react";
import Keyboard from "react-simple-keyboard";

function KeyboardBlock() {
  const { examData, dispatch } = useExamData();
  const [value, setValue] = React.useState("");
  const keyboard = React.useRef<any>(null);
  return (
    <div
      className={cn(
        "fixed max-w-full w-[700px] md:bottom-[15%] md:right-[50px] z-20 bg-gray-300 p-5",
        examData.studentExamState.showKeyboard ? "block" : "hidden"
      )}
    >
      <Button
        className="absolute top-0 right-0 text-xs"
        variant={"destructive"}
        size={"sm"}
        onClick={() => {
          setValue("");
          dispatch({
            type: "showHideKeyboard",
            payload: false,
          });
        }}
      >
        close
      </Button>
      <div className="p-2">
        <Input
          type="text"
          value={value}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            setValue(e.target.value);
            keyboard.current.setInput(e.target.value);
          }}
        />
      </div>
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        theme="hg-theme-default"
        onChange={(input) => {
          setValue(input);
        }}
        onKeyPress={() => {}}
      />
    </div>
  );
}

export default KeyboardBlock;

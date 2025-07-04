import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ExamDrawerContent from "./examDrawerContent";
import React from "react";

export function ExamDrawer({
  setShowQuestionPaper,
  setShowInstructions,
}: {
  setShowQuestionPaper: any;
  setShowInstructions: any;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="visible md:hidden bg-gray-800 w-8 h-8"
        >
          <Menu size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto h-screen w-full md:w-1/4 relative">
          <ExamDrawerContent
            setShowQuestionPaper={setShowQuestionPaper}
            setShowInstructions={setShowInstructions}
            setOpenDrawer={setOpen}
          />
          <DrawerClose asChild>
            <Button
              variant={"default"}
              size={"icon"}
              className="absolute right-3 top-3 w-8 h-8"
            >
              <X size={12} />
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

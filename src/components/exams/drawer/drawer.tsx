import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ExamDrawerContent from "./examDrawerContent";

export function ExamDrawer() {
  const [searchParams] = useSearchParams();

  return (
    <Drawer direction="right">
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
          <ExamDrawerContent />
          <DrawerFooter>
            <Button className="bg-green-600" asChild>
              <Link
                to={{ pathname: "/submit", search: searchParams.toString() }}
              >
                Submit Exam
              </Link>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
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

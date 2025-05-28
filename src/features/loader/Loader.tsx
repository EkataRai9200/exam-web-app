import { cn } from "@/utils/common";
import Spinner from "../../components/ui/spinner";

export function Loader({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 left-0 right-0 w-full h-screen bg-gray-100 flex items-center justify-center z-10 bg-opacity-80",
        visible ? "visible" : "hidden"
      )}
    >
      <Spinner size={60} />
    </div>
  );
}

export default Loader;

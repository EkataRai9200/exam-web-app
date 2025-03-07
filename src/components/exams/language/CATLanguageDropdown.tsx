import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamLanguage } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Renders a dropdown component for selecting a language.
 *
 * @return {JSX.Element} The rendered   CATLanguageDropdown component.
 */
export function   CATLanguageDropdown({ className }: { className?: string }) {
  const { examData, dispatch } = useExamData();

  const activeLang = examData.studentExamState.activeLang;

  const changeLang = (lang: ExamLanguage) => {
    dispatch({
      type: "setActiveLang",
      payload: lang,
    });
  };

  const handleLanguageChange = (newLanguage: ExamLanguage) => {
    changeLang(newLanguage);
  };

  return (
    <Select value={activeLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className={cn("w-auto h-7", className)}>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Language</SelectLabel> */}
          {examData.available_languages.map((v, i) => (
            <SelectItem key={"lang_key_" + i} value={v}>
              {v == "HI" ? examData.test_second_language : ExamLanguage[v]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

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

/**
 * Renders a dropdown component for selecting a language.
 *
 * @return {JSX.Element} The rendered LanguageDropdown component.
 */
export function LanguageDropdown() {
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
      <SelectTrigger className="w-full h-7">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Language</SelectLabel> */}
          {examData.available_languages.map((v, i) => (
            <SelectItem key={"lang_key_" + i} value={v}>
              {ExamLanguage[v]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

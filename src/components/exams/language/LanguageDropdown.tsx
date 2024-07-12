import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamLanguage } from "@/context/ExamContext";
import { useExamData } from "@/lib/hooks";
import { useEffect, useState } from "react";

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
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          {examData.available_languages.map((v) => (
            <SelectItem value={v}>{ExamLanguage[v]}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

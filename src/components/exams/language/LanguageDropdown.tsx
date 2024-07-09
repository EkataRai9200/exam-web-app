import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExamData } from "@/lib/hooks";
import { useEffect, useState } from "react";
/**
 * Renders a dropdown component for selecting a language.
 *
 * @return {JSX.Element} The rendered LanguageDropdown component.
 */
export function LanguageDropdown() {
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const { examData } = useExamData();

  useEffect(() => {
    setSelectedLanguage(examData.lang == "EN" ? "english" : "hindi");
  }, [examData]);

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
  };

  return (
    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="hindi">Hindi</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

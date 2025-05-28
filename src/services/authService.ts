import { ExamTokenData } from "@/types/exams/ExamToken";
import { jwtDecode } from "jwt-decode";

export const generateWebTestToken = async (token: string | null) => {
  if (!token || token.length <= 0) {
    throw new Error("Invalid token");
  }

  const decoded = jwtDecode(token as string) as ExamTokenData;

  const data = await fetch(
    `${decoded.api_url}/generateTestTokenForStudentInternal/${decoded.test_id}?token=${token}`
  );

  const json = await data.json();
  if (!json.status || !json.data || json.status === false) {
    throw new Error("Invalid token");
  }

  return { ...json.data, ...decoded };
};

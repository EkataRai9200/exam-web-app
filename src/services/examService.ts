import { ExamTokenData } from "@/types/exams/ExamToken";
import { jwtDecode } from "jwt-decode";

export const fetchTestDetails = async (
  token: string | null,
  webtesttoken: string
) => {
  if (!token || token.length <= 0) {
    throw new Error("Invalid token");
  }

  const decoded = jwtDecode(token as string) as ExamTokenData;

  const examReq = await fetch(
    `${decoded.api_url}/get-test-details/${decoded.package_id}/${
      decoded.test_series_id
    }/${decoded.test_id}/${
      decoded.is_preview ? "preview" : "undefined"
    }?webtesttoken=${webtesttoken}`
  );

  const examData = await examReq.json();

  if (!examData.data) {
    throw new Error(examData.msg);
  }

  return examData.data;
};

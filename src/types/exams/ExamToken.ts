export interface ExamTokenData {
  sub: Record<string, any>;
  name: string;
  iat: number;
  institute_id: string;
  institute_url: string;
  package_id: string;
  test_series_id: string;
  test_id: string;
  student_token: string;
}

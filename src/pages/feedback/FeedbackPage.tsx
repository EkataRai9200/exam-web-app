import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useExamData } from "@/lib/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";

export function CardWithForm() {
  const { examData } = useExamData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (!examData.test_name || examData.test_name == "") {
      navigate({
        pathname: "/start",
        search: searchParams.toString(),
      });
    }
  }, []);

  const [FormData, setFormData] = React.useState<{
    question_level: number;
    difficulty_level: number;
    techlevel: number;
    technical_level: number;
    suggestion: string;
  }>({
    question_level: 5,
    difficulty_level: 5,
    techlevel: 5,
    technical_level: 5,
    suggestion: "",
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    await fetch(`${examData.authUser?.api_url}/save-feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback: FormData,
        test_id: examData._id.$oid,
        webtesttoken: examData.authUser?.webtesttoken,
      }),
    });
    if (typeof (window as any).Android != "undefined") {
      (window as any).Android.testCompletedCallback();
    } else {
      if (examData.featured == "1") {
        alert("Thank You for your feedback. Test Result is not yet Published");
        window.location.href =
          "http://" + examData.authUser?.institute_url + "/student/reports";
      } else {
        alert("Thank You for your feedback.");
        window.location.href =
          "http://" +
          examData.authUser?.institute_url +
          "/student/reports/view-report/" +
          examData._id.$oid;
      }
    }
  };

  return (
    <Card className="w-[600px] max-w-full">
      <CardHeader>
        <CardTitle>Give Your Valuable Feedback on this test </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-row items-center justify-center space-y-3.5 bg-gray-100/60 px-5 py-5">
              <Label htmlFor="name" className="text-sm font-bold pe-2 w-2/4">
                Question Level
              </Label>
              <Slider
                className="!mt-0"
                onValueChange={(n) =>
                  setFormData({ ...FormData, question_level: n[0] })
                }
                defaultValue={[5]}
                max={10}
                step={1}
              />
            </div>
            <div className="flex flex-row items-center space-y-3.5 bg-gray-100/60 px-5 py-5">
              <Label htmlFor="name" className="text-sm font-bold pe-2 w-2/4">
                Difficulty Level
              </Label>
              <Slider
                className="!mt-0"
                onValueChange={(n) =>
                  setFormData({ ...FormData, difficulty_level: n[0] })
                }
                defaultValue={[5]}
                max={10}
                step={1}
              />
            </div>
            <div className="flex flex-row items-center space-y-3.5 bg-gray-100/60 px-5 py-5">
              <Label htmlFor="name" className="text-sm font-bold pe-2 w-2/4">
                Technical Level
              </Label>
              <Slider
                className="!mt-0"
                onValueChange={(n) =>
                  setFormData({
                    ...FormData,
                    techlevel: n[0],
                    technical_level: n[0],
                  })
                }
                defaultValue={[5]}
                max={10}
                step={1}
              />
            </div>
            <div className="flex flex-col text-start space-y-3.5 bg-gray-100/60 px-5 py-5">
              <Label htmlFor="name" className="text-sm font-bold pe-2 w-2/4">
                Suggestions for improvement
              </Label>
              <Textarea
                onChange={(e) =>
                  setFormData({ ...FormData, suggestion: e.target.value })
                }
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex">
        <Button onClick={handleSubmit} className="w-full">
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}

function FeedbackPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen justify-center items-center">
      <CardWithForm />
    </div>
  );
}

export default FeedbackPage;

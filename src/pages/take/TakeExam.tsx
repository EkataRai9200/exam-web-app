import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  CheckCircleIcon,
  Delete,
  Flag,
  FlagOff,
  Menu,
  ShieldQuestionIcon,
  Timer,
  Trash,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Minus, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

export function DrawerDemo() {
  const [goal, setGoal] = React.useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  const answered = [2, 5, 10, 100, 50, 24, 45, 23, 67, 4, 34, 9, 8];
  const marked_for_review = [7, 4, 9, 12, 15, 66, 78, 55];

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto h-screen w-full relative">
          <div className="flex flex-row gap-2 justify-center items-center p-2 bg-gray-100">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="font-medium">Raman Singh</p>
          </div>
          <DrawerHeader>
            <DrawerTitle>Question Pallete</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <DrawerClose asChild>
            <Button
              variant={"secondary"}
              size={"sm"}
              className="bg-gray-200 absolute right-2 top-2"
            >
              <X size={15} />
            </Button>
          </DrawerClose>
          <div className="flex max-w-full overflow-x-auto gap-2 p-2 bg-gray-100">
            <Button variant={"default"}>Test 1</Button>
            <Button variant={"outline"}>Test 2</Button>
            <Button variant={"outline"}>Test 3</Button>
          </div>
          <div className="p-3 pb-0 grid grid-cols-6 gap-2 mb-5 h-[50vh] overflow-y-auto">
            {Array.from({ length: 100 }, (_, index) => index).map((v, i) => {
              const sel =
                answered.filter((a) => a == i).length > 0 ? "yes" : "no";
              const selmarked =
                marked_for_review.filter((a) => a == i).length > 0
                  ? "yes"
                  : "no";
              return (
                <div className="flex items-center justify-center cursor-pointer">
                  <div
                    className={cn(
                      "bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center",
                      sel == "yes" ? "bg-green-500 text-white" : "",
                      selmarked == "yes" ? "bg-yellow-500 text-white" : ""
                    )}
                  >
                    {i + 1}
                  </div>
                </div>
              );
            })}
          </div>
          <DrawerFooter>
            <Button className="bg-green-600">Submit Exam</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function MCQOption() {
  const [ans, setAns] = React.useState<number | undefined>(undefined);

  return (
    <>
      {["", "", "", ""].map((v, i) => {
        const status = i == ans ? "answered" : "pending";
        return (
          <div
            className={cn(
              "w-full bg-white border rounded-lg p-2 flex items-center gap-2 cursor-pointer relative",
              status == "pending" ? "bg-white" : "",
              status == "answered" ? "bg-blue-100" : ""
            )}
            onClick={() => {
              setAns(i);
            }}
          >
            <div
              className={cn(
                "border w-10 h-10 flex items-center justify-center text-center rounded-full",
                status == "answered" ? "bg-blue-400 text-white" : ""
              )}
            >
              {String.fromCharCode(65 + i)}
            </div>
            <div>Option {i + 1}</div>
            {/* <CheckCircle size={15} className="absolute right-5 text-blue-400" /> */}
          </div>
        );
      })}
    </>
  );
}

export function CardWithForm() {
  const [isMarked, setIsMarked] = React.useState(false);
  const [isAnswered, setIsAnswered] = React.useState(true);

  return (
    <Card className="w-full">
      <CardHeader className="relative">
        <CardDescription>
          <div className="flex justify-between items-center">
            <p>Question 1</p>
          </div>
          <div>
            {isMarked ? (
              <p className="text-yellow-600 mt-2 italic font-medium">
                Question is Marked for review
              </p>
            ) : (
              ""
            )}
          </div>
        </CardDescription>
        <div className="absolute right-3 top-1 flex items-center gap-2">
          {isAnswered ? (
            <Button
              size={"icon"}
              onClick={() => setIsAnswered(false)}
              className="bg-gray-300 hover:bg-gray-500 text-black"
            >
              <Trash size={15} />
            </Button>
          ) : (
            ""
          )}
          <Button
            size={"icon"}
            onClick={() => setIsMarked(!isMarked)}
            className={cn("text-black", "bg-yellow-300 hover:bg-yellow-500")}
          >
            {isMarked ? <FlagOff size={15} /> : <Flag size={15} />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {" "}
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Question Name
        </h3>
        {/* MCQ OPTION */}
        <div className="flex flex-col gap-3 mt-5">
          <MCQOption />
        </div>
      </CardContent>
    </Card>
  );
}

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function TableDemo() {
  return (
    <Card className="w-full">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Total Questions</TableCell>
            <TableCell>
              <Badge className="bg-gray-600">100</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Answered Questions</TableCell>
            <TableCell>
              <Badge className="bg-green-600">30</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">UnAnswered Questions</TableCell>
            <TableCell>
              <Badge className="bg-red-600">20</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Marked for Review</TableCell>
            <TableCell>
              <Badge className="bg-yellow-600">10</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}

export function TakeExam() {
  const [activeTab, setActiveTab] = React.useState<"questions" | "submitExam">(
    "questions"
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      {activeTab == "questions" ? (
        <>
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted md:gap-8 md:p-10">
            <div className="flex justify-between p-2 bg-gray-100">
              <h5 className="scroll-m-20 text-lg font-medium tracking-tight">
                UPSC Mock Test
              </h5>
              <div className="flex gap-4">
                <p className="flex items-center bg-gray-200 p-2 rounded-3xl gap-2 text-sm">
                  <Timer size={20} />
                  <span className="font-medium"> 05:00:00</span>
                </p>
                <DrawerDemo />
                {/* <Button className="bg-blue-600">Submit</Button> */}
              </div>
            </div>
            <CardWithForm />
          </main>
          <div className="flex justify-between absolute bottom-0 w-full p-2">
            <Button size={"lg"} variant="outline">
              Previous Question
            </Button>
            <Button onClick={() => setActiveTab("submitExam")} size={"lg"}>
              Next Question
            </Button>
          </div>
        </>
      ) : (
        <>
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-2 md:gap-8 md:p-10">
            <div className="flex justify-between p-2">
              <h5 className="scroll-m-20 text-lg font-medium tracking-tight">
                UPSC Mock Test
              </h5>
              <div className="flex gap-4">
                <p className="flex items-center bg-gray-200 p-2 rounded-3xl gap-2 text-sm">
                  <Timer size={20} />
                  <span className="font-medium"> 05:00:00</span>
                </p>
                <DrawerDemo />
                {/* <Button className="bg-blue-600">Submit</Button> */}
              </div>
            </div>
            <TableDemo />
          </main>
          <div className="flex flex-col justify-between absolute gap-4 bottom-0 w-full p-2 mb-2">
            <Button
              className="bg-green-600 w-full"
              onClick={() => setActiveTab("submitExam")}
              size={"lg"}
            >
              Submit Exam
            </Button>
            <Button
              className="bg-gray-600 w-full"
              onClick={() => setActiveTab("questions")}
              size={"lg"}
            >
              Go Back to Questions
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

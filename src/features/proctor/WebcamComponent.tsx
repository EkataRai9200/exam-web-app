import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/common";
import { Camera, ChevronRight } from "lucide-react";
import { useExamData } from "@/lib/hooks";
import { toast } from "sonner";

const WebcamComponent = () => {
  const video = useRef<any>(null);

  const [showWebCam, setShowWebCam] = useState(true);

  const { reportStudentWebCam } = useExamData();

  const interval = useRef<any>();

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (video.current) {
        video.current.srcObject = stream;
      }
    } catch (e) {
      toast.error("WebCam is not available");
      console.error("Error accessing webcam:", e);
    }
  };

  const captureImage = () => {
    console.log(video.current?.srcObject);
    if (!video.current?.srcObject) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.current.videoWidth;
    canvas.height = video.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video.current, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL("image/png");

      // Send the captured image
      reportStudentWebCam(imageBase64)
        .then((response) => {
          if (response?.ok) {
            console.log("Image reported successfully");
          } else {
            console.log("Failed to report image");
          }
        })
        .catch((error) => {
          console.error("Error reporting image:", error);
        });
    }
  };

  useEffect(() => {
    startVideo();

    // take and report image to reportStudentWebCam after 10 sec
    interval.current = setInterval(() => {
      captureImage();
    }, 10000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <div
      className={cn(
        "proctor-webcam-container fixed z-50 top-0 right-0",
        showWebCam ? "bg-black px-2 py-3" : "bg-transparent"
      )}
    >
      <button
        onClick={() => setShowWebCam(!showWebCam)}
        className="bg-blue-600 border-2 !border-r-0 rounded-l-md border-white cursor-pointer z-[99] text-white p-2 absolute right-0 top-10"
      >
        {showWebCam ? <ChevronRight /> : <Camera />}
      </button>
      <div
        className={cn(
          "container-video pctr-relative",
          showWebCam ? "block" : "hidden"
        )}
      >
        <video
          id="video"
          ref={video}
          width={500}
          height={300}
          autoPlay
          playsInline
          muted
        ></video>
      </div>
    </div>
  );
};

export default WebcamComponent;

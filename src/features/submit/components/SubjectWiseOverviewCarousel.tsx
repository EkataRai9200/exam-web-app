import { useExamData } from "@/lib/hooks";

import { Button } from "@/components/ui/button";
import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { SubjectOverviewCarouselItem } from "./SubjectOverviewCarouselItem";

export function SubjectWiseOverviewCarousel() {
  const { examData } = useExamData();
  const [api, setApi] = React.useState<CarouselApi>();
  const [_current, setCurrent] = React.useState(0);
  const [_count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <div className="flex max-w-full overflow-x-auto gap-2 p-1">
        {examData.subjects.map((s, i) => (
          <Button
            key={`button_${s.sub_id}`}
            size={"sm"}
            variant={i === api?.selectedScrollSnap() ? "default" : "outline"}
            onClick={() => api?.scrollTo(i)}
          >
            {s.name}
          </Button>
        ))}
      </div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {examData.subjects.map((s) => (
            <CarouselItem key={`sub_overview_carousel_${s.sub_id}`}>
              <SubjectOverviewCarouselItem subject={s} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}

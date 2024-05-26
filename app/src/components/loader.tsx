import React from "react";
import { H1 } from "./typography/h1";
import { Skeleton } from "./ui/skeleton";

const Loader = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <H1 className="bg-primary p-4 text-secondary">
        Good things take time...
      </H1>
      <Skeleton className="absolute z-[-1] h-[400px] w-[60%]" />
    </div>
  );
};

export default Loader;

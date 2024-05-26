import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const AddToSlack = () => {
  const [enabled, setIsEnabled] = useState(false);

  const { data, isLoading, isFetched } = api.slack.get.useQuery(undefined, {
    enabled,
  });

  const router = useRouter();

  useEffect(() => {
    if (isFetched && data) {
      void router.push(data);
    }
  }, [isFetched, router, data]);

  return (
    <Button
      variant={"outline"}
      className="mb-2 w-full [&:not(:first-child)]:mt-2"
      onClick={() => {
        setIsEnabled(true);
      }}
      disabled={isLoading}
    >
      <Image
        className="mr-2 h-4 w-4"
        src={"/slack.svg"}
        alt="slack logo"
        height={50}
        width={50}
      />
      Connect with Slack
    </Button>
  );
};

export default AddToSlack;

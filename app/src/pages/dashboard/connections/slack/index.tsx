import { Separator } from "@radix-ui/react-separator";
import { BatteryWarning, CheckCircle } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Loader from "~/components/loader";
import { H1 } from "~/components/typography/h1";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";

const Page = () => {
  const { data, isLoading, error } = api.integrations.get.useQuery({
    platform: "SLACK",
  });

  const router = useRouter();

  useEffect(() => {
    if (!data) {
      void router.push("/dashboard");
    }
  }, [data, router]);

  if (isLoading) return <Loader />;

  if (error)
    return (
      <div className="flex flex-col items-center gap-8">
        <H1>OOPS!</H1>
        An error occured
        <Button
          onClick={() => {
            void router.push("/dashboard");
          }}
        >
          Go back to dashboard
        </Button>
      </div>
    );

  if (!data) {
    return (
      <div className="flex flex-col items-center gap-8">
        <H1>OOPS!</H1>
        Seems like you do not have a slack workspace connected!
        <Button
          onClick={() => {
            void router.push("/dashboard");
          }}
        >
          Go back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | TTC</title>
      </Head>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2">
              <Image src={"/slack.svg"} alt="slack" width={25} height={25} />
              {(data.auth_details as { team: { name: string } }).team.name}
            </CardTitle>
            <CardDescription>Good stuff.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex w-full items-center justify-between gap-8">
              <span className="font-bold">status</span>
              <Button
                variant={
                  data?.auth_status === "WORKING" ? "outline" : "destructive"
                }
              >
                {data?.auth_status === "WORKING" ? (
                  <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                  <BatteryWarning className="mr-2 h-4 w-4" />
                )}
                {data?.auth_status}
              </Button>
            </div>

            <Separator />
          </CardContent>
          <CardFooter>
            <Button
              variant={"default"}
              className="w-full"
              onClick={() => {
                void router.push("/dashboard");
              }}
            >
              Back to dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Page;

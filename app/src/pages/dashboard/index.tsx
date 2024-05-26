import { signOut } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import AddToSlack from "~/components/AddToSlack";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";

const Dashboard = () => {
  const { data: slackData, isLoading: slackLoading } =
    api.integrations.get.useQuery({
      platform: "SLACK",
    });
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Dashboard | TTC</title>
      </Head>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Channels</CardTitle>
            <CardDescription>
              Different channels you can connect to
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {/* <Card className="mb-4 [&:not(:first-child)]:mt-4"> */}
            {slackLoading ? (
              <Button
                variant={"outline"}
                className="mb-2 w-full [&:not(:first-child)]:mt-2"
                disabled
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
            ) : slackData === null ? (
              <AddToSlack />
            ) : (
              <Button
                variant={"default"}
                className="mb-2 w-full [&:not(:first-child)]:mt-2"
                onClick={() => {
                  void router.push("/dashboard/connections/slack");
                }}
              >
                <Image
                  className="mr-2 h-4 w-4"
                  src={"/slack.svg"}
                  alt="slack logo"
                  height={50}
                  width={50}
                />
                Connected with slack
              </Button>
            )}
            {/* </Card> */}
            <Separator />
            <Button
              variant={"destructive"}
              className="[&:not(:first-child)]:mt-2"
              onClick={() => {
                void signOut();
              }}
            >
              Log Out
            </Button>
          </CardContent>
          <CardFooter>More channels coming soon...</CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;

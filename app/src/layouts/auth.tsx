import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { type FC, type ReactNode, useEffect } from "react";
import Loader from "~/components/loader";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();
  console.log({ status });
  useEffect(() => {
    if (status === "unauthenticated" && router.pathname !== "/") {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") return <Loader />;

  return (
    <>
      <Head>
        <title>Talk To Channel</title>
      </Head>
      {children}
    </>
  );
};

export default AuthLayout;

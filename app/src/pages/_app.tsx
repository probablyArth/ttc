import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import AuthLayout from "~/layouts/auth";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main
        className={`${GeistSans.className} flex h-screen flex-col items-center justify-center p-10`}
      >
        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

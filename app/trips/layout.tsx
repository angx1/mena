import React from "react";
import Head from "next/head";
import Link from "next/link";

interface TripsLayoutProps {
  children: React.ReactNode;
}

const TripsLayout: React.FC<TripsLayoutProps> = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Trips Page</title>
        <meta name="description" content="Manage your trips" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </div>
  );
};

export default TripsLayout;

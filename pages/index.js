import Head from "next/head";
import Header from "@/components/Header";
import Protected from "@/components/Protected";

export default function HomePage() {

  return (
    <>
      <Head>
        <title>Technical documentation</title>
        <meta name="description" content="Technical documentation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Header />
        <Protected/>
      </div>
    </>
  );
}

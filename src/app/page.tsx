import { Button } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-grow p-12">
      <p className="mb-2">This is home!</p>
      <Link href={"/about"}>
        <Button type="link">Go to about page!</Button>
      </Link>
    </main>
  );
}

import { Button } from "antd";
import Link from "next/link";

export default function About() {
  return (
    <main className="flex-grow p-12">
      <p className="mb-2">This is about page!</p>
      <Link href={"/"}>
        <Button type="link">Go back to home!</Button>
      </Link>
    </main>
  );
}

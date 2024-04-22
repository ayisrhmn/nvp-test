import Button from "@/components/atoms/Button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ height: "80vh" }} className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-3">404 | Page Not Found</h2>
      <p className="text-base mb-3 w-96">
        Page you are trying to open does not exist. You may have mistyped the
        address, or the page has been moved to another URL. If you think this is
        an error contact support.
      </p>
      <Link href="/">
        <Button type="primary" ghost>Return Home</Button>
      </Link>
    </div>
  );
}

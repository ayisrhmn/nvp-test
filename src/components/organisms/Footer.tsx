export default function Footer() {
  return (
    <footer className="flex items-center justify-center p-4 border-t border-b-gray-300">
      <p className="text-xs">
        &copy; {new Date().getFullYear()}{" "}
        <a href="https://ayisdev.my.id" target="_blank" className="underline font-semibold">
          ayisdev
        </a>
        . All rights reserved
      </p>
    </footer>
  );
}

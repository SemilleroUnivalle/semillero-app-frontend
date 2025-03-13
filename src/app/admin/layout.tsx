import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
        <div className="">{children}</div>
    </div>
  );
}

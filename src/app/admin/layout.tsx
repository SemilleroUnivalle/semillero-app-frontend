
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <h1>Vista de administrador
      </h1>
        <div className="">{children}</div>
    </div>
  );
}

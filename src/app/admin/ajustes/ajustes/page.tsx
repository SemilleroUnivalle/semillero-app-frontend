import Link from "next/link";
export default function Ajustes() {
  return (
    <div className="mx-auto mt-4 flex w-11/12 flex-col items-center justify-start rounded-2xl bg-white p-4 py-2 shadow-md">
      <Link
        href="/admin/ajustes/cambiarContrasena"
        className="text-md my-1 flex w-full grow items-center justify-center gap-4 rounded-lg p-3 font-medium text-[#575757] hover:bg-[#e8e8e8] hover:text-black md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <div className="">Cambiar contraseña</div>
      </Link>
    </div>
  );
}

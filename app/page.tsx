import Link from "next/link";

export default function Home() {
  return (
    <div className='w-screen h-screen flex flex-col gap-4 justify-center items-center'>
      <p className='font-extrabold text-6xl uppercase'>Home</p>
      <Link href='/board' className="underline">access board </Link>
    </div>
  );
}

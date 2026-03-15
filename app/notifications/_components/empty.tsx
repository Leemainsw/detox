import Image from "next/image";

interface Props {
  message: string;
}
export default function Empty({ message }: Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full gap-5">
      <Image src="/images/emoji/Zzz.png" alt="empty" width={100} height={100} />
      <p className="body-lg text-gray-400">{message}</p>
    </div>
  );
}

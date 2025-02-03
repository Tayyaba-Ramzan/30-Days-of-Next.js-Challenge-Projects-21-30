import Image from "next/image"
import WordCounter from "@/components/word-counter";


export default function Home() {
  return (
    <div>
      <Image
        src="/bg.jpg"
        alt="Background_Image"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <WordCounter />
      </div>
    </div>

  );
}

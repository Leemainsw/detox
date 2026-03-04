"use client";

import { useRouter } from "next/navigation";

import Robot from "@/public/images/emoji/Robot.png";
import Image from "next/image";
import Button from "@/app/components/button";


type AIAnalysisBannerVariant = "default" | "button";



export default function AIAnalysisBanner() {
  const router = useRouter();

  const handleStartAnalysis = () => {
    router.push("/statistics/ai"); 
  };
  return (
    <section className="
      flex flex-col items-center justify-center 
      text-center px-6 py-6
      bg-linear-to-t from-brand-primary/50 to-white
      md:min-h-100 md:py-8
    ">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold md:text-4xl leading-tight text-black">
          <span className="text-brand-primary">낭비되는 구독료</span>로<br />
          치킨을 먹을 수 있어요
        </h1>
        <p className="text-1xl md:text-2xl text-gray-300 leading-relaxed">
          숨겨진 구독료를 찾아<br />
          낭비를 줄여보세요
        </p>
      </div>

      <div className="mt-5 transition-transform hover:scale-105 duration-300">
        <Image 
          src={Robot} 
          alt="Robot Emoji" 
          width={100} 
          height={100} 
          className="w-24 h-24 md:w-32 md:h-32 object-contain"
        />
      </div>

      <div className="mt-8 w-full flex justify-center">
        <div className="w-full">
          <Button variant="primary" size="lg" onClick={handleStartAnalysis}>
            AI 분석 시작하기
          </Button>
        </div>
      </div>

    </section>
  );
}
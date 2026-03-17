"use client";
import Image from "next/image";
import DefaultUserImage from "@/public/images/default-user.png";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  size?: AvatarSize;
  src?: string;
  alt?: string;
}

const avatarSize = {
  sm: 24,
  md: 30,
  lg: 56,
  xl: 100,
} as const;

const avatarSizeClasses: Record<AvatarSize, string> = {
  sm: "w-6 h-6",
  md: "w-[30px] h-[30px]",
  lg: "w-14 h-14",
  xl: "w-[100px] h-[100px]",
};

export default function Avatar({ size = "md", src, alt }: AvatarProps) {
  const imageSrc = src || DefaultUserImage;
  const isExternalUrl =
    typeof imageSrc === "string" && imageSrc.startsWith("http");

  const sizePx = avatarSize[size];

  return (
    <div className={cn(avatarSizeClasses[size], "rounded-full bg-gray-100")}>
      <Image
        className="w-full h-full object-cover rounded-full"
        src={imageSrc}
        onError={(e) => {
          (e.target as HTMLImageElement).src = DefaultUserImage.src;
        }}
        alt={alt || ""}
        width={sizePx}
        height={sizePx}
        unoptimized={isExternalUrl}
      />
    </div>
  );
}

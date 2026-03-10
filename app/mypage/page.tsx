"use client";

import Image from "next/image";
import { useEffect } from "react";
import Avatar from "../components/avatar";
import Header from "../components/header";
import Input from "../components/input";
import Button from "../components/button";
import BottomNav from "../components/bottom-nav";
import LoadingScreen from "../components/loading-screen";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery, useLogoutMutation } from "@/query/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const currentUserQuery = useCurrentUserQuery();

  useEffect(() => {
    if (!currentUserQuery.isPending && !currentUserQuery.data) {
      router.replace("/login");
    }
  }, [currentUserQuery.data, currentUserQuery.isPending, router]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast(
        <span className="body-md inline-flex items-center gap-2">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="h-4 w-4 text-gray-400"
          />
          로그아웃에 실패했어요.
        </span>,
        {
          className: "!justify-center",
          style: { textAlign: "center" },
        }
      );
    }
  };

  if (currentUserQuery.isPending || !currentUserQuery.data) {
    return <LoadingScreen message="내 정보를 불러오는 중이에요." />;
  }

  return (
    <main className="w-full min-h-screen flex flex-col items-center relative">
      <Header
        variant="text"
        leftText="내 정보"
        rightContent={
          <button
            className="flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={logoutMutation.isPending}
            onClick={handleLogout}
          >
            <span className="body-lg font-normal text-gray-300">로그아웃</span>
          </button>
        }
      />

      <div className="w-full flex flex-col px-6 mt-18 gap-18">
        <div className="flex flex-col gap-4 items-center">
          <div className="relative w-fit">
            <Avatar size="xl" src="" alt="my-profile-image" />
            <button className="absolute bottom-0 right-[-10px]">
              <Image
                src="/images/my-page/upload-image.png"
                alt="edit-profile"
                width={44}
                height={44}
              />
            </button>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="body-lg font-bold">김철수</span>
            <span className="body-md font-normal text-gray-300">
              kim@gmail.com
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Input label="닉네임" placeholder="닉네임을 입력해주세요" />
          <Button variant="primary" size="lg">
            저장하기
          </Button>
        </div>
      </div>

      {!currentUserQuery.data?.is_anonymous ? (
        <button className="absolute left-1/2 -translate-x-1/2 bottom-[108px] w-auto flex items-center justify-center gap-2 cursor-pointer">
          <span className="body-lg font-normal text-gray-300 underline">
            탈퇴하기
          </span>
        </button>
      ) : null}

      <BottomNav />
    </main>
  );
}

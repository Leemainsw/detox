"use client";

import {
  faChartSimple,
  faCircleUser,
  faHouse,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="bottom-nav" aria-label="하단 네비게이션">
      <Link
        href="/"
        className={`bottom-nav-item ${isActive("/") ? "active" : ""}`}
        aria-current={isActive("/") ? "page" : undefined}
      >
        <FontAwesomeIcon size="xl" icon={faHouse} />
        <span>홈</span>
      </Link>
      <Link
        href="/statistics"
        className={`bottom-nav-item ${isActive("/statistics") ? "active" : ""}`}
        aria-current={isActive("/statistics") ? "page" : undefined}
      >
        <FontAwesomeIcon size="xl" icon={faChartSimple} />
        <span>통계</span>
      </Link>
      <Link
        href="/community"
        className={`bottom-nav-item ${isActive("/community") ? "active" : ""}`}
        aria-current={isActive("/community") ? "page" : undefined}
      >
        <FontAwesomeIcon size="xl" icon={faUsers} />
        <span>커뮤니티</span>
      </Link>
      <Link
        href="/mypage"
        className={`bottom-nav-item ${isActive("/mypage") ? "active" : ""}`}
        aria-current={isActive("/mypage") ? "page" : undefined}
      >
        <FontAwesomeIcon size="xl" icon={faCircleUser} />
        <span>내정보</span>
      </Link>
    </nav>
  );
}

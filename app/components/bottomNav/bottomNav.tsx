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

  return (
    <nav className="bottom-nav">
      <Link
        href="/"
        className={`bottom-nav-item ${pathname === "/" ? "active" : ""}`}
      >
        <FontAwesomeIcon size="xl" icon={faHouse} />
        <span>홈</span>
      </Link>
      <Link
        href="/statistics"
        className={`bottom-nav-item ${pathname === "/statistics" ? "active" : ""}`}
      >
        <FontAwesomeIcon size="xl" icon={faChartSimple} />
        <span>통계</span>
      </Link>
      <Link
        href="/community"
        className={`bottom-nav-item ${pathname === "/community" ? "active" : ""}`}
      >
        <FontAwesomeIcon size="xl" icon={faUsers} />
        <span>커뮤니티</span>
      </Link>
      <Link
        href="/mypage"
        className={`bottom-nav-item ${pathname === "/mypage" ? "active" : ""}`}
      >
        <FontAwesomeIcon size="xl" icon={faCircleUser} />
        <span>내정보</span>
      </Link>
    </nav>
  );
}

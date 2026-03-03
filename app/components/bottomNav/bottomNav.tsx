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

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: faHouse },
  { href: "/statistics", label: "통계", icon: faChartSimple },
  { href: "/community", label: "커뮤니티", icon: faUsers },
  { href: "/mypage", label: "내정보", icon: faCircleUser },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="bottom-nav" aria-label="하단 네비게이션">
      {NAV_ITEMS.map(({ href, icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`bottom-nav-item ${isActive(href) ? "active" : ""}`}
          aria-current={isActive(href) ? "page" : undefined}
        >
          <FontAwesomeIcon size="xl" icon={icon} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

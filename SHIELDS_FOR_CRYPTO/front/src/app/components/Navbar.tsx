"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bg-transparent z-10 top-0 w-[92%] border-b py-2 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Shields For Crypto🛡
      </Link>
      <ul>
        <li className="inline-block mx-2">
          <Link
            className={pathname === "/" ? "font-bold border-b-2 border-white pb-1" : ""}
            href="/"
          >
            Home
          </Link>
        </li>
        <li className="inline-block mx-2">
          <Link
            className={pathname === "/polygon" ? "font-bold border-b-2 border-white pb-1" : ""}
            href="/polygon"
          >
            Polygon
          </Link>
        </li>
        <li className="inline-block mx-2">
          <Link
            className={pathname === "/gnosis" ? "font-bold border-b-2 border-white pb-1" : ""}
            href="/gnosis"
          >
            Gnosis
          </Link>
        </li>
        <li className="inline-block mx-2">
          <Link
            className={pathname === "/apecoin" ? "font-bold border-b-2 border-white pb-1" : ""}
            href="/apecoin"
          >
            ApeCoin
          </Link>
        </li>
        <li className="inline-block mx-2">
          <Link
            className={pathname === "/airdrop" ? "font-bold border-b-2 border-white pb-1" : ""}
            href="/airdrop"
          >
            Airdrop
          </Link>
        </li>
      </ul>
      <ConnectButton />
    </nav>
  );
};

export default Navbar;

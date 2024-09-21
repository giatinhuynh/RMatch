"use client"; // This file will be a client-side component

import { usePathname } from "next/navigation";
import Header from "./Header";
import Navbar from "./Navbar";
import FontProvider from "./FontProvider"; // Import FontProvider

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();

    // List of paths that don't require Header or Navbar
    const noHeaderNavbarPaths = ["/auth/login", "/auth/signup"];
    const shouldShowHeaderNavbar = !noHeaderNavbarPaths.includes(pathname);

    return (
        <FontProvider>
            {shouldShowHeaderNavbar ? (
                <>
                    <Header />
                    <div className="flex bg-white">
                        <Navbar />
                        <div className="flex-grow">{children}</div>
                    </div>
                </>
            ) : (
                <div>{children}</div>
            )}
        </FontProvider>
    );
}

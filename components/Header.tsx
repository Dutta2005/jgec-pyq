"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Settings, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from '@/public/jgec.png';

function Header() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10" role="banner">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded" aria-label="JGEC Question Papers Home">
            <Image 
              src={logo.src} 
              alt="JGEC Logo" 
              width={50} 
              height={50}
              className="flex-shrink-0"
            />
            <h1 className="text-xl font-bold hidden md:block text-gray-900">
              JGEC Question Papers
            </h1>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main navigation">
            <Button
              variant="outline"
              size="sm"
              className="bg-green-500 text-white hover:bg-green-600 border-green-600 focus:ring-2 focus:ring-green-500"
              asChild
            >
              <a
                href="https://github.com/Dutta2005/jgec-pyq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Star this project on GitHub"
              >
                <Star className="h-4 w-4 sm:mr-2 text-yellow-300" aria-hidden="true" />
                <span className="hidden sm:inline">Star on GitHub</span>
                <span className="sm:hidden">Star</span>
              </a>
            </Button>
            {authLoading ? (
              <Button variant="outline" size="sm" disabled aria-label="Admin section loading">
                <Settings className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
                  aria-label={isAuthenticated ? "Go to admin dashboard" : "Admin login"}
                >
                  <Settings className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

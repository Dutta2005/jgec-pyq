import Image from "next/image";
import logo from '@/public/jgec.png';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center min-h-screen">
      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 sm:w-32 sm:h-32 relative mb-6 animate-pulse">
          <Image
            src={logo}
            alt="JGEC Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-blue-900/80 font-medium tracking-widest uppercase text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

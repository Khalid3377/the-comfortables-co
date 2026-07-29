import Link from "next/link";
import { XCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] font-sans p-6">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-sm border border-[#EAEAEA] p-8 text-center">
        <div className="mx-auto flex items-center justify-center mb-6 text-red-500">
          <XCircle size={48} />
        </div>
        
        <h1 className="text-[24px] font-bold text-[#2B2B2B] tracking-tight mb-2" style={{ fontFamily: "Inter Tight, sans-serif" }}>
          Authentication Error
        </h1>
        <p className="text-[#6E6E6E] text-[14px] mb-8">
          Something went wrong during sign in. Please try again.
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="w-full h-11 bg-[#2E6F68] text-white font-medium text-[15px] rounded-lg hover:bg-[#23554e] transition-colors flex justify-center items-center"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="w-full h-11 bg-white border border-[#EAEAEA] text-[#2B2B2B] font-medium text-[15px] rounded-lg hover:bg-[#FAFAF7] transition-colors flex justify-center items-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

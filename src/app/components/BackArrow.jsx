"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-green-500 text-2xl hover:scale-110 transition-transform w-fit"
      aria-label="Volver"
    >
      <ArrowLeft size={28} />
    </button>
  );
};

export default BackArrow;

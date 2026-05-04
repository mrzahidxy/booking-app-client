"use client";
import React, { ReactNode } from "react";

type Props = {
  title: string;
  className?: string;
  icon?: ReactNode;
  loading?: boolean;
  onClick?: () => void;
};

const CustomButton = ({ className, title, icon, loading, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent group-hover:border-white group-hover:border-t-transparent"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {title}
          {icon}
        </>
      )}
    </button>
  );
};

export default CustomButton;

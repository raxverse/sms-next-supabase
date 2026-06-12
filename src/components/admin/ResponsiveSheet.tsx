"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ResponsiveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function ResponsiveSheet({
  isOpen,
  onClose,
  title,
  children,
}: ResponsiveSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--input-border)] bg-white p-4 sm:hidden">
          {title && (
            <h2 className="text-lg font-semibold text-[var(--text-color)]">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--input-bg)] rounded-lg transition-colors"
          >
            <X size={24} className="text-[var(--text-color)]" />
          </button>
        </div>
        <div className="p-4 sm:hidden">{children}</div>
      </div>
    </>
  );
}

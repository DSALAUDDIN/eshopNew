import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface CenteredDropdownMenuProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export function CenteredDropdownMenu({ open, onClose, children, width = "900px" }: CenteredDropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="centered-dropdown-menu"
    >
      {children}
    </div>,
    document.body
  );
}

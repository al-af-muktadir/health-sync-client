import React, { ReactNode, useState, isValidElement } from "react";

interface DialogProps {
  children: ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Dialog = ({ children, trigger, open, onOpenChange, className }: DialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const controlledOpen = typeof open === "boolean" ? open : isOpen;

  const handleClose = () => {
    setIsOpen(false);
    if (onOpenChange) onOpenChange(false);
  };

  const renderTrigger = () => {
    if (trigger) {
      return isValidElement(trigger) ? (
        React.cloneElement(trigger as React.ReactElement<any>, {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsOpen(true);
            if (onOpenChange) onOpenChange(true);
          },
        })
      ) : (
        <div onClick={() => {
          setIsOpen(true);
          if (onOpenChange) onOpenChange(true);
        }}>{trigger}</div>
      );
    }
    return null;
  };

  return (
    <>
      {renderTrigger()}
      {controlledOpen && (
        <div
          className={`fixed bottom-4 z-50 ${className}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-4 w-80 h-96 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            <button
              className="mt-2 w-full bg-red-500 text-white p-2 rounded"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const DialogTrigger = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const DialogContent = ({ children }: { children: ReactNode }) => {
  return <div className="h-full">{children}</div>;
};
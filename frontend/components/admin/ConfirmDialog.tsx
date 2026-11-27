'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  const getButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'bg-zinc-900 hover:bg-black text-white';
      case 'warning':
        return 'bg-zinc-900 hover:bg-black text-white';
      default:
        return 'bg-zinc-900 hover:bg-black text-white';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-zinc-900" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-zinc-900" />;
      default:
        return <HelpCircle className="w-5 h-5 text-zinc-900" />;
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-zinc-200 rounded-xl p-6 shadow-xl z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-zinc-100 border border-zinc-200 shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-base font-bold text-zinc-900">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                {description}
              </Dialog.Description>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition disabled:opacity-50 shadow-2xs"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={async () => {
                await onConfirm();
              }}
              disabled={isLoading}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition shadow-xs disabled:opacity-50 flex items-center gap-2 ${getButtonClass()}`}
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

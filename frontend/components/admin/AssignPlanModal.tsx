'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CreditCard, X } from 'lucide-react';
import { getPlans, assignPlan, PlanItem } from '@/lib/adminApi';
import { useToast } from '@/components/admin/Toast';

interface AssignPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
}

export function AssignPlanModal({
  open,
  onOpenChange,
  clientId,
  clientName,
  onSuccess,
}: AssignPlanModalProps) {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      getPlans()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setPlans(res.data);
            setSelectedPlanId(res.data[0].id);
          }
        })
        .catch((err) => {
          console.error('Error fetching plans:', err);
          error('Failed to load plans');
        })
        .finally(() => setIsLoading(false));
    }
  }, [open, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId) return;

    setIsSubmitting(true);
    try {
      await assignPlan(clientId, selectedPlanId);
      success('Subscription plan assigned successfully');
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      error(err.message || 'Failed to assign plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in duration-150" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-zinc-200 rounded-xl p-6 shadow-xl z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-150 text-zinc-900">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-zinc-900">
                  Assign Subscription Plan
                </Dialog.Title>
                <Dialog.Description className="text-xs text-zinc-500">
                  Select a subscription tier for {clientName}
                </Dialog.Description>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-zinc-600 transition"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-2">
                Available Plans
              </label>
              {isLoading ? (
                <div className="text-center py-6 text-zinc-500 text-xs">Loading plans...</div>
              ) : (
                <div className="space-y-2">
                  {plans.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition ${
                        selectedPlanId === p.id
                          ? 'border-zinc-900 bg-zinc-50 shadow-2xs'
                          : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="plan"
                          value={p.id}
                          checked={selectedPlanId === p.id}
                          onChange={(e) => setSelectedPlanId(e.target.value)}
                          className="accent-zinc-900"
                        />
                        <div>
                          <div className="text-xs font-bold text-zinc-900">{p.name}</div>
                          <div className="text-[11px] text-zinc-500">
                            {p.conversations.toLocaleString()} conversations/month
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-zinc-900 font-mono">
                          ₹{Number(p.price_inr).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-zinc-500">per month</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg transition shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedPlanId}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-black rounded-lg transition shadow-xs disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>Confirm & Activate</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

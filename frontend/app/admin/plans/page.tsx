'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { getPlans, PlanItem } from '@/lib/adminApi';

export default function PlansPage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans()
      .then((res) => {
        setPlans(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load plans:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-zinc-900" />
          <span>Subscription Plans & Tiers</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Configured pricing plans, conversational token limits, and feature entitlements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-16 text-zinc-500 text-xs">
            Loading plans...
          </div>
        ) : (
          plans.map((plan, idx) => (
            <div
              key={plan.id}
              className={`bg-white border rounded-xl p-6 flex flex-col justify-between shadow-xs ${
                idx === 1
                  ? 'border-zinc-900 ring-1 ring-zinc-900'
                  : 'border-zinc-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-zinc-900">{plan.name}</h3>
                  {idx === 1 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-white shadow-2xs">
                      Popular
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-zinc-900 font-mono tracking-tight">
                    ₹{Number(plan.price_inr).toLocaleString()}
                    <span className="text-xs font-normal text-zinc-500"> / month</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Includes {plan.conversations.toLocaleString()} AI conversations/mo
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-zinc-100 text-xs text-zinc-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                    <span>Website Chatbot Widget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                    <span>Document Knowledge Base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                    <span>Lead Qualification & Handoff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                    <span>DPDP Act 2023 Consent Audit</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] text-zinc-400 text-center">
                Managed centrally via backend migrations
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

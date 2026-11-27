import React, { Suspense } from 'react';
import { AdminClientLayout } from './AdminClientLayout';

export const instant = false;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-zinc-50" />}>
      <AdminClientLayout>{children}</AdminClientLayout>
    </Suspense>
  );
}

'use client';

import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 6 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse border-b border-zinc-100">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-5 py-4">
              <div
                className={`h-4 bg-zinc-200/80 rounded ${
                  cIdx === 0
                    ? 'w-8'
                    : cIdx === 1
                    ? 'w-36'
                    : cIdx === cols - 1
                    ? 'w-16 ml-auto'
                    : 'w-24'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

'use client';

import { SalesConcierge } from '@/components/AI/SalesConcierge';

export default function FoodLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ position: 'relative' }}>
            {children}
            <SalesConcierge />
        </div>
    );
}

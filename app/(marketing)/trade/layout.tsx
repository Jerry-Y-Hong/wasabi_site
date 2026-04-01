import React from 'react';
import { TradeBroker } from '../../../components/AI/TradeBroker';

export default function TradeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-gray-50">
            {children}
            <TradeBroker />
        </div>
    );
}

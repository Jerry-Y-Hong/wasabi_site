import React from 'react';
import { TechSupport } from '../../../../components/AI/TechSupport';

export default function TechnologyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-black">
            {children}
            <TechSupport />
        </div>
    );
}

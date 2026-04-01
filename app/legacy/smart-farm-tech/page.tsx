'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function SmartFarmTechRedirect() {
    const router = useRouter();
    useEffect(() => {
        // 바로 /smartfarm 로 이동
        router.replace('/smartfarm');
    }, [router]);

    return (
        <>
            <Head>
                <title>스마트팜 기술 페이지 이동 중…</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            {/* 로딩 중 표시 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <p>스마트팜 기술 페이지로 이동 중…</p>
            </div>
        </>
    );
}

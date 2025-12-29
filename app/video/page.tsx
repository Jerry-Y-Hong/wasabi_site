'use client';

import { useState } from 'react';
import { Container, Box, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlayerPlay, IconFileText, IconChartBar, IconWorld, IconLock } from '@tabler/icons-react';

// Define Categories per Row (4 Columns x 4 Rows = 16 items)
const ROW_CATEGORIES = [
    { title: 'MEDIA', icon: IconPlayerPlay, color: '#37b24d', desc: 'Promotional Videos' }, // Row 1
    { title: 'SPECS', icon: IconFileText, color: '#228be6', desc: 'Technical Catalogs' },    // Row 2
    { title: 'R&D', icon: IconChartBar, color: '#7950f2', desc: 'Research Data' },           // Row 3
    { title: 'GLOBAL', icon: IconWorld, color: '#f08c00', desc: 'Global Partners' },         // Row 4
];

// Generate 16 Items (4x4)
const LOCKER_DATA = Array.from({ length: 16 }, (_, i) => {
    const ROW_SIZE = 4;
    const rowIndex = Math.floor(i / ROW_SIZE);
    const category = ROW_CATEGORIES[rowIndex];
    return {
        id: i + 1,
        rowId: rowIndex,
        colId: i % ROW_SIZE,
        title: `${String(i + 1).padStart(2, '0')}`,
        subtitle: `${category.title} 0${(i % ROW_SIZE) + 1}`,
        category: category,
        hasContent: (i % ROW_SIZE) < 3, // Enable first 3 items per row
        // Add random slight rotation for realism? No, keep clean.
    };
});

export default function VideoPage() {
    return (
        <Box bg="#e9ecef" py={40} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Container size="xl">
                <Box mb={30} ta="center">
                    <Text size="3rem" fw={900} c="dark.4" style={{ letterSpacing: '2px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                        K-FARM ARCHIVE
                    </Text>
                    <Text c="dimmed" size="md" mt={5}>
                        Digital Innovation Library
                    </Text>
                </Box>

                {/* 4x4 3D Cabinet Wall - Wide Edition (Larger Items) */}
                <Text size="xs" c="dimmed" ta="right" mb={5} style={{ fontFamily: 'monospace' }}>System v3.0 (4x4 Large)</Text>
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)', // 4 COLUMNS -> 25% width each (Bigger)
                        gap: '15px',
                        padding: '25px',
                        backgroundColor: '#adb5bd',
                        borderRadius: '16px',
                        backgroundImage: 'linear-gradient(45deg, #adb5bd 25%, #868e96 25%, #868e96 50%, #adb5bd 50%, #adb5bd 75%, #868e96 75%, #868e96 100%)',
                        backgroundSize: '40px 40px',
                        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.2), 0 30px 60px rgba(0,0,0,0.4)'
                    }}
                >
                    {LOCKER_DATA.map((item) => (
                        <LockerBox key={item.id} item={item} />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

function LockerBox({ item }: { item: any }) {
    const [opened, setOpened] = useState(false);
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    const handleOpen = () => {
        if (!item.hasContent) return;

        if (opened) {
            openModal();
        } else {
            setOpened(true);
            setTimeout(() => {
                openModal();
            }, 500);
        }
    };

    const Icon = item.category.icon;

    return (
        <>
            <Box
                w="100%"
                style={{
                    aspectRatio: '16/9', // WIDE SCREEN RATIO (But bigger because width is bigger)
                    perspective: '1200px',
                    cursor: item.hasContent ? 'pointer' : 'default',
                    position: 'relative',
                }}
                onClick={handleOpen}
            >
                {/* 3D Pivot Container */}
                <Box
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transform: opened ? 'rotateY(-110deg)' : 'rotateY(0deg)',
                        zIndex: 10
                    }}
                >
                    {/* DOOR FRONT */}
                    <Box
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa',
                            boxShadow: `
                                inset 1px 1px 0px rgba(255,255,255,0.8),
                                inset -1px -1px 0px rgba(0,0,0,0.1),
                                4px 4px 8px rgba(0,0,0,0.15)
                            `,
                            borderRadius: '8px',
                            border: `2px solid ${item.category.color}`,
                        }}
                    >
                        {/* WIDER LAYOUT CONTENT - Bigger Text */}
                        <Box display="flex" style={{ gap: 12, alignItems: 'center' }}>
                            <Box p={8} bg={item.category.color} style={{ borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={24} stroke={2.5} />
                            </Box>
                            <Box ta="left">
                                <Text fw={900} size="1.2rem" c="dark.3" style={{ lineHeight: 1 }}>
                                    {item.title}
                                </Text>
                                <Text size="xs" c="dimmed" tt="uppercase" mt={2} fw={700}>
                                    {item.category.title}
                                </Text>
                            </Box>
                        </Box>

                        {/* Handle */}
                        <Box
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 6,
                                height: 26,
                                borderRadius: '3px',
                                background: '#adb5bd',
                                border: '1px solid #868e96'
                            }}
                        />
                    </Box>

                    {/* DOOR BACK */}
                    <Box
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background: '#e9ecef',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6'
                        }}
                    >
                    </Box>
                </Box>

                {/* INSIDE CABBY */}
                <Box
                    bg="#dee2e6"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        borderRadius: '8px',
                        boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {item.hasContent && <IconPlayerPlay color="white" size={36} fill="#212529" />}
                </Box>
            </Box>

            <Modal opened={modalOpened} onClose={closeModal} size="lg" title={item.subtitle} centered>
                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                    <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text c="white">Loading Content...</Text>
                    </Box>
                </div>
            </Modal>
        </>
    );
}

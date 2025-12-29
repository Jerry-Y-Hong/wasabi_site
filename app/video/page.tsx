'use client';

import { useState } from 'react';
import { Container, Box, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlayerPlay, IconFileText, IconChartBar, IconWorld, IconLock } from '@tabler/icons-react';

// Define Categories per Row (5 Columns x 4 Rows = 20 items)
const ROW_CATEGORIES = [
    { title: 'MEDIA', icon: IconPlayerPlay, color: '#37b24d', desc: 'Promotional Videos' }, // Row 1
    { title: 'SPECS', icon: IconFileText, color: '#228be6', desc: 'Technical Catalogs' },    // Row 2
    { title: 'R&D', icon: IconChartBar, color: '#7950f2', desc: 'Research Data' },           // Row 3
    { title: 'GLOBAL', icon: IconWorld, color: '#f08c00', desc: 'Global Partners' },         // Row 4
];

const LOCKER_DATA = Array.from({ length: 20 }, (_, i) => {
    const rowIndex = Math.floor(i / 5);
    const category = ROW_CATEGORIES[rowIndex];
    return {
        id: i + 1,
        rowId: rowIndex,
        colId: i % 5,
        title: `${String(i + 1).padStart(2, '0')}`,
        subtitle: `${category.title} 0${(i % 5) + 1}`,
        category: category,
        hasContent: (i % 5) < 3,
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

                {/* 5x4 3D Cabinet Wall */}
                <Text size="xs" c="dimmed" ta="right" mb={5} style={{ fontFamily: 'monospace' }}>System v2.2 Aspect Ratio Fix</Text>
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '12px',
                        padding: '20px',
                        backgroundColor: '#adb5bd',
                        borderRadius: '12px',
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
                // Removed fixed height, used aspect-ratio
                style={{
                    aspectRatio: '16/9', // FORCE WIDE SCREEN RATIO
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
                                3px 3px 6px rgba(0,0,0,0.15)
                            `,
                            borderRadius: '6px',
                            border: `2px solid ${item.category.color}`,
                        }}
                    >
                        {/* Compact Layout for Wide Ratio */}
                        <Box style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Box p={4} bg={item.category.color} style={{ borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={16} stroke={2.5} />
                            </Box>
                            <Text fw={900} size="md" c="dark.3" style={{ lineHeight: 1 }}>
                                {item.title}
                            </Text>
                        </Box>

                        <Text
                            mt={4}
                            size="xs"
                            c="dimmed"
                            style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                        >
                            {item.category.title}
                        </Text>

                        {/* Handle */}
                        <Box
                            style={{
                                position: 'absolute',
                                right: 6,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 4,
                                height: 16,
                                borderRadius: '2px',
                                background: '#adb5bd',
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
                            borderRadius: '6px',
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
                        borderRadius: '6px',
                        boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {item.hasContent && <IconPlayerPlay color="white" size={24} fill="#212529" />}
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

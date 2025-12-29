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
        <Box bg="#e9ecef" py={80} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Container size="xl">
                <Box mb={50} ta="center">
                    <Text size="3.5rem" fw={900} c="dark.4" style={{ letterSpacing: '2px', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                        K-FARM LIBRARY
                    </Text>
                    <Text c="dimmed" size="lg" mt={10}>
                        Digital Innovation Archive
                    </Text>
                </Box>

                {/* 5x4 3D Cabinet Wall */}
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '15px', // Gaps to show depth
                        padding: '30px',
                        backgroundColor: '#adb5bd', // Cabinet Frame Color
                        borderRadius: '16px',
                        // Wood/Cabinet Texture effect
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
            }, 500); // Faster snap
        }
    };

    const Icon = item.category.icon;

    return (
        <>
            <Box
                w="100%"
                h={140}
                style={{
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
                        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy pop effect
                        transform: opened ? 'rotateY(-110deg)' : 'rotateY(0deg)',
                        zIndex: 10
                    }}
                >
                    {/* DOOR FRONT - 3D Object Look */}
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

                            // 3D Bevel Effect
                            backgroundColor: '#f8f9fa',
                            boxShadow: `
                                inset 2px 2px 0px rgba(255,255,255,0.8),
                                inset -2px -2px 0px rgba(0,0,0,0.1),
                                5px 5px 10px rgba(0,0,0,0.15)
                            `,
                            borderRadius: '8px',
                            border: `2px solid ${item.category.color}`, // Color coded rim
                        }}
                    >
                        {/* Upper: Icon Sticker */}
                        <Box p={8} bg={item.category.color} style={{ borderRadius: '50%', color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                            <Icon size={24} stroke={2} />
                        </Box>

                        {/* Middle: Text Label */}
                        <Text fw={800} size="xl" mt={10} c="dark.3" style={{ textShadow: '1px 1px 0 white' }}>
                            {item.title}
                        </Text>

                        {/* Bottom: Paper Tag Visual */}
                        <Box
                            mt={10}
                            bg="white"
                            px={10}
                            py={2}
                            style={{
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                fontSize: '10px',
                                color: '#868e96',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                            }}
                        >
                            {item.category.title}
                        </Box>

                        {/* Right: Handle Knob */}
                        <Box
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 12,
                                height: 24,
                                borderRadius: '4px',
                                background: '#dee2e6',
                                border: '1px solid #adb5bd',
                                boxShadow: '1px 1px 2px rgba(0,0,0,0.2)'
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
                        boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)', // Shadow inside
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {item.hasContent ? (
                        <Box
                            w="80%" h="60%" bg="dark"
                            style={{
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                            }}
                        >
                            <IconPlayerPlay color="white" size={20} />
                        </Box>
                    ) : (
                        <Text size="xs" c="gray.6">Empty</Text>
                    )}
                </Box>
            </Box>

            <Modal opened={modalOpened} onClose={closeModal} size="lg" title={item.subtitle} centered>
                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                    <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text c="white">Content Loading...</Text>
                    </Box>
                </div>
            </Modal>
        </>
    );
}

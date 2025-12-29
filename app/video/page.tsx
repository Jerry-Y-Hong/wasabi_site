'use client';

import { useState } from 'react';
import { Container, Box, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlayerPlay, IconFileText, IconChartBar, IconWorld, IconLock } from '@tabler/icons-react';

// Define Categories per Row (4 Columns x 4 Rows = 16 items)
const ROW_CATEGORIES = [
    { title: 'MEDIA', icon: IconPlayerPlay, color: '#2b8a3e', desc: 'Promotional Videos' }, // Darker Green
    { title: 'SPECS', icon: IconFileText, color: '#1864ab', desc: 'Technical Catalogs' },    // Darker Blue
    { title: 'R&D', icon: IconChartBar, color: '#5f3dc4', desc: 'Research Data' },           // Darker Purple
    { title: 'GLOBAL', icon: IconWorld, color: '#d9480f', desc: 'Global Partners' },         // Darker Orange
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
    };
});

export default function VideoPage() {
    return (
        <Box bg="#ced4da" py={40} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Fluid Container for Maximum Width */}
            <Container fluid w="95%" maw="1800px">
                <Box mb={30} ta="center">
                    <Text size="3rem" fw={900} c="dark.5" style={{ letterSpacing: '2px', textShadow: '1px 1px 0px white' }}>
                        K-FARM STORAGE
                    </Text>
                    <Text c="dimmed" size="md" mt={5} fw={500}>
                        Digital Assets Vault
                    </Text>
                </Box>

                {/* 4x4 Photorealistic Cabinet Wall */}
                <Text size="xs" c="dimmed" ta="right" mb={5} style={{ fontFamily: 'monospace' }}>System v4.0 Realism</Text>
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)', // 4 COLUMNS
                        gap: '15px',
                        padding: '25px',
                        backgroundColor: '#868e96', // Darker frame
                        borderRadius: '4px', // Less rounded for industrial feel
                        // Industrial Metal Texture Background
                        backgroundImage: `
                            repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px),
                            linear-gradient(to bottom, #868e96, #495057)
                        `,
                        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4), 0 0 0 10px #495057' // Heavy frame
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
                    aspectRatio: '16/9', // WIDE SCREEN RATIO
                    perspective: '1500px', // More depth
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
                        transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)', // Heavier transition
                        transform: opened ? 'rotateY(-105deg)' : 'rotateY(0deg)',
                        zIndex: 10
                    }}
                >
                    {/* DOOR FRONT - Photorealistic Metal */}
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

                            // Brushed Metal Simulation
                            backgroundColor: '#e9ecef',
                            backgroundImage: `
                                linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0) 50%),
                                repeating-linear-gradient(90deg, transparent 0, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)
                            `,
                            backgroundSize: '200% 100%, 4px 4px',

                            // Physicality
                            borderRadius: '2px', // Sharp
                            borderTop: '1px solid #f8f9fa',
                            borderLeft: '1px solid #f8f9fa',
                            borderRight: '1px solid #adb5bd',
                            borderBottom: '1px solid #adb5bd',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                        }}
                    >
                        {/* Rivets (Screws) */}
                        <Box style={{ position: 'absolute', top: 8, left: 8, width: 6, height: 6, borderRadius: '50%', background: '#adb5bd', boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.4), 1px 1px 0 white' }} />
                        <Box style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#adb5bd', boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.4), 1px 1px 0 white' }} />
                        <Box style={{ position: 'absolute', bottom: 8, left: 8, width: 6, height: 6, borderRadius: '50%', background: '#adb5bd', boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.4), 1px 1px 0 white' }} />
                        <Box style={{ position: 'absolute', bottom: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: '#adb5bd', boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.4), 1px 1px 0 white' }} />

                        {/* Name Plate Area (Inset) */}
                        <Box
                            w="85%" h="50%"
                            bg="#f1f3f5"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 15,
                                padding: '10px 20px',
                                border: '1px solid #dee2e6',
                                boxShadow: 'inset 1px 1px 4px rgba(0,0,0,0.1), 0 1px 0 white', // Inset look
                                borderRadius: '2px'
                            }}
                        >
                            <Box
                                w={48} h={48}
                                bg={item.category.color}
                                style={{
                                    borderRadius: '50%',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent)'
                                }}
                            >
                                <Icon size={26} stroke={2} />
                            </Box>
                            <Box ta="left">
                                <Text fw={800} size="1.5rem" c="dark.4" style={{ fontFamily: 'sans-serif', letterSpacing: '-0.5px' }}>
                                    {item.title}
                                </Text>
                                <Text size="xs" c="dimmed" tt="uppercase" mt={0} fw={700} style={{ letterSpacing: '1px' }}>
                                    {item.category.title}
                                </Text>
                            </Box>
                        </Box>

                        {/* Heavy Metal Handle */}
                        <Box
                            style={{
                                position: 'absolute',
                                right: 15,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 10,
                                height: 50,
                                borderRadius: '2px',
                                background: 'linear-gradient(to right, #ced4da, #e9ecef, #adb5bd)',
                                border: '1px solid #868e96',
                                boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
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
                            background: '#dee2e6',
                            borderRadius: '2px',
                            border: '1px solid #adb5bd'
                        }}
                    >
                    </Box>
                </Box>

                {/* INSIDE CABBY */}
                <Box
                    bg="#343a40" // Dark interior
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        borderRadius: '2px',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)', // Deep shadow
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {item.hasContent && <IconPlayerPlay color="#adb5bd" size={40} />}
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

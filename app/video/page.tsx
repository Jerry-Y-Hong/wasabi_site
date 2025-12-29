'use client';

import { useState } from 'react';
import { Container, Box, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlayerPlay, IconFileText, IconChartBar, IconWorld, IconLock } from '@tabler/icons-react';

// Define Categories per Row (4 Columns x 4 Rows = 16 items)
const ROW_CATEGORIES = [
    { title: 'MEDIA', icon: IconPlayerPlay, color: '#e9ecef', desc: 'Promotional Videos' }, // Icons turn White/Grey on Blue
    { title: 'SPECS', icon: IconFileText, color: '#e9ecef', desc: 'Technical Catalogs' },
    { title: 'R&D', icon: IconChartBar, color: '#e9ecef', desc: 'Research Data' },
    { title: 'GLOBAL', icon: IconWorld, color: '#e9ecef', desc: 'Global Partners' },
];

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
        hasContent: (i % ROW_SIZE) < 3,
    };
});

export default function VideoPage() {
    return (
        <Box bg="#212529" py={40} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Fluid Container */}
            <Container fluid w="95%" maw="1800px">
                <Box mb={30} ta="center">
                    <Text size="3rem" fw={900} c="white" style={{ letterSpacing: '2px', textShadow: '0 0 10px rgba(51, 154, 240, 0.5)' }}>
                        K-FARM BLUE ARCHIVE
                    </Text>
                    <Text c="dimmed" size="md" mt={5} fw={500}>
                        Digital Assets Vault
                    </Text>
                </Box>

                {/* 4x4 Blue Metal Cabinet */}
                <Text size="xs" c="dimmed" ta="right" mb={5} style={{ fontFamily: 'monospace' }}>System v5.0 Blue Metal</Text>
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '15px',
                        padding: '25px',
                        backgroundColor: '#1864ab', // Deep Blue Frame
                        borderRadius: '4px',
                        backgroundImage: `
                            repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px),
                            linear-gradient(to bottom, #1971c2, #1864ab)
                        `,
                        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), 0 30px 60px rgba(0,0,0,0.6), 0 0 0 10px #1864ab'
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
            }, 600); // Wait a bit longer for door
        }
    };

    const handleModalClose = () => {
        closeModal();
        setTimeout(() => {
            setOpened(false); // Close the door when modal closes!
        }, 200);
    };

    const Icon = item.category.icon;

    return (
        <>
            <Box
                w="100%"
                style={{
                    aspectRatio: '16/9',
                    perspective: '1500px',
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
                        transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        transform: opened ? 'rotateY(-105deg)' : 'rotateY(0deg)',
                        zIndex: 10
                    }}
                >
                    {/* DOOR FRONT - BLUE METAL */}
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

                            // Blue Metal Gradient
                            backgroundColor: '#339af0',
                            backgroundImage: `
                                linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.2) 100%),
                                repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)
                            `,
                            // Thicker Borders for 3D depth
                            borderTop: '1px solid #74c0fc',
                            borderLeft: '1px solid #74c0fc',
                            borderRight: '4px solid #1864ab', // Right side shadow/thickness
                            borderBottom: '4px solid #1864ab', // Bottom side shadow/thickness
                            borderRadius: '2px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                        }}
                    >
                        {/* Rivets */}
                        <Box style={{ position: 'absolute', top: 10, left: 10, width: 8, height: 8, borderRadius: '50%', background: '#1864ab', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4), 1px 1px 0 rgba(255,255,255,0.2)' }} />
                        <Box style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#1864ab', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4), 1px 1px 0 rgba(255,255,255,0.2)' }} />
                        <Box style={{ position: 'absolute', bottom: 10, left: 10, width: 8, height: 8, borderRadius: '50%', background: '#1864ab', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4), 1px 1px 0 rgba(255,255,255,0.2)' }} />
                        <Box style={{ position: 'absolute', bottom: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#1864ab', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4), 1px 1px 0 rgba(255,255,255,0.2)' }} />

                        {/* Inset Label Area */}
                        <Box
                            w="85%" h="55%"
                            bg="#e9ecef"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 20,
                                padding: '10px 20px',
                                border: '1px solid #adb5bd',
                                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.5)',
                                borderRadius: '2px'
                            }}
                        >
                            <Box
                                w={56} h={56}
                                bg="#1864ab"
                                style={{
                                    borderRadius: '50%',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
                                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent)'
                                }}
                            >
                                <Icon size={28} stroke={2} />
                            </Box>
                            <Box ta="left">
                                <Text fw={900} size="1.8rem" c="dark.5" style={{ fontFamily: 'sans-serif', letterSpacing: '-1px' }}>
                                    {item.title}
                                </Text>
                                <Text size="sm" c="dimmed" tt="uppercase" mt={0} fw={700} style={{ letterSpacing: '1px' }}>
                                    {item.category.title}
                                </Text>
                            </Box>
                        </Box>

                        {/* Chrome Handle */}
                        <Box
                            style={{
                                position: 'absolute',
                                right: 15,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 12,
                                height: 60,
                                borderRadius: '6px',
                                background: 'linear-gradient(to right, #e9ecef, #f8f9fa, #adb5bd)', // Shiny Chrome
                                border: '1px solid #868e96',
                                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
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
                            background: '#1864ab', // Blue back
                            borderRadius: '2px',
                            border: '1px solid #154c85'
                        }}
                    >
                    </Box>
                </Box>

                {/* INSIDE CABBY */}
                <Box
                    bg="#212529" // Very Dark interior
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        borderRadius: '2px',
                        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {item.hasContent && (
                        // Floating Content Inside
                        <Box style={{ animation: opened ? 'floatIn 0.8s ease-out' : 'none' }}>
                            <IconPlayerPlay color="#339af0" size={50} style={{ filter: 'drop-shadow(0 0 10px rgba(51, 154, 240, 0.5))' }} />
                        </Box>
                    )}
                </Box>
            </Box>

            <style jsx global>{`
                @keyframes floatIn {
                    0% { transform: translateZ(-50px) scale(0.8); opacity: 0; }
                    100% { transform: translateZ(0) scale(1); opacity: 1; }
                }
            `}</style>

            <Modal opened={modalOpened} onClose={handleModalClose} size="lg" title={item.subtitle} centered>
                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                    <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text c="white">Video Player Placeholder</Text>
                    </Box>
                </div>
            </Modal>
        </>
    );
}

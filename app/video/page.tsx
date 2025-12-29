'use client';

import { useState } from 'react';
import { Container, Box, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlayerPlay, IconFileText, IconChartBar, IconWorld, IconLock } from '@tabler/icons-react';

// Define Categories per Row (5 Columns x 4 Rows = 20 items)
const ROW_CATEGORIES = [
    { title: 'MEDIA', icon: IconPlayerPlay, color: '#2b8a3e', desc: 'Promotional Videos' }, // Row 1
    { title: 'SPECS', icon: IconFileText, color: '#1098ad', desc: 'Technical Catalogs' },    // Row 2
    { title: 'R&D', icon: IconChartBar, color: '#5f3dc4', desc: 'Research Data' },           // Row 3
    { title: 'GLOBAL', icon: IconWorld, color: '#d9480f', desc: 'Global Partners' },         // Row 4
];

const LOCKER_DATA = Array.from({ length: 20 }, (_, i) => {
    const rowIndex = Math.floor(i / 5); // 0, 1, 2, 3
    const category = ROW_CATEGORIES[rowIndex];
    return {
        id: i + 1,
        rowId: rowIndex,
        colId: i % 5,
        title: `${String(i + 1).padStart(2, '0')}`,
        subtitle: `${category.title} 0${(i % 5) + 1}`,
        category: category,
        hasContent: (i % 5) < 3, // Enable first 3 items of each row
    };
});

export default function VideoPage() {
    return (
        <Box bg="#101113" py={80} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Container size="xl">
                <Box mb={50} ta="center">
                    <Text size="3.5rem" fw={900} c="gray.3" style={{ letterSpacing: '6px', lineHeight: 1 }}>
                        ARCHIVE
                    </Text>
                    <Text c="dimmed" size="sm" mt={10} style={{ letterSpacing: '2px' }}>
                        CLASSIFIED DATA STORAGE
                    </Text>
                </Box>

                {/* 5x4 Luxury Wall */}
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)', // 5 Columns
                        gap: '2px',
                        padding: '10px',
                        backgroundColor: '#141517',
                        borderRadius: '4px',
                        boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.6)'
                    }}
                >
                    {LOCKER_DATA.map((item) => (
                        <LockerBox key={item.id} item={item} />
                    ))}
                </Box>

                {/* Legend / Guide */}
                <Box mt={40} style={{ display: 'flex', justifyContent: 'center', gap: '30px', opacity: 0.6 }}>
                    {ROW_CATEGORIES.map((cat, idx) => (
                        <Box key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Box w={10} h={10} bg={cat.color} style={{ borderRadius: '50%' }} />
                            <Text size="xs" c="dimmed" fw={700}>{cat.title}</Text>
                        </Box>
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
            }, 600);
        }
    };

    const Icon = item.category.icon;

    return (
        <>
            <Box
                w="100%"
                h={130} // Slightly wider aspect ratio for 5 cols
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
                        transition: 'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)',
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
                            justifyContent: 'space-between',
                            padding: '15px',
                            // Gradient based on Row Category color (Subtle tint)
                            background: item.hasContent
                                ? `linear-gradient(145deg, ${item.category.color}22, #1A1B1E 80%)` // Very subtle tint
                                : `linear-gradient(145deg, #1A1B1E, #141517)`,
                            border: '1px solid #2C2E33',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            if (item.hasContent) e.currentTarget.style.borderColor = item.category.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#2C2E33';
                        }}
                    >
                        {/* Top Right: Status Light */}
                        <Box style={{ alignSelf: 'flex-end' }}>
                            {item.hasContent ? (
                                <Box w={6} h={6} style={{ borderRadius: '50%', background: item.category.color, boxShadow: `0 0 8px ${item.category.color}` }} />
                            ) : (
                                <Box w={6} h={6} style={{ borderRadius: '50%', background: '#343a40' }} />
                            )}
                        </Box>

                        {/* Center: Row Identifier (Optional, abstract) */}

                        {/* Bottom Left: Number */}
                        <Text fs="italic" fw={900} size="xl" c="dimmed" style={{ opacity: 0.3 }}>
                            {item.title}
                        </Text>
                    </Box>

                    {/* DOOR BACK */}
                    <Box
                        bg="#141517"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            border: `1px solid ${item.category.color}`,
                            opacity: 0.5
                        }}
                    >
                    </Box>
                </Box>

                {/* INSIDE */}
                <Box
                    bg="black"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: -1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: 'inset 0 0 30px black'
                    }}
                >
                    {item.hasContent ? (
                        <>
                            <Icon size={32} color={item.category.color} stroke={1.5} />
                            <Text size="xs" c="dimmed" mt={5}>{item.category.title}</Text>
                        </>
                    ) : (
                        <IconLock size={20} color="#343a40" />
                    )}
                </Box>
            </Box>

            <Modal opened={modalOpened} onClose={closeModal} size="lg" title={item.subtitle} centered>
                {item.category.title === 'MEDIA' ? (
                    <div style={{ position: 'relative', paddingTop: '56.25%', background: 'black' }}>
                        <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Text c="white">Video Playing...</Text>
                        </Box>
                    </div>
                ) : (
                    <Box h={300} bg="gray.1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <item.category.icon size={50} color="gray" />
                        <Text mt="md" fw={700} c="dark">{item.subtitle}</Text>
                        <Text size="sm" c="dimmed">Document Viewer needs to be implemented.</Text>
                    </Box>
                )}
            </Modal>
        </>
    );
}

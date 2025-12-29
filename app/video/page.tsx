'use client';

import { useState } from 'react';
import { Container, SimpleGrid, Box, Text, Modal, Center } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLock, IconPlayerPlay, IconNumber1, IconNumber2, IconNumber3 } from '@tabler/icons-react';

// Generate 20 locker items (4x5 grid)
const LOCKER_DATA = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Box ${String(i + 1).padStart(2, '0')}`,
    subtitle: i < 3 ? `Series ${i + 1}` : 'Empty Slot', // Only first 3 have content
    hasContent: i < 3,
    color: i === 4 ? '#2f9e44' : i === 11 ? '#1864ab' : '#adb5bd', // Random accent colors (Wasabi Green, Blue, Grey)
}));

export default function VideoPage() {
    return (
        <Box bg="#212529" py={50} style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container size="lg">
                <Text size="2.5rem" fw={900} ta="center" mb="xl" c="gray.3" style={{ letterSpacing: '2px' }}>
                    RESTRICTED ARCHIVE
                </Text>

                {/* 4x5 Wall of Lockers */}
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)', // 4 Columns
                        gap: '0px', // No Gap! Attached together
                        border: '4px solid #495057', // Thick frame around the wall
                        backgroundColor: '#343a40',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
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
        if (!item.hasContent) return; // Locked mostly

        if (opened) {
            openModal();
        } else {
            setOpened(true);
            setTimeout(() => {
                openModal();
            }, 800);
        }
    };

    return (
        <>
            <Box
                w="100%"
                h={120} // Compact locker height
                style={{
                    perspective: '800px',
                    cursor: item.hasContent ? 'pointer' : 'default',
                    position: 'relative',
                    borderRight: '1px solid rgba(0,0,0,0.2)',
                    borderBottom: '1px solid rgba(0,0,0,0.2)'
                }}
                onClick={handleOpen}
            >
                {/* 3D Container */}
                <Box
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)', // Snappy mechanical feel
                        transform: opened ? 'rotateY(-105deg)' : 'rotateY(0deg)',
                        transformOrigin: 'left center',
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
                            // Realistic Metal Gradient
                            background: item.hasContent
                                ? `linear-gradient(135deg, ${item.color} 0%, #darken 100%)` // Painted locker style for special ones? No, keep metallic mainly
                                : 'linear-gradient(135deg, #e9ecef 0%, #ced4da 100%)',
                            border: '1px solid #dee2e6',
                            // Add "Vent" slits visual
                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 12px)',
                            backgroundSize: '100% 20px',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center top 10px'
                        }}
                    >
                        {/* Locker Number Plate */}
                        <Box bg="dark" c="white" px={8} py={2} style={{ borderRadius: 2, fontSize: '10px', fontWeight: 700, marginTop: 15 }}>
                            {item.title}
                        </Box>

                        {/* Lock / Handle */}
                        <Box mt={10} style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #868e96', background: '#343a40' }}></Box>

                        {item.hasContent && <Text size="xs" fw={700} mt={5} c="dark.3">DATA INSIDE</Text>}
                    </Box>

                    {/* DOOR BACK */}
                    <Box
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background: '#adb5bd',
                            border: '1px solid #868e96'
                        }}
                    >
                    </Box>
                </Box>

                {/* INSIDE THE LOCKER (Dark Void) */}
                <Box
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                        background: '#212529', // Dark inside
                        boxShadow: 'inset 0 0 15px black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {item.hasContent ? (
                        <IconPlayerPlay size={24} color="#37b24d" style={{ filter: 'drop-shadow(0 0 5px #37b24d)' }} />
                    ) : (
                        <Text c="dimmed" size="xs">EMPTY</Text>
                    )}
                </Box>
            </Box>

            <Modal opened={modalOpened} onClose={closeModal} size="xl" title={item.subtitle} centered>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <Text ta="center" style={{ position: 'absolute', top: '40%', width: '100%' }}>Video Player Loading...</Text>
                </div>
            </Modal>
        </>
    );
}

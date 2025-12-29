'use client';

import { useState } from 'react';
import { Container, Box, Text, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlayerPlay } from '@tabler/icons-react';

const LOCKER_DATA = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `${String(i + 1).padStart(2, '0')}`,
    subtitle: i < 3 ? `Series ${i + 1}` : 'Reserved',
    hasContent: i < 3,
    // Sophisticated Color Palette (Deep Green, Navy, Dark Grey, etc.)
    bg: i % 4 === 0 ? '#2b8a3e' :  // Green
        i % 4 === 1 ? '#1098ad' :  // Cyan/Teal
            i % 4 === 2 ? '#364fc7' :  // Indigo
                '#343a40',   // Dark Grey (Filler)
}));

export default function VideoPage() {
    return (
        <Box bg="#1A1B1E" py={80} style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container size="lg">
                <Text size="3rem" fw={800} ta="center" mb={50} c="dimmed" style={{ letterSpacing: '4px', textTransform: 'uppercase' }}>
                    K-Farm Archive
                </Text>

                {/* 4x5 Luxury Wall */}
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2px', // Thin sophisticated gap
                        padding: '10px',
                        backgroundColor: '#101113', // Frame
                        borderRadius: '8px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
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
            }, 600);
        }
    };

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
                        transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)', // Elastic elegant motion
                        transform: opened ? 'rotateX(-100deg)' : 'rotateX(0deg)', // Rotate Up/Down instead of side? Or stick to Y? Let's try X flip (Garage style) or stick to Y. User said "Door". Let's stick to Y for Locker feel but smoother.
                        // Wait, Y is better for "Locker". X is "Garage".
                        // Let's stick to rotateY but make it smoother.
                    }}
                >
                    {/* DOOR FRONT - The Luxury Part */}
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
                            // Matte Finish with soft gradient
                            background: item.hasContent
                                ? `linear-gradient(135deg, ${item.bg}, #1A1B1E)`
                                : `linear-gradient(135deg, #25262b, #1A1B1E)`,

                            // Glassy border/shine
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                            borderRadius: '2px',
                            transition: 'filter 0.3s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1.0)'; }}
                    >
                        {/* Minimalist Number */}
                        <Text
                            size="2rem"
                            fw={900}
                            style={{
                                color: 'rgba(255,255,255,0.1)',
                                position: 'absolute',
                                bottom: 5,
                                right: 10,
                                lineHeight: 1
                            }}
                        >
                            {item.title}
                        </Text>

                        {item.hasContent && (
                            <Box w={8} h={8} style={{ borderRadius: '50%', background: '#fab005', boxShadow: '0 0 10px #fab005' }} />
                        )}
                    </Box>

                    {/* DOOR BACK */}
                    <Box
                        bg="dark.8"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)', // Standard Y rotation
                        }}
                    >
                    </Box>
                </Box>

                {/* ANIMATION CONTROL FIX: Re-apply Y rotation logic properly */}
                <style jsx>{`
                    div[style*="preserve-3d"] {
                        transform: ${opened ? 'rotateY(-105deg)' : 'rotateY(0deg)'} !important;
                    }
                 `}</style>
                {/* 
                    NOTE: Inline styles in React with ternary are tricky if I messed up the loop. 
                    Let's just use standard style prop above.
                 */}

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
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: 'inset 0 0 20px black'
                    }}
                >
                    {item.hasContent && <IconPlayerPlay color="white" size={30} />}
                </Box>
            </Box>

            <Modal opened={modalOpened} onClose={closeModal} size="xl" title={item.subtitle} centered overlayProps={{ blur: 3 }}>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text c="white">Loading Video Source...</Text>
                    </Box>
                </div>
            </Modal>
        </>
    );
}

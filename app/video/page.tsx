'use client';

import { useState } from 'react';
import { Container, SimpleGrid, Card, Text, Center, Box, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLock, IconPlayerPlay } from '@tabler/icons-react';

const SERIES_DATA = [
    { id: 1, title: 'Series 01', subtitle: 'The Beginning', color: 'blue' },
    { id: 2, title: 'Series 02', subtitle: 'Technology', color: 'teal' },
    { id: 3, title: 'Series 03', subtitle: 'Global Vision', color: 'grape' },
    { id: 4, title: 'Series 04', subtitle: 'Harvest', color: 'orange' },
];

export default function VideoPage() {
    return (
        <Box bg="#f8f9fa" py={100} style={{ minHeight: '100vh' }}>
            <Container size="lg">
                <Text size="3rem" fw={900} ta="center" mb="xl" variant="gradient" gradient={{ from: 'dark', to: 'gray', deg: 45 }}>
                    K-Farm Archives
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
                    {SERIES_DATA.map((item) => (
                        <LockerBox key={item.id} item={item} />
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}

function LockerBox({ item }: { item: any }) {
    const [opened, setOpened] = useState(false);
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

    const handleOpen = () => {
        if (opened) {
            openModal();
        } else {
            setOpened(true);
            setTimeout(() => {
                openModal();
            }, 800); // Wait for animation
        }
    };

    return (
        <>
            <Box
                w="100%"
                h={300}
                style={{
                    perspective: '1000px',
                    cursor: 'pointer'
                }}
                onClick={handleOpen}
            >
                <Box
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
                        transform: opened ? 'rotateY(-110deg)' : 'rotateY(0deg)',
                        transformOrigin: 'left center'
                    }}
                >
                    {/* FRONT DOOR */}
                    <Card
                        padding="xl"
                        radius="md"
                        withBorder
                        bg="white"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                            boxShadow: 'inset 2px 2px 5px rgba(255,255,255,1), 5px 5px 10px rgba(0,0,0,0.1)',
                            border: '1px solid #dcdcdc'
                        }}
                    >
                        <IconLock size={40} color="#adb5bd" style={{ marginBottom: 20 }} />
                        <Text fw={900} size="xl" c="dark">{item.title}</Text>
                        <Text size="sm" c="dimmed" mt={5}>CLASSIFIED</Text>

                        {/* Screws/Details */}
                        <Box style={{ position: 'absolute', top: 10, left: 10, width: 8, height: 8, borderRadius: '50%', background: '#ced4da', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)' }} />
                        <Box style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#ced4da', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)' }} />
                        <Box style={{ position: 'absolute', bottom: 10, left: 10, width: 8, height: 8, borderRadius: '50%', background: '#ced4da', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)' }} />
                        <Box style={{ position: 'absolute', bottom: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#ced4da', boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)' }} />
                    </Card>

                    {/* BACK OF DOOR (When opened) */}
                    <Card
                        padding="xl"
                        radius="md"
                        bg="gray.1"
                        withBorder
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        {/* Just metal texture */}
                    </Card>
                </Box>

                {/* INSIDE CONTENT (Behind the door) */}
                <Card
                    padding="xl"
                    radius="md"
                    bg="dark.8"
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
                        boxShadow: 'inset 0 0 20px black'
                    }}
                >
                    <IconPlayerPlay size={50} color="white" style={{ opacity: 0.8 }} />
                    <Text c="white" fw={700} mt="md">{item.subtitle}</Text>
                    <Text c="dimmed" size="xs">Click to Watch</Text>
                </Card>
            </Box>

            <Modal opened={modalOpened} onClose={closeModal} size="xl" title={item.title} centered>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </Modal>
        </>
    );
}

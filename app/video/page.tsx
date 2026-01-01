'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Text, Modal, AspectRatio } from '@mantine/core';
import { IconPlayerPlay, IconFileText, IconChartBar, IconWorld, IconPlus, IconLock } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { getVideoScripts } from '@/lib/actions';

// Define Categories per Row (5 Columns x 4 Rows = 20 items ... or 4 columns x 5 rows?)
// User asked for 20 boxes. Let's do 4 columns x 5 rows = 20.
const ROW_CATEGORIES = [
    { title: 'MEDIA', icon: IconPlayerPlay, color: '#e9ecef', desc: 'Promotional Videos' },
    { title: 'SPECS', icon: IconFileText, color: '#e9ecef', desc: 'Technical Catalogs' },
    { title: 'R&D', icon: IconChartBar, color: '#e9ecef', desc: 'Research Data' },
    { title: 'GLOBAL', icon: IconWorld, color: '#e9ecef', desc: 'Global Partners' },
    { title: 'ARCHIVE', icon: IconFileText, color: '#e9ecef', desc: 'Old Archives' }, // 5th row
];

export default function VideoPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [activeVideo, setActiveVideo] = useState<{ url: string, title: string } | null>(null);
    const [savedScripts, setSavedScripts] = useState<any[]>([]);

    useEffect(() => {
        getVideoScripts().then(data => setSavedScripts(data)).catch(console.error);
    }, []);

    const handlePlay = (url: string, title: string) => {
        setActiveVideo({ url, title });
        open();
    };

    const lockerData = Array.from({ length: 20 }, (_, i) => {
        const ROW_SIZE = 4; // 4 columns
        const rowIndex = Math.floor(i / ROW_SIZE);
        const category = ROW_CATEGORIES[rowIndex % ROW_CATEGORIES.length];

        // Manual Mapping for Slots 1 & 4
        let customContent = null;
        if (i === 0) { // Slot 1
            customContent = { title: 'IDENTITY', topic: 'Brand Identity', videoUrl: '/videos/real_drone.mp4?v=20260101_final', type: 'video' };
        } else if (i === 1) { // Slot 2
            customContent = { title: 'SEEDING', topic: 'Auto Seeding', videoUrl: '/videos/video_2.mp4', type: 'video' };
        } else if (i === 2) { // Slot 3
            customContent = { title: 'CULTIVATE', topic: 'Cultivation System', videoUrl: '/videos/video_1.mp4', type: 'video' };
        } else if (i === 3) { // Slot 4
            customContent = { title: 'CONTROL', topic: 'Smart Control', videoUrl: '/videos/brand_film_final.mp4?v=20260101_final', type: 'video' };
        } else if (i === 8) { // Slot 9
            customContent = { title: 'INVEST', topic: 'IR Deck (PDF)', videoUrl: '/wasabi_ir_deck.pdf', type: 'pdf' };
        }

        // Retrieve script content for others if exists
        const script = savedScripts[i]; // Potentially offset logic if we want to save 0/1/2 for manual

        return {
            id: i + 1,
            rowId: rowIndex,
            colId: i % ROW_SIZE,
            title: `${String(i + 1).padStart(2, '0')}`,
            subtitle: customContent ? customContent.topic : (script ? script.topic : 'EMPTY SLOT'),
            category: category,
            hasContent: !!customContent || !!script,
            videoUrl: customContent?.videoUrl, // Only manual ones have videoUrl for now
            customContent: customContent,
            script: script
        };
    });

    return (
        <Box bg="#212529" py={40} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Video Modal */}
            <Modal
                opened={opened}
                onClose={() => { setActiveVideo(null); close(); }}
                title={activeVideo?.title}
                size="xl"
                centered
                styles={{ title: { fontWeight: 900, color: '#212529' } }}
            >
                {activeVideo && (
                    <AspectRatio ratio={16 / 9}>
                        <video controls autoPlay src={activeVideo.url} style={{ width: '100%', borderRadius: '4px' }} />
                    </AspectRatio>
                )}
            </Modal>

            {/* Fluid Container */}
            <Container fluid w="95%" maw="1800px">
                <Box mb={30} ta="center">
                    <Text size="3rem" fw={900} c="white" style={{ letterSpacing: '2px', textShadow: '0 0 10px rgba(51, 154, 240, 0.5)' }}>
                        K-FARM BLUE ARCHIVE
                    </Text>
                    <Text c="dimmed" size="md" mt={5} fw={500}>
                        Digital Assets Vault (20 Mailboxes)
                    </Text>
                </Box>

                {/* Blue Metal Cabinet with Integrated Smart Lock */}
                <Text size="xs" c="dimmed" ta="right" mb={5} style={{ fontFamily: 'monospace' }}>System v6.1 Integrated Lock</Text>
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)', // 4 Columns fixed
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
                    {lockerData.map((item) => (
                        <LockerBox key={item.id} item={item} onPlay={handlePlay} />
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

function LockerBox({ item, onPlay }: { item: any, onPlay: (url: string, title: string) => void }) {
    const [opened, setOpened] = useState(false);
    const router = useRouter();

    const handleOpen = () => {
        const wasOpened = opened;
        setOpened(!opened);

        if (!wasOpened) {
            if (item.hasContent && item.videoUrl) {
                // Check Content Type
                if (item.customContent?.type === 'pdf') {
                    setTimeout(() => {
                        window.open(item.videoUrl, '_blank');
                        setOpened(false);
                    }, 800);
                } else {
                    // Play Video
                    setTimeout(() => {
                        onPlay(item.videoUrl, item.customContent.title);
                        setOpened(false); // Reset door after playing
                    }, 800);
                }
            } else {
                // Navigate to Admin (Create/Edit)
                setTimeout(() => {
                    router.push('/admin/studio'); // Updated to Studio
                }, 800);
            }
        }
    };

    const DisplayIcon = item.category.icon;

    return (
        <Box
            w="100%"
            style={{
                aspectRatio: '16/9',
                perspective: '1500px',
                cursor: 'pointer',
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
                        backgroundColor: item.hasContent ? '#339af0' : '#495057', // Darker if empty
                        backgroundImage: `
                            linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.2) 100%),
                            repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)
                        `,
                        // Thicker Borders for 3D depth
                        borderTop: '1px solid rgba(255,255,255,0.3)',
                        borderLeft: '1px solid rgba(255,255,255,0.3)',
                        borderRight: '4px solid rgba(0,0,0,0.2)',
                        borderBottom: '4px solid rgba(0,0,0,0.2)',
                        borderRadius: '2px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Inset Label Area WITH INTEGRATED SMART LOCK */}
                    <Box
                        w="85%" h="55%"
                        bg="#e9ecef"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 10,
                            padding: '10px 20px',
                            border: '1px solid #adb5bd',
                            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.5)',
                            borderRadius: '2px'
                        }}
                    >
                        <Box display="flex" style={{ alignItems: 'center', gap: 15 }}>
                            <Box
                                w={56} h={56}
                                bg={item.hasContent ? "#1864ab" : "#adb5bd"} // Dim color if empty
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
                                <DisplayIcon size={28} stroke={2} />
                            </Box>
                            <Box ta="left">
                                <Text fw={900} size="1.8rem" c="dark.5" style={{ fontFamily: 'sans-serif', letterSpacing: '-1px' }}>
                                    {item.title}
                                </Text>
                                <Text size="sm" c="dimmed" tt="uppercase" mt={0} fw={700} style={{ letterSpacing: '1px' }}>
                                    {item.subtitle}
                                </Text>
                            </Box>
                        </Box>

                        {/* SMART TOUCH LOCK (Integrated) */}
                        <Box
                            style={{
                                width: 36,
                                height: 50,
                                borderRadius: '4px',
                                background: 'linear-gradient(135deg, #212529, #000)', // Glossy Black
                                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                border: '1px solid #dee2e6',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4
                            }}
                        >
                            {/* Status LED - Green if content, Red if empty */}
                            <Box w={20} h={3} bg={item.hasContent ? "#40c057" : "#fa5252"} style={{ borderRadius: 1, boxShadow: item.hasContent ? '0 0 3px #40c057' : '0 0 3px #fa5252' }} />

                            {/* Touch Buttons */}
                            <Box display="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                {[...Array(6)].map((_, k) => (
                                    <Box key={k} w={3} h={3} bg="#868e96" style={{ borderRadius: '50%' }} />
                                ))}
                            </Box>
                        </Box>
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
                <Box style={{ animation: opened ? 'floatIn 0.8s ease-out' : 'none', textAlign: 'center' }}>
                    {item.hasContent && item.videoUrl ? (
                        <>
                            <IconPlayerPlay color="#339af0" size={40} style={{ margin: '0 auto', display: 'block', filter: 'drop-shadow(0 0 10px rgba(51, 154, 240, 0.5))' }} />
                            <Text c="white" size="xs" mt={5}>PLAYING...</Text>
                        </>
                    ) : (
                        <>
                            {/* If content exists but no video (e.g. script only) -> Locked or Edit? For now, locked unless video */}
                            {item.hasContent && !item.videoUrl ? (
                                <>
                                    <IconFileText color="#fab005" size={40} style={{ margin: '0 auto', display: 'block' }} />
                                    <Text c="dimmed" size="xs" mt={5}>SCRIPT ONLY</Text>
                                </>
                            ) : (
                                <>
                                    <IconPlus color="#adb5bd" size={40} style={{ margin: '0 auto', display: 'block' }} />
                                    <Text c="dimmed" size="xs" mt={5}>CREATE NEW</Text>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            <style jsx global>{`
                @keyframes floatIn {
                    0% { transform: translateZ(-50px) scale(0.8); opacity: 0; }
                    100% { transform: translateZ(0) scale(1); opacity: 1; }
                }
            `}</style>
        </Box>
    );
}

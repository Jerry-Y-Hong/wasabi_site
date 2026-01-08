'use client';

import {
    Container,
    Title,
    Text,
    Table,
    Paper,
    Stack,
    Group,
    Box,
    Button,
    Divider,
    Badge,
    Alert,
    Loader,
    Center,
    Grid,
    SimpleGrid,
    ThemeIcon
} from '@mantine/core';
import {
    IconChevronLeft,
    IconInfoCircle,
    IconCheck,
    IconTools,
    IconWorld,
    IconHome
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { useState, useEffect } from 'react';
import { getHardwareBom } from '@/lib/actions';

export default function HardwarePage() {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [parts, setParts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        async function load() {
            const data = await getHardwareBom();
            setParts(data || []);
            setLoading(false);
        }
        load();
    }, []);

    if (!mounted) return null;

    const CATEGORIES = [
        { key: 'Hydraulics', title: t('hw_cat_1') },
        { key: 'Valves', title: t('hw_cat_2') },
        { key: 'Sensors', title: t('hw_cat_3') },
        { key: 'Cooling', title: t('hw_cat_4') },
        { key: 'Cultivation', title: t('hw_cat_5') },
        { key: 'Structure', title: t('hw_cat_6') },
        { key: 'Consumables', title: t('hw_cat_7') },
        { key: 'Control', title: 'Controller & Electric' }
    ];

    return (
        <Container size="lg" py={40}>
            <Stack gap="xl">
                {/* Top Quick Navigation */}
                <Group justify="space-between">
                    <Button
                        component={Link}
                        href="/"
                        variant="subtle"
                        color="gray"
                        size="xs"
                        leftSection={<IconHome size={14} />}
                    >
                        {t('nav_home')}
                    </Button>
                </Group>

                {/* Header */}
                <Box ta="center">
                    <Badge size="lg" variant="filled" color="lime" mb="sm">K-Hardware Core</Badge>
                    <Title order={1} size={42} fw={900}>{t('hw_title')}</Title>
                    <Text size="lg" c="dimmed" mt="md" maw={800} mx="auto">
                        {t('hw_desc')}
                    </Text>
                </Box>

                {/* AU Target Spotlight (Show only for English/Global users) */}
                {mounted && t('hw_au_badge') && (
                    <Paper withBorder p="xl" radius="lg" style={{
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        borderLeft: '5px solid #00008b' // Deep blue for AU feel
                    }}>
                        <Grid align="center">
                            <Grid.Col span={{ base: 12, md: 8 }}>
                                <Group gap="sm" mb="xs">
                                    <Badge color="blue" variant="filled">{t('hw_au_badge')}</Badge>
                                    <Text fw={700}>{t('hw_au_title')}</Text>
                                </Group>
                                <Title order={3} mb="sm" size="h2" style={{ letterSpacing: -1 }}>
                                    Tailored for Australia's <Text span c="blue" inherit>Premium Quality</Text> Standards
                                </Title>
                                <Text size="md" c="dimmed" mb="lg">
                                    {t('hw_au_market_desc')}
                                </Text>
                                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                                    <Group gap="xs">
                                        <ThemeIcon size="xs" radius="xl" color="blue"><IconCheck size={12} /></ThemeIcon>
                                        <Text size="xs" fw={500}>{t('hw_au_feature_1')}</Text>
                                    </Group>
                                    <Group gap="xs">
                                        <ThemeIcon size="xs" radius="xl" color="blue"><IconCheck size={12} /></ThemeIcon>
                                        <Text size="xs" fw={500}>{t('hw_au_feature_2')}</Text>
                                    </Group>
                                    <Group gap="xs">
                                        <ThemeIcon size="xs" radius="xl" color="blue"><IconCheck size={12} /></ThemeIcon>
                                        <Text size="xs" fw={500}>{t('hw_au_feature_3')}</Text>
                                    </Group>
                                </SimpleGrid>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 4 }} ta="center">
                                <Box style={{ opacity: 0.1, position: 'absolute', right: 20, top: 20 }}>
                                    <IconWorld size={120} />
                                </Box>
                                <Button
                                    component={Link}
                                    href="/partnership"
                                    color="blue"
                                    size="lg"
                                    radius="md"
                                    fullWidth
                                >
                                    Request AU Partnership
                                </Button>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                )}

                <Divider />

                {/* Highlight Alert */}
                <Alert variant="light" color="blue" title={t('hw_tech_point')} icon={<IconInfoCircle />}>
                    <Stack gap="xs">
                        <Group gap="xs">
                            <IconCheck size={16} color="blue" />
                            <Text size="sm">{t('hw_tech_p1')}</Text>
                        </Group>
                        <Group gap="xs">
                            <IconCheck size={16} color="blue" />
                            <Text size="sm">{t('hw_tech_p2')}</Text>
                        </Group>
                    </Stack>
                </Alert>

                {/* BOM Section */}
                <Box>
                    <Group justify="space-between" mb="md" align="flex-end">
                        <Box>
                            <Title order={2} size="h3">{t('hw_bom_title')}</Title>
                            <Text size="xs" c="dimmed">{t('hw_bom_subtitle')}</Text>
                        </Box>
                    </Group>

                    {loading ? (
                        <Center py={60}><Loader color="teal" /></Center>
                    ) : (
                        <Stack gap="xl">
                            {CATEGORIES.map((cat) => {
                                const categoryParts = parts.filter(p => p.category === cat.key);
                                if (categoryParts.length === 0) return null;

                                return (
                                    <Paper key={cat.key} withBorder radius="md" p={0} style={{ overflow: 'hidden' }}>
                                        <Box bg={cat.key === 'Cooling' ? 'blue.0' : 'gray.1'} p="xs">
                                            <Text fw={700} size="sm" c={cat.key === 'Cooling' ? 'blue.9' : 'dark.7'}>
                                                {cat.title}
                                            </Text>
                                        </Box>
                                        <Table striped verticalSpacing="sm">
                                            <Table.Thead bg="gray.0">
                                                <Table.Tr>
                                                    <Table.Th w="25%">{t('hw_col_item')}</Table.Th>
                                                    <Table.Th w="35%">{t('hw_col_spec')}</Table.Th>
                                                    <Table.Th w="25%">{t('hw_col_maker')}</Table.Th>
                                                    <Table.Th w="15%" ta="right">{t('hw_col_qty')}</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {categoryParts.map((p) => (
                                                    <Table.Tr key={p.id}>
                                                        <Table.Td fw={700}>{p.name}</Table.Td>
                                                        <Table.Td>
                                                            <Text size="sm">{p.spec}</Text>
                                                        </Table.Td>
                                                        <Table.Td>
                                                            <Text size="xs" c="dimmed">{p.maker}</Text>
                                                        </Table.Td>
                                                        <Table.Td ta="right">
                                                            <Text size="sm" fw={700}>{p.quantity || 1} EA</Text>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    </Paper>
                                );
                            })}

                            {parts.length === 0 && (
                                <Paper p="xl" withBorder ta="center" c="dimmed">
                                    <IconTools size={40} stroke={1.5} style={{ marginBottom: 10 }} />
                                    <Text>{t('hw_no_parts')}</Text>
                                </Paper>
                            )}
                        </Stack>
                    )}
                </Box>

                {/* Content Footer Navigation */}
                <Divider />
                <Group justify="space-between" mt="xl">
                    <Group>
                        <Button
                            component={Link}
                            href="/"
                            variant="light"
                            color="gray"
                            leftSection={<IconHome size={16} />}
                        >
                            {t('nav_home')}
                        </Button>
                        <Button
                            component={Link}
                            href="/smartfarm"
                            variant="subtle"
                            color="gray"
                            leftSection={<IconChevronLeft size={16} />}
                        >
                            {t('sf_back')}
                        </Button>
                    </Group>
                    <Button
                        component={Link}
                        href="/contact"
                        color="lime"
                        size="md"
                    >
                        {t('sf_contact')}
                    </Button>
                </Group>
            </Stack>
        </Container>
    );
}

'use client';

import {
    Container,
    Title,
    Text,
    Stack,
    Group,
    Box,
    Button,
    Divider,
    Badge,
    Grid,
    SimpleGrid,
    ThemeIcon,
    Paper,
    Card,
    Image,
    List,
    Stepper,
    Select,
    Center,
    rem,
    NumberInput,
    Table as MantineTable
} from '@mantine/core';
import {
    IconCheck,
    IconHome,
    IconApps,
    IconLayoutGrid,
    IconTree,
    IconWindow,
    IconChevronLeft,
    IconPackage,
    IconHammer,
    IconSteeringWheel,
    IconListDetails,
    IconArrowRight
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { useState, useEffect } from 'react';

export default function ModularSystemPage() {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;


    return (
        <Container size="lg" py={60}>
            <Stack gap={50}>
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
                        {t('md_home')}
                    </Button>
                </Group>

                {/* Hero Section */}
                <Box ta="center">
                    <Badge size="xl" variant="gradient" gradient={{ from: 'teal', to: 'lime' }} mb="md">
                        {t('md_hero_badge')}
                    </Badge>
                    <Title order={1} size={48} fw={900} style={{ letterSpacing: -1 }}>
                        {t('md_hero_title')}
                    </Title>
                    <Text size="xl" c="dimmed" mt="lg" maw={800} mx="auto">
                        {t('md_hero_desc')}
                    </Text>
                    <Group justify="center" mt="md" gap="xs">
                        <Badge color="blue" variant="light">{t('md_std_1500')}</Badge>
                        <Badge color="orange" variant="light">{t('md_prm_2100')}</Badge>
                    </Group>
                    <Badge color="red" variant="dot" size="lg" mt="md">
                        {t('md_moq_note')}
                    </Badge>
                </Box>

                {/* Bottom Hub: The Brain & Heart Section */}
                <Paper withBorder p={40} radius="lg" style={{ borderRight: '5px solid var(--mantine-color-blue-6)' }}>
                    <Grid align="center" gutter={40}>
                        <Grid.Col span={{ base: 12, md: 7 }}>
                            <Image
                                src="https://images.unsplash.com/photo-1558444479-c8f01052478d?auto=format&fit=crop&q=80&w=1000"
                                radius="md"
                                alt={t('md_alt_hub')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 5 }}>
                            <Badge color="blue" mb="sm">{t('md_brain_badge')}</Badge>
                            <Title order={2} mb="md">{t('md_brain_title')}</Title>
                            <Text size="lg" mb="xl">
                                {t('md_brain_desc')}
                            </Text>
                            <List spacing="sm">
                                <List.Item icon={<ThemeIcon color="blue" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>}>
                                    <b>{t('md_brain_item1_label')}</b>: {t('md_brain_item1_desc')}
                                </List.Item>
                                <List.Item icon={<ThemeIcon color="blue" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>}>
                                    <b>{t('md_brain_item2_label')}</b>: {t('md_brain_item2_desc')}
                                </List.Item>
                                <List.Item icon={<ThemeIcon color="blue" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>}>
                                    <b>{t('md_brain_item3_label')}</b>: {t('md_brain_item3_desc')}
                                </List.Item>
                                <List.Item icon={<ThemeIcon color="gray" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>}>
                                    <Text c="dimmed"><b>{t('md_brain_item4_label')}</b>: {t('md_brain_item4_desc')}</Text>
                                </List.Item>
                            </List>
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* Vertical Stacking Configuration Section */}
                <Box py={40}>
                    <Title order={2} ta="center" mb={40}>{t('md_scale_title')}</Title>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={40}>
                        <Paper withBorder p="xl" radius="lg" style={{ textAlign: 'center' }}>
                            <Badge color="blue" mb="md">{t('md_scale_std_badge')}</Badge>
                            <Title order={3} mb="sm">{t('md_scale_std_title')}</Title>
                            <Text size="sm" c="dimmed" mb="xl">{t('md_scale_std_desc')}</Text>
                            <Divider mb="xl" label={t('md_scale_std_dim')} labelPosition="center" />
                            <Stack gap="xs" align="center">
                                <Box bg="gray.2" h={35} w={100} style={{ borderRadius: '4px' }}>{t('md_unit_hub_lite')}</Box>
                                <Box bg="teal.1" h={60} w={100} style={{ border: '2px solid var(--mantine-color-teal-6)', borderRadius: '4px' }}>{t('md_unit_grow')}</Box>
                                <Box bg="teal.1" h={60} w={100} style={{ border: '2px solid var(--mantine-color-teal-6)', borderRadius: '4px' }}>{t('md_unit_grow')}</Box>
                            </Stack>
                        </Paper>

                        <Paper withBorder p="xl" radius="lg" style={{ textAlign: 'center' }}>
                            <Badge color="orange" mb="md">{t('md_scale_prm_badge')}</Badge>
                            <Title order={3} mb="sm">{t('md_scale_prm_title')}</Title>
                            <Text size="sm" c="dimmed" mb="xl">{t('md_scale_prm_desc')}</Text>
                            <Divider mb="xl" label={t('md_scale_prm_dim')} labelPosition="center" />
                            <Stack gap="xs" align="center">
                                <Box bg="gray.2" h={50} w={100} style={{ borderRadius: '4px' }}>{t('md_unit_hub_pro')}</Box>
                                <Box bg="teal.1" h={60} w={100} style={{ border: '2px solid var(--mantine-color-teal-6)', borderRadius: '4px' }}>{t('md_unit_grow')}</Box>
                                <Box bg="teal.1" h={60} w={100} style={{ border: '2px solid var(--mantine-color-teal-6)', borderRadius: '4px' }}>{t('md_unit_grow')}</Box>
                                <Box bg="teal.1" h={60} w={100} style={{ border: '2px solid var(--mantine-color-teal-6)', borderRadius: '4px' }}>{t('md_unit_grow')}</Box>
                            </Stack>
                        </Paper>
                    </SimpleGrid>
                    <Center mt={50}>
                        <Button
                            size="xl"
                            variant="gradient"
                            gradient={{ from: 'wasabi.6', to: 'teal.6', deg: 135 }}
                            radius="md"
                            component={Link}
                            href="/smartfarm/modular/assembly"
                            leftSection={<IconPackage size={24} />}
                            style={{ boxShadow: '0 10px 30px rgba(138, 196, 60, 0.3)' }}
                        >
                            {t('md_btn_visual_assembly')}
                        </Button>
                    </Center>
                </Box>

                {/* Bottom Hub: The Brain & Heart Section */}
                <Paper withBorder p={40} radius="lg" bg="var(--mantine-color-wasabi-0)">
                    <Stack gap="xl">
                        <Box ta="center">
                            <Badge color="orange" size="lg" mb="sm">{t('md_scale_economy_badge')}</Badge>
                            <Title order={2}>{t('md_scale_economy_title')}</Title>
                            <Text c="dimmed">{t('md_scale_economy_desc')}</Text>
                        </Box>

                        <Grid gutter={40} align="center">
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Stack gap="md">
                                    <Paper p="md" withBorder radius="md" bg="blue.0" style={{ borderColor: 'var(--mantine-color-blue-4)' }}>
                                        <Group justify="space-between">
                                            <Text fw={700} c="blue">{t('md_pack_duo_title')}</Text>
                                            <Badge color="blue">{t('md_pack_duo_badge')}</Badge>
                                        </Group>
                                        <Text size="sm" mt="xs">{t('md_pack_duo_desc')}</Text>
                                        <Text size="xs" c="dimmed">{t('md_pack_duo_sub')}</Text>
                                        <Divider my="sm" />
                                        <Text size="xs" c="dimmed">{t('md_pack_duo_price')}</Text>
                                    </Paper>
                                    <Paper p="md" withBorder radius="md" bg="white">
                                        <Text fw={700} c="orange">{t('md_pack_exp_title')}</Text>
                                        <Text size="sm">{t('md_pack_exp_desc')}</Text>
                                        <Divider my="sm" />
                                        <Text size="xs" c="orange" fw={700}>{t('md_pack_exp_price')}</Text>
                                    </Paper>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Image
                                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000"
                                    radius="md"
                                    alt={t('md_alt_pillar')}
                                />
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Paper>

                {/* DIY Concept Section */}
                <Paper withBorder p={40} radius="lg" style={{ borderLeft: '5px solid var(--mantine-color-teal-6)' }}>
                    <Grid align="center" gutter={40}>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Image
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
                                radius="md"
                                alt={t('md_alt_diy')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Badge color="teal" mb="sm">{t('md_diy_badge')}</Badge>
                            <Title order={2} mb="md">{t('md_diy_title')}</Title>
                            <Text size="lg" mb="xl" c="dimmed">
                                {t('md_diy_desc')}
                            </Text>
                            <Group>
                                <ThemeIcon size="xl" radius="md" color="teal" variant="light">
                                    <IconPackage size={24} />
                                </ThemeIcon>
                                <Box>
                                    <Text fw={700}>{t('md_diy_logistics_title')}</Text>
                                    <Text size="xs" c="dimmed">{t('md_diy_logistics_desc')}</Text>
                                </Box>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* Atomic Module Concept (600x600) */}
                <Paper withBorder p={40} radius="lg" bg="gray.0">
                    <Grid align="center" gutter={40}>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Badge color="orange" mb="sm">{t('md_atomic_badge')}</Badge>
                            <Title order={2} mb="md">{t('md_atomic_title')}</Title>
                            <Text size="lg" mb="xl">
                                {t('md_atomic_desc')}
                            </Text>
                            <List
                                spacing="sm"
                                size="md"
                                center
                                icon={
                                    <ThemeIcon color="orange" size={24} radius="xl">
                                        <IconCheck size={rem(16)} />
                                    </ThemeIcon>
                                }
                            >
                                <List.Item><b>{t('md_atomic_item1')}</b></List.Item>
                                <List.Item><b>{t('md_atomic_item2')}</b></List.Item>
                                <List.Item><b>{t('md_atomic_item3')}</b></List.Item>
                            </List>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Image
                                src="https://images.unsplash.com/photo-1592150621344-3a5390918903?auto=format&fit=crop&q=80&w=1000"
                                radius="md"
                                alt={t('md_alt_module')}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* Customization (Material/Case) Section */}
                <Box>
                    <Title order={2} ta="center" mb={40}>{t('md_custom_title')}</Title>
                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                        {/* Glass/PC Option */}
                        <Card shadow="sm" radius="md" p="xl" withBorder>
                            <ThemeIcon size={50} radius="md" color="blue" variant="light" mb="md">
                                <IconWindow size={30} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">{t('md_custom_glass_title')}</Text>
                            <Text size="sm" c="dimmed">
                                {t('md_custom_glass_desc')}
                            </Text>
                        </Card>

                        {/* Premium Wood Option */}
                        <Card shadow="sm" radius="md" p="xl" withBorder>
                            <ThemeIcon size={50} radius="md" color="orange" variant="light" mb="md">
                                <IconTree size={30} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">{t('md_custom_wood_title')}</Text>
                            <Text size="sm" c="dimmed">
                                {t('md_custom_wood_desc')}
                            </Text>
                        </Card>

                        {/* Industrial Aluminum Option */}
                        <Card shadow="sm" radius="md" p="xl" withBorder>
                            <ThemeIcon size={50} radius="md" color="gray" variant="light" mb="md">
                                <IconHammer size={30} />
                            </ThemeIcon>
                            <Text fw={700} size="lg" mb="xs">{t('md_custom_easy_title')}</Text>
                            <Text size="sm" c="dimmed">
                                {t('md_custom_easy_desc')}
                            </Text>
                        </Card>
                    </SimpleGrid>
                </Box>

                {/* Modular Configurator Section */}
                <Paper withBorder p={40} radius="lg" shadow="md">
                    <Stack gap="xl">
                        <Box ta="center">
                            <Badge color="teal" size="lg" mb="sm">{t('md_sim_badge')}</Badge>
                            <Title order={2}>{t('md_sim_title')}</Title>
                            <Text c="dimmed">{t('md_sim_desc')}</Text>
                        </Box>

                        <Grid gutter={40}>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Stack gap="lg">
                                    <Select
                                        label={t('md_sim_height_label')}
                                        description={t('md_sim_height_desc')}
                                        data={[
                                            { value: '1500', label: t('md_std_1500') },
                                            { value: '2100', label: t('md_prm_2100') },
                                        ]}
                                        defaultValue="1500"
                                        size="md"
                                        id="config-height"
                                    />
                                    <Select
                                        label={t('md_sim_crop_label')}
                                        description={t('md_sim_crop_desc')}
                                        data={[
                                            { value: 'lettuce', label: t('md_crop_lettuce') },
                                            { value: 'basil', label: t('md_crop_basil') },
                                            { value: 'wasabi', label: t('md_crop_wasabi') },
                                        ]}
                                        defaultValue="lettuce"
                                        size="md"
                                        id="config-crop"
                                        mb="md"
                                    />
                                    <Select
                                        label={t('md_sim_finish_label')}
                                        description={t('md_sim_finish_desc')}
                                        data={[
                                            { value: 'wood', label: t('md_custom_wood_title') },
                                            { value: 'glass', label: t('md_custom_glass_title') },
                                            { value: 'metal', label: t('md_custom_metal_title') },
                                        ]}
                                        defaultValue="wood"
                                        size="md"
                                        id="config-skin"
                                    />
                                    <NumberInput
                                        label={t('md_sim_qty_label')}
                                        min={1}
                                        defaultValue={1}
                                        size="md"
                                        id="config-qty"
                                    />
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6 }}>
                                <Paper bg="gray.0" p="xl" radius="md" h="100%">
                                    <Stack gap="md" h="100%" justify="center">
                                        <Group justify="space-between">
                                            <Text fw={500}>{t('md_sim_cost_label')}</Text>
                                            <Text fw={900} size="xl" c="teal">{t('md_sim_val_total')}</Text>
                                        </Group>
                                        <Divider />
                                        <Group justify="space-between">
                                            <Text size="sm">{t('md_sim_roi_label')}</Text>
                                            <Text size="sm" fw={700}>{t('md_sim_val_crop')}</Text>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text size="sm">{t('md_sim_opex_label')}</Text>
                                            <Text size="sm" fw={700} c="red">{t('md_sim_val_opex')}</Text>
                                        </Group>
                                        <Box mt="xl" p="md" bg="teal.6" style={{ borderRadius: '8px', color: 'white' }} ta="center">
                                            <Text size="sm" fw={500} style={{ opacity: 0.9 }}>{t('md_sim_roi_period_label')}</Text>
                                            <Text size="24px" fw={900}>{t('md_sim_roi_period_val')}</Text>
                                        </Box>
                                        <Text size="xs" c="dimmed" ta="center" mt="xs">
                                            {t('md_sim_note')}
                                        </Text>
                                    </Stack>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Paper>

                {/* Features List */}
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
                    <Paper p="lg" withBorder radius="md">
                        <Group>
                            <ThemeIcon size={40} variant="light" color="teal"><IconPackage size={24} /></ThemeIcon>
                            <Text fw={700}>{t('md_feat_diy')}</Text>
                        </Group>
                    </Paper>
                    <Paper p="lg" withBorder radius="md">
                        <Group>
                            <ThemeIcon size={40} variant="light" color="teal"><IconApps size={24} /></ThemeIcon>
                            <Text fw={700}>{t('md_feat_expand')}</Text>
                        </Group>
                    </Paper>
                    <Paper p="lg" withBorder radius="md">
                        <Group>
                            <ThemeIcon size={40} variant="light" color="teal"><IconCheck size={24} /></ThemeIcon>
                            <Text fw={700}>{t('md_feat_interior')}</Text>
                        </Group>
                    </Paper>
                    <Paper p="lg" withBorder radius="md">
                        <Group>
                            <ThemeIcon size={40} variant="light" color="teal"><IconCheck size={24} /></ThemeIcon>
                            <Text fw={700}>{t('md_feat_noise')}</Text>
                        </Group>
                    </Paper>
                </SimpleGrid>

                {/* Call to Action */}
                <Paper p={50} radius="lg" style={{
                    background: 'linear-gradient(45deg, var(--mantine-color-teal-9) 0%, var(--mantine-color-lime-7) 100%)',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <Title order={2} mb="md">{t('md_cta_title')}</Title>
                    <Text mb="xl" opacity={0.9}>
                        {t('md_cta_desc')}
                    </Text>
                    <Button
                        component={Link}
                        href="/contact"
                        size="xl"
                        variant="white"
                        color="teal"
                        radius="md"
                    >
                        {t('md_cta_btn')}
                    </Button>
                </Paper>

                {/* Technical Exploded View & Detail BOM */}
                <Paper withBorder p={40} radius="lg">
                    <Stack gap="xl">
                        <Box ta="center">
                            <Badge color="blue" mb="sm">{t('md_tech_badge')}</Badge>
                            <Title order={2}>{t('md_tech_title')}</Title>
                            <Text c="dimmed">{t('md_tech_desc')}</Text>
                        </Box>

                        <Grid gutter={40} align="center">
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Image
                                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000"
                                    radius="md"
                                    alt={t('md_alt_tech')}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <MantineTable verticalSpacing="sm">
                                    <MantineTable.Thead>
                                        <MantineTable.Tr>
                                            <MantineTable.Th>{t('md_bom_col_comp')}</MantineTable.Th>
                                            <MantineTable.Th>{t('md_bom_col_spec')}</MantineTable.Th>
                                        </MantineTable.Tr>
                                    </MantineTable.Thead>
                                    <MantineTable.Tbody>
                                        <MantineTable.Tr>
                                            <MantineTable.Td fw={600}>{t('md_bom_item1')}</MantineTable.Td>
                                            <MantineTable.Td>{t('md_bom_spec1')}</MantineTable.Td>
                                        </MantineTable.Tr>
                                        <MantineTable.Tr>
                                            <MantineTable.Td fw={600}>{t('md_bom_item2')}</MantineTable.Td>
                                            <MantineTable.Td>{t('md_bom_spec2')}</MantineTable.Td>
                                        </MantineTable.Tr>
                                        <MantineTable.Tr>
                                            <MantineTable.Td fw={600}>{t('md_bom_item3')}</MantineTable.Td>
                                            <MantineTable.Td>{t('md_bom_spec3')}</MantineTable.Td>
                                        </MantineTable.Tr>
                                        <MantineTable.Tr>
                                            <MantineTable.Td fw={600}>{t('md_bom_item4')}</MantineTable.Td>
                                            <MantineTable.Td>{t('md_bom_spec4')}</MantineTable.Td>
                                        </MantineTable.Tr>
                                    </MantineTable.Tbody>
                                </MantineTable>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Paper>

                {/* Interactive Assembly Simulation */}
                <Box py={40}>
                    <Box ta="center" mb={50}>
                        <Badge color="teal" size="lg" mb="sm">{t('md_step_title')}</Badge>
                        <Title order={2}>{t('md_step_title')}</Title>
                        <Text c="dimmed">{t('md_step_desc')}</Text>
                    </Box>

                    <Stepper active={activeStep} onStepClick={setActiveStep} color="wasabi.6">
                        <Stepper.Step label={t('md_step1_label')} description={t('md_step1_desc_short')}>
                            <SimpleGrid cols={{ base: 1, md: 2 }} mt="xl">
                                <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" radius="md" alt={t('md_step1_title')} />
                                <Stack gap="md">
                                    <Title order={3}>{t('md_step1_title')}</Title>
                                    <Text>{t('md_step1_content')}</Text>
                                    <List spacing="xs" icon={<ThemeIcon color="wasabi.6" size={18} radius="xl"><IconCheck size={12} /></ThemeIcon>}>
                                        <List.Item>{t('md_step1_item1')}</List.Item>
                                        <List.Item>{t('md_step1_item2')}</List.Item>
                                    </List>
                                </Stack>
                            </SimpleGrid>
                        </Stepper.Step>

                        <Stepper.Step label={t('md_step2_label')} description={t('md_step2_desc_short')}>
                            <SimpleGrid cols={{ base: 1, md: 2 }} mt="xl">
                                <Stack gap="md">
                                    <Title order={3}>{t('md_step2_title')}</Title>
                                    <Text>{t('md_step2_content')}</Text>
                                    <List spacing="xs" icon={<ThemeIcon color="wasabi.6" size={18} radius="xl"><IconCheck size={12} /></ThemeIcon>}>
                                        <List.Item>{t('md_step2_item1')}</List.Item>
                                        <List.Item>{t('md_step2_item2')}</List.Item>
                                    </List>
                                </Stack>
                                <Image src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" radius="md" alt={t('md_step2_title')} />
                            </SimpleGrid>
                        </Stepper.Step>

                        <Stepper.Step label={t('md_step3_label')} description={t('md_step3_desc_short')}>
                            <SimpleGrid cols={{ base: 1, md: 2 }} mt="xl">
                                <Image src="https://images.unsplash.com/photo-1558444479-c8f01052478d?auto=format&fit=crop&q=80&w=800" radius="md" alt={t('md_step3_title')} />
                                <Stack gap="md">
                                    <Title order={3}>{t('md_step3_title')}</Title>
                                    <Text>{t('md_step3_content')}</Text>
                                    <List spacing="xs" icon={<ThemeIcon color="wasabi.6" size={18} radius="xl"><IconCheck size={12} /></ThemeIcon>}>
                                        <List.Item>{t('md_step3_item1')}</List.Item>
                                        <List.Item>{t('md_step3_item2')}</List.Item>
                                    </List>
                                </Stack>
                            </SimpleGrid>
                        </Stepper.Step>

                        <Stepper.Step label={t('md_step4_label')} description={t('md_step4_desc_short')}>
                            <Paper withBorder shadow="xl" p="xs" radius="lg" mt="xl" bg="dark.8" style={{ border: '2px solid var(--mantine-color-wasabi-6)' }}>
                                <Grid align="center" gutter={0}>
                                    <Grid.Col span={{ base: 12, md: 7 }}>
                                        <Image
                                            src="https://images.unsplash.com/photo-1592150621344-3a5390918903?auto=format&fit=crop&q=80&w=800"
                                            radius="md"
                                            alt={t('md_step4_title')}
                                            style={{ boxShadow: '0 0 50px rgba(138, 196, 60, 0.2)' }}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 5 }}>
                                        <Stack p="xl" gap="xl">
                                            <Box>
                                                <Badge
                                                    size="xl"
                                                    variant="gradient"
                                                    gradient={{ from: 'wasabi.6', to: 'teal.6', deg: 105 }}
                                                >
                                                    {t('md_step7_badge')}
                                                </Badge>
                                                <Title order={1} mt="md" c="white">
                                                    {t('md_step4_title')}
                                                </Title>
                                            </Box>
                                            <Text size="lg" c="gray.4" style={{ lineHeight: 1.6 }}>
                                                {t('md_step4_content')}<br />
                                                <Text size="md" mt="xs" c="wasabi.4">{t('md_step7_note_val')}</Text>
                                            </Text>
                                            <Group mt="lg">
                                                <Button size="xl" color="wasabi" variant="filled" leftSection={<IconCheck />}>
                                                    {t('ir_btn_contact')}
                                                </Button>
                                            </Group>
                                        </Stack>
                                    </Grid.Col>
                                </Grid>
                            </Paper>
                        </Stepper.Step>
                    </Stepper>

                    <Group justify="center" mt="xl">
                        <Button variant="outline" color="gray" onClick={() => setActiveStep((p) => Math.max(0, p - 1))}>{t('doc_back_list')}</Button>
                        <Button color="wasabi" size="lg" onClick={() => setActiveStep((p) => Math.min(3, p + 1))}>
                            {activeStep === 3 ? t('ir_btn_contact') : t('btn_more')}
                        </Button>
                    </Group>
                </Box>

                {/* Content Footer Navigation */}
                <Divider />
                <Group justify="space-between" mt="xl">
                    <Button
                        component={Link}
                        href="/smartfarm"
                        variant="subtle"
                        color="gray"
                        leftSection={<IconChevronLeft size={16} />}
                    >
                        {t('md_back_sf')}
                    </Button>
                </Group>
            </Stack>
        </Container>
    );
}

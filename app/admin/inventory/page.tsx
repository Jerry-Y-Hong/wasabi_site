'use client';

import {
    Container,
    Title,
    Text,
    Group,
    Stack,
    Card,
    Badge,
    Button,
    SimpleGrid,
    ThemeIcon,
    Divider,
    Tabs,
    ActionIcon,
    Modal,
    TextInput,
    Table,
    Paper,
    ScrollArea,
    Select
} from '@mantine/core';
import {
    IconBox,
    IconArrowLeft,
    IconPlus,
    IconEdit,
    IconTrash,
    IconFileDescription,
    IconCheck,
    IconBuildingSkyscraper,
    IconWind,
    IconDroplet,
    IconRobot,
    IconSearch,
    IconExternalLink,
    IconSettings,
    IconRocket
} from '@tabler/icons-react';
import { Switch } from '@mantine/core';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getHunterResults, updateHunterInfo } from '@/lib/actions';
import { notifications } from '@mantine/notifications';
import { useTranslation } from '@/lib/i18n';

export default function InventoryAdmin() {
    const { t } = useTranslation();
    const router = useRouter();

    const PILLARS = useMemo(() => [
        {
            id: 'p1',
            title: t('cons_pillar_1'),
            icon: IconBuildingSkyscraper,
            color: 'blue',
            specs: [t('cons_label_arch'), t('cons_label_sys'), t('cons_label_medium')]
        },
        {
            id: 'p2',
            title: t('cons_pillar_2'),
            icon: IconWind,
            color: 'teal',
            specs: [t('cons_label_hvac_1'), t('cons_label_hvac_2'), t('cons_label_airflow')]
        },
        {
            id: 'p3',
            title: t('cons_pillar_3'),
            icon: IconDroplet,
            color: 'cyan',
            specs: [t('cons_label_nutrient'), t('cons_label_irrigation'), t('cons_label_lighting')]
        },
        {
            id: 'p4',
            title: t('cons_pillar_4'),
            icon: IconRobot,
            color: 'grape',
            specs: [t('cons_label_software'), t('cons_label_iot'), t('cons_label_robotics')]
        }
    ], [t]);

    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePillar, setActivePillar] = useState('p1');
    const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
    const [editOpened, setEditOpened] = useState(false);
    const [newSpec, setNewSpec] = useState({ label: '', value: '' });

    const loadData = async () => {
        setLoading(true);
        const data = await getHunterResults();
        setPartners(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredPartners = useMemo(() => {
        const pillar = PILLARS.find(p => p.id === activePillar);
        if (!pillar) return [];
        return partners.filter(p => pillar.specs.includes(p.category));
    }, [partners, activePillar]);

    const handleEditSpecs = (partner: any) => {
        setSelectedPartner(JSON.parse(JSON.stringify(partner))); // Deep clone
        setEditOpened(true);
    };

    const handleAddSpec = () => {
        if (!newSpec.label || !newSpec.value) return;
        const updated = { ...selectedPartner };
        updated.techSpecs = [...(updated.techSpecs || []), newSpec];
        setSelectedPartner(updated);
        setNewSpec({ label: '', value: '' });
    };

    const handleRemoveSpec = (index: number) => {
        const updated = { ...selectedPartner };
        updated.techSpecs = updated.techSpecs.filter((_: any, i: number) => i !== index);
        setSelectedPartner(updated);
    };

    const handleSaveSpecs = async () => {
        if (!selectedPartner) return;
        const res = await updateHunterInfo(selectedPartner.id, {
            techSpecs: selectedPartner.techSpecs
        });
        if (res.success) {
            notifications.show({ title: t('admin_inv_success_title'), message: t('admin_inv_success_msg'), color: 'green' });
            setEditOpened(false);
            loadData();
        }
    };

    const handleTogglePublic = async (id: number, current: boolean) => {
        const res = await updateHunterInfo(id, { isPublic: !current });
        if (res.success) {
            notifications.show({
                title: !current ? t('admin_inv_spotlight_on') : t('admin_inv_spotlight_off'),
                message: !current ? t('admin_inv_spotlight_msg_on') : t('admin_inv_spotlight_msg_off'),
                color: !current ? 'green' : 'gray'
            });
            loadData();
        }
    };

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <div>
                        <Badge variant="filled" color="cyan" mb="xs">{t('admin_inv_badge')}</Badge>
                        <Title fw={900} size={32} c="dark.7">{t('admin_inv_title')}</Title>
                        <Text c="dimmed">{t('admin_inv_desc')}</Text>
                    </div>
                    <Button
                        leftSection={<IconArrowLeft size={16} />}
                        variant="subtle"
                        color="gray"
                        onClick={() => router.push('/admin')}
                    >
                        {t('admin_inv_back')}
                    </Button>
                </Group>

                <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
                    {PILLARS.map((p) => (
                        <Card
                            key={p.id}
                            withBorder
                            shadow={activePillar === p.id ? 'md' : 'xs'}
                            p="md"
                            radius="md"
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                transform: activePillar === p.id ? 'translateY(-4px)' : 'none',
                                borderColor: activePillar === p.id ? `var(--mantine-color-${p.color}-filled)` : undefined,
                                borderBottomWidth: activePillar === p.id ? 4 : 1
                            }}
                            onClick={() => setActivePillar(p.id)}
                        >
                            <Stack align="center" gap="xs">
                                <ThemeIcon size={48} radius="md" color={p.color} variant={activePillar === p.id ? 'filled' : 'light'}>
                                    <p.icon size={28} />
                                </ThemeIcon>
                                <Text fw={700} size="sm" ta="center">{p.title}</Text>
                                <Badge color={p.color} variant="outline" size="xs">
                                    {partners.filter(v => p.specs.includes(v.category)).length} {t('admin_inv_vendors')}
                                </Badge>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>

                <Tabs value={activePillar} variant="none">
                    <Tabs.Panel value={activePillar}>
                        <Paper withBorder radius="md" shadow="sm" p={0} style={{ overflow: 'hidden' }}>
                            <Table verticalSpacing="md" highlightOnHover>
                                <Table.Thead bg="gray.0">
                                    <Table.Tr>
                                        <Table.Th style={{ width: 250 }}>{t('admin_inv_col_name')}</Table.Th>
                                        <Table.Th style={{ width: 180 }}>{t('admin_inv_col_specialty')}</Table.Th>
                                        <Table.Th>{t('admin_inv_col_catalogs')}</Table.Th>
                                        <Table.Th>{t('admin_inv_col_specs')}</Table.Th>
                                        <Table.Th style={{ width: 80 }}>{t('admin_inv_col_public')}</Table.Th>
                                        <Table.Th style={{ width: 100 }}>{t('admin_inv_col_actions')}</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredPartners.length === 0 ? (
                                        <Table.Tr>
                                            <Table.Td colSpan={5}>
                                                <Stack align="center" py="xl" c="dimmed">
                                                    <IconSearch size={40} opacity={0.3} />
                                                    <Text size="sm">{t('admin_inv_empty_title')}</Text>
                                                    <Button variant="light" size="xs" onClick={() => router.push('/admin/hunter')}>{t('admin_inv_btn_hunter')}</Button>
                                                </Stack>
                                            </Table.Td>
                                        </Table.Tr>
                                    ) : (
                                        filteredPartners.map((p) => (
                                            <Table.Tr key={p.id}>
                                                <Table.Td>
                                                    <Stack gap={0}>
                                                        <Text fw={700} size="sm">{p.name}</Text>
                                                        <Text size="xs" c="dimmed">{p.url}</Text>
                                                    </Stack>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge size="xs" variant="light" color="cyan">{p.category}</Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group gap={4}>
                                                        {p.catalogs?.map((c: string, i: number) => (
                                                            <ActionIcon
                                                                key={i}
                                                                variant="subtle"
                                                                color="gray"
                                                                component="a"
                                                                href={c}
                                                                target="_blank"
                                                                title={`View Catalog ${i + 1}`}
                                                            >
                                                                <IconFileDescription size={18} />
                                                            </ActionIcon>
                                                        ))}
                                                        {(!p.catalogs || p.catalogs.length === 0) && <Text size="xs" c="dimmed">{t('admin_inv_no_catalogs')}</Text>}
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group gap={4} wrap="wrap">
                                                        {p.techSpecs?.slice(0, 3).map((s: any, i: number) => (
                                                            <Badge key={i} size="xs" variant="dot" color="gray">{s.label}: {s.value}</Badge>
                                                        ))}
                                                        {p.techSpecs && p.techSpecs.length > 3 && (
                                                            <Text size="xs" c="dimmed">+{p.techSpecs.length - 3} {t('admin_inv_more')}</Text>
                                                        )}
                                                        {(!p.techSpecs || p.techSpecs.length === 0) && <Text size="xs" fs="italic" c="dimmed">{t('admin_inv_empty_specs')}</Text>}
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td>
                                                    <ActionIcon
                                                        variant={p.isPublic ? 'filled' : 'light'}
                                                        color={p.isPublic ? 'green' : 'gray'}
                                                        onClick={() => handleTogglePublic(p.id, !!p.isPublic)}
                                                        title={p.isPublic ? 'Publicly Showcased' : 'Make Public'}
                                                    >
                                                        <IconRocket size={16} />
                                                    </ActionIcon>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Button
                                                        variant="light"
                                                        size="compact-xs"
                                                        leftSection={<IconEdit size={12} />}
                                                        color="cyan"
                                                        onClick={() => handleEditSpecs(p)}
                                                    >
                                                        {t('admin_inv_btn_manage')}
                                                    </Button>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Paper>
                    </Tabs.Panel>
                </Tabs>
            </Stack>

            <Modal
                opened={editOpened}
                onClose={() => setEditOpened(false)}
                title={
                    <Group gap="xs">
                        <IconSettings size={20} color="var(--mantine-color-cyan-filled)" />
                        <Text fw={700}>{t('admin_inv_modal_title')}: {selectedPartner?.name}</Text>
                    </Group>
                }
                size="lg"
            >
                <Stack gap="md">
                    <Card withBorder bg="gray.0" radius="md">
                        <Text size="xs" fw={700} c="dimmed" mb="xs">{t('admin_inv_add_title')}</Text>
                        <Group align="flex-end">
                            <TextInput
                                label={t('admin_inv_label_feature')}
                                placeholder={t('admin_inv_ph_feature')}
                                style={{ flex: 1 }}
                                value={newSpec.label}
                                onChange={(e) => setNewSpec({ ...newSpec, label: e.currentTarget.value })}
                            />
                            <TextInput
                                label={t('admin_inv_label_value')}
                                placeholder={t('admin_inv_ph_value')}
                                style={{ flex: 1 }}
                                value={newSpec.value}
                                onChange={(e) => setNewSpec({ ...newSpec, value: e.currentTarget.value })}
                            />
                            <Button color="cyan" onClick={handleAddSpec} leftSection={<IconPlus size={16} />}>{t('admin_inv_btn_add')}</Button>
                        </Group>
                    </Card>

                    <Divider label={t('admin_inv_current_specs')} labelPosition="center" />

                    <ScrollArea h={300} type="always">
                        <Table striped withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>{t('admin_inv_col_feature')}</Table.Th>
                                    <Table.Th>{t('admin_inv_col_value')}</Table.Th>
                                    <Table.Th style={{ width: 60 }}></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {selectedPartner?.techSpecs?.map((s: any, i: number) => (
                                    <Table.Tr key={i}>
                                        <Table.Td><Text size="sm" fw={500}>{s.label}</Text></Table.Td>
                                        <Table.Td><Text size="sm">{s.value}</Text></Table.Td>
                                        <Table.Td>
                                            <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveSpec(i)}>
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                                {(!selectedPartner?.techSpecs || selectedPartner.techSpecs.length === 0) && (
                                    <Table.Tr>
                                        <Table.Td colSpan={3} ta="center" c="dimmed">{t('admin_inv_empty_specs')}</Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>

                    <Group justify="flex-end" mt="md">
                        <Button variant="subtle" color="gray" onClick={() => setEditOpened(false)}>{t('admin_inv_btn_cancel')}</Button>
                        <Button color="cyan" leftSection={<IconCheck size={16} />} onClick={handleSaveSpecs}>{t('admin_inv_btn_save')}</Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}

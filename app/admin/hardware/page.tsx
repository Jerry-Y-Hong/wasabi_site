'use client';

export const dynamic = 'force-dynamic';

import {
    Container,
    Title,
    Text,
    Group,
    Stack,
    Card,
    Badge,
    Button,
    Table,
    Paper,
    ActionIcon,
    Modal,
    TextInput,
    NumberInput,
    Select,
    Divider,
    ScrollArea,
    ThemeIcon,
    Box,
    Combobox,
    useCombobox,
    Input,
    InputBase,
    SimpleGrid,
    Progress
} from '@mantine/core';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconArrowLeft,
    IconSettings,
    IconDeviceFloppy,
    IconCurrencyDollar,
    IconSearch,
    IconTools
} from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getHardwareBom, saveHardwarePart, updateHardwarePart, deleteHardwarePart } from '@/lib/actions';
import { notifications } from '@mantine/notifications';
import { useTranslation } from '@/lib/i18n';

interface HardwareItem {
    id: number;
    category: string;
    name: string;
    spec: string;
    maker: string;
    price: number;
    currency: string;
    quantity: number;
    unit: string;
    updatedAt?: string;
}

const CATEGORIES = [
    { value: 'Hydraulics', label: '유압 및 펌프류' },
    { value: 'Valves', label: '밸브 및 배관' },
    { value: 'Sensors', label: '센서 및 계측기' },
    { value: 'Cooling', label: '냉각 및 살균' },
    { value: 'Cultivation', label: '재배 자재 (토양, 컵)' },
    { value: 'Structure', label: '시설물 (프레임 등)' },
    { value: 'Consumables', label: '소모품 및 기타' },
    { value: 'Control', label: '제어부' }
];

const UNIT_OPTIONS = [
    { value: 'EA', label: 'EA (개)' },
    { value: 'SET', label: 'SET (세트)' },
    { value: 'KG', label: 'KG (킬로그램)' },
    { value: 'PKG', label: 'PKG (패키지)' },
    { value: 'L', label: 'L (리터)' },
    { value: 'M', label: 'M (미터)' },
    { value: 'ROLL', label: 'ROLL (롤)' }
];

export default function HardwareAdmin() {
    const { t } = useTranslation();
    const router = useRouter();
    const [parts, setParts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpened, setModalOpened] = useState(false);
    const [editingPart, setEditingPart] = useState<HardwareItem | null>(null); // Changed type to HardwareItem
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const nameInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<Partial<HardwareItem>>({ // Changed type to Partial<HardwareItem>
        category: 'Hydraulics',
        name: '',
        spec: '',
        maker: '',
        price: 0,
        currency: 'KRW',
        quantity: 1,
        unit: 'EA'
    });

    // Calculate total cost and category breakdown
    const totalCost = (parts || []).reduce((sum, item) => {
        if (!item) return sum;
        return sum + (Number(item.price || 0) * Number(item.quantity || 1));
    }, 0);

    const categoryTotals = (parts || []).reduce((acc, item) => {
        if (!item) return acc;
        const cat = CATEGORIES.find(c => c.value === item.category)?.label || item.category || '기타';
        acc[cat] = (acc[cat] || 0) + (Number(item.price || 0) * Number(item.quantity || 1));
        return acc;
    }, {} as Record<string, number>);

    const loadData = async () => {
        setLoading(true);
        const data = await getHardwareBom();
        setParts(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleOpenAdd = () => {
        setEditingPart(null);
        setForm({
            category: 'Hydraulics',
            name: '',
            spec: '',
            maker: '',
            price: 0,
            currency: 'KRW',
            quantity: 1,
            unit: 'EA'
        });
        setModalOpened(true);
    };

    const handleOpenEdit = (part: HardwareItem) => { // Changed type to HardwareItem
        setEditingPart(part);
        setForm({
            category: part.category || 'Hydraulics',
            name: part.name || '',
            spec: part.spec || '',
            maker: part.maker || '',
            price: part.price || 0,
            quantity: part.quantity || 1,
            unit: part.unit || 'EA',
            currency: part.currency || 'KRW'
        });
        setModalOpened(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.spec) {
            notifications.show({ title: '입력 오류', message: '부품명과 사양은 필수 항목입니다.', color: 'red' });
            return;
        }

        try {
            let success = false;
            if (editingPart) {
                const res: any = await updateHardwarePart(editingPart.id, form);
                if (res.success) {
                    notifications.show({ title: '성공', message: '부품 정보가 수정되었습니다.', color: 'green' });
                    setModalOpened(false);
                    success = true;
                } else {
                    notifications.show({ title: '오류', message: res.error || '수정 중 오류가 발생했습니다.', color: 'red' });
                }
            } else {
                const res: any = await saveHardwarePart(form);
                if (res.success) {
                    notifications.show({
                        title: '자재 등록 성공',
                        message: `[${form.name}] 자재가 추가되었습니다. 엔터를 치면 다음 자재를 계속 입력할 수 있습니다.`,
                        color: 'teal',
                        autoClose: 3000
                    });

                    setForm((prev: Partial<HardwareItem>) => ({
                        ...prev,
                        name: '',
                        spec: '',
                        maker: '',
                        price: 0,
                        quantity: 1,
                        unit: prev.unit // Keep last used unit
                    }));

                    setTimeout(() => nameInputRef.current?.focus(), 150);
                    success = true;
                } else {
                    notifications.show({ title: '실패', message: res.error || '저장에 실패했습니다.', color: 'red' });
                }
            }

            if (success) {
                await loadData();
            }
        } catch (err) {
            console.error('Handle save error:', err);
            notifications.show({ title: '시스템 오류', message: '알 수 없는 오류가 발생했습니다.', color: 'red' });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('이 자재를 삭제하시겠습니까?')) {
            const res = await deleteHardwarePart(id);
            if (res.success) {
                notifications.show({ title: 'Deleted', message: '자재가 삭제되었습니다.', color: 'red' });
                await loadData();
            } else {
                notifications.show({ title: 'Error', message: res.error || '삭제 실패', color: 'red' });
            }
        }
    };

    const filteredParts = parts.filter(p => {
        if (!p) return false;
        const name = (p.name || '').toLowerCase();
        const spec = (p.spec || '').toLowerCase();
        const maker = (p.maker || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            name.includes(search) ||
            spec.includes(search) ||
            maker.includes(search);

        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <Container size="xl" py="xl">
            <Stack gap="xl">
                <Group justify="space-between" align="flex-end">
                    <Stack gap={0}>
                        <Title order={1}>{t('hw_title')}</Title>
                        <Text c="dimmed">{t('hw_desc')}</Text>
                    </Stack>
                    <Group>
                        <Button
                            leftSection={<IconArrowLeft size={16} />}
                            variant="subtle"
                            color="gray"
                            onClick={() => router.push('/admin')}
                        >
                            Back to Admin
                        </Button>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={handleOpenAdd}
                            color="teal"
                        >
                            자재 추가
                        </Button>
                    </Group>
                </Group>

                {/* 비용 요약 대시보드 */}
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                    <Paper withBorder p="md" radius="md" bg="gray.0">
                        <Stack gap="xs">
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">총 예상 원가 (Total BOM)</Text>
                            <Group align="flex-end" gap="xs">
                                <Text size="xl" fw={900}>{totalCost.toLocaleString()}</Text>
                                <Text size="sm" c="dimmed" pb={3}>KRW</Text>
                            </Group>
                            <Progress value={100} color="teal" size="sm" radius="xl" />
                        </Stack>
                    </Paper>

                    <Paper withBorder p="md" radius="md">
                        <Stack gap="xs">
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">카테고리별 비중</Text>
                            <ScrollArea h={60}>
                                <Stack gap={4}>
                                    {Object.entries(categoryTotals).map(([cat, val]) => (
                                        <Group key={cat} justify="space-between">
                                            <Text size="xs">{cat}</Text>
                                            <Text size="xs" fw={700}>{(val as number).toLocaleString()}원</Text>
                                        </Group>
                                    ))}
                                </Stack>
                            </ScrollArea>
                        </Stack>
                    </Paper>

                    <Paper withBorder p="md" radius="md">
                        <Stack gap="xs" justify="center" h="100%">
                            <Text size="xs" c="dimmed" fw={700} tt="uppercase">프로젝트 상태</Text>
                            <Badge size="lg" variant="light" color="blue">Prototype Phase</Badge>
                            <Text size="xs" c="dimmed">냉난방기 제외 최적화 사양 적용됨</Text>
                        </Stack>
                    </Paper>
                </SimpleGrid>

                <Paper p="md" withBorder radius="md">
                    <Group justify="space-between" mb="md">
                        <TextInput
                            placeholder="부품명 또는 사양 검색..."
                            leftSection={<IconSearch size={16} />}
                            style={{ flex: 1 }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select
                            data={[{ value: 'all', label: '전체 카테고리' }, ...CATEGORIES]}
                            value={selectedCategory}
                            onChange={(v) => setSelectedCategory(v || 'all')}
                            style={{ width: 220 }}
                        />
                    </Group>

                    <ScrollArea h={600}>
                        <Table verticalSpacing="md" highlightOnHover striped>
                            <Table.Thead bg="gray.0">
                                <Table.Tr>
                                    <Table.Th>카테고리</Table.Th>
                                    <Table.Th>부품명</Table.Th>
                                    <Table.Th>기술 사양</Table.Th>
                                    <Table.Th>제조사</Table.Th>
                                    <Table.Th>수량</Table.Th>
                                    <Table.Th>단가 (예상)</Table.Th>
                                    <Table.Th style={{ width: 100 }}>관리</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {filteredParts.length === 0 ? (
                                    <Table.Tr>
                                        <Table.Td colSpan={6} ta="center" py="xl" c="dimmed">
                                            등록된 자재가 없거나 검색 결과가 없습니다.
                                        </Table.Td>
                                    </Table.Tr>
                                ) : (
                                    filteredParts.map((p) => (
                                        <Table.Tr key={p.id}>
                                            <Table.Td>
                                                <Badge size="xs" variant="light" color={
                                                    p.category === 'Cooling' ? 'blue' :
                                                        p.category === 'Sensors' ? 'orange' :
                                                            p.category === 'Control' ? 'grape' :
                                                                p.category === 'Cultivation' ? 'lime' :
                                                                    p.category === 'Structure' ? 'cyan' : 'gray'
                                                }>
                                                    {CATEGORIES.find(c => c.value === p.category)?.label || p.category}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td fw={700}>{p.name}</Table.Td>
                                            <Table.Td>
                                                <Text size="sm">{p.spec}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" c="dimmed">{p.maker}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text fw={700} size="sm">{p.quantity || 1} {p.unit || 'EA'}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap={4}>
                                                    <IconCurrencyDollar size={14} color="gray" />
                                                    <Text fw={700} size="sm">
                                                        {p.price?.toLocaleString()}
                                                        <Text component="span" size="xs" c="dimmed" ml={2}>{p.currency}</Text>
                                                    </Text>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap={4}>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="blue"
                                                        onClick={() => handleOpenEdit(p)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <IconEdit size={16} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={() => handleDelete(p.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                )}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            </Stack>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={
                    <Group gap="xs">
                        <ThemeIcon color="teal" variant="light">
                            <IconTools size={18} />
                        </ThemeIcon>
                        <Text fw={700}>{editingPart ? '자재 정보 수정' : '새 자재 등록'}</Text>
                    </Group>
                }
                size="lg"
            >
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <Stack gap="md">
                        <Select
                            label="카테고리"
                            placeholder="선택하거나 직접 입력"
                            data={CATEGORIES}
                            searchable
                            allowDeselect={false}
                            value={form.category}
                            onChange={(v) => setForm({ ...form, category: v || '' })}
                            onSearchChange={(query) => {
                                // If the query doesn't match any category, still allow user to keep it as value
                                if (query && !CATEGORIES.some(c => c.value === query)) {
                                    setForm((prev: Partial<HardwareItem>) => ({ ...prev, category: query }));
                                }
                            }}
                        />
                        <TextInput
                            ref={nameInputRef}
                            label="부품명"
                            placeholder="예: 다단 원심 펌프"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
                        />
                        <TextInput
                            label="기술 사양"
                            placeholder="예: STS304, 15㎥/h, 양정 40m"
                            required
                            value={form.spec}
                            onChange={(e) => setForm({ ...form, spec: e.currentTarget.value })}
                        />
                        <TextInput
                            label="추천 제조사 / 비고"
                            placeholder="예: Wilo, Grundfos"
                            value={form.maker}
                            onChange={(e) => setForm({ ...form, maker: e.currentTarget.value })}
                        />
                        <Group grow align="flex-end">
                            <NumberInput
                                label="수량"
                                placeholder="1"
                                min={1}
                                value={form.quantity}
                                onChange={(v) => setForm({ ...form, quantity: Number(v) || 1 })}
                            />
                            <Select
                                label="단위"
                                placeholder="선택/입력"
                                data={UNIT_OPTIONS}
                                value={form.unit}
                                onChange={(v) => setForm({ ...form, unit: v || 'EA' })}
                                searchable
                                onSearchChange={(query) => {
                                    if (query && !UNIT_OPTIONS.some(u => u.value === query)) {
                                        setForm((prev: any) => ({ ...prev, unit: query }));
                                    }
                                }}
                            />
                        </Group>
                        <Group grow>
                            <NumberInput
                                label="단가 (예상)"
                                thousandSeparator=","
                                placeholder="0"
                                value={form.price}
                                onChange={(v) => setForm({ ...form, price: Number(v) || 0 })}
                            />
                            <Select
                                label="통화"
                                data={[
                                    { value: 'KRW', label: 'KRW (₩)' },
                                    { value: 'USD', label: 'USD ($)' },
                                    { value: 'AUD', label: 'AUD (A$)' },
                                    { value: 'JPY', label: 'JPY (¥)' }
                                ]}
                                value={form.currency}
                                onChange={(v) => setForm({ ...form, currency: v || 'KRW' })}
                            />
                        </Group>

                        <Divider mt="md" />

                        <Group justify="flex-end">
                            <Button variant="subtle" color="gray" onClick={() => setModalOpened(false)}>닫기</Button>
                            <Button
                                type="submit"
                                color="teal"
                                leftSection={<IconDeviceFloppy size={18} />}
                            >
                                {editingPart ? '수정 완료' : '저장 및 다음 추가 (Enter)'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Container >
    );
}

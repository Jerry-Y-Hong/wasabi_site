'use client';

import { 
  Card, 
  Table, 
  Stack, 
  Group, 
  Text, 
  Badge, 
  Tooltip, 
  ThemeIcon, 
  ActionIcon, 
  Button, 
  Checkbox, 
  Menu, 
  Pagination 
} from '@mantine/core';
import { 
  IconCircleCheck, 
  IconEdit, 
  IconScan, 
  IconWorld, 
  IconTrash 
} from '@tabler/icons-react';
import { HunterResult } from '../types';
import { useTranslation } from '@/lib/i18n';

interface HunterPipelineTableProps {
  partners: HunterResult[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onPreview: (partner: HunterResult) => void;
  onChangeStatus: (id: number, status: string) => void;
  onChangeCountry: (id: number, country: string) => void;
  onEdit: (partner: HunterResult) => void;
  onScan: (partner: HunterResult) => void;
  onDelete: (id: number) => void;
  APP_STATUS: Record<string, string>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function HunterPipelineTable({
  partners,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onPreview,
  onChangeStatus,
  onChangeCountry,
  onEdit,
  onScan,
  onDelete,
  APP_STATUS,
  currentPage,
  totalPages,
  onPageChange
}: HunterPipelineTableProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="md">
      <Card shadow="sm" radius="lg" withBorder p={0} style={{ overflow: 'hidden' }}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox 
                  size="xs" 
                  onChange={onToggleSelectAll} 
                  checked={partners.length > 0 && partners.every(p => selectedIds.includes(p.id))}
                  indeterminate={partners.some(p => selectedIds.includes(p.id)) && !partners.every(p => selectedIds.includes(p.id))}
                />
              </Table.Th>
              <Table.Th>{t('hunter_table_th_category') || 'Category'}</Table.Th>
              <Table.Th>{t('hunter_table_th_org') || 'Organization'}</Table.Th>
              <Table.Th>{t('hunter_table_th_status') || '상태'}</Table.Th>
              <Table.Th>{t('hunter_table_th_region') || '지역'}</Table.Th>
              <Table.Th>{t('hunter_table_th_contact') || '연락처'}</Table.Th>
              <Table.Th>{t('hunter_table_th_actions') || 'Actions'}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {partners.map((element) => (
              <Table.Tr key={element.id}>
                <Table.Td>
                  <Checkbox 
                    checked={selectedIds.includes(element.id)} 
                    onChange={() => onToggleSelect(element.id)} 
                    size="xs" 
                  />
                </Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Badge variant="dot" size="sm" color="gray">{element.type || 'Other'}</Badge>
                    {element.category && <Badge variant="light" size="xs" color="teal">{element.category}</Badge>}
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Stack gap={0}>
                    <Group gap={4}>
                      <Text
                        fw={700}
                        size="sm"
                        style={{ cursor: 'pointer' }}
                        c="blue.7"
                        onClick={() => onPreview(element)}
                      >
                        {element.name}
                      </Text>
                      {element.aiSummary && (
                        <>
                          <Tooltip label={t('hunter_table_verified') || 'AI 검증 완료 (Verified)'}>
                            <ThemeIcon variant="light" color="wasabi" size="xs" radius="xl">
                              <IconCircleCheck size={10} />
                            </ThemeIcon>
                          </Tooltip>
                          <Badge size="xs" color={element.aiSummary.score >= 10 ? 'grape' : element.aiSummary.score >= 8 ? 'red' : element.aiSummary.score >= 7 ? 'orange' : 'gray'}>
                            {element.aiSummary.score}{t('hunter_table_score') || '점'}
                          </Badge>
                        </>
                      )}
                    </Group>
                    {element.aiSummary && <Text size="xs" c="grape" fw={600} lineClamp={1}>{element.aiSummary.angle}</Text>}
                    <Text size="xs" c="dimmed" lineClamp={1}>{element.url}</Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={150}>
                    <Menu.Target>
                      <Badge 
                        color={element.aiSummary && element.aiSummary.score >= 7 ? (element.aiSummary.score >= 10 ? 'grape' : 'red') : APP_STATUS[element.status || 'New']} 
                        variant={element.aiSummary && element.aiSummary.score >= 7 ? 'filled' : 'light'} 
                        style={{ cursor: 'pointer' }}
                        leftSection={element.aiSummary && <IconCircleCheck size={12} />}
                      >
                        {element.status === 'AI Analyzed' && element.aiSummary && element.aiSummary.score >= 7 ? 'VERIFIED' : (element.status || 'New')}
                      </Badge>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {Object.keys(APP_STATUS).map(s => (
                        <Menu.Item key={s} onClick={() => onChangeStatus(element.id, s)}>{s}</Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={150}>
                    <Menu.Target>
                      <Tooltip label={element.country || 'Global'}>
                        <Badge variant="outline" color="gray" style={{ cursor: 'pointer' }}>
                          {(() => {
                            const name = (element.country || 'Global').toLowerCase();
                            if (name.includes('korea') || name === 'kr') return 'KR';
                            if (name.includes('japan') || name === 'jp') return 'JP';
                            if (name.includes('united states') || name.includes('usa') || name === 'us') return 'US';
                            if (name.includes('china') || name === 'cn') return 'CN';
                            if (name.includes('vietnam') || name === 'vn') return 'VN';
                            if (name.includes('thai') || name === 'th') return 'TH';
                            if (name === 'global') return 'GL';
                            return name.substring(0, 2).toUpperCase();
                          })()}
                        </Badge>
                      </Tooltip>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {['Japan', 'South Korea', 'United States', 'China', 'Global'].map(c => (
                        <Menu.Item key={c} onClick={() => onChangeCountry(element.id, c)}>{c}</Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
                <Table.Td>
                  <Stack gap={0}>
                    {element.email && <Text size="xs" fw={700} c="blue">{element.email}</Text>}
                    <Text size="xs" c="dimmed">{element.phone || element.contact || '-'}</Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <Tooltip label={t('hunter_table_tooltip_edit') || 'Edit Info'}>
                      <ActionIcon size="sm" variant="light" color="blue" onClick={() => onEdit(element)}>
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Button size="compact-xs" variant="light" color="green" onClick={() => onPreview(element)}>
                      {t('hunter_table_btn_proposal') || '제안서'}
                    </Button>
                    <Tooltip label={t('hunter_table_tooltip_scan') || 'Scan Site'}>
                      <ActionIcon size="sm" variant="light" color="grape" onClick={() => onScan(element)}>
                        <IconScan size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={t('hunter_table_tooltip_visit') || 'Visit Website'}>
                      <ActionIcon size="sm" variant="default" component="a" href={element.url} target="_blank">
                        <IconWorld size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={t('hunter_table_tooltip_delete') || 'Delete'}>
                      <ActionIcon size="sm" variant="subtle" color="red" onClick={() => onDelete(element.id)}>
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
            size="sm"
          />
        </Group>
      )}
    </Stack>
  );
}

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
  Button 
} from '@mantine/core';
import { 
  IconCircleCheck, 
  IconPlus, 
  IconScan, 
  IconTrash
} from '@tabler/icons-react';
import { HunterResult } from '../types';
import { useTranslation } from '@/lib/i18n';

interface HunterSearchResultTableProps {
  results: HunterResult[];
  duplicateCount: number;
  loading: boolean;
  onPreview: (partner: HunterResult) => void;
  onSaveToList: (partner: HunterResult) => void;
  onScan: (partner: HunterResult) => void;
  onDismiss: (id: number) => void;
  onLoadMore: () => void;
  onScanAllVisible: () => void;
  onSaveAllVisible: () => void;
  getUrgencyColor: (urgency: string) => string;
}

export default function HunterSearchResultTable({
  results,
  duplicateCount,
  loading,
  onPreview,
  onSaveToList,
  onScan,
  onDismiss,
  onLoadMore,
  onScanAllVisible,
  onSaveAllVisible,
  getUrgencyColor
}: HunterSearchResultTableProps) {
  const { t } = useTranslation();

  if (results.length === 0) return null;

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          {t('hunter_table_found') || '총'} {results.length}{t('hunter_table_found_suffix') || '개의 잠재 파트너를 찾았습니다.'} 
          {duplicateCount > 0 && ` (${duplicateCount}${t('hunter_table_hidden') || '개 숨겨짐'})`}
        </Text>
        <Group gap="xs">
          <Button
            variant="light"
            color="blue"
            size="xs"
            leftSection={<IconScan size={14} />}
            onClick={onScanAllVisible}
          >
            {t('hunter_table_scan_top5') || 'Scan Top 5 Candidates'}
          </Button>
          <Button
            variant="light"
            color="green"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={onSaveAllVisible}
          >
            {t('hunter_table_save_all') || 'Save All Visible'}
          </Button>
        </Group>
      </Group>

      <Card shadow="sm" radius="lg" withBorder p={0} style={{ overflow: 'hidden' }}>
        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('hunter_table_th_category') || 'Category'}</Table.Th>
              <Table.Th>{t('hunter_table_th_org') || 'Organization'}</Table.Th>
              <Table.Th>{t('hunter_table_th_analysis') || 'Analysis / Contact'}</Table.Th>
              <Table.Th w={150}>{t('hunter_table_th_actions') || 'Actions'}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {results.map((element) => (
              <Table.Tr key={element.id}>
                <Table.Td>
                  <Badge variant="dot" size="sm" color="gray">{element.type || 'Other'}</Badge>
                </Table.Td>
                <Table.Td>
                  <Stack gap={0}>
                    <Group gap={8}>
                      <Text
                        fw={700}
                        style={{ cursor: 'pointer' }}
                        c="blue.7"
                        onClick={() => onPreview(element)}
                      >
                        {element.name}
                      </Text>
                      {element.aiSummary && (
                        <Tooltip label={t('hunter_table_verified') || 'AI Verified Partner'}>
                          <ThemeIcon variant="light" color="wasabi" size="sm" radius="xl">
                            <IconCircleCheck size={14} />
                          </ThemeIcon>
                        </Tooltip>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed" lineClamp={1}>{element.url}</Text>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  {element.aiSummary ? (
                    <Stack gap={4}>
                      <Group gap={4}>
                        <Badge
                          color={element.aiSummary.score >= 10 ? 'grape' : element.aiSummary.score >= 8 ? 'red' : element.aiSummary.score >= 7 ? 'orange' : 'gray'}
                          size="xs"
                          variant="filled"
                        >
                          {element.aiSummary.score}{t('hunter_table_score') || '점'}
                        </Badge>
                        {element.aiSummary.industry && (
                          <Badge size="xs" variant="outline" color="gray">
                            {element.aiSummary.industry}
                          </Badge>
                        )}
                      </Group>
                      <Group gap={4}>
                        {element.aiSummary.urgency && (
                          <Badge size="xs" variant="light" color={getUrgencyColor(element.aiSummary.urgency)}>
                            {t('hunter_table_urgency') || '긴급도: '}{element.aiSummary.urgency}
                          </Badge>
                        )}
                        <Text size="xs" fw={700} c="wasabi.8">{element.aiSummary.angle}</Text>
                      </Group>
                      <Text size="xs" fs="italic" lineClamp={1}>"{element.aiSummary.analysis}"</Text>
                    </Stack>
                  ) : (
                    <Text size="xs" c="dimmed">{t('hunter_table_not_scanned') || 'Not scanned yet'}</Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <Tooltip label={t('hunter_table_tooltip_save') || 'Save to Pipeline'}>
                      <ActionIcon variant="light" color="green" onClick={() => onSaveToList(element)}>
                        <IconPlus size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={t('hunter_table_tooltip_scan') || 'Scan Site'}>
                      <ActionIcon variant="light" color="blue" onClick={() => onScan(element)}>
                        <IconScan size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <ActionIcon variant="subtle" color="red" onClick={() => onDismiss(element.id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
      <Button variant="subtle" fullWidth onClick={onLoadMore} loading={loading}>
        {t('hunter_table_btn_load_more') || 'Load More'}
      </Button>
    </Stack>
  );
}

'use client';

import { 
  Card, 
  Stack, 
  Group, 
  Title, 
  SegmentedControl, 
  Select, 
  Button, 
  Menu, 
  Divider, 
  Text 
} from '@mantine/core';
import { 
  IconDownload, 
  IconPlus, 
  IconRefresh, 
  IconScan, 
  IconX, 
  IconRocket, 
  IconCheck 
} from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

interface PipelineFiltersProps {
  pipelineCountryFilter: string;
  setPipelineCountryFilter: (val: string) => void;
  pipelineCategoryFilter: string;
  setPipelineCategoryFilter: (val: string) => void;
  pipelineSpecialtyFilter: string;
  setPipelineSpecialtyFilter: (val: string) => void;
  PARTNER_TYPES: string[];
  SPECIALTIES: string[];
  onImportClick: () => void;
  onAddManual: () => void;
  onFixCountries: () => void;
  bulkCategorizing: boolean;
  onStopScan: () => void;
  onBulkCategorize: () => void;
  selectedCount: number;
  totalFilteredCount: number;
  onClearSelection: () => void;
  onSelectAll: () => void;
  onSelectPage: () => void;
  onBulkSend: () => void;
  bulkSending: boolean;
  onBulkMove: (category: string) => void;
  onBulkSpecialty: (specialty: string) => void;
}

export default function PipelineFilters({
  pipelineCountryFilter,
  setPipelineCountryFilter,
  pipelineCategoryFilter,
  setPipelineCategoryFilter,
  pipelineSpecialtyFilter,
  setPipelineSpecialtyFilter,
  PARTNER_TYPES,
  SPECIALTIES,
  onImportClick,
  onAddManual,
  onFixCountries,
  bulkCategorizing,
  onStopScan,
  onBulkCategorize,
  selectedCount,
  totalFilteredCount,
  onClearSelection,
  onSelectAll,
  onSelectPage,
  onBulkSend,
  bulkSending,
  onBulkMove,
  onBulkSpecialty
}: PipelineFiltersProps) {
  const { t } = useTranslation();

  return (
    <Card withBorder shadow="sm" radius="lg" p="md">
      <Group justify="space-between" align="flex-end">
        <Stack gap={5}>
          <Title order={4}>{t('hunter_pipeline_title') || '파이프라인 관리 (Pipeline)'}</Title>
          <SegmentedControl
            size="xs"
            value={pipelineCountryFilter}
            onChange={setPipelineCountryFilter}
            data={[
              { label: t('hunter_pipeline_country_all') || '전체 국가', value: 'All' },
              { label: t('hunter_pipeline_country_kr') || '🇰🇷 대한민국', value: 'South Korea' },
              { label: t('hunter_pipeline_country_jp') || '🇯🇵 일본', value: 'Japan' },
              { label: t('hunter_pipeline_country_us') || '🇺🇸 미국', value: 'United States' },
              { label: t('hunter_pipeline_country_other') || '🌐 기타', value: 'Other' }
            ]}
          />
          <SegmentedControl
            size="xs"
            value={pipelineCategoryFilter}
            onChange={setPipelineCategoryFilter}
            data={[
              { label: t('hunter_pipeline_category_all') || '전체 카테고리', value: 'All' },
              ...PARTNER_TYPES.map(pt => ({ label: pt, value: pt }))
            ]}
          />
          <Select
            size="xs"
            placeholder={t('hunter_pipeline_specialty_ph') || '전문 분야 (품목)'}
            value={pipelineSpecialtyFilter}
            onChange={(val) => setPipelineSpecialtyFilter(val || 'All')}
            data={[
              { label: t('hunter_pipeline_specialty_all') || '전체 분야', value: 'All' },
              ...SPECIALTIES.map(s => ({ label: s, value: s }))
            ]}
            style={{ width: 180 }}
          />
        </Stack>
        <Stack gap="xs">
          <Group gap="xs" justify="flex-end">
            <Button
              leftSection={<IconDownload size={16} />}
              variant="outline"
              color="blue"
              onClick={onImportClick}
              size="xs"
            >
              {t('hunter_pipeline_btn_import') || '가져오기'}
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="outline"
              color="green"
              size="xs"
              onClick={onAddManual}
            >
              {t('hunter_pipeline_btn_add') || '수동 추가'}
            </Button>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="outline"
              color="orange"
              size="xs"
              onClick={onFixCountries}
            >
              {t('hunter_pipeline_btn_fix_country') || '국가 수정'}
            </Button>
            {bulkCategorizing ? (
              <Button
                leftSection={<IconX size={16} />}
                variant="filled"
                color="red"
                size="xs"
                onClick={onStopScan}
              >
                {t('hunter_pipeline_btn_stop') || '중단'}
              </Button>
            ) : (
              <Button
                leftSection={<IconScan size={16} />}
                variant="light"
                color="grape"
                size="xs"
                onClick={onBulkCategorize}
                disabled={selectedCount === 0}
              >
                {t('hunter_pipeline_btn_categorize') || 'AI 일괄 분류'} ({selectedCount})
              </Button>
            )}
          </Group>
          <Group gap="sm" justify="flex-end">
            <Stack gap={0} align="flex-end">
              <Text size="xs" fw={700} c="blue.8">
                {t('hunter_pipeline_selected') || '선택됨'}: {selectedCount} / {totalFilteredCount}
              </Text>
              {selectedCount > 0 && (
                <Button
                  variant="subtle"
                  size="compact-xs"
                  color="red"
                  p={0}
                  onClick={onClearSelection}
                  leftSection={<IconX size={12} />}
                >
                  {t('hunter_pipeline_deselect') || '전체 해제'}
                </Button>
              )}
            </Stack>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="outline" size="xs" color="gray">
                  {t('hunter_pipeline_select_options') || '선택 옵션'}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={onSelectAll}>
                  {t('hunter_pipeline_select_all') || '전체 선택/해제'} ({totalFilteredCount})
                </Menu.Item>
                <Menu.Item onClick={onSelectPage}>
                  {t('hunter_pipeline_select_page') || '현재 페이지 선택/해제'}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Button
              leftSection={<IconRocket size={16} />}
              color="blue"
              size="xs"
              disabled={selectedCount === 0}
              loading={bulkSending}
              onClick={onBulkSend}
            >
              {t('hunter_pipeline_bulk_send') || '제안서 일괄 발송'} ({selectedCount})
            </Button>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  disabled={selectedCount === 0}
                  leftSection={<IconCheck size={16} />}
                >
                  {t('hunter_pipeline_bulk_change') || '일괄 변경'}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{t('hunter_pipeline_bulk_category_label') || '대분류 이동:'}</Menu.Label>
                {PARTNER_TYPES.map(type => (
                  <Menu.Item
                    key={type}
                    onClick={() => onBulkMove(type)}
                  >
                    {type}
                  </Menu.Item>
                ))}
                <Divider />
                <Menu.Label>{t('hunter_pipeline_bulk_specialty_label') || '세부 종목 지정:'}</Menu.Label>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {SPECIALTIES.map(spec => (
                    <Menu.Item
                      key={spec}
                      onClick={() => onBulkSpecialty(spec)}
                    >
                      {spec}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}

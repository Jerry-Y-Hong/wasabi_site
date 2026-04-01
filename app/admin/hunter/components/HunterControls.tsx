'use client';

import { 
  Card, 
  Stack, 
  Group, 
  Text, 
  Button, 
  Divider, 
  Select, 
  TextInput, 
  Checkbox 
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

interface HunterControlsProps {
  TARGET_PRESETS: any[];
  COUNTRIES: any[];
  country: string | null;
  setCountry: (val: string | null) => void;
  keyword: string;
  setKeyword: (val: string) => void;
  loading: boolean;
  onSearch: (keyword: string, country: string | null) => void;
  onPresetClick: (preset: any) => void;
  autoScan: boolean;
  setAutoScan: (val: boolean) => void;
}

export default function HunterControls({
  TARGET_PRESETS,
  COUNTRIES,
  country,
  setCountry,
  keyword,
  setKeyword,
  loading,
  onSearch,
  onPresetClick,
  autoScan,
  setAutoScan
}: HunterControlsProps) {
  const { t } = useTranslation();

  return (
    <Card withBorder shadow="md" p="xl" radius="lg">
      <Stack gap="md">
        <Text fw={700}>{t('hunter_controls_quick_presets') || '빠른 타겟 설정 (Quick Presets)'}</Text>
        <Group gap="xs">
          {TARGET_PRESETS.map((preset, idx) => (
            <Button
              key={idx}
              variant="light"
              color="wasabi"
              size="xs"
              onClick={() => onPresetClick(preset)}
              leftSection={preset.icon}
            >
              {preset.label}
            </Button>
          ))}
        </Group>
        <Divider my="sm" />
        <Group align="flex-end">
          <Select
            label={t('hunter_controls_country') || '국가 선택'}
            data={COUNTRIES}
            value={country}
            onChange={setCountry}
            style={{ width: 160 }}
          />
          <TextInput
            label={t('hunter_controls_keyword') || '검색 키워드'}
            placeholder={t('hunter_controls_keyword_ph') || '예: 와사비 유통, 일식 식자재'}
            style={{ flex: 1 }}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch(keyword, country);
            }}
          />
          <Button
            leftSection={<IconSearch size={16} />}
            color="green"
            loading={loading}
            onClick={() => onSearch(keyword, country)}
          >
            {t('hunter_controls_btn_search') || '검색 시작'}
          </Button>
        </Group>
        <Checkbox
          label={t('hunter_controls_auto_scan') || 'Auto-Scan Details (Visit sites to find Contact & Email)'}
          checked={autoScan}
          onChange={(e) => setAutoScan(e.currentTarget.checked)}
          size="xs"
          c="dimmed"
        />
      </Stack>
    </Card>
  );
}

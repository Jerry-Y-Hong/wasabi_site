'use client';

import { 
  SimpleGrid, 
  Card, 
  Text, 
  Group, 
  Stack, 
  ThemeIcon, 
  Progress,
  Box
} from '@mantine/core';
import { 
  IconUsers, 
  IconCircleCheck, 
  IconRefresh, 
  IconAlertCircle,
  IconTrendingUp,
  IconSearch
} from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';

interface HunterStatsProps {
  total: number;
  verified: number;
  pending: number;
  scanned: number;
}

export default function HunterStats({ total, verified, pending, scanned }: HunterStatsProps) {
  const { t } = useTranslation();
  const verifiedRate = total > 0 ? Math.round((verified / total) * 100) : 0;
  const scanRate = total > 0 ? Math.round((scanned / total) * 100) : 0;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      {/* Total Leads Card */}
      <Card withBorder radius="lg" shadow="sm" p="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={0}>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">{t('hunter_stats_total_leads') || 'Total Leads'}</Text>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={900}>{total.toLocaleString()}</Text>
              <Text size="xs" c="teal" fw={700}>+12%</Text>
            </Group>
          </Stack>
          <ThemeIcon variant="light" color="gray" size="xl" radius="md">
            <IconUsers size={24} />
          </ThemeIcon>
        </Group>
        <Group gap={4} mt="md">
          <IconTrendingUp size={12} color="var(--mantine-color-teal-6)" />
          <Text size="xs" c="dimmed">{t('hunter_stats_growth') || 'Growth since last sync'}</Text>
        </Group>
      </Card>

      {/* Verified Partners Card */}
      <Card withBorder radius="lg" shadow="sm" p="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={0} style={{ flex: 1 }}>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">{t('hunter_stats_verified_partners') || 'Verified Partners'}</Text>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={900} c="blue">{verified.toLocaleString()}</Text>
              <Text size="xs" c="dimmed">{verifiedRate}{t('hunter_stats_conv') || '% conv.'}</Text>
            </Group>
            <Progress value={verifiedRate} color="blue" size="sm" radius="xl" mt="sm" />
          </Stack>
          <ThemeIcon variant="light" color="blue" size="xl" radius="md">
            <IconCircleCheck size={24} />
          </ThemeIcon>
        </Group>
      </Card>

      {/* AI Scanned Card */}
      <Card withBorder radius="lg" shadow="sm" p="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={0}>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">{t('hunter_stats_ai_analysis') || 'AI Analysis Status'}</Text>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={900} c="grape">{scanned.toLocaleString()}</Text>
              <Text size="xs" c="dimmed">/ {total} {t('hunter_stats_scanned') || 'scanned'}</Text>
            </Group>
          </Stack>
          <ThemeIcon variant="light" color="grape" size="xl" radius="md">
            <IconRefresh size={24} />
          </ThemeIcon>
        </Group>
        <Group gap={4} mt="md">
          <IconSearch size={12} color="var(--mantine-color-grape-6)" />
          <Text size="xs" c="dimmed">{total - scanned} {t('hunter_stats_leads_remaining') || 'leads remaining in queue'}</Text>
        </Group>
      </Card>

      {/* High Intent Card */}
      <Card withBorder radius="lg" shadow="sm" p="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={0}>
            <Text size="xs" c="dimmed" fw={700} tt="uppercase">{t('hunter_stats_high_intent') || 'High Intent Leads'}</Text>
            <Group align="baseline" gap="xs">
              <Text size="xl" fw={900} c="orange">{pending.toLocaleString()}</Text>
              <Text size="xs" c="dimmed">{t('hunter_stats_review_needed') || 'review needed'}</Text>
            </Group>
          </Stack>
          <ThemeIcon variant="light" color="orange" size="xl" radius="md">
            <IconAlertCircle size={24} />
          </ThemeIcon>
        </Group>
        <Box mt="md" h={6} bg="gray.1" style={{ borderRadius: 10, overflow: 'hidden' }}>
          <Box h="100%" w="60%" bg="orange" />
        </Box>
      </Card>
    </SimpleGrid>
  );
}

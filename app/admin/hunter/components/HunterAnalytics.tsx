'use client';

import { 
  Stack, 
  SimpleGrid, 
  Card, 
  Text, 
  Title, 
  Box 
} from '@mantine/core';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { HunterResult } from '../types';
import { useTranslation } from '@/lib/i18n';

interface HunterAnalyticsProps {
  savedPartners: HunterResult[];
}

export default function HunterAnalytics({ savedPartners }: HunterAnalyticsProps) {
  const { t } = useTranslation();

  const avgScore = savedPartners.length > 0
    ? Math.round(savedPartners.reduce((acc, p) => acc + (p.aiSummary?.score || 0), 0) / savedPartners.length)
    : 0;

  const industryData = Object.entries(savedPartners.reduce((acc, p) => {
    const industry = p.aiSummary?.industry || 'Unknown';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

  const scoreData = [
    { name: t('hunter_analytics_quality_low') || '개척필요 (Low)', count: savedPartners.filter(p => (p.aiSummary?.score || 0) < 7).length },
    { name: t('hunter_analytics_quality_med') || '유망 (Medium)', count: savedPartners.filter(p => (p.aiSummary?.score || 0) >= 7 && (p.aiSummary?.score || 0) < 8).length },
    { name: t('hunter_analytics_quality_high') || '핵심 (High)', count: savedPartners.filter(p => (p.aiSummary?.score || 0) >= 8).length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Stack gap="lg">
      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        <Card withBorder shadow="md" p="lg" radius="lg">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">{t('hunter_analytics_total_partners') || '총 파트너 수'}</Text>
          <Text fw={900} size="xl" c="wasabi">{savedPartners.length}</Text>
        </Card>
        <Card withBorder shadow="md" p="lg" radius="lg">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">{t('hunter_analytics_new_leads') || '신규 리드'}</Text>
          <Text fw={900} size="xl" c="gray">{savedPartners.filter(p => p.status === 'New').length}</Text>
        </Card>
        <Card withBorder shadow="md" p="lg" radius="lg">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">{t('hunter_analytics_contracted') || '계약 성사'}</Text>
          <Text fw={900} size="xl" c="grape">{savedPartners.filter(p => p.status === 'Contracted').length}</Text>
        </Card>
        <Card withBorder shadow="md" p="lg" radius="lg">
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">{t('hunter_analytics_avg_score') || '평균 적합도'}</Text>
          <Text fw={900} size="xl" c={avgScore >= 8 ? 'red' : avgScore >= 7 ? 'orange' : 'blue'}>
            {avgScore}{t('hunter_analytics_score_unit') || '점'}
          </Text>
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {/* Industry Distribution */}
        <Card withBorder shadow="md" p="lg" radius="lg">
          <Title order={4} mb="lg">{t('hunter_analytics_industry_dist') || '산업군 분포 (Industry Distribution)'}</Title>
          <Box h={300}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {industryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Score Distribution */}
        <Card withBorder shadow="md" p="lg" radius="lg">
          <Title order={4} mb="lg">{t('hunter_analytics_quality_dist') || '리드 품질 분포 (Lead Quality Score)'}</Title>
          <Box h={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" stroke="#ccc" />
                <YAxis dataKey="name" type="category" width={100} stroke="#ccc" />
                <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name={t('hunter_analytics_chart_count') || '파트너 수'}>
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#adb5bd', '#339af0', '#fa5252'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}

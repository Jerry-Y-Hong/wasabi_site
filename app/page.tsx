'use client';

import { Hero } from '@/components/ui/Hero';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Container, SimpleGrid, Title, Text, Box, Grid, Paper, Stack, Badge, Button, Group, Image } from '@mantine/core';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Tissue Culture Seedlings',
      description: 'Virus-free, premium 무병묘(virus-free seedlings) produced via advanced tissue culture for maximum vigor and yield.',
      image: '/images/tissue-culture.jpg',
      link: '/products/seedlings',
    },
    {
      title: 'Aeroponic Cultivation',
      description: 'Advanced vertical farming achieving 25x higher productivity and 50% faster growth cycles than traditional methods.',
      image: '/images/smart-farm-rows.jpg',
      link: '/cultivation',
    },
    {
      title: 'Premium Wasabi Products',
      description: 'High-value Rhizomes and year-round fresh leaves/stems harvested at peak freshness from our smart farm.',
      image: '/images/wasabi-leaves.jpg',
      link: '/products/fresh',
    },
    {
      title: 'Smart Farm Consulting',
      description: 'Comprehensive solutions from facility design to tech transfer and purchase guarantees for a 3-5 year ROI model.',
      image: '/images/smart-farm-interior.jpg',
      link: '/consulting',
    },
  ];

  return (
    <>
      <Hero />
      <Container size="xl" py="xl">
        <Title order={2} ta="center" mt="sm">
          Our Business Areas
        </Title>
        <Text c="dimmed" ta="center" mt="md" mb={50}>
          From seed to shelf, we provide comprehensive wasabi solutions.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </SimpleGrid>

        <Box mt={100} py={60} bg="var(--mantine-color-gray-0)" style={{ borderRadius: 'var(--mantine-radius-xl)', padding: '40px' }}>
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Title order={2} mb="md">Responding to the Global Wasabi Crisis</Title>
              <Text size="lg" mb="xl">
                Climate change and an aging workforce are causing traditional wasabi production to plummet worldwide.
                Our technology ensures a stable, high-quality supply in a market where demand is soaring.
              </Text>
              <Button component={Link} href="/insights" size="lg" color="wasabi" variant="outline" radius="md">
                Explore Market Insights
              </Button>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper shadow="md" p="xl" radius="lg" withBorder>
                <Title order={3} ta="center" mb="lg">Market Trends</Title>
                <Stack gap="md">
                  <TrendItem label="Japan Production" value="-40% (Last 10yrs)" color="red" />
                  <TrendItem label="Global Demand" value="+300% (Last 10yrs)" color="wasabi" />
                  <TrendItem label="Product Potential" value="Food, Bio, Cosmetics" color="blue" />
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Box>
        <Box mt={100} py={60}>
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper shadow="xl" radius="lg" style={{ overflow: 'hidden' }}>
                <Image src="/images/family-dinner-hd.png" alt="Family enjoying wasabi" />
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Badge color="red" size="lg" mb="md">The Ultimate Experience</Badge>
              <Title order={2} mb="md">Nature's Shield on Your Plate</Title>
              <Text size="lg" mb="xl">
                Wasabi is more than a condiment; it's a protector of flavor and health.
                Whether it's paired with premium Sashimi or a perfectly marbled K-BBQ steak,
                our fresh wasabi elevates every meal into a joyful, healthy experience for the whole family.
              </Text>
              <Button component={Link} href="/products/fresh" size="lg" color="wasabi" radius="md">
                Buy Fresh Wasabi
              </Button>
            </Grid.Col>
          </Grid>
        </Box>
        <Box mt={100} mb={60} py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Grid align="center" gutter={60}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper shadow="sm" p="xl" radius="lg" withBorder style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Image src="/images/logo.jpg" w="80%" style={{ maxWidth: '250px' }} alt="Brand Logo" />
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Text c="wasabi" fw={700} mb="xs" size="sm" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Brand Identity</Text>
              <Title order={2} mb="md">Harmony of Nature & Technology</Title>
              <Text size="lg" mb="md" c="dimmed">
                The <span style={{ color: 'var(--mantine-color-wasabi-6)', fontWeight: 600 }}>Vibrant Green Leaf</span> represents the vitality of our premium Wasabi and the purity of nature we preserve.
              </Text>
              <Text size="lg" mb="md" c="dimmed">
                The <span style={{ color: 'var(--mantine-color-blue-6)', fontWeight: 600 }}>Circular Form</span> symbolizes our global network and the sustainable "Hyper-Cycle" ecosystem of our smart farms.
              </Text>
              <Text size="lg">
                Together, distinctively K-Farm, they embody our mission to deliver the healthiest, purest gifts of nature through cutting-edge innovation.
              </Text>
            </Grid.Col>
          </Grid>
        </Box>
      </Container >
    </>
  );
}

function TrendItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Group justify="space-between">
      <Text fw={500}>{label}</Text>
      <Badge color={color} size="lg">{value}</Badge>
    </Group>
  );
}


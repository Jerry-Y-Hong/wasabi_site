'use client';

import { Container, Title, Text, SimpleGrid, Group, Button, Box, Grid, GridCol, Paper, Badge, Stack, Image as MantineImage } from '@mantine/core';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Hero } from '@/components/ui/Hero';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import '@mantine/carousel/styles.css';

export default function Home() {
  const { t } = useTranslation();
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  const features = [
    {
      title: t('feat_1_title'),
      description: t('feat_1_desc'),
      image: '/images/tissue-culture.jpg',
      link: '/products/seedlings',
    },
    {
      title: t('feat_2_title'),
      description: t('feat_2_desc'),
      image: '/images/smart-farm-rows.jpg',
      link: '/cultivation',
    },
    {
      title: t('feat_3_title'),
      description: t('feat_3_desc'),
      image: '/images/wasabi-leaves.jpg',
      link: '/products/fresh',
    },
    {
      title: t('feat_4_title'),
      description: t('feat_4_desc'),
      image: '/images/smart-farm-interior.jpg',
      link: '/consulting',
    },
  ];

  return (
    <>
      <Hero />
      <Container size="xl" py="xl">
        <Title order={2} ta="center" mt="sm" fw={900} c="dark.9">
          {t('section_title')}
        </Title>
        <Text c="gray.8" fw={500} ta="center" mt="md" mb={50}>
          {t('section_subtitle')}
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </SimpleGrid>

        <Box mt={80} py={60} bg="black" style={{ borderRadius: 'var(--mantine-radius-xl)', overflow: 'hidden', position: 'relative' }}>
          <Container size="lg" style={{ position: 'relative', zIndex: 2 }}>
            <Group justify="center" mb="lg">
              <Badge color="red" size="lg" variant="filled">COMING SOON</Badge>
            </Group>
            <Title order={2} ta="center" c="white" mb="sm" fw={900} style={{ fontSize: '3rem' }}>
              THE GREEN REVOLUTION
            </Title>
            <Text ta="center" c="gray.4" mb={50} size="xl">
              K-Wasabi 1st Official Brand Film
            </Text>
            <Box
              mt={50}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,255,100,0.15)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <video
                src="/videos/brand_film_full.mp4"
                controls
                autoPlay
                muted
                loop
                style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
              />
            </Box>
            <Text ta="center" c="dimmed" mt="md" size="sm">
              * A Journey from Hwacheon's Snow to Your Table
            </Text>
          </Container>
        </Box >

        <Box mt={100} py={60} bg="var(--mantine-color-gray-0)" style={{ borderRadius: 'var(--mantine-radius-xl)', padding: '40px' }}>
          <Grid align="center">
            <GridCol span={{ base: 12, md: 7 }}>
              <Title order={2} mb="md" fw={900} c="dark.9">{t('market_title')}</Title>
              <Text size="lg" mb="xl" c="gray.8" fw={500}>
                {t('market_desc')}
              </Text>
              <Button component={Link} href="/insights" size="lg" color="wasabi" variant="outline" radius="md">
                {t('market_btn')}
              </Button>
            </GridCol>
            <GridCol span={{ base: 12, md: 5 }}>
              <Paper shadow="md" p="xl" radius="lg" withBorder>
                <Title order={3} ta="center" mb="lg" fw={800} c="dark.9">{t('trend_title')}</Title>
                <Stack gap="md">
                  <TrendItem label={t('trend_label_1')} value={t('trend_val_1')} color="red" />
                  <TrendItem label={t('trend_label_2')} value={t('trend_val_2')} color="wasabi" />
                  <TrendItem label={t('trend_label_3')} value={t('trend_val_3')} color="blue" />
                </Stack>
              </Paper>
            </GridCol>
          </Grid>
        </Box>

        <Box mt={100} py={60}>
          <Grid gutter={50} align="center">
            <GridCol span={{ base: 12, md: 5 }}>
              <Paper shadow="xl" radius="lg" style={{ overflow: 'hidden' }}>
                <MantineImage src="/images/family-dinner-hd.png" alt="Family" />
              </Paper>
            </GridCol>
            <GridCol span={{ base: 12, md: 7 }}>
              <Badge color="red" size="lg" mb="md">{t('gourmet_badge')}</Badge>
              <Title order={2} mb="md" fw={900} c="dark.9">{t('gourmet_title')}</Title>
              <Text size="lg" mb="xl" c="gray.8" fw={500}>
                {t('gourmet_desc')}
              </Text>
              <Button component={Link} href="/products/fresh" size="lg" color="wasabi" radius="md">
                {t('gourmet_btn')}
              </Button>
            </GridCol>
          </Grid>
        </Box>

        <Box mt={100} mb={60} py={60} style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Grid align="center" gutter={60}>
            <GridCol span={{ base: 12, md: 4 }}>
              <Paper shadow="sm" p="xl" radius="lg" withBorder style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <MantineImage src="/images/logo.jpg?v=2" w="80%" style={{ maxWidth: '250px', border: '4px solid white', borderRadius: '50%' }} alt="Logo" />
              </Paper>
            </GridCol>
            <GridCol span={{ base: 12, md: 8 }}>
              <Text c="wasabi" fw={700} mb="xs" size="sm" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{t('identity_tag')}</Text>
              <Title order={2} mb="md" fw={900} c="dark.9">{t('identity_title')}</Title>

              <Text size="lg" mb="md" c="gray.8" fw={500}>
                {t('identity_desc_1')}
              </Text>

              <Text size="lg" mb="md" c="gray.8" fw={500}>
                {t('identity_desc_2')}
              </Text>

              <Text size="lg" c="gray.8" fw={500}>
                {t('identity_desc_3')}
              </Text>
            </GridCol>
          </Grid>
        </Box>
      </Container >
    </>
  );
}

function TrendItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Group justify="space-between">
      <Text fw={600} c="gray.9">{label}</Text>
      <Badge color={color} size="lg">{value}</Badge>
    </Group>
  );
}

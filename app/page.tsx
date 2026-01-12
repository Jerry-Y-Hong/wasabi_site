'use client';

import { Container, Title, Text, SimpleGrid, Group, Button, Box, Grid, GridCol, Paper, Badge, Stack, Image as MantineImage } from '@mantine/core';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Hero } from '@/components/ui/Hero';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState, useEffect } from 'react';
import '@mantine/carousel/styles.css';
import { IconMovie, IconBook, IconCpu, IconChartBar, IconThumbUp, IconCertificate } from '@tabler/icons-react';

export default function Home() {
  const { t } = useTranslation();
  const autoplay = useRef(Autoplay({ delay: 3000 }));
  const [embla, setEmbla] = useState<any>(undefined);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSection, setActiveSection] = useState('section-hero');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Offset for header/padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const navItems = [
    { id: 'section-hero', label: t('hero_nav_brand'), icon: <IconMovie size={18} /> },
    { id: 'section-story', label: t('hero_nav_story'), icon: <IconBook size={18} /> },
    { id: 'section-tech', label: t('hero_nav_tech'), icon: <IconCpu size={18} /> },
    { id: 'section-insight', label: t('hero_nav_insight'), icon: <IconChartBar size={18} /> },
    { id: 'section-success', label: t('hero_nav_process'), icon: <IconThumbUp size={18} /> },
    { id: 'section-standard', label: t('hero_nav_global'), icon: <IconCertificate size={18} /> },
  ];

  /* Shared Navigation Component */
  const ContextNav = ({ current }: { current: string }) => (
    <SimpleGrid cols={3} spacing="xs" mb="lg">
      {navItems.map((item) => (
        <Button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          variant={current === item.id ? 'filled' : 'outline'}
          color={current === item.id ? 'wasabi' : 'gray'}
          size="xs"
          radius="xl"
          leftSection={item.icon}
          style={{ transition: 'all 0.3s ease', opacity: current === item.id ? 1 : 0.6 }}
        >
          {item.label}
        </Button>
      ))}
    </SimpleGrid>
  );

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
      {/* 1. Brand Film (Hero) */}
      <Box id="section-hero">
        <Hero />
      </Box>

      {/* 2. Main Content (All integrated into Hero) */}
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

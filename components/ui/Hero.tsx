import { Container, Title, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';
import classes from './Hero.module.css';

export function Hero() {
    return (
        <div className={classes.hero}>
            <Container size="md" className={classes.inner}>
                <Title className={classes.title}>
                    <span className={classes.highlight}>대한민국의 청정 와사비</span><br />
                    <span style={{ fontSize: '0.7em', color: 'var(--mantine-color-gray-7)' }}>Global Wasabi Revolution</span>
                </Title>

                <Text className={classes.description} mt={30} size="xl">
                    Solving the global supply crisis through AI-driven Aeroponics. We deliver premium virus-free seedlings and next-generation food/bio solutions to the world.
                </Text>

                <Group mt={40}>
                    <Button component={Link} href="/admin" size="xl" className={classes.control} variant="gradient" gradient={{ from: 'wasabi', to: 'lime' }}>
                        Get Started (Admin)
                    </Button>
                    <Button component={Link} href="/admin/hunter" size="xl" variant="default" className={classes.control}>
                        Hunter AI
                    </Button>
                </Group>
            </Container>
        </div>
    );
}

'use client';

import { Container, Title, Text, Button, Group } from '@mantine/core';
import classes from './Hero.module.css';

export function Hero() {
    return (
        <div className={classes.hero}>
            <Container size="md" className={classes.inner}>
                <Title className={classes.title}>
                    Leading the <span className={classes.highlight}>Global Wasabi Revolution</span>
                </Title>

                <Text className={classes.description} mt={30} size="xl">
                    Solving the global supply crisis through AI-driven Aeroponics. We deliver premium virus-free seedlings and next-generation food/bio solutions to the world.
                </Text>

                <Group mt={40}>
                    <Button size="xl" className={classes.control} variant="gradient" gradient={{ from: 'wasabi', to: 'lime' }}>
                        Get Started
                    </Button>
                    <Button size="xl" variant="default" className={classes.control}>
                        Our Products
                    </Button>
                </Group>
            </Container>
        </div>
    );
}

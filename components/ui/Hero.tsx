import { Container, Title, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';
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
                    <Button component={Link} href="/partnership" size="xl" className={classes.control} variant="gradient" gradient={{ from: 'wasabi', to: 'lime' }}>
                        Partner Inquiry
                    </Button>
                    <Button component={Link} href="/innovation" size="xl" variant="default" className={classes.control}>
                        Our Technology
                    </Button>
                </Group>
            </Container>
        </div>
    );
}

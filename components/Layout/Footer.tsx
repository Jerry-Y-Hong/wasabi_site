'use client';

import { Container, Group, Anchor, Text, Stack, Image, ActionIcon } from '@mantine/core';
import { IconBrandTwitterFilled, IconBrandYoutubeFilled, IconBrandInstagram } from '@tabler/icons-react';

// ... (lines 5-43)

<Group gap="xs" justify="flex-end" wrap="nowrap">
    <ActionIcon size="lg" color="#1DA1F2" variant="subtle">
        <IconBrandTwitterFilled size={24} />
    </ActionIcon>
    <ActionIcon size="lg" color="#FF0000" variant="subtle">
        <IconBrandYoutubeFilled size={24} />
    </ActionIcon>
    <ActionIcon size="lg" color="#E1306C" variant="subtle">
        <IconBrandInstagram size={24} stroke={1.5} />
    </ActionIcon>
</Group>
            </Container >
        </div >
    );
}

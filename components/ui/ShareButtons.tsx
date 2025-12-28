'use client';

import { Group, ActionIcon, Tooltip, CopyButton } from '@mantine/core';
import { IconBrandTwitter, IconBrandFacebook, IconBrandLinkedin, IconLink, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface ShareButtonsProps {
    title: string;
    url: string; // Since we are local, we might need to construct full URL or just path
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    // Construct full URL (fallback to window location if url is relative)
    const getFullUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}${url}`;
        }
        return url;
    };

    const handleShare = (platform: string) => {
        const fullUrl = getFullUrl();
        const text = `Check out this article: ${title}`;
        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    return (
        <Group>
            <Tooltip label="Share on X (Twitter)">
                <ActionIcon variant="light" size="lg" color="black" onClick={() => handleShare('twitter')}>
                    <IconBrandTwitter size={20} stroke={1.5} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Share on Facebook">
                <ActionIcon variant="light" size="lg" color="blue" onClick={() => handleShare('facebook')}>
                    <IconBrandFacebook size={20} stroke={1.5} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Share on LinkedIn">
                <ActionIcon variant="light" size="lg" color="cyan" onClick={() => handleShare('linkedin')}>
                    <IconBrandLinkedin size={20} stroke={1.5} />
                </ActionIcon>
            </Tooltip>

            <CopyButton value={typeof window !== 'undefined' ? window.location.href : url} timeout={2000}>
                {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy Link'} withArrow position="right">
                        <ActionIcon color={copied ? 'teal' : 'gray'} variant="light" size="lg" onClick={copy}>
                            {copied ? <IconCheck size={20} /> : <IconLink size={20} />}
                        </ActionIcon>
                    </Tooltip>
                )}
            </CopyButton>
        </Group>
    );
}

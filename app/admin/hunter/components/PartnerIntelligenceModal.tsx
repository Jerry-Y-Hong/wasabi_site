'use client';

import { 
  Stack, 
  Card, 
  Group, 
  Title, 
  Badge, 
  Text, 
  Tabs, 
  Divider, 
  Button, 
  ActionIcon, 
  Modal, 
  Center,
  SimpleGrid,
  List,
  Anchor,
  Box,
  Paper,
  TextInput,
  ThemeIcon,
  ScrollArea as MantineScrollArea
} from '@mantine/core';
import { 
  IconRobot, 
  IconSearch, 
  IconCopy, 
  IconMail, 
  IconCheck, 
  IconWorld, 
  IconPhone,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconFileDescription,
  IconPdf,
  IconMessageChatbot,
  IconLoader2,
  IconSend,
  IconSparkles
} from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import { HunterResult } from '@/app/admin/hunter/types';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface IntelligenceModalProps {
  opened: boolean;
  onClose: () => void;
  selectedPartner: HunterResult | null;
  modalTab: string | null;
  setModalTab: (tab: string | null) => void;
  emailMode: boolean;
  setEmailMode: (mode: boolean) => void;
  draftEmail: { subject: string; body: string } | null;
  researching: number | null;
  loading: boolean;
  onDeepResearch: (id: number) => void;
  onDraftEmail: () => void;
  onCopyIntelligence: () => void;
  onConfirmDraft: (id: number) => void;
  getUrgencyColor: (urgency: string) => string;
  APP_STATUS: Record<string, string>;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
}

export default function PartnerIntelligenceModal({
  opened,
  onClose,
  selectedPartner,
  modalTab,
  setModalTab,
  emailMode,
  setEmailMode,
  draftEmail,
  researching,
  loading,
  onDeepResearch,
  onDraftEmail,
  onCopyIntelligence,
  onConfirmDraft,
  getUrgencyColor,
  APP_STATUS
}: IntelligenceModalProps) {
  const { t, language } = useTranslation();

  if (!selectedPartner) return null;

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={t('hunter_modal_title')} 
      size="lg"
      radius="lg"
      overlayProps={{
        blur: 3,
        opacity: 0.55
      }}
    >
      <Stack gap="md">
        <Card withBorder radius="md" p="md" bg="var(--mantine-color-gray-0)">
          <Group justify="space-between" mb="xs">
            <Title order={4}>{selectedPartner.name}</Title>
            <Badge color={APP_STATUS[selectedPartner.status || 'New']}>{selectedPartner.status || 'New'}</Badge>
          </Group>
          <Group gap="xs">
            <Badge variant="outline" color="gray">{selectedPartner.country || 'Global'}</Badge>
            <Anchor href={selectedPartner.url} target="_blank" size="sm" c="dimmed">
              {selectedPartner.url}
            </Anchor>
          </Group>
        </Card>

        <Tabs value={modalTab} onChange={setModalTab} color="blue" variant="outline">
          <Tabs.List mb="md">
            <Tabs.Tab value="strategy" leftSection={<IconRobot size={14} />}>{t('hunter_modal_tab_strategy')}</Tabs.Tab>
            <Tabs.Tab value="intelligence" color="blue" leftSection={<IconSearch size={14} />}>
              {t('hunter_modal_tab_intel')} {selectedPartner.intelligenceReport && <Badge size="xs" ml={5} variant="filled">New</Badge>}
            </Tabs.Tab>
            <Tabs.Tab value="chat" color="grape" leftSection={<IconMessageChatbot size={14} />}>
              {t('hunter_modal_tab_chat')}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="strategy">
            <Stack gap="md">
              {selectedPartner.aiSummary && (
                <Card withBorder bg="blue.9" p="md">
                  <Group justify="space-between" mb="xs">
                    <Text fw={700} size="sm" c="white">{t('hunter_modal_ai_analysis')}</Text>
                    <Group gap={5}>
                      {selectedPartner.aiSummary.industry && <Badge variant="outline" color="blue.1">{selectedPartner.aiSummary.industry}</Badge>}
                      {selectedPartner.aiSummary.urgency && <Badge color={getUrgencyColor(selectedPartner.aiSummary.urgency)}>{selectedPartner.aiSummary.urgency}</Badge>}
                      <Badge size="lg" color={selectedPartner.aiSummary.score >= 10 ? 'grape' : selectedPartner.aiSummary.score >= 8 ? 'red' : selectedPartner.aiSummary.score >= 7 ? 'orange' : 'gray'}>
                        {selectedPartner.aiSummary.score}{t('hunter_table_score') || '점'}
                      </Badge>
                    </Group>
                  </Group>
                  <Text fw={700} size="sm" mb={4} c="white">{t('hunter_modal_sales_angle')}</Text>
                  <Text size="md" c="blue.1" fw={800}>{selectedPartner.aiSummary.angle}</Text>
                  <Divider my="sm" opacity={0.2} />
                  <Text fw={700} size="sm" mb={4} c="white">{t('hunter_modal_fitness')}</Text>
                  <Text size="sm" fs="italic" c="blue.0">"{selectedPartner.aiSummary.analysis}"</Text>
                </Card>
              )}

              {/* Core Business Info */}
              <SimpleGrid cols={2}>
                <Card withBorder p="sm">
                  <Text size="xs" fw={700} c="dimmed" mb={4}>{t('hunter_modal_contact')}</Text>
                  <Stack gap={4}>
                    <Group gap={5}>
                      <IconMail size={14} color="gray" />
                      <Text size="sm">{selectedPartner.email || t('hunter_modal_no_email') || 'Email not found'}</Text>
                    </Group>
                    <Group gap={5}>
                      <IconPhone size={14} color="gray" />
                      <Text size="sm">{selectedPartner.phone || t('hunter_modal_no_phone') || 'Phone not found'}</Text>
                    </Group>
                  </Stack>
                </Card>
                <Card withBorder p="sm">
                  <Text size="xs" fw={700} c="dimmed" mb={4}>{t('hunter_modal_social')}</Text>
                  <Group gap={8}>
                    {selectedPartner.sns?.instagram && <IconBrandInstagram size={18} color="pink" />}
                    {selectedPartner.sns?.facebook && <IconBrandFacebook size={18} color="blue" />}
                    {selectedPartner.sns?.youtube && <IconBrandYoutube size={18} color="red" />}
                    {selectedPartner.sns?.twitter && <IconBrandTwitter size={18} color="cyan" />}
                    {selectedPartner.sns?.linkedin && <IconBrandLinkedin size={18} color="blue" />}
                    {(!selectedPartner.sns || Object.values(selectedPartner.sns).every(v => !v)) && <Text size="sm" c="dimmed">{t('hunter_modal_no_sns') || 'No SNS found'}</Text>}
                  </Group>
                </Card>
              </SimpleGrid>

              {selectedPartner.catalogs && selectedPartner.catalogs.length > 0 && (
                <Card withBorder p="sm">
                  <Text size="xs" fw={700} c="dimmed" mb={4}>{t('hunter_modal_catalogs')}</Text>
                  <Group gap="xs">
                    {selectedPartner.catalogs.map((url: string, i: number) => (
                      <Button key={i} component="a" href={url} target="_blank" variant="light" size="compact-xs" leftSection={<IconPdf size={12} />}>
                        {t('hunter_modal_catalog') || 'Catalog'} {i + 1}
                      </Button>
                    ))}
                  </Group>
                </Card>
              )}
              
              {emailMode && draftEmail ? (
                <Stack gap="sm">
                  <Divider my="xs" label={t('hunter_modal_email_draft')} labelPosition="center" />
                  <Card withBorder p="md" bg="green.9">
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text fw={700} size="sm" c="white">{t('hunter_modal_email_subject')} {draftEmail.subject}</Text>
                        <ActionIcon variant="subtle" color="green.0" onClick={() => {
                          navigator.clipboard.writeText(`Subject: ${draftEmail.subject}\n\n${draftEmail.body}`);
                        }}>
                          <IconCopy size={16} />
                        </ActionIcon>
                      </Group>
                      <Divider opacity={0.2} />
                      <Text size="sm" c="green.0" style={{ whiteSpace: 'pre-wrap' }}>{draftEmail.body}</Text>
                    </Stack>
                  </Card>
                  <Button leftSection={<IconCheck size={16} />} color="green" onClick={() => onConfirmDraft(selectedPartner.id)}>
                    {t('hunter_modal_btn_confirm')}
                  </Button>
                  <Button variant="subtle" color="gray" onClick={() => setEmailMode(false)}>{t('hunter_modal_btn_back')}</Button>
                </Stack>
              ) : (
                <Group grow mt="sm">
                  <Button
                    leftSection={<IconSearch size={16} />}
                    variant="light"
                    color="blue"
                    loading={researching === selectedPartner.id}
                    onClick={() => onDeepResearch(selectedPartner.id)}
                  >
                    {t('hunter_modal_btn_research')}
                  </Button>
                  <Button
                    leftSection={<IconMail size={16} />}
                    color="wasabi"
                    loading={loading}
                    onClick={onDraftEmail}
                  >
                    {t('hunter_modal_btn_email')}
                  </Button>
                </Group>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="intelligence">
            {selectedPartner.intelligenceReport ? (
              <Stack gap="sm" mt="sm">
                <Group justify="flex-end">
                  <Button
                    size="compact-xs"
                    variant="light"
                    leftSection={<IconCopy size={14} />}
                    onClick={onCopyIntelligence}
                  >
                    {t('hunter_modal_copy_report') || '보고서 복사'}
                  </Button>
                </Group>
                <Card withBorder p="md" bg="blue.9" radius="md">
                  <Box className="prose prose-invert prose-sm max-w-none text-blue-0" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                    <ReactMarkdown>{selectedPartner.intelligenceReport}</ReactMarkdown>
                  </Box>
                </Card>
              </Stack>
            ) : (
              <Card withBorder p="xl" bg="var(--mantine-color-gray-0)" radius="md" mt="sm">
                <Center style={{ flexDirection: 'column', height: 200 }}>
                  <IconSearch size={40} color="gray" style={{ opacity: 0.5 }} />
                  <Text c="dimmed" mt="sm" fw={700}>{t('hunter_modal_no_intel') || '심층 인텔리전스 보고서가 아직 없습니다.'}</Text>
                  <Text c="dimmed" size="xs">{t('hunter_modal_intel_guide') || '아래 "리서치 시작" 버튼을 클릭하여 파트너사의 뉴스, 재무 정보, 경영진 동향을 수집하세요.'}</Text>
                </Center>
              </Card>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="chat">
            <StrategicChatPanel selectedPartner={selectedPartner} />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Modal>
  );
}

/**
 * Inner component to handle the Strategic Chat logic
 */
function StrategicChatPanel({ selectedPartner }: { selectedPartner: HunterResult }) {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);

  // Initial welcome message with context
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          sender: 'ai', 
          text: (t('hunter_chat_hi') || '안녕하세요! {name}의 리서치 내용을 기반으로 전략적인 질문에 답변해 드릴 수 있습니다. 무엇이 궁금하신가요?').replace('{name}', selectedPartner.name)
        }
      ]);
    }
  }, [selectedPartner.id]);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const scrollToBottom = () => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const messageText = customText || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      // We pass the full history plus a hidden context if it's the first real turn
      const contextPrompt = `[Context: You are discussing partner "${selectedPartner.name}". AI Analysis: ${JSON.stringify(selectedPartner.aiSummary)}. Current Report: ${selectedPartner.intelligenceReport || 'None'}]`;
      
      const response = await fetch('/api/chat/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { sender: 'user', text: contextPrompt }, // Inject context for the AI
            ...messages,
            userMsg
          ].map(m => ({ sender: m.sender, text: m.text })),
          language: language
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      
      setMessages(prev => [...prev, { sender: 'ai', text: data.text || t('ai_error') }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { sender: 'ai', text: t('ai_network_error') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="xs" mt="sm">
      <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
        <MantineScrollArea h={320} p="md" bg="gray.0" viewportRef={viewport}>
          <Stack gap="md">
            {messages.map((msg, idx) => (
              msg.text.startsWith('[Context:') ? null : ( // Use msg instead of m
                <Group key={idx} justify={msg.sender === 'ai' ? 'flex-start' : 'flex-end'} align="flex-start" gap="xs">
                  {msg.sender === 'ai' && (
                    <ThemeIcon color="grape" radius="xl" size="sm"><IconRobot size={12} /></ThemeIcon>
                  )}
                  <Paper 
                    p="xs" 
                    radius="md" 
                    bg={msg.sender === 'ai' ? 'white' : 'grape.6'}
                    c={msg.sender === 'ai' ? 'dark' : 'white'}
                    shadow="xs"
                    maw="85%"
                    withBorder={msg.sender === 'ai'}
                  >
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Text>
                  </Paper>
                </Group>
              )
            ))}
            {loading && (
              <Group gap="xs">
                <ThemeIcon color="grape" radius="xl" size="sm"><IconRobot size={12} /></ThemeIcon>
                <IconLoader2 className="animate-spin" size={14} color="gray" />
              </Group>
            )}
          </Stack>
        </MantineScrollArea>
        <Box p="sm" bg="white" style={{ borderTop: '1px solid #eee' }}>
          <Group gap={5} mb="xs">
            <Badge 
              variant="light" 
              color="grape" 
              size="sm" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleSend(t('hunter_chat_qa_translate_ja'))}
            >
              🇯🇵 {t('hunter_chat_qa_translate_ja')}
            </Badge>
            <Badge 
              variant="light" 
              color="blue" 
              size="sm" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleSend(t('hunter_chat_qa_rewrite'))}
            >
              ✍️ {t('hunter_chat_qa_rewrite')}
            </Badge>
            <Badge 
              variant="light" 
              color="orange" 
              size="sm" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleSend(t('hunter_chat_qa_risks'))}
            >
              🚨 {t('hunter_chat_qa_risks')}
            </Badge>
            <Badge 
              variant="light" 
              color="teal" 
              size="sm" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleSend(t('hunter_chat_qa_summary'))}
            >
              📝 {t('hunter_chat_qa_summary')}
            </Badge>
          </Group>
          <Group gap={5}>
            <TextInput 
              placeholder={t('hunter_chat_ph')} 
              style={{ flexGrow: 1 }}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.currentTarget.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              variant="filled"
              radius="md"
            />
            <ActionIcon color="grape" variant="filled" size="lg" radius="md" onClick={() => handleSend()} disabled={!input.trim() || loading}>
              <IconSend size={18} />
            </ActionIcon>
          </Group>
        </Box>
      </Card>
      <Group gap={5} justify="center">
        <IconSparkles size={12} color="grape" />
        <Text size="xs" c="dimmed">{t('hunter_chat_guide')}</Text>
      </Group>
    </Stack>
  );
}

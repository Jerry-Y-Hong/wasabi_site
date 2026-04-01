'use client';

import { Title, Text, Container, Button, Group, ActionIcon, Tooltip, SimpleGrid } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconVolume, IconVolumeOff, IconMovie, IconSettings, IconLeaf, IconWorld, IconRefresh, IconBook, IconCpu, IconChartBar, IconThumbUp, IconCertificate } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import classes from './Hero.module.css';
import { useTranslation } from '@/lib/i18n';

const globalSlides = [
    '/images/studio/global_scene_1.png', // Reverted to original
    '/images/studio/global_scene_2.png',
    '/images/studio/global_scene_3.png',
    '/images/studio/global_scene_4.png',
    '/images/studio/global_scene_5.png',
];

const seedingSlides = [
    '/images/studio/seeding_scene_1.png',
    '/images/studio/seeding_scene_2.png',
    '/images/studio/seeding_scene_3.png',
    '/images/studio/seeding_scene_4.png',
];

const processSlides = [
    '/images/studio/process_scene_1.png',
    '/images/studio/process_scene_2.png',
    '/images/studio/process_scene_3.png',
    '/images/studio/process_scene_4.png',
    '/images/studio/process_scene_5.png',
    '/images/studio/process_scene_6.png',
];

const brandSlides = [
    '/images/studio/brand_scene_1.png',
    '/images/studio/brand_scene_2.png',
    '/images/studio/brand_scene_3.png',
    '/images/studio/brand_scene_4.png',
];

const techSlides = [
    '/images/studio/tech_scene_1.png',
    '/images/studio/tech_scene_2.png',
    '/images/studio/tech_scene_3.png',
    '/images/studio/tech_scene_4.png',
];

const narrations: Record<string, Record<string, string[]>> = {
    ko: {
        brand: [
            "화천의 태고적 신비와 인류의 최첨단 기술이 만나는 곳, 케이와사비는 이제 농업을 넘어선 하나의 예술이 됩니다.",
            "품격을 담은 패키지 그 이상의 가치. 케이와사비의 진정한 가치는 여러분이 보지 못하는 보이지 않는 세밀한 곳에서 완벽하게 완성됩니다.",
            "전 세계 정점에 서 있는 최고급 미슐랭 셰프들이 직접 맛보고 증명하는 단 하나의 프리미엄 와사비 브랜드, 케이와사비라는 이름의 신뢰입니다.",
            "대한민국의 맑고 정직한 신선함이 전 세계 주요 미식 거점의 식탁으로 실시간으로 전달되며 인류의 미식 지도를 새롭게 그리고 있습니다."
        ],
        story: [
            "와사비가 왜 세상에서 가장 비싼 작물인지 아십니까? 오직 맑은 물과 제한된 환경에서만 허락되는 극도로 희귀한 종이기 때문입니다.",
            "우리가 먹는 부위는 단순한 뿌리가 아닙니다. 바로 뿌리 위에서 자라나는 '근경'이라는 아주 특별하고 귀한 특수 부위입니다.",
            "이 근경을 얻기 위해서는 까다로운 기후 조건과 2년이라는 긴 기다림이 필요합니다. 그 희소성과 재배 난이도가 와사비의 높은 가치를 만듭니다.",
            "우리는 이 자연의 난제를 첨단 기술로 풀었습니다. 데이터로 제어되는 와사비 스마트팜, 이것이 우리가 만드는 농업의 혁신입니다."
        ],
        tech: [
            "데이터는 절대 거짓말을 하지 않습니다. 우리는 생명이 들려주는 미세한 언어를 인텔리전스 숫자로 정밀하게 읽어내어 최적의 생태계를 구축합니다.",
            "AI 커맨드 센터는 365일 24시간 멈추지 않는 지능형 알고리즘을 통해, 매 순간 와사비의 생육 상태를 분석하고 미래의 성장을 미리 예측합니다.",
            "에어로포닉스 미세 분무 시스템은 와사비가 가장 편안하게 숨쉬고 성장할 수 있는 지구상 최적의 대기 환경을 시뮬레이션하고 실시간으로 설계합니다.",
            "딥러닝 알고리즘이 스스로 환경을 학습하고 자가 진화하는 프로세스, 이것이 바로 케이와사비가 제시하는 글로벌 미래 농업의 표준이자 핵심 기술입니다."
        ],
        global: [
            "케이와사비에게 품질이란 결코 타협의 대상이 아닙니다. 그것은 치열한 연구와 데이터 증명을 통해 얻어낸 인내와 결실의 결과물입니다.",
            "화천의 영하의 새벽 공기가 전 세계 주요 도시의 화려한 저녁 식탁이 되는 마법, 중단 없는 콜드체인 기술이 이 신선함을 완벽하게 사수합니다.",
            "모든 공정은 수치로 기록되어 투명하게 공개되며, 우리는 전 세계 고객들에게 데이터로 약속하고 신뢰로 증명하는 유일한 기준이 됩니다.",
            "뉴욕부터 도쿄, 파리까지 세계 최고의 거장 셰프들이 한목소리로 선택한 단 하나의 이름, 케이와사비는 미식의 정점을 상징합니다.",
            "우리는 농업의 물리적 국경을 허물고, 인류의 건강한 삶과 풍요로운 미래를 위한 새로운 농업의 기준을 전 세계에 심어나가겠습니다."
        ],
        seeding: [
            "모든 위대한 생명은 정교한 유전자의 설계도에서 시작됩니다. 우리는 억만 개의 세포 중 가장 강인하고 완벽한 최상의 유전체만을 엄격히 선별합니다.",
            "완벽한 무균 상태를 유지하는 바이오 랩. 121도의 고온 고압 환경에서 외부 오염 가능성을 원천 차단하여 순수한 생명의 탄생을 보호합니다.",
            "정밀 배양 제어 시스템 속에서 숙련된 바이오 공학자들이 와사비의 미래를 키워갑니다. 세포 하나하나의 움직임이 우리의 기술로 기록됩니다.",
            "무한한 확장성을 통한 인류의 미래 솔루션. 단 하나의 세포에서 시작된 생명은 거대한 수확으로 이어지며, 우리는 농업의 미래를 무한히 증식합니다."
        ],
        process: [
            "1단계 파종. 자동화 암이 정밀하게 묘를 안착시킵니다.",
            "2단계 세척. 고압 분무로 실시간 위생을 확보합니다.",
            "3단계 성장. 에어로포닉스 기술이 성장을 25배 가속합니다.",
            "4단계 제어. AI가 24시간 환경 수치를 최적화합니다.",
            "5단계 최종 세척. 수확 전 마지막 순수 정화 공정입니다.",
            "6단계 회송. 자원 가동 효율을 위해 사이클이 재시작됩니다."
        ]
    },
    th: {
        brand: [
            "ที่ซึ่งความลึกลับแห่งโบราณกาลของฮวาชอนพบกับเทคโนโลยีล้ำสมัยของมนุษยชาติ เค-วาซาบิ กำลังกลายเป็นงานศิลปะที่เหนือกว่าการเกษตรแบบเดิม",
            "คุณค่าที่เหนือยิ่งกว่าบรรจุภัณฑ์ที่หรูหรา แก่นแท้ของ เค-วาซาบิ ถูกทำให้สมบูรณ์แบบในรายละเอียดที่มองไม่เห็นซึ่งเราใส่ใจอย่างพิถีพิถัน",
            "แบรนด์วาซาบิระดับพรีเมียมเพียงหนึ่งเดียวที่ได้รับการพิสูจน์และไว้วางใจจากมิชลินเชฟระดับโลก ผู้ยืนอยู่บนจุดสูงสุดของศิลปะการทำอาหาร",
            "ความสดชื่นที่บริสุทธิ์จากเกาหลีถูกส่งตรงแบบเรียลไทม์ไปยังศูนย์กลางอาหารชั้นนำทั่วโลก วาดแผนที่อาหารเลิศรสของมนุษยชาติขึ้นใหม่"
        ],
        story: [
            "คุณรู้หรือไม่ว่าทำไมวาซาบิจึงเป็นพืชที่แพงที่สุดในโลก? เพราะมันเป็นสายพันธุ์ที่หายากมากซึ่งเติบโตได้เฉพาะในสภาพแวดล้อมที่จำกัดและมีน้ำบริสุทธิ์เท่านั้น",
            "สิ่งที่เราบริโภคไม่ใช่ราก แต่เป็น 'ลำต้นใต้ดิน' (Rhizome) ซึ่งเป็นส่วนพิเศษและล้ำค่าที่เติบโตอยู่เหนือราก",
            "การจะได้มาซึ่งลำต้นใต้ดินนี้ ต้องอาศัยสภาพอากาศที่แม่นยำและการรอคอยยาวนานถึง 2 ปี ความขาดแคลนนี้เองที่สร้างมูลค่ามหาศาลให้กับมัน",
            "เราได้ไขปริศนาของธรรมชาติด้วยเทคโนโลยีขั้นสูง สมาร์ทฟาร์มที่ขับเคลื่อนด้วยข้อมูลคือนวัตกรรมที่เรานำมาสู่การเกษตร"
        ],
        tech: [
            "ข้อมูลไม่เคยโกหก เราถอดรหัสภาษาที่ละเอียดอ่อนของสิ่งมีชีวิตให้เป็นตัวเลขที่ชาญฉลาด เพื่อสร้างระบบนิเวศทางชีวภาพที่สมบูรณ์แบบที่สุด",
            "ศูนย์บัญชาการ AI ทำงานตลอด 24 ชั่วโมงด้วยอัลกอริทึมที่ชาญฉลาด วิเคราะห์สถานะการเติบโตและพยากรณ์อนาคตของวาซาบิในทุกวินาที",
            "ระบบพ่นละอองละเอียดแอโรโพนิกส์ จำลองสภาพบรรยากาศที่ดีที่สุดในโลก เพื่อให้วาซาบิสามารถหายใจและเติบโตได้อย่างสบายที่สุด",
            "อัลกอริทึมการเรียนรู้เชิงลึกที่เรียนรู้และพัฒนาได้ด้วยตนเอง นี่คือมาตรฐานและเทคโนโลยีหลักของการเกษตรแห่งอนาคตที่ เค-วาซาบิ นำเสนอ"
        ],
        global: [
            "สำหรับ เค-วาซาบิ คุณภาพไม่ใช่เรื่องของการประนีประนอม แต่เป็นผลลัพธ์ของความอดทนและการพิสูจน์ผ่านข้อมูลและการวิจัยอย่างเข้มงวด",
            "เวทมนตร์ที่เปลี่ยนอากาศยามเช้าที่หนาวเหน็บของฮวาชอน ให้กลายเป็นมื้อค่ำที่หรูหราในเมืองใหญ่ทั่วโลก โดยมีเทคโนโลยีโคลด์เชนรักษาความสดใหม่ไว้",
            "ทุกขั้นตอนถูกบันทึกเป็นข้อมูลและเปิดเผยอย่างโปร่งใส เราเป็นมาตรฐานเดียวที่ให้คำมั่นสัญญาด้วยข้อมูลและพิสูจน์ด้วยความไว้วางใจ",
            "ตั้งแต่นิวยอร์ก โตเกียว ไปจนถึงปารีส เชฟระดับปรมาจารย์ของโลกต่างเลือก เค-วาซาบิ เป็นสัญลักษณ์ของจุดสูงสุดแห่งรสชาติ",
            "เราจะทลายพรมแดนทางการเกษตร และปลูกฝังมาตรฐานใหม่ของการเกษตรเพื่อสุขภาพที่ดีและอนาคตที่รุ่งเรืองของมนุษยชาติไปทั่วโลก"
        ],
        seeding: [
            "ทุกชีวิตที่ยิ่งใหญ่เริ่มต้นจากพิมพ์เขียวทางพันธุกรรมที่แม่นยำ เราคัดเลือกเฉพาะจีโนมที่แข็งแกร่งและสมบูรณ์แบบที่สุดจากเซลล์นับล้าน",
            "ห้องแล็บชีวภาพที่รักษาความสะอาดปราศจากเชื้ออย่างสมบูรณ์ ป้องกันการปนเปื้อนจากภายนอกเพื่อปกป้องการกำเนิดของชีวิตที่บริสุทธิ์",
            "นักวิศวกรรมชีวภาพผู้เชี่ยวชาญดูแลการเติบโตของวาซาบิภายใต้ระบบควบคุมการเพาะเลี้ยงที่แม่นยำ ทุกการเคลื่อนไหวของเซลล์ถูกบันทึกไว้",
            "โซลูชันแห่งอนาคตเพื่อมวลมนุษยชาติ ชีวิตที่เริ่มต้นจากเซลล์เดียวจะนำไปสู่การเก็บเกี่ยวที่ยิ่งใหญ่ เรากำลังเพิ่มพูนอนาคตของการเกษตรอย่างไม่หยุดยั้ง"
        ],
        process: [
            "ขั้นตอนที่ 1 การหว่านเมล็ด แขนกลอัตโนมัติวางกล้าไม้อย่างแม่นยำ",
            "ขั้นตอนที่ 2 การชำระล้าง การฉีดพ่นแรงดันสูงช่วยรักษาความสะอาดแบบเรียลไทม์",
            "ขั้นตอนที่ 3 การเติบโต เทคโนโลยีแอโรโพนิกส์ช่วยเร่งการเติบโตเร็วขึ้น 25 เท่า",
            "ขั้นตอนที่ 4 การควบคุม AI ปรับค่าสภาพแวดล้อมให้เหมาะสมที่สุดตลอด 24 ชั่วโมง",
            "ขั้นตอนที่ 5 การทำความสะอาดขั้นสุดท้าย กระบวนการฟอกบริสุทธิ์ก่อนการเก็บเกี่ยว",
            "ขั้นตอนที่ 6 การหมุนเวียน วงจรเริ่มต้นใหม่เพื่อประสิทธิภาพการใช้ทรัพยากรสูงสุด"
        ]
    },
    vi: {
        brand: [
            "Nơi vẻ đẹp bí ẩn cổ xưa của Hwacheon gặp gỡ công nghệ tiên tiến nhất của nhân loại, K-Wasabi trở thành một tác phẩm nghệ thuật vượt xa nông nghiệp thông thường.",
            "Giá trị vượt xa cả bao bì sang trọng. Tinh hoa thực sự của K-Wasabi được hoàn thiện trong những chi tiết vô hình mà chúng tôi chăm chút tỉ mỉ.",
            "Thương hiệu Wasabi cao cấp duy nhất được các đầu bếp Michelin hàng đầu thế giới tin dùng, đứng trên đỉnh cao của nghệ thuật ẩm thực toàn cầu.",
            "Sự tươi ngon thuần khiết từ Hàn Quốc được chuyển giao thời gian thực đến các trung tâm ẩm thực lớn trên thế giới, vẽ lại bản đồ ẩm thực cao cấp."
        ],
        story: [
            "Bạn có biết tại sao Wasabi là loại cây trồng đắt nhất thế giới không? Đó là một loài cực kỳ quý hiếm chỉ phát triển trong những môi trường hạn chế với nguồn nước tinh khiết.",
            "Phần chúng ta ăn không phải là rễ, mà là 'Thân rễ' (Rhizome), một phần thân đặc biệt và quý giá mọc ngay phía trên rễ.",
            "Để có được Thân rễ này cần điều kiện khí hậu khắt khe và hai năm chờ đợi. Sự khan hiếm này tạo nên giá trị to lớn của nó.",
            "Chúng tôi đã giải mã câu đố của tự nhiên bằng công nghệ tiên tiến. Nông trại thông minh dựa trên dữ liệu chính là sự đổi mới mà chúng tôi mang đến cho nông nghiệp."
        ],
        tech: [
            "Dữ liệu không bao giờ nói dối. Chúng tôi giải mã ngôn ngữ tinh tế của sự sống thành những con số thông minh để xây dựng hệ sinh thái sinh học tối ưu.",
            "Trung tâm chỉ huy AI hoạt động 24/7 với thuật toán thông minh, phân tích trạng thái tăng trưởng và dự đoán tương lai của Wasabi trong từng khoảnh khắc.",
            "Hệ thống phun sương Aeroponics mô phỏng môi trường khí quyển tốt nhất trên trái đất để Wasabi có thể hít thở và phát triển thoải mái nhất.",
            "Thuật toán Deep Learning tự học hỏi và tiến hóa - đây là tiêu chuẩn và công nghệ cốt lõi của nông nghiệp tương lai mà K-Wasabi mang lại."
        ],
        global: [
            "Đối với K-Wasabi, chất lượng không bao giờ là sự thỏa hiệp. Đó là kết quả của sự kiên trì và chứng minh qua dữ liệu từ những nghiên cứu khắt khe.",
            "Phép màu biến không khí lạnh giá của bình minh Hwacheon thành bữa tối sang trọng tại các thành phố lớn, được bảo vệ bởi công nghệ chuỗi cung ứng lạnh.",
            "Mọi quy trình đều được ghi lại dưới dạng dữ liệu và công khai minh bạch. Chúng tôi là tiêu chuẩn duy nhất cam kết bằng dữ liệu và chứng minh bằng niềm tin.",
            "Từ New York, Tokyo đến Paris, những đầu bếp bậc thầy thế giới đều chọn K-Wasabi là biểu tượng của đỉnh cao hương vị ẩm thực.",
            "Chúng tôi sẽ xóa bỏ ranh giới vật lý của nông nghiệp và gieo mầm tiêu chuẩn nông nghiệp mới vì cuộc sống khỏe mạnh và tương lai thịnh vượng toàn cầu."
        ],
        seeding: [
            "Mọi sự sống vĩ đại đều bắt đầu từ một bản thiết kế di truyền chính xác. Chúng tôi nghiêm ngặt lựa chọn những bộ gen mạnh mẽ và hoàn hảo nhất.",
            "Phòng thí nghiệm sinh học duy trì trạng thái vô trùng tuyệt đối, ngăn chặn mọi khả năng ô nhiễm để bảo vệ sự ra đời của sự sống thuần khiết.",
            "Các kỹ sư sinh học chuyên nghiệp nuôi dưỡng tương lai của Wasabi trong hệ thống kiểm soát chính xác. Mọi chuyển động tế bào đều được ghi lại.",
            "Giải pháp tương lai cho nhân loại qua khả năng mở rộng vô hạn. Sự sống bắt đầu từ một tế bào sẽ dẫn đến những vụ mùa bội thu."
        ],
        process: [
            "Bước 1 Gieo hạt. Cánh tay tự động đặt cây con một cách chính xác.",
            "Bước 2 Làm sạch. Phun áp lực cao đảm bảo vệ sinh theo thời gian thực.",
            "Bước 3 Tăng trưởng. Công nghệ Aeroponics giúp tăng tốc độ trưởng thành gấp 25 lần.",
            "Bước 4 Kiểm soát. AI tối ưu hóa các chỉ số môi trường suốt 24 giờ.",
            "Bước 5 Làm sạch cuối cùng. Quy trình tinh lọc tinh khiết trước khi thu hoạch.",
            "Bước 6 Tái chế. Chu kỳ bắt đầu lại để đạt hiệu quả sử dụng tài nguyên tối đa."
        ]
    },
    en: {
        brand: [
            "Where Hwacheon's ancient mystery meets humanity's cutting-edge technology, K-Wasabi becomes more than just farming—it's an art form.",
            "More than just premium packaging. The true essence of K-Wasabi is perfected in the invisible details you might never see.",
            "The one premium wasabi brand proven and trusted by the world's master Michelin chefs sitting at the pinnacle of global gastronomy.",
            "Korea's pure and honest freshness is delivered in real-time to the world's major gourmet hotspots, redrawing the map of human fine dining."
        ],
        story: [
            "Do you know why Wasabi is the most expensive crop? It is an extremely rare species that grows only in limited environments with pristine water.",
            "What we consume is not the root, but the 'Rhizome', a special and precious stem part that grows just above the root.",
            "Obtaining this Rhizome requires exacting climate conditions and two years of waiting. This scarcity drives its immense value.",
            "We have solved nature's puzzle with advanced technology. Our data-driven smart farm is the innovation we bring to agriculture."
        ],
        tech: [
            "Data never lies. We precisely decode the delicate language of life into intelligent numbers to build the ultimate biological ecosystem.",
            "The AI Command Center operates 24/7 with intelligent algorithms, analyzing the growth status of every plant and predicting future yields.",
            "The aeroponics fine-mist system simulates and designs the optimal atmospheric environment on Earth where Wasabi can breathe and grow most comfortably.",
            "Moving toward a process where deep learning algorithms learn and evolve independently—this is the core technology and standard of future farming."
        ],
        global: [
            "For K-Wasabi, quality is never a matter of compromise. It is the hard-earned result of rigorous research and data-driven proof.",
            "The magic of transformation where Hwacheon's freezing dawn becomes a lavish evening dinner in a major global city, secured by our cold-chain tech.",
            "Every process is recorded as data and disclosed transparently. We remain the only standard that promises with data and proves with trust.",
            "From New York to Tokyo and Paris, the world's legendary chefs have chosen one name. K-Wasabi stands as the ultimate symbol of taste.",
            "We will break the physical borders of agriculture and plant new global standards for the healthy lives and prosperous future of all humanity."
        ],
        seeding: [
            "Every great life begins with a sophisticated genetic blueprint. We strictly select only the strongest and most perfect genomes among billions of cells.",
            "A bio-lab maintaining absolute sterility. We block any possibility of external contamination at 121 degrees Celsius to protect the purity of birth.",
            "Experienced bio-engineers nurture the future of Wasabi within a precision culture control system, recording every single cellular movement.",
            "A future solution for humanity through infinite scalability. Life starting from a single cell leads to a thriving harvest, propagating the future."
        ],
        process: [
            "Step 1: Automated Seeding. Robotic arms precisely transplant the seedlings.",
            "Step 2: Cleaning. High-pressure mist ensures real-time hygiene.",
            "Step 3: Growth. Aeroponics technology accelerates growth by 25 times.",
            "Step 4: AI Control. Environment parameters optimized 24/7.",
            "Step 5: Final Washing. Pure purification process before the harvest.",
            "Step 6: Return Cycle. Recycling modules for maximum efficiency."
        ]
    },
    'zh-CN': {
        brand: [
            "华川的古老奥秘与人类尖端科技交汇之地，K-Wasabi 不仅仅是农业，更是一种艺术形式。",
            "不仅仅是精美的包装。K-Wasabi 的真正精髓在于您可能从未留意的隐形细节中得以完美呈现。",
            "全球顶尖米其林大厨亲测并信赖的唯一高端山葵品牌，屹立于全球美食的巅峰。",
            "韩国纯净真挚的新鲜感实时传送至全球主要美食热点，正在重绘人类精致餐饮的版图。"
        ],
        story: [
            "您知道为什么山葵是世界上最昂贵的作物吗？因为它是一种极其稀有的物种，只能在清澈水源和有限的环境中生长。",
            "我们食用的部分不仅是根，而是'根茎'，这是生长在根部上方的一个特殊而珍贵的部位。",
            "获得这种根茎需要严苛的气候条件和两年的漫长等待。正是这种稀缺性造就了它的巨大价值。",
            "我们利用先进技术解开了大自然的难题。数据驱动的智能农场正是我们要带给农业的创新。"
        ],
        tech: [
            "数据从不撒谎。我们将生命的微妙语言精确解码为智能数字，构建终极生物生态系统。",
            "AI 指挥中心通过智能算法 24/7 全天候运行，分析每一株植物的生长状态并预测未来产量。",
            "气雾栽培微雾系统模拟并设计了地球上最理想的大气环境，让山葵能够最舒适地呼吸和生长。",
            "迈向深度学习算法独立学习和进化的过程——这就是未来农业的核心技术和标准。"
        ],
        global: [
            "对 K-Wasabi 而言，品质绝非妥协的对象。它是经过严格研究和数据驱动证明的来之不易的成果。",
            "华川冰冷的黎明在我们的冷链技术保障下，神奇地转变为全球大都市的丰盛晚宴。",
            "每一个过程都记录为数据并透明公开。我们要成为唯一用数据承诺、用信任证明的标准。",
            "从纽约到东京再到巴黎，世界传奇大厨们选择了一个名字。K-Wasabi 象征着味觉的极致。",
            "我们将打破农业的物理边界，为全人类的健康生活和繁荣未来树立新的全球标准。"
        ],
        seeding: [
            "每一个伟大的生命都始于精确的基因蓝图。我们从数十亿细胞中严格筛选出最强壮、最完美的基因组。",
            "保持绝对无菌的生物实验室。我们在 121 摄氏度下阻断任何外部污染的可能性，以保护纯净生命的诞生。",
            "经验丰富的生物工程师在精密培养控制系统中培育山葵的未来，记录每一个细胞的运动。",
            "通过无限的可扩展性为人类提供未来解决方案。始于单细胞的生命将带来繁荣的收获，繁衍未来。"
        ],
        process: [
            "步骤 1：自动播种。机械臂精确移植幼苗。",
            "步骤 2：清洗。高压喷雾确保实时卫生。",
            "步骤 3：生长。气雾栽培技术将生长速度提高 25 倍。",
            "步骤 4：AI 控制。全天候优化环境参数。",
            "步骤 5：最终清洗。收获前的纯净净化过程。",
            "步骤 6：循环。回收模块实现最大效率。"
        ]
    },
    ja: {
        brand: [
            "華川の太古の神秘と人類の最先端技術が出会う場所、K-Wasabiは単なる農業を超え、一つの芸術となります。",
            "単なるプレミアムなパッケージ以上の価値。K-Wasabiの真髄は、目に見えない細部においてこそ完璧に仕上げられています。",
            "世界の食の頂点に立つミシュランシェフたちが認め、信頼する唯一のプレミアムワサビブランド。",
            "韓国の純粋で正直な新鮮さが、世界の主要な美食都市へリアルタイムで届けられ、人類の美食地図を塗り替えています。"
        ],
        story: [
            "なぜワサビが世界で最も高価な作物かご存知ですか？清らかな水と限られた環境でのみ許される、極めて希少な種だからです。",
            "私たちが食べる部分は単なる根ではありません。根のすぐ上で育つ「根茎」という非常に特別で貴重な部位なのです。",
            "この根茎を得るには、厳しい気候条件と2年という長い待ち時間が必要です。その希少性と栽培の難しさが、ワサビの高い価値を生み出しています。",
            "私たちはこの自然の難題を最先端技術で解きました。データで制御されるワサビスマートファーム、これこそが私たちが作る農業の革新です。"
        ],
        tech: [
            "データは決して嘘をつきません。私たちは生命の繊細な言語をインテリジェントな数値へと正確に解読し、究極の生物学的エコシステムを構築します。",
            "AIコマンドセンターは24時間365日、高度なアルゴリズムで稼働し、すべての植物の成長状態を分析し、将来の収穫量を予測します。",
            "エアロポニックス微細ミストシステムは、ワサビが最も快適に呼吸し成長できる、地球上で最適な大気環境をシミュレートし設計します。",
            "ディープラーニングアルゴリズムが自律的に学習し進化するプロセスへと向かうこと、これこそが未来農業の核心技術であり標準です。"
        ],
        global: [
            "K-Wasabiにとって、品質は決して妥協の対象ではありません。それは厳格な研究とデータに基づく証明によって得られた、努力の結晶です。",
            "華川の凍てつく夜明けが、私たちのコールドチェーン技術によって守られ、世界の大都市での豪華なディナーへと変わる魔法。",
            "すべてのプロセスはデータとして記録され、透明性を持って公開されます。私たちはデータで約束し、信頼で証明する唯一の基準であり続けます。",
            "ニューヨークから東京、パリに至るまで、世界の伝説的なシェフたちが選んだ一つの名前。K-Wasabiは味の頂点を象徴しています。",
            "私たちは農業の物理的な国境を打ち破り、全人類の健康な生活と豊かな未来のために、新たなグローバルスタンダードを植え付けます。"
        ],
        seeding: [
            "すべての偉大な生命は、精巧な遺伝子の設計図から始まります。私たちは数十億の細胞の中から、最も強く完璧なゲノムだけを厳選します。",
            "絶対的な無菌状態を維持するバイオラボ。121度の高温で外部からの汚染の可能性を完全に遮断し、純粋な生命の誕生を守ります。",
            "熟練したバイオエンジニアが精密培養制御システムの中でワサビの未来を育み、細胞の一つひとつの動きを記録しています。",
            "無限の拡張性による人類のための未来ソリューション。たった一つの細胞から始まる生命が豊かな収穫へとつながり、未来を繁殖させます。"
        ],
        process: [
            "ステップ1：自動播種。ロボットアームが苗を正確に移植します。",
            "ステップ2：洗浄。高圧ミストがリアルタイムで衛生を確保します。",
            "ステップ3：成長。エアロポニックス技術が成長を25倍加速させます。",
            "ステップ4：AI制御。環境パラメータを24時間365日最適化します。",
            "ステップ5：最終洗浄。収穫前の純粋な浄化プロセス。",
            "ステップ6：循環サイクル。最大効率のためのリサイクルモジュール。"
        ]
    },
    fr: {
        brand: [
            "Là où le mystère ancien de Hwacheon rencontre la technologie de pointe de l'humanité, K-Wasabi devient plus qu'une simple agriculture, c'est une forme d'art.",
            "Plus qu'un simple emballage haut de gamme. La véritable essence de K-Wasabi est perfectionnée dans les détails invisibles que vous ne voyez peut-être jamais.",
            "La seule marque de wasabi haut de gamme prouvée et approuvée par les grands chefs Michelin du monde, au sommet de la gastronomie mondiale.",
            "La fraîcheur pure et honnête de la Corée est livrée en temps réel aux principaux lieux gastronomiques du monde, redessinant la carte de la haute cuisine humaine."
        ],
        story: [
            "Savez-vous pourquoi le wasabi est la culture la plus chère ? C'est une espèce extrêmement rare qui ne pousse que dans des environnements limités avec une eau cristalline.",
            "Ce que nous consommons n'est pas la racine, mais le 'rhizome', une partie spéciale et précieuse de la tige qui pousse juste au-dessus de la racine.",
            "L'obtention de ce rhizome nécessite des conditions climatiques exigeantes et deux ans d'attente. Cette rareté est à l'origine de son immense valeur.",
            "Nous avons résolu le casse-tête de la nature grâce à une technologie de pointe. Notre ferme intelligente pilotée par les données est l'innovation que nous apportons à l'agriculture."
        ],
        tech: [
            "Les données ne mentent jamais. Nous décodons précisément le langage délicat de la vie en nombres intelligents pour construire l'écosystème biologique ultime.",
            "Le centre de commandement IA fonctionne 24h/24 et 7j/7 avec des algorithmes intelligents, analysant l'état de croissance de chaque plante et prédisant les futurs rendements.",
            "Le système de brumisation fine aéroponique simule et conçoit l'environnement atmosphérique optimal sur Terre où le Wasabi peut respirer et grandir le plus confortablement.",
            "Aller vers un processus où les algorithmes d'apprentissage profond apprennent et évoluent indépendamment - c'est la technologie de base et la norme de l'agriculture future."
        ],
        global: [
            "Pour K-Wasabi, la qualité n'est jamais une question de compromis. C'est le résultat durement gagné d'une recherche rigoureuse et d'une preuve basée sur les données.",
            "La magie de la transformation où l'aube glaciale de Hwacheon devient un dîner somptueux dans une grande ville mondiale, sécurisé par notre technologie de chaîne du froid.",
            "Chaque processus est enregistré sous forme de données et divulgué de manière transparente. Nous restons la seule norme qui promet avec des données et prouve avec confiance.",
            "De New York à Tokyo et Paris, les chefs légendaires du monde ont choisi un nom. K-Wasabi est le symbole ultime du goût.",
            "Nous briserons les frontières physiques de l'agriculture et planterons de nouvelles normes mondiales pour la vie saine et l'avenir prospère de toute l'humanité."
        ],
        seeding: [
            "Toute grande vie commence par un plan génétique sophistiqué. Nous sélectionnons strictement les génomes les plus forts et les plus parfaits parmi des milliards de cellules.",
            "Un laboratoire biologique maintenant une stérilité absolue. Nous bloquons toute possibilité de contamination externe à 121 degrés Celsius pour protéger la pureté de la naissance.",
            "Des bio-ingénieurs expérimentés nourrissent l'avenir du Wasabi dans un système de contrôle de culture de précision, enregistrant chaque mouvement cellulaire.",
            "Une solution future pour l'humanité grâce à une évolutivité infinie. La vie commençant à partir d'une seule cellule mène à une récolte florissante, propageant l'avenir."
        ],
        process: [
            "Étape 1 : Semis automatisé. Des bras robotiques transplantent précisément les semis.",
            "Étape 2 : Nettoyage. La brume à haute pression assure une hygiène en temps réel.",
            "Étape 3 : Croissance. La technologie aéroponique accélère la croissance de 25 fois.",
            "Étape 4 : Contrôle IA. Paramètres environnementaux optimisés 24h/24 et 7j/7.",
            "Étape 5 : Lavage final. Processus de purification pure avant la récolte.",
            "Étape 6 : Cycle de retour. Modules de recyclage pour une efficacité maximale."
        ]
    },
    de: {
        brand: [
            "Wo das uralte Geheimnis von Hwacheon auf die Spitzentechnologie der Menschheit trifft, wird K-Wasabi mehr als nur Landwirtschaft – es ist eine Kunstform.",
            "Mehr als nur Premium-Verpackung. Die wahre Essenz von K-Wasabi wird in den unsichtbaren Details perfektioniert, die Sie vielleicht nie sehen.",
            "Die einzige Premium-Wasabi-Marke, die von den besten Michelin-Köchen der Welt, die an der Spitze der globalen Gastronomie stehen, bewährt und vertraut wird.",
            "Koreas reine und ehrliche Frische wird in Echtzeit an die wichtigsten Gourmet-Hotspots der Welt geliefert und zeichnet die Karte der menschlichen gehobenen Küche neu."
        ],
        story: [
            "Wissen Sie, warum Wasabi die teuerste Pflanze ist? Es ist eine extrem seltene Art, die nur in begrenzten Umgebungen mit kristallklarem Wasser wächst.",
            "Was wir konsumieren, ist nicht die Wurzel, sondern das 'Rhizom', ein besonderer und kostbarer Stängelteil, der direkt über der Wurzel wächst.",
            "Um dieses Rhizom zu erhalten, bedarf es anspruchsvoller klimatischer Bedingungen und zwei Jahre Wartezeit. Diese Knappheit treibt seinen immensen Wert.",
            "Wir haben das Rätsel der Natur mit fortschrittlicher Technologie gelöst. Unsere datengesteuerte Smart Farm ist die Innovation, die wir in die Landwirtschaft bringen."
        ],
        tech: [
            "Daten lügen nie. Wir entschlüsseln präzise die zarte Sprache des Lebens in intelligente Zahlen, um das ultimative biologische Ökosystem aufzubauen.",
            "Das KI-Kommandozentrum arbeitet rund um die Uhr mit intelligenten Algorithmen, analysiert den Wachstumsstatus jeder Pflanze und prognostiziert zukünftige Erträge.",
            "Das aeroponische Feinstnebelsystem simuliert und gestaltet die optimale atmosphärische Umgebung auf der Erde, in der Wasabi am angenehmsten atmen und wachsen kann.",
            "Auf dem Weg zu einem Prozess, bei dem Deep-Learning-Algorithmen unabhängig lernen und sich weiterentwickeln – das ist die Kerntechnologie und der Standard der zukünftigen Landwirtschaft."
        ],
        global: [
            "Für K-Wasabi ist Qualität niemals ein Kompromiss. Es ist das hart erarbeitete Ergebnis strenger Forschung und datengestützter Beweise.",
            "Die Magie der Verwandlung, bei der Hwacheons eisige Dämmerung zu einem üppigen Abendessen in einer globalen Großstadt wird, gesichert durch unsere Kühlkettentechnologie.",
            "Jeder Prozess wird als Daten aufgezeichnet und transparent offengelegt. Wir bleiben der einzige Standard, der mit Daten verspricht und mit Vertrauen beweist.",
            "Von New York über Tokio bis Paris haben die legendären Köche der Welt einen Namen gewählt. K-Wasabi steht als das ultimative Symbol für Geschmack.",
            "Wir werden die physischen Grenzen der Landwirtschaft durchbrechen und neue globale Standards für das gesunde Leben und die wohlhabende Zukunft der gesamten Menschheit setzen."
        ],
        seeding: [
            "Jedes große Leben beginnt mit einem ausgeklügelten genetischen Bauplan. Wir wählen aus Milliarden von Zellen streng nur die stärksten und perfektesten Genome aus.",
            "Ein Biolabor, das absolute Sterilität aufrechterhält. Wir blockieren jede Möglichkeit einer externen Kontamination bei 121 Grad Celsius, um die Reinheit der Geburt zu schützen.",
            "Erfahrene Bioingenieure pflegen die Zukunft von Wasabi in einem präzisen Kulturkontrollsystem und zeichnen jede einzelne Zellbewegung auf.",
            "Eine zukünftige Lösung für die Menschheit durch unbegrenzte Skalierbarkeit. Leben, das aus einer einzigen Zelle beginnt, führt zu einer blühenden Ernte und vermehrt die Zukunft."
        ],
        process: [
            "Schritt 1: Automatisierte Aussaat. Roboterarme verpflanzen die Setzlinge präzise.",
            "Schritt 2: Reinigung. Hochdrucknebel sorgt für Hygiene in Echtzeit.",
            "Schritt 3: Wachstum. Aeroponik-Technologie beschleunigt das Wachstum um das 25-fache.",
            "Schritt 4: KI-Steuerung. Umgebungsparameter rund um die Uhr optimiert.",
            "Schritt 5: Endreinigung. Reiner Reinigungsprozess vor der Ernte.",
            "Schritt 6: Rücklaufzyklus. Recyclingmodule für maximale Effizienz."
        ]
    },
    es: {
        brand: [
            "Donde el antiguo misterio de Hwacheon se encuentra con la tecnología de vanguardia de la humanidad, K-Wasabi se convierte en más que solo agricultura: es una forma de arte.",
            "Más que solo un empaque premium. La verdadera esencia de K-Wasabi se perfecciona en los detalles invisibles que quizás nunca veas.",
            "La única marca de wasabi premium probada y confiable por los maestros chefs Michelin del mundo que se sientan en la cima de la gastronomía global.",
            "La frescura pura y honesta de Corea se entrega en tiempo real a los principales puntos gourmet del mundo, redibujando el mapa de la alta cocina humana."
        ],
        story: [
            "¿Sabes por qué el wasabi es el cultivo más caro? Es una especie extremadamente rara que crece solo en entornos limitados con agua prístina.",
            "Lo que consumimos no es la raíz, sino el 'rizoma', una parte especial y preciosa del tallo que crece justo encima de la raíz.",
            "Obtener este rizoma requiere condiciones climáticas exigentes y dos años de espera. Esta escasez impulsa su inmenso valor.",
            "Hemos resuelto el rompecabezas de la naturaleza con tecnología avanzada. Nuestra granja inteligente basada en datos es la innovación que aportamos a la agricultura."
        ],
        tech: [
            "Los datos nunca mienten. Decodificamos con precisión el delicado lenguaje de la vida en números inteligentes para construir el ecosistema biológico definitivo.",
            "El Centro de Comando de IA opera 24/7 con algoritmos inteligentes, analizando el estado de crecimiento de cada planta y prediciendo rendimientos futuros.",
            "El sistema de niebla fina aeropónica simula y diseña el entorno atmosférico óptimo en la Tierra donde el Wasabi puede respirer y crecer más cómodamente.",
            "Avanzando hacia un proceso donde los algoritmos de aprendizaje profundo aprenden y evolucionan independientemente: esta es la tecnología central y el estándar de la agricultura futura."
        ],
        global: [
            "Para K-Wasabi, la calidad nunca es una cuestión de compromiso. Es el resultado ganado con esfuerzo de una investigación rigurosa y pruebas basadas en datos.",
            "La magia de la transformación donde el amanecer helado de Hwacheon se convierte en una cena lujosa en una gran ciudad global, asegurada por nuestra tecnología de cadena de frío.",
            "Cada proceso se registra como datos y se divulga de forma transparente. Seguimos siendo el único estándar que promete con datos y prueba con confianza.",
            "Desde Nueva York hasta Tokio y París, los chefs legendarios del mundo han elegido un nombre. K-Wasabi se erige como el símbolo supremo del gusto.",
            "Romperemos las fronteras físicas de la agricultura y plantaremos nuevos estándares globales para las vidas saludables y el futuro próspero de toda la humanidad."
        ],
        seeding: [
            "Toda gran vida comienza con un plano genético sofisticado. Seleccionamos estrictamente solo los genomas más fuertes y perfectos entre miles de millones de células.",
            "Un laboratorio biológico que mantiene la esterilidad absoluta. Bloqueamos cualquier posibilidad de contaminación externa a 121 grados Celsius para proteger la pureza del nacimiento.",
            "Bioingenieros experimentados nutren el futuro de Wasabi dentro de un sistema de control de cultivo de precisión, registrando cada movimiento celular.",
            "Una solución futura para la humanidad a través de una escalabilidad infinita. La vida que comienza a partir de una sola célula conduce a una cosecha próspera, propagando el futuro."
        ],
        process: [
            "Paso 1: Siembra automatizada. Brazos robóticos trasplantan con precisión las plántulas.",
            "Paso 2: Limpieza. La niebla de alta presión garantiza la higiene en tiempo real.",
            "Paso 3: Crecimiento. La tecnología aeropónica acelera el crecimiento en 25 veces.",
            "Paso 4: Control de IA. Parámetros ambientales optimizados 24/7.",
            "Paso 5: Lavado final. Proceso de purificación pura antes de la cosecha.",
            "Paso 6: Ciclo de retorno. Módulos de reciclaje para máxima eficiencia."
        ]
    },
    ar: {
        brand: [
            "حيث يلتقي غموض هواشيون القديم بأحدث تقنيات البشرية، يصبح K-Wasabi أكثر من مجرد زراعة - إنه شكل من أشكال الفن.",
            "أكثر من مجرد تغليف فاخر. يتم إتقان الجوهر الحقيقي لـ K-Wasabi في التفاصيل غير المرئية التي قد لا تراها أبدًا.",
            "علامة الوسابي التجارية المتميزة الوحيدة التي أثبتها ووثق بها كبار طهاة ميشلان في العالم الجالسين في قمة فن الطهو العالمي.",
            "يتم تسليم نضارة كوريا النقية والصادقة في الوقت الفعلي إلى النقاط الساخنة الذواقة الرئيسية في العالم، مما يعيد رسم خريطة المطاعم الراقية البشرية."
        ],
        story: [
            "هل تعرف لماذا يعتبر الوسابي أغلى المحاصيل في العالم؟ إنه نوع نادر للغاية ينمو فقط في بيئات محدودة ذات مياه نقية.",
            "ما نستهلكه ليس الجذر، بل 'الجذمور'، وهو جزء خاص وثمين من الساق ينمو فوق الجذر مباشرة.",
            "يتطلب الحصول على هذا الجذمور ظروفًا مناخية دقيقة وانتظارًا لمدة عامين. هذه الندرة هي ما يمنحه قيمته الهائلة.",
            "لقد قمنا بحل لغز الطبيعة باستخدام التكنولوجيا المتقدمة. مزرعتنا الذكية القائمة على البيانات هي الابتكار الذي نقدمه للزراعة."
        ],
        tech: [
            "البيانات لا تكذب أبدًا. نقوم بفك تشفير لغة الحياة الدقيقة بدقة إلى أرقام ذكية لبناء النظام البيئي البيولوجي النهائي.",
            "يعمل مركز قيادة الذكاء الاصطناعي على مدار الساعة طوال أيام الأسبوع بخوارزميات ذكية، ويحلل حالة نمو كل نبات ويتنبأ بالعوائد المستقبلية.",
            "يحاكي نظام الضباب الهوائي الدقيق البيئة الجوية المثلى على الأرض ويصممها حيث يمكن للوسابي التنفس والنمو بشكل مريح.",
            "التحرك نحو عملية تتعلم فيها خوارزميات التعلم العميق وتتطور بشكل مستقل - هذه هي التكنولوجيا الأساسية ومعيار الزراعة المستقبلية."
        ],
        global: [
            "بالنسبة لـ K-Wasabi، الجودة ليست مسألة مساومة أبدًا. إنها النتيجة التي تم الحصول عليها بشق الأنفس من البحث الدقيق والأدلة المستندة إلى البيانات.",
            "سحر التحول حيث يصبح فجر هواشيون المتجمد عشاء مسائيًا فخمًا في مدينة عالمية رئيسية، تم تأمينه بواسطة تقنية سلسلة التبريد الخاصة بنا.",
            "يتم تسجيل كل عملية كبيانات والكشف عنها بشفافية. نظل المعيار الوحيد الذي يعد بالبيانات ويثبت بالثقة.",
            "من نيويورك إلى طوكيو وباريس، اختار الطهاة الأسطوريون في العالم اسمًا واحدًا. يقف K-Wasabi كرمز نهائي للذوق.",
            "سنكسر الحدود المادية للزراعة ونزرع معايير عالمية جديدة لحياة صحية ومستقبل مزدهر للبشرية جمعاء."
        ],
        seeding: [
            "تبدأ كل حياة عظيمة بمخطط جيني متطور. نختار بدقة فقط أقوى الجينومات وأكثرها مثالية من بين مليارات الخلايا.",
            "مختبر حيوي يحافظ على العقم المطلق. نمنع أي احتمال للتلوث الخارجي عند 121 درجة مئوية لحماية نقاء الولادة.",
            "يقوم المهندسون الحيويون ذوو الخبرة برعاية مستقبل الوسابي داخل نظام تحكم دقيق في الثقافة، ويسجلون كل حركة خلوية.",
            "حل مستقبلي للبشرية من خلال قابلية التوسع اللانهائية. تؤدي الحياة التي تبدأ من خلية واحدة إلى حصاد مزدهر، ونشر المستقبل."
        ],
        process: [
            "الخطوة 1: البذر الآلي. تقوم الأذرع الروبوتية بنقل الشتلات بدقة.",
            "الخطوة 2: التنظيف. يضمن الضباب عالي الضغط النظافة في الوقت الفعلي.",
            "الخطوة 3: النمو. تعمل تقنية الزراعة الهوائية على تسريع النمو بمقدار 25 مرة.",
            "الخطوة 4: التحكم بالذكاء الاصطناعي. تحسين معايير البيئة على مدار الساعة طوال أيام الأسبوع.",
            "الخطوة 5: الغسيل النهائي. عملية تنقية نقية قبل الحصاد.",
            "الخطوة 6: دورة العودة. وحدات إعادة التدوير لتحقيق أقصى قدر من الكفاءة."
        ]
    }
};

export function Hero() {
    const { t, language } = useTranslation();
    const [isMuted, setIsMuted] = useState(true);
    const [videoMode, setVideoMode] = useState<'brand' | 'story' | 'tech' | 'seeding' | 'process' | 'global'>('brand');
    const videoRef = useRef<HTMLVideoElement>(null);

    // Image Preloading
    useEffect(() => {
        const allImages = [...globalSlides, ...seedingSlides, ...processSlides, ...brandSlides, ...techSlides];
        // Note: storySlides will be defined below or imported
        allImages.forEach(src => {
            const img = new window.Image();
            img.src = src;
        });
    }, []);

    const storySlides = [
        '/images/story_scene_1.png',
        '/images/story_scene_3.png',
        '/images/story_scene_2.png',
        '/images/story_scene_4.png',
    ];

    const [telemetry, setTelemetry] = useState({
        ppfd: 450.2,
        ec: 1.82,
        ph: 6.21,
        co2: 800,
        flow: 1.2,
        humidity: 65,
        export_vol: 12540,
        demand_idx: 94.2,
        sterility: 99.98,
        growth_rate: 1.42
    });

    const [activeSlide, setActiveSlide] = useState(0);

    // Reset slide index when mode changes to prevent overflow/blank screen
    useEffect(() => {
        setActiveSlide(0);
    }, [videoMode]);

    // Narration states
    const lastSpokenRef = useRef<string>('');
    const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);
    const isSpeakingRef = useRef<boolean>(false);
    const speechTaskCounterRef = useRef<number>(0);

    const watchdogRef = useRef<any>(null);
    const warnedLangRef = useRef<Set<string>>(new Set());

    // Keep the engine awake while speaking (Simple resume heartbeat)
    useEffect(() => {
        const interval = setInterval(() => {
            if (isSpeakingRef.current && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.resume();
            }
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    const speak = (text: string, onComplete?: () => void) => {
        if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

        // 1. Task Management: Increment ID and Clear Everything
        speechTaskCounterRef.current += 1;
        const currentTaskId = speechTaskCounterRef.current;

        window.speechSynthesis.cancel();
        if (watchdogRef.current) clearTimeout(watchdogRef.current);
        utterancesRef.current = [];
        isSpeakingRef.current = false;

        // 2. Segmenting (Periods, Exclamation, Question marks - removed commas for smoother flow)
        const segments: string[] = [];
        let currentPos = 0;
        const regex = /[.!?]/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const part = text.substring(currentPos, match.index + 1).trim();
            if (part.length > 1) segments.push(part);
            currentPos = match.index + 1;
        }
        if (currentPos < text.length) {
            const finalPart = text.substring(currentPos).trim();
            if (finalPart.length > 1) segments.push(finalPart);
        }

        if (segments.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const langMap: Record<string, string> = {
            ko: 'ko-KR',
            en: 'en-US',
            ja: 'ja-JP',
            'zh-CN': 'zh-CN',
            th: 'th-TH',
            vi: 'vi-VN',
            fr: 'fr-FR',
            de: 'de-DE',
            es: 'es-ES',
            ar: 'ar-SA'
        };
        const targetLang = langMap[language] || 'en-US';

        // Voice Selection Strategy: Run ONCE (Hoisted)
        const voices = window.speechSynthesis.getVoices();
        const targetVoices = voices.filter(v => v.lang === targetLang || v.lang.replace('_', '-') === targetLang);

        let candidateVoices = targetVoices;
        if (candidateVoices.length === 0) {
            const shortLang = targetLang.split('-')[0];
            candidateVoices = voices.filter(v => v.lang.startsWith(shortLang));
        }

        let bestVoice = candidateVoices.find(v => v.name.includes('Google'));
        if (!bestVoice) bestVoice = candidateVoices.find(v => v.name.includes('Premium'));
        if (!bestVoice) bestVoice = candidateVoices[0];

        if (bestVoice) {
            // Selected voice for targetLang
        }

        // SAFETY FALLBACK: If we didn't find a voice that matches the target language,
        // do not try to speak (it will likely hang or play silence).
        // Instead, simulate a delay and move to next slide.
        const shortLang = targetLang.split('-')[0];
        const voiceMatches = bestVoice && bestVoice.lang.startsWith(shortLang);

        if (!voiceMatches) {
            // No matching voice found for targetLang. Falling back to timer.

            // Notify user ONCE per session about missing voice
            if (!warnedLangRef.current.has(shortLang)) {
                warnedLangRef.current.add(shortLang);
                notifications.show({
                    id: `tts-missing-${shortLang}`,
                    title: 'Voice Not Installed',
                    message: `System voice for ${targetLang} is missing. Slides will play silently. Please install the language pack in OS settings.`,
                    color: 'orange',
                    autoClose: 5000,
                    icon: <IconVolumeOff size={18} />,
                });
            }
            if (onComplete) {
                // Simulate reading time (approx 6s) so slides still move
                watchdogRef.current = setTimeout(() => {
                    if (currentTaskId === speechTaskCounterRef.current) onComplete();
                }, 6000);
            }
            return;
        }

        let currentIndex = 0;

        const playNext = () => {
            if (currentTaskId !== speechTaskCounterRef.current) return;
            if (watchdogRef.current) clearTimeout(watchdogRef.current);

            if (currentIndex >= segments.length) {
                isSpeakingRef.current = false;
                if (onComplete) {
                    // Safe delay after narration before moving slide
                    watchdogRef.current = setTimeout(() => {
                        if (currentTaskId === speechTaskCounterRef.current) onComplete();
                    }, 2000);
                }
                return;
            }

            // Watchdog: Force move if a chunk hangs for 10s
            watchdogRef.current = setTimeout(() => {
                if (currentTaskId === speechTaskCounterRef.current) {
                    currentIndex++;
                    playNext();
                }
            }, 10000);

            const utterance = new SpeechSynthesisUtterance(segments[currentIndex]);
            utterancesRef.current.push(utterance);

            utterance.lang = targetLang;
            if (bestVoice) {
                utterance.voice = bestVoice;
            }

            utterance.rate = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => {
                if (currentTaskId !== speechTaskCounterRef.current) return;
                isSpeakingRef.current = true;
                window.speechSynthesis.resume();
            };

            utterance.onend = () => {
                if (currentTaskId !== speechTaskCounterRef.current) return;
                if (watchdogRef.current) clearTimeout(watchdogRef.current);
                currentIndex++;
                setTimeout(playNext, 400); // Natural breath
            };

            utterance.onerror = () => {
                if (currentTaskId !== speechTaskCounterRef.current) return;
                if (watchdogRef.current) clearTimeout(watchdogRef.current);
                currentIndex++;
                setTimeout(playNext, 100);
            };

            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
        };

        lastSpokenRef.current = text;
        // Small initial delay to ensure engine is clean
        setTimeout(playNext, 50);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTelemetry(prev => ({
                ppfd: Number((prev.ppfd + (Math.random() * 2 - 1)).toFixed(1)),
                ec: Number((prev.ec + (Math.random() * 0.04 - 0.02)).toFixed(2)),
                ph: Number((prev.ph + (Math.random() * 0.02 - 0.01)).toFixed(2)),
                co2: Math.floor(prev.co2 + (Math.random() * 10 - 5)),
                flow: Number((prev.flow + (Math.random() * 0.1 - 0.05)).toFixed(2)),
                humidity: Math.floor(prev.humidity + (Math.random() * 4 - 2)),
                export_vol: prev.export_vol + Math.floor(Math.random() * 45 + 5),
                demand_idx: Number((prev.demand_idx + (Math.random() * 0.4 - 0.2)).toFixed(1)),
                sterility: Number((99.9 + (Math.random() * 0.09)).toFixed(2)),
                growth_rate: Number((prev.growth_rate + (Math.random() * 0.02 - 0.01)).toFixed(2))
            }));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    // Slideshow logic - Driven by Narration if unmuted, otherwise by Time
    useEffect(() => {
        setActiveSlide(0);
        window.speechSynthesis.cancel();

        const slideMap: Record<string, string[]> = {
            global: globalSlides,
            seeding: seedingSlides,
            process: processSlides,
            brand: brandSlides,
            tech: techSlides
        };

        const slides = slideMap[videoMode];
        if (!slides) return;

        // If muted OR language is not supported for voice, we need a time-based fallback to change slides
        const SUPPORTED_VOICE_LANGS = ['ko', 'en', 'ja', 'zh-CN', 'fr', 'de', 'es', 'ar', 'th', 'vi'];
        const isVoiceSupported = SUPPORTED_VOICE_LANGS.includes(language);

        if (isMuted || !isVoiceSupported) {
            const slideInterval = setInterval(() => {
                setActiveSlide(prev => (prev + 1) % slides.length);
            }, 8000); // 8 seconds per slide for reading
            return () => clearInterval(slideInterval);
        }

        // If NOT muted, the narration useEffect will handle setActiveSlide via callback
    }, [videoMode, isMuted]);

    const prevSlideRef = useRef<number>(0);
    const prevModeRef = useRef<string>('');

    // Narration logic - The "Conductor" that drives slide transitions
    useEffect(() => {
        let timer: any;
        let slideTransitionTimer: any;

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            isSpeakingRef.current = false;
            speechTaskCounterRef.current += 1; // Invalidate current task
        }

        if (isMuted) {
            lastSpokenRef.current = '';
            return;
        }

        // Feature Restriction: Only allow Speech for supported languages
        // This prevents awkward fallback behavior for languages without dedicated high-quality voices
        const SUPPORTED_VOICE_LANGS = ['ko', 'en', 'ja', 'zh-CN', 'fr', 'de', 'es', 'ar', 'th', 'vi'];
        if (!SUPPORTED_VOICE_LANGS.includes(language)) {
            // Treat unsupported languages as "Muted" - let the timer logic above handle it
            return;
        }

        const modeJustChanged = prevModeRef.current !== videoMode;
        if (modeJustChanged && activeSlide !== 0) return;

        const langKey = narrations[language] ? language : 'en';
        let modeNarrations = narrations[langKey][videoMode];

        // Fallback for missing 'story' narrations to ensure auto-play works
        if (!modeNarrations && videoMode === 'story') {
            if (langKey === 'ko') {
                modeNarrations = [
                    "와사비가 왜 세상에서 가장 비싼 작물인지 아십니까? 오직 맑은 물과 제한된 환경에서만 허락되는 극도로 희귀한 종이기 때문입니다.",
                    "우리가 먹는 부위는 단순한 뿌리가 아닙니다. 바로 뿌리 위에서 자라나는 '근경'이라는 아주 특별하고 귀한 특수 부위입니다.",
                    "이 근경을 얻기 위해서는 까다로운 기후 조건과 2년이라는 긴 기다림이 필요합니다. 그 희소성과 재배 난이도가 와사비의 높은 가치를 만듭니다.",
                    "우리는 이 자연의 난제를 첨단 기술로 풀었습니다. 데이터로 제어되는 와사비 스마트팜, 이것이 우리가 만드는 농업의 혁신입니다."
                ];
            } else {
                modeNarrations = [
                    "Do you know why Wasabi is the most expensive crop? It is an extremely rare species that grows only in limited environments with pristine water.",
                    "What we consume is not the root, but the 'Rhizome', a special and precious stem part that grows just above the root.",
                    "Obtaining this Rhizome requires exacting climate conditions and two years of waiting. This scarcity drives its immense value.",
                    "We have solved nature's puzzle with advanced technology. Our data-driven smart farm is the innovation we bring to agriculture."
                ];
            }
        }

        const slideMap: Record<string, string[]> = {
            global: globalSlides,
            seeding: seedingSlides,
            process: processSlides,
            brand: brandSlides,
            tech: techSlides,
            story: storySlides
        };
        const slides = slideMap[videoMode];

        if (modeNarrations && modeNarrations[activeSlide]) {
            const targetText = modeNarrations[activeSlide];
            const isFreshStart = lastSpokenRef.current === '' || modeJustChanged;

            // Adjusted delay to 1500ms (1.5s) to ensure audio stability and visual readiness
            const delay = isFreshStart ? 1500 : 800;

            timer = setTimeout(() => {
                speak(targetText, () => {
                    // The delay is now handled inside speak's onComplete for better sync
                    if (slides) {
                        // Check if we are at the last slide of the current mode
                        if (activeSlide >= slides.length - 1) {
                            // Move to the next mode in sequence
                            const modes = ['brand', 'story', 'seeding', 'tech', 'process', 'global'] as const;
                            const currentIdx = modes.indexOf(videoMode as any);
                            const nextMode = modes[(currentIdx + 1) % modes.length];
                            setVideoMode(nextMode);
                            // activeSlide is reset to 0 by the useEffect listener on videoMode
                        } else {
                            // Go to next slide
                            setActiveSlide(prev => prev + 1);
                        }
                    }
                });
                prevModeRef.current = videoMode;
                prevSlideRef.current = activeSlide;
            }, delay);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (slideTransitionTimer) clearTimeout(slideTransitionTimer);
            if (watchdogRef.current) clearTimeout(watchdogRef.current);
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                speechTaskCounterRef.current += 1; // Invalidate current task
            }
        };
    }, [activeSlide, videoMode, isMuted, language]);

    const toggleSound = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);

        if (newMuted) {
            window.speechSynthesis.cancel();
        }
    };

    // Content Mapping for Text Area (Using Translation Keys)
    const contentMap: Record<string, { t1: string; t2: string; desc: string }> = {
        brand: {
            t1: t('hero_brand_t1'),
            t2: t('hero_brand_t2'),
            desc: t('hero_brand_desc')
        },
        story: {
            t1: t('hero_story_t1'),
            t2: t('hero_story_t2'),
            desc: t('hero_story_desc')
        },
        seeding: {
            t1: t('hero_seeding_t1'),
            t2: t('hero_seeding_t2'),
            desc: t('hero_seeding_desc')
        },
        tech: {
            t1: t('hero_tech_t1'),
            t2: t('hero_tech_t2'),
            desc: t('hero_tech_desc')
        },
        process: {
            t1: t('hero_process_t1'),
            t2: t('hero_process_t2'),
            desc: t('hero_process_desc')
        },
        global: {
            t1: t('hero_global_t1'),
            t2: t('hero_global_t2'),
            desc: t('hero_global_desc')
        }
    };

    const currentContent = contentMap[videoMode] || contentMap['brand'];

    return (
        <div className={classes.hero} style={{ background: '#000000', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle Tech Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                zIndex: 0
            }} />

            <Container size="xl" className={classes.inner} style={{ position: 'relative', zIndex: 2, height: '100%', minHeight: '720px' }}>

                {/* Title Section (Moved Up to avoid overlap) */}
                {/* Combined Title Section (t1 & t2) - Stacked to prevent overlap */}
                {/* Combined Title Section (t1 & t2) - Swapped Hierarchy */}
                <div style={{
                    position: 'absolute',
                    top: '12%', // Moved up significantly
                    left: '2rem',
                    width: '90%', // Much wider to keep t1 on one line
                    zIndex: 10,
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                }}>
                    {/* t1: NOW THE MAIN TITLE - Big, Green, One Line */}
                    <Title order={1} className={classes.title} style={{
                        textAlign: 'left',
                        fontSize: '3.8rem', // Large size (~60px)
                        lineHeight: 1.1,
                        whiteSpace: 'nowrap', // Force one line
                        overflow: 'hidden',
                        color: 'var(--mantine-color-wasabi-5)',
                        textOverflow: 'ellipsis' // Graceful fallback
                    }}>
                        {currentContent.t1}
                    </Title>

                    {/* t2: NOW THE SUBTITLE - Smaller, White/Gray */}
                    <Title order={3} style={{
                        textAlign: 'left',
                        color: '#f8f9fa',
                        fontSize: '1.5rem', // Smaller size
                        fontWeight: 300,
                        opacity: 0.9,
                        marginTop: '0px'
                    }}>
                        {/* Removed highlight class as this is now subtitle */}
                        {currentContent.t2}
                    </Title>
                </div>

                {/* Left Side: Description & Controls (Fixed Position) */}
                <div style={{
                    position: 'absolute',
                    top: '60%', // Moved down slightly
                    transform: 'translateY(-50%)',
                    left: 0,
                    width: '45%',
                    paddingLeft: '2rem',
                    zIndex: 10
                }}>
                    <Text className={classes.description} size="xl" style={{ textAlign: 'left', color: '#e9ecef' }}>
                        {currentContent.desc}
                    </Text>

                    <Group className={classes.controls} mt={40} justify="flex-start">
                        <Button
                            component={Link}
                            href="/admin"
                            size="lg"
                            className={classes.control}
                            color="wasabi"
                            radius="md"
                        >
                            {t('hero_btn_admin')}
                        </Button>
                        <Button
                            component={Link}
                            href="/admin/hunter"
                            variant="white"
                            size="lg"
                            className={classes.control}
                            radius="md"
                            color="wasabi.8"
                        >
                            {t('hero_btn_hunter')}
                        </Button>
                    </Group>
                </div>

                {/* Right Side: Video Box (Fixed Position) */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: 0,
                    width: '48%', // Decreased width to prevent overlap
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    {/* Standardized Navigation Grid (3x2) - Controlling Video Mode */}
                    <SimpleGrid cols={3} spacing="xs" mb="lg" style={{ width: '100%' }}>
                        {[
                            { id: 'brand', label: t('hero_nav_brand'), icon: <IconMovie size={14} /> },
                            { id: 'story', label: t('hero_nav_story'), icon: <IconBook size={14} /> },
                            { id: 'seeding', label: t('hero_nav_tech'), icon: <IconLeaf size={14} /> },
                            { id: 'tech', label: t('hero_nav_insight'), icon: <IconChartBar size={14} /> },
                            { id: 'process', label: t('hero_nav_process'), icon: <IconRefresh size={14} /> },
                            { id: 'global', label: t('hero_nav_global'), icon: <IconWorld size={14} /> }
                        ].map((item) => (
                            <Button
                                key={item.id}
                                onClick={() => {
                                    setVideoMode(item.id as any);
                                    setActiveSlide(0);
                                }}
                                variant={videoMode === item.id ? 'filled' : 'outline'}
                                color={videoMode === item.id ? 'wasabi' : 'gray'}
                                size="xs"
                                radius="xl"
                                leftSection={item.icon}
                                style={{
                                    transition: 'all 0.3s ease',
                                    opacity: videoMode === item.id ? 1 : 0.6,
                                    letterSpacing: '-0.5px', // Condense text
                                    paddingLeft: '4px',      // Tighten padding
                                    paddingRight: '4px',
                                    fontSize: '11px'         // Slightly smaller font
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </SimpleGrid>

                    <div style={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 0 30px rgba(64, 192, 87, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '2px solid rgba(64, 192, 87, 0.3)',
                        width: '100%',
                        position: 'relative',
                        background: '#000000' // Matched with Hero background
                    }}>
                        <div
                            style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                position: 'relative',
                                overflow: 'hidden',
                                background: '#000000' // Matched with Hero background
                            }}
                        >
                            {(videoMode === 'global' ? globalSlides :
                                videoMode === 'seeding' ? seedingSlides :
                                    videoMode === 'process' ? processSlides :
                                        videoMode === 'brand' ? brandSlides :
                                            videoMode === 'story' ? storySlides :
                                                techSlides).map((slide, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            position: 'absolute',
                                                            inset: 0,
                                                            backgroundImage: `url(${slide})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            opacity: activeSlide === idx ? 1 : 0,
                                                            transition: 'opacity 3s ease-in-out', // Slower blend for more seamless feel
                                                            animation: 'kenburns 120s linear infinite', // Ultra-long duration to prevent reset jumps during a single loop
                                                            filter: 'brightness(1.1) saturate(1.1) contrast(1.1)'
                                                        }}
                                                    />
                                                ))}
                        </div>

                        {/* --- HIGH-TECH HUD OVERLAY (MAKEUP) --- */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 5,
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {/* Corner Brackets */}
                            <div style={{ position: 'absolute', top: 20, left: 20, width: 30, height: 30, borderTop: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`, borderLeft: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}` }} />
                            <div style={{ position: 'absolute', top: 20, right: 20, width: 30, height: 30, borderTop: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`, borderRight: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}` }} />
                            <div style={{ position: 'absolute', bottom: 20, left: 20, width: 30, height: 30, borderBottom: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`, borderLeft: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}` }} />
                            <div style={{ position: 'absolute', bottom: 20, right: 20, width: 30, height: 30, borderBottom: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`, borderRight: `2px solid ${videoMode === 'tech' ? '#51cf66' : '#40c057'}` }} />

                            {/* Scanning Line */}
                            <div className="scanning-line" style={{
                                position: 'absolute',
                                left: 0,
                                width: '100%',
                                height: '2px',
                                background: `linear-gradient(to right, transparent, ${videoMode === 'tech' ? 'rgba(81, 207, 102, 0.7)' : 'rgba(64, 192, 87, 0.5)'}, transparent)`,
                                boxShadow: `0 0 15px ${videoMode === 'tech' ? '#51cf66' : '#40c057'}`,
                                animation: videoMode === 'tech' ? 'scan 2.5s linear infinite' : 'scan 4s linear infinite'
                            }} />

                            {/* Data Readouts - Left Top */}
                            <div style={{ position: 'absolute', top: 30, left: 60, fontFamily: 'monospace', fontSize: '10px', color: '#51cf66', textShadow: '0 0 5px #40c057' }}>
                                ● {videoMode === 'tech' ? 'LABORATORY MODE' :
                                    videoMode === 'seeding' ? 'BIO-LAB CONNECTED' :
                                        videoMode === 'process' ? 'FARM TO TABLE ACTIVATED' :
                                            videoMode === 'global' ? 'SUPPLY CHAIN ACTIVE' : 'SYSTEM ONLINE'}
                            </div>
                            <div style={{ marginTop: 4 }}>LOC: HWACHEON_01</div>
                            <div style={{ marginTop: 2 }}>{
                                videoMode === 'seeding' ? 'PROTOCOL: TISSUE_CULTURE' :
                                    videoMode === 'process' ? 'PROTOCOL: FULL_LIFECYCLE' :
                                        videoMode === 'global' ? 'MARKET_CHANNEL: WORLDWIDE' : 'ENCRYPTED_LINK: SECURE'
                            }</div>
                            <div style={{ marginTop: 2, color: '#abd5bd' }}>
                                {videoMode === 'tech' ? 'SCANNING_MOLECULAR_STRUCTURE...' :
                                    videoMode === 'seeding' ? 'STERILITY_STATUS: NOMINAL_99.9%' :
                                        videoMode === 'process' ? 'TRACEABILITY_STATUS: VERIFIED' :
                                            videoMode === 'global' ? 'LOGISTICS_STATUS: CLEAR_FOR_EXPORT' : ''}
                            </div>
                        </div>

                        {/* Data Readouts - Left Bottom */}
                        <div style={{ position: 'absolute', bottom: 60, left: 60, fontFamily: 'monospace', fontSize: '10px', color: '#51cf66' }}>
                            {videoMode === 'global' ? (
                                <>
                                    <div style={{ color: '#adb5bd', fontSize: '9px', marginBottom: '4px' }}>GLOBAL_INTELLIGENCE: ACTIVE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                                        EXPORT_VOL: {telemetry.export_vol.toLocaleString()} KG
                                        <span style={{ color: '#51cf66', animation: 'pulser 1s infinite', fontSize: '10px', background: 'rgba(81, 207, 102, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>▲ LIVE</span>
                                    </div>
                                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <div style={{ color: '#adb5bd' }}>GLOBAL_NODES</div>
                                            <div style={{ color: '#74c0fc' }}>TYO | NYC | PAR | DXB</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#adb5bd' }}>TRUST_RANK</div>
                                            <div style={{ color: '#fab005' }}>AAA+ (SUPREME)</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 6, color: '#adb5bd', fontSize: '8px' }}>DEMAND_SURGE: ASIA_NORTH (+14.2%) | EUROPE_WEST (+8.4%)</div>
                                </>
                            ) : videoMode === 'tech' ? (
                                <>
                                    <div>SENSOR_STATUS: ONLINE</div>
                                    <div>AI_INFERENCE: 12.4ms</div>
                                    <div style={{ color: '#51cf66' }}>OPTIMIZATION_ACTIVE: YES</div>
                                    <div style={{ marginTop: 2, color: '#4dabf7' }}>NODE_ID: HW_LAB_04</div>
                                </>
                            ) : videoMode === 'seeding' ? (
                                <>
                                    <div style={{ color: '#adb5bd', fontSize: '9px', marginBottom: '4px', letterSpacing: '1px' }}>BIO_LAB_MONITOR: ACTIVE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#74c0fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {
                                            activeSlide === 0 ? 'STATUS: GENE_MAPPING' :
                                                activeSlide === 1 ? 'STATUS: STERILIZATION' :
                                                    activeSlide === 2 ? 'STATUS: CULTURE_CTRL' : 'STATUS: SCALE_OUT'
                                        }
                                        <div style={{ width: '8px', height: '8px', background: '#74c0fc', borderRadius: '50%', animation: 'pulser 1s infinite' }} />
                                    </div>
                                    <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '8px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: `${((activeSlide + 1) / 4) * 100}%`,
                                            background: '#74c0fc',
                                            transition: 'width 1.5s ease-in-out',
                                            boxShadow: '0 0 10px #74c0fc'
                                        }} />
                                    </div>
                                    <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <div style={{ color: '#adb5bd', fontSize: '8px' }}>PURITY_IDX</div>
                                            <div style={{ color: '#fff', fontSize: '10px' }}>{99.99 - (activeSlide * 0.01)}%_NOMINAL</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#adb5bd', fontSize: '8px' }}>ENV_STABILITY</div>
                                            <div style={{ color: '#74c0fc', fontSize: '10px' }}>{99.98 + (activeSlide * 0.005)}%</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 6, fontSize: '8px', color: '#adb5bd' }}>
                                        SYSTEM_REF: BIO_HW_00{activeSlide + 1} | STACK: TISSUE_ENGINEERING
                                    </div>
                                </>
                            ) : videoMode === 'process' ? (
                                <>
                                    <div style={{ color: '#adb5bd', fontSize: '9px', marginBottom: '4px' }}>SMART_FACTORY_TRACKER: ACTIVE</div>
                                    <div style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px', color: '#40c057' }}>
                                        {
                                            activeSlide === 0 ? '01_AUTOMATED_SEEDING' :
                                                activeSlide === 1 ? '02_HYDRO_WASHING' :
                                                    activeSlide === 2 ? '03_GROWTH_ACCELERATION' :
                                                        activeSlide === 3 ? '04_AI_ENVIRONMENT_CTRL' :
                                                            activeSlide === 4 ? '05_PURE_PURIFICATION' : '06_RESOURCE_RETURN'
                                        }
                                    </div>
                                    <div style={{ width: '150px', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '8px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: `${((activeSlide + 1) / 6) * 100}%`,
                                            background: '#40c057',
                                            transition: 'width 1s ease-in-out',
                                            boxShadow: '0 0 10px #40c057'
                                        }} />
                                    </div>
                                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '9px' }}>
                                        <div>
                                            <div style={{ color: '#adb5bd' }}>STABILITY</div>
                                            <div style={{ color: '#40c057' }}>99.8%_NOMINAL</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#adb5bd' }}>THROUGHPUT</div>
                                            <div style={{ color: '#40c057' }}>{telemetry.export_vol % 1000} U/min</div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>PPFD: {telemetry.ppfd} μmol/m²/s</div>
                                    <div>EC: {telemetry.ec} mS/cm | PH: {telemetry.ph}</div>
                                    <div>CO₂: {telemetry.co2} PPM</div>
                                    <div style={{ marginTop: 2, color: '#51cf66' }}>SYS_STABILITY: 100%_NOMINAL</div>
                                </>
                            )}
                        </div>

                        {/* Tech-Specific Overlay Elements */}
                        {videoMode === 'tech' && (
                            <>
                                {/* Molecular Pattern Drawing (Simple CSS visualization) */}
                                <div style={{ position: 'absolute', top: 30, right: 60, width: 80, height: 80, opacity: 0.4 }}>
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 40, height: 1, background: '#51cf66', rotate: '30deg' }} />
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 40, height: 1, background: '#51cf66', rotate: '-30deg' }} />
                                    <div style={{ position: 'absolute', top: '25%', left: '42%', width: 6, height: 6, border: '1px solid #51cf66', borderRadius: '50%' }} />
                                    <div style={{ position: 'absolute', bottom: '25%', left: '42%', width: 6, height: 6, border: '1px solid #51cf66', borderRadius: '50%' }} />
                                    <div style={{ position: 'absolute', top: '46%', left: '20%', width: 6, height: 6, border: '1px solid #51cf66', borderRadius: '50%' }} />
                                    <div style={{ position: 'absolute', top: '46%', right: '20%', width: 6, height: 6, border: '1px solid #51cf66', borderRadius: '50%' }} />
                                    <div style={{ fontSize: '8px', position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>C10H20O</div>
                                </div>

                                {/* Scanning Box Detail */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20%',
                                    right: '15%',
                                    width: '120px',
                                    height: '60px',
                                    border: '1px solid rgba(81, 207, 102, 0.4)',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    padding: '5px'
                                }}>
                                    <div style={{ color: '#51cf66', fontSize: '8px', borderBottom: '1px solid rgba(81, 207, 102, 0.4)', paddingBottom: '2px' }}>REAL-TIME ANALYSIS</div>
                                    <div style={{ display: 'flex', gap: '2px', marginTop: '5px' }}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <div key={i} style={{
                                                flex: 1,
                                                height: Math.random() * 20 + 5 + 'px',
                                                background: '#51cf66',
                                                opacity: Math.random() * 0.5 + 0.3
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Center Target */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: (videoMode === 'tech' || videoMode === 'seeding') ? 60 : 40,
                            height: (videoMode === 'tech' || videoMode === 'seeding') ? 60 : 40,
                            border: videoMode === 'seeding' ? '1px solid rgba(116, 192, 252, 0.4)' : '1px solid rgba(81, 207, 102, 0.4)',
                            borderRadius: '50%'
                        }}>
                            <div style={{ position: 'absolute', top: '50%', left: '-10px', right: '-10px', height: '1px', background: 'rgba(81, 207, 102, 0.4)' }} />
                            <div style={{ position: 'absolute', left: '50%', top: '-10px', bottom: '-10px', width: '1px', background: 'rgba(81, 207, 102, 0.4)' }} />
                            {videoMode === 'tech' && (
                                <div style={{
                                    position: 'absolute',
                                    inset: '10px',
                                    border: '1px dashed rgba(81, 207, 102, 0.3)',
                                    borderRadius: '50%',
                                    animation: 'rotate 10s linear infinite'
                                }} />
                            )}
                        </div>
                    </div>

                    {/* Glass reflection effect */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(120deg, rgba(255,255,255,0.05) 0%, transparent 40%)',
                        pointerEvents: 'none',
                        zIndex: 6
                    }} />

                    {/* Sound Toggle Button */}
                    <Tooltip label={isMuted ? "Enable Sound" : "Mute Sound"} position="left">
                        <ActionIcon
                            variant="filled"
                            color="wasabi"
                            size="xl"
                            radius="xl"
                            onClick={toggleSound}
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 10,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                opacity: 0.8
                            }}
                        >
                            {isMuted ? <IconVolumeOff size={24} /> : <IconVolume size={24} />}
                        </ActionIcon>
                    </Tooltip>
                </div>
            </Container>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
                @keyframes pulser {
                    0% { opacity: 0.4; }
                    50% { opacity: 1; }
                    100% { opacity: 0.4; }
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes kenburns {
                    0% { transform: scale(1.01); }
                    100% { transform: scale(1.3); }
                }
            `}</style>
        </div>
    );
}

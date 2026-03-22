-- ============================================================
-- Know Korea — Seed Data
-- Run this in Supabase SQL Editor
-- ============================================================

-- Clear existing seed data if re-running
DELETE FROM contents WHERE is_published = true AND author_id IS NULL;

INSERT INTO contents (title, slug, category, excerpt, cover_image, body_mdx, tags, is_published, show_bmc, view_count)
VALUES

-- ── 1. start-here ───────────────────────────────────────────
(
  'Welcome to Korea: Your First 30 Days Survival Guide',
  'first-30-days-survival-guide',
  'start-here',
  'Moving to Korea? Here is exactly what to do in your first 30 days — from ARC registration to finding your neighbourhood pharmacy.',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  '<h2 id="day-one">Day 1–3: Settle In</h2>
<p>Your first priority is finding a SIM card and temporary accommodation. Both are easy to get at Incheon Airport. Pick up a prepaid SIM from SK, KT, or LG at the airport arrivals hall — no Korean required, just your passport.</p>
<h2 id="arc">Getting Your ARC (Alien Registration Card)</h2>
<p>Within 90 days of arrival you must register at your local Immigration Office (출입국외국인청). Bring your passport, visa, one passport-sized photo, and proof of address (landlord contract or hotel booking). This card becomes your Korean ID for everything from opening a bank account to signing up for mobile plans.</p>
<h2 id="essentials">Essential Apps to Download</h2>
<p>Install <strong>Naver Maps</strong>, <strong>KakaoTalk</strong>, <strong>Papago</strong> (translation), and <strong>Toss</strong> (payments) before anything else. These four apps will solve 80% of your daily friction in the first month.</p>',
  ARRAY['arc', 'visa', 'newcomer', 'essentials'],
  true, true, 3840
),
(
  'How to Get a Korean Phone Number as a Foreigner',
  'korean-phone-number-foreigner',
  'start-here',
  'Step-by-step guide to getting a Korean SIM — prepaid, postpaid, and MVNO options explained for non-citizens.',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
  '<h2 id="options">Your Three Options</h2>
<p>You have three paths: <strong>prepaid (선불폰)</strong>, <strong>postpaid contract (약정)</strong>, or an <strong>MVNO</strong> like Hello Mobile or HeliOS. For most newcomers, prepaid is the easiest start — no Korean credit history required.</p>
<h2 id="mvno">MVNOs: The Smart Choice</h2>
<p>Mobile Virtual Network Operators run on the same towers as the big three carriers but cost 40–60% less. Hello Mobile and Heliős are popular with expats. You can sign up online in English with just your ARC and a Korean bank account.</p>',
  ARRAY['phone', 'sim', 'telecom', 'newcomer'],
  true, false, 2210
),

-- ── 2. language ─────────────────────────────────────────────
(
  'Survival Korean: 50 Phrases You Actually Need',
  'survival-korean-50-phrases',
  'language',
  'Skip the textbook openers. These are the real phrases that get you through restaurants, taxis, pharmacies, and convenience stores.',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  '<h2 id="daily">Daily Interactions</h2>
<p>Start with three phrases that cover 90% of interactions: <em>이거 주세요</em> (I'll take this), <em>얼마예요?</em> (How much?), and <em>영수증 필요 없어요</em> (No receipt needed). Add <em>감사합니다</em> liberally.</p>
<h2 id="restaurant">At the Restaurant</h2>
<p>Korean menus are increasingly visual — point is perfectly acceptable. When you're ready to pay, catch the server's eye and say <em>계산서 주세요</em> or simply <em>계산이요!</em>. Most places now have table buzzers or QR ordering.</p>',
  ARRAY['korean', 'phrases', 'beginner', 'language'],
  true, false, 5120
),
(
  'Mastering Speech Levels: Formal vs. Informal Korean',
  'speech-levels-formal-informal',
  'language',
  'Korean has 7 speech levels. In practice you need two. Here is when to use each and how to switch without embarrassing yourself.',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b6f75?w=800&q=80',
  '<h2 id="two-levels">The Two Levels You Actually Use</h2>
<p><strong>해요체 (haeyoche)</strong> — polite informal — is your default. Use it with colleagues, shop staff, neighbours, and anyone older than you. <strong>합쇼체 (hapshoche)</strong> — formal — appears in presentations, customer service calls, and official announcements.</p>
<h2 id="casual">When Casual Works</h2>
<p>반말 (banmal) is reserved for close friends, children, and people who explicitly invite you to drop formality. Never switch to banmal unilaterally — wait for the Korean person to suggest it.</p>',
  ARRAY['speech-levels', 'formal', 'honorifics', 'language'],
  true, true, 2980
),

-- ── 3. life-in-korea ────────────────────────────────────────
(
  'Navigating the Korean Healthcare System: A 2024 Guide',
  'navigating-korean-healthcare',
  'life-in-korea',
  'Everything you need to know about Korea's National Health Insurance — how to enrol, what's covered, and how to find an English-speaking doctor.',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  '<h2 id="nhis">National Health Insurance (국민건강보험)</h2>
<p>If you have an ARC and are employed, you are automatically enrolled in NHIS and contributions are deducted from your salary. Freelancers and self-employed expats must register directly at the nearest NHIS branch.</p>
<h2 id="hospitals">Clinics vs. Hospitals</h2>
<p>For routine illness, visit a <em>의원</em> (local clinic) — faster, cheaper, and often has shorter waits. Reserve <em>병원</em> and <em>대학병원</em> (university hospitals) for specialist referrals or emergencies. Co-pay is typically 30% of the bill.</p>',
  ARRAY['healthcare', 'nhis', 'hospital', 'insurance'],
  true, true, 6450
),
(
  'Jeonse vs. Wolse: Understanding Korean Rental Contracts',
  'jeonse-vs-wolse-rental-contracts',
  'life-in-korea',
  'The lump-sum deposit system (jeonse) sounds insane to most foreigners. Here is how it works, when it makes sense, and the red flags to watch for.',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
  '<h2 id="jeonse">Jeonse (전세): The Deposit System</h2>
<p>You deposit 60–80% of the property value — sometimes hundreds of millions of won — and live rent-free for two years. At the end, you get the full deposit back. It sounds risky because it is: always check the property's mortgage status at the local registry office (<em>등기소</em>) before signing.</p>
<h2 id="wolse">Wolse (월세): Monthly Rent</h2>
<p>A smaller deposit (보증금, typically 1–10M KRW) plus monthly rent. More predictable, lower initial outlay. Most foreign newcomers start here. Utilities are almost always separate.</p>',
  ARRAY['rental', 'jeonse', 'wolse', 'housing', 'apartment'],
  true, false, 4110
),

-- ── 4. work-business ────────────────────────────────────────
(
  'Working in Korea as a Foreigner: What No One Tells You',
  'working-in-korea-foreigner-guide',
  'work-business',
  'Office culture, hierarchy, 회식 (hoesik), and the unwritten rules that determine whether you thrive or burn out in a Korean company.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  '<h2 id="hierarchy">Hierarchy Is Real</h2>
<p>Korean workplaces follow a strict seniority structure. Your 직급 (jikgeup — rank title) determines almost everything: who speaks first in meetings, seating order at dinner, and how decisions get made. As a foreigner you get some leeway, but ignoring hierarchy entirely will create tension.</p>
<h2 id="hoesik">Hoesik (회식)</h2>
<p>Team dinners are part of the job. Attendance is not technically mandatory but skipping repeatedly sends a signal. You do not need to drink alcohol — ordering juice or soda is increasingly accepted — but you do need to show up.</p>',
  ARRAY['work', 'culture', 'office', 'hoesik', 'hierarchy'],
  true, true, 3320
),
(
  'How to File Your Year-End Tax Settlement in Korea',
  'year-end-tax-settlement-korea',
  'work-business',
  'Every January Korean employees file 연말정산 (yeon-mal jeongsan). Here is the complete checklist so you don't miss deductions.',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  '<h2 id="what-is">What Is Yeon-Mal Jeongsan?</h2>
<p>Korea taxes income at source throughout the year (withheld from your salary). The year-end settlement reconciles what you paid against what you actually owed. Most employees get a refund; some owe additional tax.</p>
<h2 id="deductions">Key Deductions for Expats</h2>
<p>Medical expenses, education costs, rent payments (if applicable), credit card spending, and insurance premiums are all deductible to varying degrees. Collect receipts — everything goes through the Hometax (홈택스) portal.</p>',
  ARRAY['tax', 'yearend', 'settlement', 'work', 'finance'],
  true, false, 2740
),

-- ── 5. practical-guide ──────────────────────────────────────
(
  'How to Open a Korean Bank Account as a Foreigner',
  'open-korean-bank-account-foreigner',
  'practical-guide',
  'Step-by-step for Shinhan, KEB Hana, and KB Kookmin — including the documents you need and the digital-only alternatives.',
  'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80',
  '<h2 id="required-docs">Required Documents</h2>
<p>Bring your <strong>passport</strong>, <strong>ARC</strong>, and <strong>Korean phone number</strong>. Some branches also ask for proof of address (a utility bill or lease agreement). Without an ARC, Shinhan and KEB Hana have foreigner-friendly branches that accept only a passport — call ahead to confirm.</p>
<h2 id="digital">Digital Alternatives</h2>
<p>Kakao Bank and Toss Bank allow fully online account opening with just your ARC and phone number. The apps are available in English and the UX is far superior to legacy banks. Transfers, bill payments, and top-ups all work seamlessly.</p>',
  ARRAY['bank', 'account', 'shinhan', 'kakaobank', 'finance'],
  true, true, 7890
),
(
  'Getting a Climate Card (기후카드) for Unlimited Transit',
  'climate-card-unlimited-transit',
  'practical-guide',
  'The climate card gives you unlimited bus and subway rides for a monthly flat fee. Here is how to get one and which zone to choose.',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  '<h2 id="what-is">What Is the Climate Card?</h2>
<p>Launched in 2024 to encourage public transit use, the 기후동행카드 (climate mobility card) costs 62,000–65,000 KRW per month and gives unlimited rides on Seoul Metro, city buses, and Ttareungyi bikes. It does not cover airport railroad (AREX) or Gyeonggi buses by default.</p>
<h2 id="how-to-get">How to Get One</h2>
<p>Load the card at any Seoul Metro ticket machine. Top up monthly via the Seoul Climate Card app (iOS/Android). Physical cards available at major stations; mobile version works on iOS and Android NFC.</p>',
  ARRAY['transit', 'subway', 'climate-card', 'transportation', 'budget'],
  true, false, 4560
),

-- ── 6. culture-society ──────────────────────────────────────
(
  'Korean Social Norms: The Do''s and Don''ts for Expats',
  'korean-social-norms-dos-donts',
  'culture-society',
  'From receiving business cards to splitting bills, these are the cultural customs that will save you from awkward misunderstandings.',
  'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80',
  '<h2 id="greetings">Greetings and Bowing</h2>
<p>A slight bow (15–30°) is the standard greeting. Deep bows (45–90°) are reserved for formal apologies or greeting elders. Handshakes are common in business — often paired with a slight bow. Never offer your left hand.</p>
<h2 id="dining">Dining Etiquette</h2>
<p>Wait for the eldest person to sit and start eating first. Pour drinks for others; never pour your own. If someone offers you a drink, hold your glass with both hands or with your right hand supported by your left. Blowing your nose at the table is considered very rude — excuse yourself instead.</p>',
  ARRAY['culture', 'etiquette', 'social-norms', 'dining'],
  true, false, 3150
),

-- ── 7. travel-places ────────────────────────────────────────
(
  'Beyond Seoul: The Best Weekend Trips from the Capital',
  'best-weekend-trips-from-seoul',
  'travel-places',
  'Busan, Gyeongju, Seoraksan, and more — all reachable in under 3 hours. Here is how to plan each trip without a car.',
  'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&q=80',
  '<h2 id="busan">Busan (부산) — 2.5 hrs by KTX</h2>
<p>Korea's second city has Haeundae beach, the best seafood market in the country (Jagalchi), and the colourful Gamcheon Culture Village. Take the KTX from Seoul Station — tickets start at 59,800 KRW each way. Book 2 weeks ahead for weekend trains.</p>
<h2 id="gyeongju">Gyeongju (경주) — 2 hrs by KTX</h2>
<p>The ancient capital of the Silla Kingdom feels like an open-air museum. Tumuli Park, Bulguksa Temple, and Seokguram Grotto are UNESCO World Heritage sites all within cycling distance. Rent a bike at the station — everything is flat.</p>',
  ARRAY['travel', 'busan', 'gyeongju', 'weekend-trip', 'ktx'],
  true, false, 5680
),

-- ── 8. history-politics ─────────────────────────────────────
(
  'Understanding the Korean War and Its Legacy',
  'korean-war-legacy-guide',
  'history-politics',
  'The war ended in 1953 but never formally concluded. Here is what expats need to know about Korea's divided peninsula and why it still shapes daily life.',
  'https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=800&q=80',
  '<h2 id="armistice">The Armistice, Not a Peace Treaty</h2>
<p>The Korean War (1950–1953) ended with an armistice — a ceasefire agreement — not a peace treaty. Technically the war is still ongoing, which is why a DMZ still exists and why South Korea maintains mandatory military service for male citizens.</p>
<h2 id="daily-life">How It Affects Daily Life</h2>
<p>Most Koreans have grown up with the division as a background fact of life. Emergency sirens drill twice a year. The DMZ is paradoxically one of the most biodiverse zones in Asia due to 70 years of human absence. Visiting the JSA (Joint Security Area) at Panmunjom is possible on organised tours.</p>',
  ARRAY['korean-war', 'history', 'dmz', 'north-korea'],
  true, false, 1890
),

-- ── 9. economy-money ────────────────────────────────────────
(
  'Cost of Living in Seoul: A Realistic 2024 Budget Breakdown',
  'cost-of-living-seoul-2024',
  'economy-money',
  'Rent, food, transport, and entertainment — what you actually spend each month as a single expat living in Seoul.',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
  '<h2 id="rent">Rent</h2>
<p>A studio (원룸) in Mapo or Hongdae runs 550,000–900,000 KRW/month with a small deposit (보증금 5–10M KRW). Closer to Gangnam expect 900,000–1,500,000+ KRW. Goshiwon (고시원, micro-room) options start at 350,000 KRW but are tiny.</p>
<h2 id="food">Food</h2>
<p>Eating Korean food keeps costs low: lunch at a local 식당 averages 8,000–12,000 KRW, convenience store meals 4,000–7,000 KRW. Western food and imported groceries cost 2–3× more. Cook at home from Emart or Homeplus to save significantly.</p>',
  ARRAY['cost-of-living', 'seoul', 'budget', 'rent', 'money'],
  true, true, 8920
),

-- ── 10. comparison ──────────────────────────────────────────
(
  'Korea vs. Japan: Which Country Is Better for Expats?',
  'korea-vs-japan-expat-comparison',
  'comparison',
  'Language barrier, cost of living, visa options, social life, and food — an honest side-by-side comparison for people choosing between the two.',
  'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80',
  '<h2 id="language">Language Barrier</h2>
<p>Korean (Hangul) takes roughly 1–2 hours to learn to read phonetically — a huge advantage for daily navigation. Japanese requires mastering three scripts (Hiragana, Katakana, Kanji) for the same level. Korea also has more English signage in major cities.</p>
<h2 id="cost">Cost of Living</h2>
<p>Seoul and Tokyo are comparable for rent in central areas. Seoul is cheaper for food, public transit, and healthcare. Tokyo is pricier for alcohol and entertainment. Both cities have excellent public transit that makes car ownership unnecessary.</p>',
  ARRAY['comparison', 'japan', 'expat', 'cost-of-living', 'visa'],
  true, false, 9340
),

-- ── 11. real-stories ────────────────────────────────────────
(
  'From Canada to Seoul: My First Year as an English Teacher',
  'canada-to-seoul-english-teacher-first-year',
  'real-stories',
  'I came on an E-2 visa with one suitcase and zero Korean. Here is what actually happened — the good, the confusing, and the stuff I wish someone had told me.',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
  '<h2 id="arrival">Arrival</h2>
<p>My school picked me up at Incheon, which was both reassuring and slightly unsettling — I had no idea what the city looked like yet, and suddenly I was in a van driving to an apartment I'd never seen. The apartment was small by North American standards but perfectly liveable, and the school had stocked the fridge with basics. I cried a little. I'm not ashamed.</p>
<h2 id="first-month">The First Month</h2>
<p>Teaching 25 kids aged 8–12 who mostly speak no English is a master class in non-verbal communication. Bring laminated flashcards, energy, and a high tolerance for noise. The teachers' room runs on instant coffee and collective suffering — in the best possible way.</p>',
  ARRAY['real-stories', 'english-teacher', 'e2-visa', 'expat-life'],
  true, false, 2460
),

-- ── 12. tools-resources ─────────────────────────────────────
(
  'The 10 Apps Every Expat in Korea Needs on Their Phone',
  'essential-apps-expat-korea',
  'tools-resources',
  'Naver Maps, KakaoTalk, Papago, Toss — and six others you may not know about that will genuinely make your life easier.',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
  '<h2 id="navigation">Navigation</h2>
<p><strong>Naver Maps</strong> is essential — Google Maps has poor coverage of Korean transit and walking routes. Naver Maps shows real-time bus arrivals, subway transfers, and walking estimates that are uncannily accurate. Download it before you land.</p>
<h2 id="communication">Communication</h2>
<p><strong>KakaoTalk</strong> is not optional — it is how Korea communicates. Your bank, doctor, school, and landlord will all use it. Set up a Korean phone number first, then verify the account. Enable message translation in settings for non-English chats.</p>',
  ARRAY['apps', 'naver', 'kakao', 'tools', 'expat'],
  true, true, 6670
);

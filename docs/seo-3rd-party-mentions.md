# MTS Hijyen — 3rd-Party Mention Stratejisi

> **Amaç:** Site içi SEO + schema + llms.txt zaten yapıldı. Bundan sonraki kazanç **dış sinyallerden** gelir. LLM'ler (ChatGPT, Claude, Perplexity, Gemini) bir markayı "gerçek/güvenilir" sayması için bağımsız kaynaklardan tutarlı şekilde bahsedilmesi gerekir. Kendi sitenin dışında ne kadar doğrulanabilir iz varsa o kadar önerilirsin.

**Genel kural:** NAP (Name / Address / Phone) tutarlılığı **şart**.
Her platformda birebir aynı:
- **Ad:** MTS Hijyen
- **Adres:** Atatürk Mah. Uysal Cad. No:116, Sancaktepe / İstanbul
- **Telefon:** +90 (543) 683 5765
- **E-posta:** info@mtshijyen.com
- **Web:** https://www.mtshijyen.com

Tek bir farklılık bile (parantezsiz telefon, tire vs. eğik çizgi, vs.) Google'da "NAP inconsistency" penalty'sine neden olur.

---

## 🔴 TIER 1 — Şart, hemen yapılmalı (1-2 hafta)

### 1. Google Business Profile (eski Google My Business)
- **Neden kritik:** Local Pack + Maps + Knowledge Panel'in temel kaynağı. LLM'ler de bunu citation alıyor.
- **Yapılacak:**
  - business.google.com → kayıt
  - Kategori: "Hijyen Ürünleri Toptan Satıcısı" / "Wholesale Hygiene Supplier"
  - NAP'ı sitedekiyle **birebir** doldur
  - Foto ekle (ofis, depo, ürün, ekip — en az 10 adet)
  - Çalışma saatlerini gir: Pzt-Cum 08:00-18:00, Cmt 09:00-14:00
  - Posts / Updates bölümünü haftalık güncelle
- **Bonus:** Q&A bölümüne sıkça sorulan soruları kendin sor + cevapla ("Türkiye'nin neresine teslimat?", "Minimum sipariş?", "Otel için tedarik?")
- **Hedef:** En az **5 gerçek müşteriden** Google review (sahte yapma)
- **Tamamlandığında:** Profile URL'yi schema'daki `sameAs` listesine ekle

### 2. Wikidata kaydı
- **Neden kritik:** Tüm büyük LLM'ler training datasında Wikidata'yı ham olarak kullanır. Wikidata'da entity'n yoksa "kim bu?" demezler — yok sayarlar.
- **Yapılacak:**
  - wikidata.org → "Create new item" → "MTS Hijyen"
  - Properties:
    - `instance of` (P31): wholesale business, hygiene products manufacturer
    - `country` (P17): Turkey
    - `inception` (P571): 2010
    - `headquarters location` (P159): Sancaktepe, Istanbul
    - `official website` (P856): https://www.mtshijyen.com
    - `industry` (P452): hygiene products / wholesale
    - `certification` (P1424): ISO 9001:2015
- **Süre:** ~15 dakika, ücretsiz, anında indexlenir
- **Tamamlandığında:** Wikidata Q-ID'sini (örn. Q12345678) schema'daki `sameAs` listesine ekle → entity graph kapanır

### 3. İstanbul Ticaret Odası (İTO) üye dizini
- **Neden kritik:** Resmi devlet kaynağı = LLM'ler için en üst seviye güvenilirlik sinyali. Hem .gov.tr domain'inden hem ekonomi/iş dünyası medyasından citation alır.
- **Yapılacak:**
  - ito.org.tr üye dizinine kayıt + iletişim güncelle
  - "Hijyen Ürünleri Toptan" sektör koduyla listelenmek için talep et
  - Üyelik belgesi varsa siteye ekleyebilirsin (extra trust)

---

## 🟠 TIER 2 — Yüksek değer (2-4 hafta)

### 4. Sektörel B2B dizinler (Türkiye)
- **turkishexporter.com.tr** (TİM — Türkiye İhracatçılar Meclisi)
- **sanayi.gov.tr** firma rehberi
- **kobi.org.tr**
- **kobiline.com**
- **kalitebizden.com**
- **firma.com.tr**
- **Kriter:** NAP **birebir tutarlı** olmalı; tek harf farkı bile Google NAP-inconsistency tetikler.

### 5. Yandex Webmaster + Yandex Business
- **Neden:** Türkiye'de Yandex payı düşük ama:
  - Yandex AI (Alice, YandexGPT) Türk kullanıcıları için relevant
  - DuckDuckGo bazı sonuçlarda Yandex'i kullanıyor
  - Rusça/Türkçe konuşan B2B alıcılar
- **Yapılacak:**
  - webmaster.yandex.com → site sahibi olarak claim
  - Sitemap doğrula
  - yandex.com.tr/business → işyeri kayıt

### 6. LinkedIn Company Page + sektörel içerik
- **Neden kritik:** LLM training data'sında LinkedIn ağırlığı çok yüksek. "Best B2B hygiene supplier Turkey" sorgularında LinkedIn post'ları citation kaynağı.
- **Yapılacak:**
  - linkedin.com/company → MTS Hijyen şirket sayfası oluştur (henüz yoksa)
  - **URL'yi `mtshijyen` slug'ı ile al** — schema'da bu URL'yi referans olarak koydum
  - Haftalık sektörel post:
    - "Otel hijyen tedarik rehberi"
    - "Restoran temizlik standartları"
    - "ISO 22000 uyum kriterleri"
    - "Hastane hijyen tedarik şartnamesi nasıl hazırlanır?"
  - Personel hesaplarıyla share + comment
- **Bonus:** Şirket sahibi/yönetici LinkedIn profilini optimize et ve şirket sayfasına bağla — kişi otoritesi şirket otoritesine yansıyor

---

## 🟡 TIER 3 — Marka otoritesi inşası (1-3 ay)

### 7. Sektörel basın PR — "earned media"
Hedef yayınlar:
- **Otel/HoReCa:** otelmagazin.com.tr, horeca-trade.com, gastronomimedya.com
- **Temizlik sektörü:** temizlikteknolojileri.com, temizlikgazetesi.com
- **Ekonomi:** dunya.com, ekonomim.com (eski Dünya Gazetesi), patronlardunyasi.com
- **B2B:** kobidunya.com.tr, isvedunya.com

**PR açıları:**
- "Yıllık X TL ciro" / "X% büyüme" haberleri
- "X yeni iş ortaklığı" duyuruları
- "Yeni üretim yatırımı / kapasite artırımı"
- "Sektör değerlendirmesi" tarzı röportajlar
- "ISO 22000 / yeni sertifika alımı"
- Sosyal sorumluluk / sürdürülebilirlik haberleri

**Önemli:** Paid (sponsored content) değil **press release** ile organik. Sponsored linkler "nofollow" oluyor, organic mention'lar "dofollow" → otorite transferi farklı.

### 8. Forum / topluluk mention'ları
- **Ekşi Sözlük:** "mts hijyen" başlığı açtırıp organik kullanıcı yorumları (kendin yazma)
- **Reddit:** r/Turkey, r/Istanbul, B2B procurement subredditlerine doğal cevaplar
- **Donanım Haber Forum / Webmaster forumları:** B2B sektör konularında uzman cevap
- **Sektör grupları:** Otel müdürleri Facebook/WhatsApp grupları, hastane satınalma birlikleri, AVM yöneticileri ağı

**Kural:** Asla "MTS Hijyen al" diye spam atma. Sektör sorularına uzman cevap ver, doğal bağlamda firma adını geçir.

### 9. YouTube içerikleri (transkript LLM'lere giriyor)
- **"MTS Hijyen fabrika turu"** (2-3 dakika)
- **"Otel için hijyen tedarik nasıl yönetilir?"** (eğitici)
- **"Toptan kağıt havlu seçimi — neye dikkat edilmeli?"** (karşılaştırmalı)
- **"Hastane temizlik kimyasalları rehberi"**
- **Müşteri referans videoları** (otel/restoran sahibi konuşur)

**Kritik:** Açıklama (description) bölümünü iyi yaz, transkripti manuel olarak düzelt — YouTube'un otomatik transkripti hatalı oluyor, LLM'ler bunu okuyor.

---

## 🟢 TIER 4 — Long-term moat (3-12 ay)

### 10. Wikipedia sayfası (Türkçe + İngilizce)
- **Wikidata'dan otomatik oluşmaz** — bağımsız editör tarafından oluşturulması gerek
- **Notability gerekliliği:** Wikipedia "promotional content" diye siler — bağımsız kaynaklar (Tier 3 basın haberleri) **şart**
- **Süreç:**
  1. Tier 3'te en az 5-10 bağımsız basın haberi biriksin
  2. Bağımsız bir Wikipedia editor'ünü angaje et (gönüllü editör arar, en güvenlisi)
  3. Notability'i kanıtlayacak şekilde **objektif** taslak yaz
- **Asla kendin yazma** — IP block + content takedown riski

### 11. Crunchbase + Dun & Bradstreet (D-U-N-S)
- **Crunchbase:** crunchbase.com → şirket profili → ücretsiz başvuru
  - Uluslararası B2B ekosistem görünürlüğü
  - LLM training set'inde çok yer alıyor
  - Funding/news/team bölümlerini doldur
- **D-U-N-S numarası:** dnb.com → ücretsiz başvuru → resmi firma ID'si
  - Uluslararası tedarik / ihracat için kritik
  - Apple Developer, Microsoft Partner, devlet ihaleleri için ön koşul
  - LLM'ler "resmi kayıtlı firma" sinyali olarak okuyor

### 12. Müşteri case study'leri (visible content marketing)
- 5-10 önemli müşteriden detaylı vaka çalışması:
  - Otel zinciri (örn. "X Otel zincirinin yıllık 2M TL tasarrufu")
  - Hastane (örn. "Y Hastanesi hijyen tedarik dönüşümü")
  - AVM (örn. "Z AVM 18 ay sözleşmeli tedarik vakası")
- **Yayın yerleri:**
  - Sitede `/referanslar` veya `/vakalar` bölümü (UI değişikliği gerek, sonra konuşalım)
  - LinkedIn'de paylaş + müşteri'yi tag'le
  - Sektör basınına gönder
- **LLM faydası:** "X otel hangi tedarikçiyi kullanıyor?" sorgularında bunları görüyor

---

## Site içi takip — `sameAs` listesini güncelle

Her Tier 1 + Tier 2 maddesini tamamladıkça, sitedeki schema.org `Organization.sameAs` listesine URL'leri ekle.

**Konumlar:**
- `index.html` → JSON-LD `Organization` bloğu (line ~190 civarı, `"sameAs": [...]`)
- `hakkimizda.html` → JSON-LD `Organization` bloğu

**Tamamlandığında eklenecekler:**
```json
"sameAs": [
  "https://www.google.com/maps/place/...",        // Google Business
  "https://www.wikidata.org/wiki/Q...",           // Wikidata Q-ID
  "https://www.linkedin.com/company/mtshijyen",   // LinkedIn
  "https://www.instagram.com/mtshijyen",          // Instagram (varsa)
  "https://www.crunchbase.com/organization/...",  // Crunchbase
  "https://tr.wikipedia.org/wiki/MTS_Hijyen",     // Wikipedia (TR)
  "https://en.wikipedia.org/wiki/MTS_Hijyen",     // Wikipedia (EN)
  "https://www.ito.org.tr/uye/..."                // İTO üye sayfası
]
```

Bu liste = **entity graph closure**. LLM "bu firma gerçek mi?" diye sorduğunda her referansın birbirini doğrulaması gerek. Liste ne kadar uzun ve tutarlıysa o kadar güçlü sinyal.

---

## Pratik Uyarılar

- ✅ **NAP tutarlılığı şart** — her platformda birebir aynı
- ✅ **Sahte review yapma** — Google AI Review Detection tespit edip cezalandırıyor
- ✅ **Paid linkler `nofollow` olur** — organik mention'lar `dofollow`, otorite transferi farklı
- ✅ **Site'ndeki `sameAs` listesini boş bırakma** — her tamamlanan profile URL'yi ekle
- ✅ **Yavaş ama tutarlı** ilerle — bir ayda 100 mention ekleyip durmaktansa 12 ay boyunca ayda 8-10 ekle
- ❌ **PBN (Private Blog Network) satın alma** — Google ağır penalty veriyor, kalıcı sıralama kaybı
- ❌ **Otomatik dizin gönderim toolları (XRumer vb.)** — spam profilleri olarak işaretlenirsin

---

## Sıralama Önerisi — İlk 90 Gün

**Hafta 1-2:**
- [ ] Google Business Profile (Tier 1.1)
- [ ] Wikidata kaydı (Tier 1.2)
- [ ] İTO dizin kaydı (Tier 1.3)
- [ ] Site `sameAs` listesini ilk 3 URL ile güncelle

**Hafta 3-4:**
- [ ] LinkedIn Company Page (Tier 2.6)
- [ ] Yandex Webmaster + Business (Tier 2.5)
- [ ] 4 sektörel B2B dizinine kayıt (Tier 2.4)

**Ay 2:**
- [ ] LinkedIn'de ilk 8 sektörel post yayını (Tier 2.6)
- [ ] İlk 3 sektörel basın PR çalışması (Tier 3.7)
- [ ] YouTube kanal kurulumu + ilk 2 video (Tier 3.9)

**Ay 3:**
- [ ] Crunchbase + D-U-N-S başvuru (Tier 4.11)
- [ ] 2-3 müşteri case study (Tier 4.12)
- [ ] Ekşi Sözlük başlık + 3-5 organik yorum (Tier 3.8)

90 gün sonunda LLM yanıtlarında belirgin fark görmeye başlarsın. Wikipedia (Tier 4.10) Ay 6+ için planla.

---

**Son güncelleme:** 2026-06-01
**Sahibi:** MTS Hijyen / Can Acatma

# 🏝️ Archipelag Innowacji (PCI)

**System wczesnego wykrywania, oceny potencjału i transferu „ukrytych” innowacji powstających w szkołach, uczelniach, samorządach (JST) oraz instytucjach publicznych.**

Projekt opracowany jako prototyp rozwiązania na wyzwanie **„Radar innowacji” Podkarpackiego Centrum Innowacji (PCI)**[cite: 1].

---

## 🎯 Rozwiązywany problem
Wartościowe innowacje (technologiczne, organizacyjne, społeczne, edukacyjne i procesowe) często powstają lokalnie, ale pozostają znane wyłącznie w miejscu ich wytworzenia[cite: 1, 2]. Brak jednego mechanizmu identyfikacji i porównywania pomysłów sprawia, że rozwiązania nie są skalowane, a różne instytucje niezależnie rozwiązują te same problemy[cite: 1].

## ✨ Główne funkcje platformy
- **Mapa Polski (16 województw) + Radar HUD** – interaktywna wizualizacja SVG wykrytych inicjatyw z całego kraju, podziałem na sektory specjalizacji (Lotnictwo i Kosmos, ICT, Motoryzacja, Jakość życia, Społeczno-organizacyjne) oraz wektorami transferu między regionami[cite: 1, 2].
- **Skaner AI & Kreator Zgłoszeń** – symulator agregacji danych z rejestrów publicznych (BIP JST, PBN, UPRP, EPO, NCBR, Interreg) oraz formularz zgłoszeniowy wspierający młodych innowatorów (16–30 lat)[cite: 1, 2, 4].
- **Silnik Oceny Potencjału & Anty-duplikacji** – przejrzysty scoring wielokryterialny (0–100 pkt) z wykresem radarowym, oceną poziomu TRL oraz weryfikacją podobieństw w bazach patentowych i naukowych[cite: 2, 3, 4].
- **Rekomendacje Ścieżek & Matchmaking** – automatyczne dopasowanie ścieżki rozwoju (*PCI ProtoLab*, transfer między JST, granty B+R, komercjalizacja) oraz łączenie twórców z odbiorcami i partnerami[cite: 1, 2].
- **Paszport Innowacji** – ustandaryzowana karta projektu z uzasadnieniem rekomendacji i miernikami skuteczności (KPI)[cite: 2, 4].
- **Tryb Demonstracyjny (2 scenariusze)** – wbudowane przypadki użycia dla innowacji technologicznej (uczelnia) oraz społeczno-organizacyjnej (JST + szkoła)[cite: 2, 4].

## 🛠️ Stack technologiczny i uruchomienie
Aplikacja została zbudowana w architekturze **zero-dependency (Single-File Web App)** w czystym **HTML5, CSS3 i Vanilla JavaScript** z natywną kartografią **SVG** — bez zewnętrznych bibliotek i procesu budowania.

### Uruchomienie lokalne
1. Sklonuj repozytorium lub pobierz plik `index.html`.
2. Otwórz `index.html` bezpośrednio w dowolnej nowoczesnej przeglądarce.

### Wdrożenie na GitHub Pages
1. Przejdź do **Settings → Pages** w repozytorium.
2. Wybierz źródło **Deploy from a branch**, gałąź `main` oraz katalog `/ (root)`.
3. Zapisz zmiany — aplikacja będzie dostępna pod adresem `https://<uzytkownik>.github.io/<nazwa-repozytorium>/`.

---
title: Hakowanie agentów
description: Zasady hakowania Agentów w Night City — Breacher, testy, PT oraz wszczepianie komend w urządzenia komunikacyjne.
---

Sztuka hakowania urządzeń komunikacyjnych i sieci sięga ponad dwóch wieków wstecz, do czasów telegrafów i przewodów. Z każdym nowym postępem w komunikacji, hakerzy adaptowali się i rozwijali nowe techniki oraz technologie. Ta tradycja nie zmieniła się w Czasie Czerwieni, gdzie wielu mieszkańców Night City polega na Agentach nie tylko w kwestii komunikacji, ale też zarządzania codziennym życiem.

## Hakowanie

Teoretycznie każdy może zhakować Agenta, ale Zdolności Ról Netrunnerów i Techów zwiększają szanse powodzenia.

Hakowanie Agenta wymaga **Breachera** (patrz sekcja Nowy Sprzęt), specjalistycznego urządzenia zaprojektowanego do tego celu. Haker musi znajdować się w odległości **20 m (10 kratek)** od Agenta i mieć linię wzroku na urządzenie lub jego użytkownika. Agent może zostać zhakowany, jeśli znajduje się w kieszeni lub torbie, ale nie jeśli jest za osłoną. Tą metodą można hakować wyłącznie zewnętrznych Agentów. Ani Agentów Wewnętrznych, ani jednorazowych telefonów komórkowych nie da się zhakować za pomocą standardowego Breachera.

## Test Hakowania

Aby zhakować Agenta, haker musi zdać **Test Elektronika/Technika Bezpieczeństwa**, by obejść zabezpieczenia urządzenia. Test trwa **1 minutę**, a PT zależy od jakości Agenta — ogólnie im droższy Agent, tym lepsze jego protokoły bezpieczeństwa. Jeśli haker zdobył odpowiednie informacje bezpieczeństwa innymi sposobami (np. socjotechniką), otrzymuje **+2 do Testu**.

Jeśli haker nie zda Testu Elektronika/Technika Bezpieczeństwa, SAAI Agenta (wbudowane pseudo-AI) wykrywa próbę włamania i alarmuje użytkownika po 30 sekundach.

Przyjmij, że Agent jest Standardowej Jakości, chyba że zaznaczono inaczej.

### Hakowanie Agenta: Zdalnie

|Typ Agenta|PT do zhakowania|
|---|---|
|Słaba Jakość|17|
|Standardowa Jakość|21|
|Doskonała Jakość|24|

## Wszczepienie Komendy

Po obejściu zabezpieczeń haker może wszczepić komendę w docelowym Agencie **bez Testu**. Czas potrzebny na wszczepienie komendy zależy od złożoności funkcji, którą Agent ma wykonać.

Tylko **jedna komenda** może być wszczepiona na jedno hakowanie. Aby wszczepić kolejną komendę, haker musi ponownie zhakować Agenta. Żadna komenda wszczepiona przez hakera nie może trwać dłużej niż **24 godziny**.

### Wszczepienie Komend w Agencie

|Typ Komendy|Przykłady|Czas|
|---|---|---|
|Aktywacja Podstawowej Funkcji|Emisja dźwięku powiadomienia. Włączenie latarki Agenta. Wyciszenie Agenta. Wyłączenie Agenta.|3 sekundy (1 Runda)|
|Aktywacja Głównej Funkcji|Uruchomienie aplikacji. Wykonanie połączenia. Przesłanie/pobranie pliku.|1 minuta (20 Rund)|
|Aktywacja Bezpiecznej Funkcji|Zmiana danych logowania w celu zablokowania użytkownika. Zlecenie Agentowi wysyłania danych lokalizacyjnych do Breachera hakera przez 24 godziny. Zlecenie Agentowi transmisji interakcji CitiNet/rozmów telefonicznych do Breachera hakera, umożliwiając obserwację/nasłuch interakcji przez 24 godziny. Instalacja backdoora, pozwalającego hakerowi automatycznie zdać każdy kolejny Test hakowania wykonany na tym Agencie w ciągu 24 godzin.|5 minut (100 Rund)|

## Hakowanie Agenta: Przykład

Grease i Redeye siedzą w lobby hotelu Highcourt Plaza. Grease musi wślizgnąć się do windy i wjechać na 14. piętro, by porozmawiać z Fixerem znanym jako Dżentelmen, ale ochroniarz w lobby jest czujny i wypatruje kłopotów.

Aby odwrócić uwagę ochroniarza, Redeye próbuje zhakować jego Agenta. MG ustala, że ochroniarz ma Agenta Słabej Jakości, co daje PT 17. Dzięki Crunch Whistle zainstalowanemu w cyberpokładzie, Gracz Redeye dodaje Interfejs (4) do bazy Elektronika/Technika Bezpieczeństwa (11) i rzutu 1k10 (4), uzyskując łącznie 19. Sukces!

Redeye chce jedynie odwrócić uwagę ochroniarza, więc aktywuje Podstawową Funkcję, nakazując Agentowi zadzwonić z priorytetowym sygnałem. Cały proces zajmuje dokładnie 1 minutę (obejście zabezpieczeń) i 3 sekundy (wszczepienie komendy). Ochroniarz spogląda na dzwoniącego Agenta, a Grease wymyka się do windy.

## Ograniczenia

Jeśli użytkownik podejrzewa, że jego Agent został zhakowany, może (on lub ktoś przez niego upoważniony) spróbować wykryć infiltrację za pomocą **Testu Elektronika/Technika Bezpieczeństwa** przeciwko PT równemu pierwotnemu Testowi obejścia zabezpieczeń Agenta. Nawet jeśli nie wykryje infiltracji, użytkownik zawsze może wykonać **restart systemu** jako standardowe zabezpieczenie.

Restart wymaga **5 minut**, rozłącza Breachera hakera od Agenta (jeśli jest wciąż podłączony) i eliminuje wszystkie wszczepione komendy.

Restart systemu można wykonać w dowolnym momencie, nawet po zakończeniu hakowania. Wykrycie, że Agent został zhakowany, **nie ujawnia** tożsamości ani lokalizacji hakera.

## Fizyczny Dostęp

Bezpośredni, fizyczny dostęp do Agenta upraszcza zadanie, ułatwiając hakowanie. Haker, który może fizycznie manipulować Agentem, **nie potrzebuje Breachera**, choć może go nadal używać (co jest szczególnie przydatne dla Netrunnerów), i ma obniżony PT na Teście Elektronika/Technika Bezpieczeństwa.

### Hakowanie Agenta: Fizyczny Dostęp

|Typ Agenta|PT do zhakowania|
|---|---|
|Słaba Jakość|15|
|Standardowa Jakość|17|
|Doskonała Jakość|21|

## Nowy Sprzęt

### Breacher

**Koszt:** 500eb (Kosztowny)

Specjalistyczne narzędzie zaprojektowane do hakowania Agentów.

Agent zmodyfikowany specjalnym sprzętem i oprogramowaniem, umożliwiający zdalne hakowanie innych Agentów. Breacher może być używany wyłącznie do hakowania. Nie funkcjonuje jako normalny Agent i nie może zostać zhakowany jak normalny Agent.

### Crunch Whistle

**Koszt:** 100eb (Premium)

Nowoczesne podejście do klasycznego narzędzia hakerskiego.

**Opcja Sprzętowa Cyberdecku.** Crunch Whistle łączy Cyberdeck Netrunnera z Breacherem, umożliwiając dodanie **Rangi Interfejsu** do Testów Elektronika/Zabezpieczenia wykonywanych w celu hakowania Agentów.

### ICE-Breaker

**Koszt:** 500eb (Kosztowny)

Przenośny moduł deszyfrujący zaprojektowany do fizycznego podłączenia do terminala lub punktu dostępowego Architektury Sieciowej. ICE-Breaker automatycznie analizuje protokoły zabezpieczeń i tłumaczy je na zrozumiałe komendy, pozwalając nawet osobom bez Cyberdecku na interakcję z Architekturą Sieciową.

**Wymagania:** Fizyczny dostęp do terminala lub punktu dostępowego. ICE-Breaker musi zostać fizycznie podłączony do urządzenia — podłączenie zajmuje jedną Akcję. Nie działa zdalnie.

ICE-Breaker pozwala osobie bez zdolności Interfejs na wykonywanie Testów przeciwko elementom Architektury Sieciowej (hasłom, węzłom kontrolnym, plikom) za pomocą **Testu Elektronika i zabezpieczenia** zamiast Testu Interfejsu i działa jak Chip Umiejętności o poziomie 3 (bez UC). Każdy Netrunner z kolei dostaje +1 do testu Intefejsu.

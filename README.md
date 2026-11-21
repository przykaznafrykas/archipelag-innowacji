# Radar Innowacji

Prototyp konkursowy PCI. Lokalnie otwórz pliki z katalogu `dist` przez serwer HTTP, np. `python3 -m http.server 8000 --directory dist`, a następnie odwiedź `http://localhost:8000`.

Sekcja „Metodyka oceny” zawiera opis zasad, dane i materiały konkursowe. Aby przejść scenariusze, otwórz karty „Zielone klasy” i „Dostępna gmina”. Nowe zgłoszenia i szkice kontaktu są przechowywane w pamięci bieżącej przeglądarki. Projekty i partnerzy widoczni przy pierwszym uruchomieniu są fikcyjni.

Projekt działa bez serwera aplikacyjnego. Wspólna baza i rzeczywisty kontakt z partnerami wymagają kont, autoryzacji i dodatkowej infrastruktury.

Granice województw pochodzą z [geoBoundaries POL ADM1](https://www.geoboundaries.org/api/current/gbOpen/POL/ADM1/), na podstawie danych OpenStreetMap i Wambacher. Geometria jest przeliczona na ścieżki SVG i udostępniona na licencji [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/). Znaczniki pokazują sumę zgłoszeń w regionie. Zgłoszenia ze starszej wersji bez województwa są widoczne w widoku całej Polski.

Dane patentowe: 10 rekordów metadanych z [European Publication Server](https://data.epo.org/publication-server/). Każdy rekord prowadzi do odpowiadającej mu publikacji EPO. Sekcja „Dane patentowe EPO” umożliwia import oficjalnego pliku XML publikacji z polskim zgłaszającym lub uprawnionym. Kategoria pochodzi z uproszczonych reguł IPC, a region z rozpoznanej miejscowości. Katalog startowy nie jest pełnym rejestrem i nie odświeża się automatycznie.

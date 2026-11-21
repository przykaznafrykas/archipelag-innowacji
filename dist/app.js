'use strict';
const categories=['Edukacja','Środowisko','Usługi publiczne','Zdrowie','Mobilność','Technologia'];
const types=['Szkoła','Uczelnia','Samorząd','Inna instytucja publiczna'];
const stages=['Pomysł','Prototyp','Pilotaż','Wdrożenie'];
const needs=['Testy','Pilotaż','Finansowanie','Wdrożenie'];
const criteria=[
 ['Znaczenie problemu',25,'Od pojedynczej obserwacji do udokumentowanej, powtarzalnej potrzeby.'],
 ['Nowość rozwiązania',20,'Od znanego rozwiązania do wykazanej przewagi nad dostępnymi alternatywami.'],
 ['Dowody skuteczności',25,'Od hipotezy do powtarzalnych, mierzalnych wyników.'],
 ['Wykonalność',15,'Od nieoszacowanych zasobów do potwierdzonej dostępności ludzi, budżetu i technologii.'],
 ['Potencjał transferu',15,'Od rozwiązania szytego na jedną jednostkę do opisanego modelu wdrożenia gdzie indziej.']
];
const samples=[
 {id:'zielone',name:'Zielone klasy',org:'Szkoła demonstracyjna w Rzeszowie',type:types[0],author:'Zespół przyrodniczy',category:categories[0],stage:stages[2],need:needs[1],problem:'Uczniowie nie wiedzą, kiedy przewietrzać sale, a jakość powietrza zmienia się podczas lekcji.',solution:'Czujniki CO₂ i uczniowski rejestr pomiarów wspierają ustalanie przerw na wietrzenie. Projekt łączy edukację i poprawę jakości powietrza.',evidence:'W scenariuszu demonstracyjnym zebrano dwa tygodnie pomiarów w dwóch klasach.',ratings:[4,4,4,5,5],demo:true},
 {id:'dostepna',name:'Dostępna gmina',org:'Gmina demonstracyjna w powiecie krośnieńskim',type:types[2],author:'Zespół ds. dostępności',category:categories[2],stage:stages[1],need:needs[1],problem:'Mieszkańcy nie zawsze mogą sprawdzić przed wizytą, czy wejście do budynku publicznego jest dostępne.',solution:'Mobilna mapa dostępności pokazuje wejścia, windy i toalety. Mieszkańcy mogą przekazywać uwagi do aktualizacji danych.',evidence:'W scenariuszu demonstracyjnym przetestowano formularz z pięcioma mieszkańcami i opisano trzy budynki.',ratings:[5,4,4,4,5],demo:true},
 {id:'mikro',name:'Mikroklimat szkoły',org:'Uczelnia demonstracyjna w Rzeszowie',type:types[1],author:'Koło naukowe',category:categories[0],stage:stages[1],need:needs[0],problem:'Szkoły potrzebują prostego pomiaru jakości powietrza w salach lekcyjnych.',solution:'Otwarty zestaw czujników CO₂ i instrukcja prowadzenia rejestru pomiarów pozwalają porównywać sale.',evidence:'W scenariuszu demonstracyjnym porównano czujniki w warunkach laboratoryjnych.',ratings:[4,3,3,5,4],demo:true}
];
const partners=[
 {id:'szkoly',name:'Sieć szkół pilotażowych',role:'Użytkownik',cats:[categories[0],categories[1]],offers:[needs[1],needs[3]],desc:'Udostępnia klasy do testów i zbiera opinie nauczycieli.'},
 {id:'dostep',name:'Forum dostępnych samorządów',role:'Partner wdrożeniowy',cats:[categories[2],categories[4]],offers:[needs[1],needs[3]],desc:'Wspiera pilotaże usług publicznych w kilku gminach.'},
 {id:'lab',name:'Laboratorium prototypowania',role:'Partner techniczny',cats:[categories[0],categories[1],categories[3],categories[5]],offers:[needs[0],needs[1]],desc:'Zapewnia konsultacje techniczne i pomoc w projektowaniu testów.'},
 {id:'fundusz',name:'Fundusz rozwiązań lokalnych',role:'Finansowanie',cats:categories,offers:[needs[2]],desc:'Rozpatruje zgłoszenia na finansowanie pilotaży społecznych i technologicznych.'}
];
const regionNames=regions.map(region=>region.name).sort((a,b)=>a.localeCompare(b,'pl'));
samples.forEach(item=>{item.region='podkarpackie'});
for(const [id,name,region,org,category,problem,solution] of [
 ['deszcz','Szkolny ogród deszczowy','pomorskie','Szkoła demonstracyjna w Gdańsku','Środowisko','Woda z opadów spływa z utwardzonego dziedzińca.','Uczniowie zaprojektowali ogród zatrzymujący deszczówkę.'],
 ['przystanek','Przystanek blisko domu','mazowieckie','Samorząd demonstracyjny w Warszawie','Mobilność','Mieszkańcy osiedli mają daleko do najbliższego przystanku.','Mapa zgłoszeń pomaga wskazać miejsca do uwzględnienia podczas planowania nowych tras.'],
 ['cieplo','Mapa strat ciepła','dolnośląskie','Uczelnia demonstracyjna we Wrocławiu','Środowisko','Instytucje potrzebują kolejności prac termomodernizacyjnych.','Zespół porównuje pomiary termowizyjne budynków publicznych.'],
 ['biblioteka','Biblioteka bez barier','małopolskie','Biblioteka demonstracyjna w Krakowie','Usługi publiczne','Czytelnicy potrzebują prostego sposobu na zamawianie książek do domu.','Biblioteka łączy telefoniczne zamówienia z dostawami realizowanymi przez wolontariuszy.']
]){
 samples.push({id,name,region,org,category,problem,solution,type:types[3],author:'Zespół projektowy',stage:stages[1],need:needs[1],evidence:'Fikcyjny scenariusz testowy.',ratings:[4,3,3,4,4],demo:true});
}
const storageKey='radar-pci-v1';
let data={ideas:[],plans:{}};
try{const saved=localStorage.getItem(storageKey);if(saved)data=JSON.parse(saved)}catch{}
const ideas=()=>[...data.ideas,...samples];
const patents=()=>[...(data.patents||[]),...epoSnapshot];
const update=(next)=>{
 try{localStorage.setItem(storageKey,JSON.stringify(next));data=next;return true}
 catch{document.querySelector('#feedback').textContent='Przeglądarka nie zapisała danych. Sprawdź dostępność pamięci lokalnej.';return false}
};
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const score=(x)=>criteria.reduce((total,c,i)=>total+c[1]*x.ratings[i]/5,0);
const tokens=(s)=>new Set((s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replaceAll('ł','l').match(/[a-z0-9]{4,}/g)||[]).filter(w=>!['oraz','jest','ktore','ktora','przez','moze','pozwala','potrzebuja'].includes(w)));
const similarity=(a,b)=>{
 const first=tokens([a.name,a.problem,a.solution].join(' ')),second=tokens([b.name,b.problem,b.solution].join(' '));
 const shared=[...first].filter(t=>second.has(t));
 return {shared,value:Math.round(100*shared.length/Math.max(1,new Set([...first,...second]).size))};
};
function plan(x){
 const s=score(x);
 if(x.ratings[2]<=2||x.stage===stages[0]||s<55)return ['Rozwój i walidacja','Zbierz mocniejsze dowody lub zbuduj prototyp. Ta ścieżka obowiązuje dla pomysłu, dowodów na poziomie 1–2 albo wyniku poniżej 55.','Liczba rozmów z odbiorcami; odsetek udanych prób prototypu.'];
 if(x.stage===stages[3]&&s>=75&&x.ratings[4]>=4)return ['Transfer do kolejnej instytucji','Działające wdrożenie, wynik co najmniej 75 i transfer oceniony na minimum 4 uzasadniają odtworzenie rozwiązania w nowej jednostce.','Czas uruchomienia; liczba instytucji wdrażających rozwiązanie.'];
 if(x.need===needs[2]&&s>=75&&x.ratings[1]>=4)return ['Finansowanie i analiza komercjalizacji','Potrzeba finansowania, wynik co najmniej 75 i nowość na poziomie minimum 4 uzasadniają rozmowę z finansującym oraz analizę praw i modelu kosztów.','Liczba rozmów z finansującymi; koszt wdrożenia na instytucję.'];
 return ['Pilotaż u partnera','Projekt przeszedł próg walidacji. Kolejna instytucja może sprawdzić efekty i koszty w swoich warunkach.','Zmiana wskaźnika problemu względem stanu początkowego; koszt i czas pilotażu.'];
}
const matching=(x)=>partners.map(p=>({...p,topic:p.cats.includes(x.category),need:p.offers.includes(x.need)})).map(p=>({...p,points:2*Number(p.topic)+Number(p.need)})).filter(p=>p.points).sort((a,b)=>b.points-a.points);
const options=(list,selected)=>list.map(v=>'<option'+(v===selected?' selected':'')+'>'+esc(v)+'</option>').join('');
const heading=(label,title,desc)=>'<div class="eyebrow">'+label+'</div><h1 class="page-title">'+title+'</h1><p>'+desc+'</p>';
const card=(x,i)=>`<article class="card"><div class="badges"><span class="pill ${i%3===1?'A':i%3===2?'B':'green'}">${esc(x.category)}</span><span class="pill">${esc(x.stage)}</span></div><h3><a href="#projekt/${x.id}">${esc(x.name)}</a></h3><div class="meta">${esc(x.org)}</div><p>${esc(x.solution.length>125?x.solution.slice(0,122)+'…':x.solution)}</p><div class="card-bottom"><span class="score">${score(x)} / 100</span><a class="button quiet small-button" href="#projekt/${x.id}">Zobacz projekt</a></div></article>`;
const view=document.querySelector('#view');
let selectedRegion='',selectedCategory='',selectedKind='';
function home(){
 const all=[...ideas(),...patents()];
 const label=name=>name.charAt(0).toLocaleUpperCase('pl')+name.slice(1);
 view.innerHTML=`<div class="map-heading"><h1>Radar innowacji</h1><p>Odkrywaj pomysły szkół, uczelni i instytucji publicznych na mapie Polski.</p></div>
 <div class="radar-layout">
  <section class="map-panel" aria-label="Interaktywna mapa Polski">
   <div class="map-bar"><h2>Polska</h2><span>16 województw</span></div>
   <svg class="map" viewBox="0 0 502 470" aria-label="Wybierz województwo">
    <g class="map-grid" aria-hidden="true" fill="none"><circle cx="250" cy="235" r="76"/><circle cx="250" cy="235" r="151"/><circle cx="250" cy="235" r="224"/><path d="M14 235H488M250 8V462"/></g>
    ${regions.map(({name,path})=>`<g role="button" tabindex="0" data-region="${name}" aria-label="${label(name)}" aria-pressed="false"><title>${label(name)}</title><path class="province" d="${path}" fill-rule="evenodd"/></g>`).join('')}
    <g class="map-pins" aria-hidden="true"></g>
   </svg>
   <div class="map-foot"><span><i></i> Województwo z wynikami</span><a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a></div>
  </section>
  <section class="map-list" aria-label="Innowacje z wybranego obszaru">
   <label>Województwo<select id="region-filter"><option value="">Cała Polska</option>${regionNames.map(name=>`<option value="${name}">${label(name)}</option>`).join('')}</select></label>
   <div class="radar-filters"><label>Kategoria<select id="category-filter"><option value="">Wszystkie</option>${options(categories)}</select></label><label>Rodzaj<select id="kind-filter"><option value="">Wszystkie</option>${options(patentKinds)}</select></label></div>
   <a class="text-link patent-link" href="#patenty">Dane patentowe EPO</a>
   <div class="map-list-title"><h2>Innowacje</h2><span id="region-count" role="status"></span></div>
   <div id="region-results"></div>
  </section>
 </div>`;
 const filter=document.querySelector('#region-filter');
 const categoryFilter=document.querySelector('#category-filter');
 const kindFilter=document.querySelector('#kind-filter');
 const shapes=[...view.querySelectorAll('[data-region]')];
 categoryFilter.value=selectedCategory;
 kindFilter.value=selectedKind;
 function refresh(){
  filter.value=selectedRegion;
  const filtered=all.filter(item=>(!selectedCategory||item.category===selectedCategory)&&(!selectedKind||patentKind(item)===selectedKind));
  const counts=new Map();
  for(const item of filtered)counts.set(item.region,(counts.get(item.region)||0)+1);
  for(const shape of shapes){
   const name=shape.dataset.region;
   const total=counts.get(name)||0;
   shape.setAttribute('aria-pressed',String(name===selectedRegion));
   shape.setAttribute('aria-label',label(name)+' · '+total);
   shape.querySelector('title').textContent=label(name)+' · '+total;
   shape.querySelector('path').classList.toggle('has-projects',total>0);
  }
  view.querySelector('.map-pins').innerHTML=regions.filter(({name})=>counts.has(name)).map(({name,center:[x,y]})=>`<g class="map-pin" transform="translate(${x} ${y})"><circle r="16"/><circle r="11"/><text y="4">${counts.get(name)}</text></g>`).join('');
  const list=selectedRegion?filtered.filter(item=>item.region===selectedRegion):filtered;
  document.querySelector('#region-count').textContent='Wyniki: '+list.length;
  document.querySelector('#region-results').innerHTML=list.map(item=>`<a class="map-item" href="#${item.code?'patent':'projekt'}/${item.id}"><span><strong>${esc(item.name)}</strong><small>${esc(item.region?label(item.region):'Województwo nieprzypisane')} · ${esc(item.category)}</small></span>${item.code?'<b class="source-tag">EPO</b>':`<b>${score(item)}<small> pkt</small></b>`}</a>`).join('')||'<p class="empty-map">Brak wyników dla wybranych filtrów.</p>';
 }
 function selectRegion(name){selectedRegion=name;refresh()}
 filter.addEventListener('change',()=>selectRegion(filter.value));
 categoryFilter.addEventListener('change',()=>{selectedCategory=categoryFilter.value;refresh()});
 kindFilter.addEventListener('change',()=>{selectedKind=kindFilter.value;refresh()});
 shapes.forEach(shape=>{
  const toggle=()=>selectRegion(selectedRegion===shape.dataset.region?'':shape.dataset.region);
  shape.addEventListener('click',toggle);
  shape.addEventListener('keydown',event=>{
   if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle()}
  });
 });
 refresh();
}
function catalog(){
 view.innerHTML=heading('BAZA INNOWACJI','Znajdź innowację','Przeszukaj pomysły zgłoszone przez instytucje publiczne.')+`<div class="toolbar"><label>Szukaj<input id="search" type="search" placeholder="Nazwa, instytucja lub słowa kluczowe"></label><label>Obszar<select id="cat">${options(['Wszystkie obszary',...categories])}</select></label><label>Etap<select id="stage">${options(['Wszystkie etapy',...stages])}</select></label></div><p id="counts" role="status"></p><div class="cards" id="results"></div>`;
 const search=document.querySelector('#search'),cat=document.querySelector('#cat'),stage=document.querySelector('#stage');
 function refresh(){
  const query=search.value.trim().toLocaleLowerCase('pl');
  const list=ideas().filter(x=>(!cat.selectedIndex||cat.value===x.category)&&(!stage.selectedIndex||stage.value===x.stage)&&[x.name,x.org,x.problem,x.solution,x.category,x.author].some(v=>v.toLocaleLowerCase('pl').includes(query)));
  document.querySelector('#counts').textContent='Liczba wyników: '+list.length;
  document.querySelector('#results').innerHTML=list.map(card).join('')||'<p>Brak wyników dla podanych filtrów.</p>';
 }
 view.querySelector('.toolbar').addEventListener('input',refresh);
 refresh();
}
function partnerCard(p,x){
 const drafted=x&&data.plans[x.id]===p.id;
 return `<article class="card partner"><div><span class="pill green">${p.role}</span></div><h3>${p.name}</h3><p>${p.desc}</p>${x?`<p><strong>Dopasowanie ${p.points}/3</strong> · ${[p.topic?'zgodny obszar (2 pkt)':'',p.need?'zgodne wsparcie (1 pkt)':''].filter(Boolean).join(' i ')}</p><div class="card-bottom"><button type="button" data-partner="${p.id}" class="small-button">${drafted?'Pokaż zapisany kontakt':'Przygotuj kontakt'}</button></div>`:`<div class="meta">${p.cats.join(' · ')}</div><p class="compact">Wsparcie: ${p.offers.join(', ')}</p>`}</article>`;
}
function partnerPage(){
 view.innerHTML=heading('PARTNERZY','Sieć wsparcia','Przykładowe profile przedstawiają typy partnerów dostępnych w scenariuszach prototypu.')+'<div class="grid">'+partners.map(p=>partnerCard(p)).join('')+'</div>';
}
function detail(x){
 const [path,why,metrics]=plan(x);
 const near=ideas().filter(y=>y.id!==x.id).map(y=>({...similarity(x,y),project:y})).filter(y=>y.shared.length>0).sort((a,b)=>b.value-a.value).slice(0,3);
 view.innerHTML=`<div class="detail-intro"><a class="text-link" href="#katalog">Baza innowacji</a><h1 class="page-title">${esc(x.name)}</h1><div class="badges"><span class="pill green">${esc(x.category)}</span><span class="pill">${esc(x.stage)}</span>${x.demo?'<span class="pill A">Dane demonstracyjne</span>':''}</div><p class="compact">${esc(x.org)} · ${esc(x.type)} · ${esc(x.author)}${x.region?' · woj. '+esc(x.region):''}</p></div><div class="grid"><article class="panel"><h2>Karta projektu</h2><h3>Problem</h3><p>${esc(x.problem)}</p><h3>Rozwiązanie</h3><p>${esc(x.solution)}</p><h3>Dowody i obserwacje</h3><p>${esc(x.evidence)}</p><h3>Potrzebne wsparcie</h3><p class="compact">${esc(x.need)}</p></article><article class="panel"><h2>Wstępna ocena potencjału</h2><div class="metric">${score(x)} / 100</div><progress value="${score(x)}" max="100" aria-label="Wynik potencjału"></progress>${criteria.map(([label,weight],i)=>`<div class="row"><span>${label}</span><strong>${x.ratings[i]}/5 <small class="meta">· ${weight*x.ratings[i]/5}/${weight} pkt</small></strong></div>`).join('')}<a class="text-link" href="#metodyka">Zasady punktacji</a></article><article class="panel"><h2>Rekomendowana ścieżka</h2><h3 class="mint">${path}</h3><p>${why}</p><h3>Mierniki skuteczności</h3><p class="compact">${metrics}</p></article><article class="panel"><h2>Podobne rozwiązania</h2><p>Procent wspólnych słów w bazie Radaru. Zweryfikuj podobieństwo przed decyzją o połączeniu prac.</p>${near.map(y=>`<div class="row"><div><a class="text-link" href="#projekt/${y.project.id}">${esc(y.project.name)}</a><div class="meta">Wspólne słowa: ${esc(y.shared.slice(0,6).join(', '))}</div></div><strong>${y.value}%</strong></div>`).join('')||'<p class="compact">Brak wspólnych słów z innymi wpisami w bazie.</p>'}</article></div><h2 class="spaced">Dopasowani partnerzy</h2><p>Profile demonstracyjne. Dopasowanie uwzględnia obszar projektu i potrzebne wsparcie.</p><div class="cards">${matching(x).map(p=>partnerCard(p,x)).join('')||'<p>Brak pasujących profili.</p>'}</div><div id="feedback" role="status"></div><section class="panel spaced" id="draft" hidden></section>`;
 const draft=document.querySelector('#draft');
 function show(p,focus){
  draft.hidden=false;
  draft.innerHTML='<h2>Szkic kontaktu</h2><p>Robocza wiadomość dla profilu demonstracyjnego. Szkic zapisuje się w tej przeglądarce.</p><label>Treść wiadomości<textarea rows="5" readonly></textarea></label>';
  draft.querySelector('textarea').value=`Dzień dobry, reprezentujemy ${x.org}. Rozwijamy projekt „${x.name}”. ${x.solution}\n\nSzukamy wsparcia (${x.need.toLowerCase()}). Czy możemy omówić zakres współpracy i uzgodnić mierniki? ${metrics}\n\n${x.author}`;
  if(focus){draft.querySelector('textarea').focus();draft.scrollIntoView({block:'nearest'})}
 }
 view.querySelectorAll('[data-partner]').forEach(b=>b.addEventListener('click',()=>{
  const p=partners.find(y=>y.id===b.dataset.partner);
  if(update({...data,plans:{...data.plans,[x.id]:p.id}})){
   view.querySelectorAll('[data-partner]').forEach(y=>{y.textContent=y===b?'Pokaż zapisany kontakt':'Przygotuj kontakt'});
   document.querySelector('#feedback').textContent='Zapisano szkic dla profilu '+p.name+'.';
   show(p,true);
  }
 }));
 if(data.plans[x.id])show(partners.find(p=>p.id===data.plans[x.id]),false);
}
function form(){
 const field=(label,name,max)=>`<label>${label}<input name="${name}" required maxlength="${max}"></label>`;
 const select=(label,name,values)=>`<label>${label}<select name="${name}" required><option value="">Wybierz</option>${options(values)}</select></label>`;
 const area=(label,name)=>`<label>${label}<textarea name="${name}" required maxlength="1600"></textarea></label>`;
 view.innerHTML=heading('NOWE ZGŁOSZENIE','Zgłoś innowację','Utwórz kartę projektu i uzyskaj wstępną ocenę oraz plan dalszego działania.')+`<form id="idea" class="stack form"><div class="panel stack"><h2 class="compact">Informacje o projekcie</h2><div class="grid">${field('Nazwa innowacji','name',100)}${field('Nazwa instytucji','org',120)}${select('Typ instytucji','type',types)}${field('Zespół lub rola twórcy','author',120)}${select('Województwo','region',regionNames)}${select('Obszar','category',categories)}${select('Etap rozwoju','stage',stages)}${select('Potrzebne wsparcie','need',needs)}</div>${area('Problem i odbiorcy','problem')}${area('Rozwiązanie i przewaga','solution')}${area('Dowody i obserwacje','evidence')}<p class="help compact">Wpisz nazwę zespołu lub rolę. Dane pozostają w przeglądarce. Do demonstracji używaj danych fikcyjnych.</p></div><div class="panel stack"><h2 class="compact">Samoocena potencjału</h2><p class="compact">1 oznacza wstępne założenie, 3 częściowe potwierdzenie, a 5 mocne potwierdzenie. Oprzyj ocenę na opisanych dowodach.</p><div class="grid">${criteria.map(([label,weight,desc],i)=>`<div>${select(label+' · '+weight+'%', 'rating'+i,['1','2','3','4','5'])}<p class="help compact">${desc}</p></div>`).join('')}</div></div><div><button class="primary" type="submit">Zapisz i pokaż ocenę</button></div><div id="feedback" role="status"></div></form>`;
 document.querySelector('#idea').addEventListener('submit',e=>{
  e.preventDefault();
  const fields=Object.fromEntries([...new FormData(e.currentTarget)].map(([k,v])=>[k,v.trim()]));
  const keys=['name','org','type','author','region','category','stage','need','problem','solution','evidence'];
  if(keys.some(k=>!fields[k])){document.querySelector('#feedback').textContent='Uzupełnij każde pole treścią.';return}
  const item={id:crypto.randomUUID(),...Object.fromEntries(keys.map(k=>[k,fields[k]])),ratings:criteria.map((_,i)=>Number(fields['rating'+i]))};
  if(update({...data,ideas:[item,...data.ideas]}))location.hash='projekt/'+item.id;
 });
}
function method(){
 view.innerHTML=heading('METODYKA','Jak działa Radar','Jeden proces dla szkół, uczelni, samorządów i innych instytucji publicznych.')+`<div class="grid"><section class="panel"><h2>Wyszukiwanie pomysłów</h2><p>Podczas regularnego przeglądu instytucja może zbierać sygnały z kół naukowych, szkolnych projektów, konsultacji mieszkańców i lokalnych pilotaży. Przedstawiciel zgłasza pomysł, opisuje odbiorców, dowody i potrzebne wsparcie.</p><h2>Ocena potencjału</h2><p>Wynik to suma iloczynów ocen od 1 do 5 podzielonych przez 5 i pomnożonych przez wagę. Oceny są deklarowane przez zgłaszającego.</p>${criteria.map(([label,weight,desc])=>`<div class="row"><div><strong>${label}</strong><div class="meta">${desc}</div></div><strong>${weight}%</strong></div>`).join('')}</section><section class="panel stack"><div><h2>Dane i ograniczenia</h2><p>Radar łączy lokalne zgłoszenia, fikcyjne przykłady i wybrane rzeczywiste publikacje EPO. <a class="text-link" href="#patenty">Źródła danych patentowych i import</a>. Podobieństwo to udział wspólnych słów w zbiorze słów obu opisów, po uproszczeniu pisowni. Wynik można wykorzystać do ręcznego przeglądu podobnych prac. Partnerzy otrzymują 2 punkty za zgodny obszar i 1 za zgodny typ wsparcia.</p><p>Reguły ścieżek wykorzystują etap, wynik, potrzebę wsparcia oraz oceny cząstkowe. Zgłoszenia i szkice są przechowywane lokalnie, bez kont i synchronizacji. Katalog partnerów jest demonstracyjny. Granice województw pochodzą z <a class="text-link" href="https://www.geoboundaries.org/api/current/gbOpen/POL/ADM1/">geoBoundaries ADM1</a>, na podstawie danych OpenStreetMap i Wambacher (ODbL 1.0). Punkt na mapie pokazuje sumę zgłoszeń w województwie.</p></div><div><h2>Wdrożenie w wielu instytucjach</h2><p>Wersja współdzielona wymaga bazy ze zgłoszeniami przypisanymi do organizacji, dostępu opartego na rolach, dziennika zmian oraz polityki retencji. Import CSV lub API może zasilić katalog; dopasowania do baz patentowych i grantowych wymagają osobnych integracji.</p></div><div><h2>Materiały konkursowe</h2><div class="actions"><a class="button quiet" href="prezentacja.pdf">Prezentacja PDF</a><a class="button quiet" href="demo.mp4">Film demonstracyjny</a></div></div></section></div>`;
}
function patentPage(){
 view.innerHTML=heading('DANE PATENTOWE','Publikacje EPO','Przeglądaj wybrane publikacje polskich uczelni i dodawaj dokumenty z Europejskiego Urzędu Patentowego.')+`
 <div class="grid"><section class="panel stack"><h2 class="compact">Importuj dokument XML</h2><p class="compact">Otwórz publikację w serwisie EPO i pobierz jej dokument XML. Zaimportowany rekord pojawi się w Radarze w tej przeglądarce.</p>
 <form id="patent-import" class="stack"><label>Plik XML EPO<input required name="publication" type="file" accept=".xml,application/xml,text/xml"></label><div><button class="primary">Importuj publikację</button></div></form><div id="feedback" role="status"></div></section>
 <section class="panel stack"><h2 class="compact">Źródło i zakres</h2><p class="compact">Katalog startowy zawiera ${epoSnapshot.length} dokumentów pobranych z EPO. Radar przypisuje kategorię według kodu IPC, a województwo według rozpoznanej miejscowości polskiego zgłaszającego lub uprawnionego. Rekordy bez przypisanego województwa są widoczne w widoku całej Polski.</p>
 <div class="actions"><a class="button quiet" href="https://data.epo.org/publication-server/">Serwis publikacji EPO</a><a class="button quiet" href="https://register.epo.org/regviewer">Rejestr EPO</a><a class="button quiet" href="https://ewyszukiwarka.pue.uprp.gov.pl/search/simple-search">Wyszukiwarka UPRP</a></div></section></div>`;
 const form=view.querySelector('#patent-import');
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const file=form.elements.publication.files[0];
  const button=form.querySelector('button');
  const status=view.querySelector('#feedback');
  if(!file)return;
  if(file.size>15*1024*1024){status.textContent='Wybierz plik o rozmiarze do 15 MB.';return}
  button.disabled=true;
  try{
   const item=parseEpoPublication(await file.text());
   if(!form.isConnected)return;
   if(patents().some(existing=>existing.id===item.id)){status.textContent='Ta publikacja jest już w Radarze.';return}
   if(update({...data,patents:[item,...(data.patents||[])]})){
    selectedRegion=item.region;selectedCategory='';selectedKind=patentKind(item);
    location.hash='patent/'+item.id;
   }
  }catch(error){status.textContent=error.message}
  finally{button.disabled=false}
 });
}
function patentDetail(item){
 view.innerHTML=`<div class="detail-intro"><a class="text-link" href="#radar">Mapa</a><h1 class="page-title">${esc(item.name)}</h1><div class="badges"><span class="pill green">EPO</span><span class="pill">${esc(patentKind(item))}</span></div></div>
 <section class="panel"><h2>Dane publikacji</h2>
 ${[['Numer publikacji',item.number],['Data publikacji',item.date],['Zgłaszający lub uprawniony',item.org],['Miejscowość',item.city||'Brak danych'],['Województwo',item.region||'Nieprzypisane'],['Kategoria Radaru',item.category],['Klasyfikacja IPC',item.ipc.join(', ')||'Brak danych']].map(([label,value])=>`<div class="row"><span>${label}</span><strong>${esc(value)}</strong></div>`).join('')}
 <p>Rodzaj dokumentu wynika z kodu publikacji. Bieżący stan prawny sprawdzisz w rejestrze EPO.</p>
 <div class="actions"><a class="button primary" href="${epoBase}${item.code}/document.html">Dokument EPO</a><a class="button quiet" href="https://register.epo.org/smartSearch?query=pn%3D${item.number.slice(0,-2)}">Rejestr EPO</a></div></section>`;
}
function render(){
 const [page,id]=location.hash.slice(1).split('/');
 const titles={radar:'Przegląd',katalog:'Baza innowacji',partnerzy:'Partnerzy',metodyka:'Metodyka oceny',nowe:'Nowe zgłoszenie',projekt:'Karta projektu',patent:'Publikacja EPO',patenty:'Dane patentowe'};
 const active=Object.hasOwn(titles,page)?page:'radar';
 document.title=(active==='radar'?'Radar Innowacji':titles[active]+' · Radar Innowacji');
 document.querySelectorAll('nav a').forEach(a=>{
  const selected=a.hash==='#'+(active==='projekt'?'katalog':active);
  a.classList.toggle('active',selected);
  if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 });
 if(active==='patent'){
  const item=patents().find(record=>record.id===id);
  if(item)patentDetail(item);else patentPage();
 }else if(active==='projekt'){
  const x=ideas().find(y=>y.id===id);
  if(x)detail(x);else view.innerHTML=heading('BAZA INNOWACJI','Brak projektu','Sprawdź adres lub wróć do bazy innowacji.')+'<a class="button" href="#katalog">Baza innowacji</a>';
 }else ({radar:home,katalog:catalog,partnerzy:partnerPage,metodyka:method,nowe:form,patenty:patentPage})[active]();
 window.scrollTo(0,0);
}
window.addEventListener('hashchange',render);
render();

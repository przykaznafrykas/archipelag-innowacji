'use strict';
const epoBase='https://data.epo.org/publication-server/rest/v1.2/patents/';
const patentKinds=['Projekt','Publikacja zgłoszenia','Opis udzielonego patentu'];
const patentKind=item=>item.code?(item.kind.startsWith('B')?patentKinds[2]:patentKinds[1]):patentKinds[0];
const locationKey=text=>text.toLowerCase().replaceAll('ł','l').normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/^\s*\d{2}-\d{3}\s*/,'').trim();
const patentCities={
 'bialystok':'podlaskie','bydgoszcz':'kujawsko-pomorskie','gdansk':'pomorskie','gliwice':'śląskie',
 'gorzow wielkopolski':'lubuskie','katowice':'śląskie','kielce':'świętokrzyskie','krakow':'małopolskie',
 'lodz':'łódzkie','lublin':'lubelskie','olsztyn':'warmińsko-mazurskie','opole':'opolskie',
 'poznan':'wielkopolskie','rzeszow':'podkarpackie','szczecin':'zachodniopomorskie','torun':'kujawsko-pomorskie',
 'warszawa':'mazowieckie','warsaw':'mazowieckie','wroclaw':'dolnośląskie','zielona gora':'lubuskie'
};
function parseEpoPublication(xml){
 const doc=new DOMParser().parseFromString(xml,'application/xml');
 const root=doc.documentElement;
 const read=(node,selector)=>node.querySelector(selector)?.textContent.trim()||'';
 const number=root.getAttribute('doc-number')||'';
 const kind=root.getAttribute('kind')||'';
 const date=root.getAttribute('date-publ')||'';
 if(root.localName!=='ep-patent-document'||root.getAttribute('country')!=='EP'||!/^[0-9]{7}$/.test(number)||!/^[AB][1-9]$/.test(kind)||!/^\d{8}$/.test(date))throw Error('Wybierz dokument publikacji EPO w formacie XML.');
 const owners=[...root.querySelectorAll('B711, B731')].filter(node=>read(node,'adr ctry')==='PL');
 const owner=owners.find(node=>patentCities[locationKey(read(node,'adr city'))])||owners[0];
 if(!owner)throw Error('Dokument nie zawiera adresu zgłaszającego lub uprawnionego w Polsce.');
 const name=read(root,'B541 + B542')||read(root,'B542');
 const title=[...root.querySelectorAll('B541')].find(el=>el.textContent.trim()==='en')?.nextElementSibling?.textContent.trim()||name;
 const city=read(owner,'adr city').replace(/^\d{2}-\d{3}\s*/,'');
 const org=read(owner,'snm');
 if(!title||!org)throw Error('W dokumencie brakuje tytułu lub nazwy podmiotu.');
 const ipc=[...new Set([...root.querySelectorAll('classification-ipcr text')].map(el=>el.textContent.replace(/\s/g,'').match(/^[A-HY]\d{2}[A-Z]\d+\/\d+/)?.[0]).filter(Boolean))].slice(0,8);
 const category=ipc.some(x=>x.startsWith('A61'))?'Zdrowie':ipc.some(x=>/^(B60|B61|B62|B63|B64)/.test(x))?'Mobilność':ipc.some(x=>/^(B09|C02|Y02)/.test(x))?'Środowisko':ipc.some(x=>x.startsWith('G09B'))?'Edukacja':'Technologia';
 const code='EP'+number+'NW'+kind;
 return {id:'epo-'+number+kind,code,number:'EP'+number+kind,kind,date:date.replace(/^(\d{4})(\d{2})(\d{2})$/,'$1-$2-$3'),name:title,city,org,ipc,category,region:patentCities[locationKey(city)]||''};
}

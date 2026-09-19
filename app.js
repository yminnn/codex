const words = [
  {level:'A1',article:'de',nl:'ochtend',phonetic:'/ˈɔx.tənt/',zh:'早晨，上午',cat:'日常生活',ex:'Goedemorgen! Wat een mooie ochtend.',exZh:'早上好！多么美好的早晨。'},
  {level:'A1',article:'het',nl:'huis',phonetic:'/ɦœys/',zh:'房子，家',cat:'居家',ex:'Ons huis staat bij het park.',exZh:'我们的房子在公园旁边。'},
  {level:'A1',article:'de',nl:'vriend',phonetic:'/vrint/',zh:'朋友',cat:'人物',ex:'Hij is mijn beste vriend.',exZh:'他是我最好的朋友。'},
  {level:'A1',article:'',nl:'lekker',phonetic:'/ˈlɛ.kər/',zh:'好吃的；舒服的',cat:'描述',ex:'Deze koffie is erg lekker.',exZh:'这杯咖啡非常好喝。'},
  {level:'A1',article:'het',nl:'water',phonetic:'/ˈʋaː.tər/',zh:'水',cat:'饮食',ex:'Mag ik een glas water?',exZh:'可以给我一杯水吗？'},
  {level:'A1',article:'',nl:'werken',phonetic:'/ˈʋɛr.kə(n)/',zh:'工作',cat:'日常生活',ex:'Ik werk vandaag thuis.',exZh:'我今天在家工作。'},
  {level:'A2',article:'de',nl:'afspraak',phonetic:'/ˈɑf.spraːk/',zh:'约会；预约',cat:'社交',ex:'Ik heb morgen een afspraak.',exZh:'我明天有个预约。'},
  {level:'A2',article:'',nl:'vergeten',phonetic:'/vərˈɣeː.tə(n)/',zh:'忘记',cat:'动作',ex:'Ik ben mijn sleutel vergeten.',exZh:'我忘记带钥匙了。'},
  {level:'A2',article:'de',nl:'buurt',phonetic:'/byːrt/',zh:'街区，附近',cat:'地点',ex:'Dit is een rustige buurt.',exZh:'这是一个安静的街区。'},
  {level:'A2',article:'',nl:'gezellig',phonetic:'/ɣəˈzɛ.ləx/',zh:'温馨愉快的',cat:'描述',ex:'Het was een gezellige avond.',exZh:'这是一个愉快温馨的夜晚。'},
  {level:'A2',article:'het',nl:'verschil',phonetic:'/vərˈsxɪl/',zh:'区别，差异',cat:'抽象',ex:'Wat is het verschil?',exZh:'有什么区别？'},
  {level:'B1',article:'de',nl:'ontwikkeling',phonetic:'/ɔntˈʋɪ.kə.lɪŋ/',zh:'发展',cat:'社会',ex:'De ontwikkeling gaat snel.',exZh:'发展进行得很快。'},
  {level:'B1',article:'',nl:'waarschijnlijk',phonetic:'/ʋaːrˈsxɛin.lək/',zh:'很可能，大概',cat:'表达',ex:'Waarschijnlijk komt ze later.',exZh:'她很可能晚点来。'},
  {level:'B1',article:'de',nl:'ervaring',phonetic:'/ɛrˈvaː.rɪŋ/',zh:'经验；体验',cat:'抽象',ex:'Het was een bijzondere ervaring.',exZh:'那是一次特别的体验。'},
  {level:'B1',article:'',nl:'beslissen',phonetic:'/bəˈslɪ.sə(n)/',zh:'决定',cat:'动作',ex:'We moeten vandaag beslissen.',exZh:'我们必须今天做决定。'},
  {level:'B1',article:'',nl:'verantwoordelijk',phonetic:'/vərˈɑnt.ʋoːr.də.lək/',zh:'负责任的',cat:'描述',ex:'Zij is verantwoordelijk voor het team.',exZh:'她负责这个团队。'}
];

const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
let level='A1', index=0, quizIndex=0, selected=null, checked=false;
let favorites=new Set(JSON.parse(localStorage.getItem('woordje-favorites')||'[]'));
let mastered=new Set(JSON.parse(localStorage.getItem('woordje-mastered')||'[]'));

function filtered(){return words.filter(w=>w.level===level)}
function current(){const list=filtered(); return list[index%list.length]}
function save(){localStorage.setItem('woordje-favorites',JSON.stringify([...favorites]));localStorage.setItem('woordje-mastered',JSON.stringify([...mastered]))}
function renderCard(){const w=current(), list=filtered(); $('#wordLevel').textContent=w.level;$('#wordCategory').textContent=w.cat;$('#wordArticle').textContent=w.article||'形容词 / 动词';$('#wordDutch').textContent=w.nl;$('#wordPhonetic').textContent=w.phonetic;$('#wordChinese').textContent=w.zh;$('#wordExample').textContent=w.ex;$('#exampleChinese').textContent=w.exZh;$('#cardCounter').textContent=`${index+1} / ${list.length}`;$('#favoriteButton').classList.toggle('active',favorites.has(w.nl));$('#knowButton').innerHTML=mastered.has(w.nl)?'<span>✓</span> 已掌握':'<span>✓</span> 我认识'; updateProgress()}
function updateProgress(){const count=mastered.size, today=Math.min(10,Math.max(4,count));$('#todayLearned').textContent=today;$('#dailyPercent').textContent=`${today*10}%`;$('#dailyProgress').style.width=`${today*10}%`;$('#levelDone').textContent=Math.min(60,({A1:18,A2:8,B1:3}[level]+filtered().filter(w=>mastered.has(w.nl)).length));$('#levelTitle').textContent=`${level} ${{A1:'入门',A2:'基础',B1:'进阶'}[level]}`}
function speak(word=current().nl){if(!('speechSynthesis'in window))return toast('当前浏览器不支持语音');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.lang='nl-NL';u.rate=.82;speechSynthesis.speak(u)}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),1800)}
function move(step){const len=filtered().length;index=(index+step+len)%len;renderCard()}

$$('.nav-link').forEach(b=>b.onclick=()=>{$$('.nav-link,.view').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(`#${b.dataset.view}View`).classList.add('active');if(b.dataset.view==='quiz')startQuiz();if(b.dataset.view==='words')renderList()});
$$('.level-tab').forEach(b=>b.onclick=()=>{$$('.level-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');level=b.dataset.level;index=0;renderCard()});
$('#prevButton').onclick=()=>move(-1);$('#nextButton').onclick=()=>move(1);$('#soundButton').onclick=()=>speak();
$('#favoriteButton').onclick=()=>{const w=current().nl;favorites.has(w)?favorites.delete(w):favorites.add(w);save();renderCard();toast(favorites.has(w)?'已加入收藏':'已取消收藏')};
$('#knowButton').onclick=()=>{mastered.add(current().nl);save();renderCard();toast('太棒了，又掌握一个！');setTimeout(()=>move(1),450)};
$('#themeButton').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('woordje-theme',document.body.classList.contains('dark')?'dark':'light')};
if(localStorage.getItem('woordje-theme')==='dark')document.body.classList.add('dark');
document.addEventListener('keydown',e=>{if(!$('#learnView').classList.contains('active')||e.target.tagName==='INPUT')return;if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);if(e.code==='Space'){e.preventDefault();speak()}});

function startQuiz(){quizIndex=0;renderQuiz()}
function renderQuiz(){selected=null;checked=false;const quizWords=words.filter(w=>w.level===level).slice(0,5),w=quizWords[quizIndex%quizWords.length];$('#quizWord').textContent=w.nl;$('#quizLevel').textContent=w.level;$('#quizCounter').textContent=`第 ${quizIndex+1} / ${quizWords.length} 题`;$('#quizFeedback').textContent='';$('#quizNext').disabled=true;$('#quizNext').textContent='确认答案';let options=[w.zh,...words.filter(x=>x.zh!==w.zh).sort(()=>.5-Math.random()).slice(0,3).map(x=>x.zh)].sort(()=>.5-Math.random());$('#quizOptions').innerHTML=options.map(o=>`<button class="quiz-option">${o}</button>`).join('');$$('.quiz-option').forEach(b=>b.onclick=()=>{if(checked)return;$$('.quiz-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected=b.textContent;$('#quizNext').disabled=false})}
$('#quizSound').onclick=()=>{const qw=words.filter(w=>w.level===level).slice(0,5)[quizIndex%5];speak(qw.nl)};
$('#quizNext').onclick=()=>{const qw=words.filter(w=>w.level===level).slice(0,5)[quizIndex%5];if(!checked){checked=true;$$('.quiz-option').forEach(b=>{if(b.textContent===qw.zh)b.classList.add('correct');else if(b.classList.contains('selected'))b.classList.add('wrong')});$('#quizFeedback').textContent=selected===qw.zh?'✓ 回答正确！Goed gedaan!':'再记一次：'+qw.zh;$('#quizNext').textContent=quizIndex===4?'重新开始':'下一题';return}quizIndex=quizIndex===4?0:quizIndex+1;renderQuiz()};

let listFilter='all';function renderList(){const q=$('#wordSearch').value.trim().toLowerCase();const list=words.filter(w=>(listFilter==='all'||w.level===listFilter||(listFilter==='favorites'&&favorites.has(w.nl)))&&(w.nl.toLowerCase().includes(q)||w.zh.includes(q)));$('#wordList').innerHTML=list.length?list.map(w=>`<article class="word-row"><span class="level-badge">${w.level}</span><div><h3>${w.article?`<small>${w.article}</small> `:''}${w.nl}</h3><p>${w.zh} · ${w.cat}</p></div><button class="row-heart" data-word="${w.nl}" aria-label="收藏">${favorites.has(w.nl)?'♥':'♡'}</button></article>`).join(''):'<p>没有找到匹配的单词。</p>';$$('.row-heart').forEach(b=>b.onclick=()=>{favorites.has(b.dataset.word)?favorites.delete(b.dataset.word):favorites.add(b.dataset.word);save();renderList()})}
$$('.filter').forEach(b=>b.onclick=()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');listFilter=b.dataset.filter;renderList()});$('#wordSearch').oninput=renderList;
renderCard();

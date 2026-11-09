(function(){
var st={r:"",k:""},q=document.getElementById("q"),tiles=[].slice.call(document.querySelectorAll(".tile")),n=document.getElementById("n"),em=document.getElementById("empty");
function norm(s){return(s||"").toLowerCase().replace(/\s+/g,"").replace(/(사업|공업)?협동조합(연합회)?|사단법인|\(사\)/g,"")}
tiles.forEach(function(el){el._no=el.getAttribute("href").match(/(\d{3})/)[1];el._s=(el.dataset.s||"").replace(/\s+/g,"").replace(/\(사\)|사단법인/g,"")});
function vis(){return tiles.filter(function(el){return!el.hidden})}
function apply(){var raw=(q.value||"").trim().toLowerCase(),toks=raw.split(/\s+/).filter(Boolean),c=0;
tiles.forEach(function(el){var ok=(!st.r||el.dataset.r===st.r)&&(!st.k||el.dataset.k===st.k)&&toks.every(function(t){return /^\d{1,3}$/.test(t)?(+t===+el._no||(t.length<3&&el._no.indexOf(t)===0)):el._s.indexOf(t)>-1});el.hidden=!ok;if(ok)c++});
n.textContent=c;em.hidden=c>0;hint.hidden=!(raw&&c>0);hint.textContent=c===1?"Enter를 누르면 카드를 바로 봅니다":"표지를 누르면 카드를 바로 봅니다"}
var hint=document.createElement("span");hint.className="hint";hint.hidden=true;document.querySelector(".count").appendChild(hint);
document.querySelectorAll(".f").forEach(function(b){b.addEventListener("click",function(){var g=b.dataset.g;st[g]=b.dataset.v;document.querySelectorAll('.f[data-g="'+g+'"]').forEach(function(x){x.classList.toggle("on",x===b)});apply()})});
var sug=document.createElement("div");sug.className="sug";sug.hidden=true;q.insertAdjacentElement("afterend",sug);
function suggest(){var raw=(q.value||"").trim();if(!raw){sug.hidden=true;sug.innerHTML="";return}var v=vis();
sug.innerHTML=v.length?v.slice(0,30).map(function(el,i){return'<button type="button" data-i="'+tiles.indexOf(el)+'"><span class="sg-n">'+el._no+'</span><span class="sg-r">'+el.dataset.r+'</span>'+el.querySelector(".t-u").textContent+'</button>'}).join("")+(v.length>30?'<p class="sg-more">외 '+(v.length-30)+'곳은 아래 목록에서 보세요</p>':""):'<p class="sg-more">"'+raw.replace(/[<>&"]/g,"")+'"에 맞는 조합이 없습니다</p>';sug.hidden=false}
sug.addEventListener("click",function(e){var b=e.target.closest("button");if(b)open(tiles[+b.dataset.i])});
q.addEventListener("input",function(){apply();suggest()});
document.addEventListener("click",function(e){if(!sug.contains(e.target)&&e.target!==q)sug.hidden=true});
q.addEventListener("focus",function(){if(q.value.trim())suggest()});
q.addEventListener("keydown",function(e){if(e.key==="Enter"){var v=vis();if(v.length){e.preventDefault();open(v[0])}}});
/* 바로 보기 */
var box=document.createElement("div");box.className="qv";box.hidden=true;box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");
box.innerHTML='<div class="qv-in"><div class="qv-top"><div><p class="qv-u"></p><p class="qv-h"></p></div><button class="qv-x" aria-label="닫기">×</button></div><div class="viewer"><div class="track"></div><button class="nav prev" aria-label="이전 카드">‹</button><button class="nav next" aria-label="다음 카드">›</button><div class="dots"></div></div><div class="qv-bot"><a class="btn qv-more">자세히 보기 · 한 장 요약</a><button class="btn ghost qv-copy">링크 복사</button></div></div>';
document.body.appendChild(box);
var tr=box.querySelector(".track"),dots=box.querySelector(".dots"),pv=box.querySelector(".prev"),nx=box.querySelector(".next"),cur=null,last=null;
function idx(){return Math.round(tr.scrollLeft/tr.clientWidth)}function go(i){i=Math.max(0,Math.min(4,i));tr.scrollTo({left:i*tr.clientWidth,behavior:"smooth"})}
function upd(){var i=idx();[].forEach.call(dots.children,function(d,j){d.classList.toggle("on",j===i)});pv.disabled=i===0;nx.disabled=i===4}
tr.addEventListener("scroll",function(){requestAnimationFrame(upd)});pv.onclick=function(){go(idx()-1)};nx.onclick=function(){go(idx()+1)};
function open(el,noHash){var no=el.getAttribute("href").match(/(\d{3})/)[1];cur=el;last=document.activeElement;
var qu=box.querySelector(".qv-u");qu.textContent=el.querySelector(".t-u").textContent;if(el.dataset.c){var cs=document.createElement("span");cs.className="chair";cs.textContent=el.dataset.c;qu.appendChild(cs)}box.querySelector(".qv-h").textContent=el.querySelector(".t-h").textContent;
var alts=["표지","숫자로 보는 현실","무엇이 바뀌었나","그래도 길은 있다","혼자서는 못 버팁니다"],h="",d="";
for(var i=1;i<=5;i++){h+='<figure class="slide"><img src="img/'+no+'/'+i+'.webp" alt="'+alts[i-1]+'" width="1080" height="1080"></figure>';d+='<button class="dot-b" aria-label="'+i+'번째 카드"></button>'}
tr.innerHTML=h;dots.innerHTML=d;[].forEach.call(dots.children,function(b,j){b.onclick=function(){go(j)}});
box.querySelector(".qv-more").href="c/"+no+".html";box.dataset.no=no;box.hidden=false;document.body.classList.add("noscroll");tr.scrollLeft=0;upd();box.querySelector(".qv-x").focus();
if(!noHash)history.replaceState(null,"","#"+no)}
function close(){box.hidden=true;document.body.classList.remove("noscroll");history.replaceState(null,"",location.pathname+location.search);if(last&&last.focus)last.focus()}
box.querySelector(".qv-x").onclick=close;box.addEventListener("click",function(e){if(e.target===box)close()});
document.addEventListener("keydown",function(e){if(box.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")go(idx()-1);if(e.key==="ArrowRight")go(idx()+1)});
box.querySelector(".qv-copy").onclick=function(){var b=this,u=location.origin+location.pathname.replace(/index\.html$/,"")+"c/"+box.dataset.no+".html";(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){b.textContent="복사했습니다";setTimeout(function(){b.textContent="링크 복사"},1800)},function(){prompt("링크를 복사하세요",u)})};
tiles.forEach(function(el){el.addEventListener("click",function(e){if(e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;e.preventDefault();open(el)})});
var m=location.hash.match(/^#(\d{3})$/);if(m){var t=tiles.filter(function(el){return el.getAttribute("href").indexOf(m[1])>-1})[0];if(t)open(t,true)}
})();

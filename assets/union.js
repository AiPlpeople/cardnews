(function(){var tr=document.querySelector(".track"),sl=tr.children,d=[].slice.call(document.querySelectorAll(".dot-b")),p=document.querySelector(".nav.prev"),nx=document.querySelector(".nav.next");
function idx(){return Math.round(tr.scrollLeft/tr.clientWidth)}function go(i){i=Math.max(0,Math.min(sl.length-1,i));tr.scrollTo({left:i*tr.clientWidth,behavior:"smooth"})}
function upd(){var i=idx();d.forEach(function(x,j){x.classList.toggle("on",j===i)});p.disabled=i===0;nx.disabled=i===sl.length-1}
tr.addEventListener("scroll",function(){window.requestAnimationFrame(upd)});p.onclick=function(){go(idx()-1)};nx.onclick=function(){go(idx()+1)};d.forEach(function(x,j){x.onclick=function(){go(j)}});
document.querySelector(".viewer").addEventListener("keydown",function(e){if(e.key==="ArrowLeft")go(idx()-1);if(e.key==="ArrowRight")go(idx()+1)});upd();
var s=document.getElementById("share");s.onclick=function(){var u=location.href;function done(){s.textContent="복사했습니다";setTimeout(function(){s.textContent="링크 복사"},1800)}
if(navigator.share&&/Mobi/.test(navigator.userAgent)){navigator.share({title:document.title,url:u}).catch(function(){})}else if(navigator.clipboard){navigator.clipboard.writeText(u).then(done,function(){prompt("링크를 복사하세요",u)})}else{prompt("링크를 복사하세요",u)}}})();

(function(){var b=document.getElementById("cshare");if(!b||!navigator.share||!navigator.canShare||!/Mobi|Android|iPhone|iPad/.test(navigator.userAgent))return;
try{if(!navigator.canShare({files:[new File([""],"t.jpg",{type:"image/jpeg"})]}))return}catch(e){return}
b.style.display="";var imgs=[].slice.call(document.querySelectorAll(".track img")).map(function(i){return i.getAttribute("src")});
imgs=imgs.slice(1).concat(imgs.slice(0,1));var no=(location.pathname.match(/(\d{3})\.html/)||[])[1]||"card",files=null,busy=null;
function jpg(u,n){return fetch(u).then(function(r){return r.blob()}).then(function(bl){return createImageBitmap(bl)}).then(function(im){var c=document.createElement("canvas");c.width=im.width;c.height=im.height;c.getContext("2d").drawImage(im,0,0);return new Promise(function(ok){c.toBlob(function(x){ok(new File([x],no+"_"+n+".jpg",{type:"image/jpeg"}))},"image/jpeg",0.9)})})}
function prep(){if(!busy)busy=Promise.all(imgs.map(function(u,i){return jpg(u,i<5?"카드"+(i+1):"한장요약")})).then(function(f){files=f;return f});return busy}
setTimeout(prep,800);
b.onclick=function(){var d={files:files,title:document.title,text:document.title+"\n"+location.href};
if(files){navigator.share(d).catch(function(){});return}
b.textContent="준비 중…";prep().then(function(f){b.textContent="카드 공유";d.files=f;return navigator.share(d)}).catch(function(){b.textContent="카드 공유"})}})();

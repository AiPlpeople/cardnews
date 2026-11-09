(function(){var tr=document.querySelector(".track"),sl=tr.children,d=[].slice.call(document.querySelectorAll(".dot-b")),p=document.querySelector(".nav.prev"),nx=document.querySelector(".nav.next");
function idx(){return Math.round(tr.scrollLeft/tr.clientWidth)}function go(i){i=Math.max(0,Math.min(sl.length-1,i));tr.scrollTo({left:i*tr.clientWidth,behavior:"smooth"})}
function upd(){var i=idx();d.forEach(function(x,j){x.classList.toggle("on",j===i)});p.disabled=i===0;nx.disabled=i===sl.length-1}
tr.addEventListener("scroll",function(){window.requestAnimationFrame(upd)});p.onclick=function(){go(idx()-1)};nx.onclick=function(){go(idx()+1)};d.forEach(function(x,j){x.onclick=function(){go(j)}});
document.querySelector(".viewer").addEventListener("keydown",function(e){if(e.key==="ArrowLeft")go(idx()-1);if(e.key==="ArrowRight")go(idx()+1)});upd();
var s=document.getElementById("share");s.onclick=function(){var u=location.href;function done(){s.textContent="복사했습니다";setTimeout(function(){s.textContent="링크 복사"},1800)}
if(navigator.share&&/Mobi/.test(navigator.userAgent)){navigator.share({title:document.title,url:u}).catch(function(){})}else if(navigator.clipboard){navigator.clipboard.writeText(u).then(done,function(){prompt("링크를 복사하세요",u)})}else{prompt("링크를 복사하세요",u)}}})();

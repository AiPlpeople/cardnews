(function(){var st={r:"",k:""},q=document.getElementById("q"),tiles=[].slice.call(document.querySelectorAll(".tile")),n=document.getElementById("n"),em=document.getElementById("empty");
function apply(){var t=(q.value||"").trim().toLowerCase(),c=0;tiles.forEach(function(el){var ok=(!st.r||el.dataset.r===st.r)&&(!st.k||el.dataset.k===st.k)&&(!t||el.dataset.s.indexOf(t)>-1);el.hidden=!ok;if(ok)c++});n.textContent=c;em.hidden=c>0}
document.querySelectorAll(".f").forEach(function(b){b.addEventListener("click",function(){var g=b.dataset.g;st[g]=b.dataset.v;document.querySelectorAll('.f[data-g="'+g+'"]').forEach(function(x){x.classList.toggle("on",x===b)});apply()})});
q.addEventListener("input",apply);})();

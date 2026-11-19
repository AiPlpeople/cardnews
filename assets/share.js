/* 카톡 공유: KAKAO_KEY가 있으면 카카오톡 공유(카톡만 열림), 없으면 휴대폰 공유창으로 카드 6장 JPG */
(function(){
var KAKAO_KEY="";
var ROOT=(document.currentScript&&document.currentScript.src||"").replace(/assets\/share\.js.*$/,"");
var mob=/Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
function fileOK(){try{return!!(navigator.share&&navigator.canShare&&navigator.canShare({files:[new File([""],"t.jpg",{type:"image/jpeg"})]}))}catch(e){return false}}
var kp=null;function kakao(){if(kp)return kp;kp=new Promise(function(ok,no){if(window.Kakao)return ok(window.Kakao);var s=document.createElement("script");s.src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";s.crossOrigin="anonymous";s.onload=function(){ok(window.Kakao)};s.onerror=no;document.head.appendChild(s)}).then(function(K){if(!K.isInitialized())K.init(KAKAO_KEY);return K});return kp}
function jpg(u,n){return fetch(u).then(function(r){return r.blob()}).then(function(b){return createImageBitmap(b)}).then(function(im){var c=document.createElement("canvas");c.width=im.width;c.height=im.height;c.getContext("2d").drawImage(im,0,0);return new Promise(function(ok){c.toBlob(function(x){ok(new File([x],n+".jpg",{type:"image/jpeg"}))},"image/jpeg",0.9)})})}
var cache={};function files(no,v){if(!cache[no]){var L=[];for(var i=1;i<=6;i++)L.push(jpg(ROOT+"img/"+no+"/"+i+".webp?v="+v,no+"_"+(i<6?"카드"+i:"한장요약")));cache[no]=Promise.all(L)}return cache[no]}
window.cardShare={
 show:function(){return true},
 prep:function(no,v){if(!KAKAO_KEY&&fileOK())files(no,v)},
 go:function(no,v,title,btn){var url=ROOT+"c/"+no+".html";
  if(KAKAO_KEY){return kakao().then(function(K){K.Share.sendDefault({objectType:"feed",content:{title:title,description:"업종별 생존·전환 지도",imageUrl:ROOT+"img/"+no+"/og.jpg",imageWidth:1200,imageHeight:630,link:{mobileWebUrl:url,webUrl:url}},buttons:[{title:"카드 보기",link:{mobileWebUrl:url,webUrl:url}}]})})}
  if(fileOK()){var t=btn.textContent;btn.textContent="준비 중…";return files(no,v).then(function(f){btn.textContent=t;return navigator.share({files:f,title:title,text:title+"\n"+url})}).catch(function(){btn.textContent=t})}
  if(navigator.share)return navigator.share({title:title,text:title,url:url}).catch(function(){});
  var t=btn.textContent,done=function(){btn.textContent="링크 복사됨";alert("링크를 복사했습니다. 카카오톡 대화방에 붙여넣어 보내세요.");setTimeout(function(){btn.textContent=t},1800)};
  if(navigator.clipboard)return navigator.clipboard.writeText(url).then(done,function(){prompt("링크를 복사해 카카오톡에 붙여넣으세요",url)});
  prompt("링크를 복사해 카카오톡에 붙여넣으세요",url);
 }};
})();

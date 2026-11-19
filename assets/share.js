/* 카톡 공유: KAKAO_KEY가 있으면 카카오톡 공유(카톡만 열림, 말풍선), 없으면 휴대폰 공유창으로 카드 6장 JPG */
(function(){
var KAKAO_KEY="2764d2c5d13a570ed4d1e8a274c569f0";
var ROOT=(document.currentScript&&document.currentScript.src||"").replace(/assets\/share\.js.*$/,"");
var mob=/Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
function fileOK(){try{return!!(navigator.share&&navigator.canShare&&navigator.canShare({files:[new File([""],"t.jpg",{type:"image/jpeg"})]}))}catch(e){return false}}
var kp=null;function kakao(){if(kp)return kp;kp=new Promise(function(ok,no){if(window.Kakao)return ok(window.Kakao);var s=document.createElement("script");s.src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";s.crossOrigin="anonymous";s.onload=function(){ok(window.Kakao)};s.onerror=no;document.head.appendChild(s)}).then(function(K){if(!K.isInitialized())K.init(KAKAO_KEY);return K});return kp}
function jpg(u,n){return fetch(u).then(function(r){return r.blob()}).then(function(b){return createImageBitmap(b)}).then(function(im){var c=document.createElement("canvas");c.width=im.width;c.height=im.height;c.getContext("2d").drawImage(im,0,0);return new Promise(function(ok){c.toBlob(function(x){ok(new File([x],n+".jpg",{type:"image/jpeg"}))},"image/jpeg",0.9)})})}
var cache={};function files(no,v){if(!cache[no]){var L=[];for(var i=1;i<=6;i++)L.push(jpg(ROOT+"img/"+no+"/"+i+".webp?v="+v,no+"_"+(i<6?"카드"+i:"한장요약")));cache[no]=Promise.all(L)}return cache[no]}
function save(f){f.forEach(function(x,i){setTimeout(function(){var a=document.createElement("a");a.href=URL.createObjectURL(x);a.download=x.name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},4000)},i*500)});
 setTimeout(function(){alert("카드 이미지 6장을 휴대폰에 저장했습니다.\n카카오톡 대화방에서 + → 앨범을 눌러 보내 주세요.")},f.length*500+300)}
window.cardShare={
 show:function(){return true},
 prep:function(no,v){if(KAKAO_KEY)kakao().catch(function(){});else files(no,v)},
 go:function(no,v,title,btn){var url=ROOT+"c/"+no+".html";
  if(KAKAO_KEY){var send=function(K){K.Share.sendDefault({objectType:"feed",content:{title:title,description:"업종별 생존·전환 지도",imageUrl:ROOT+"img/"+no+"/kakao.jpg?v="+v,imageWidth:1080,imageHeight:1350,link:{mobileWebUrl:url,webUrl:url}},buttons:[{title:"카드 보기",link:{mobileWebUrl:url,webUrl:url}}]})};
   if(window.Kakao&&Kakao.isInitialized()){try{send(Kakao)}catch(e){alert("카카오톡 공유를 열지 못했습니다.")}return}
   return kakao().then(send).catch(function(){alert("카카오톡 공유를 불러오지 못했습니다. 잠시 뒤 다시 눌러 주세요.")})}
  var t=btn.textContent;btn.textContent="준비 중…";
  return files(no,v).then(function(f){btn.textContent=t;
   if(fileOK()&&navigator.canShare({files:f}))return navigator.share({files:f}).catch(function(e){if(e&&e.name!=="AbortError")save(f)});
   save(f)}).catch(function(){btn.textContent=t;alert("이미지를 준비하지 못했습니다. 잠시 뒤 다시 눌러 주세요.")});
 }};
})();

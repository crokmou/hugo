"use strict";function _asyncToGenerator(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(i,o){try{var a=t[i](o),s=a.value}catch(e){return void n(e)}if(!a.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}return r("next")})}}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,t){var n=t(e,e.document);e.lazySizes=n,"object"==("undefined"==typeof module?"undefined":_typeof(module))&&module.exports&&(module.exports=n)}(window,function(e,t){if(t.getElementsByClassName){var n,r,i=t.documentElement,o=e.Date,a=e.HTMLPictureElement,s="addEventListener",c="getAttribute",l=e[s],u=e.setTimeout,d=e.requestAnimationFrame||u,f=e.requestIdleCallback,p=/^picture$/i,g=["load","error","lazyincluded","_lazyloaded"],h={},v=Array.prototype.forEach,m=function e(t,n){return h[n]||(h[n]=new RegExp("(\\s|^)"+n+"(\\s|$)")),h[n].test(t[c]("class")||"")&&h[n]},y=function e(t,n){m(t,n)||t.setAttribute("class",(t[c]("class")||"").trim()+" "+n)},w=function e(t,n){var r;(r=m(t,n))&&t.setAttribute("class",(t[c]("class")||"").replace(r," "))},b=function e(t,n,r){var i=r?s:"removeEventListener";r&&e(t,n),g.forEach(function(e){t[i](e,n)})},z=function e(r,i,o,a,s){var c=t.createEvent("CustomEvent");return o||(o={}),o.instance=n,c.initCustomEvent(i,!a,!s,o),r.dispatchEvent(c),c},_=function t(n,i){var o;!a&&(o=e.picturefill||r.pf)?o({reevaluate:!0,elements:[n]}):i&&i.src&&(n.src=i.src)},C=function e(t,n){return(getComputedStyle(t,null)||{})[n]},A=function e(t,n,i){for(i=i||t.offsetWidth;i<r.minSize&&n&&!t._lazysizesWidth;)i=n.offsetWidth,n=n.parentNode;return i},x=function(){var e,n,r=[],i=[],o=r,a=function t(){var a=o;for(o=r.length?i:r,e=!0,n=!1;a.length;)a.shift()();e=!1},s=function r(i,s){e&&!s?i.apply(this,arguments):(o.push(i),n||(n=!0,(t.hidden?u:d)(a)))};return s._lsFlush=a,s}(),k=function e(t,n){return n?function(){x(t)}:function(){var e=this,n=arguments;x(function(){t.apply(e,n)})}},E=function e(t){var n,i=0,a=r.ricTimeout,s=function e(){n=!1,i=o.now(),t()},c=f&&r.ricTimeout?function(){f(s,{timeout:a}),a!==r.ricTimeout&&(a=r.ricTimeout)}:k(function(){u(s)},!0);return function(e){var t;(e=!0===e)&&(a=33),n||(n=!0,t=125-(o.now()-i),0>t&&(t=0),e||9>t&&f?c():u(c,t))}},T=function e(t){var n,r,i=99,a=function e(){n=null,t()},s=function e(){var t=o.now()-r;i>t?u(e,i-t):(f||a)(a)};return function(){r=o.now(),n||(n=u(s,i))}};!function(){var t,n={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:!0,ricTimeout:300};r=e.lazySizesConfig||e.lazysizesConfig||{};for(t in n)t in r||(r[t]=n[t]);e.lazySizesConfig=r,u(function(){r.init&&O()})}();var N=function(){var a,d,f,g,h,A,N,O,M,P,R,I,L,F,W=/^img$/i,B=/^iframe$/i,D="onscroll"in e&&!/glebot/.test(navigator.userAgent),G=0,U=0,j=0,H=-1,K=function e(t){j--,t&&t.target&&b(t.target,e),(!t||0>j||!t.target)&&(j=0)},q=function e(n,r){var o,a=n,s="hidden"==C(t.body,"visibility")||"hidden"!=C(n,"visibility");for(O-=r,R+=r,M-=r,P+=r;s&&(a=a.offsetParent)&&a!=t.body&&a!=i;)(s=(C(a,"opacity")||1)>0)&&"visible"!=C(a,"overflow")&&(o=a.getBoundingClientRect(),s=P>o.left&&M<o.right&&R>o.top-1&&O<o.bottom+1);return s},Y=function e(){var o,s,l,u,f,p,h,v,m,y=n.elements;if((g=r.loadMode)&&8>j&&(o=y.length)){s=0,H++,null==L&&("expand"in r||(r.expand=i.clientHeight>500&&i.clientWidth>500?500:370),I=r.expand,L=I*r.expFactor),L>U&&1>j&&H>2&&g>2&&!t.hidden?(U=L,H=0):U=g>1&&H>1&&6>j?I:0;for(;o>s;s++)if(y[s]&&!y[s]._lazyRace)if(D)if((v=y[s][c]("data-expand"))&&(p=1*v)||(p=U),m!==p&&(A=innerWidth+p*F,N=innerHeight+p,h=-1*p,m=p),l=y[s].getBoundingClientRect(),(R=l.bottom)>=h&&(O=l.top)<=N&&(P=l.right)>=h*F&&(M=l.left)<=A&&(R||P||M||O)&&(r.loadHidden||"hidden"!=C(y[s],"visibility"))&&(d&&3>j&&!v&&(3>g||4>H)||q(y[s],p))){if(te(y[s]),f=!0,j>9)break}else!f&&d&&!u&&4>j&&4>H&&g>2&&(a[0]||r.preloadAfterLoad)&&(a[0]||!v&&(R||P||M||O||"auto"!=y[s][c](r.sizesAttr)))&&(u=a[0]||y[s]);else te(y[s]);u&&!f&&te(u)}},V=E(Y),J=function e(t){y(t.target,r.loadedClass),w(t.target,r.loadingClass),b(t.target,X),z(t.target,"lazyloaded")},Q=k(J),X=function e(t){Q({target:t.target})},$=function $(e,t){try{e.contentWindow.location.replace(t)}catch(n){e.src=t}},Z=function e(t){var n,i=t[c](r.srcsetAttr);(n=r.customMedia[t[c]("data-media")||t[c]("media")])&&t.setAttribute("media",n),i&&t.setAttribute("srcset",i)},ee=k(function(e,t,n,i,o){var a,s,l,d,g,h;(g=z(e,"lazybeforeunveil",t)).defaultPrevented||(i&&(n?y(e,r.autosizesClass):e.setAttribute("sizes",i)),s=e[c](r.srcsetAttr),a=e[c](r.srcAttr),o&&(l=e.parentNode,d=l&&p.test(l.nodeName||"")),h=t.firesLoad||"src"in e&&(s||a||d),g={target:e},h&&(b(e,K,!0),clearTimeout(f),f=u(K,2500),y(e,r.loadingClass),b(e,X,!0)),d&&v.call(l.getElementsByTagName("source"),Z),s?e.setAttribute("srcset",s):a&&!d&&(B.test(e.nodeName)?$(e,a):e.src=a),o&&(s||d)&&_(e,{src:a})),e._lazyRace&&delete e._lazyRace,w(e,r.lazyClass),x(function(){(!h||e.complete&&e.naturalWidth>1)&&(h?K(g):j--,J(g))},!0)}),te=function e(t){var n,i=W.test(t.nodeName),o=i&&(t[c](r.sizesAttr)||t[c]("sizes")),a="auto"==o;(!a&&d||!i||!t[c]("src")&&!t.srcset||t.complete||m(t,r.errorClass)||!m(t,r.lazyClass))&&(n=z(t,"lazyunveilread").detail,a&&S.updateElem(t,!0,t.offsetWidth),t._lazyRace=!0,j++,ee(t,n,a,o,i))},ne=function e(){if(!d){if(o.now()-h<999)return void u(e,999);var t=T(function(){r.loadMode=3,V()});d=!0,r.loadMode=3,V(),l("scroll",function(){3==r.loadMode&&(r.loadMode=2),t()},!0)}};return{_:function c(){h=o.now(),n.elements=t.getElementsByClassName(r.lazyClass),a=t.getElementsByClassName(r.lazyClass+" "+r.preloadClass),F=r.hFac,l("scroll",V,!0),l("resize",V,!0),e.MutationObserver?new MutationObserver(V).observe(i,{childList:!0,subtree:!0,attributes:!0}):(i[s]("DOMNodeInserted",V,!0),i[s]("DOMAttrModified",V,!0),setInterval(V,999)),l("hashchange",V,!0),["focus","mouseover","click","load","transitionend","animationend","webkitAnimationEnd"].forEach(function(e){t[s](e,V,!0)}),/d$|^c/.test(t.readyState)?ne():(l("load",ne),t[s]("DOMContentLoaded",V),u(ne,2e4)),n.elements.length?(Y(),x._lsFlush()):V()},checkElems:V,unveil:te}}(),S=function(){var e,n=k(function(e,t,n,r){var i,o,a;if(e._lazysizesWidth=r,r+="px",e.setAttribute("sizes",r),p.test(t.nodeName||""))for(i=t.getElementsByTagName("source"),o=0,a=i.length;a>o;o++)i[o].setAttribute("sizes",r);n.detail.dataAttr||_(e,n.detail)}),i=function e(t,r,i){var e,o=t.parentNode;o&&(i=A(t,o,i),e=z(t,"lazybeforesizes",{width:i,dataAttr:!!r}),e.defaultPrevented||(i=e.detail.width)&&i!==t._lazysizesWidth&&n(t,o,e,i))},o=function t(){var n,r=e.length;if(r)for(n=0;r>n;n++)i(e[n])},a=T(o);return{_:function n(){e=t.getElementsByClassName(r.autosizesClass),l("resize",a)},checkElems:a,updateElem:i}}(),O=function e(){e.i||(e.i=!0,S._(),N._())};return n={cfg:r,autoSizer:S,loader:N,init:O,uP:_,aC:y,rC:w,hC:m,fire:z,gW:A,rAF:x}}});var GTAG=function(){function e(){window.gtag("config",window.CROKMOU_CONF_KEY_GA)}function t(e){var t=e.category,n=void 0===t?"":t,r=e.type,i=void 0===r?"":r,o=e.action,a=void 0===o?"":o,s=e.label,c=void 0===s?"":s;(window.gtag||"function"==typeof window.gtag)&&window.gtag("event",i,{event_category:n,event_action:a,event_label:c})}return function t(){var n=document.createElement("script");n.setAttribute("src","https://www.googletagmanager.com/gtag/js?id="+window.CROKMOU_CONF_KEY_GA),document.head.appendChild(n),window.dataLayer=window.dataLayer||[],window.gtag=function e(){window.dataLayer.push(arguments)},window.gtag("js",new Date),e()}(),{sendPageView:e,sendEvent:t}}(),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};$(document).ready(function(){function e(){try{var e=algoliasearch(window.CROKMOU_CONF_ALGOLIA_ID,window.CROKMOU_CONF_ALGOLIA_API_KEY),t=e.initIndex("blog");$("#search-input").autocomplete({openOnFocus:!0,templates:{dropdownMenu:"#global-search"}},[{source:$.fn.autocomplete.sources.hits(t,{hitsPerPage:5}),templates:{suggestion:function e(t){var n=t._highlightResult;return'<div class="global-search__content">\n                        <h2 class="global-search__content__title">'+n.title.value+'</h2>\n                        <p class="global-search__content__desc">\n                          '+n.section.value+" > "+n.categories.map(function(e){return e.value}).join("-")+"</p>\n                      </div>"}}}]).on("autocomplete:selected",function(e,t,n){window.location=t.uri})}catch(e){setTimeout(Algolia,300)}}function t(){function e(e){var t=[],n=0;return new Promise(function(r){for(var i=function i(o){var a=$(e[o]),s=a.find('[itemprop="contentUrl"]'),c=s.attr("href"),l=s.find("img")[0];if(!l)return n++,n===e.length&&r(t),{v:void 0};l.onload=function(){n++,t.push(l),n===e.length&&r(t)},l.onerror=function(){n++,t.push({error:""}),n===e.length&&r(t)},l.src=c},o=0;o<e.length;o++){var a=i(o);if("object"===(void 0===a?"undefined":_typeof(a)))return a.v}})}!function t(n){for(var r=function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function t(n){var r,i,o,a,s,c,l;return regeneratorRuntime.wrap(function t(u){for(;;)switch(u.prev=u.next){case 0:return r=n.querySelectorAll("figure"),i=[],o=void 0,a=void 0,s=void 0,u.next=7,e(r);case 7:c=u.sent,l=0;case 9:if(!(l<c.length)){u.next=21;break}if(o=r[l],a=c[l],1===o.nodeType&&!a.error){u.next=14;break}return u.abrupt("continue",18);case 14:s={src:a.src,w:parseInt(a.naturalWidth||a.width,10),h:parseInt(a.naturalHeight||a.height,10)},o.children.length>1&&(s.title=o.children[1].innerHTML),s.el=o,i.push(s);case 18:l++,u.next=9;break;case 21:return u.abrupt("return",i);case 22:case"end":return u.stop()}},t,this)}));return function e(n){return t.apply(this,arguments)}}(),i=function e(t,n){return t&&(n(t)?t:e(t.parentNode,n))},o=function e(t){t=t||window.event;var n=t.target||t.srcElement,r=i(n,function(e){return e.tagName&&"FIGURE"===e.tagName.toUpperCase()});if(r){t.preventDefault?t.preventDefault():t.returnValue=!1;for(var o=i(n,function(e){return e.classList.contains("single")}),a=o.querySelectorAll("figure"),c=a.length,l=0,u=void 0,d=0;d<c;d++)if(1===a[d].nodeType){if(a[d]===r){u=l;break}l++}return u>=0&&s(u,o),!1}},a=function e(){var t=window.location.hash.substring(1),n={};if(t.length<5)return n;for(var r=t.split("&"),i=0;i<r.length;i++)if(r[i]){var o=r[i].split("=");o.length<2||(n[o[0]]=o[1])}return n.gid&&(n.gid=parseInt(n.gid,10)),n},s=function(){var e=_asyncToGenerator(regeneratorRuntime.mark(function e(t,n,i,o){var a,s,c,l,u,d;return regeneratorRuntime.wrap(function e(f){for(;;)switch(f.prev=f.next){case 0:return a=document.querySelectorAll(".pswp")[0],s=$("[rel=js-loading-pswp]"),c=void 0,l=void 0,u=void 0,s.addClass("footer__loading-pswp--active"),f.next=8,r(n);case 8:if(u=f.sent,s.removeClass("footer__loading-pswp--active"),l={showHideOpacity:!0,galleryUID:n.getAttribute("data-pswp-uid")||1,shareButtons:[{id:"facebook",label:"Partager sur Facebook",url:"https://www.facebook.com/sharer/sharer.php?u={{url}}"},{id:"twitter",label:"Partager sur Tweeter",url:"https://twitter.com/intent/tweet?text={{text}}&url={{url}}"},{id:"pinterest",label:"Partager sur Pinterest",url:"http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"}],getThumbBoundsFn:function e(t){var n=u[t].el.getElementsByTagName("img")[0],r=window.pageYOffset||document.documentElement.scrollTop,i=n.getBoundingClientRect();return{x:i.left,y:i.top+r,w:i.width}}},!o){f.next=26;break}if(!l.galleryPIDs){f.next=23;break}d=0;case 14:if(!(d<u.length)){f.next=21;break}if(u[d].pid!=t){f.next=18;break}return l.index=d,f.abrupt("break",21);case 18:d++,f.next=14;break;case 21:f.next=24;break;case 23:l.index=parseInt(t,10)-1;case 24:f.next=27;break;case 26:l.index=parseInt(t,10);case 27:if(!isNaN(l.index)){f.next=29;break}return f.abrupt("return");case 29:i&&(l.showAnimationDuration=0),c=new PhotoSwipe(a,PhotoSwipeUI_Default,u,l),c.init();case 32:case"end":return f.stop()}},e,this)}));return function t(n,r,i,o){return e.apply(this,arguments)}}(),c=document.querySelectorAll(n),l=0,u=c.length;l<u;l++)c[l].setAttribute("data-pswp-uid",l+1),c[l].onclick=o;var d=a();d.pid&&d.gid&&s(d.pid,c[d.gid-1],!0,!0)}(".single")}var n=$("body, html");!function r(){function i(){function e(e){var r=t.width()>=768,i=t.scrollTop()>=60;n.css({transition:e?".3s ease transform":"none",transform:"translateY("+(i&&r?"30":"0")+"px) scale("+(i&&r?".6":"1")+")"})}var t=$(window),n=$('[rel*="logo"]'),r=$('[rel="nav"]'),i=r.find(".active");if(i.length){var o=i.offset().left-r.offset().left-40;r.scrollLeft(o)}a(function(){e(),s(function(){e(!0)})})}function o(){var e=$('iframe[src*="youtube.com"], iframe[src*="facebook.com"]');e.each(function(){$(this).data("aspectRatio",(this.height||16)/(this.width||10)).removeAttr("height").removeAttr("width")}),a(function(){e.each(function(){var e=$(this),t=e.parent(),n=t.width();e.width(n).height(n*e.data("aspectRatio"))})})}function a(e){setTimeout(function(){return $(window).resize(e).resize()},100)}function s(e){$(window).scroll(e).scroll()}function c(){var e=0;!function t(){try{window.parsePinBtns()}catch(n){e++,e<500&&setTimeout(t,100)}}()}function l(){var e=$('[rel="js-return-top"]');s(function(){n.scrollTop()>=500?e.fadeIn():e.fadeOut()}),e.on("click",function(){n.scrollTop(0)})}return i(),e(),t(),o(),l(),{init:r,update:function e(){r(),c()}}}(),function e(){"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js").then(function(e){e.onupdatefound=function(){var t=e.installing;t.onstatechange=function(){switch(t.state){case"installed":navigator.serviceWorker.controller;break;case"redundant":console.error("The installing service worker became redundant.");break}}}}).catch(function(e){console.error("Error during service worker registration:",e)})}()});
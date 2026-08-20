function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const o=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:l,getPrototypeOf:p}=Object,u=globalThis,g=u.trustedTypes,f=g?g.emptyScript:"",y=u.reactiveElementPolyfillSupport,m=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...c(t),...l(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const n=this.constructor;if(!1===s&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[m("elementProperties")]=new Map,_[m("finalized")]=new Map,y?.({ReactiveElement:_}),(u.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,w=t=>t,E=x.trustedTypes,A=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+S,U=`<${k}>`,P=document,I=()=>P.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,T="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,M=/>/g,H=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),F=new WeakMap,V=P.createTreeWalker(P,129);function G(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=D;for(let e=0;e<i;e++){const i=t[e];let a,h,d=-1,c=0;for(;c<i.length&&(o.lastIndex=c,h=o.exec(i),null!==h);)c=o.lastIndex,o===D?"!--"===h[1]?o=z:void 0!==h[1]?o=M:void 0!==h[2]?(L.test(h[2])&&(r=RegExp("</"+h[2],"g")),o=H):void 0!==h[3]&&(o=H):o===H?">"===h[0]?(o=r??D,d=-1):void 0===h[1]?d=-2:(d=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?H:'"'===h[3]?j:N):o===j||o===N?o=H:o===z||o===M?o=D:(o=H,r=void 0);const l=o===H&&t[e+1].startsWith("/>")?" ":"";n+=o===D?i+U:d>=0?(s.push(a),i.slice(0,d)+C+i.slice(d)+S+l):i+S+(-2===d?e:l)}return[G(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[h,d]=K(t,e);if(this.el=Y.createElement(h,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=V.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=d[n++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:X}),s.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],I()),V.nextNode(),a.push({type:2,index:++r});s.append(t[e],I())}}}else if(8===s.nodeType)if(s.data===k)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)a.push({type:7,index:r}),t+=S.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===B)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=R(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);V.currentNode=s;let r=V.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=V.nextNode(),n++)}return V.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),R(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Y(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Q(this.O(I()),this.O(I()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=J(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=J(this,s[i+o],e,o),a===B&&(a=this._$AH[o]),n||=!R(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends X{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??W)===B)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(Y,Q),(x.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;class ot extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Q(e.insertBefore(I(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}ot._$litElement$=!0,ot.finalized=!0,nt.litElementHydrateSupport?.({LitElement:ot});const at=nt.litElementPolyfillSupport;at?.({LitElement:ot}),(nt.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:$},ct=(t=dt,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function lt(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return lt({...t,state:!0,attribute:!1})}const ut=["unsupported_contract","unsupported_entity","invalid_query","invalid_selection","expired_selection","auth_required","unauthorized","rate_limited","unavailable","failed"];function gt(t){const e="object"==typeof t&&t&&"code"in t?t.code:void 0;return"unknown_command"===e?"unsupported_contract":"unauthorized"===e||"permission_denied"===e?"unauthorized":"string"==typeof(i=e)&&ut.includes(i)?e:"failed";var i}class ft extends Error{constructor(t,e=t){super(e),this.code=t}}class yt{constructor(t,e=()=>Date.now()){this.onChange=t,this.now=e,this.state="idle",this.suggestions=[],this.activeIndex=-1,this.selectionExpiresAt=0,this.pendingAdd=!1,this.generation=0,this.cooldownUntil=0,this.disabledEntities=new Set,this.blockedUntil=new Map}input(t,e,i){this.reset();const s=mt(i);if(s.length<3||this.disabledEntities.has(e)||this.now()<this.cooldownUntil||this.now()<(this.blockedUntil.get(e)??0))return this.state="idle",void this.onChange();const r=this.generation;this.state="loading",this.onChange(),this.timer=setTimeout(async()=>{try{const i=await async function(t,e,i,s=8){try{const r=await t.callWS({type:"ica_shopping_list/suggestions",contract_version:1,entity_id:e,query:i,limit:s});if(1!==r.contract_version||"ica_add_suggestion"!==r.add_strategy||r.entity_id!==e||!Array.isArray(r.suggestions))throw new ft("unsupported_contract");return r}catch(t){if(t instanceof ft)throw t;throw new ft(gt(t))}}(t,e,s,8);if(r!==this.generation)return;this.suggestions=i.suggestions,this.state=i.suggestions.length?"results":"empty",this.activeIndex=-1}catch(t){if(r!==this.generation)return;const i=gt(t);if("unsupported_entity"===i||"unsupported_contract"===i)return this.disabledEntities.add(e),this.state="idle",void this.onChange();if("auth_required"===i||"unauthorized"===i)return this.blockedUntil.set(e,this.now()+3e5),this.state="idle",void this.onChange();this.message=i,this.state="fallback","rate_limited"!==i&&"unavailable"!==i||(this.cooldownUntil=this.now()+5e3)}this.onChange()},300)}select(t){const e=this.suggestions[t];if(e)return this.selected=e,this.selectionExpiresAt=this.now()+3e5,this.suggestions=[],this.activeIndex=-1,this.state="idle",this.message=void 0,this.onChange(),e}move(t){this.suggestions.length&&(this.activeIndex=-1===this.activeIndex?t>0?0:this.suggestions.length-1:(this.activeIndex+t+this.suggestions.length)%this.suggestions.length,this.onChange())}dismiss(){this.generation+=1,clearTimeout(this.timer),this.suggestions=[],this.activeIndex=-1,"results"!==this.state&&"loading"!==this.state&&"empty"!==this.state||(this.state="idle"),this.onChange()}expireSelection(){return!!(this.selected&&this.now()>=this.selectionExpiresAt)&&(this.state="expired",this.message="expired_selection",this.onChange(),!0)}async submitSelected(t,e,i){if(!this.selected||this.expireSelection()||this.pendingAdd)return!1;this.pendingAdd=!0,this.message=void 0,this.onChange();try{return await async function(t,e,i,s){try{await t.callWS({type:"ica_shopping_list/add_suggestion",contract_version:1,entity_id:e,selection_key:i,text:s})}catch(t){throw new ft(gt(t))}}(t,e,this.selected.selection_key,i),this.selected=void 0,this.selectionExpiresAt=0,this.state="idle",!0}catch(t){const i=gt(t);return this.message=i,this.state="auth_required"===i?"auth_required":"unauthorized"===i?"unauthorized":"expired_selection"===i||"invalid_selection"===i?"expired":"uncertain","auth_required"!==i&&"unauthorized"!==i||this.blockedUntil.set(e,this.now()+3e5),!1}finally{this.pendingAdd=!1,this.onChange()}}disconnect(){this.reset(),this.onChange()}deselect(){this.reset(),this.onChange()}reset(){this.generation+=1,clearTimeout(this.timer),this.selected=void 0,this.suggestions=[],this.activeIndex=-1,this.selectionExpiresAt=0,this.message=void 0,this.state="idle",this.pendingAdd=!1}}function mt(t){return t.replace(/\s+/gu," ").trim().slice(0,80)}function vt(t,e){return String(t.states[e]?.attributes.friendly_name??e)}const $t={en:{addItem:"Add an item",add:"Add",suggestions:"Suggestions from ICA",searching:"Searching ICA suggestions…",noSuggestions:"No ICA suggestions. You can still add free text.",toBuy:"To buy",completed:"Completed",empty:"Nothing to buy yet",loading:"Loading list…",unavailable:"This list is unavailable.",retry:"Refresh",edit:"Edit",save:"Save",cancel:"Cancel",delete:"Delete",confirm:"Confirm",confirmDelete:"Delete this item?",expired:"This selected article expired. Re-select it or edit the text to add it as free text.",auth:"Sign in to ICA again. Your selected article and text are preserved.",uncertain:"Could not confirm whether the item was added. Refresh the list before trying again. It will not be added as free text.",fallback:"ICA suggestions are unavailable. You can still add free text.",deselect:"Use free text",unauthorized:"You do not have permission to add this selected ICA article.",crudError:"Could not update the shopping list. Please try again.",check:"Check",uncheck:"Uncheck"},sv:{addItem:"Lägg till en vara",add:"Lägg till",suggestions:"Förslag från ICA",searching:"Söker ICA-förslag…",noSuggestions:"Inga ICA-förslag. Du kan fortfarande lägga till fritext.",toBuy:"Att köpa",completed:"Klart",empty:"Inget att köpa ännu",loading:"Laddar listan…",unavailable:"Den här listan är inte tillgänglig.",retry:"Uppdatera",edit:"Redigera",save:"Spara",cancel:"Avbryt",delete:"Ta bort",confirm:"Bekräfta",confirmDelete:"Ta bort den här varan?",expired:"Det valda förslaget har gått ut. Välj det igen eller redigera texten för att lägga till fritext.",auth:"Logga in på ICA igen. Det valda förslaget och texten sparas.",uncertain:"Det gick inte att bekräfta om varan lades till. Uppdatera listan innan du försöker igen. Den läggs inte till som fritext.",fallback:"ICA-förslag är inte tillgängliga. Du kan fortfarande lägga till fritext.",deselect:"Använd fritext",unauthorized:"Du har inte behörighet att lägga till den valda ICA-varan.",crudError:"Det gick inte att uppdatera inköpslistan. Försök igen.",check:"Markera",uncheck:"Avmarkera"}};const bt=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)})`
  :host {
    display: block;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  ha-card {
    overflow: visible;
    border-radius: 12px;
  }
  .accent {
    height: 4px;
    background: #d71920;
    border-radius: 12px 12px 0 0;
  }
  header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 16px 12px;
  }
  .brand {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    background: #d71920;
    color: white;
    font-size: 20px;
  }
  h2 {
    font-size: 20px;
    line-height: 1.25;
    margin: 0;
    font-weight: 500;
  }
  .eyebrow,
  .muted {
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .head-copy {
    flex: 1;
    min-width: 0;
  }
  .picker-wrap,
  .typeahead {
    padding: 0 16px 14px;
  }
  select,
  input {
    box-sizing: border-box;
    color: inherit;
    font: inherit;
    background: var(--card-background-color, white);
  }
  select {
    width: 100%;
    height: 44px;
    padding: 0 10px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
  }
  .typeahead {
    position: relative;
    z-index: 1;
  }
  form {
    display: flex;
    gap: 8px;
  }
  input {
    min-width: 0;
    flex: 1;
    height: 46px;
    padding: 0 12px;
    border: 1px solid var(--secondary-text-color);
    border-radius: 6px;
  }
  input:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: -1px;
    border-color: var(--primary-color);
  }
  button {
    min-height: 44px;
    cursor: pointer;
    color: inherit;
    font: inherit;
  }
  .add {
    min-width: 76px;
    border: 0;
    border-radius: 6px;
    background: var(--primary-color, #006da5);
    color: var(--text-primary-color, white);
    font-weight: 500;
  }
  .add:disabled {
    cursor: default;
    opacity: 0.55;
  }
  .popup {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 61px;
    max-height: 260px;
    overflow: auto;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color, white);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  .popup-head {
    padding: 10px 12px 6px;
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .option {
    width: 100%;
    min-height: 52px;
    padding: 8px 12px;
    border: 0;
    border-top: 1px solid var(--divider-color);
    text-align: left;
    background: transparent;
  }
  .option:hover,
  .option.active {
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
  }
  .option-primary,
  .option-secondary {
    display: block;
  }
  .option-secondary {
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .message {
    margin-top: 8px;
    padding: 10px 12px;
    border-left: 3px solid var(--primary-color);
    border-radius: 4px;
    background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    font-size: 13px;
  }
  .message.error {
    border-color: var(--error-color, #b3261e);
    background: color-mix(in srgb, var(--error-color, #b3261e) 8%, transparent);
  }
  .deselect {
    min-height: 38px;
    margin-top: 8px;
    padding: 0 12px;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    background: transparent;
    color: var(--primary-color);
  }
  .section {
    border-top: 1px solid var(--divider-color);
  }
  .section-heading {
    display: flex;
    justify-content: space-between;
    padding: 14px 16px 7px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 52px;
    padding: 0 8px 0 12px;
    border-top: 1px solid var(--divider-color);
  }
  .row .summary {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .row.completed .summary {
    color: var(--secondary-text-color);
    text-decoration: line-through;
  }
  .check,
  .icon {
    width: 44px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    font-size: 20px;
  }
  .icon {
    color: var(--secondary-text-color);
  }
  .empty,
  .status {
    padding: 16px;
    color: var(--secondary-text-color);
    text-align: center;
  }
  .edit-form {
    width: 100%;
    padding: 6px 0;
  }
  .edit-form input {
    height: 40px;
  }
  .edit-form button {
    min-height: 40px;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @media (max-width: 420px) {
    header {
      padding: 14px 12px 10px;
    }
    .picker-wrap,
    .typeahead {
      padding-left: 12px;
      padding-right: 12px;
    }
    .popup {
      left: 12px;
      right: 12px;
    }
    .row {
      min-height: 56px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      scroll-behavior: auto !important;
      transition: none !important;
    }
  }
`;function _t(t){return"object"==typeof t&&null!==t&&Array.isArray(t.items)?t.items:[]}function xt(t,e,i,s){return t.callService("todo","update_item",{entity_id:e,item:i,...s})}let wt=class extends ot{constructor(){super(...arguments),this.selectedEntity="",this.items=[],this.input="",this.listError=!1,this.crudError=!1,this.controller=new yt(()=>this.requestUpdate()),this.lifecycleGeneration=0,this.stateRefetchFallback=!1}static{this.styles=bt}static getConfigElement(){return document.createElement("ica-shopping-list-card-editor")}static getStubConfig(t,e,i){const s=Object.keys(t?.states??{}).filter(t=>t.startsWith("todo.")),r=[...e??[],...i??[],...s].find(t=>t.startsWith("todo."));return{type:"custom:ica-shopping-list-card",entities:r?[r]:[]}}setConfig(t){this.config=function(t){if(!t||"object"!=typeof t)throw new Error("Card configuration is required");const e=t;if(!Array.isArray(e.entities)||0===e.entities.length)throw new Error("entities must contain at least one todo entity");const i=e.entities.map(t=>{if("string"!=typeof t||!t.startsWith("todo."))throw new Error("entities must contain only todo entities");return t});if(new Set(i).size!==i.length)throw new Error("entities must be unique");if(e.default_entity&&!i.includes(e.default_entity))throw new Error("default_entity must be one of entities");if(void 0!==e.title&&("string"!=typeof e.title||!e.title.trim()))throw new Error("title must be a non-empty string");return{type:"custom:ica-shopping-list-card",entities:i,...e.default_entity?{default_entity:e.default_entity}:{},...e.title?{title:e.title}:{}}}(t);const e=this.config.entities.includes(this.selectedEntity)?this.selectedEntity:this.config.default_entity??this.config.entities[0];this.resetTransientState(),this.selectedEntity=e,this.ensureLoaded(!0)}getCardSize(){return 5}connectedCallback(){super.connectedCallback(),this.ensureLoaded()}disconnectedCallback(){this.disposeEntity(),this.controller.disconnect(),super.disconnectedCallback()}updated(t){t.has("hass")&&this.hass&&this.config&&(this.loadedEntity?this.stateRefetchFallback&&this.selectedEntityChanged(t.get("hass"))&&this.refresh():this.ensureLoaded())}t(t){return function(t,e){return $t[t?.toLowerCase().startsWith("sv")?"sv":"en"][e]}(this.hass?.language,t)}desiredEntity(){if(this.config)return this.config.entities.includes(this.selectedEntity)?this.selectedEntity:this.config.default_entity??this.config.entities[0]}selectedEntityChanged(t){const e=this.hass?.states[this.selectedEntity],i=t?.states[this.selectedEntity];return e?.state!==i?.state||e?.last_changed!==i?.last_changed||e?.last_updated!==i?.last_updated}async ensureLoaded(t=!1){const e=this.desiredEntity();this.isConnected&&this.hass&&e&&(t||this.loadedEntity!==e||this.subscribedEntity!==e)&&await this.activateEntity(e)}async activateEntity(t){if(!this.isConnected||!this.hass||!t)return;const e=++this.lifecycleGeneration;if(this.unsubscribe?.(),this.unsubscribe=void 0,this.loadedEntity=t,this.subscribedEntity=void 0,this.stateRefetchFallback=!1,this.selectedEntity=t,this.items=[],this.listError=!1,this.resetTransientState(),await this.refresh(t,e),this.isCurrent(t,e)&&this.hass)try{const i=await async function(t,e,i){if(t.connection?.subscribeMessage)return t.connection.subscribeMessage(t=>i(_t(t)),{type:"todo/item/subscribe",entity_id:e})}(this.hass,t,i=>{this.isCurrent(t,e)&&(this.items=i,this.listError=!1)});if(!this.isCurrent(t,e))return void i?.();i?(this.unsubscribe=i,this.subscribedEntity=t):this.stateRefetchFallback=!0}catch{this.isCurrent(t,e)&&(this.stateRefetchFallback=!0)}}disposeEntity(){this.lifecycleGeneration+=1,this.unsubscribe?.(),this.unsubscribe=void 0,this.loadedEntity=void 0,this.subscribedEntity=void 0,this.stateRefetchFallback=!1}isCurrent(t,e){return this.isConnected&&this.lifecycleGeneration===e&&this.loadedEntity===t&&this.selectedEntity===t}async switchEntity(t){this.config?.entities.includes(t)&&t!==this.selectedEntity&&await this.activateEntity(t)}async refresh(t=this.selectedEntity,e=this.lifecycleGeneration){if(this.hass&&t)try{const i=await async function(t,e){return _t(await t.callWS({type:"todo/item/list",entity_id:e}))}(this.hass,t);if(!this.isCurrent(t,e))return;this.items=i,this.listError=!1}catch{this.isCurrent(t,e)&&(this.listError=!0)}}resetTransientState(){this.input="",this.editing=void 0,this.deleting=void 0,this.crudError=!1,this.controller.disconnect()}onInput(t){this.input=mt(t.target.value),this.crudError=!1,this.hass&&this.selectedEntity&&this.controller.input(this.hass,this.selectedEntity,this.input)}onKeydown(t){"ArrowDown"===t.key?(t.preventDefault(),this.controller.move(1)):"ArrowUp"===t.key?(t.preventDefault(),this.controller.move(-1)):"Escape"===t.key?this.controller.dismiss():"Enter"===t.key&&this.controller.activeIndex>=0&&this.controller.suggestions.length&&(t.preventDefault(),this.choose(this.controller.activeIndex))}choose(t){const e=this.controller.select(t);e&&(this.input=mt(e.text))}deselect(){this.controller.deselect()}async add(){const t=mt(this.input);if(this.hass&&this.selectedEntity&&t&&!this.controller.pendingAdd&&this.supports(1)){if(this.crudError=!1,this.controller.selected){if(!await this.controller.submitSelected(this.hass,this.selectedEntity,t))return}else try{await(e=this.hass,i=this.selectedEntity,s=t,e.callService("todo","add_item",{entity_id:i,item:s}))}catch{return void(this.crudError=!0)}var e,i,s;this.input="",this.controller.dismiss(),await this.refresh(),this.updateComplete.then(()=>this.renderRoot.querySelector("#quick-input")?.focus())}}async toggle(t){if(this.hass){this.crudError=!1;try{await xt(this.hass,this.selectedEntity,t.uid,{status:"completed"===t.status?"needs_action":"completed"}),await this.refresh()}catch{this.crudError=!0}}}askDelete(t){this.deleting=t}async deleteItem(){const t=this.deleting;if(this.hass&&t){this.crudError=!1;try{await(e=this.hass,i=this.selectedEntity,s=t.uid,e.callService("todo","remove_item",{entity_id:i,item:s})),this.deleting=void 0,await this.refresh()}catch{this.crudError=!0}var e,i,s}}async saveEdit(t){t.preventDefault();const e=mt(String(new FormData(t.target).get("rename")??""));if(this.hass&&this.editing&&e){this.crudError=!1;try{await xt(this.hass,this.selectedEntity,this.editing.uid,{rename:e}),this.editing=void 0,await this.refresh()}catch{this.crudError=!0}}}supports(t){const e=this.hass?.states[this.selectedEntity]?.attributes.supported_features;return"number"!=typeof e||(e&t)===t}message(){const t=this.controller.state;return"fallback"===t?q`<div class="message">${this.t("fallback")}</div>`:"expired"===t?q`<div class="message error" role="alert">${this.t("expired")}</div>`:"auth_required"===t?q`<div class="message error" role="alert">${this.t("auth")}</div>`:"unauthorized"===t?q`<div class="message error" role="alert">${this.t("unauthorized")}</div>`:"uncertain"===t?q`<div class="message error" role="alert">${this.t("uncertain")}</div>`:W}suggestions(){return"loading"===this.controller.state?q`<div class="popup" role="status">${this.t("searching")}</div>`:"empty"===this.controller.state?q`<div class="popup" role="status">${this.t("noSuggestions")}</div>`:"results"!==this.controller.state?W:q`<div class="popup">
      <div id="ica-suggestions" role="listbox" aria-label=${this.t("suggestions")}>
        ${this.controller.suggestions.map((t,e)=>q`<button
              id="ica-option-${e}"
              class="option ${this.controller.activeIndex===e?"active":""}"
              role="option"
              tabindex="-1"
              aria-selected=${this.controller.activeIndex===e}
              @mousedown=${t=>t.preventDefault()}
              @click=${()=>this.choose(e)}
            >
              <span class="option-primary">${t.primary}</span
              >${t.secondary?q`<span class="option-secondary">${t.secondary}</span>`:W}
            </button>`)}
      </div>
    </div>`}itemRow(t){if(this.editing?.uid===t.uid)return q`<div class="row">
        <form class="edit-form" @submit=${this.saveEdit}>
          <label class="sr-only" for="edit-${t.uid}">${this.t("edit")}</label>
          <input id="edit-${t.uid}" name="rename" .value=${t.summary} />
          <button type="submit">${this.t("save")}</button>
          <button
            type="button"
            @click=${()=>{this.editing=void 0}}
          >
            ${this.t("cancel")}
          </button>
        </form>
      </div>`;const e="completed"===t.status,i=this.supports(4),s=this.supports(2);return q`<div class="row ${e?"completed":""}">
      ${i?q`<button class="check" aria-label=${`${e?this.t("uncheck"):this.t("check")} ${t.summary}`} @click=${()=>this.toggle(t)}>${e?"☑":"☐"}</button>`:W}
      <span class="summary">${t.summary}</span>
      ${i?q`<button
              class="icon"
              aria-label="${this.t("edit")} ${t.summary}"
              @click=${()=>{this.editing=t}}
            >
              ✎
            </button>`:W}
      ${s?q`<button class="icon" aria-label="${this.t("delete")} ${t.summary}" @click=${()=>this.askDelete(t)}>×</button>`:W}
    </div>`}render(){if(!this.config)return q`<ha-card
        ><div class="status">Configure this card with todo entities.</div></ha-card
      >`;const t=this.items.filter(t=>"completed"!==t.status),e=this.items.filter(t=>"completed"===t.status),i=!this.hass?.states[this.selectedEntity],s=this.supports(1),r=this.controller.state,n=this.hass?vt(this.hass,this.selectedEntity):this.selectedEntity,o=Boolean(this.controller.selected)||["expired","uncertain","auth_required","unauthorized"].includes(r);return q`<ha-card>
      <div class="accent"></div>
      <header>
        <div class="brand" aria-hidden="true">▣</div>
        <div class="head-copy">
          <h2>${this.config.title??this.t("toBuy")}</h2>
          <div class="eyebrow">${n}</div>
        </div>
        <button class="icon" aria-label=${this.t("retry")} @click=${()=>this.refresh()}>↻</button>
      </header>
      ${this.config.entities.length>1?q`<div class="picker-wrap">
              <label class="sr-only" for="entity-picker">Shopping list</label
              ><select
                id="entity-picker"
                .value=${this.selectedEntity}
                @change=${t=>this.switchEntity(t.target.value)}
              >
                ${this.config.entities.map(t=>q`<option value=${t}>${this.hass?vt(this.hass,t):t}</option>`)}
              </select>
            </div>`:W}
      <div class="typeahead">
        <form
          @submit=${t=>{t.preventDefault(),this.add()}}
        >
          <label class="sr-only" for="quick-input">${this.t("addItem")}</label
          ><input
            id="quick-input"
            .value=${this.input}
            placeholder=${this.t("addItem")}
            role="combobox"
            aria-autocomplete="list"
            aria-controls=${"results"===r?"ica-suggestions":W}
            aria-expanded=${"results"===r}
            aria-activedescendant=${this.controller.activeIndex>=0?`ica-option-${this.controller.activeIndex}`:W}
            ?readonly=${this.controller.pendingAdd}
            aria-busy=${this.controller.pendingAdd}
            @input=${this.onInput}
            @keydown=${this.onKeydown}
          /><button
            class="add"
            type="submit"
            ?disabled=${!s||!this.input.trim()||this.controller.pendingAdd||"expired"===r||"auth_required"===r||"unauthorized"===r||"uncertain"===r}
          >
            ${this.controller.pendingAdd?"…":this.t("add")}
          </button>
        </form>
        ${this.suggestions()}${this.message()}${o?q`<button class="deselect" type="button" @click=${this.deselect}>${this.t("deselect")}</button>`:W}${this.deleting?q`<div class="message error" role="alert">
                ${this.t("confirmDelete")}
                <button type="button" @click=${()=>{this.deleteItem()}}>
                  ${this.t("confirm")}</button
                ><button
                  type="button"
                  @click=${()=>{this.deleting=void 0}}
                >
                  ${this.t("cancel")}
                </button>
              </div>`:W}${this.crudError?q`<div class="message error" role="alert">${this.t("crudError")}</div>`:W}
      </div>
      ${i?q`<div class="status">${this.t("unavailable")}</div>`:this.listError?q`<div class="status">
                ${this.t("unavailable")}
                <button @click=${()=>this.refresh()}>${this.t("retry")}</button>
              </div>`:q`<section class="section">
                  <div class="section-heading">
                    <span>${this.t("toBuy")}</span><span>${t.length}</span>
                  </div>
                  ${t.length?t.map(t=>this.itemRow(t)):q`<div class="empty">${this.t("empty")}</div>`}
                </section>
                ${e.length?q`<section class="section">
                        <div class="section-heading">
                          <span>${this.t("completed")}</span><span>${e.length}</span>
                        </div>
                        ${e.map(t=>this.itemRow(t))}
                      </section>`:W}`}
    </ha-card>`}};t([lt({attribute:!1})],wt.prototype,"hass",void 0),t([pt()],wt.prototype,"config",void 0),t([pt()],wt.prototype,"selectedEntity",void 0),t([pt()],wt.prototype,"items",void 0),t([pt()],wt.prototype,"input",void 0),t([pt()],wt.prototype,"listError",void 0),t([pt()],wt.prototype,"crudError",void 0),t([pt()],wt.prototype,"editing",void 0),t([pt()],wt.prototype,"deleting",void 0),wt=t([ht("ica-shopping-list-card")],wt);let Et=class extends ot{constructor(){super(...arguments),this.config={type:"custom:ica-shopping-list-card",entities:[]}}setConfig(t){this.config={...t,entities:[...t.entities]}}emit(t){this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}onValueChanged(t){const e=t.detail.value??{},i=Array.isArray(e.entities)?e.entities.filter(t=>"string"==typeof t):this.config.entities,s=(r=i,n=this.config.entities,!(r.length===n.length&&r.every((t,e)=>t===n[e])));var r,n;const o=i.includes(e.default_entity??this.config.default_entity??"")?e.default_entity??this.config.default_entity:i[0];this.emit({...this.config,...e,type:"custom:ica-shopping-list-card",entities:i,...s||o?{default_entity:o}:{}})}render(){const t=this.hass?(e=this.hass,Object.values(e.states).filter(t=>t.entity_id.startsWith("todo.")).map(t=>({entity_id:t.entity_id,name:String(t.attributes.friendly_name??t.entity_id)})).sort((t,e)=>t.name.localeCompare(e.name))):[];var e;const i=this.config.entities;return q`<div class="card-config">
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${[{name:"title",selector:{text:{}}},{name:"entities",required:!0,selector:{entity:{domain:"todo",multiple:!0}}},{name:"default_entity",selector:{select:{mode:"dropdown",options:t.filter(t=>i.includes(t.entity_id)).map(t=>({value:t.entity_id,label:t.name}))}}}]}
        @value-changed=${this.onValueChanged}
      ></ha-form>
    </div>`}};t([lt({attribute:!1})],Et.prototype,"hass",void 0),t([pt()],Et.prototype,"config",void 0),Et=t([ht("ica-shopping-list-card-editor")],Et);window.customCards=window.customCards??[],window.customCards.some(t=>"ica-shopping-list-card"===t.type)||window.customCards.push({type:"ica-shopping-list-card",name:"ICA Shopping List Card",description:"A shopping list card with optional ICA suggestions."}),console.info("%c ICA Shopping List Card %c v1.0.0 ","color: white; background: #d71920; font-weight: bold;","color: #d71920; background: white; font-weight: bold;");

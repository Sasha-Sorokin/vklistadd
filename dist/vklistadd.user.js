//
// ==UserScript==
// @name VK List Add
// @name:ru VK Добавление в списки
// @description Implements a darky button to add communities or users to feed lists without subscribing to them
// @description:ru Реализует тёмную кнопку для добавления сообществ или пользователей в списки новостей без подписки на них
// @version 2.0.1
// @author Sasha Sorokin https://github.com/Sasha-Sorokin
// @license MIT
//
// @namespace https://github.com/Sasha-Sorokin/vklistadd
// @homepage https://github.com/Sasha-Sorokin/vklistadd#readme
// @supportURL https://github.com/Sasha-Sorokin/vklistadd/issues
// @updateURL https://github.com/Sasha-Sorokin/vklistadd/raw/master/vklistadd.user.js
// @include https://vk.com/*
// @run-at document-start
// @noframes
// @grant unsafeWindow
// @grant GM.setValue
// @grant GM_setValue
// @grant GM.getValue
// @grant GM_getValue
// ==/UserScript==
//

/*!
 * .........................................................
 * .  __   ___  __  _    ___ ___ _____     _   ___  ___    .
 * .  \ \ / / |/ / | |  |_ _/ __|_   _|   /_\ |   \|   \   .
 * .   \ V /| ' <  | |__ | |\__ \ | |    / _ \| |) | |) |  .
 * .    \_/ |_|\_\ |____|___|___/ |_|   /_/ \_\___/|___/   .
 * .........................................................
 *
 *
 * Стой! Если ты изучаешь исходный код этого скрипта — прямо сейчас ты
 * просматриваешь его скомпилированную версию: в неё уже помещены сторонние
 * модули (некоторые в минифицированном, нечитаемом виде), а также убраны все
 * комментарии и документация.
 *
 * Переходи на GitHub за исходными кодами и последними изменениями:
 *
 * https://github.com/Sasha-Sorokin/vklistadd
 */

(function () {
  'use strict';

  var data = { addListButton:{ text:"Create a new list",
      tooltip:"Redirect to news page" },
    actionButton:{ text:"Manage lists" },
    actionsMenuItem:{ text:"News feed lists" },
    actionLabel:{ template:"Show news {} in the lists:",
      context:{ group:"this group's",
        "public":"this community's",
        profile:"this user's",
        bookmark:"for this bookmark",
        other:"this page's" } },
    followStatus:{ context:{ group:[ "You have not joined this group.",
          "You are a member of this group." ],
        "public":[ "You are not following page.",
          "You are following this page." ],
        profile:[ "Not in the friends list.",
          "You are following them." ],
        own:"This is beautiful you!" },
      unknown:"Unknown follow status.",
      hint:"You can add to the tabs without following or adding to friends." },
    errorMessages:{ WRAPPING_A_WRAPPER:"Attempting to wrap already wrapped function.",
      VK_LANGUAGE_DETECT_FAIL:"Failed to detect VK language.",
      NO_OR_INVALID_CONTEXT:"Window doesn't contain context or current context object doesn't contain options (odd behavior).",
      NO_PARENT_NODE:"Referenced node has no parent node.",
      ALREADY_INJECTED:"Interceptors already were injected in the window." },
    box:{ title:"Manage lists" },
    listLoader:{ loadFailed:"Unable to fetch your lists :(" },
    lists:{ empty:"You have no lists." },
    listCreation:{ highlightTooltip:"{} is here" },
    errorBoundary:{ text:"Unfortunately, due to a bug in our code, this window has failed to render :(\n\nPlease, try another browser and !!report to extension developer!! if that won't solve the problem." },
    notificationsStatus:[ "Notifications disabled.",
      "Notifications enabled." ],
    versionChecker:{ installed:"<b>Yay! VK List Add is now installed.</b><br>Thank you for installing our extension. <a href=\"https://github.com/Sasha-Sorokin/vklistadd/blob/master/docs/{}/GUIDE.md\" target=\"blank\" rel=\"noreferrer\">Do you want to learn how to use it?</a>",
      updated:"<b>VK List Add has been updated!</b></br>Want to see <a href=\"https://github.com/Sasha-Sorokin/vklistadd/blob/master/CHANGELOG.md\" target=\"blank\" rel=\"noreferrer\">our changelog?</a>" } };
  var addListButton = data.addListButton;
  var actionButton = data.actionButton;
  var actionsMenuItem = data.actionsMenuItem;
  var actionLabel = data.actionLabel;
  var followStatus = data.followStatus;
  var errorMessages = data.errorMessages;
  var box = data.box;
  var listLoader = data.listLoader;
  var lists = data.lists;
  var listCreation = data.listCreation;
  var errorBoundary = data.errorBoundary;
  var notificationsStatus = data.notificationsStatus;
  var versionChecker = data.versionChecker;

  var enUS = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': data,
    addListButton: addListButton,
    actionButton: actionButton,
    actionsMenuItem: actionsMenuItem,
    actionLabel: actionLabel,
    followStatus: followStatus,
    errorMessages: errorMessages,
    box: box,
    listLoader: listLoader,
    lists: lists,
    listCreation: listCreation,
    errorBoundary: errorBoundary,
    notificationsStatus: notificationsStatus,
    versionChecker: versionChecker
  });

  var data$1 = { addListButton:{ text:"Создать новый список",
      tooltip:"Перенаправляет в ленту новостей" },
    actionButton:{ text:"Настроить списки" },
    actionsMenuItem:{ text:"Списки новостей" },
    actionLabel:{ template:"Отображать новости {} в списках:",
      context:{ group:"группы",
        "public":"сообщества",
        profile:"пользователя",
        bookmark:"для закладки",
        other:"страницы" } },
    followStatus:{ context:{ group:[ "Вы не вступили в группу.",
          "Вы участник этой группы." ],
        "public":[ "Вы не подписаны на это сообщество.",
          "Вы подписаны на это сообщество." ],
        profile:[ "Не в списке друзей.",
          "Вы подписаны на этого пользователя." ],
        own:"Гляньте-ка, это же вы!" },
      unknown:"Статус подписки не известен.",
      hint:"Вносить в списки можно без подписки или добавления в друзья." },
    errorMessages:{ WRAPPING_A_WRAPPER:"Попытка обернуть ранее обвёрнутую функцию.",
      VK_LANGUAGE_DETECT_FAIL:"Невозможно определить используемый ВКонтакте язык.",
      NO_OR_INVALID_CONTEXT:"В объекте окна отсутствует объект контекста или в контексте отсутствуют опции (странное поведение).",
      NO_PARENT_NODE:"У переданного узла отсутствует родительский узел.",
      ALREADY_INJECTED:"Отловщики уже установлены в объекте окна." },
    listLoader:{ loadFailed:"Не удалось загрузить ваши списки :(" },
    lists:{ empty:"У вас нет списков новостей." },
    listCreation:{ highlightTooltip:"{} здесь" },
    privateWarning:{ profile:"Это закрытый профиль. Вам необходимо добавить пользователя в друзья, чтобы его новости отображались в выбранных вами списках.",
      group:[ "Это закрытая группа. Вам необходимо вступить в неё, чтобы её новости отображались в выбранных списках.",
        "Это закрытая группа. Вам необходимо оставаться участником, чтобы её новости отображались в выбранных списках." ] },
    box:{ title:"Управление списками",
      savingShift:"Удерживайте Shift, чтобы не закрывать это окно",
      savingChanges:"Изменения сохраняются..." },
    errorBoundary:{ text:"К сожалению, из-за ошибки это окно не смогло отобразиться :(\n\nПожалуйста, попробуйте другой браузер и !!сообщите разработчикам расширения!!, если это не исправит проблему." },
    notificationsStatus:[ "Уведомления отключены.",
      "Уведомления включены." ],
    versionChecker:{ installed:"<b>Ура, VK List Add установлен!</b><br>Спасибо за установку нашего расширения. <a href=\"https://github.com/Sasha-Sorokin/vklistadd/blob/master/docs/{}/GUIDE.md\" target=\"blank\" rel=\"noreferrer\">Хотите узнать, как его использовать?</a>",
      updated:"<b>VK List Add обновился!</b></br>Желаете взглянуть на <a href=\"https://github.com/Sasha-Sorokin/vklistadd/blob/master/CHANGELOG.md\" target=\"blank\" rel=\"noreferrer\">список изменений?</a>" } };
  var addListButton$1 = data$1.addListButton;
  var actionButton$1 = data$1.actionButton;
  var actionsMenuItem$1 = data$1.actionsMenuItem;
  var actionLabel$1 = data$1.actionLabel;
  var followStatus$1 = data$1.followStatus;
  var errorMessages$1 = data$1.errorMessages;
  var listLoader$1 = data$1.listLoader;
  var lists$1 = data$1.lists;
  var listCreation$1 = data$1.listCreation;
  var privateWarning = data$1.privateWarning;
  var box$1 = data$1.box;
  var errorBoundary$1 = data$1.errorBoundary;
  var notificationsStatus$1 = data$1.notificationsStatus;
  var versionChecker$1 = data$1.versionChecker;

  var ruRU = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': data$1,
    addListButton: addListButton$1,
    actionButton: actionButton$1,
    actionsMenuItem: actionsMenuItem$1,
    actionLabel: actionLabel$1,
    followStatus: followStatus$1,
    errorMessages: errorMessages$1,
    listLoader: listLoader$1,
    lists: lists$1,
    listCreation: listCreation$1,
    privateWarning: privateWarning,
    box: box$1,
    errorBoundary: errorBoundary$1,
    notificationsStatus: notificationsStatus$1,
    versionChecker: versionChecker$1
  });

  const TRANSLATIONS = Object.freeze({
      "en-US": enUS,
      "ru-RU": ruRU,
  });

  var _a;
  function detectNavigatorLanguage() {
      for (const langCode of navigator.languages) {
          if (langCode in TRANSLATIONS)
              return langCode;
      }
      return null;
  }
  const NAVIGATOR_LANGUAGE = (_a = detectNavigatorLanguage()) !== null && _a !== void 0 ? _a : "en-US";
  function getNavigatorLanguage() {
      return NAVIGATOR_LANGUAGE;
  }
  const NAVIGATOR_TRANSLATIONS = TRANSLATIONS[getNavigatorLanguage()];
  function getNavigatorTranslations() {
      return NAVIGATOR_TRANSLATIONS;
  }

  const MESSAGES = getNavigatorTranslations().errorMessages;
  function generateErrorMessages() {
      const errorMessages = Object.create(null);
      for (const [key, message] of Object.entries(MESSAGES)) {
          errorMessages[key] = `[${key}] ${message}`;
      }
      return Object.freeze(errorMessages);
  }
  const ERROR_MESSAGES = generateErrorMessages();
  const [INITIAL, ...STYLES] = [
      "%c[VKLISTADD]%c",
      "color: white; background: green; font-weight: bold;",
      "",
  ];
  function log(level, ...args) {
      const [message, ...rest] = args;
      if (typeof message === "string") {
          console[level](`${INITIAL} ${message}`, ...STYLES, ...rest);
      }
      else {
          console[level](INITIAL, ...STYLES, ...args);
      }
  }

  function getWindow() {
      return unsafeWindow;
  }

  const SWITCH_CALLBACKS = new WeakMap();
  function getCallbacks($switch) {
      let callbacks = SWITCH_CALLBACKS.get($switch);
      if (callbacks == null) {
          callbacks = new Set();
          SWITCH_CALLBACKS.set($switch, callbacks);
      }
      return callbacks;
  }
  function invokeCallbacks($switch, value) {
      for (const callback of getCallbacks($switch)) {
          try {
              callback(value);
          }
          catch (_a) {
          }
      }
  }
  function createSwitch(initialValue = false) {
      let currentValue = initialValue;
      const $switch = {
          get currentValue() {
              return currentValue;
          },
          toggle(newValue) {
              currentValue = newValue !== null && newValue !== void 0 ? newValue : !currentValue;
              invokeCallbacks($switch, currentValue);
              return currentValue;
          },
          lazyToggle(newValue) {
              const $currentValue = currentValue;
              currentValue = newValue !== null && newValue !== void 0 ? newValue : !$currentValue;
              invokeCallbacks($switch, currentValue);
              return $currentValue;
          },
          onChange(callback) {
              getCallbacks($switch).add(callback);
              return () => getCallbacks($switch).delete(callback);
          },
      };
      return $switch;
  }
  function lazyToggle($switch, newValue) {
      return $switch.lazyToggle(newValue);
  }
  function valueOf($switch) {
      return $switch.currentValue;
  }

  var n,u,i,t,o,r,f={},e=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;function s(n,l){for(var u in l)n[u]=l[u];return n}function a(n){var l=n.parentNode;l&&l.removeChild(n);}function v(n,l,u){var i,t=arguments,o={};for(i in l)"key"!==i&&"ref"!==i&&(o[i]=l[i]);if(arguments.length>3)for(u=[u],i=3;i<arguments.length;i++)u.push(t[i]);if(null!=u&&(o.children=u),"function"==typeof n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===o[i]&&(o[i]=n.defaultProps[i]);return h(n,o,l&&l.key,l&&l.ref)}function h(l,u,i,t){var o={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0};return n.vnode&&n.vnode(o),o}function p(){return {}}function d(n){return n.children}function y(n,l){this.props=n,this.context=l;}function m(n,l){if(null==l)return n.__?m(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?m(n):null}function w(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return w(n)}}function g(l){(!l.__d&&(l.__d=!0)&&1===u.push(l)||t!==n.debounceRendering)&&((t=n.debounceRendering)||i)(k);}function k(){var n,l,i,t,o,r,f;for(u.sort(function(n,l){return l.__v.__b-n.__v.__b});n=u.pop();)n.__d&&(i=void 0,t=void 0,r=(o=(l=n).__v).__e,(f=l.__P)&&(i=[],t=z(f,o,s({},o),l.__n,void 0!==f.ownerSVGElement,null,i,null==r?m(o):r),A(i,o),t!=r&&w(o)));}function _(n,l,u,i,t,o,r,c,s){var v,h,p,d,y,w,g,k=u&&u.__k||e,_=k.length;if(c==f&&(c=null!=o?o[0]:_?m(u,0):null),v=0,l.__k=b(l.__k,function(u){if(null!=u){if(u.__=l,u.__b=l.__b+1,null===(p=k[v])||p&&u.key==p.key&&u.type===p.type)k[v]=void 0;else for(h=0;h<_;h++){if((p=k[h])&&u.key==p.key&&u.type===p.type){k[h]=void 0;break}p=null;}if(d=z(n,u,p=p||f,i,t,o,r,c,s),(h=u.ref)&&p.ref!=h&&(g||(g=[]),p.ref&&g.push(p.ref,null,u),g.push(h,u.__c||d,u)),null!=d){var e;if(null==w&&(w=d),void 0!==u.__d)e=u.__d,u.__d=void 0;else if(o==p||d!=c||null==d.parentNode){n:if(null==c||c.parentNode!==n)n.appendChild(d),e=null;else {for(y=c,h=0;(y=y.nextSibling)&&h<_;h+=2)if(y==d)break n;n.insertBefore(d,c),e=c;}"option"==l.type&&(n.value="");}c=void 0!==e?e:d.nextSibling,"function"==typeof l.type&&(l.__d=c);}else c&&p.__e==c&&c.parentNode!=n&&(c=m(p));}return v++,u}),l.__e=w,null!=o&&"function"!=typeof l.type)for(v=o.length;v--;)null!=o[v]&&a(o[v]);for(v=_;v--;)null!=k[v]&&j(k[v],k[v]);if(g)for(v=0;v<g.length;v++)$(g[v],g[++v],g[++v]);}function b(n,l,u){if(null==u&&(u=[]),null==n||"boolean"==typeof n)l&&u.push(l(null));else if(Array.isArray(n))for(var i=0;i<n.length;i++)b(n[i],l,u);else u.push(l?l("string"==typeof n||"number"==typeof n?h(null,n,null,null):null!=n.__e||null!=n.__c?h(n.type,n.props,n.key,null):n):n);return u}function x(n,l,u,i,t){var o;for(o in u)o in l||C(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"value"===o||"checked"===o||u[o]===l[o]||C(n,o,l[o],u[o],i);}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===c.test(l)?u+"px":null==u?"":u;}function C(n,l,u,i,t){var o,r,f,e,c;if(t?"className"===l&&(l="class"):"class"===l&&(l="className"),"key"===l||"children"===l);else if("style"===l)if(o=n.style,"string"==typeof u)o.cssText=u;else {if("string"==typeof i&&(o.cssText="",i=null),i)for(r in i)u&&r in u||P(o,r,"");if(u)for(f in u)i&&u[f]===i[f]||P(o,f,u[f]);}else "o"===l[0]&&"n"===l[1]?(e=l!==(l=l.replace(/Capture$/,"")),c=l.toLowerCase(),l=(c in n?c:l).slice(2),u?(i||n.addEventListener(l,N,e),(n.l||(n.l={}))[l]=u):n.removeEventListener(l,N,e)):"list"!==l&&"tagName"!==l&&"form"!==l&&"type"!==l&&"size"!==l&&!t&&l in n?n[l]=null==u?"":u:"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u&&!/^ar/.test(l)?n.removeAttribute(l):n.setAttribute(l,u));}function N(l){this.l[l.type](n.event?n.event(l):l);}function z(l,u,i,t,o,r,f,e,c){var a,v,h,p,m,w,g,k,b,x,P=u.type;if(void 0!==u.constructor)return null;(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(k=u.props,b=(a=P.contextType)&&t[a.__c],x=a?b?b.props.value:a.__:t,i.__c?g=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(k,x):(u.__c=v=new y(k,x),v.constructor=P,v.render=D),b&&b.sub(v),v.props=k,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=s({},v.__s)),s(v.__s,P.getDerivedStateFromProps(k,v.__s))),p=v.props,m=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&k!==p&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(k,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(k,v.__s,x)){for(v.props=k,v.state=v.__s,v.__d=!1,v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v),a=0;a<u.__k.length;a++)u.__k[a]&&(u.__k[a].__=u);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(k,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(p,m,w);});}v.context=x,v.props=k,v.state=v.__s,(a=n.__r)&&a(u),v.__d=!1,v.__v=u,v.__P=l,a=v.render(v.props,v.state,v.context),u.__k=null!=a&&a.type==d&&null==a.key?a.props.children:Array.isArray(a)?a:[a],null!=v.getChildContext&&(t=s(s({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(w=v.getSnapshotBeforeUpdate(p,m)),_(l,u,i,t,o,r,f,e,c),v.base=u.__e,v.__h.length&&f.push(v),g&&(v.__E=v.__=null),v.__e=!1;}else u.__e=T(i.__e,u,i,t,o,r,f,c);(a=n.diffed)&&a(u);}catch(l){n.__e(l,u,i);}return u.__e}function A(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n.__e(l,u.__v);}});}function T(n,l,u,i,t,o,r,c){var s,a,v,h,p,d=u.props,y=l.props;if(t="svg"===l.type||t,null!=o)for(s=0;s<o.length;s++)if(null!=(a=o[s])&&((null===l.type?3===a.nodeType:a.localName===l.type)||n==a)){n=a,o[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(y);n=t?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type,y.is&&{is:y.is}),o=null;}if(null===l.type)d!==y&&n.data!=y&&(n.data=y);else if(l!==u){if(null!=o&&(o=e.slice.call(n.childNodes)),v=(d=u.props||f).dangerouslySetInnerHTML,h=y.dangerouslySetInnerHTML,!c){if(d===f)for(d={},p=0;p<n.attributes.length;p++)d[n.attributes[p].name]=n.attributes[p].value;(h||v)&&(h&&v&&h.__html==v.__html||(n.innerHTML=h&&h.__html||""));}x(n,y,d,t,c),l.__k=l.props.children,h||_(n,l,u,i,"foreignObject"!==l.type&&t,o,r,f,c),c||("value"in y&&void 0!==y.value&&y.value!==n.value&&(n.value=null==y.value?"":y.value),"checked"in y&&void 0!==y.checked&&y.checked!==n.checked&&(n.checked=y.checked));}return n}function $(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,i);}}function j(l,u,i){var t,o,r;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||$(t,null,u)),i||"function"==typeof l.type||(i=null!=(o=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(r=0;r<t.length;r++)t[r]&&j(t[r],u,i);null!=o&&a(o);}function D(n,l,u){return this.constructor(n,u)}function E(l,u,i){var t,r,c;n.__&&n.__(l,u),r=(t=i===o)?null:i&&i.__k||u.__k,l=v(d,null,[l]),c=[],z(u,(t?u:i||u).__k=l,r||f,f,void 0!==u.ownerSVGElement,i&&!t?[i]:r?null:e.slice.call(u.childNodes),c,i||f,t),A(c,l);}function L(n){var l={},u={__c:"__cC"+r++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var i,t=this;return this.getChildContext||(i=[],this.getChildContext=function(){return l[u.__c]=t,l},this.shouldComponentUpdate=function(l){n.value!==l.value&&i.some(function(n){n.context=l.value,g(n);});},this.sub=function(n){i.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){i.splice(i.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Consumer.contextType=u,u}n={__e:function(n,l){for(var u,i;l=l.__;)if((u=l.__c)&&!u.__)try{if(u.constructor&&null!=u.constructor.getDerivedStateFromError&&(i=!0,u.setState(u.constructor.getDerivedStateFromError(n))),null!=u.componentDidCatch&&(i=!0,u.componentDidCatch(n)),i)return g(u.__E=u)}catch(l){n=l;}throw n}},y.prototype.setState=function(n,l){var u;u=this.__s!==this.state?this.__s:this.__s=s({},this.state),"function"==typeof n&&(n=n(u,this.props)),n&&s(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),g(this));},y.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),g(this));},y.prototype.render=d,u=[],i="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,o=f,r=0;

  var t$1,r$1,u$1,i$1=[],o$1=n.__r,f$1=n.diffed,c$1=n.__c,e$1=n.unmount;function a$1(t){n.__h&&n.__h(r$1);var u=r$1.__H||(r$1.__H={__:[],__h:[]});return t>=u.__.length&&u.__.push({}),u.__[t]}function v$1(n){return m$1(x$1,n)}function m$1(n,u,i){var o=a$1(t$1++);return o.__c||(o.__c=r$1,o.__=[i?i(u):x$1(void 0,u),function(t){var r=n(o.__[0],t);o.__[0]!==r&&(o.__[0]=r,o.__c.setState({}));}]),o.__}function p$1(n,u){var i=a$1(t$1++);q(i.__H,u)&&(i.__=n,i.__H=u,r$1.__H.__h.push(i));}function y$1(n){return s$1(function(){return {current:n}},[])}function s$1(n,r){var u=a$1(t$1++);return q(u.__H,r)?(u.__H=r,u.__h=n,u.__=n()):u.__}function h$1(n,t){return s$1(function(){return n},t)}function T$1(n){var u=r$1.context[n.__c];if(!u)return n.__;var i=a$1(t$1++);return null==i.__&&(i.__=!0,u.sub(r$1)),u.props.value}function A$1(n){var u=a$1(t$1++),i=v$1();return u.__=n,r$1.componentDidCatch||(r$1.componentDidCatch=function(n){u.__&&u.__(n),i[1](n);}),[i[0],function(){i[1](void 0);}]}function F(){i$1.some(function(t){if(t.__P)try{t.__H.__h.forEach(_$1),t.__H.__h.forEach(g$1),t.__H.__h=[];}catch(r){return n.__e(r,t.__v),!0}}),i$1=[];}function _$1(n){n.t&&n.t();}function g$1(n){var t=n.__();"function"==typeof t&&(n.t=t);}function q(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function x$1(n,t){return "function"==typeof t?t(n):t}n.__r=function(n){o$1&&o$1(n),t$1=0,(r$1=n.__c).__H&&(r$1.__H.__h.forEach(_$1),r$1.__H.__h.forEach(g$1),r$1.__H.__h=[]);},n.diffed=function(t){f$1&&f$1(t);var r=t.__c;if(r){var o=r.__H;o&&o.__h.length&&(1!==i$1.push(r)&&u$1===n.requestAnimationFrame||((u$1=n.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),unsafeWindow.cancelAnimationFrame.bind(unsafeWindow)(t),setTimeout(n);},u=setTimeout(r,100);"undefined"!=typeof window&&(t=requestAnimationFrame(r));})(F));}},n.__c=function(t,r){r.some(function(t){try{t.__h.forEach(_$1),t.__h=t.__h.filter(function(n){return !n.__||g$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],n.__e(u,t.__v);}}),c$1&&c$1(t,r);},n.unmount=function(t){e$1&&e$1(t);var r=t.__c;if(r){var u=r.__H;if(u)try{u.__.forEach(function(n){return n.t&&n.t()});}catch(t){n.__e(t,r.__v);}}};

  const { slice } = Array.prototype;
  function elementToRender(component, props) {
      return typeof component === "function" ? component(props) : component;
  }
  function insertFragement(parent, fragement) {
      if (typeof parent === "function") {
          parent(fragement);
          return;
      }
      parent.appendChild(fragement);
  }
  function cloneReferences(fragment, set) {
      set.clear();
      const children = slice.call(fragment.childNodes);
      for (const child of children)
          set.add(child);
  }
  function asRoaming(component) {
      let currentNodes;
      return function renderAndMount(insertFunctionOrParent, props) {
          const fragment = document.createDocumentFragment();
          if (currentNodes == null) {
              currentNodes = new Set();
          }
          else {
              for (const node of currentNodes)
                  fragment.appendChild(node);
          }
          E(elementToRender(component, props), fragment);
          cloneReferences(fragment, currentNodes);
          insertFragement(insertFunctionOrParent, fragment);
      };
  }
  function asReplicable(component) {
      return function replicateAndMount(insertFunctionOrParent, props) {
          const fragment = document.createDocumentFragment();
          E(elementToRender(component, props), fragment);
          insertFragement(insertFunctionOrParent, fragment);
      };
  }

  const VK_LANGUAGE_MAPPINGS = {
      0: "ru-RU",
      777: "ru-RU",
      100: "ru-RU",
      1: "ru-RU",
      3: "en-US",
  };
  function detectVKLanguage() {
      var _a;
      const { langConfig } = getWindow();
      if (langConfig == null) {
          throw new Error(ERROR_MESSAGES.VK_LANGUAGE_DETECT_FAIL);
      }
      return (_a = VK_LANGUAGE_MAPPINGS[langConfig.id]) !== null && _a !== void 0 ? _a : getNavigatorLanguage();
  }
  let vkLanguage;
  function getVKLanguage() {
      if (vkLanguage == null) {
          vkLanguage = detectVKLanguage();
      }
      return vkLanguage;
  }
  function getVKTranslation() {
      return TRANSLATIONS[getVKLanguage()];
  }

  let globalSeed = Date.now();
  function increment() {
      if (globalSeed === Number.MAX_SAFE_INTEGER)
          globalSeed = 0; // Start from the beginning again
      globalSeed += 1;
  }
  function get() { return globalSeed; }

  const alphas = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const alphasLen = alphas.length;
  function createClassName(seed, prefix = '') {
      // split into pairs
      let out = '';
      const seedStr = seed.toString();
      const len = seedStr.length;
      for (let i = 0; i < len; i++) {
          const first = +seedStr[i];
          if (i < len - 2) {
              const second = +seedStr[i + 1];
              const pairNum = Number.parseInt(`${first}${second}`, 10);
              if (pairNum <= alphasLen - 1)
                  out += alphas[pairNum];
              else
                  out += `${alphas[first]}${alphas[second]}`;
              i++;
          }
          else
              out += alphas[first];
      }
      return `${prefix}_${out}`;
  }

  const camelCaseRegex = /([a-z])([A-Z])/g;
  function formatCssRule(rule) {
      return rule.replace(camelCaseRegex, (match, p1, p2) => `${p1}-${p2.toLowerCase()}`);
  }

  let preHooks = [];
  let postHooks = [];
  function getPreHooks() {
      return preHooks;
  }
  function getPostHooks() {
      return postHooks;
  }

  let sheets = [];
  var sheetCache = {
      add(sheet) { sheets.push(sheet); },
      getAll() { return sheets; },
      clean() { sheets = []; },
  };

  class SimpleStylesheet {
      constructor() {
          this.sheetBuffer = '';
          this.cachedKeySelectorMap = {};
      }
      raw(raw) {
          this.sheetBuffer += raw;
      }
      addRule(classKey, selector, style, shouldCache = false) {
          if (classKey && selector) {
              if (this.cachedKeySelectorMap[classKey])
                  throw new Error(`Class Key clash for ${classKey}`);
              if (shouldCache)
                  this.cachedKeySelectorMap[classKey] = selector;
              if (style)
                  this.sheetBuffer += `${selector}{${style}}`;
          }
      }
      startMedia(query) {
          this.sheetBuffer += `${query}{`;
      }
      stopMedia() {
          this.sheetBuffer += '}';
      }
      startKeyframes(name) {
          this.sheetBuffer += `@keyframes ${name}{`;
      }
      stopKeyframes() {
          this.sheetBuffer += '}';
      }
      addKeyframe(increment, formattedRules) {
          this.sheetBuffer += `${increment}{${formattedRules}}`;
      }
      updateNestedSelectors() {
          // We want to replace bigger / longer keys first
          Object.keys(this.cachedKeySelectorMap).sort((a, b) => (a > b ? -1 : a < b ? 1 : 0)).forEach((classKey) => {
              const regex = new RegExp(`\\$${classKey}`, 'gm');
              this.sheetBuffer = this.sheetBuffer.replace(regex, this.cachedKeySelectorMap[classKey]);
          });
      }
      attach() {
          const stylesheet = document.createElement('style');
          stylesheet.innerHTML = this.sheetBuffer;
          document.head.appendChild(stylesheet);
      }
      cleanup() {
          this.sheetBuffer = '';
          this.cachedKeySelectorMap = {};
      }
      getStyles() { return this.sheetBuffer; }
  }

  function formatRules(sheet, flush, rules, parentSelector) {
      const ruleKeys = Object.keys(rules);
      const nestedStyleKeys = ruleKeys.filter(rk => typeof rules[rk] === 'object');
      if (parentSelector && nestedStyleKeys.length) {
          createStylesImpl(nestedStyleKeys.reduce((prev, rk) => Object.assign(prev, { [rk]: rules[rk] }), {}), flush, sheet, parentSelector);
      }
      return ruleKeys.reduce((prev, selectorOrRule) => {
          if (selectorOrRule.startsWith('&') || typeof rules[selectorOrRule] === 'object')
              return prev;
          const formattedRule = formatCssRule(selectorOrRule);
          return `${prev}${formattedRule}:${rules[selectorOrRule]};`;
      }, '');
  }
  function formatClassName(s, classKey, parentSelector, isMedia) {
      if (parentSelector) {
          if (isMedia)
              return parentSelector;
          const sParentSelector = parentSelector.split(',');
          // Handle the magic case from this issue regarding comma-separate parents: https://github.com/benduran/simplestyle/issues/8
          if (sParentSelector.length > 1)
              return sParentSelector.map(pSelector => classKey.replace(/&/g, pSelector)).join(',');
          return classKey.replace(/&/g, parentSelector);
      }
      return createClassName(s, classKey);
  }
  function createStylesImpl(styles, flush, sheetOverride = null, parentSelector = null) {
      const sheet = sheetOverride || new SimpleStylesheet();
      if (parentSelector === null)
          sheetCache.add(sheet);
      const out = Object.keys(styles).reduce((prev, classKey) => {
          let preProcessedRules = styles[classKey];
          getPreHooks().forEach((p) => {
              preProcessedRules = p(sheet, preProcessedRules, sheetCache);
          });
          const isMedia = classKey.startsWith('@media');
          const s = get();
          increment();
          const classname = formatClassName(s, classKey, parentSelector, isMedia);
          const selector = parentSelector ? isMedia ? parentSelector : classname : `.${classname}`;
          if (isMedia) {
              sheet.startMedia(classKey);
              sheet.addRule(selector, selector, formatRules(sheet, flush, preProcessedRules), false);
          }
          else
              sheet.addRule(classKey, selector, formatRules(sheet, flush, preProcessedRules), parentSelector === null);
          formatRules(sheet, flush, preProcessedRules, selector);
          if (isMedia)
              sheet.stopMedia();
          getPostHooks().forEach(p => p(sheet, preProcessedRules, classname, sheetCache));
          return Object.assign(prev, {
              [classKey]: classname,
          });
      }, {});
      sheet.updateNestedSelectors();
      if (parentSelector === null && flush) {
          sheet.attach();
          sheet.cleanup();
      }
      return out;
  }
  function createStyles(styles, flush = true) {
      return createStylesImpl(styles, flush);
  }

  var style = createStyles;

  function addUnique(array, ...elements) {
      let length;
      for (const element of elements) {
          if (array.includes(element))
              continue;
          length = array.push(element);
      }
      return length !== null && length !== void 0 ? length : array.length;
  }
  function isArray(arg) {
      return Array.isArray(arg);
  }

  function c$2(...names) {
      const classNames = [];
      let prevDroplet = null;
      const addDroplet = (replaceDroplet) => {
          const droplet = prevDroplet;
          prevDroplet = replaceDroplet !== null && replaceDroplet !== void 0 ? replaceDroplet : null;
          if (droplet == null)
              return;
          if (Array.isArray(droplet)) {
              addUnique(classNames, ...droplet);
              return;
          }
          addUnique(classNames, droplet);
      };
      for (let i = 0, l = names.length; i < l; i++) {
          const drop = names[i];
          if (drop == null)
              continue;
          switch (typeof drop) {
              case "boolean": {
                  if (prevDroplet == null)
                      continue;
                  if (drop)
                      addDroplet(null);
                  prevDroplet = null;
                  break;
              }
              case "object": {
                  if (isArray(drop)) {
                      addDroplet(drop);
                      continue;
                  }
                  for (const [name, toggled] of Object.entries(drop)) {
                      if (toggled)
                          addUnique(classNames, name);
                  }
                  prevDroplet = null;
                  break;
              }
              default: {
                  addDroplet(drop);
                  break;
              }
          }
      }
      addDroplet(null);
      return classNames.join(" ");
  }
  function s$2(map) {
      return (...drops) => {
          const reversed = [];
          for (const drop of drops) {
              if (drop == null)
                  continue;
              switch (typeof drop) {
                  case "string": {
                      reversed.push(map[drop]);
                      break;
                  }
                  case "object": {
                      if (isArray(drop)) {
                          reversed.push(drop.map((codename) => map[codename]));
                          continue;
                      }
                      const remapped = Object.create(null);
                      for (const [name, value] of Object.entries(drop)) {
                          remapped[map[name]] = value;
                      }
                      reversed.push(remapped);
                      break;
                  }
                  default: {
                      reversed.push(drop);
                      break;
                  }
              }
          }
          return c$2(...reversed);
      };
  }
  function toStyleCombiner(styles, additions) {
      return s$2(Object.assign(Object.assign({}, additions), style(styles)));
  }
  function toClassName(keyName, styles) {
      return style({ [keyName]: styles })[keyName];
  }

  const img = "data:image/svg+xml,%3csvg height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd' transform=''%3e%3cpath d='m0 0h24v24h-24z'/%3e%3cpath d='m16.304984 4.58632022c.9684135-.64559257 1.9494071-.47406533 2.7661348.34266239.7605264.76052641.9299596 1.68590662.396602 2.67640052-.0372725.06882663-.0372725.06882663-.0532706.09819906-.3295883.60514861-.3732613.81493856-.2471748 1.33367429.3091576.51207905.5132011.64336702 1.119096.76455341 1.1412747.22826881 1.7136538 1.04322411 1.7136538 2.19825151 0 1.0755468-.5345352 1.8496968-1.6121785 2.172976-.0413654.0123292-.0413654.0123292-.0663245.0197374-.024132.0071329-.024132.0071329-.0622683.01836-.6456591.1901556-.8177989.3034953-1.0961718.7616963-.1435537.5808573-.0921318.8179712.2506473 1.3321529.6455925.9684135.4740653 1.9494071-.3426624 2.7661348-.7605264.7605264-1.6859066.9299596-2.6764005.396602-.0688267-.0372725-.0688267-.0372725-.0981991-.0532706-.6051486-.3295883-.8149386-.3732613-1.3336743-.2471748-.512079.3091576-.643367.5132011-.7645534 1.119096-.2282689 1.1412747-1.0432241 1.7136538-2.1982515 1.7136538-1.0755468 0-1.8496968-.5345352-2.17297599-1.6121785-.01232925-.0413654-.01232925-.0413654-.01973743-.0663245-.00713288-.024132-.00713288-.024132-.01835997-.0622683-.1901556-.6456591-.30349534-.8177989-.76169636-1.0961718-.58085724-.1435537-.81797118-.0921318-1.3321529.2506473-.96841349.6455925-1.94940701.4740653-2.76613473-.3426624-.76052641-.7605264-.92995966-1.6859066-.39660199-2.6764005.03727249-.0688267.03727249-.0688267.05327053-.0981991.32958829-.6051486.37326129-.8149386.24717478-1.3336743-.30915753-.512079-.51320104-.643367-1.119096-.7645534-1.14127463-.2282689-1.71365373-1.0432241-1.71365373-2.1982515 0-1.0755468.53453523-1.8496968 1.61217851-2.17297599.04136533-.01232925.04136533-.01232925.06632447-.01973743.02413198-.00713288.02413198-.00713288.06226834-.01835997.64565905-.1901556.81779888-.30349534 1.09617181-.76169636.14355365-.58085724.09213178-.81797118-.25064732-1.3321529-.64559257-.96841349-.47406533-1.94940701.34266239-2.76613473.76052641-.76052641 1.68590662-.92995966 2.67640052-.39660199.06882663.03727249.06882663.03727249.09819906.05327053.60514861.32958829.81493856.37326129 1.33367429.24717478.51207905-.30915753.64336702-.51320104.76455341-1.119096.22826881-1.14127463 1.04322411-1.71365373 2.19825151-1.71365373 1.0755468 0 1.8496968.53453523 2.172976 1.61217851.0123292.04136533.0123292.04136533.0197374.06632447.0071329.02413198.0071329.02413198.01836.06226834.1901556.64565905.3034953.81779888.7616963 1.09617181.5808573.14355365.8179712.09213178 1.3321529-.25064732zm-4.738133-.51961232c-.2234405 1.11713438-.6613662 1.75435676-1.66435405 2.34583077-.114153.0673174-.23728591.11808567-.36571216.15078482-1.03148075.26262967-1.69145629.14913291-2.69416239-.39698119-.02911635-.01585825-.02911635-.01585825-.04516828-.02457839-.01674857-.00907488-.01674857-.00907488-.04598477-.02487519-.26622097-.1433536-.33389801-.13096222-.54969453.0848343-.24552655.24552655-.25352009.29124297-.11775235.49489976.63195569.94795764.77286747 1.70821671.48185254 2.83572298-.03306498.12810675-.08412242.25087974-.15164864.36465515-.54385396.91634339-1.08403254 1.30025549-2.16504871 1.61862979-.03789262.0111556-.03789262.0111556-.05919751.0174529-.02255223.0066934-.02255223.0066934-.06124991.0182249-.28961296.0868804-.32870583.1434973-.32870583.4486797 0 .3472269.02667411.3852056.26668349.4332104 1.11713438.2234405 1.75435676.6613661 2.34583077 1.664354.0673174.114153.11808567.2372859.15078482.3657122.26262967 1.0314808.14913291 1.6914563-.39698119 2.6941624-.01585825.0291163-.01585825.0291163-.02457839.0451683-.00907488.0167485-.00907488.0167485-.02487519.0459847-.1433536.266221-.13096222.3338981.0848343.5496946.24552655.2455265.29124297.2535201.49489976.1177523.94795764-.6319557 1.70821671-.7728674 2.83572298-.4818525.12810675.033065.25087974.0841224.36465515.1516486.91634339.543854 1.30025549 1.0840326 1.61862979 2.1650487.0111556.0378927.0111556.0378927.0174529.0591975.0066934.0225523.0066934.0225523.0182249.06125.0868804.2896129.1434973.3287058.4486797.3287058.3472269 0 .3852056-.0266741.4332104-.2666835.2234405-1.1171344.6613661-1.7543568 1.664354-2.3458308.114153-.0673174.2372859-.1180856.3657122-.1507848 1.0314808-.2626297 1.6914563-.1491329 2.6941624.3969812.0291163.0158582.0291163.0158582.0451683.0245784.0167485.0090749.0167485.0090749.0459847.0248752.266221.1433536.3338981.1309622.5496946-.0848343.2455265-.2455266.2535201-.291243.1177523-.4948998-.6319557-.9479576-.7728674-1.7082167-.4818525-2.835723.033065-.1281067.0841224-.2508797.1516486-.3646551.543854-.9163434 1.0840326-1.3002555 2.1650487-1.6186298.0378927-.0111556.0378927-.0111556.0591975-.0174529.0225523-.0066934.0225523-.0066934.06125-.0182249.2896129-.0868804.3287058-.1434973.3287058-.4486797 0-.3472269-.0266741-.3852056-.2666835-.4332104-1.1171344-.2234405-1.7543568-.6613662-2.3458308-1.66435405-.0673174-.114153-.1180856-.23728591-.1507848-.36571216-.2626297-1.03148075-.1491329-1.69145629.3969812-2.69416239.0158582-.02911635.0158582-.02911635.0245784-.04516828.0090749-.01674857.0090749-.01674857.0248752-.04598477.1433536-.26622097.1309622-.33389801-.0848343-.54969453-.2455266-.24552655-.291243-.25352009-.4948998-.11775235-.9479576.63195569-1.7082167.77286747-2.835723.48185254-.1281067-.03306498-.2508797-.08412242-.3646551-.15164864-.9163434-.54385396-1.3002555-1.08403254-1.6186298-2.16504871-.0111556-.03789262-.0111556-.03789262-.0174529-.05919751-.0066934-.02255223-.0066934-.02255223-.0182249-.06124991-.0868804-.28961296-.1434973-.32870583-.4486797-.32870583-.3472269 0-.3852056.02667411-.4332104.26668349zm.4331986 4.03334169c2.1539105 0 3.9 1.74608948 3.9 3.90000001 0 2.1539105-1.7460895 3.9-3.9 3.9-2.15391053 0-3.90000001-1.7460895-3.90000001-3.9 0-2.15391053 1.74608948-3.90000001 3.90000001-3.90000001zm0 1.8c-1.159798 0-2.10000001.94020201-2.10000001 2.10000001s.94020201 2.1 2.10000001 2.1 2.1-.940202 2.1-2.1-.940202-2.10000001-2.1-2.10000001z' fill='%23828a99' fill-rule='nonzero' transform='matrix(-1 0 0 -1 24.00005 24.00005)'/%3e%3c/g%3e%3c/svg%3e";

  var gearIcon = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': img
  });

  const img$1 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cdefs%3e%3crect id='a' width='15' height='15' rx='3'/%3e%3c/defs%3e%3cg fill='none' fill-rule='evenodd'%3e%3cuse fill='white' xlink:href='%23a'/%3e%3crect width='14' height='14' x='.5' y='.5' stroke='%23C1C9D1' rx='3'/%3e%3c/g%3e%3c/svg%3e";

  var checkbox = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': img$1
  });

  const img$2 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15'%3e%3cg fill='none' fill-rule='evenodd'%3e%3crect width='15' height='15' fill='%235181B8' rx='3'/%3e%3cpath stroke='white' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round' d='M4 7.5L6.5 10 11 4.5'/%3e%3c/g%3e%3c/svg%3e";

  var checkboxChecked = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': img$2
  });

  function makeAssetObject({ default: dataURL }) {
      return {
          get dataURL() {
              return dataURL;
          },
          get url() {
              return `url("${dataURL.replace(/"/g, "'")}")`;
          },
      };
  }
  const GearIcon = makeAssetObject(gearIcon);
  const Checkbox = makeAssetObject(checkbox);
  const CheckboxChecked = makeAssetObject(checkboxChecked);

  function elem(selectors, scope) {
      return (scope !== null && scope !== void 0 ? scope : getWindow().document).querySelector(selectors);
  }
  function elems(selectors, scope) {
      return (scope !== null && scope !== void 0 ? scope : getWindow().document).querySelectorAll(selectors);
  }
  function insertBefore(referenceNode, newNode) {
      const { parentNode } = referenceNode;
      if (parentNode == null)
          throw new Error(ERROR_MESSAGES.NO_PARENT_NODE);
      parentNode.insertBefore(newNode, referenceNode);
  }
  function asArray(nodeList) {
      return Array.prototype.slice.call(nodeList);
  }
  function unwrapCSSValue(value) {
      var _a, _b;
      return (_b = (_a = /^"(.+)"$|^'(.+)'$/.exec(value)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : value;
  }
  const domParser = new DOMParser();
  function decodeDOMString(input) {
      const { documentElement } = domParser.parseFromString(input, "text/html");
      return documentElement.textContent;
  }
  function childrenOf(element) {
      return element == null
          ? null
          : asArray(element.childNodes);
  }
  const OBSERVATIONS = new WeakMap();
  const OBSERVE_OPTIONS_ATTRIBUTES = (Object.freeze({
      subtree: false,
      childList: false,
      attributes: true,
  }));
  const BEFORE_OBSERVER_DESTROY = 1000;
  const CURRENT_DESTROY_TIMERS = new WeakMap();
  function observe(element, options = OBSERVE_OPTIONS_ATTRIBUTES) {
      let observation = OBSERVATIONS.get(element);
      if (observation == null) {
          const callbacks = new Set();
          const observer = new MutationObserver((mutations) => {
              log("log", element, "mutated, calling callbacks", callbacks);
              for (const callback of callbacks) {
                  try {
                      callback(mutations);
                  }
                  catch (err) {
                      log("warn", "Observer callback failure:", err);
                  }
              }
          });
          const destroy = () => {
              observer.disconnect();
              OBSERVATIONS.delete(element);
              log("info", "Observer destroyed", { element });
          };
          const clearDestroy = () => {
              const destroyTimer = CURRENT_DESTROY_TIMERS.get(observer);
              if (destroyTimer == null)
                  return;
              clearTimeout(destroyTimer);
          };
          const scheduleDestroy = () => {
              const destroyTimer = setTimeout(destroy, BEFORE_OBSERVER_DESTROY);
              CURRENT_DESTROY_TIMERS.set(observer, destroyTimer);
          };
          observation = Object.freeze({
              addCallback: (callback) => {
                  callbacks.add(callback);
                  clearDestroy();
              },
              removeCallback: (callback) => {
                  callbacks.delete(callback);
                  if (callbacks.size !== 0)
                      return;
                  scheduleDestroy();
              },
          });
          observer.observe(element, options);
          OBSERVATIONS.set(element, observation);
      }
      return observation;
  }

  const BoxContext = L(null);

  const TargetContext = L(undefined);

  const TranslationContext = L(getNavigatorTranslations());

  function useTarget() {
      return T$1(TargetContext);
  }
  function useBoxDetail() {
      return T$1(BoxContext);
  }
  function useBoxContexts() {
      const detail = useBoxDetail();
      const target = useTarget();
      return [detail, target];
  }
  function useTranslations() {
      return T$1(TranslationContext);
  }
  function useTranslation(tree) {
      const translation = useTranslations();
      return translation[tree];
  }
  function useForceUpdate() {
      const [, setTick] = v$1(0);
      return h$1(() => {
          setTick((tick) => tick + 1);
      }, []);
  }
  function usePreventedCallback(callback) {
      return h$1((event) => {
          event.preventDefault();
          callback === null || callback === void 0 ? void 0 : callback(event);
          return false;
      }, [callback]);
  }

  function findWithCallback(elements, handlerName, search) {
      for (const element of elements) {
          const handler = element[handlerName];
          if (typeof handler !== "function")
              continue;
          if (!handler.toString().includes(search))
              continue;
          return element;
      }
      return null;
  }
  function createTogglerHook(toggleElement, readValue, toggle) {
      let isToggling = false;
      let lastReading = readValue();
      let forceUpdate = null;
      let currentCallback = null;
      let state = null;
      const disconnect = () => {
          if (currentCallback == null)
              return;
          observe(toggleElement).removeCallback(currentCallback);
      };
      let $toggle;
      const updateState = () => {
          state = {
              isAvailable: "yes",
              isToggling,
              isToggled: lastReading,
              toggle: $toggle,
              disconnect,
          };
          return state;
      };
      $toggle = () => {
          isToggling = true;
          updateState();
          forceUpdate === null || forceUpdate === void 0 ? void 0 : forceUpdate();
          toggle();
      };
      const ensureBinding = () => {
          if (currentCallback != null)
              return;
          currentCallback = () => {
              const currentReading = readValue();
              if (lastReading === currentReading)
                  return;
              lastReading = currentReading;
              isToggling = false;
              updateState();
              forceUpdate === null || forceUpdate === void 0 ? void 0 : forceUpdate();
          };
          observe(toggleElement).addCallback(currentCallback);
      };
      return () => {
          forceUpdate = useForceUpdate();
          ensureBinding();
          return state !== null && state !== void 0 ? state : updateState();
      };
  }
  function createDummyTogglerHook() {
      const state = {
          isAvailable: "no",
          disconnect() { },
      };
      return () => state;
  }

  function isFollowing(treating) {
      switch (treating.kind) {
          case "friend_row":
          case "group_row": {
              return true;
          }
          default: return null;
      }
  }
  const GROUP_ID = /gl_groups(\d+)/;
  const FRIEND_ID = /friends_user_row(\d+)/;
  function getID(treating) {
      var _a;
      const { element, kind } = treating;
      switch (kind) {
          case "friend_row":
          case "group_row": {
              const regexp = kind === "group_row"
                  ? GROUP_ID
                  : FRIEND_ID;
              const id = (_a = regexp.exec(element.id)) === null || _a === void 0 ? void 0 : _a[1];
              if (id == null)
                  return null;
              return kind === "group_row" ? -+id : +id;
          }
          case "bookmark": {
              const { id } = element.dataset;
              return id != null ? +id : null;
          }
          default: return null;
      }
  }
  function getLink(treating) {
      var _a, _b, _c, _d;
      const { element } = treating;
      switch (treating.kind) {
          case "group_row": {
              const link = elem("a.group_row_title", element);
              return (_b = (_a = link) === null || _a === void 0 ? void 0 : _a.href) !== null && _b !== void 0 ? _b : null;
          }
          case "friend_row": {
              const link = elem(".friends_field.friends_field_title > a", element);
              return (_c = link === null || link === void 0 ? void 0 : link.href) !== null && _c !== void 0 ? _c : null;
          }
          case "bookmark": {
              const link = elem(".bookmark_page_item__name > a", element);
              return (_d = link === null || link === void 0 ? void 0 : link.href) !== null && _d !== void 0 ? _d : null;
          }
          default: return null;
      }
  }
  function getIcon(treating) {
      var _a, _b;
      const { element, kind } = treating;
      switch (kind) {
          case "friend_row":
          case "group_row": {
              const icon = elem(kind === "group_row"
                  ? ".group_row_img"
                  : ".friends_photo_img", element);
              return (_a = icon === null || icon === void 0 ? void 0 : icon.src) !== null && _a !== void 0 ? _a : null;
          }
          case "bookmark": {
              const icon = elem(".bookmark_page_item__image", element);
              const url = (_b = icon === null || icon === void 0 ? void 0 : icon.style.backgroundImage) === null || _b === void 0 ? void 0 : _b.slice("url(".length, -")".length);
              return url != null ? unwrapCSSValue(url) : null;
          }
          default: return null;
      }
  }
  function getName(treating) {
      var _a, _b, _c;
      const { element } = treating;
      switch (treating.kind) {
          case "group_row": {
              const title = elem("a.group_row_title", element);
              return (_a = title === null || title === void 0 ? void 0 : title.textContent) !== null && _a !== void 0 ? _a : null;
          }
          case "friend_row": {
              const link = elem(".friends_field_title", element);
              return (_b = link === null || link === void 0 ? void 0 : link.textContent) !== null && _b !== void 0 ? _b : null;
          }
          case "bookmark": {
              const link = elem(".bookmark_page_item__name > a", element);
              return (_c = link === null || link === void 0 ? void 0 : link.textContent) !== null && _c !== void 0 ? _c : null;
          }
          default: return null;
      }
  }
  function getType(treating) {
      var _a;
      return (_a = treating.subType) !== null && _a !== void 0 ? _a : null;
  }
  const TOGGLER_HOOKS = new WeakMap();
  function getNotificationsToggler(treating) {
      const { element, kind } = treating;
      let hook = TOGGLER_HOOKS.get(element);
      if (hook !== undefined)
          return hook;
      switch (kind) {
          case "group_row":
              {
                  const children = childrenOf(elem(".ui_actions_menu", element));
                  if (children == null)
                      break;
                  const menuItem = findWithCallback(children, "onclick", "GroupsList.toggleSubscription");
                  if (menuItem != null) {
                      hook = createTogglerHook(menuItem, () => menuItem.dataset.value === "1", () => menuItem.click());
                  }
              }
              break;
      }
      hook = hook !== null && hook !== void 0 ? hook : null;
      TOGGLER_HOOKS.set(element, hook);
      return hook;
  }

  function getContext() {
      return getWindow().cur;
  }

  function isFollowing$1() {
      const statusElement = elem("#friend_status");
      if (statusElement != null) {
          const addFrindButton = elem(".profile_action_btn", statusElement);
          if (addFrindButton != null)
              return false;
          const dropDownLabel = elem(".page_actions_dd_label", statusElement);
          if (dropDownLabel != null)
              return true;
      }
      return null;
  }
  function isPrivate() {
      return elem(".profile_closed_wall_dummy") != null;
  }
  function getLink$1() {
      const ctx = getContext();
      const { loc, user_id } = ctx.options;
      if (loc != null)
          return `/${loc}`;
      return `/id${user_id}`;
  }
  function isOwn() {
      const topProfileLink = elem(".top_profile_link");
      if (topProfileLink == null)
          return null;
      return getLink$1() === topProfileLink.getAttribute("href");
  }
  function getIcon$1() {
      const postImg = elem(".post.own img.post_img");
      if (postImg != null)
          return postImg.src;
      const pageAvatarImg = elem("img.page_avatar_img");
      if (pageAvatarImg != null)
          return pageAvatarImg.src;
      return null;
  }
  function getName$1() {
      return decodeDOMString(getContext().options.back);
  }
  const NOTIFICATIONS_TOGGLERS = new WeakMap();
  function getNotificationsToggler$1() {
      const context = getContext();
      let toggler = NOTIFICATIONS_TOGGLERS.get(context);
      if (toggler !== undefined)
          return null;
      const pageActions = childrenOf(elem(".page_actions_inner"));
      if (pageActions != null) {
          const action = findWithCallback(pageActions, "onclick", "Page.toggleSubscription");
          if (action != null) {
              toggler = createTogglerHook(action, () => action.dataset.act === "0", () => action.click());
          }
      }
      toggler = toggler !== null && toggler !== void 0 ? toggler : null;
      NOTIFICATIONS_TOGGLERS.set(context, toggler);
      return toggler;
  }

  function isFollowing$2() {
      const { module } = getContext();
      switch (module) {
          case "public": {
              return getContext().options.liked;
          }
          case "groups": {
              return elem(".page_actions_btn") != null;
          }
          default: return null;
      }
  }
  function isPrivate$1() {
      return elem(".group_closed") != null;
  }
  function getLink$2() {
      const { module } = getContext();
      switch (module) {
          case "public": {
              return getContext().options.public_link;
          }
          case "groups": {
              const { options: { loc, group_id } } = getContext();
              if (loc != null)
                  return `/${loc}`;
              return `/club${group_id}`;
          }
          default: return null;
      }
  }
  function getIcon$2() {
      const coverAvatar = elem(".page_cover_image img.post_img");
      if (coverAvatar != null)
          return coverAvatar.src;
      const postAvatar = elem(".post.own img.post_img");
      if (postAvatar != null)
          return postAvatar.src;
      const pageAvatar = elem(".page_avatar img.page_avatar_img");
      if (pageAvatar != null)
          return pageAvatar.src;
      return null;
  }
  function getName$2() {
      var _a, _b;
      return (_b = (_a = elem("h1.page_name")) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : null;
  }
  const NOTIFICATIONS_TOGGLERS$1 = new WeakMap();
  function getNotificationsToggler$2() {
      const context = getContext();
      let toggler = NOTIFICATIONS_TOGGLERS$1.get(context);
      if (toggler !== undefined)
          return null;
      const pageActions = childrenOf(elem(".page_actions_expanded"));
      if (pageActions != null) {
          const action = findWithCallback(pageActions, "onclick", "Page.onSubscriptionItemOnClick");
          if (action != null) {
              toggler = createTogglerHook(action, () => action.classList.contains("on"), () => action.click());
          }
      }
      toggler = toggler !== null && toggler !== void 0 ? toggler : null;
      NOTIFICATIONS_TOGGLERS$1.set(context, toggler);
      return toggler;
  }

  function getLink$3(altTreating) {
      if (altTreating != null)
          return getLink(altTreating);
      if (getContext().module === "profile") {
          return getLink$1();
      }
      return getLink$2();
  }
  function getIcon$3(altTreating) {
      if (altTreating != null)
          return getIcon(altTreating);
      if (getContext().module === "profile") {
          return getIcon$1();
      }
      return getIcon$2();
  }
  function getName$3(altTreating) {
      if (altTreating != null)
          return getName(altTreating);
      if (getContext().module === "profile") {
          return getName$1();
      }
      return getName$2();
  }
  function isFollowing$3(altTreating) {
      if (altTreating != null)
          return isFollowing(altTreating);
      if (getContext().module === "profile") {
          return isFollowing$1();
      }
      return isFollowing$2();
  }
  function isPrivate$2(altTreating) {
      if (altTreating != null)
          return false;
      const { module } = getContext();
      switch (module) {
          case "public": {
              return true;
          }
          case "profile": {
              return isPrivate();
          }
          default: {
              return isPrivate$1();
          }
      }
  }
  function getID$1(altTreating) {
      if (altTreating != null)
          return getID(altTreating);
      return getContext().oid;
  }
  function isOwn$1(altTreating) {
      if (altTreating != null)
          return null;
      switch (getContext().module) {
          case "profile": return isOwn();
          default: return null;
      }
  }
  function getType$1(altTreating) {
      if (altTreating != null)
          return getType(altTreating);
      const { module } = getContext();
      switch (module) {
          case "profile":
          case "groups":
          case "public": {
              return module;
          }
          default: return null;
      }
  }
  function getNotificationsToggler$3(altTreating) {
      if (altTreating != null) {
          return getNotificationsToggler(altTreating);
      }
      switch (getContext().module) {
          case "public":
          case "groups": {
              return getNotificationsToggler$2();
          }
          case "profile": {
              return getNotificationsToggler$1();
          }
          default: return null;
      }
  }
  function getFullContext(altTreating) {
      var _a;
      const useNotifications = (_a = getNotificationsToggler$3(altTreating)) !== null && _a !== void 0 ? _a : createDummyTogglerHook();
      return {
          type: getType$1(altTreating),
          id: getID$1(altTreating),
          name: getName$3(altTreating),
          icon: getIcon$3(altTreating),
          link: getLink$3(altTreating),
          isPrivate: isPrivate$2(altTreating),
          isFollowed: isFollowing$3(altTreating),
          isOwn: isOwn$1(altTreating),
          useNotifications,
      };
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  const { eval: EVAL } = getWindow();
  function genericOptions(resolve, reject) {
      return {
          onDone(_html, js) {
              EVAL(js);
              resolve();
          },
          onFail() {
              reject();
          },
          cache: false,
      };
  }
  function initializeLists(contextId) {
      return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
              getWindow().ajax.post("al_feed.php", {
                  act: "a_get_lists_by_item",
                  item_id: contextId,
              }, genericOptions(resolve, reject));
          });
      });
  }
  function toggleLists(contextId, toggles, hash) {
      return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
              getWindow().ajax.post("al_feed.php", {
                  act: "a_toggle_lists",
                  item_id: contextId,
                  lists_ids: toggles.join(","),
                  hash,
              }, genericOptions(resolve, reject));
          });
      });
  }
  function saveLists(contextId, states, hash) {
      var _a;
      return __awaiter(this, void 0, void 0, function* () {
          const toggles = [];
          const postCommit = [];
          for (const [listId, state] of states.entries()) {
              toggles.push(Number(listId) * state);
              postCommit.push([listId, state]);
          }
          yield toggleLists(contextId, toggles, hash);
          const ctx = getWindow().cur;
          if (ctx == null)
              return;
          const set = (_a = ctx.options) === null || _a === void 0 ? void 0 : _a.feedListsSet;
          if (set == null)
              return;
          for (const [listId, state] of postCommit) {
              set[Number(listId)] = state === 1 ? 1 : 0;
          }
      });
  }
  function mapLists(options, states) {
      const { feedLists, feedListsSet } = options;
      const lists = [];
      for (const id of Object.keys(feedListsSet)) {
          const name = feedLists[id];
          lists.push({
              name,
              id: +id,
              isSelected() {
                  const state = states.get(id);
                  return state == null
                      ? feedListsSet[id] === 1
                      : state === 1;
              },
              toggle(isUsed) {
                  const state = isUsed
                      ? 1
                      : -1;
                  states.set(id, state);
              },
          });
      }
      return lists;
  }
  function ensureOptions(options) {
      return (options != null
          && options.feedLists != null
          && options.feedListsSet != null
          && options.feedListsHash != null
          && options.feedListsChanges != null);
  }
  const LISTS_ID_MAPS = new WeakMap();
  const CACHES = new WeakMap();
  function getCurrentContext() {
      return getWindow().cur;
  }
  function pullFromCache(contextId) {
      var _a, _b;
      const currentContext = getCurrentContext();
      if (currentContext == null)
          return null;
      return (_b = (_a = CACHES.get(currentContext)) === null || _a === void 0 ? void 0 : _a.get(contextId)) !== null && _b !== void 0 ? _b : null;
  }
  function pushToCache(contextId, lists) {
      const currentContext = getCurrentContext();
      if (currentContext == null)
          return;
      let caches = CACHES.get(currentContext);
      if (caches == null) {
          caches = new Map();
          CACHES.set(currentContext, caches);
      }
      caches.set(contextId, lists);
  }
  function getLists(contextId, force = false, useCache = true) {
      return __awaiter(this, void 0, void 0, function* () {
          const ctx = getWindow().cur;
          if (ctx == null) {
              throw new Error(ERROR_MESSAGES.NO_OR_INVALID_CONTEXT);
          }
          let { options } = ctx;
          const associatedId = options != null
              ? LISTS_ID_MAPS.get(options)
              : null;
          if (associatedId != null && contextId !== associatedId)
              force = true;
          if (useCache) {
              const cachedLists = pullFromCache(contextId);
              if (cachedLists != null)
                  return cachedLists;
          }
          if (force || !ensureOptions(options))
              yield initializeLists(contextId);
          if (options == null)
              options = ctx.options;
          if (options == null || !ensureOptions(options)) {
              throw new Error(ERROR_MESSAGES.NO_OR_INVALID_CONTEXT);
          }
          const states = new Map();
          const lists = {
              lists: mapLists(options, states),
              resetChanges() {
                  states.clear();
              },
              commitChanges() {
                  return __awaiter(this, void 0, void 0, function* () {
                      yield saveLists(contextId, states, options.feedListsHash);
                      states.clear();
                  });
              },
          };
          pushToCache(contextId, lists);
          return lists;
      });
  }

  const CENTERED_CLASS = toClassName("centeredClass", {
      width: "max-content",
      margin: "0 auto",
  });
  const NUMBER_OF_SPACES_AND_TOTALLY_NOT_A_MAGIC_NUMBER = 2;
  const SIZE_CLASSES = new Map();
  function dotsSize(dotSize) {
      let className = SIZE_CLASSES.get(dotSize);
      if (className != null)
          return className;
      const spaceSize = dotSize / NUMBER_OF_SPACES_AND_TOTALLY_NOT_A_MAGIC_NUMBER;
      className = toClassName(`dotSize${dotSize}`, {
          "& .pr .pr_bt": {
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              marginRight: `${spaceSize}px`,
              "&:first": {
                  marginLeft: `${spaceSize}px`,
              },
          },
      });
      SIZE_CLASSES.set(dotSize, className);
      return className;
  }
  function ProgressIndicator(props) {
      const { centered, className, style } = props;
      const progressHolder = y$1();
      const [isMounted, setMounted] = v$1(false);
      p$1(() => {
          const holder = progressHolder.current;
          if (holder == null || isMounted)
              return;
          getWindow().showProgress(holder);
          setMounted(true);
      }, [progressHolder, isMounted]);
      return (v("div", { ref: progressHolder, className: c$2(className, CENTERED_CLASS, centered !== null && centered !== void 0 ? centered : false), style: style }));
  }

  function ErrorBlock(props) {
      const className = c$2("error", props.className);
      return (v("div", Object.assign({}, props, { className: className })));
  }

  const STYLE = toStyleCombiner({
      noMargin: {
          margin: "0",
      },
  }, {
      separator: "top_profile_sep",
  });
  function Separator({ noMargin }) {
      return (v("div", { className: STYLE("separator", "noMargin", noMargin !== null && noMargin !== void 0 ? noMargin : false) }));
  }

  const ITEM_HIGHLIGHT = toClassName("olistHighlight", {
      backgroundColor: "#e1e5eb",
  });
  const TOOLTIP_HIDE_TIME = 5000;
  function createList(context, translation) {
      const { id, icon, name, link } = context;
      if (id == null || icon == null || name == null || link == null) {
          log("warn", "[createList] Not sufficient data", {
              id, icon, name, link,
          });
          return false;
      }
      const window = getWindow();
      if (window.nav == null) {
          log("warn", "[createList] No nav fuction was found in window");
          return false;
      }
      const $OList = window.OList;
      const target = { id, icon, name, link };
      const { listCreation: { highlightTooltip } } = translation;
      const tooltipText = highlightTooltip.replace("{}", name);
      class FakeOList extends $OList {
          constructor(...args) {
              const [, list, selected] = args;
              window.OList = $OList;
              const targetIndex = list.findIndex((listItem) => listItem[0] === target.id);
              if (targetIndex === -1) {
                  list.splice(0, 0, [
                      target.id,
                      target.name,
                      target.icon,
                      target.link,
                      0,
                  ]);
              }
              selected[target.id] = 1;
              super(...args);
              const itemElem = elem(`#olist_item_wrap${target.id}`);
              if (itemElem == null)
                  return;
              itemElem.classList.add(ITEM_HIGHLIGHT);
              itemElem.scrollIntoView({ block: "center" });
              const avatarElem = elem(".olist_item_photo_wrap", itemElem);
              if (avatarElem == null)
                  return;
              getWindow().showTitle(avatarElem, tooltipText, undefined, {
                  init(tooltip) {
                      setTimeout(() => tooltip.hide(), TOOLTIP_HIDE_TIME);
                  },
              });
          }
      }
      window.nav.go("feed", null, {
          onDone() {
              var _a;
              window.OList = FakeOList;
              (_a = window.feed) === null || _a === void 0 ? void 0 : _a.editList(-1);
          },
      });
      return true;
  }

  const SHARED_STYLES = Object.freeze(style({
      clearfix: {
          "&::before, &::after": {
              content: "''",
              display: "table",
              clear: "both",
          },
      },
      disabled: {
          opacity: ".6",
      },
      pointerLocked: {
          pointerEvents: "none",
      },
      defaultMargin: {
          margin: "10px 0",
      },
      errorMultiline: {
          lineHeight: "unset",
          paddingTop: "10px",
      },
      marginReset: {
          margin: "0",
      },
  }));
  const CLEARFIX = SHARED_STYLES.clearfix;
  const DEFAULT_MARGIN = SHARED_STYLES.defaultMargin;
  const POINTER_LOCKED = SHARED_STYLES.pointerLocked;
  const DISABLED = SHARED_STYLES.disabled;
  const LOCK_COMBO = c$2(DISABLED, POINTER_LOCKED);
  const ERROR_MULTILINE = SHARED_STYLES.errorMultiline;
  const MARGIN_RESET = SHARED_STYLES.marginReset;
  const ERROR_FIXES = c$2(MARGIN_RESET, ERROR_MULTILINE);

  const LISTS_LOADED = "LISTS_LOADED";
  function listsLoaded(lists) {
      return {
          type: LISTS_LOADED,
          lists,
      };
  }
  const LOAD_FAILED = "LOAD_FAILED";
  function loadFailure() {
      return { type: LOAD_FAILED };
  }
  const INVOKER_CHANGE = "INVOKER_CHANGE";
  function targetChange(target, invoker) {
      return {
          type: INVOKER_CHANGE,
          invoker,
          target,
      };
  }

  function listsReducer(state, action) {
      var _a;
      switch (action.type) {
          case LISTS_LOADED: {
              return Object.assign(Object.assign({}, state), { loadingStatus: "loaded", lists: (_a = action.lists) !== null && _a !== void 0 ? _a : undefined });
          }
          case LOAD_FAILED: {
              return Object.assign(Object.assign({}, state), { loadingStatus: "failed" });
          }
          case INVOKER_CHANGE: {
              const { invoker, target } = action;
              const { lastInvoker, lastTarget } = state;
              const noChanges = invoker === lastInvoker
                  && target === lastTarget;
              if (noChanges)
                  return state;
              return Object.assign(Object.assign({}, state), { loadingStatus: "reset", lastInvoker: invoker, lastTarget: target, lists: undefined });
          }
          default: return Object.assign({}, state);
      }
  }
  const DEFAULT_STATE = Object.freeze({
      loadingStatus: "initial",
  });
  function useLoaderReducer() {
      return m$1(listsReducer, DEFAULT_STATE);
  }

  const S = toStyleCombiner({
      label: { cursor: "pointer" },
      row: {
          marginBottom: "10px",
          lineHeight: "15px",
          width: "max-content",
          cursor: "pointer",
          transition: ".25s ease",
          "& input[type=checkbox]+label::before": {
              display: "block",
              content: "''",
              float: "left",
              background: `${Checkbox.url} no-repeat 0`,
              margin: "0 7px 0 0",
              width: "15px",
              height: "15px",
              transition: ".1s background ease-in, .1s filter ease",
          },
          "& input[type=checkbox]:disabled+label": {
              "&, &::before": {
                  cursor: "default",
                  opacity: "0.5",
                  filter: "alpha(opacity=50)",
              },
          },
          "& input[type=checkbox]:checked+label:before": {
              backgroundImage: CheckboxChecked.url,
          },
          ["&:hover label:before,"
              + "& input[type=checkbox]+label:hover:before"]: {
              filter: "brightness(95%)",
          },
          ["&:active label:before,"
              + "& input[type=checkbox]+label:active:before"]: {
              filter: "brightness(90%)",
          },
      },
  }, {
      locked: LOCK_COMBO,
  });
  function generateID() {
      return `ch${Date.now()}`;
  }
  function CheckboxRow(props) {
      var _a, _b;
      const { text, onChange } = props;
      const isChecked = (_a = props.checked) !== null && _a !== void 0 ? _a : false;
      const isDisabled = (_b = props.disabled) !== null && _b !== void 0 ? _b : false;
      const [id, setID] = v$1(props.id);
      p$1(() => {
          if (id != null)
              return;
          setID(generateID());
      }, [id]);
      const onClick = () => {
          if (isDisabled)
              return;
          const newValue = !isChecked;
          onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
      };
      const onLabelClick = h$1((e) => e.preventDefault(), []);
      return (v("div", { onClick: onClick, className: S("row", "locked", isDisabled) },
          v("input", { id: id, className: "blind_label", type: "checkbox", checked: isChecked, disabled: isDisabled }),
          v("label", { htmlFor: id, className: S("label"), onClick: onLabelClick, children: text })));
  }

  function ListRow({ list, disabled }) {
      const listSelected = list.isSelected();
      const update = useForceUpdate();
      const onChange = h$1((newValue) => {
          list.toggle(newValue);
          update();
      }, [list, update]);
      return (v(CheckboxRow, { checked: listSelected, text: list.name, onChange: onChange, disabled: disabled }));
  }

  const GRAY_NOTICE = toClassName("grayNotice", { color: "#656565" });
  function ListsRender({ lists, disabled }) {
      const { empty } = useTranslation("lists");
      if (lists.length === 0) {
          return v("div", { className: GRAY_NOTICE }, empty);
      }
      const rows = lists.map((_) => v(ListRow, { list: _, disabled: disabled }));
      return v("div", null, rows);
  }

  const PLUS_ICON = "/images/icons/filter_add.png";
  const STYLE$1 = toStyleCombiner({
      button: {
          marginTop: "10px",
          width: "max-content",
          lineHeight: "19px",
          cursor: "pointer",
          display: "block",
          "&::before": {
              content: "''",
              background: `url("${PLUS_ICON}") 1px 3px no-repeat`,
              width: "15px",
              height: "15px",
              float: "left",
              margin: "0 7px 0 0",
          },
      },
  }, {
      locked: LOCK_COMBO,
  });
  const TOOLTIP_OFFSETS = [-10, 8];
  function AddListButton(_a) {
      var _b;
      var { onClick } = _a, props = __rest(_a, ["onClick"]);
      const button = y$1();
      const disabled = (_b = props.disabled) !== null && _b !== void 0 ? _b : false;
      const onLinkClick = usePreventedCallback(disabled ? null : onClick);
      const { addListButton: translation } = T$1(TranslationContext);
      const showTooltip = h$1(() => {
          if (button.current == null)
              return;
          getWindow().showTitle(button.current, translation.tooltip, TOOLTIP_OFFSETS, { center: true });
      }, [translation.tooltip]);
      return (v("a", { onClick: onLinkClick, onMouseOver: showTooltip, ref: button, className: STYLE$1("button", "locked", disabled), children: translation.text }));
  }

  function ActionLabel() {
      const detail = useBoxDetail();
      const translation = useTranslation("actionLabel");
      if (detail == null)
          return null;
      const byContext = (context) => {
          const value = translation.context[context];
          return translation.template.replace("{}", value);
      };
      const { invoker, context } = detail;
      const reference = invoker != null
          ? invoker.subType
          : context.module;
      const text = byContext((() => {
          switch (reference) {
              case "groups": return "group";
              case "profile": return "profile";
              case "public": return "public";
              default: {
                  switch (invoker === null || invoker === void 0 ? void 0 : invoker.kind) {
                      case "bookmark": return "bookmark";
                  }
                  return "other";
              }
          }
      })());
      if (text == null)
          return null;
      return v("div", { className: DEFAULT_MARGIN }, text);
  }

  const PROGRESS_INDICATOR_SIZE = 6;
  function ListLoader({ disabled }) {
      const [$detail, target] = useBoxContexts();
      const detail = $detail;
      const translation = useTranslations();
      const [state, dispatch] = useLoaderReducer();
      const { invoker } = detail;
      p$1(() => {
          dispatch(targetChange(target, invoker));
      }, [dispatch, target, invoker]);
      p$1(() => {
          const { loadingStatus, lastTarget: target } = state;
          if (loadingStatus !== "reset")
              return;
          if (target == null || target.id == null) {
              dispatch(loadFailure());
              return;
          }
          getLists(target.id, true)
              .then((lists) => {
              dispatch(listsLoaded(lists));
              detail.onListsLoad(lists);
          })
              .catch((_err) => {
              var _a;
              dispatch(loadFailure());
              (_a = detail.onListsLoadFail) === null || _a === void 0 ? void 0 : _a.call(detail);
          });
      }, [dispatch, detail, state]);
      const onAddList = h$1(() => {
          if (target == null)
              return;
          const result = createList(target, translation);
          if (result)
              return;
          detail.displayLabel(getWindow().lang.global_error_occured, "red");
      }, [target, detail, translation]);
      if (target == null)
          return null;
      const { loadingStatus, lists } = state;
      if (lists == null) {
          if (loadingStatus === "failed") {
              const { loadFailed } = translation.listLoader;
              return (v(ErrorBlock, { className: c$2(MARGIN_RESET, ERROR_MULTILINE), children: loadFailed }));
          }
          return (v(ProgressIndicator, { centered: true, className: dotsSize(PROGRESS_INDICATOR_SIZE), style: "padding: 10px 0;" }));
      }
      return (v(d, null,
          v(ActionLabel, null),
          v(ListsRender, { disabled: disabled, lists: lists.lists }),
          v(Separator, { noMargin: true }),
          v(AddListButton, { disabled: disabled, onClick: onAddList })));
  }

  const GENERIC_CAMERA_ICON = "https://vk.com/images/camera_50.png?ava=1";

  const S$1 = toStyleCombiner({
      infoBlock: {
          display: "block",
          marginBottom: "15px",
          lineHeight: "130%",
      },
      leftFloat: {
          float: "left",
      },
      targetInfo: {
          wordWrap: "break-word",
          padding: "2px 0 0 12px",
      },
      targetName: {
          marginBottom: "2px",
      },
      targetAvatar: {
          position: "relative",
          width: "42px",
          height: "42px",
          borderRadius: "100%",
          overflow: "hidden",
          backgroundSize: "cover",
          backgroundPosition: "50%",
      },
      infoText: {
          maxHeight: "48px",
          overflow: "visible",
      },
  }, {
      locked: POINTER_LOCKED,
      clearfix: CLEARFIX,
  });
  const NO_CLICK = (e) => {
      e.preventDefault();
      return false;
  };
  function InfoBlock(props) {
      var _a;
      const { displayName, avatarUrl, link, infoChildren } = props;
      const avatarStyle = {
          backgroundImage: `url("${avatarUrl !== null && avatarUrl !== void 0 ? avatarUrl : GENERIC_CAMERA_ICON}")`,
      };
      const disabled = (_a = props.disabled) !== null && _a !== void 0 ? _a : false;
      const onClick = disabled ? NO_CLICK : undefined;
      return (v("div", { className: S$1("infoBlock", "clearfix") },
          v("a", { className: S$1("leftFloat", "locked", disabled), href: link, onClick: onClick },
              v("div", { className: S$1("targetAvatar"), style: avatarStyle })),
          v("div", { className: S$1("leftFloat", "targetInfo") },
              v("div", { className: S$1("targetName") },
                  v("a", { href: link, onClick: onClick }, displayName)),
              v("div", { className: S$1("leftFloat", "infoText") }, infoChildren))));
  }

  function FollowText() {
      var _a;
      const [detail, target] = useBoxContexts();
      const translation = useTranslation("followStatus");
      if (detail == null || target == null)
          return v(d, null);
      const { invoker } = detail;
      const context = detail.context;
      const { isFollowed, isOwn } = target;
      if (isOwn != null && isOwn) {
          return v(d, null, translation.context.own);
      }
      const select = isFollowed == null
          ? null
          : Number(isFollowed);
      const text = select != null
          ? (_a = (() => {
              const { context: translations } = translation;
              const reference = invoker != null
                  ? invoker.subType
                  : context.module;
              switch (reference) {
                  case "groups": {
                      return translations.group;
                  }
                  case "public": {
                      return translations.public;
                  }
                  case "profile": {
                      return translations.profile;
                  }
                  default: return null;
              }
          })()) === null || _a === void 0 ? void 0 : _a[select] : translation.unknown;
      return v(d, null, text);
  }

  const HINT_TOOLTIP_SHIFT = [22, 10];
  const HINT_TOOLTIP_SLIDE = 10;
  function Hint({ style, className, hintOptions, text }) {
      const hintRef = p();
      const showTooltip = h$1(() => {
          const { current } = hintRef;
          if (current == null)
              return;
          getWindow().showTooltip(current, Object.assign({ text, dir: "auto", center: true, className, shift: HINT_TOOLTIP_SHIFT, slide: HINT_TOOLTIP_SLIDE }, hintOptions));
      }, [hintOptions, className, hintRef, text]);
      return (v("span", { className: "hint_icon", style: style, ref: hintRef, onMouseOver: showTooltip }));
  }

  const INDICATOR_STYLES = toClassName("inline", {
      display: "inline-block",
      marginLeft: "3px",
      "& .pr": {
          display: "inline-block",
          position: "relative",
          top: "-2px",
      },
  });
  const INDICATOR = c$2(dotsSize(4), INDICATOR_STYLES);
  function NotificationsToggle() {
      const translation = useTranslation("notificationsStatus");
      const { useNotifications } = useTarget();
      const notifications = useNotifications();
      const { disconnect } = notifications;
      p$1(() => disconnect, [disconnect]);
      if (notifications.isAvailable === "no")
          return null;
      const { isToggling, toggle } = notifications;
      const progressIndicator = isToggling
          ? v(d, null,
              v(ProgressIndicator, { className: INDICATOR }))
          : null;
      return (v("a", { onClick: toggle },
          translation[Number(notifications.isToggled)],
          progressIndicator));
  }

  const TOOLTIP_SHIFT = [-8, 10];
  const TOOLTIP_CLASS = toClassName("tooltip", { width: "250px" });
  function FollowHint() {
      const { hint } = useTranslation("followStatus");
      return (v(Hint, { text: hint, className: TOOLTIP_CLASS, hintOptions: {
              shift: TOOLTIP_SHIFT,
              center: true,
          }, style: {
              margin: "0 20px 0 5px",
          } }));
  }
  function InfoFragment() {
      const notificationsToggle = v(NotificationsToggle, null);
      return (v(d, null,
          v(FollowText, null),
          v(FollowHint, null),
          notificationsToggle != null ? v("br", null) : "",
          notificationsToggle));
  }
  function TargetInfo() {
      var _a, _b;
      const target = useTarget();
      if (target == null)
          return null;
      return (v(InfoBlock, { avatarUrl: target.icon, displayName: (_a = target.name) !== null && _a !== void 0 ? _a : "", infoChildren: v(InfoFragment, null), link: (_b = target.link) !== null && _b !== void 0 ? _b : "" }));
  }

  function TargetPrivateWarning() {
      const translation = useTranslation("privateWarning");
      const target = useTarget();
      if (target == null || target.type == null)
          return null;
      const { isPrivate, type, isFollowed } = target;
      if (isPrivate == null || !isPrivate)
          return null;
      const text = (() => {
          switch (type) {
              case "groups": {
                  return translation.group[Number(isFollowed)];
              }
              case "profile": {
                  return translation.profile;
              }
              default: return null;
          }
      })();
      if (text == null)
          return null;
      return (v(ErrorBlock, { className: c$2(MARGIN_RESET, ERROR_MULTILINE), style: { marginTop: "10px" }, children: text }));
  }

  function BoxContent() {
      const { context, invoker } = T$1(BoxContext);
      const target = s$1(() => getFullContext(invoker), [context, invoker]);
      return (v(TargetContext.Provider, { value: target },
          v(TargetInfo, null),
          v(ListLoader, null),
          v(TargetPrivateWarning, null)));
  }

  const TAG = "!!";
  const LINK_PLACEHOLDER = `{${Math.random()}`;
  function wrapText(text) {
      let link;
      {
          const lPos = text.indexOf(TAG) + TAG.length;
          const linkText = text.slice(lPos, text.indexOf(TAG, lPos));
          link = v("a", { href: "__report_link__", target: "_blank", rel: "noreferrer", children: linkText });
          text = text.replace(`${TAG}${linkText}${TAG}`, LINK_PLACEHOLDER);
      }
      const chunks = text.split("\n");
      let first = true;
      const result = [];
      for (const chunk of chunks) {
          if (first)
              first = false;
          else
              result.push(v("br", null));
          if (chunk === "")
              continue;
          if (chunk.includes(LINK_PLACEHOLDER)) {
              const [before, after] = chunk.split(LINK_PLACEHOLDER);
              result.push(before, link, after);
              continue;
          }
          result.push(v("label", null, chunk));
      }
      return result;
  }
  function ErrorBoundary({ children }) {
      const [error] = A$1(((err) => {
          log("error", "%cError boundary caught an error%c", "font-weight: bold;", "", err);
      }));
      const { errorBoundary: { text } } = getVKTranslation();
      if (error != null) {
          return (v(ErrorBlock, { className: c$2(MARGIN_RESET, ERROR_MULTILINE), children: wrapText(text) }));
      }
      return v(d, null, children);
  }

  function hasFlag(flags, flag) {
      return (flags & flag) === flag;
  }

  const BUTTON_CLASS = {
      LOCKED: "flat_btn_lock",
      DISABLED: "button_disabled",
  };
  const BUTTON_DISABLE = [POINTER_LOCKED, BUTTON_CLASS.DISABLED];
  function toggleButtonDisable(button, isDisabled) {
      for (const className of BUTTON_DISABLE) {
          button.classList.toggle(className, isDisabled);
      }
  }
  function toggleButtonLock(button, isLocked) {
      const window = getWindow();
      if (isLocked)
          window.lockButton(button);
      else
          window.unlockButton(button);
  }
  function setButtonState(button, state) {
      toggleButtonDisable(button, hasFlag(state, 4));
      toggleButtonLock(button, hasFlag(state, 6));
  }

  const ANIMATION_STORES = new WeakMap();
  const ANIMATION_TIMINGS = {
      FADE_IN: 200,
      FADE_OUT: 1500,
      STILL: 500,
  };
  const COLOR = {
      RED: toClassName("colorRed", { color: "#bd3232" }),
      GRAY: toClassName("colorGray", { color: "#606060" }),
  };
  function getAnimationStore(node) {
      let store = ANIMATION_STORES.get(node);
      if (store == null) {
          store = {};
          ANIMATION_STORES.set(node, store);
      }
      return store;
  }
  function showControlsLabel(box, text, color = "black") {
      const { controlsTextNode } = box;
      const store = getAnimationStore(controlsTextNode);
      if (store.animation != null)
          store.animation.stop();
      if (store.timeout != null)
          clearTimeout(store.timeout);
      controlsTextNode.style.opacity = "1";
      controlsTextNode.innerText = text;
      controlsTextNode.classList.toggle(COLOR.RED, color === "red");
      controlsTextNode.classList.toggle(COLOR.GRAY, color === "gray");
      const { fadeIn, fadeOut } = getWindow();
      store.animation = fadeIn(controlsTextNode, {
          duration: 150,
          onComplete() {
              store.animation = undefined;
              store.timeout = setTimeout(() => {
                  store.timeout = undefined;
                  store.animation = fadeOut(controlsTextNode, {
                      duration: ANIMATION_TIMINGS.FADE_OUT,
                      onComplete() {
                          store.animation = undefined;
                      },
                  });
              }, ANIMATION_TIMINGS.STILL);
          },
      });
  }

  function saveChanges(lists) {
      return __awaiter(this, void 0, void 0, function* () {
          try {
              yield lists.commitChanges();
              return true;
          }
          catch (err) {
              log("warn", "Failed to commit changes:", err);
              return false;
          }
      });
  }
  function initializeControls(box) {
      const isSaving = createSwitch(false);
      let lists;
      let saveButton;
      let cancelButton;
      const { lang } = getWindow();
      const [savedText, failedText] = [
          lang.global_changes_saved,
          lang.global_error_occured,
      ];
      const { box: translation } = getVKTranslation();
      const lockControls = (isSaving) => {
          setButtonState(saveButton, isSaving
              ? 6
              : 2);
          setButtonState(cancelButton, isSaving
              ? 4
              : 2);
      };
      isSaving.onChange(lockControls);
      const saveLists = (hideBox = true) => __awaiter(this, void 0, void 0, function* () {
          if (lists == null || isSaving.lazyToggle(true))
              return;
          const saveComplete = yield saveChanges(lists);
          isSaving.toggle(false);
          if (!saveComplete) {
              showControlsLabel(box, failedText, "red");
              return;
          }
          if (hideBox) {
              box.hide();
              getWindow().showDoneBox(savedText, { timeout: 1000 });
              return;
          }
          showControlsLabel(box, savedText, "gray");
      });
      box.setOptions({
          onHideAttempt() {
              if (valueOf(isSaving)) {
                  showControlsLabel(box, translation.savingChanges);
                  return false;
              }
              return true;
          },
          onBeforeHide() {
              lists === null || lists === void 0 ? void 0 : lists.resetChanges();
          },
      });
      saveButton = box.addButton(lang.box_save, (_, e) => saveLists(!e.shiftKey), "ok", true);
      setButtonState(saveButton, 4);
      cancelButton = box.addButton(lang.box_cancel, undefined, "gray", true);
      const setLists = ($lists) => {
          if ($lists != null)
              lists = $lists;
          setButtonState(saveButton, $lists == null
              ? 4
              : 2);
      };
      const resetLists = () => setLists(null);
      const saveCallbacks = new Set();
      const onSave = (callback) => {
          saveCallbacks.add(callback);
          return () => saveCallbacks.delete(callback);
      };
      isSaving.onChange((value) => {
          for (const callback of saveCallbacks) {
              try {
                  callback(value);
              }
              catch (err) {
                  log("warn", "One of the onSave callbacks has failed:", err);
              }
          }
      });
      return [setLists, resetLists, onSave];
  }

  let contentWrap;
  function Box({ detail }) {
      const translation = s$1(getVKTranslation, []);
      return (v(ErrorBoundary, null,
          v(TranslationContext.Provider, { value: translation },
              v(BoxContext.Provider, { value: detail },
                  v(BoxContent, null)))));
  }
  function addContentWrap(box, detail) {
      if (contentWrap == null) {
          contentWrap = document.createElement("div");
      }
      box.content(contentWrap);
      E(v(Box, { detail: detail }), contentWrap);
  }
  let currentBox;
  function getBox() {
      let box = currentBox;
      if (box == null) {
          const { MessageBox } = getWindow();
          const newBox = new MessageBox({
              selfDestruct: false,
              title: getVKTranslation().box.title,
              white: true,
          });
          const controlsLeftovers = initializeControls(newBox);
          box = [newBox, controlsLeftovers];
          currentBox = box;
      }
      return box;
  }
  let detailBasis = null;
  let detail = null;
  function showBox(invoker) {
      const [box, [setLists, resetLists, onSave]] = getBox();
      box.show();
      const ctx = getWindow().cur;
      if (detailBasis == null) {
          detailBasis = {
              onListsLoad: setLists,
              onListsLoadFail: resetLists,
              handleSave: onSave,
              displayLabel: (text, color) => showControlsLabel(box, text, color),
          };
      }
      const isDetailUpdated = detail == null
          || detail.context !== ctx
          || detail.invoker !== invoker;
      if (isDetailUpdated) {
          detail = Object.assign(Object.assign(Object.assign({}, detailBasis), detail), { context: ctx, invoker });
      }
      addContentWrap(box, detail);
  }

  const ACTION_BUTTON_ACCENT = "#3f3f3f";
  const STYLE$2 = toStyleCombiner({
      actionMenuItem: {
          cursor: "pointer",
          color: `${ACTION_BUTTON_ACCENT} !important`,
          background: "none",
          border: "none",
          textAlign: "left",
          font: "inherit",
          width: "100%",
          "&::before": {
              "--icon": GearIcon.url,
              background: `${ACTION_BUTTON_ACCENT} !important`,
              mask: "var(--icon) !important",
              "-webkit-mask": "var(--icon) !important",
              opacity: "1 !important",
          },
          "&:hover": {
              textDecoration: "underline !important",
          },
      },
  }, {
      vkActionMenuItem: "page_actions_item",
  });
  const CLASS_NAME = STYLE$2("vkActionMenuItem", "actionMenuItem");
  function ActionButton() {
      const onClick = h$1(() => showBox(undefined), []);
      return (v("button", { className: CLASS_NAME, onClick: onClick }, getVKTranslation().actionButton.text));
  }
  let mountFunction;
  function getRoaming() {
      if (mountFunction == null) {
          mountFunction = asRoaming(() => v(ActionButton, null));
      }
      return mountFunction;
  }

  function wrapProperty(obj, property, callback, descriptor) {
      let realValue = obj[property];
      Object.defineProperty(obj, property, Object.assign(Object.assign({}, descriptor), { get: () => realValue, set(newValue) {
              realValue = newValue;
              try {
                  callback(newValue);
              }
              catch (_a) {
              }
          } }));
  }
  const WRAPPED_FUNCTIONS = new Set();
  function getFunctionName(func) {
      const { name } = func;
      return name === "" ? "[anonymous function]" : name;
  }
  function wrapFunction(func, callbacks, rejectChaining = false) {
      if (rejectChaining && WRAPPED_FUNCTIONS.has(func)) {
          throw new Error(ERROR_MESSAGES.WRAPPING_A_WRAPPER);
      }
      let resultWrapper;
      const funcName = getFunctionName(func);
      if (typeof callbacks === "function") {
          resultWrapper = function wrappedFunction(...args) {
              const result = func(...args);
              try {
                  callbacks();
              }
              catch (err) {
                  log("error", `Callback for ${funcName} has failed:`, {
                      error: err,
                      function: func,
                      callbackFunction: callbacks,
                  });
              }
              return result;
          };
      }
      else {
          const { preCallback, postCallback } = callbacks;
          resultWrapper = function wrappedFunction(...args) {
              let preFail;
              let preResult = null;
              let funcResult = null;
              try {
                  preResult = {
                      value: preCallback(...args),
                  };
              }
              catch (err) {
                  preFail = err;
              }
              funcResult = { value: func(...args) };
              if (preFail != null) {
                  log("error", `Callback for ${funcName} has failed:`, {
                      error: preFail,
                      function: func,
                      callback: preCallback,
                  });
              }
              try {
                  if (preFail == null && preResult != null) {
                      postCallback === null || postCallback === void 0 ? void 0 : postCallback(preResult.value);
                  }
              }
              catch (err) {
                  log("error", `Post callback for ${funcName} has failed:`, {
                      error: err,
                      function: func,
                      postCallback,
                  });
              }
              return funcResult.value;
          };
      }
      WRAPPED_FUNCTIONS.add(resultWrapper);
      return resultWrapper;
  }

  function setupInitInterceptors(interceptors) {
      const window = getWindow();
      for (const [moduleName, callbacks] of interceptors) {
          wrapProperty(window, moduleName, (newValue) => {
              if (newValue == null)
                  return;
              const initFunciton = Reflect.get(newValue, "init");
              const initWrapper = wrapFunction(initFunciton.bind(newValue), callbacks);
              Reflect.set(newValue, "init", initWrapper);
              log("info", `Injected initialization interceptor to "${moduleName}"`);
          });
          log("info", `Now watching for "${moduleName}" being defined.`);
      }
  }

  const MOUNT_ACTION_BUTTON = getRoaming();
  const ACTIONS_CONTAINER = "._page_actions_container";
  const MSG_STATUS_BLOCK = ".group_send_msg_status_block";
  function injectActionButton() {
      const container = elem(ACTIONS_CONTAINER);
      if (container == null) {
          log("error", "Failed to find page actions container!");
          return;
      }
      let referenceNode;
      {
          const sendMsgAction = elem(MSG_STATUS_BLOCK, container);
          if (sendMsgAction != null)
              referenceNode = sendMsgAction;
          else
              referenceNode = container.firstElementChild;
      }
      if (referenceNode == null) {
          log("warn", "Failed to find reference node!");
          return;
      }
      MOUNT_ACTION_BUTTON((actionButton) => {
          const mountNode = referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.parentNode;
          const button = mountNode === null || mountNode === void 0 ? void 0 : mountNode.insertBefore(actionButton, referenceNode);
          log("info", "Successfully injected button:", button);
      }, undefined);
  }
  const IS_INJECTED = createSwitch(false);
  function prepare() {
      if (lazyToggle(IS_INJECTED, true)) {
          throw new Error(ERROR_MESSAGES.ALREADY_INJECTED);
      }
      setupInitInterceptors([
          ["public", injectActionButton],
          ["Groups", injectActionButton],
      ]);
  }

  function ProfileMenuItem() {
      const { actionButton: translation } = getVKTranslation();
      const onClick = h$1(() => showBox(undefined), []);
      return (v("a", { className: "page_actions_item", tabIndex: 0, role: "link", children: translation.text, onClick: onClick }));
  }
  function getRoaming$1() {
      return asRoaming(v(ProfileMenuItem, null));
  }

  const PAGE_EXTRA_ACTIONS = ".page_extra_actions_wrap";
  const ACTIONS_MENU_INNER = ".page_actions_inner";
  const CONTAINER = `${PAGE_EXTRA_ACTIONS} > ${ACTIONS_MENU_INNER}`;
  const MOUNT_MENU_ITEM = getRoaming$1();
  function mountMenuItem() {
      const container = elem(CONTAINER);
      const firstItem = container === null || container === void 0 ? void 0 : container.firstElementChild;
      if (firstItem == null)
          return;
      MOUNT_MENU_ITEM((menuItem) => {
          insertBefore(firstItem, menuItem);
      }, undefined);
  }
  function prepare$1() {
      setupInitInterceptors([["Profile", mountMenuItem]]);
  }

  function ActionsMenuItem({ invoker }) {
      const onClick = h$1(() => showBox(invoker), [invoker]);
      const { actionsMenuItem: translation } = getVKTranslation();
      return (v("a", { className: "ui_actions_menu_item", role: "link", tabIndex: 0, onClick: onClick, children: translation.text }));
  }
  let mountFunction$1;
  function getReplicable() {
      if (mountFunction$1 == null) {
          mountFunction$1 = asReplicable((props) => v(ActionsMenuItem, Object.assign({}, props)));
      }
      return mountFunction$1;
  }

  const MOUNT_MENU_ITEM$1 = getReplicable();
  function getMenuDisposition(menu, kind) {
      switch (kind) {
          case "bookmark":
          case "group_row": {
              const separator = elem(".ui_actions_menu_sep", menu);
              if (separator == null)
                  break;
              const referenceNode = kind === "bookmark"
                  ? separator
                  : separator.nextSibling;
              if (referenceNode == null)
                  return null;
              return (component) => insertBefore(referenceNode, component);
          }
      }
      return menu;
  }
  function injectActionsMenuItem(invoker) {
      const menu = elem(".ui_actions_menu", invoker.element);
      if (menu == null) {
          log("warn", "Not injecting menu item: couldn't find menu");
          return;
      }
      const disposition = getMenuDisposition(menu, "group_row");
      if (disposition == null) {
          log("warn", "Not injecting menu item: was unable to find optimal disposition");
          return;
      }
      MOUNT_MENU_ITEM$1(disposition, { invoker });
  }
  function getBookmarksType() {
      const currentURL = new URL(getWindow().location.href);
      const currentType = currentURL.searchParams.get("type");
      switch (currentType) {
          case "group": return "groups";
          case "user": return "profile";
          default: return null;
      }
  }
  function mountBookmarksListMenuItems() {
      const currentType = getBookmarksType();
      if (currentType == null)
          return;
      const { pagesAll } = getWindow().cur;
      if (pagesAll == null)
          return;
      const proto = Object.getPrototypeOf(pagesAll);
      function pushInterceptor(...args) {
          const result = proto.push.apply(this, args);
          if (args === null || args.length === 0)
              return result;
          for (const arg of [...args]) {
              injectActionsMenuItem({
                  element: arg,
                  kind: "bookmark",
                  subType: currentType,
              });
          }
          return result;
      }
      const newProto = Object.create(proto, {
          push: {
              value: pushInterceptor,
              writable: false,
              enumerable: false,
              configurable: true,
          },
      });
      Object.setPrototypeOf(pagesAll, newProto);
  }
  function mountRowsListMenuItems(kind) {
      const container = elem(kind === "group_row"
          ? ".groups_list"
          : "#friends_list");
      if (container == null)
          return;
      const groupRows = elems(kind === "group_row"
          ? ".group_list_row"
          : ".friends_user_row", container);
      for (const row of asArray(groupRows)) {
          injectActionsMenuItem({
              element: row,
              kind,
              subType: kind === "group_row"
                  ? "public"
                  : "profile",
          });
      }
  }
  const INTERCEPTORS = [
      ["GroupsList", () => mountRowsListMenuItems("group_row")],
      ["Bookmarks", mountBookmarksListMenuItems],
      ["Friends", () => mountRowsListMenuItems("friend_row")],
  ];
  function prepare$2() {
      setupInitInterceptors(INTERCEPTORS);
  }

  function getGetValue() {
      var _a;
      return (_a = GM === null || GM === void 0 ? void 0 : GM.getValue) !== null && _a !== void 0 ? _a : GM_getValue;
  }
  function getValueOrDefault(name, defaultValue) {
      return __awaiter(this, void 0, void 0, function* () {
          const value = yield getGetValue()(name);
          if (value == null)
              return defaultValue;
          return value;
      });
  }
  function setValue(name, value) {
      var _a;
      return __awaiter(this, void 0, void 0, function* () {
          const setGMValue = (_a = GM === null || GM === void 0 ? void 0 : GM.setValue) !== null && _a !== void 0 ? _a : window.GM_setValue;
          yield setGMValue(name, value);
      });
  }

  const VERSION_SETTING = "lastVersion";
  const CURRENT_VERSION = "2.0.1--1584006622991";
  const NEVER = "never";
  function checkVersion() {
      return __awaiter(this, void 0, void 0, function* () {
          const lastVersion = yield getValueOrDefault(VERSION_SETTING, NEVER);
          if (lastVersion === CURRENT_VERSION)
              return;
          const { versionChecker: translations } = getVKTranslation();
          yield setValue(VERSION_SETTING, CURRENT_VERSION);
          const localeLink = (str) => str.replace("{}", getVKLanguage());
          if (lastVersion === NEVER) {
              getWindow().showDoneBox(localeLink(translations.installed));
              return;
          }
          getWindow().showDoneBox(localeLink(translations.updated));
      });
  }

  log("log", "Preparing...");
  prepare();
  prepare$1();
  prepare$2();
  getWindow().addEventListener("load", () => {
      checkVersion()
          .then(() => log("info", "Version check complete!"))
          .catch((err) => log("error", "Version check failed", err));
  });
  log("info", "Ready.");

}());

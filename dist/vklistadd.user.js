//
// ==UserScript==
// @name VK List Add
// @name:ru VK Добавление в списки
// @description Implements a darky button to add communities or users to feed lists without subscribing to them
// @description:ru Реализует тёмную кнопку для добавления сообществ или пользователей в списки новостей без подписки на них
// @version 3.0.0
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

    var data$1 = { actionButton:{ text:"Manage lists" },
      actionLabel:{ context:{ bookmark:"for this bookmark",
          group:"of this group",
          other:"of this page",
          profile:"of this user",
          "public":"of this community" },
        template:"Show news {} in the lists:" },
      actionsMenuItem:{ context:{ "default":"News feed lists",
          feedRow:"Edit lists" } },
      addListButton:{ text:"Create a new list",
        tooltip:"Redirect to news page" },
      box:{ savingChanges:"Saving changes...",
        savingShift:"Hold Shift to keep window open",
        title:"Manage lists" },
      editListButton:{ icon:"Icon",
        text:"Edit “{}”" },
      errorBoundary:{ text:"Unfortunately, due to a bug in our code, this window has failed to render :(\n\nPlease, try another browser and !!report to extension developer!! if that won't solve the problem." },
      errorMessages:{ alreadyInjected:"Interceptors already were injected in the window.",
        noOrInvalidContext:"Window doesn't contain context or current context object doesn't contain options (odd behavior).",
        noParentNode:"Referenced node has no parent node.",
        vkLanguageDetectFail:"Failed to detect VK language.",
        wrappingWrapper:"Attempting to wrap already wrapped function." },
      followStatus:{ context:{ group:[ "You have not joined this group.",
            "You are a member of this group." ],
          own:"This is beautiful you!",
          profile:[ "Not in the friends list.",
            "You are following them." ],
          "public":[ "You are not following page.",
            "You are following this page." ] },
        hint:"You can add to the tabs without following or adding to friends.",
        unknown:"Unknown follow status." },
      infoBlock:{ avatarAlt:"{}'s avatar" },
      listCreation:{ highlightTooltip:"{} is here" },
      listLoader:{ loadFailed:"Unable to fetch your lists :(" },
      lists:{ empty:"You have no lists." },
      notificationsStatus:[ "Notifications disabled.",
        "Notifications enabled." ],
      privateWarning:{ group:[ "This is a closed group. You will need to join it to see its news in selected lists.",
          "This is a closed group. You will need to stay in it to see its news in selected lists." ],
        profile:"This is a closed profile. You need to add this user as a friend to see their news." },
      versionChecker:{ installed:"<b>Yay! VK List Add is now installed.</b><br>Thank you for installing our extension. <a href=\"https://github.com/Sasha-Sorokin/vklistadd/blob/master/docs/{}/GUIDE.md\" target=\"blank\" rel=\"noreferrer\">Do you want to learn how to use it?</a>",
        updated:"<b>VK List Add has been updated!</b></br>Want to see <a href=\"https://github.com/Sasha-Sorokin/vklistadd/blob/master/CHANGELOG.md\" target=\"blank\" rel=\"noreferrer\">our changelog?</a>" } };
    var actionButton$1 = data$1.actionButton;
    var actionLabel$1 = data$1.actionLabel;
    var actionsMenuItem$1 = data$1.actionsMenuItem;
    var addListButton$1 = data$1.addListButton;
    var box$1 = data$1.box;
    var editListButton$1 = data$1.editListButton;
    var errorBoundary$1 = data$1.errorBoundary;
    var errorMessages$1 = data$1.errorMessages;
    var followStatus$1 = data$1.followStatus;
    var infoBlock$1 = data$1.infoBlock;
    var listCreation$1 = data$1.listCreation;
    var listLoader$1 = data$1.listLoader;
    var lists$1 = data$1.lists;
    var notificationsStatus$1 = data$1.notificationsStatus;
    var privateWarning$1 = data$1.privateWarning;
    var versionChecker$1 = data$1.versionChecker;

    var enUS = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': data$1,
        actionButton: actionButton$1,
        actionLabel: actionLabel$1,
        actionsMenuItem: actionsMenuItem$1,
        addListButton: addListButton$1,
        box: box$1,
        editListButton: editListButton$1,
        errorBoundary: errorBoundary$1,
        errorMessages: errorMessages$1,
        followStatus: followStatus$1,
        infoBlock: infoBlock$1,
        listCreation: listCreation$1,
        listLoader: listLoader$1,
        lists: lists$1,
        notificationsStatus: notificationsStatus$1,
        privateWarning: privateWarning$1,
        versionChecker: versionChecker$1
    });

    var data = { actionButton:{ text:"Настроить списки" },
      actionLabel:{ context:{ bookmark:"для закладки",
          group:"группы",
          other:"страницы",
          profile:"пользователя",
          "public":"сообщества" },
        template:"Отображать новости {} в списках:" },
      actionsMenuItem:{ context:{ "default":"Списки новостей",
          feedRow:"Изменить списки" } },
      addListButton:{ text:"Создать новый список",
        tooltip:"Перенаправляет в ленту новостей" },
      box:{ savingChanges:"Изменения сохраняются...",
        savingShift:"Удерживайте Shift, чтобы не закрывать это окно",
        title:"Управление списками" },
      editListButton:{ icon:"Иконка",
        text:"Редактировать «{}»" },
      errorBoundary:{ text:"К сожалению, из-за ошибки это окно не смогло отобразиться :(\n\nПожалуйста, попробуйте другой браузер и !!сообщите разработчикам расширения!!, если это не исправит проблему." },
      errorMessages:{ alreadyInjected:"Отловщики уже установлены в объекте окна.",
        noOrInvalidContext:"В объекте окна отсутствует объект контекста или в контексте отсутствуют опции (странное поведение).",
        noParentNode:"У переданного узла отсутствует родительский узел.",
        vkLanguageDetectFail:"Невозможно определить используемый ВКонтакте язык.",
        wrappingWrapper:"Попытка обернуть ранее обвёрнутую функцию." },
      followStatus:{ context:{ group:[ "Вы не вступили в группу.",
            "Вы участник этой группы." ],
          own:"Гляньте-ка, это же вы!",
          profile:[ "Не в списке друзей.",
            "Вы подписаны на этого пользователя." ],
          "public":[ "Вы не подписаны на это сообщество.",
            "Вы подписаны на это сообщество." ] },
        hint:"Вносить в списки можно без подписки или добавления в друзья.",
        unknown:"Статус подписки не известен." },
      infoBlock:{ avatarAlt:"Аватарка {}" },
      listCreation:{ highlightTooltip:"{} здесь" },
      listLoader:{ loadFailed:"Не удалось загрузить ваши списки :(" },
      lists:{ empty:"У вас нет списков новостей." },
      notificationsStatus:[ "Уведомления отключены.",
        "Уведомления включены." ],
      privateWarning:{ group:[ "Это закрытая группа. Вам необходимо вступить в неё, чтобы её новости отображались в выбранных списках.",
          "Это закрытая группа. Вам необходимо оставаться участником, чтобы её новости отображались в выбранных списках." ],
        profile:"Это закрытый профиль. Вам необходимо добавить пользователя в друзья, чтобы его новости отображались в выбранных вами списках." },
      versionChecker:{ installed:"<b>Ура, VK List Add установлен!</b><br>Спасибо за установку нашего расширения. <a href=\"https://github.com/Sasha-Sorokin/vklistadd/blob/master/docs/{}/GUIDE.md\" target=\"blank\" rel=\"noreferrer\">Хотите узнать, как его использовать?</a>",
        updated:"<b>VK List Add обновился!</b></br>Желаете взглянуть на <a href=\"https://github.com/Sasha-Sorokin/vklistadd/blob/master/CHANGELOG.md\" target=\"blank\" rel=\"noreferrer\">список изменений?</a>" } };
    var actionButton = data.actionButton;
    var actionLabel = data.actionLabel;
    var actionsMenuItem = data.actionsMenuItem;
    var addListButton = data.addListButton;
    var box = data.box;
    var editListButton = data.editListButton;
    var errorBoundary = data.errorBoundary;
    var errorMessages = data.errorMessages;
    var followStatus = data.followStatus;
    var infoBlock = data.infoBlock;
    var listCreation = data.listCreation;
    var listLoader = data.listLoader;
    var lists = data.lists;
    var notificationsStatus = data.notificationsStatus;
    var privateWarning = data.privateWarning;
    var versionChecker = data.versionChecker;

    var ruRU = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': data,
        actionButton: actionButton,
        actionLabel: actionLabel,
        actionsMenuItem: actionsMenuItem,
        addListButton: addListButton,
        box: box,
        editListButton: editListButton,
        errorBoundary: errorBoundary,
        errorMessages: errorMessages,
        followStatus: followStatus,
        infoBlock: infoBlock,
        listCreation: listCreation,
        listLoader: listLoader,
        lists: lists,
        notificationsStatus: notificationsStatus,
        privateWarning: privateWarning,
        versionChecker: versionChecker
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

    var n,l$1,u$1,i$1,t$1,o$1,r$1,f$1,e$1={},c$2=[],s$2=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a$1(n,l){for(var u in l)n[u]=l[u];return n}function h(n){var l=n.parentNode;l&&l.removeChild(n);}function v$1(l,u,i){var t,o,r,f={};for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return y$1(l,f,t,o,null)}function y$1(n,i,t,o,r){var f={type:n,props:i,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u$1:r};return null!=l$1.vnode&&l$1.vnode(f),f}function d$1(n){return n.children}function _(n,l){this.props=n,this.context=l;}function k$1(n,l){if(null==l)return n.__?k$1(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?k$1(n):null}function b$1(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return b$1(n)}}function m$1(n){(!n.__d&&(n.__d=!0)&&t$1.push(n)&&!g$1.__r++||r$1!==l$1.debounceRendering)&&((r$1=l$1.debounceRendering)||o$1)(g$1);}function g$1(){for(var n;g$1.__r=t$1.length;)n=t$1.sort(function(n,l){return n.__v.__b-l.__v.__b}),t$1=[],n.some(function(n){var l,u,i,t,o,r;n.__d&&(o=(t=(l=n).__v).__e,(r=l.__P)&&(u=[],(i=a$1({},t)).__v=t.__v+1,j$1(r,t,i,l.__n,void 0!==r.ownerSVGElement,null!=t.__h?[o]:null,u,null==o?k$1(t):o,t.__h),z(u,t),t.__e!=o&&b$1(t)));});}function w$1(n,l,u,i,t,o,r,f,s,a){var h,v,p,_,b,m,g,w=i&&i.__k||c$2,A=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(_=u.__k[h]=null==(_=l[h])||"boolean"==typeof _?null:"string"==typeof _||"number"==typeof _||"bigint"==typeof _?y$1(null,_,null,null,_):Array.isArray(_)?y$1(d$1,{children:_},null,null,null):_.__b>0?y$1(_.type,_.props,_.key,null,_.__v):_)){if(_.__=u,_.__b=u.__b+1,null===(p=w[h])||p&&_.key==p.key&&_.type===p.type)w[h]=void 0;else for(v=0;v<A;v++){if((p=w[v])&&_.key==p.key&&_.type===p.type){w[v]=void 0;break}p=null;}j$1(n,_,p=p||e$1,t,o,r,f,s,a),b=_.__e,(v=_.ref)&&p.ref!=v&&(g||(g=[]),p.ref&&g.push(p.ref,null,_),g.push(v,_.__c||b,_)),null!=b?(null==m&&(m=b),"function"==typeof _.type&&null!=_.__k&&_.__k===p.__k?_.__d=s=x$1(_,s,n):s=P(n,_,p,w,b,s),a||"option"!==u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&p.__e==s&&s.parentNode!=n&&(s=k$1(p));}for(u.__e=m,h=A;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=k$1(i,h+1)),N(w[h],w[h]));if(g)for(h=0;h<g.length;h++)M(g[h],g[++h],g[++h]);}function x$1(n,l,u){var i,t;for(i=0;i<n.__k.length;i++)(t=n.__k[i])&&(t.__=n,l="function"==typeof t.type?x$1(t,l,u):P(u,t,t,n.__k,t.__e,l));return l}function P(n,l,u,i,t,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||t!=o||null==t.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(t),r=null;else {for(f=o,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,o),r=o;}return void 0!==r?r:t.nextSibling}function C(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||H(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||H(n,o,l[o],u[o],i);}function $(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s$2.test(l)?u:u+"px";}function H(n,l,u,i,t){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||$(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||$(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?i||n.addEventListener(l,o?T:I,o):n.removeEventListener(l,o?T:I,o);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function I(n){this.l[n.type+!1](l$1.event?l$1.event(n):n);}function T(n){this.l[n.type+!0](l$1.event?l$1.event(n):n);}function j$1(n,u,i,t,o,r,f,e,c){var s,h,v,y,p,k,b,m,g,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(s=l$1.__b)&&s(u);try{n:if("function"==typeof P){if(m=u.props,g=(s=P.contextType)&&t[s.__c],x=s?g?g.props.value:s.__:t,i.__c?b=(h=u.__c=i.__c).__=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(m,x):(u.__c=h=new _(m,x),h.constructor=P,h.render=O),g&&g.sub(h),h.props=m,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=a$1({},h.__s)),a$1(h.__s,P.getDerivedStateFromProps(m,h.__s))),y=h.props,p=h.state,v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(null==P.getDerivedStateFromProps&&m!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,x)||u.__v===i.__v){h.props=m,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u);}),h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,p,k);});}h.context=x,h.props=m,h.state=h.__s,(s=l$1.__r)&&s(u),h.__d=!1,h.__v=u,h.__P=n,s=h.render(h.props,h.state,h.context),h.state=h.__s,null!=h.getChildContext&&(t=a$1(a$1({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(k=h.getSnapshotBeforeUpdate(y,p)),A=null!=s&&s.type===d$1&&null==s.key?s.props.children:s,w$1(n,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),b&&(h.__E=h.__=null),h.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=L(i.__e,u,i,t,o,r,f,c);(s=l$1.diffed)&&s(u);}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l$1.__e(n,u,i);}}function z(n,u){l$1.__c&&l$1.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$1.__e(n,u.__v);}});}function L(l,u,i,t,o,r,f,c){var s,a,v,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(o=!0),null!=r)for(;_<r.length;_++)if((s=r[_])&&(s===l||(d?s.localName==d:3==s.nodeType))){l=s,r[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),r=null,c=!1;}if(null===d)y===p||c&&l.data===p||(l.data=p);else {if(r=r&&n.call(l.childNodes),a=(y=i.props||e$1).dangerouslySetInnerHTML,v=p.dangerouslySetInnerHTML,!c){if(null!=r)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""));}if(C(l,p,y,o,c),v)u.__k=[];else if(_=u.props.children,w$1(l,Array.isArray(_)?_:[_],u,i,t,o&&"foreignObject"!==d,r,f,r?r[0]:i.__k&&k$1(i,0),c),null!=r)for(_=r.length;_--;)null!=r[_]&&h(r[_]);c||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_)&&H(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&H(l,"checked",_,y.checked,!1));}return l}function M(n,u,i){try{"function"==typeof n?n(u):n.current=u;}catch(n){l$1.__e(n,i);}}function N(n,u,i){var t,o;if(l$1.unmount&&l$1.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||M(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(n){l$1.__e(n,u);}t.base=t.__P=null;}if(t=n.__k)for(o=0;o<t.length;o++)t[o]&&N(t[o],u,"function"!=typeof n.type);i||null==n.__e||h(n.__e),n.__e=n.__d=void 0;}function O(n,l,u){return this.constructor(n,u)}function S$2(u,i,t){var o,r,f;l$1.__&&l$1.__(u,i),r=(o="function"==typeof t)?null:t&&t.__k||i.__k,f=[],j$1(i,u=(!o&&t||i).__k=v$1(d$1,null,[u]),r||e$1,e$1,void 0!==i.ownerSVGElement,!o&&t?[t]:r?null:i.firstChild?n.call(i.childNodes):null,f,!o&&t?t:r?r.__e:i.firstChild,o),z(f,u);}function B(l,u,i){var t,o,r,f=a$1({},l.props);for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),y$1(l.type,f,t||l.key,o||l.ref,null)}function D(n,l){var u={__c:l="__cC"+f$1++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,i;return this.getChildContext||(u=[],(i={})[l]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(m$1);},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n);};}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n=c$2.slice,l$1={__e:function(n,l){for(var u,i,t;l=l.__;)if((u=l.__c)&&!u.__)try{if((i=u.constructor)&&null!=i.getDerivedStateFromError&&(u.setState(i.getDerivedStateFromError(n)),t=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),t=u.__d),t)return u.__E=u}catch(l){n=l;}throw n}},u$1=0,i$1=function(n){return null!=n&&void 0===n.constructor},_.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a$1({},this.state),"function"==typeof n&&(n=n(a$1({},u),this.props)),n&&a$1(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),m$1(this));},_.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m$1(this));},_.prototype.render=d$1,t$1=[],o$1="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g$1.__r=0,f$1=0;

    var t,u,r,o=0,i=[],c$1=l$1.__b,f=l$1.__r,e=l$1.diffed,a=l$1.__c,v=l$1.unmount;function m(t,r){l$1.__h&&l$1.__h(u,t,o||r),o=0;var i=u.__H||(u.__H={__:[],__h:[]});return t>=i.__.length&&i.__.push({}),i.__[t]}function l(n){return o=1,p(w,n)}function p(n,r,o){var i=m(t++,2);return i.t=n,i.__c||(i.__=[o?o(r):w(void 0,r),function(n){var t=i.t(i.__[0],n);i.__[0]!==t&&(i.__=[t,i.__[1]],i.__c.setState({}));}],i.__c=u),i.__}function y(r,o){var i=m(t++,3);!l$1.__s&&k(i.__H,o)&&(i.__=r,i.__H=o,u.__H.__h.push(i));}function s$1(n){return o=5,d(function(){return {current:n}},[])}function d(n,u){var r=m(t++,7);return k(r.__H,u)&&(r.__=n(),r.__H=u,r.__h=n),r.__}function A(n,t){return o=8,d(function(){return n},t)}function F(n){var r=u.context[n.__c],o=m(t++,9);return o.c=n,r?(null==o.__&&(o.__=!0,r.sub(u)),r.props.value):n.__}function q(n){var r=m(t++,10),o=l();return r.__=n,u.componentDidCatch||(u.componentDidCatch=function(n){r.__&&r.__(n),o[1](n);}),[o[0],function(){o[1](void 0);}]}function x(){i.forEach(function(t){if(t.__P)try{t.__H.__h.forEach(g),t.__H.__h.forEach(j),t.__H.__h=[];}catch(u){t.__H.__h=[],l$1.__e(u,t.__v);}}),i=[];}l$1.__b=function(n){u=null,c$1&&c$1(n);},l$1.__r=function(n){f&&f(n),t=0;var r=(u=n.__c).__H;r&&(r.__h.forEach(g),r.__h.forEach(j),r.__h=[]);},l$1.diffed=function(t){e&&e(t);var o=t.__c;o&&o.__H&&o.__H.__h.length&&(1!==i.push(o)&&r===l$1.requestAnimationFrame||((r=l$1.requestAnimationFrame)||function(n){var t,u=function(){clearTimeout(r),b&&unsafeWindow.cancelAnimationFrame.bind(unsafeWindow)(t),setTimeout(n);},r=setTimeout(u,100);b&&(t=requestAnimationFrame(u));})(x)),u=void 0;},l$1.__c=function(t,u){u.some(function(t){try{t.__h.forEach(g),t.__h=t.__h.filter(function(n){return !n.__||j(n)});}catch(r){u.some(function(n){n.__h&&(n.__h=[]);}),u=[],l$1.__e(r,t.__v);}}),a&&a(t,u);},l$1.unmount=function(t){v&&v(t);var u=t.__c;if(u&&u.__H)try{u.__H.__.forEach(g);}catch(t){l$1.__e(t,u.__v);}};var b="function"==typeof requestAnimationFrame;function g(n){var t=u;"function"==typeof n.__c&&n.__c(),u=t;}function j(n){var t=u;n.__c=n.__(),u=t;}function k(n,t){return !n||n.length!==t.length||t.some(function(t,u){return t!==n[u]})}function w(n,t){return "function"==typeof t?t(n):t}

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
        const children = Array.prototype.slice.call(fragment.childNodes);
        for (const child of children)
            set.add(child);
    }
    function asRoaming(component) {
        let currentNodes = null;
        return function renderAndMount(insertFunctionOrParent, props) {
            const fragment = document.createDocumentFragment();
            if (currentNodes == null) {
                currentNodes = new Set();
            }
            else {
                for (const node of currentNodes)
                    fragment.appendChild(node);
            }
            S$2(elementToRender(component, props), fragment);
            cloneReferences(fragment, currentNodes);
            insertFragement(insertFunctionOrParent, fragment);
        };
    }
    function asReplicable(component) {
        return function replicateAndMount(insertFunctionOrParent, props) {
            const fragment = document.createDocumentFragment();
            S$2(elementToRender(component, props), fragment);
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
            throw new Error(ERROR_MESSAGES.vkLanguageDetectFail);
        }
        return (_a = VK_LANGUAGE_MAPPINGS[langConfig.id]) !== null && _a !== void 0 ? _a : getNavigatorLanguage();
    }
    let vkLanguage = null;
    function getVKLanguage() {
        if (vkLanguage == null) {
            vkLanguage = detectVKLanguage();
        }
        return vkLanguage;
    }
    function getVKTranslation() {
        return TRANSLATIONS[getVKLanguage()];
    }

    var isMergeableObject = function isMergeableObject(value) {
    	return isNonNullObject(value)
    		&& !isSpecial(value)
    };

    function isNonNullObject(value) {
    	return !!value && typeof value === 'object'
    }

    function isSpecial(value) {
    	var stringValue = Object.prototype.toString.call(value);

    	return stringValue === '[object RegExp]'
    		|| stringValue === '[object Date]'
    		|| isReactElement(value)
    }

    // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
    var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

    function isReactElement(value) {
    	return value.$$typeof === REACT_ELEMENT_TYPE
    }

    function emptyTarget(val) {
    	return Array.isArray(val) ? [] : {}
    }

    function cloneUnlessOtherwiseSpecified(value, options) {
    	return (options.clone !== false && options.isMergeableObject(value))
    		? deepmerge(emptyTarget(value), value, options)
    		: value
    }

    function defaultArrayMerge(target, source, options) {
    	return target.concat(source).map(function(element) {
    		return cloneUnlessOtherwiseSpecified(element, options)
    	})
    }

    function getMergeFunction(key, options) {
    	if (!options.customMerge) {
    		return deepmerge
    	}
    	var customMerge = options.customMerge(key);
    	return typeof customMerge === 'function' ? customMerge : deepmerge
    }

    function getEnumerableOwnPropertySymbols(target) {
    	return Object.getOwnPropertySymbols
    		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
    			return target.propertyIsEnumerable(symbol)
    		})
    		: []
    }

    function getKeys(target) {
    	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
    }

    function propertyIsOnObject(object, property) {
    	try {
    		return property in object
    	} catch(_) {
    		return false
    	}
    }

    // Protects from prototype poisoning and unexpected merging up the prototype chain.
    function propertyIsUnsafe(target, key) {
    	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
    			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
    }

    function mergeObject(target, source, options) {
    	var destination = {};
    	if (options.isMergeableObject(target)) {
    		getKeys(target).forEach(function(key) {
    			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    		});
    	}
    	getKeys(source).forEach(function(key) {
    		if (propertyIsUnsafe(target, key)) {
    			return
    		}

    		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
    			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
    		} else {
    			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    		}
    	});
    	return destination
    }

    function deepmerge(target, source, options) {
    	options = options || {};
    	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    	// implementations can use it. The caller may not replace it.
    	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

    	var sourceIsArray = Array.isArray(source);
    	var targetIsArray = Array.isArray(target);
    	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    	if (!sourceAndTargetTypesMatch) {
    		return cloneUnlessOtherwiseSpecified(source, options)
    	} else if (sourceIsArray) {
    		return options.arrayMerge(target, source, options)
    	} else {
    		return mergeObject(target, source, options)
    	}
    }

    deepmerge.all = function deepmergeAll(array, options) {
    	if (!Array.isArray(array)) {
    		throw new Error('first argument should be an array')
    	}

    	return array.reduce(function(prev, next) {
    		return deepmerge(prev, next, options)
    	}, {})
    };

    var deepmerge_1 = deepmerge;

    var cjs = deepmerge_1;

    var alphas = 'abcdefghijklmnopqrstuvwxyz'.split('');
    function numToAlpha(num) {
        return alphas[num];
    }

    var inc = Date.now();
    var numPairsRegex = /(\d{1,2})/g;
    function getUniqueSuffix() {
        var numPairs = [];
        var incStr = inc.toString();
        var result = numPairsRegex.exec(incStr);
        while (result) {
            numPairs.push(result[0]);
            result = numPairsRegex.exec(incStr);
        }
        var out = '_';
        numPairs.forEach(function (pair) {
            var val = +pair;
            if (val > 25) {
                var _a = pair.split(''), first = _a[0], second = _a[1];
                out += "" + numToAlpha(+first) + numToAlpha(+second);
            }
            else
                out += numToAlpha(val);
        });
        inc += 1;
        return out;
    }
    function generateClassName(c) {
        return "" + c + getUniqueSuffix();
    }

    var posthooks = [];
    function getPosthooks() {
        return posthooks;
    }

    function isNestedSelector(r) {
        return /&/g.test(r);
    }
    function isMedia(r) {
        return r.toLowerCase().startsWith('@media');
    }
    function formatCSSRuleName(rule) {
        return rule.replace(/([A-Z])/g, function (p1) { return "-" + p1.toLowerCase(); });
    }
    function formatCSSRules(cssRules) {
        return Object.entries(cssRules).reduce(function (prev, _a) {
            var cssProp = _a[0], cssVal = _a[1];
            return "" + prev + formatCSSRuleName(cssProp) + ":" + cssVal + ";";
        }, '');
    }
    function execCreateStyles(rules, options, parentSelector, noGenerateClassName) {
        var _a, _b;
        if (noGenerateClassName === void 0) { noGenerateClassName = false; }
        var out = {};
        var sheetBuffer = '';
        var mediaQueriesBuffer = '';
        var styleEntries = Object.entries(rules);
        var ruleWriteOpen = false;
        var guardCloseRuleWrite = function () {
            if (ruleWriteOpen)
                sheetBuffer += '}';
            ruleWriteOpen = false;
        };
        for (var _i = 0, styleEntries_1 = styleEntries; _i < styleEntries_1.length; _i++) {
            var _c = styleEntries_1[_i], classNameOrCSSRule = _c[0], classNameRules = _c[1];
            // if the classNameRules is a string, we are dealing with a display: none; type rule
            if (isMedia(classNameOrCSSRule)) {
                if (typeof classNameRules !== 'object')
                    throw new Error('Unable to map @media query because rules / props are an invalid type');
                guardCloseRuleWrite();
                mediaQueriesBuffer += classNameOrCSSRule + "{";
                var _d = execCreateStyles(classNameRules, options, parentSelector), mediaQueriesOutput = _d.mediaQueriesBuffer, regularOutput = _d.sheetBuffer;
                mediaQueriesBuffer += regularOutput;
                mediaQueriesBuffer += '}';
                mediaQueriesBuffer += mediaQueriesOutput;
            }
            else if (isNestedSelector(classNameOrCSSRule)) {
                if (!parentSelector)
                    throw new Error('Unable to generate nested rule because parentSelector is missing');
                guardCloseRuleWrite();
                // format of { '& > span': { display: 'none' } } (or further nesting)
                var replaced = classNameOrCSSRule.replace(/&/g, parentSelector);
                for (var _e = 0, _f = replaced.split(/,\s*/); _e < _f.length; _e++) {
                    var selector = _f[_e];
                    var _g = execCreateStyles(classNameRules, options, selector), mediaQueriesOutput = _g.mediaQueriesBuffer, regularOutput = _g.sheetBuffer;
                    sheetBuffer += regularOutput;
                    mediaQueriesBuffer += mediaQueriesOutput;
                }
            }
            else if (!parentSelector && typeof classNameRules === 'object') {
                guardCloseRuleWrite();
                var generated = noGenerateClassName ? classNameOrCSSRule : generateClassName(classNameOrCSSRule);
                out[classNameOrCSSRule] = generated;
                var generatedSelector = "" + (noGenerateClassName ? '' : '.') + generated;
                var _h = execCreateStyles(classNameRules, options, generatedSelector), mediaQueriesOutput = _h.mediaQueriesBuffer, regularOutput = _h.sheetBuffer;
                sheetBuffer += regularOutput;
                mediaQueriesBuffer += mediaQueriesOutput;
            }
            else {
                if (!parentSelector)
                    throw new Error('Unable to write css props because parent selector is null');
                if (!ruleWriteOpen) {
                    sheetBuffer += parentSelector + "{" + formatCSSRules((_a = {}, _a[classNameOrCSSRule] = classNameRules, _a));
                    ruleWriteOpen = true;
                }
                else
                    sheetBuffer += formatCSSRules((_b = {}, _b[classNameOrCSSRule] = classNameRules, _b));
            }
        }
        guardCloseRuleWrite();
        return {
            classes: out,
            sheetBuffer: sheetBuffer,
            mediaQueriesBuffer: mediaQueriesBuffer
        };
    }
    function replaceBackReferences(out, sheetContents) {
        var outputSheetContents = sheetContents;
        var toReplace = [];
        var toReplaceRegex = /\$\w([a-zA-Z0-9_-]+)?/gm;
        var matches = toReplaceRegex.exec(outputSheetContents);
        while (matches) {
            toReplace.push(matches[0].valueOf());
            matches = toReplaceRegex.exec(outputSheetContents);
        }
        for (var _i = 0, toReplace_1 = toReplace; _i < toReplace_1.length; _i++) {
            var r = toReplace_1[_i];
            outputSheetContents = outputSheetContents.replace(r, "." + out[r.substring(1)]);
        }
        return getPosthooks().reduce(function (prev, hook) { return hook(prev); }, outputSheetContents);
    }
    function createSheet(sheetContents) {
        if (typeof document !== 'undefined' &&
            document.head &&
            document.head.appendChild &&
            typeof document.createElement === 'function') {
            var styleTag = document.createElement('style');
            styleTag.innerHTML = sheetContents;
            return styleTag;
        }
        return null;
    }
    function flushSheetContents(sheetContents, options) {
        var _a, _b;
        // In case we're in come weird test environment that doesn't support JSDom
        var styleTag = createSheet(sheetContents);
        if (styleTag) {
            if ((options === null || options === void 0 ? void 0 : options.insertAfter) && (options === null || options === void 0 ? void 0 : options.insertBefore)) {
                throw new Error('Both insertAfter and insertBefore were provided. Please choose only one.');
            }
            if ((_a = options === null || options === void 0 ? void 0 : options.insertAfter) === null || _a === void 0 ? void 0 : _a.after)
                options.insertAfter.after(styleTag);
            else if ((_b = options === null || options === void 0 ? void 0 : options.insertBefore) === null || _b === void 0 ? void 0 : _b.before)
                options.insertBefore.before(styleTag);
            else
                document.head.appendChild(styleTag);
        }
        return styleTag;
    }
    function coerceCreateStylesOptions(options) {
        return {
            flush: options && typeof options.flush === 'boolean' ? options.flush : true
        };
    }
    function createStyles(rules, options) {
        var coerced = coerceCreateStylesOptions(options);
        var _a = execCreateStyles(rules, coerced, null), out = _a.classes, sheetContents = _a.sheetBuffer, mediaQueriesContents = _a.mediaQueriesBuffer;
        var mergedContents = "" + sheetContents + mediaQueriesContents;
        var replacedSheetContents = replaceBackReferences(out, mergedContents);
        var sheet = null;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var updateSheet = function (updatedRules) {
            if ((((options === null || options === void 0 ? void 0 : options.flush) && sheet) || !(options === null || options === void 0 ? void 0 : options.flush)) && updatedRules) {
                // We prefer the first set, and then we shallow merge
                var _a = execCreateStyles(cjs(rules, updatedRules), { flush: false }, null), updatedOut = _a.classes, updatedSheetContents = _a.sheetBuffer, updatedMediaQueriesContents = _a.mediaQueriesBuffer;
                var updatedMergedContents = "" + updatedSheetContents + updatedMediaQueriesContents;
                var updatedReplacedSheetContents = replaceBackReferences(out, updatedMergedContents);
                if (sheet)
                    sheet.innerHTML = updatedReplacedSheetContents;
                return { classes: updatedOut, stylesheet: updatedSheetContents };
            }
            return null;
        };
        if (coerced.flush)
            sheet = flushSheetContents(replacedSheetContents, options);
        // Need this TS cast to get solid code assist from the consumption-side
        return {
            classes: out,
            stylesheet: replacedSheetContents,
            updateSheet: updateSheet
        };
    }

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

    const SCHEDULED_CALLBACKS = new Set();
    function ready(callback) {
        if (document.readyState === "complete") {
            callback();
        }
        SCHEDULED_CALLBACKS.add(callback);
    }

    let head = null;
    function getHead() {
        if (head == null) {
            head = getWindow().document.head;
        }
        return head;
    }
    function appendStyle(stylesheet) {
        const style = document.createElement("style");
        style.innerHTML = stylesheet;
        ready(() => getHead().appendChild(style));
    }
    function style(styles) {
        const { classes, stylesheet } = createStyles(styles, {});
        appendStyle(stylesheet);
        return classes;
    }
    function c(...names) {
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
    function s(map) {
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
            return c(...reversed);
        };
    }
    function toStyleCombiner(styles, additions) {
        const combined = Object.assign(Object.assign({}, additions), style(styles));
        return s(combined);
    }
    function toClassName(keyName, styles) {
        const { classes } = createStyles({ [keyName]: styles });
        return classes[keyName];
    }

    var img$4 = "data:image/svg+xml,%3csvg height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd' transform=''%3e%3cpath d='m0 0h24v24h-24z'/%3e%3cpath d='m16.304984 4.58632022c.9684135-.64559257 1.9494071-.47406533 2.7661348.34266239.7605264.76052641.9299596 1.68590662.396602 2.67640052-.0372725.06882663-.0372725.06882663-.0532706.09819906-.3295883.60514861-.3732613.81493856-.2471748 1.33367429.3091576.51207905.5132011.64336702 1.119096.76455341 1.1412747.22826881 1.7136538 1.04322411 1.7136538 2.19825151 0 1.0755468-.5345352 1.8496968-1.6121785 2.172976-.0413654.0123292-.0413654.0123292-.0663245.0197374-.024132.0071329-.024132.0071329-.0622683.01836-.6456591.1901556-.8177989.3034953-1.0961718.7616963-.1435537.5808573-.0921318.8179712.2506473 1.3321529.6455925.9684135.4740653 1.9494071-.3426624 2.7661348-.7605264.7605264-1.6859066.9299596-2.6764005.396602-.0688267-.0372725-.0688267-.0372725-.0981991-.0532706-.6051486-.3295883-.8149386-.3732613-1.3336743-.2471748-.512079.3091576-.643367.5132011-.7645534 1.119096-.2282689 1.1412747-1.0432241 1.7136538-2.1982515 1.7136538-1.0755468 0-1.8496968-.5345352-2.17297599-1.6121785-.01232925-.0413654-.01232925-.0413654-.01973743-.0663245-.00713288-.024132-.00713288-.024132-.01835997-.0622683-.1901556-.6456591-.30349534-.8177989-.76169636-1.0961718-.58085724-.1435537-.81797118-.0921318-1.3321529.2506473-.96841349.6455925-1.94940701.4740653-2.76613473-.3426624-.76052641-.7605264-.92995966-1.6859066-.39660199-2.6764005.03727249-.0688267.03727249-.0688267.05327053-.0981991.32958829-.6051486.37326129-.8149386.24717478-1.3336743-.30915753-.512079-.51320104-.643367-1.119096-.7645534-1.14127463-.2282689-1.71365373-1.0432241-1.71365373-2.1982515 0-1.0755468.53453523-1.8496968 1.61217851-2.17297599.04136533-.01232925.04136533-.01232925.06632447-.01973743.02413198-.00713288.02413198-.00713288.06226834-.01835997.64565905-.1901556.81779888-.30349534 1.09617181-.76169636.14355365-.58085724.09213178-.81797118-.25064732-1.3321529-.64559257-.96841349-.47406533-1.94940701.34266239-2.76613473.76052641-.76052641 1.68590662-.92995966 2.67640052-.39660199.06882663.03727249.06882663.03727249.09819906.05327053.60514861.32958829.81493856.37326129 1.33367429.24717478.51207905-.30915753.64336702-.51320104.76455341-1.119096.22826881-1.14127463 1.04322411-1.71365373 2.19825151-1.71365373 1.0755468 0 1.8496968.53453523 2.172976 1.61217851.0123292.04136533.0123292.04136533.0197374.06632447.0071329.02413198.0071329.02413198.01836.06226834.1901556.64565905.3034953.81779888.7616963 1.09617181.5808573.14355365.8179712.09213178 1.3321529-.25064732zm-4.738133-.51961232c-.2234405 1.11713438-.6613662 1.75435676-1.66435405 2.34583077-.114153.0673174-.23728591.11808567-.36571216.15078482-1.03148075.26262967-1.69145629.14913291-2.69416239-.39698119-.02911635-.01585825-.02911635-.01585825-.04516828-.02457839-.01674857-.00907488-.01674857-.00907488-.04598477-.02487519-.26622097-.1433536-.33389801-.13096222-.54969453.0848343-.24552655.24552655-.25352009.29124297-.11775235.49489976.63195569.94795764.77286747 1.70821671.48185254 2.83572298-.03306498.12810675-.08412242.25087974-.15164864.36465515-.54385396.91634339-1.08403254 1.30025549-2.16504871 1.61862979-.03789262.0111556-.03789262.0111556-.05919751.0174529-.02255223.0066934-.02255223.0066934-.06124991.0182249-.28961296.0868804-.32870583.1434973-.32870583.4486797 0 .3472269.02667411.3852056.26668349.4332104 1.11713438.2234405 1.75435676.6613661 2.34583077 1.664354.0673174.114153.11808567.2372859.15078482.3657122.26262967 1.0314808.14913291 1.6914563-.39698119 2.6941624-.01585825.0291163-.01585825.0291163-.02457839.0451683-.00907488.0167485-.00907488.0167485-.02487519.0459847-.1433536.266221-.13096222.3338981.0848343.5496946.24552655.2455265.29124297.2535201.49489976.1177523.94795764-.6319557 1.70821671-.7728674 2.83572298-.4818525.12810675.033065.25087974.0841224.36465515.1516486.91634339.543854 1.30025549 1.0840326 1.61862979 2.1650487.0111556.0378927.0111556.0378927.0174529.0591975.0066934.0225523.0066934.0225523.0182249.06125.0868804.2896129.1434973.3287058.4486797.3287058.3472269 0 .3852056-.0266741.4332104-.2666835.2234405-1.1171344.6613661-1.7543568 1.664354-2.3458308.114153-.0673174.2372859-.1180856.3657122-.1507848 1.0314808-.2626297 1.6914563-.1491329 2.6941624.3969812.0291163.0158582.0291163.0158582.0451683.0245784.0167485.0090749.0167485.0090749.0459847.0248752.266221.1433536.3338981.1309622.5496946-.0848343.2455265-.2455266.2535201-.291243.1177523-.4948998-.6319557-.9479576-.7728674-1.7082167-.4818525-2.835723.033065-.1281067.0841224-.2508797.1516486-.3646551.543854-.9163434 1.0840326-1.3002555 2.1650487-1.6186298.0378927-.0111556.0378927-.0111556.0591975-.0174529.0225523-.0066934.0225523-.0066934.06125-.0182249.2896129-.0868804.3287058-.1434973.3287058-.4486797 0-.3472269-.0266741-.3852056-.2666835-.4332104-1.1171344-.2234405-1.7543568-.6613662-2.3458308-1.66435405-.0673174-.114153-.1180856-.23728591-.1507848-.36571216-.2626297-1.03148075-.1491329-1.69145629.3969812-2.69416239.0158582-.02911635.0158582-.02911635.0245784-.04516828.0090749-.01674857.0090749-.01674857.0248752-.04598477.1433536-.26622097.1309622-.33389801-.0848343-.54969453-.2455266-.24552655-.291243-.25352009-.4948998-.11775235-.9479576.63195569-1.7082167.77286747-2.835723.48185254-.1281067-.03306498-.2508797-.08412242-.3646551-.15164864-.9163434-.54385396-1.3002555-1.08403254-1.6186298-2.16504871-.0111556-.03789262-.0111556-.03789262-.0174529-.05919751-.0066934-.02255223-.0066934-.02255223-.0182249-.06124991-.0868804-.28961296-.1434973-.32870583-.4486797-.32870583-.3472269 0-.3852056.02667411-.4332104.26668349zm.4331986 4.03334169c2.1539105 0 3.9 1.74608948 3.9 3.90000001 0 2.1539105-1.7460895 3.9-3.9 3.9-2.15391053 0-3.90000001-1.7460895-3.90000001-3.9 0-2.15391053 1.74608948-3.90000001 3.90000001-3.90000001zm0 1.8c-1.159798 0-2.10000001.94020201-2.10000001 2.10000001s.94020201 2.1 2.10000001 2.1 2.1-.940202 2.1-2.1-.940202-2.10000001-2.1-2.10000001z' fill='%23828a99' fill-rule='nonzero' transform='matrix(-1 0 0 -1 24.00005 24.00005)'/%3e%3c/g%3e%3c/svg%3e";

    var $gearIcon = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': img$4
    });

    var img$3 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cdefs%3e%3crect id='a' width='15' height='15' rx='3'/%3e%3c/defs%3e%3cg fill='none' fill-rule='evenodd'%3e%3cuse fill='white' xlink:href='%23a'/%3e%3crect width='14' height='14' x='.5' y='.5' stroke='%23C1C9D1' rx='3'/%3e%3c/g%3e%3c/svg%3e";

    var $checkbox = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': img$3
    });

    var img$2 = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15'%3e%3cg fill='none' fill-rule='evenodd'%3e%3crect width='15' height='15' fill='%235181B8' rx='3'/%3e%3cpath stroke='white' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round' d='M4 7.5L6.5 10 11 4.5'/%3e%3c/g%3e%3c/svg%3e";

    var $checkboxChecked = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': img$2
    });

    var img$1 = "data:image/svg+xml,%3csvg height='24' viewBox='32 126 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none'%3e%3cpath d='m32 126h24v24h-24z'/%3e%3cpath d='m39 141 2 2-.5.5-2.2.4c-.2.1-.3 0-.2-.2l.4-2.2zm1-1 7.7-7.7c.4-.4 1-.4 1.4 0l.6.6c.4.4.4 1 0 1.4l-7.7 7.7z' fill='%23828a99'/%3e%3c/g%3e%3c/svg%3e";

    var $editPen = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': img$1
    });

    var img = "data:image/svg+xml,%3csvg width='24' height='24' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3e %3cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3e %3cg%3e %3cg%3e %3cpath opacity='.04' d='M0 0h20v20H0z'%3e%3c/path%3e %3cpath d='M13.08 2c1.44 0 2.14.13 2.86.52a3.7 3.7 0 011.54 1.54c.39.72.52 1.42.52 2.86v6.16c0 1.44-.13 2.14-.52 2.86a3.7 3.7 0 01-1.54 1.54c-.72.39-1.42.52-2.86.52H6.92c-1.44 0-2.14-.13-2.86-.52a3.7 3.7 0 01-1.54-1.54c-.39-.72-.52-1.42-.52-2.86V6.92c0-1.44.13-2.14.52-2.86a3.7 3.7 0 011.54-1.54C4.78 2.13 5.48 2 6.92 2h6.16zm3.42 6h-13v5.08c0 1.21.09 1.68.35 2.15.2.4.52.71.92.92.47.26.94.35 2.15.35h6.16c1.21 0 1.68-.09 2.15-.35.4-.2.71-.52.92-.92.26-.47.35-.94.35-2.15V8zm-3.42-4.5H6.92c-1.21 0-1.68.09-2.15.35-.4.2-.71.52-.92.92-.23.42-.33.82-.35 1.73h13a3.48 3.48 0 00-.35-1.73 2.2 2.2 0 00-.92-.92c-.47-.26-.94-.35-2.15-.35z' fill='currentColor' fill-rule='nonzero'%3e%3c/path%3e %3c/g%3e %3c/g%3e %3c/g%3e%3c/svg%3e";

    var $newsfeedIcon = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': img
    });

    function makeAssetObject(asset) {
        const { default: dataURL } = asset;
        return {
            get dataURL() {
                return dataURL;
            },
            get url() {
                return `url("${dataURL.replace(/"/g, "'")}")`;
            },
            get source() {
                return decodeURI(dataURL.split(",")[1]);
            },
        };
    }
    const ICON_GEAR = makeAssetObject($gearIcon);
    const ICON_CHECKBOX = makeAssetObject($checkbox);
    const ICON_CHECKBOX_CHECKED = makeAssetObject($checkboxChecked);
    const ICON_PEN = makeAssetObject($editPen);
    const ICON_NEWSFEED = makeAssetObject($newsfeedIcon);

    function elem(selectors, scope) {
        return (scope !== null && scope !== void 0 ? scope : getWindow().document).querySelector(selectors);
    }
    function elems(selectors, scope) {
        return (scope !== null && scope !== void 0 ? scope : getWindow().document).querySelectorAll(selectors);
    }
    function insertBefore(referenceNode, newNode) {
        const { parentNode } = referenceNode;
        if (parentNode == null)
            throw new Error(ERROR_MESSAGES.noParentNode);
        parentNode.insertBefore(newNode, referenceNode);
    }
    function asArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }
    function unwrapCSSValue(value) {
        var _a, _b;
        return (_b = (_a = /^"(.+)"$|^'(.+)'$/.exec(value)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : value;
    }
    const DOM_PARSER = new DOMParser();
    function decodeDOMString(input) {
        const { documentElement } = DOM_PARSER.parseFromString(input, "text/html");
        return documentElement.textContent;
    }
    function childrenOf(element) {
        return element == null
            ? null
            : asArray(element.childNodes);
    }
    function findMatchingParent(element, match) {
        let currentParent = element;
        const nextParent = () => {
            var _a;
            currentParent = (_a = currentParent === null || currentParent === void 0 ? void 0 : currentParent.parentElement) !== null && _a !== void 0 ? _a : null;
            return currentParent;
        };
        const isMatchFunction = typeof match === "function";
        while (nextParent() != null) {
            if (isMatchFunction) {
                if (match(currentParent)) {
                    return currentParent;
                }
                continue;
            }
            if (currentParent.matches(match)) {
                return currentParent;
            }
        }
        return null;
    }
    const OBSERVATIONS = new WeakMap();
    const OBSERVE_OPTIONS_ATTRIBUTES = Object.freeze({
        subtree: false,
        childList: false,
        attributes: true,
    });
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

    const TargetContext = D(undefined);

    const BoxContext = D(null);

    const TranslationContext = D(getNavigatorTranslations());

    function useTarget() {
        return F(TargetContext);
    }
    function useBoxDetail() {
        return F(BoxContext);
    }
    function useBoxContexts() {
        const detail = useBoxDetail();
        const target = useTarget();
        return [detail, target];
    }
    function useTranslations() {
        return F(TranslationContext);
    }
    function useTranslation(tree) {
        const translation = useTranslations();
        return translation[tree];
    }

    function useForceUpdate() {
        let ret = l(0);
        if (ret == null) {
            ret = [0, () => 0];
        }
        const [, setTick] = ret;
        return A(() => {
            setTick((tick) => tick + 1);
        }, [setTick]);
    }
    function usePreventedCallback(callback) {
        return A((event) => {
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
            disconnect() {
            },
        };
        return () => state;
    }

    function isFollowing$3(treating) {
        switch (treating.kind) {
            case "friend_row":
            case "group_row": {
                return true;
            }
            default:
                return null;
        }
    }
    const GROUP_ID = /gl_groups(\d+)/;
    const FRIEND_ID = /friends_user_row(\d+)/;
    function getID$1(treating) {
        var _a;
        const { element, kind } = treating;
        switch (kind) {
            case "friend_row":
            case "group_row": {
                const isGroup = kind === "group_row";
                const regexp = isGroup ? GROUP_ID : FRIEND_ID;
                const id = (_a = regexp.exec(element.id)) === null || _a === void 0 ? void 0 : _a[1];
                if (id == null)
                    return null;
                return isGroup ? -Number(id) : Number(id);
            }
            case "bookmark": {
                const { id } = element.dataset;
                return id != null ? +Number(id) : null;
            }
            case "feed_row": {
                const postImg = elem(".post_img", element);
                if (postImg == null)
                    return null;
                const { postId } = postImg.dataset;
                if (postId == null)
                    return null;
                const [authorId] = postId.split("_");
                return Number(authorId);
            }
            default:
                return null;
        }
    }
    function getLink$3(treating) {
        var _a, _b, _c, _d, _e;
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
            case "feed_row": {
                const link = elem("a.author", element);
                return (_e = link === null || link === void 0 ? void 0 : link.href) !== null && _e !== void 0 ? _e : null;
            }
            default:
                return null;
        }
    }
    function getIcon$3(treating) {
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
                const url = icon === null || icon === void 0 ? void 0 : icon.style.backgroundImage.slice("url(".length, -")".length);
                return url != null ? unwrapCSSValue(url) : null;
            }
            case "feed_row": {
                const icon = elem(".post_image > img.post_img", element);
                return (_b = icon === null || icon === void 0 ? void 0 : icon.src) !== null && _b !== void 0 ? _b : null;
            }
            default:
                return null;
        }
    }
    function getName$3(treating) {
        var _a, _b, _c, _d;
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
            case "feed_row": {
                const link = elem("a.author", element);
                return (_d = link === null || link === void 0 ? void 0 : link.textContent) !== null && _d !== void 0 ? _d : null;
            }
            default:
                return null;
        }
    }
    function getType$1(treating) {
        if (treating.subType != null)
            return treating.subType;
        const id = getID$1(treating);
        if (id == null)
            return null;
        return id < 0 ? "public" : "profile";
    }
    const TOGGLER_HOOKS = new WeakMap();
    function getNotificationsToggler$3(treating) {
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
            case "feed_row":
                {
                    const children = childrenOf(elem(".ui_action_menu", element));
                    if (children == null)
                        break;
                    const menuItem = findWithCallback(children, "onclick", "Feed.toggleSubscription");
                    if (menuItem != null) {
                        hook = createTogglerHook(menuItem, () => menuItem.dataset.act === "1", () => menuItem.click());
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

    function isFollowing$2() {
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
    function isPrivate$2() {
        return elem(".profile_closed_wall_dummy") != null;
    }
    function getLink$2() {
        const ctx = getContext();
        const { loc, user_id: userId } = ctx.options;
        if (loc != null)
            return `/${loc}`;
        return `/id${userId}`;
    }
    function isOwn$1() {
        const topProfileLink = elem(".top_profile_link");
        if (topProfileLink == null)
            return null;
        return getLink$2() === topProfileLink.getAttribute("href");
    }
    function getIcon$2() {
        const postImg = elem(".post.own img.post_img");
        if (postImg != null)
            return postImg.src;
        const pageAvatarImg = elem("img.page_avatar_img");
        if (pageAvatarImg != null)
            return pageAvatarImg.src;
        return null;
    }
    function getName$2() {
        return decodeDOMString(getContext().options.back);
    }
    const NOTIFICATIONS_TOGGLERS$1 = new WeakMap();
    function getNotificationsToggler$2() {
        const context = getContext();
        let toggler = NOTIFICATIONS_TOGGLERS$1.get(context);
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
        NOTIFICATIONS_TOGGLERS$1.set(context, toggler);
        return toggler;
    }

    function isFollowing$1() {
        const { module } = getContext();
        switch (module) {
            case "public": {
                return getContext().options.liked;
            }
            case "groups": {
                return elem(".page_actions_btn") != null;
            }
            default:
                return null;
        }
    }
    function isPrivate$1() {
        return elem(".group_closed") != null;
    }
    function getLink$1() {
        const { module } = getContext();
        switch (module) {
            case "public": {
                return getContext().options.public_link;
            }
            case "groups": {
                const { options: { loc, group_id: groupId }, } = getContext();
                if (loc != null)
                    return `/${loc}`;
                return `/club${groupId}`;
            }
            default:
                return null;
        }
    }
    function getIcon$1() {
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
    function getName$1() {
        var _a, _b;
        return (_b = (_a = elem("h1.page_name")) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : null;
    }
    const NOTIFICATIONS_TOGGLERS = new WeakMap();
    function getNotificationsToggler$1() {
        const context = getContext();
        let toggler = NOTIFICATIONS_TOGGLERS.get(context);
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
        NOTIFICATIONS_TOGGLERS.set(context, toggler);
        return toggler;
    }

    function getLink(altTreating) {
        if (altTreating != null)
            return getLink$3(altTreating);
        if (getContext().module === "profile") {
            return getLink$2();
        }
        return getLink$1();
    }
    function getIcon(altTreating) {
        if (altTreating != null)
            return getIcon$3(altTreating);
        if (getContext().module === "profile") {
            return getIcon$2();
        }
        return getIcon$1();
    }
    function getName(altTreating) {
        if (altTreating != null)
            return getName$3(altTreating);
        if (getContext().module === "profile") {
            return getName$2();
        }
        return getName$1();
    }
    function isFollowing(altTreating) {
        if (altTreating != null)
            return isFollowing$3(altTreating);
        if (getContext().module === "profile") {
            return isFollowing$2();
        }
        return isFollowing$1();
    }
    function isPrivate(altTreating) {
        if (altTreating != null)
            return false;
        const { module } = getContext();
        switch (module) {
            case "public": {
                return true;
            }
            case "profile": {
                return isPrivate$2();
            }
            default: {
                return isPrivate$1();
            }
        }
    }
    function getID(altTreating) {
        if (altTreating != null)
            return getID$1(altTreating);
        return getContext().oid;
    }
    function isOwn(altTreating) {
        if (altTreating != null)
            return null;
        switch (getContext().module) {
            case "profile":
                return isOwn$1();
            default:
                return null;
        }
    }
    function getType(altTreating) {
        if (altTreating != null)
            return getType$1(altTreating);
        const { module } = getContext();
        switch (module) {
            case "profile":
            case "groups":
            case "public": {
                return module;
            }
            default:
                return null;
        }
    }
    function getNotificationsToggler(altTreating) {
        if (altTreating != null) {
            return getNotificationsToggler$3(altTreating);
        }
        switch (getContext().module) {
            case "public":
            case "groups": {
                return getNotificationsToggler$1();
            }
            case "profile": {
                return getNotificationsToggler$2();
            }
            default:
                return null;
        }
    }
    function getFullContext(altTreating) {
        var _a;
        const useNotifications = (_a = getNotificationsToggler(altTreating)) !== null && _a !== void 0 ? _a : createDummyTogglerHook();
        return {
            type: getType(altTreating),
            id: getID(altTreating),
            name: getName(altTreating),
            icon: getIcon(altTreating),
            link: getLink(altTreating),
            isPrivate: isPrivate(altTreating),
            isFollowed: isFollowing(altTreating),
            isOwn: isOwn(altTreating),
            useNotifications,
        };
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const DEFAULT_DESCRIPTOR = {
        configurable: true,
        enumerable: false,
    };
    function wrapProperty(obj, property, callback, descriptor = DEFAULT_DESCRIPTOR) {
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
    function getBound(obj, prop) {
        const func = obj[prop];
        return func.bind(obj);
    }
    function wrapFunction(func, callbacks, rejectChaining = false) {
        if (rejectChaining && WRAPPED_FUNCTIONS.has(func)) {
            throw new Error(ERROR_MESSAGES.wrappingWrapper);
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
            resultWrapper = function wrappedFunction(...args) {
                const { preCallback, postCallback } = callbacks;
                let beforeError = null;
                let beforeResult = null;
                let funcResult = null;
                try {
                    beforeResult = {
                        value: preCallback(...args),
                    };
                }
                catch (err) {
                    beforeError = err;
                }
                funcResult = { value: func(...args) };
                if (beforeError != null) {
                    log("error", `Callback for ${funcName} has failed:`, {
                        error: beforeError,
                        function: func,
                        callback: preCallback,
                    });
                }
                try {
                    if (beforeError == null && beforeResult != null) {
                        postCallback === null || postCallback === void 0 ? void 0 : postCallback(beforeResult.value);
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

    const EVAL = getBound(getWindow(), "eval");
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
                id: Number(id),
                isSelected() {
                    const state = states.get(id);
                    return state == null
                        ? feedListsSet[id] === 1
                        : state === 1;
                },
                toggle(isUsed) {
                    const state = isUsed ? 1 : -1;
                    states.set(id, state);
                },
            });
        }
        return lists;
    }
    function ensureOptions(options) {
        return (options != null &&
            options.feedLists != null &&
            options.feedListsSet != null &&
            options.feedListsHash != null &&
            options.feedListsChanges != null);
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
                throw new Error(ERROR_MESSAGES.noOrInvalidContext);
            }
            let { options } = ctx;
            const associatedId = options != null ? LISTS_ID_MAPS.get(options) : null;
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
                throw new Error(ERROR_MESSAGES.noOrInvalidContext);
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
        const progressHolder = s$1(null);
        const [isMounted, setMounted] = l(false);
        y(() => {
            const holder = progressHolder.current;
            if (holder == null || isMounted)
                return;
            getWindow().showProgress(holder);
            setMounted(true);
        }, [progressHolder, isMounted]);
        return (v$1("div", { ref: progressHolder, className: c(className, CENTERED_CLASS, centered !== null && centered !== void 0 ? centered : false), style: style }));
    }

    function ErrorBlock(props) {
        const className = c("error", props.className);
        return v$1("div", Object.assign({}, props, { className: className }));
    }

    const STYLE$2 = toStyleCombiner({
        noMargin: {
            margin: "0",
        },
    }, {
        separator: "top_profile_sep",
    });
    function Separator(props) {
        const { noMargin } = props;
        return (v$1("div", { className: STYLE$2("separator", "noMargin", noMargin !== null && noMargin !== void 0 ? noMargin : false) }));
    }

    const ITEM_HIGHLIGHT = toClassName("olistHighlight", {
        backgroundColor: "#e1e5eb",
    });
    const TOOLTIP_HIDE_TIME = 5000;
    function editList(listId, context, translation, preSelect = true) {
        const { id, icon, name, link } = context;
        if (id == null || icon == null || name == null || link == null) {
            log("warn", "[createList] Not sufficient data", {
                id,
                icon,
                name,
                link,
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
        const { listCreation: { highlightTooltip }, } = translation;
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
                selected[target.id] = preSelect ? 1 : 0;
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
                (_a = window.feed) === null || _a === void 0 ? void 0 : _a.editList(listId);
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
    const LOCK_COMBO = c(DISABLED, POINTER_LOCKED);
    const ERROR_MULTILINE = SHARED_STYLES.errorMultiline;
    const MARGIN_RESET = SHARED_STYLES.marginReset;
    c(MARGIN_RESET, ERROR_MULTILINE);

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
                const noChanges = invoker === lastInvoker && target === lastTarget;
                if (noChanges)
                    return state;
                return Object.assign(Object.assign({}, state), { loadingStatus: "reset", lastInvoker: invoker, lastTarget: target, lists: undefined });
            }
            default:
                return Object.assign({}, state);
        }
    }
    const DEFAULT_STATE = Object.freeze({
        loadingStatus: "initial",
    });
    function useLoaderReducer() {
        return p(listsReducer, DEFAULT_STATE);
    }

    const S$1 = toStyleCombiner({
        label: { cursor: "pointer" },
        checkbox: {
            marginBottom: "10px",
            lineHeight: "15px",
            width: "max-content",
            cursor: "pointer",
            transition: ".25s ease",
            "& input[type=checkbox]+label::before": {
                display: "block",
                content: "''",
                float: "left",
                background: `${ICON_CHECKBOX.url} no-repeat 0`,
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
                backgroundImage: ICON_CHECKBOX_CHECKED.url,
            },
            ["&:hover label::before," +
                "& input[type=checkbox]+label:hover::before," +
                "& input[type=checkbox]:focus+label::before"]: {
                filter: "brightness(95%)",
            },
            ["&:active label:before," +
                "& input[type=checkbox]+label:active::before"]: {
                filter: "brightness(90%)",
            },
        },
    }, {
        locked: LOCK_COMBO,
    });
    function CheckboxRow(props) {
        var _a, _b;
        const { text, id, onChange } = props;
        const isChecked = (_a = props.checked) !== null && _a !== void 0 ? _a : false;
        const isDisabled = (_b = props.disabled) !== null && _b !== void 0 ? _b : false;
        const inputRef = s$1(null);
        const onClick = () => {
            if (isDisabled)
                return;
            const newValue = !isChecked;
            onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
        };
        const onLabelClick = A((e) => {
            var _a;
            e.preventDefault();
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }, []);
        return (v$1("div", { onClick: onClick, className: S$1("checkbox", "locked", isDisabled) },
            v$1("input", { id: id, className: "blind_label", type: "checkbox", checked: isChecked, disabled: isDisabled, ref: inputRef }),
            v$1("label", { htmlFor: id, className: S$1("label"), onClick: onLabelClick, children: text })));
    }

    var IDX=256, HEX=[], SIZE=256, BUFFER;
    while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

    function uid(len) {
    	var i=0, tmp=(len || 11);
    	if (!BUFFER || ((IDX + tmp) > SIZE*2)) {
    		for (BUFFER='',IDX=0; i < SIZE; i++) {
    			BUFFER += HEX[Math.random() * 256 | 0];
    		}
    	}

    	return BUFFER.substring(IDX, IDX++ + tmp);
    }

    const ID_RANDOMNESS_LENGTH = 5;
    function createTooltipId() {
        return `tooltip_${uid(ID_RANDOMNESS_LENGTH)}`;
    }
    function useTooltipPreps(opts) {
        const tooltipId = d(createTooltipId, [opts]);
        const [tooltipRef] = l({});
        const destroyTooltip = A(() => {
            var _a;
            (_a = tooltipRef.current) === null || _a === void 0 ? void 0 : _a.destroy();
        }, [tooltipRef]);
        const setTooltip = A((tt) => {
            destroyTooltip();
            tooltipRef.current = tt;
            tt.container.setAttribute("role", "tooltip");
            tt.container.setAttribute("id", tooltipId);
        }, [destroyTooltip, tooltipRef, tooltipId]);
        const tooltipOptions = d(() => (Object.assign(Object.assign({}, opts), { init: opts.init != null
                ? (tt) => {
                    var _a;
                    (_a = opts.init) === null || _a === void 0 ? void 0 : _a.call(opts, tt);
                    setTooltip(tt);
                }
                : setTooltip })), [opts, setTooltip]);
        const showTooltip = A((e) => {
            getWindow().showTooltip(e.target, tooltipOptions);
        }, [tooltipOptions]);
        const hideTooltip = A(() => {
            var _a;
            (_a = tooltipRef.current) === null || _a === void 0 ? void 0 : _a.hide();
        }, [tooltipRef]);
        return {
            tooltipId,
            showTooltip,
            hideTooltip,
            destroyTooltip,
        };
    }
    const TOOLTIP_NOT_ELEMENT = "Tooltip element must have only one child that is valid Preact element";
    function Tooltip(props) {
        const { children, opts } = props;
        const { showTooltip, hideTooltip, destroyTooltip, tooltipId } = useTooltipPreps(opts);
        if (!i$1(children)) {
            throw new Error(TOOLTIP_NOT_ELEMENT);
        }
        y(() => destroyTooltip, [destroyTooltip]);
        const { onMouseOver, onFocus, onBlur, "aria-describedby": ariaBy, } = children.props;
        return B(children, {
            onMouseOver: onMouseOver != null
                ? wrapFunction(onMouseOver, showTooltip)
                : showTooltip,
            onFocus: onFocus != null ? wrapFunction(onFocus, showTooltip) : showTooltip,
            onBlur: onBlur != null ? wrapFunction(onBlur, hideTooltip) : hideTooltip,
            "aria-describedby": ariaBy != null ? `${ariaBy} ${tooltipId}` : tooltipId,
        });
    }
    function Title(props) {
        const { text, shift, opts, children } = props;
        const $opts = d(() => (Object.assign({ text, black: true, shift }, opts)), [text, shift, opts]);
        return v$1(Tooltip, { opts: $opts }, children);
    }

    const EDIT_BUTTON_CLASS = toClassName("editListButton", {
        border: 0,
        padding: 0,
        margin: 0,
        background: "none",
        cursor: "pointer",
        opacity: ".3",
        transition: "opacity .05s ease",
        height: "15px",
        "&:hover, &:focus": { opacity: 1 },
        "& img": { height: "19px" },
    });
    function EditListButton(props) {
        const { list } = props;
        const translation = useTranslations();
        const { text, icon } = translation.editListButton;
        const target = useTarget();
        const label = d(() => text.replace("{}", list.name), [text, list]);
        const onClick = A(() => {
            if (target == null)
                return;
            editList(list.id, target, translation, list.isSelected());
        }, [list, target, translation]);
        return (v$1(Title, { text: label },
            v$1("button", { className: EDIT_BUTTON_CLASS, onClick: onClick, children: v$1("img", { src: ICON_PEN.dataURL, alt: icon }) })));
    }

    const LIST_ROW_CLASS = toClassName("listRow", {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        [`&:hover .${EDIT_BUTTON_CLASS}`]: {
            opacity: 1,
        },
    });
    function ListRow(props) {
        const { list, disabled } = props;
        const listSelected = list.isSelected();
        const update = useForceUpdate();
        const onChange = A((newValue) => {
            list.toggle(newValue);
            update();
        }, [list, update]);
        return (v$1("li", { className: LIST_ROW_CLASS },
            v$1(CheckboxRow, { checked: listSelected, text: list.name, onChange: onChange, disabled: disabled, id: `list${list.id}` }),
            v$1(EditListButton, { list: list })));
    }

    const GRAY_NOTICE = toClassName("grayNotice", { color: "#656565" });
    const LISTS_LIST_CLASS = toClassName("listsList", {
        listStyle: "none",
        padding: 0,
        margin: 0,
    });
    function ListsRender(props) {
        const { lists, disabled } = props;
        const { empty } = useTranslation("lists");
        if (lists.length === 0) {
            return v$1("div", { className: GRAY_NOTICE }, empty);
        }
        return (v$1("ul", { className: LISTS_LIST_CLASS }, lists.map((list) => (v$1(ListRow, { list: list, disabled: disabled, key: list.id })))));
    }

    const LINK_BUTTON_CLASS = toClassName("linkButton", {
        background: "none",
        border: "none",
        font: "inherit",
        color: "#2a5885",
        cursor: "pointer",
        padding: "inherit",
        "&:hover, &:focus": { textDecoration: "underline" },
    });
    function LinkButton(props) {
        const { className } = props;
        return v$1("button", Object.assign({}, props, { className: c(LINK_BUTTON_CLASS, className) }));
    }

    const PLUS_ICON = "/images/icons/filter_add.png";
    const STYLE$1 = toStyleCombiner({
        button: {
            marginTop: "10px",
            width: "max-content",
            lineHeight: "17px",
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
    const CENTER_TOOLTIP = { center: true };
    function AddListButton(props) {
        var _a;
        const { onClick } = props;
        const disabled = (_a = props.disabled) !== null && _a !== void 0 ? _a : false;
        const onLinkClick = usePreventedCallback(disabled ? null : onClick);
        const { addListButton: translation } = F(TranslationContext);
        return (v$1(Title, { text: translation.tooltip, shift: TOOLTIP_OFFSETS, opts: CENTER_TOOLTIP },
            v$1(LinkButton, { onClick: onLinkClick, className: STYLE$1("button", "locked", disabled), children: translation.text })));
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
        const reference = invoker != null ? invoker.subType : context.module;
        const text = byContext((() => {
            switch (reference) {
                case "groups":
                    return "group";
                case "profile":
                    return "profile";
                case "public":
                    return "public";
                default: {
                    switch (invoker === null || invoker === void 0 ? void 0 : invoker.kind) {
                        case "bookmark":
                            return "bookmark";
                    }
                    return "other";
                }
            }
        })());
        return v$1("div", { className: DEFAULT_MARGIN }, text);
    }

    const PROGRESS_INDICATOR_SIZE = 6;
    function ListLoader(props) {
        const { disabled } = props;
        const [$detail, target] = useBoxContexts();
        const detail = $detail;
        const translation = useTranslations();
        const [state, dispatch] = useLoaderReducer();
        const { invoker } = detail;
        y(() => {
            dispatch(targetChange(target, invoker));
        }, [dispatch, target, invoker]);
        y(() => {
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
        const onAddList = A(() => {
            if (target == null)
                return;
            const result = editList(-1, target, translation);
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
                return (v$1(ErrorBlock, { className: c(MARGIN_RESET, ERROR_MULTILINE), children: loadFailed }));
            }
            return (v$1(ProgressIndicator, { centered: true, className: dotsSize(PROGRESS_INDICATOR_SIZE), style: "padding: 10px 0;" }));
        }
        return (v$1(d$1, null,
            v$1(ActionLabel, null),
            v$1(ListsRender, { disabled: disabled, lists: lists.lists }),
            v$1(Separator, { noMargin: true }),
            v$1(AddListButton, { disabled: disabled, onClick: onAddList })));
    }

    const GENERIC_CAMERA_ICON = "https://vk.com/images/camera_50.png?ava=1";

    const S = toStyleCombiner({
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
            objectFit: "cover",
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
        var _a, _b;
        const translation = useTranslation("infoBlock");
        const { displayName, link, infoChildren } = props;
        const disabled = (_a = props.disabled) !== null && _a !== void 0 ? _a : false;
        const avatarUrl = (_b = props.avatarUrl) !== null && _b !== void 0 ? _b : GENERIC_CAMERA_ICON;
        const avatarAlt = translation.avatarAlt.replace("{}", displayName);
        const onClick = disabled ? NO_CLICK : undefined;
        return (v$1("div", { className: S("infoBlock", "clearfix") },
            v$1("a", { className: S("leftFloat", "locked", disabled), href: link, onClick: onClick },
                v$1("img", { className: S("targetAvatar"), src: avatarUrl, alt: avatarAlt })),
            v$1("div", { className: S("leftFloat", "targetInfo") },
                v$1("div", { className: S("targetName") },
                    v$1("a", { href: link, onClick: onClick }, displayName)),
                v$1("div", { className: S("leftFloat", "infoText") }, infoChildren))));
    }

    function FollowText() {
        var _a;
        const [detail, target] = useBoxContexts();
        const translation = useTranslation("followStatus");
        if (detail == null || target == null)
            return v$1(d$1, null);
        const { invoker } = detail;
        const context = detail.context;
        const { isFollowed, isOwn } = target;
        if (isOwn != null && isOwn) {
            return v$1(d$1, null, translation.context.own);
        }
        const select = isFollowed == null ? null : Number(isFollowed);
        const text = select != null
            ? (_a = (() => {
                const { context: translations } = translation;
                const reference = invoker != null ? invoker.subType : context.module;
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
                    default:
                        return null;
                }
            })()) === null || _a === void 0 ? void 0 : _a[select]
            : translation.unknown;
        return v$1(d$1, null, text);
    }

    const HINT_TOOLTIP_SHIFT = [22, 10];
    const HINT_TOOLTIP_SLIDE = 10;
    function Hint(props) {
        const { style, className, hintOptions, text } = props;
        const tooltipOptions = d(() => (Object.assign({ text, dir: "auto", center: true, className, shift: HINT_TOOLTIP_SHIFT, slide: HINT_TOOLTIP_SLIDE }, hintOptions)), [className, hintOptions, text]);
        return (v$1(Tooltip, { opts: tooltipOptions },
            v$1("span", { className: "hint_icon", style: style, tabIndex: 0 })));
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
    const INDICATOR = c(dotsSize(4), INDICATOR_STYLES);
    function NotificationsToggle() {
        const translation = useTranslation("notificationsStatus");
        const { useNotifications } = useTarget();
        const notifications = useNotifications();
        const { disconnect } = notifications;
        y(() => disconnect, [disconnect]);
        if (notifications.isAvailable === "no")
            return null;
        const { isToggling, toggle } = notifications;
        const progressIndicator = isToggling ? (v$1(d$1, null,
            v$1(ProgressIndicator, { className: INDICATOR }))) : null;
        return (v$1(LinkButton, { onClick: toggle },
            translation[Number(notifications.isToggled)],
            progressIndicator));
    }

    const TOOLTIP_SHIFT = [-8, 10];
    const TOOLTIP_CLASS = toClassName("tooltip", { width: "250px" });
    function FollowHint() {
        const { hint } = useTranslation("followStatus");
        return (v$1(Hint, { text: hint, className: TOOLTIP_CLASS, hintOptions: {
                shift: TOOLTIP_SHIFT,
                center: true,
            }, style: {
                margin: "0 20px 0 5px",
            } }));
    }
    function InfoFragment() {
        return (v$1(d$1, null,
            v$1(FollowText, null),
            v$1(FollowHint, null),
            v$1("br", null),
            v$1(NotificationsToggle, null)));
    }
    function TargetInfo() {
        var _a, _b;
        const target = useTarget();
        if (target == null)
            return null;
        return (v$1(InfoBlock, { avatarUrl: target.icon, displayName: (_a = target.name) !== null && _a !== void 0 ? _a : "", infoChildren: v$1(InfoFragment, null), link: (_b = target.link) !== null && _b !== void 0 ? _b : "" }));
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
                default:
                    return null;
            }
        })();
        if (text == null)
            return null;
        return (v$1(ErrorBlock, { className: c(MARGIN_RESET, ERROR_MULTILINE), style: { marginTop: "10px" }, children: text }));
    }

    function BoxContent() {
        const { context, invoker } = F(BoxContext);
        const target = d(() => getFullContext(invoker), [context, invoker]);
        return (v$1(TargetContext.Provider, { value: target },
            v$1(TargetInfo, null),
            v$1(ListLoader, null),
            v$1(TargetPrivateWarning, null)));
    }

    const TAG = "!!";
    const LINK_PLACEHOLDER = `{${Math.random()}`;
    function wrapText(text) {
        let link;
        {
            const lPos = text.indexOf(TAG) + TAG.length;
            const linkText = text.slice(lPos, text.indexOf(TAG, lPos));
            link = (v$1("a", { href: "__report_link__", target: "_blank", rel: "noreferrer", children: linkText }));
            text = text.replace(`${TAG}${linkText}${TAG}`, LINK_PLACEHOLDER);
        }
        const chunks = text.split("\n");
        let first = true;
        const result = [];
        for (const chunk of chunks) {
            if (first)
                first = false;
            else
                result.push(v$1("br", null));
            if (chunk === "")
                continue;
            if (chunk.includes(LINK_PLACEHOLDER)) {
                const [before, after] = chunk.split(LINK_PLACEHOLDER);
                result.push(before, link, after);
                continue;
            }
            result.push(v$1("label", null, chunk));
        }
        return result;
    }
    function ErrorBoundary(props) {
        const { children } = props;
        const [error] = q(((err) => {
            log("error", "%cError boundary caught an error%c", "font-weight: bold;", "", err);
        }));
        const { errorBoundary: { text }, } = getVKTranslation();
        if (error != null) {
            return (v$1(ErrorBlock, { className: c(MARGIN_RESET, ERROR_MULTILINE), children: wrapText(text) }));
        }
        return v$1(d$1, null, children);
    }

    function hasFlag(flags, flag) {
        return (flags & flag) === flag;
    }

    var ButtonClass;
    (function (ButtonClass) {
        ButtonClass["Locked"] = "flat_btn_lock";
        ButtonClass["Disabled"] = "button_disabled";
    })(ButtonClass || (ButtonClass = {}));
    const BUTTON_DISABLE = [POINTER_LOCKED, ButtonClass.Disabled];
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
        fadeIn: 200,
        fadeOut: 1500,
        still: 500,
    };
    const COLOR = {
        red: toClassName("colorRed", { color: "#bd3232" }),
        gray: toClassName("colorGray", { color: "#606060" }),
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
        controlsTextNode.classList.toggle(COLOR.red, color === "red");
        controlsTextNode.classList.toggle(COLOR.gray, color === "gray");
        const { fadeIn, fadeOut } = getWindow();
        store.animation = fadeIn(controlsTextNode, {
            duration: 150,
            onComplete() {
                store.animation = undefined;
                store.timeout = setTimeout(() => {
                    store.timeout = undefined;
                    store.animation = fadeOut(controlsTextNode, {
                        duration: ANIMATION_TIMINGS.fadeOut,
                        onComplete() {
                            store.animation = undefined;
                        },
                    });
                }, ANIMATION_TIMINGS.still);
            },
        });
    }

    function getBoxContainer(box) {
        return findMatchingParent(box.bodyNode, ".popup_box_container");
    }
    function initializeShortcuts(box, callbacks) {
        const handler = (e) => {
            switch (e.key) {
                case "Enter":
                    {
                        if (!e.ctrlKey)
                            break;
                        callbacks.onSave(e);
                    }
                    break;
            }
        };
        const boxContainer = getBoxContainer(box);
        if (boxContainer == null)
            return () => {
            };
        boxContainer.addEventListener("keyup", handler);
        return () => boxContainer.removeEventListener("keyup", handler);
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
            setButtonState(saveButton, isSaving ? 6 : 2);
            setButtonState(cancelButton, isSaving ? 4 : 2);
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
        const saveHandler = (e) => __awaiter(this, void 0, void 0, function* () {
            yield saveLists(!e.shiftKey);
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
        saveButton = box.addButton(lang.box_save, (_, e) => saveHandler(e), "ok", true);
        setButtonState(saveButton, 4);
        cancelButton = box.addButton(lang.box_cancel, undefined, "gray", true);
        initializeShortcuts(box, {
            onSave: saveHandler,
        });
        const setLists = ($lists) => {
            if ($lists != null)
                lists = $lists;
            setButtonState(saveButton, $lists == null ? 4 : 2);
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

    let contentWrap = null;
    function Box(props) {
        const { detail } = props;
        const translation = d(getVKTranslation, []);
        return (v$1(ErrorBoundary, null,
            v$1(TranslationContext.Provider, { value: translation },
                v$1(BoxContext.Provider, { value: detail },
                    v$1(BoxContent, null)))));
    }
    function addContentWrap(box, detail) {
        if (contentWrap == null) {
            contentWrap = document.createElement("div");
        }
        box.content(contentWrap);
        S$2(v$1(Box, { detail: detail }), contentWrap);
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
        const isDetailUpdated = detail == null || detail.context !== ctx || detail.invoker !== invoker;
        if (isDetailUpdated) {
            detail = Object.assign(Object.assign(Object.assign({}, detailBasis), detail), { context: ctx, invoker });
        }
        addContentWrap(box, detail);
    }

    const ACTION_BUTTON_ACCENT = "#3f3f3f";
    const STYLE = toStyleCombiner({
        actionMenuItem: {
            cursor: "pointer",
            color: `${ACTION_BUTTON_ACCENT} !important`,
            background: "none",
            border: "none",
            textAlign: "left",
            font: "inherit",
            width: "100%",
            "&::before": {
                "--icon": ICON_GEAR.url,
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
    const CLASS_NAME = STYLE("vkActionMenuItem", "actionMenuItem");
    function ActionButton() {
        const onClick = A(() => showBox(undefined), []);
        return (v$1("button", { className: CLASS_NAME, onClick: onClick }, getVKTranslation().actionButton.text));
    }
    let mountFunction$1 = null;
    function getRoaming$1() {
        if (mountFunction$1 == null) {
            mountFunction$1 = asRoaming(() => v$1(ActionButton, null));
        }
        return mountFunction$1;
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

    const MOUNT_ACTION_BUTTON = getRoaming$1();
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
    function prepare$2() {
        if (lazyToggle(IS_INJECTED, true)) {
            throw new Error(ERROR_MESSAGES.alreadyInjected);
        }
        setupInitInterceptors([
            ["public", injectActionButton],
            ["Groups", injectActionButton],
        ]);
    }

    const ICON_CONTENTS = ICON_NEWSFEED.source;
    function ProfileMenuItem() {
        const { actionButton: translation } = getVKTranslation();
        const onClick = A(() => showBox(undefined), []);
        return (v$1("a", { className: "PageActionCell", tabIndex: 0, role: "link", onClick: onClick },
            v$1("div", { className: "PageActionCell__icon", dangerouslySetInnerHTML: {
                    __html: ICON_CONTENTS,
                } }),
            v$1("span", { className: "PageActionCell__label" }, translation.text)));
    }
    function getRoaming() {
        return asRoaming(v$1(ProfileMenuItem, null));
    }

    const CONTAINER = ".profile_actions > .page_actions_expanded";
    const MOUNT_MENU_ITEM$1 = getRoaming();
    function mountMenuItem() {
        var _a, _b;
        const container = elem(CONTAINER);
        if (container == null)
            return;
        let referenceElement = (_a = elem(".PageActionCellSeparator", container)) === null || _a === void 0 ? void 0 : _a.nextElementSibling;
        referenceElement !== null && referenceElement !== void 0 ? referenceElement : (referenceElement = (_b = container.firstElementChild) === null || _b === void 0 ? void 0 : _b.nextElementSibling);
        if (referenceElement == null)
            return;
        MOUNT_MENU_ITEM$1((menuItem) => {
            insertBefore(referenceElement, menuItem);
        }, undefined);
    }
    function prepare$1() {
        setupInitInterceptors([["Profile", mountMenuItem]]);
    }

    function ActionsMenuItem(props) {
        const { invoker } = props;
        const onClick = A(() => showBox(invoker), [invoker]);
        const { actionsMenuItem: { context }, } = getVKTranslation();
        let itemText = null;
        switch (invoker.kind) {
            case "feed_row":
                itemText = context.feedRow;
                break;
            default:
                itemText = context.default;
                break;
        }
        return (v$1("a", { className: "ui_actions_menu_item", role: "link", tabIndex: 0, onClick: onClick, children: itemText }));
    }
    let mountFunction = null;
    function getReplicable() {
        if (mountFunction == null) {
            mountFunction = asReplicable((props) => v$1(ActionsMenuItem, Object.assign({}, props)));
        }
        return mountFunction;
    }

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing. The function also has a property 'clear' 
     * that is a function which will clear the timer to prevent previously scheduled executions. 
     *
     * @source underscore.js
     * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
     * @param {Function} function to wrap
     * @param {Number} timeout in ms (`100`)
     * @param {Boolean} whether to execute at the beginning (`false`)
     * @api public
     */

    function debounce(func, wait, immediate){
      var timeout, args, context, timestamp, result;
      if (null == wait) wait = 100;

      function later() {
        var last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      }
      var debounced = function(){
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };

      debounced.clear = function() {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      };
      
      debounced.flush = function() {
        if (timeout) {
          result = func.apply(context, args);
          context = args = null;
          
          clearTimeout(timeout);
          timeout = null;
        }
      };

      return debounced;
    }
    // Adds compatibility for ES modules
    debounce.debounce = debounce;

    var debounce_1 = debounce;

    const MOUNT_MENU_ITEM = getReplicable();
    function getMenuDisposition(menu, kind) {
        switch (kind) {
            case "friend_row":
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
        const disposition = getMenuDisposition(menu, invoker.kind);
        if (disposition == null) {
            log("warn", "Not injecting menu item: was unable to find optimal disposition");
            return;
        }
        MOUNT_MENU_ITEM(disposition, { invoker });
    }
    function getBookmarksType() {
        const currentURL = new URL(getWindow().location.href);
        const currentType = currentURL.searchParams.get("type");
        switch (currentType) {
            case "group":
                return "groups";
            case "user":
                return "profile";
            default:
                return null;
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
            if (args.length === 0)
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
        const container = elem(kind === "group_row" ? ".groups_list" : "#friends_list");
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
    const HANDLED_POSTS = new WeakSet();
    const HANDLE_DEBOUNCE = 50;
    function onFeedRefresh() {
        const posts = elems(".feed_row .post");
        for (const post of asArray(posts)) {
            if (HANDLED_POSTS.has(post))
                continue;
            injectActionsMenuItem({
                element: post,
                kind: "feed_row",
            });
            HANDLED_POSTS.add(post);
        }
    }
    function addFeedRefreshHandler() {
        const feedModule = getWindow().feed;
        if (feedModule == null)
            return;
        Reflect.set(feedModule, "onPostLoaded", wrapFunction(getBound(feedModule, "onPostLoaded"), debounce_1(onFeedRefresh, HANDLE_DEBOUNCE)));
    }
    const INTERCEPTORS = [
        ["GroupsList", () => mountRowsListMenuItems("group_row")],
        ["Bookmarks", mountBookmarksListMenuItems],
        ["Friends", () => mountRowsListMenuItems("friend_row")],
        ["feed", addFeedRefreshHandler],
    ];
    function prepare() {
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
    const CURRENT_VERSION = "3.0.0--1630695059145";
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
    prepare$2();
    prepare$1();
    prepare();
    getWindow().addEventListener("load", () => {
        checkVersion()
            .then(() => log("info", "Version check complete!"))
            .catch((err) => log("error", "Version check failed", err));
    });
    log("info", "Ready.");

}());

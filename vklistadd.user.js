// ==UserScript==
// @name VK List Add
// @description Implements a darky button to add communities to feed lists without subscribing to them
// @version 1.0.0
// @author Sasha_Sorokin
// @supportURL https://github.com/Sasha-Sorokin/vkaintegra/issues
// @run-at document-start
// @include https://vk.com/*
// @noframes
// @grant unsafeWindow
// ==/UserScript==

(function injectHiddenSubscription() {
    /**
     * Collection of symbols for other collections
     */
    const SYMBOLS = {
        CHECKBOX_CSS: Symbol("checkboxesCss"),
        ACTION_BUTTON_CSS: Symbol("actionButtonCss"),
        IS_WRAPPED: Symbol("isWrapped"),
        WRAPPER_CALLBACK: Symbol("wrapperCallback"),
        INITIALIZED_STYLES: Symbol("initializedStyles"),
        RU_LOCALES_IDS: Symbol("ruLocaleIds"),
        DIALOG_ACTION_BUTTON: Symbol("dialogActionButton"),
        DIALOG_MENU_ITEM: Symbol("dialogMenuItem"),
        DIALOG_HINT: Symbol("dialogHint"),
        DIALOG_LABEL: Symbol("dialogLabel"),
    };

    /**
     * Collection of the CSS related stuff
     */
    const STYLES = {
        /**
         * CSS styles for the checkboxes in the manage lists box
         */
        [SYMBOLS.CHECKBOX_CSS]: `.vklistadd_container label {
            cursor: pointer
        }
        
        .vklistadd_container input[type=checkbox]+label:before {
            display: block;
            content: '';
            float: left;
            background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cdefs%3E%3Crect%20id%3D%22a%22%20width%3D%2215%22%20height%3D%2215%22%20rx%3D%223%22%2F%3E%3C%2Fdefs%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cuse%20fill%3D%22%23FFF%22%20xlink%3Ahref%3D%22%23a%22%2F%3E%3Crect%20width%3D%2214%22%20height%3D%2214%22%20x%3D%22.5%22%20y%3D%22.5%22%20stroke%3D%22%23C1C9D1%22%20rx%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") no-repeat 0;
            margin: 0 7px 0 0;
            width: 15px;
            height: 15px
        }
        
        .vklistadd_container input[type=checkbox]:disabled+label,.vklistadd_container input[type=checkbox]:disabled+label:before {
            cursor: default;
            opacity: 0.5;
            filter: alpha(opacity=50)
        }
        
        .vklistadd_container input[type=checkbox]:checked+label:before {
            background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20width%3D%2215%22%20height%3D%2215%22%20fill%3D%22%235181B8%22%20rx%3D%223%22%2F%3E%3Cpath%20stroke%3D%22%23FFF%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M4%207.5L6.5%2010%2011%204.5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\")
        }`,
        /**
         * CSS styles for the action button in the group menu
         */
        [SYMBOLS.ACTION_BUTTON_CSS]: `.page_menu_group_lists:before {
            --lists_mask: url("data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20transform%3D%22%22%3E%3Cpath%20d%3D%22m0%200h24v24h-24z%22%2F%3E%3Cpath%20d%3D%22m16.304984%204.58632022c.9684135-.64559257%201.9494071-.47406533%202.7661348.34266239.7605264.76052641.9299596%201.68590662.396602%202.67640052-.0372725.06882663-.0372725.06882663-.0532706.09819906-.3295883.60514861-.3732613.81493856-.2471748%201.33367429.3091576.51207905.5132011.64336702%201.119096.76455341%201.1412747.22826881%201.7136538%201.04322411%201.7136538%202.19825151%200%201.0755468-.5345352%201.8496968-1.6121785%202.172976-.0413654.0123292-.0413654.0123292-.0663245.0197374-.024132.0071329-.024132.0071329-.0622683.01836-.6456591.1901556-.8177989.3034953-1.0961718.7616963-.1435537.5808573-.0921318.8179712.2506473%201.3321529.6455925.9684135.4740653%201.9494071-.3426624%202.7661348-.7605264.7605264-1.6859066.9299596-2.6764005.396602-.0688267-.0372725-.0688267-.0372725-.0981991-.0532706-.6051486-.3295883-.8149386-.3732613-1.3336743-.2471748-.512079.3091576-.643367.5132011-.7645534%201.119096-.2282689%201.1412747-1.0432241%201.7136538-2.1982515%201.7136538-1.0755468%200-1.8496968-.5345352-2.17297599-1.6121785-.01232925-.0413654-.01232925-.0413654-.01973743-.0663245-.00713288-.024132-.00713288-.024132-.01835997-.0622683-.1901556-.6456591-.30349534-.8177989-.76169636-1.0961718-.58085724-.1435537-.81797118-.0921318-1.3321529.2506473-.96841349.6455925-1.94940701.4740653-2.76613473-.3426624-.76052641-.7605264-.92995966-1.6859066-.39660199-2.6764005.03727249-.0688267.03727249-.0688267.05327053-.0981991.32958829-.6051486.37326129-.8149386.24717478-1.3336743-.30915753-.512079-.51320104-.643367-1.119096-.7645534-1.14127463-.2282689-1.71365373-1.0432241-1.71365373-2.1982515%200-1.0755468.53453523-1.8496968%201.61217851-2.17297599.04136533-.01232925.04136533-.01232925.06632447-.01973743.02413198-.00713288.02413198-.00713288.06226834-.01835997.64565905-.1901556.81779888-.30349534%201.09617181-.76169636.14355365-.58085724.09213178-.81797118-.25064732-1.3321529-.64559257-.96841349-.47406533-1.94940701.34266239-2.76613473.76052641-.76052641%201.68590662-.92995966%202.67640052-.39660199.06882663.03727249.06882663.03727249.09819906.05327053.60514861.32958829.81493856.37326129%201.33367429.24717478.51207905-.30915753.64336702-.51320104.76455341-1.119096.22826881-1.14127463%201.04322411-1.71365373%202.19825151-1.71365373%201.0755468%200%201.8496968.53453523%202.172976%201.61217851.0123292.04136533.0123292.04136533.0197374.06632447.0071329.02413198.0071329.02413198.01836.06226834.1901556.64565905.3034953.81779888.7616963%201.09617181.5808573.14355365.8179712.09213178%201.3321529-.25064732zm-4.738133-.51961232c-.2234405%201.11713438-.6613662%201.75435676-1.66435405%202.34583077-.114153.0673174-.23728591.11808567-.36571216.15078482-1.03148075.26262967-1.69145629.14913291-2.69416239-.39698119-.02911635-.01585825-.02911635-.01585825-.04516828-.02457839-.01674857-.00907488-.01674857-.00907488-.04598477-.02487519-.26622097-.1433536-.33389801-.13096222-.54969453.0848343-.24552655.24552655-.25352009.29124297-.11775235.49489976.63195569.94795764.77286747%201.70821671.48185254%202.83572298-.03306498.12810675-.08412242.25087974-.15164864.36465515-.54385396.91634339-1.08403254%201.30025549-2.16504871%201.61862979-.03789262.0111556-.03789262.0111556-.05919751.0174529-.02255223.0066934-.02255223.0066934-.06124991.0182249-.28961296.0868804-.32870583.1434973-.32870583.4486797%200%20.3472269.02667411.3852056.26668349.4332104%201.11713438.2234405%201.75435676.6613661%202.34583077%201.664354.0673174.114153.11808567.2372859.15078482.3657122.26262967%201.0314808.14913291%201.6914563-.39698119%202.6941624-.01585825.0291163-.01585825.0291163-.02457839.0451683-.00907488.0167485-.00907488.0167485-.02487519.0459847-.1433536.266221-.13096222.3338981.0848343.5496946.24552655.2455265.29124297.2535201.49489976.1177523.94795764-.6319557%201.70821671-.7728674%202.83572298-.4818525.12810675.033065.25087974.0841224.36465515.1516486.91634339.543854%201.30025549%201.0840326%201.61862979%202.1650487.0111556.0378927.0111556.0378927.0174529.0591975.0066934.0225523.0066934.0225523.0182249.06125.0868804.2896129.1434973.3287058.4486797.3287058.3472269%200%20.3852056-.0266741.4332104-.2666835.2234405-1.1171344.6613661-1.7543568%201.664354-2.3458308.114153-.0673174.2372859-.1180856.3657122-.1507848%201.0314808-.2626297%201.6914563-.1491329%202.6941624.3969812.0291163.0158582.0291163.0158582.0451683.0245784.0167485.0090749.0167485.0090749.0459847.0248752.266221.1433536.3338981.1309622.5496946-.0848343.2455265-.2455266.2535201-.291243.1177523-.4948998-.6319557-.9479576-.7728674-1.7082167-.4818525-2.835723.033065-.1281067.0841224-.2508797.1516486-.3646551.543854-.9163434%201.0840326-1.3002555%202.1650487-1.6186298.0378927-.0111556.0378927-.0111556.0591975-.0174529.0225523-.0066934.0225523-.0066934.06125-.0182249.2896129-.0868804.3287058-.1434973.3287058-.4486797%200-.3472269-.0266741-.3852056-.2666835-.4332104-1.1171344-.2234405-1.7543568-.6613662-2.3458308-1.66435405-.0673174-.114153-.1180856-.23728591-.1507848-.36571216-.2626297-1.03148075-.1491329-1.69145629.3969812-2.69416239.0158582-.02911635.0158582-.02911635.0245784-.04516828.0090749-.01674857.0090749-.01674857.0248752-.04598477.1433536-.26622097.1309622-.33389801-.0848343-.54969453-.2455266-.24552655-.291243-.25352009-.4948998-.11775235-.9479576.63195569-1.7082167.77286747-2.835723.48185254-.1281067-.03306498-.2508797-.08412242-.3646551-.15164864-.9163434-.54385396-1.3002555-1.08403254-1.6186298-2.16504871-.0111556-.03789262-.0111556-.03789262-.0174529-.05919751-.0066934-.02255223-.0066934-.02255223-.0182249-.06124991-.0868804-.28961296-.1434973-.32870583-.4486797-.32870583-.3472269%200-.3852056.02667411-.4332104.26668349zm.4331986%204.03334169c2.1539105%200%203.9%201.74608948%203.9%203.90000001%200%202.1539105-1.7460895%203.9-3.9%203.9-2.15391053%200-3.90000001-1.7460895-3.90000001-3.9%200-2.15391053%201.74608948-3.90000001%203.90000001-3.90000001zm0%201.8c-1.159798%200-2.10000001.94020201-2.10000001%202.10000001s.94020201%202.1%202.10000001%202.1%202.1-.940202%202.1-2.1-.940202-2.10000001-2.1-2.10000001z%22%20fill%3D%22%23828a99%22%20fill-rule%3D%22nonzero%22%20transform%3D%22matrix(-1%200%200%20-1%2024.00005%2024.00005)%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
        
            background: var(--button-accent) !important;
            mask: var(--lists_mask) !important;
            -webkit-mask: var(--lists_mask) !important;
            opacity: 1 !important;
        }
    
        .page_menu_group_lists {
            --button-accent: #3f3f3f;
    
            color: var(--button-accent) !important;
        }
    
        .page_menu_group_lists:hover {
            text-decoration: underline;
        }`,

        /**
         * Collection of the initialized style elements
         */
        [SYMBOLS.INITIALIZED_STYLES]: Object.create(null),

        /**
         * Initializes a new style element in the page head
         * @param {string} id ID of the CSS style
         * @param {string} style Contents of the style element
         */
        initStyle(id, style) {
            if (STYLES[SYMBOLS.INITIALIZED_STYLES][id]) return;
    
            document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);
    
            STYLES[SYMBOLS.INITIALIZED_STYLES][id] = true;
        },
    }

    /**
     * Collection of the DOM related stuff
     */
    const DOM = {
        /**
         * Inserts element before referenced node
         * @param {HTMLElement} referenceNode Reference node
         * @param {HTMLElement} newNode New node to insert before reference node
         */
        insertBefore(referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode);
        },

        /**
         * Adds event listeners to element
         * @param {HTMLElement} element Element to add event listeners to
         * @param {*} eventListeners Object of event listeners assigned to event name
         */
        addEventListeners(element, eventListeners) {
            for (const eventName in eventListeners) {
                element.addEventListener(eventName, eventListeners[eventName]);
            }
        },

        /**
         * Assigns styles to element
         * @param {HTMLElement} element Element to assign styles to
         * @param {CSSStyleDeclaration} styles Styles to assign
         */
        assignStyles(element, styles) {
            Object.assign(element.style, styles);
    
            return element;
        },

        /**
         * Assigns attributes to object
         * @param {HTMLElement} element Element to assign attributes to
         * @param {*} attributes Object of attributes assigned to their names
         */
        assignAttributes(element, attributes) {
            for (const attribute in attributes) {
                element.setAttribute(attribute, attributes[attribute]);
            }
        },

        /**
         * Creates new element and mounts it if chosen
         * @param {string} tagName New element tag name
         * @param {*} options Options of the object
         * @param {*} options.props Properties to assign
         * @param {CSSStyleDeclaration} options.style Styles to assign
         * @param {*} options.events Event listeners to add
         */
        createElement(tagName, options) {
            const { props, style, events, attributes, mount } = options;

            const el = document.createElement(tagName);

            if (attributes) DOM.assignAttributes(el, attributes);
            if (style) DOM.assignStyles(el, style);
            if (events) DOM.addEventListeners(el, events);
            if (mount instanceof HTMLElement) mount.appendChild(el);

            return props ? Object.assign(el, props) : el;
        },

        /**
         * Appends all elements in the array to the parent
         * @param {HTMLElement[]} elements Elements to append
         * @param {HTMLElement} parent Parent to append elements to
         */
        appendEvery(elements, parent) {
            for (const element of elements) parent.appendChild(element);
        },

        /**
         * Decodes DOM string to normal Unicode string
         * @param {string} input DOM (HTML) string to decode
         */
        decodeDOMString(input) {
            const doc = new DOMParser().parseFromString(input, "text/html");

            return doc.documentElement.textContent;
        }
    };

    /**
     * Collection of the VK DOM related stuff
     */
    const VK_DOM = {
        /**
         * Creates a VK styled checkbox
         * 
         * Requires `settings.css` or own CSS
         * @param {string} opts.id ID of the checkbox for a label
         * @param {string} opts.text The text of the checkbox
         * @param {boolean} opts.isChecked Whether checkbox is checked or not
         * @param {function} opts.onChange Callback function for checkbox change
         */
        createCheckbox(opts) {
            const { id, text, isChecked, onChange } = opts;

            const checkbox = DOM.createElement("input", {
                props: {
                    className: "blind_label",
                    type: "checkbox",
                    checked: isChecked,
                    id
                },
                events: {
                    change: onChange
                }
            });

            const label = DOM.createElement("label", {
                props: { innerText: text },
                attributes: { "for": id }
            });

            return [checkbox, label];
        },

        /**
         * Creates a hint element which displays tooltip of own text
         * 
         * Requires `common.css` (mostly loaded)
         * @param {string} text Text to show on hover
         */
        createHint(text) {
            const hint = DOM.createElement("span", {
                props: { className: "hint_icon" },
                events: {
                    mouseover: function showHint() {
                        showTooltip(hint, {
                            text,
                            dir: "auto",
                            shift: [22, 10],
                            slide: 15
                        })
                    }
                }
            });
    
            return hint;
        },

        /**
         * Creates a page row in module element
         * 
         * Requires `module.css` (mostly loaded on user/public pages)
         * @param {*} public Information about public page
         * @param {*} customizeElements Callback to customize some elements
         */
        createPublicInfoRow(public, customizeElements) {
            const publicInfo = DOM.createElement("div", {
                props: {
                    className: "line_cell clear_fix"
                }
            });

            publicInfo.style.marginBottom = "15px";

            // GROUP AVATAR
            // <--

            const publicInfoAvatar = DOM.createElement("a", {
                props: {
                    href: public.link,
                    className: "fl_l",
                    // There is no sense for the avatar to be visible
                    ariaHidden: true
                }
            });
    
            publicInfo.appendChild(publicInfoAvatar);
    
            const publicInfoAvatarThumb = DOM.createElement("div", {
                props: {
                    className: "thumb",
                    ariaHidden: true
                },
                style: {
                    backgroundImage: `url("${public.thumb}")`
                },
                mount: publicInfoAvatar
            });
    
            // GROUP NAME AND DESCRIPTION
            // -->
    
            const publicInfoContent = DOM.createElement("div", {
                props: {
                    className: "fl_l desc_info"
                },
                style: {
                    width: "auto"
                },
                mount: publicInfo
            });
    
            const publicInfoGroupName = DOM.createElement("div", {
                props: {
                    className: "group_name"
                },
                mount: publicInfoContent
            });
    
            const publicInfoGroupNameLink = DOM.createElement("a", {
                props: {
                    href: public.link,
                    innerText: public.name
                },
                mount: publicInfoGroupName
            });
    
            const publicInfoGroupDesc = DOM.createElement("div", {
                props: {
                    className: "group_desc",
                    innerText: public.description
                },
                mount: publicInfoContent
            });
    
            if (typeof customizeElements === "function") {
                customizeElements({
                    nameLink: publicInfoGroupNameLink,
                    description: publicInfoGroupDesc,
                    avatarThumb: publicInfoAvatarThumb
                });
            }
    
            return publicInfo;
        },
    };

    /**
     * Collection of VK API related methods
     */
    const VK_API = {
        /**
         * IDs of Russian (or kinda "Russian") locales
         */
        [SYMBOLS.RU_LOCALES_IDS]: [0, 1, 100, 114, 777],

        /**
         * Checks if using "kinda 'Russian'" locale
         */
        isUsingRuLocale() {
            return VK_API[SYMBOLS.RU_LOCALES_IDS].includes(langConfig.id);
        },

        /**
         * Makes requests to initialize needed page options
         * @param {number} itemId ID of the page
         * @returns {Promise} Promise which resolves once request is done
         */
        initLists(itemId) {
            return new Promise((resolve, reject) => {
                ajax.post("al_feed.php", {
                    act: "a_get_lists_by_item",
                    item_id: itemId
                }, {
                    onDone: function onDone(_html, js) {
                        // We must eval JS so it changes the options
                        eval(js);
    
                        resolve();
                    },
                    onFail: function onFail() {
                        reject("Request failed");
                    },
                    cache: 1
                });
            });
        },

        /**
         * Makes request to toggle lists for page
         * 
         * Hash can be obtained by calling `initLists` and reading `cur.options.feedListsHash`
         * @param {number} itemId ID of the page
         * @param {number[]} toggles List IDs to toggle (negative to remove)
         * @param {string} hash Hash to call method
         */
        toggleLists(itemId, toggles, hash) {
            return new Promise((resolve, reject) => {
                ajax.post("al_feed.php", {
                    act: "a_toggle_lists",
                    item_id: itemId,
                    lists_ids: toggles,
                    hash
                }, {
                    onDone: function onDone(_html, js) {
                        eval(js);
    
                        resolve();
                    },
                    onFail: function onFail() {
                        reject();
                    }
                })
            });
        },
    };

    /**
     * Collection used by Manage lists dialog to show context
     */
    const CONTEXT = {
        /**
         * Returns user icon
         */
        getUserIcon() {
            const pageAvatarImg = document.querySelector("img.page_avatar_img");

            if (pageAvatarImg) return pageAvatarImg.src;

            return "https://vk.com/images/camera_50.png?ava=1";
        },

        getUserLink() {
            return `/${cur.options.loc}`;
        },

        /**
         * Returns user following status
         */
        getUserFollowStatus() {
            const ruLocale = VK_API.isUsingRuLocale();

            const statusElem = document.querySelector("#friend_status");

            if (statusElem != null) {
                const addFriendButton = statusElem.querySelector(".profile_action_btn");

                if (addFriendButton != null) {
                    return ruLocale
                        ? "Не в списке друзей."
                        : "Not in the friends list.";
                }
    
                // Dropdown button is only present on the followed pages (friends / following)
                const dropDownLabel = statusElem.querySelector(".page_actions_dd_label");
    
                if (dropDownLabel != null) {
                    return ruLocale
                        ? "Вы подписаны."
                        : "You are following.";
                }
            }

            // Status is unknown, probably us
            // TODO: Find a way to check if ours profile is opened

            return ruLocale
                ? "Интересный пользователь."
                : "Interesting user.";
        },

        /**
         * Returns group page icon
         */
        _getPageIconFallback() {
            const pageAvatarImg = document.querySelector("img.page_avatar_img");

            if (pageAvatarImg) return pageAvatarImg.src;

            return "https://vk.com/images/camera_50.png?ava=1";
        },

        /**
         * Returns public page icon
         */
        getPageIcon() {
            const pageCoverImg = document.querySelector(".page_cover_image");

            if (pageCoverImg) try {
                return pageCoverImg.children[0].src;
            } catch {
                console.warn("[VKLISTADD] Failed to get public page cover image");
            }

            return CONTEXT._getPageIconFallback();
        },

        /**
         * Returns public page link
         */
        getPageLink() {
            if (cur.module === "public") {
                return cur.options.public_link;
            } else if (cur.module === "groups") {
                return `/${cur.options.loc}`;
            }
        },
        
        /**
         * Returns public page following status
         */
        getPageFollowStatus() {
            const ruLocale = VK_API.isUsingRuLocale();

            if (cur.module === "public") {
                return cur.options.liked 
                    ? ruLocale
                        ? "Вы подписаны на эту страницу."
                        : "You are following this page."
                    : ruLocale
                        ? "Вы не подписаны на эту страницу."
                        : "You are not following this page.";
            } else if (cur.module === "groups") {
                const pageActionBtn = document.querySelector(".page_actions_btn");

                return pageActionBtn
                    ? ruLocale
                        ? "Вы участник этой группы."
                        : "You are member of this group."
                    : ruLocale
                        ? "Вы не вступили в группу."
                        : "You have not joined the group."
            }

            return ruLocale
                ? "Статус подписки неизвестен."
                : "Unknown follow status.";
        },

        /**
         * Returns icon of current public page or user
         */
        getIcon() {
            if (cur.module === "profile") return CONTEXT.getUserIcon();
            else return CONTEXT.getPageIcon();
        },

        /**
         * Returns link of current public page or user
         */
        getLink() {
            if (cur.module === "profile") return CONTEXT.getUserLink();
            else return CONTEXT.getPageLink();
        },

        /**
         * Returns follow status for current public page or user
         */
        getFollowStatus() {
            if (cur.module === "profile") return CONTEXT.getUserFollowStatus();
            else return CONTEXT.getPageFollowStatus();
        },
    };

    /**
     * Collection of Manage lists dialog stuff
     */
    const LIST_DIALOG = {
        /**
         * Cached action button for later re-use
         */
        [SYMBOLS.DIALOG_ACTION_BUTTON]: undefined,

        /**
         * Cached menu item for later re-use
         */
        [SYMBOLS.DIALOG_MENU_ITEM]: undefined,

        /**
         * Cached dialog hint for later re-use
         */
        [SYMBOLS.DIALOG_HINT]: undefined,

        /**
         * Cached dialog label for later re-use
         */
        [SYMBOLS.DIALOG_LABEL]: undefined,

        /**
         * Returns previous or creates new dialog action button
         * 
         * Dialog action button is a menu button used to pop up this dialog
         */
        getActionButton() {
            let button = LIST_DIALOG[SYMBOLS.DIALOG_ACTION_BUTTON];

            if (button == null) {
                STYLES.initStyle("action_button", STYLES[SYMBOLS.ACTION_BUTTON_CSS]);

                button = DOM.createElement("a", {
                    props: {
                        className: "page_actions_item page_menu_group_lists",
                        tabIndex: "0",
                        role: "link",
                        innerText: VK_API.isUsingRuLocale()
                            ? "Настроить списки"
                            : "Manage lists"
                    },
                    style: {
                        color: "#3f3f3f",
                    },
                    events: {
                        click: function onClick() {
                            LIST_DIALOG.initAddListDialog();
                        }
                    }
                });

                LIST_DIALOG[SYMBOLS.DIALOG_ACTION_BUTTON] = button;
            }

            return button;
        },

        /**
         * Returns previous or creates new menu item
         * 
         * Dialog menu item is a button used on user pages to pop up this dialog
         */
        getMenuItem() {
            let item = LIST_DIALOG[SYMBOLS.DIALOG_MENU_ITEM];

            if (item == null) {
                item = DOM.createElement("a", {
                    props: {
                        className: "page_actions_item",
                        tabIndex: "0",
                        role: "link",
                        innerText: VK_API.isUsingRuLocale()
                            ? "Настроить списки"
                            : "Manage lists"
                    },
                    events: {
                        click: function onClick() {
                            LIST_DIALOG.initAddListDialog();
                        }
                    }
                });

                LIST_DIALOG[SYMBOLS.DIALOG_MENU_ITEM] = item;
            }

            return item;
        },

        /**
         * Mount action button to current page actions container
         * 
         * Only for use on public pages and groups
         */
        mountActionButton() {
            const container = document.querySelector("._page_actions_container");

            let referenceNode;

            {
                // We want to have top position so must either mount after Send message button
                // if it's there, otherwise we'll just place ourselves at the top of container
                const sendMsgAction = document.querySelector(".group_send_msg_status_block");

                if (sendMsgAction) referenceNode = sendMsgAction;
                else referenceNode = container.firstElementChild;
            }

            DOM.insertBefore(referenceNode, LIST_DIALOG.getActionButton());
        },

        /**
         * Mount menu item to current page menu
         * 
         * Only for use on profile pages
         */
        mountMenuItem() {
            const container = document.querySelector(".page_extra_actions_wrap > .page_actions_inner");

            DOM.insertBefore(container.firstElementChild, LIST_DIALOG.getMenuItem());
        },

        /**
         * Prepares message box with needed content
         */
        prepareMessageBox(content, onSave) {
            const box = new MessageBox();

            box.setOptions({
                title: VK_API.isUsingRuLocale()
                    ? "Управление списками"
                    : "Manage lists",
                hideButtons: false
            });

            box.content(content);

            box.addButton(lang.box_save, onSave, "ok", "save_btn");

            box.addButton(lang.box_cancel, box.hide, "no", "cancel_btn");

            return box;
        },

        /**
         * Adds hint to the group description
         */
        addHint({ description }) {
            let hint = LIST_DIALOG[SYMBOLS.DIALOG_HINT];

            if (hint == null) {
                hint = VK_DOM.createHint(
                    VK_API.isUsingRuLocale()
                        ? "Вы можете добавить сообщество в список, даже если не подписаны на него."
                        : "You can add the community to a list even if you are not following it."
                );

                // By unknown reasons hint is partially hidden and we must
                // manually assign it padding and left margin to fix it
                DOM.assignStyles(hint, {
                    padding: "2px",
                    marginLeft: "5px"
                });

                LIST_DIALOG[SYMBOLS.DIALOG_HINT] = hint;
            }

            description.appendChild(hint);
        },

        /**
         * Returns previous or creates new dialog label
         */
        getDialogLabel() {
            let label = LIST_DIALOG[SYMBOLS.DIALOG_LABEL];

            if (label == null) {
                label = DOM.createElement("div", {
                    props: {
                        innerText: VK_API.isUsingRuLocale()
                            ? "Отображать новости сообщества в списках:"
                            : "Show this community's news in the lists:",
                    },
                    style: {
                        marginBottom: "10px"
                    }
                });

                LIST_DIALOG[SYMBOLS.DIALOG_LABEL] = label;
            }

            return label;
        },

        /**
         * Initializes a message box containing the dialog
         */
        async initAddListDialog() {
            // ----------------------------------

            let { feedLists } = cur.options;

            const itemId = cur.oid;

            // We must init lists if they aren't
            if (!feedLists) {
                await VK_API.initLists(itemId);

                feedLists = cur.options.feedLists;
            }

            const hash = cur.options.feedListsHash;
            const changes = Object.create(null);

            // ----------------------------------

            STYLES.initStyle("checkboxes", STYLES[SYMBOLS.CHECKBOX_CSS]);

            const ruLocale = VK_API.isUsingRuLocale();

            const boxContainer = DOM.createElement("div", {
                props: {
                    className: "vklistadd_container page_list_module"
                }
            });
    
            boxContainer.appendChild(
                VK_DOM.createPublicInfoRow({
                        link: CONTEXT.getLink(),
                        thumb: CONTEXT.getIcon(),
                        name: DOM.decodeDOMString(cur.options.back),
                        description: CONTEXT.getFollowStatus()
                    },
                    LIST_DIALOG.addHint
                )
            );

            boxContainer.appendChild(LIST_DIALOG.getDialogLabel());

            // ----------------------------------

            for (const i in feedLists) {
                const listName = feedLists[i];
    
                const row = DOM.createElement("div", {
                    style: { marginBottom: "10px" }
                });

                const checkboxElements = VK_DOM.createCheckbox({
                    id: `list_${i}`,
                    text: listName,
                    isChecked: cur.options.feedListsSet[i] === 1,
                    onChange: function onCheckboxChange(e) {
                        changes[i] = e.target.checked ? 1 : -1;
                    }
                });

                DOM.appendEvery(checkboxElements, row);

                boxContainer.appendChild(row);
            }

            const box = LIST_DIALOG.prepareMessageBox(
                boxContainer,
                async function saveChanges() {
                    box.showProgress();

                    try {
                        const toggles = [];

                        for (const i in changes) toggles.push(changes[i] * i);

                        await VK_API.toggleLists(itemId, toggles.join(","), hash);

                        // List is saved, let's change options
                        for (const i in changes) {
                            cur.options.feedListsSet[i] = changes[i] === -1 ? 0 : 1;
                        }

                        box.hide();
                    } catch (err) {
                        console.error("[VKLISTADD] Failed to save changes:", err);

                        box.hideProgress();
                    }
                }
            );

            box.show();
        }
    };

    const WRAPPING = {
        /**
         * Invokes callback function in try-catch block to not interrupt VK API
         * @param {*} wrapper Wrapper function containing callback
         */
        safeInvokeCallback(wrapper) {
            if (wrapper == null) {
                throw new Error("No wrapper provided");
            } else if (wrapper[SYMBOLS.IS_WRAPPED] == null) {
                throw new Error("Non-wrapper object provided");
            }

            try {
                wrapper[SYMBOLS.WRAPPER_CALLBACK]();
            } catch (err) {
                console.warn("[VKADDLI] Callback failed due to error:", err);
            }
        },

        /**
         * Creates safe init wrapper for use in hazardous environment conditions
         * 
         * Wrapper will have a Symbol on it so it will not re-wrap itself as precaution
         */
        makeInitWrapper(originalFc, callbackFc) {
            if (originalFc == null) throw new Error("No original function provided");
            if (callbackFc == null) throw new Error("No callback function provided");

            function initWrapper(...args) { 
                const returning = originalFc(...args);

                WRAPPING.safeInvokeCallback(initWrapper);

                return returning;
            };

            initWrapper[SYMBOLS.IS_WRAPPED] = true;
            initWrapper[SYMBOLS.WRAPPER_CALLBACK] = callbackFc;

            return initWrapper;
        },

        /**
         * Wraps `init` method of the window `public` object
         * 
         * @param {*} public `public` object used for public pages
         */
        wrapInit(obj, initCallback) {
            if (obj.init[SYMBOLS.IS_WRAPPED]) {
                return console.warn("[VKLISTADD] That's odd: wrapInit called with wrapped public.init");
            }

            const initWrapper = WRAPPING.makeInitWrapper(
                obj.init,
                initCallback
            );

            obj.init = initWrapper;

            return initWrapper;
        },

        /**
         * Creates a wrap for the property in window object
         * 
         * This allows us to wrap init function at the moment of creation
         */
        createWindowWrap(property, initCallback) {
            if (property == null) throw new Error("No property name provided");
            if (initCallback == null) throw new Error("No init function callback provided");

            let $original = unsafeWindow[property];

            if ($original != null) {
                console.warn("[VKLISTADD] We are late to initialization, is @run-at directive ignored by userscipt manager???");

                console.warn("[VKLISTADD] Rewrapping init function NOW and manually invoking callback");

                const wrapper = WRAPPING.wrapInit($original, initCallback);

                WRAPPING.safeInvokeCallback(wrapper);
            }

            Object.defineProperty(unsafeWindow, property, {
                get() {
                    return $original;
                },
                set(value) {
                    WRAPPING.wrapInit(value, initCallback);

                    $original = value;
                },
                enumerable: true,
                configurable: true
            });
        },
    };

    /**
     * Collection of callbacks of models initializations
     */
    const INIT_CALLBACKS = {
        /**
         * Default callback for `public` initialization
         * 
         * Used to add button to pop up dialog
         * 
         * `public` is used to contain methods related to public pages
         */
        publicInitCallback() {
            LIST_DIALOG.mountActionButton();
        },

        /**
         * Default callback for `profile` initialization
         * 
         * Used to mount menu item to pop up dialog
         * 
         * `profile` is used to contain methods related to user profile pages
         */
        profileInitCallback() {
            LIST_DIALOG.mountMenuItem();
        },
    };

    WRAPPING.createWindowWrap("public", INIT_CALLBACKS.publicInitCallback);
    WRAPPING.createWindowWrap("Groups", INIT_CALLBACKS.publicInitCallback);
    WRAPPING.createWindowWrap("Profile", INIT_CALLBACKS.profileInitCallback);
})();
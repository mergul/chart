(window.webpackJsonp = window.webpackJsonp || []).push([
    ["header-toolbar"], {
        "+GaQ": function(e, t, a) {
            "use strict";
            a.d(t, "a", (function() {
                return n
            }));
            var s = a("q1tI");

            function n(e) {
                if (e.map) {
                    return s.Children.toArray(e.children).map(e.map)
                }
                return e.children
            }
        },
        "1TxM": function(e, t, a) {
            "use strict";
            a.d(t, "c", (function() {
                return l
            })), a.d(t, "a", (function() {
                return c
            })), a.d(t, "b", (function() {
                return d
            }));
            var s = a("q1tI"),
                n = a.n(s),
                i = a("17x9"),
                r = a.n(i);
            const o = n.a.createContext({});

            function l(e, t) {
                r.a.checkPropTypes(t, e, "context", "RegistryContext")
            }

            function c(e) {
                const {
                    validation: t,
                    value: a
                } = e;
                return l(a, t), n.a.createElement(o.Provider, {
                    value: a
                }, e.children)
            }

            function d() {
                return o
            }
        },
        "6aN0": function(e, t, a) {
            e.exports = {
                "css-value-header-toolbar-height": "38px",
                toolbar: "toolbar-LZaMRgb9",
                isHidden: "isHidden-LZaMRgb9",
                overflowWrap: "overflowWrap-LZaMRgb9",
                customButton: "customButton-LZaMRgb9",
                hovered: "hovered-LZaMRgb9"
            }
        },
        "6oLA": function(e, t) {
            e.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.56 14a10.05 10.05 0 00.52.91c.41.69 1.04 1.6 1.85 2.5C8.58 19.25 10.95 21 14 21c3.05 0 5.42-1.76 7.07-3.58A17.18 17.18 0 0023.44 14a9.47 9.47 0 00-.52-.91c-.41-.69-1.04-1.6-1.85-2.5C19.42 8.75 17.05 7 14 7c-3.05 0-5.42 1.76-7.07 3.58A17.18 17.18 0 004.56 14zM24 14l.45-.21-.01-.03a7.03 7.03 0 00-.16-.32c-.11-.2-.28-.51-.5-.87-.44-.72-1.1-1.69-1.97-2.65C20.08 7.99 17.45 6 14 6c-3.45 0-6.08 2-7.8 3.92a18.18 18.18 0 00-2.64 3.84v.02h-.01L4 14l-.45-.21-.1.21.1.21L4 14l-.45.21.01.03a5.85 5.85 0 00.16.32c.11.2.28.51.5.87.44.72 1.1 1.69 1.97 2.65C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92a18.18 18.18 0 002.64-3.84v-.02h.01L24 14zm0 0l.45.21.1-.21-.1-.21L24 14zm-10-3a3 3 0 100 6 3 3 0 000-6zm-4 3a4 4 0 118 0 4 4 0 01-8 0z"/></svg>'
        },
        "8d0Q": function(e, t, a) {
            "use strict";
            var s = a("q1tI");

            function n() {
                const [e, t] = Object(s.useState)(!1);
                return [e, {
                    onMouseOver: function(e) {
                        i(e) && t(!0)
                    },
                    onMouseOut: function(e) {
                        i(e) && t(!1)
                    }
                }]
            }

            function i(e) {
                return !e.currentTarget.contains(e.relatedTarget)
            }

            function r(e) {
                const [t, a] = Object(s.useState)(!1);
                return Object(s.useEffect)(() => {
                    const t = t => {
                        if (null === e.current) return;
                        const s = e.current.contains(t.target);
                        a(s)
                    };
                    return document.addEventListener("mouseover", t), () => document.removeEventListener("mouseover", t)
                }, []), t
            }
            a.d(t, "c", (function() {
                return n
            })), a.d(t, "a", (function() {
                return i
            })), a.d(t, "b", (function() {
                return r
            }))
        },
        Iivm: function(e, t, a) {
            "use strict";
            var s = a("q1tI");
            const n = s.forwardRef((e, t) => {
                const {
                    icon: a = "",
                    ...n
                } = e;
                return s.createElement("span", { ...n,
                    ref: t,
                    dangerouslySetInnerHTML: {
                        __html: a
                    }
                })
            });
            a.d(t, "a", (function() {
                return n
            }))
        },
        KMbc: function(e, t, a) {
            "use strict";
            a.r(t);
            var s = a("q1tI"),
                n = a("i8i4"),
                i = a("Eyy1"),
                r = a("TSYQ"),
                o = a("4O8T"),
                l = a.n(o),
                c = a("UXvI"),
                d = a("Kxc7"),
                u = a("FQhm"),
                h = a("17x9"),
                m = a("cvc5"),
                v = a("8+VR"),
                p = a("+GaQ"),
                f = a("KrBX");

            function b(e) {
                const {
                    children: t,
                    className: a,
                    noLeftDecoration: n,
                    noRightDecoration: i,
                    noMinimalWidth: o,
                    onClick: l
                } = e;
                return s.createElement("div", {
                    className: r(a, f.group, {
                        [f.noMinimalWidth]: o,
                        [f.noLeftDecoration]: n,
                        [f.noRightDecoration]: i
                    }),
                    onClick: l
                }, t)
            }
            var g = a("tO+E");
            class y extends s.PureComponent {
                constructor() {
                    super(...arguments), this._handleMeasure = ({
                        width: e
                    }) => {
                        this.props.onWidthChange(e)
                    }
                }
                render() {
                    const {
                        children: e,
                        shouldMeasure: t
                    } = this.props;
                    return s.createElement(m, {
                        shouldMeasure: t,
                        onMeasure: this._handleMeasure,
                        whitelist: ["width"]
                    }, s.createElement("div", {
                        className: g.wrap
                    }, e))
                }
            }
            var S = a("tU7i"),
                _ = a("KkTf");

            function E(e) {
                return s.createElement(S.b, { ...e,
                    forceInteractive: !0,
                    icon: _
                })
            }
            a("YFKU");
            var C = a("Iivm"),
                w = a("a+Yp"),
                M = a("6oLA");
            const I = {
                text: window.t("View Only Mode")
            };

            function O(e) {
                return s.createElement("div", {
                    className: w.wrap
                }, s.createElement(C.a, {
                    className: w.icon,
                    icon: M
                }), I.text)
            }
            var k, R = a("4Cm8"),
                x = a("XAms");
            ! function(e) {
                e.SymbolSearch = "header-toolbar-symbol-search", e.Intervals = "header-toolbar-intervals", e.ChartStyles = "header-toolbar-chart-styles", e.Compare = "header-toolbar-compare", e.Indicators = "header-toolbar-indicators", e.StudyTemplates = "header-toolbar-study-templates", e.Dropdown = "header-toolbar-dropdown", e.Alerts = "header-toolbar-alerts", e.Layouts = "header-toolbar-layouts", e.SaveLoad = "header-toolbar-save-load", e.UndoRedo = "header-toolbar-undo-redo", e.Properties = "header-toolbar-properties", e.PublishDesktop = "header-toolbar-publish-desktop", e.PublishMobile = "header-toolbar-publish-mobile", e.Fullscreen = "header-toolbar-fullscreen", e.Screenshot = "header-toolbar-screenshot", e.Replay = "header-toolbar-replay", e.Financials = "header-toolbar-financials", e.StartTrial = "header-toolbar-start-trial"
            }(k || (k = {}));
            var F = a("8d0Q"),
                V = a("1TxM"),
                W = a("a8bL");
            const L = Object(V.b)();
            class T extends s.PureComponent {
                constructor(e, t) {
                    super(e, t), this._handleMouseOver = e => {
                        Object(F.a)(e) && this.setState({
                            isHovered: !0
                        })
                    }, this._handleMouseOut = e => {
                        Object(F.a)(e) && this.setState({
                            isHovered: !1
                        })
                    }, this._activateSymbolSearchMode = () => {
                        this._setMode(2)
                    }, this._activateNormalMode = () => {
                        this._setMode(1)
                    }, this._handleInnerResize = e => {
                        const {
                            onWidthChange: t
                        } = this.props;
                        t && t(e)
                    }, this._handleMeasureAvailableSpace = ({
                        width: e
                    }) => {
                        const {
                            onAvailableSpaceChange: t
                        } = this.props;
                        t && t(e)
                    }, this._processCustoms = e => {
                        const {
                            isFake: t,
                            displayMode: a
                        } = this.props, {
                            tools: n
                        } = this.context;
                        return e.map(e => s.createElement(b, {
                            key: e.id
                        }, "Button" === e.type ? s.createElement(n.Custom, { ...e.params,
                            isFake: t
                        }) : s.createElement(n.Dropdown, {
                            displayMode: a,
                            params: e.params
                        })))
                    }, this._fixLastGroup = (e, t, a) => {
                        if (t === a.length - 1 && s.isValidElement(e) && e.type === b) {
                            const t = void 0 !== this.context.tools.Publish && !this.props.readOnly;
                            return s.cloneElement(e, {
                                noRightDecoration: t
                            })
                        }
                        return e
                    }, Object(V.c)(t, {
                        tools: h.any.isRequired
                    }), this.state = {
                        isHovered: !1,
                        mode: 1,
                        isAuthenticated: void 0
                    }
                }
                componentDidMount() {
                    0
                }
                componentWillUnmount() {
                    0
                }
                render() {
                    const {
                        tools: e
                    } = this.context, {
                        features: t,
                        displayMode: a,
                        chartSaver: n,
                        studyMarket: i,
                        readOnly: o,
                        saveLoadSyncEmitter: l,
                        leftCustomElements: c,
                        rightCustomElements: d,
                        showScrollbarWhen: u,
                        width: h = 0,
                        isFake: f = !1
                    } = this.props, {
                        isHovered: g,
                        mode: S,
                        isAuthenticated: _
                    } = this.state, C = this._processCustoms(c), w = this._processCustoms(d), M = u.includes(a);
                    return s.createElement("div", {
                        className: r(W.inner, {
                            [W.fake]: f
                        }),
                        onContextMenu: x.b,
                        "data-is-fake-main-panel": f
                    }, s.createElement(m, {
                        onMeasure: this._handleMeasureAvailableSpace,
                        whitelist: ["width"],
                        shouldMeasure: !f
                    }, s.createElement(R.a, {
                        isVisibleFade: v.mobiletouch && M,
                        isVisibleButtons: !v.mobiletouch && M && g,
                        isVisibleScrollbar: !1,
                        shouldMeasure: M && !f,
                        onMouseOver: this._handleMouseOver,
                        onMouseOut: this._handleMouseOut
                    }, s.createElement("div", {
                        className: W.content
                    }, s.createElement(y, {
                        onWidthChange: this._handleInnerResize,
                        shouldMeasure: f
                    }, s.createElement(p.a, {
                        map: this._fixLastGroup
                    }, !o && s.Children.toArray([e.SymbolSearch && s.createElement(b, {
                        key: "symbol",
                        className: 2 === S && W.symbolSearch
                    }, s.createElement(e.SymbolSearch, {
                        id: f ? void 0 : k.SymbolSearch,
                        isActionsVisible: t.allowSymbolSearchSpread,
                        isExpanded: 2 === S,
                        onFocus: this._activateSymbolSearchMode,
                        onBlur: this._activateNormalMode,
                        maxWidth: h
                    })), e.DateRange && s.createElement(b, {
                        key: "range"
                    }, s.createElement(e.DateRange, null)), e.Intervals && 1 === S && s.createElement(b, {
                        key: "intervals"
                    }, s.createElement(e.Intervals, {
                        id: f ? void 0 : k.Intervals,
                        isShownQuicks: t.allowFavoriting,
                        isFavoritingAllowed: t.allowFavoriting,
                        displayMode: a,
                        isFake: f
                    })), e.Bars && 1 === S && s.createElement(b, {
                        key: "styles"
                    }, s.createElement(e.Bars, {
                        id: f ? void 0 : k.ChartStyles,
                        isShownQuicks: t.allowFavoriting,
                        isFavoritingAllowed: t.allowFavoriting,
                        displayMode: a,
                        isFake: f
                    })), e.Compare && 1 === S && s.createElement(b, {
                        key: "compare"
                    }, s.createElement(e.Compare, {
                        id: f ? void 0 : k.Compare,
                        className: W.button,
                        displayMode: a
                    })), e.Indicators && 1 === S && s.createElement(b, {
                        key: "indicators"
                    }, s.createElement(e.Indicators, {
                        id: f ? void 0 : k.Indicators,
                        className: W.button,
                        studyMarket: i,
                        displayMode: a
                    })), e.Financials && 1 === S && s.createElement(b, {
                        key: "financials"
                    }, s.createElement(e.Financials, {
                        id: f ? void 0 : k.Financials,
                        className: W.button,
                        displayMode: a
                    })), e.Templates && 1 === S && s.createElement(b, {
                        key: "templates"
                    }, s.createElement(e.Templates, {
                        id: f ? void 0 : k.StudyTemplates,
                        isShownQuicks: t.allowFavoriting,
                        isFavoritingAllowed: t.allowFavoriting,
                        displayMode: a
                    })), 1 === S && e.Alert && s.createElement(b, {
                        key: "alert"
                    }, s.createElement(e.Alert, {
                        id: f ? void 0 : k.Alerts,
                        className: W.button,
                        displayMode: a
                    })), 1 === S && e.AlertReferral && s.createElement(b, {
                        key: "alert-referral"
                    }, s.createElement(e.AlertReferral, {
                        className: W.button,
                        displayMode: a
                    })), e.Replay && 1 === S && s.createElement(b, {
                        key: "replay"
                    }, s.createElement(e.Replay, {
                        id: f ? void 0 : k.Replay,
                        className: W.button,
                        displayMode: a
                    })), e.UndoRedo && 1 === S && s.createElement(b, {
                        key: "undo-redo"
                    }, s.createElement(e.UndoRedo, {
                        id: f ? void 0 : k.UndoRedo
                    })), e.ScalePercentage && s.createElement(b, {
                        key: "percentage"
                    }, s.createElement(e.ScalePercentage, null)), e.ScaleLogarithm && s.createElement(b, {
                        key: "logarithm"
                    }, s.createElement(e.ScaleLogarithm, null)), ...C]), 1 === S ? function(e) {
                        const t = e.findIndex(e => s.isValidElement(e) && !!e.key && -1 !== e.key.toString().indexOf("view-only-badge"));
                        return [t].filter(e => e >= 0).forEach(t => {
                            e = s.Children.map(e, (e, a) => {
                                if (s.isValidElement(e)) {
                                    switch ([t - 1, t, t + 1].indexOf(a)) {
                                        case 0:
                                            const t = {
                                                noRightDecoration: !0
                                            };
                                            e = s.cloneElement(e, t);
                                            break;
                                        case 1:
                                            const a = {
                                                noLeftDecoration: !0,
                                                noRightDecoration: !0
                                            };
                                            e = s.cloneElement(e, a);
                                            break;
                                        case 2:
                                            const n = {
                                                noLeftDecoration: !0
                                            };
                                            e = s.cloneElement(e, n)
                                    }
                                }
                                return e
                            })
                        }), e
                    }(s.Children.toArray([o && s.createElement(b, {
                        key: "view-only-badge"
                    }, s.createElement(O, null)), s.createElement(b, {
                        key: "gap",
                        className: r(W.fill, f && W.collapse)
                    }), !o && e.Layout && s.createElement(b, {
                        key: "layout"
                    }, s.createElement(e.Layout, {
                        id: f ? void 0 : k.Layouts
                    })), e.SaveLoad && s.createElement(b, {
                        key: "save-load-right"
                    }, s.createElement(e.SaveLoad, {
                        id: f ? void 0 : k.SaveLoad,
                        chartSaver: n,
                        isReadOnly: o,
                        displayMode: a,
                        isFake: f,
                        stateSyncEmitter: l
                    })), e.SaveLoadReferral && s.createElement(b, {
                        key: "save-load-referral"
                    }, s.createElement(e.SaveLoadReferral, {
                        isReadOnly: o,
                        displayMode: a
                    })), t.showLaunchInPopupButton && e.OpenPopup && s.createElement(b, {
                        key: "popup"
                    }, s.createElement(e.OpenPopup, null)), !o && e.Properties && s.createElement(b, {
                        key: "properties"
                    }, s.createElement(e.Properties, {
                        id: f ? void 0 : k.Properties,
                        className: W.iconButton
                    })), !o && e.Fullscreen && s.createElement(b, {
                        key: "fullscreen",
                        onClick: this._trackFullscreenButtonClick
                    }, s.createElement(e.Fullscreen, {
                        id: f ? void 0 : k.Fullscreen
                    })), e.Screenshot && s.createElement(b, {
                        key: "screenshot"
                    }, s.createElement(e.Screenshot, {
                        id: f ? void 0 : k.Screenshot,
                        className: W.iconButton
                    })), !o && e.Publish && s.createElement(b, {
                        key: "publish",
                        className: W.mobilePublish
                    }, s.createElement(e.Publish, {
                        id: f ? void 0 : k.PublishMobile
                    })), ...w])) : [s.createElement(b, {
                        key: "gap",
                        className: r(W.fill, 2 === S && W.minimalPriority)
                    }), s.createElement(b, {
                        key: "symbol-search-close"
                    }, s.createElement(E, {
                        className: r(W.iconButton, W.symbolSearchClose)
                    }))]))))), e.Publish && !o && !f && s.createElement(e.Publish, {
                        id: k.PublishDesktop,
                        className: W.desktopPublish
                    }))
                }
                _onLoginStateChange() {
                    0
                }
                _setMode(e) {
                    this.setState({
                        mode: e
                    })
                }
                _trackFullscreenButtonClick() {
                    0
                }
            }
            T.contextType = L;
            var D = a("hY0g"),
                P = a.n(D),
                A = a("ulZB");
            class N extends A.b {
                constructor(e, t, a = []) {
                    super(e, t, "FAVORITE_CHART_STYLES_CHANGED", "StyleWidget.quicks", a)
                }
            }
            var z = a("pPtI"),
                j = a("L6rT");
            class B extends A.a {
                constructor(e, t, a) {
                    super(e, t, "FAVORITE_INTERVALS_CHANGED", "IntervalWidget.quicks", a)
                }
                _serialize(e) {
                    return Object(j.uniq)(e.map(z.normalizeIntervalString))
                }
                _deserialize(e) {
                    return Object(j.uniq)(Object(z.convertResolutionsFromSettings)(e).filter(z.isResolutionMultiplierValid).map(z.normalizeIntervalString))
                }
            }
            var K = a("Vdly"),
                H = a("FBuY");
            a("bSeV");
            class X extends A.a {
                constructor(e, t, a = []) {
                    super(e, t, "CUSTOM_INTERVALS_CHANGED", "IntervalWidget.intervals", a)
                }
                set(e, t) {
                    e.length, this.get().length, super.set(e, t)
                }
                _serialize(e) {
                    return Object(j.uniq)(e.map(z.normalizeIntervalString))
                }
                _deserialize(e) {
                    return Object(j.uniq)(Object(z.convertResolutionsFromSettings)(e).filter(z.isResolutionMultiplierValid).map(z.normalizeIntervalString))
                }
            }
            const U = new X(H.TVXWindowEvents, K);
            var q = a("LxhU"),
                G = a("cSDC");
            class Q {
                constructor(e) {
                    this._customIntervalsService = U, this._chartApiInstance = e
                }
                getDefaultIntervals() {
                    return null === this._chartApiInstance ? [] : this._chartApiInstance.defaultResolutions().map(z.normalizeIntervalString)
                }
                getCustomIntervals() {
                    return this._customIntervalsService.get()
                }
                add(e, t, a) {
                    if (!this.isValidInterval(e, t)) return null;
                    const s = this._getIntervalString(e, t),
                        n = Object(z.normalizeIntervalString)(s),
                        i = this.getCustomIntervals();
                    return this._isIntervalDefault(n) || i.includes(n) ? null : (this._customIntervalsService.set(Object(z.sortResolutions)([...i, n])), n)
                }
                remove(e) {
                    this._customIntervalsService.set(this.getCustomIntervals().filter(t => t !== e))
                }
                isValidInterval(e, t) {
                    const a = parseInt(e);
                    return a === this._minMaxTime(a, t)
                }
                isSupportedInterval(e) {
                    return Object(z.isAvailable)(e)
                }
                getOnChange() {
                    return this._customIntervalsService.getOnChange()
                }
                getPossibleIntervals() {
                    return G.a
                }
                getResolutionUtils() {
                    return {
                        getMaxResolutionValue: this._getMaxResolutionValue,
                        getTranslatedResolutionModel: z.getTranslatedResolutionModel,
                        mergeResolutions: z.mergeResolutions,
                        sortResolutions: z.sortResolutions
                    }
                }
                _getMaxResolutionValue(e) {
                    return q.Interval.isMinuteHours(e) ? Math.floor(Object(z.getMaxResolutionValue)("1") / 60) : Object(z.getMaxResolutionValue)(e)
                }
                _isIntervalDefault(e) {
                    return this.getDefaultIntervals().includes(e)
                }
                _minMaxTime(e, t) {
                    return Math.max(1, Math.min(e, this._getMaxResolutionValue(t)))
                }
                _getIntervalString(e, t) {
                    const a = parseInt(e),
                        s = q.Interval.parse(t),
                        n = s.isMinuteHours() ? 60 * a : a;
                    return new q.Interval(s.kind(), n).value()
                }
            }
            var Y = a("yMne"),
                Z = a("cBZt"),
                J = a("TcSq"),
                $ = a("aIyQ"),
                ee = a.n($);
            const te = {};
            let ae = null;
            class se {
                constructor(e = K) {
                    this._favorites = [], this._favoritesChanged = new ee.a, this._settings = e, H.TVXWindowEvents.on("StudyFavoritesChanged", e => {
                        const t = JSON.parse(e);
                        this._loadFromState(t.favorites || [])
                    }), this._settings.onSync.subscribe(this, this._loadFavs), this._loadFavs()
                }
                isFav(e) {
                    const t = this.favId(e);
                    return -1 !== this._findFavIndex(t)
                }
                toggleFavorite(e) {
                    this.isFav(e) ? this.removeFavorite(e) : this.addFavorite(e)
                }
                addFavorite(e) {
                    const t = this.favId(e);
                    this._favorites.push(ie(t)), this._favoritesChanged.fire(), this._saveFavs()
                }
                removeFavorite(e) {
                    const t = this.favId(e),
                        a = this._findFavIndex(t); - 1 !== a && (this._favorites.splice(a, 1), this._favoritesChanged.fire()), this._saveFavs()
                }
                favId(e) {
                    return Object(J.isPineIdString)(e) ? e : Object(J.extractPineId)(e) || Object(Z.extractStudyId)(e)
                }
                favorites() {
                    return this._favorites
                }
                favoritePineIds() {
                    return this._favorites.filter(e => "pine" === e.type).map(e => e.pineId)
                }
                favoritesChanged() {
                    return this._favoritesChanged
                }
                static getInstance() {
                    return null === ae && (ae = new se), ae
                }
                static create(e) {
                    return new se(e)
                }
                _loadFavs() {
                    const e = this._settings.getJSON("studyMarket.favorites", []);
                    this._loadFromState(e)
                }
                _saveFavs() {
                    const e = this._stateToSave();
                    this._settings.setJSON("studyMarket.favorites", e), H.TVXWindowEvents.emit("StudyFavoritesChanged", JSON.stringify({
                        favorites: e
                    }))
                }
                _stateToSave() {
                    return this._favorites.map(ne)
                }
                _loadFromState(e) {
                    this._favorites = e.map(e => ie(function(e) {
                        return e in te ? te[e] : e
                    }(e))), this._favoritesChanged.fire()
                }
                _findFavIndex(e) {
                    return this._favorites.findIndex(t => e === ne(t))
                }
            }

            function ne(e) {
                return "java" === e.type ? e.studyId : e.pineId
            }

            function ie(e) {
                return Object(J.isPineIdString)(e) ? {
                    type: "pine",
                    pineId: e
                } : {
                    type: "java",
                    studyId: e
                }
            }
            const re = {
                [q.ResolutionKind.Ticks]: !1,
                [q.ResolutionKind.Seconds]: !1,
                [q.ResolutionKind.Minutes]: !1,
                [q.SpecialResolutionKind.Hours]: !1,
                [q.ResolutionKind.Days]: !1,
                [q.ResolutionKind.Range]: !1
            };
            class oe extends A.b {
                constructor(e, t, a = re) {
                    super(e, t, "INTERVALS_MENU_VIEW_STATE_CHANGED", "IntervalWidget.menu.viewState", a)
                }
                isAllowed(e) {
                    return Object.keys(re).includes(e)
                }
            }
            A.b;
            var le = a("54XG");
            const ce = {
                    Area: 3,
                    Bars: 0,
                    Candles: 1,
                    "Heiken Ashi": 8,
                    "Hollow Candles": 9,
                    Line: 2
                },
                de = ["1", "30", "60"];

            function ue(e = []) {
                let t = e.map(e => ce[e]) || [1, 4, 5, 6];
                return d.enabled("widget") && (t = [0, 1, 3]), t
            }

            function he(e = []) {
                return Object(z.mergeResolutions)(e, d.enabled("star_some_intervals_by_default") ? de : [])
            }
            new B(H.TVXWindowEvents, K, he()), new N(H.TVXWindowEvents, K, ue()), new le.FavoriteStudyTemplateService(H.TVXWindowEvents, K);
            const me = {
                tools: h.any.isRequired,
                isFundamental: h.any,
                chartApiInstance: h.any,
                availableTimeFrames: h.any,
                chartWidgetCollection: h.any,
                windowMessageService: h.any,
                favoriteChartStylesService: h.any,
                favoriteIntervalsService: h.any,
                intervalService: h.any,
                favoriteStudyTemplatesService: h.any,
                studyTemplates: h.any,
                chartChangesWatcher: h.any,
                saveChartService: h.any,
                sharingChartService: h.any,
                loadChartService: h.any,
                chartWidget: h.any,
                favoriteScriptsModel: h.any,
                intervalsMenuViewStateService: h.any,
                templatesMenuViewStateService: h.any,
                financialsDialogController: h.any,
                snapshotUrl: h.any
            };
            var ve = a("gWrr"),
                pe = a("6aN0");
            const fe = [];
            class be extends s.PureComponent {
                constructor(e) {
                    super(e), this._saveLoadSyncEmitter = new l.a, this._handleFullWidthChange = e => {
                        this._fullWidth = e, this.setState({
                            measureValid: !1
                        })
                    }, this._handleFavoritesWidthChange = e => {
                        this._favoritesWidth = e, this.setState({
                            measureValid: !1
                        })
                    }, this._handleCollapseWidthChange = e => {
                        this._collapseWidth = e, this.setState({
                            measureValid: !1
                        })
                    }, this._handleMeasure = e => {
                        this.setState({
                            availableWidth: e,
                            measureValid: !1
                        })
                    };
                    const {
                        tools: t,
                        windowMessageService: a,
                        chartWidgetCollection: s,
                        chartApiInstance: n,
                        availableTimeFrames: r,
                        isFundamental: o,
                        favoriteIntervalsService: u,
                        favoriteChartStylesService: h,
                        favoriteStudyTemplatesService: m,
                        studyTemplates: v,
                        saveChartService: p,
                        sharingChartService: f,
                        loadChartService: b,
                        financialsDialogController: g,
                        snapshotUrl: y
                    } = e;
                    this._showScrollbarWhen = Object(i.ensureDefined)(e.allowedModes).slice(-1), this._panelWidthChangeHandlers = {
                        full: this._handleFullWidthChange,
                        medium: this._handleFavoritesWidthChange,
                        small: this._handleCollapseWidthChange
                    };
                    const {
                        chartChangesWatcher: S
                    } = e;
                    this._chartChangesWatcher = S;
                    const _ = ue(this.props.defaultFavoriteStyles);
                    this._favoriteChartStylesService = h || new N(H.TVXWindowEvents, K, _);
                    const E = he(this.props.defaultFavoriteIntervals);
                    this._favoriteIntervalsService = u || new B(H.TVXWindowEvents, K, E), this._intervalsMenuViewStateService = new oe(H.TVXWindowEvents, K), this._intervalService = new Q(n), this._registry = {
                        tools: t,
                        isFundamental: o,
                        chartWidgetCollection: s,
                        windowMessageService: a,
                        chartApiInstance: n,
                        availableTimeFrames: r,
                        favoriteStudyTemplatesService: m,
                        studyTemplates: v,
                        saveChartService: p,
                        sharingChartService: f,
                        loadChartService: b,
                        intervalsMenuViewStateService: this._intervalsMenuViewStateService,
                        favoriteChartStylesService: this._favoriteChartStylesService,
                        favoriteIntervalsService: this._favoriteIntervalsService,
                        intervalService: this._intervalService,
                        chartChangesWatcher: this._chartChangesWatcher,
                        chartWidget: s.activeChartWidget.value(),
                        favoriteScriptsModel: se.getInstance(),
                        templatesMenuViewStateService: this._templatesMenuVuewStateService,
                        financialsDialogController: g,
                        snapshotUrl: y
                    }, this.state = {
                        isVisible: !0,
                        availableWidth: 0,
                        displayMode: "full",
                        measureValid: !1,
                        leftCustomElements: [],
                        rightCustomElements: []
                    }, this._readOnly = s.readOnly(), this._features = {
                        allowFavoriting: d.enabled("items_favoriting"),
                        showIdeasButton: Boolean(this.props.ideas),
                        showLaunchInPopupButton: Boolean(this.props.popupButton),
                        allowSymbolSearchSpread: d.enabled("header_symbol_search") && d.enabled("show_spread_operators"),
                        allowToolbarHiding: d.enabled("collapsible_header")
                    }, this._setDisplayMode = Object(c.default)(this._setDisplayMode, 100), this._negotiateResizer()
                }
                componentDidUpdate(e, t) {
                    const {
                        isVisible: a,
                        measureValid: s
                    } = this.state;
                    a !== t.isVisible && (u.emit("toggle_header", a), this._negotiateResizer()), s || this._setDisplayMode()
                }
                render() {
                    const {
                        resizerBridge: e,
                        allowedModes: t,
                        ...a
                    } = this.props, {
                        displayMode: n,
                        isVisible: o,
                        leftCustomElements: l,
                        rightCustomElements: c
                    } = this.state, d = {
                        features: this._features,
                        readOnly: this._readOnly,
                        isFake: !1,
                        saveLoadSyncEmitter: this._saveLoadSyncEmitter,
                        leftCustomElements: l,
                        rightCustomElements: c,
                        ...a
                    }, u = { ...d,
                        isFake: !0,
                        showScrollbarWhen: fe
                    }, h = Object(i.ensureDefined)(t), m = this.props.tools.PublishButtonManager || s.Fragment;
                    return s.createElement(V.a, {
                        value: this._registry,
                        validation: me
                    }, s.createElement(m, null, s.createElement("div", {
                        className: r(pe.toolbar, {
                            [pe.isHidden]: !o
                        }),
                        onClick: this.props.onClick
                    }, s.createElement("div", {
                        className: pe.overflowWrap
                    }, s.createElement(T, {
                        key: "live",
                        showScrollbarWhen: this._showScrollbarWhen,
                        displayMode: n,
                        onAvailableSpaceChange: this._handleMeasure,
                        ...d
                    }), h.map(e => s.createElement(T, {
                        key: e,
                        displayMode: e,
                        onWidthChange: this._panelWidthChangeHandlers[e],
                        ...u
                    }))))))
                }
                addButton(e, t = "left") {
                    const a = new P.a(0),
                        s = Object(ve.b)(`<div class="apply-common-tooltip ${pe.customButton}">`),
                        n = {
                            type: "Button",
                            params: {
                                key: Number(new Date),
                                element: s,
                                width: a
                            },
                            id: e
                        },
                        {
                            leftCustomElements: i,
                            rightCustomElements: r
                        } = this.state;
                    return "left" === t ? this.setState({
                        leftCustomElements: [...i, n]
                    }) : this.setState({
                        rightCustomElements: [...r, n]
                    }), s
                }
                addDropdown(e, t) {
                    const {
                        leftCustomElements: a,
                        rightCustomElements: s
                    } = this.state, n = {
                        type: "Dropdown",
                        id: e,
                        params: t
                    };
                    "left" === t.align ? this.setState({
                        leftCustomElements: [...a, n]
                    }) : this.setState({
                        rightCustomElements: [...s, n]
                    })
                }
                updateDropdown(e, t) {
                    const a = t => "Dropdown" === t.type && t.id === e,
                        s = this.state.leftCustomElements.find(a) || this.state.rightCustomElements.find(a);
                    void 0 !== s && (s.params = { ...s.params,
                        ...t
                    }, this.setState({
                        leftCustomElements: this.state.leftCustomElements.slice(),
                        rightCustomElements: this.state.rightCustomElements.slice()
                    }))
                }
                removeDropdown(e) {
                    const t = t => "Dropdown" === t.type && t.id !== e,
                        a = this.state.leftCustomElements.filter(t),
                        s = this.state.rightCustomElements.filter(t);
                    this.setState({
                        leftCustomElements: a,
                        rightCustomElements: s
                    })
                }
                _negotiateResizer() {
                    this.props.resizerBridge.negotiateHeight(this.state.isVisible ? Y.b : Y.a)
                }
                _setDisplayMode() {
                    const {
                        availableWidth: e
                    } = this.state, {
                        allowedModes: t
                    } = this.props, a = {
                        full: this._fullWidth,
                        medium: this._favoritesWidth,
                        small: this._collapseWidth
                    }, s = Object(i.ensureDefined)(t);
                    let n = s.map(e => a[e]).findIndex(t => e >= t); - 1 === n && (n = s.length - 1);
                    const r = s[n];
                    this.setState({
                        measureValid: !0,
                        displayMode: r
                    })
                }
            }
            be.defaultProps = {
                allowedModes: ["full", "medium"]
            }, a.d(t, "HeaderToolbarRenderer", (function() {
                return ge
            }));
            class ge {
                constructor(e, t) {
                    this._component = null, this._handleRef = e => {
                        this._component = e
                    }, this._container = e, n.render(s.createElement(be, { ...t,
                        ref: this._handleRef
                    }), this._container)
                }
                destroy() {
                    n.unmountComponentAtNode(this._container)
                }
                getComponent() {
                    return Object(i.ensureNotNull)(this._component)
                }
            }
        },
        KkTf: function(e, t) {
            e.exports = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17"><path stroke="currentColor" stroke-width="1.2" d="M1 1l15 15m0-15L1 16"/></svg>'
        },
        KrBX: function(e, t, a) {
            e.exports = {
                group: "group-3uonVBsm",
                noLeftDecoration: "noLeftDecoration-3uonVBsm",
                noRightDecoration: "noRightDecoration-3uonVBsm",
                noMinimalWidth: "noMinimalWidth-3uonVBsm"
            }
        },
        "a+Yp": function(e, t, a) {
            e.exports = {
                wrap: "wrap-35jKyg6w",
                icon: "icon-35jKyg6w"
            }
        },
        a8bL: function(e, t, a) {
            e.exports = {
                "css-value-header-toolbar-height": "38px",
                inner: "inner-pzOKvpP8",
                fake: "fake-pzOKvpP8",
                fill: "fill-pzOKvpP8",
                minimalPriority: "minimalPriority-pzOKvpP8",
                collapse: "collapse-pzOKvpP8",
                button: "button-pzOKvpP8",
                iconButton: "iconButton-pzOKvpP8",
                hidden: "hidden-pzOKvpP8",
                symbolSearch: "symbolSearch-pzOKvpP8",
                symbolSearchClose: "symbolSearchClose-pzOKvpP8",
                content: "content-pzOKvpP8",
                desktopPublish: "desktopPublish-pzOKvpP8",
                mobilePublish: "mobilePublish-pzOKvpP8"
            }
        },
        bQ7Y: function(e, t, a) {
            e.exports = {
                button: "button-2Vpz_LXc",
                hover: "hover-2Vpz_LXc",
                isInteractive: "isInteractive-2Vpz_LXc",
                isGrouped: "isGrouped-2Vpz_LXc",
                isActive: "isActive-2Vpz_LXc",
                isOpened: "isOpened-2Vpz_LXc",
                isDisabled: "isDisabled-2Vpz_LXc",
                text: "text-2Vpz_LXc",
                icon: "icon-2Vpz_LXc"
            }
        },
        cSDC: function(e, t, a) {
            "use strict";
            a.d(t, "a", (function() {
                return n
            }));
            var s = a("YFKU");
            const n = [{
                name: "1",
                label: Object(s.t)("minutes", {
                    context: "interval"
                })
            }, {
                name: "1H",
                label: Object(s.t)("hours", {
                    context: "interval"
                })
            }, {
                name: "1D",
                label: Object(s.t)("days", {
                    context: "interval"
                })
            }, {
                name: "1W",
                label: Object(s.t)("weeks", {
                    context: "interval"
                })
            }, {
                name: "1M",
                label: Object(s.t)("months", {
                    context: "interval"
                })
            }]
        },
        "tO+E": function(e, t, a) {
            e.exports = {
                "css-value-header-toolbar-height": "38px",
                wrap: "wrap-1ETeWwz2"
            }
        },
        tU7i: function(e, t, a) {
            "use strict";
            a.d(t, "a", (function() {
                return o
            })), a.d(t, "b", (function() {
                return l
            }));
            var s = a("q1tI"),
                n = a("TSYQ"),
                i = a("Iivm"),
                r = a("bQ7Y");
            const o = r,
                l = s.forwardRef((e, t) => {
                    const {
                        icon: a,
                        isActive: o,
                        isOpened: l,
                        isDisabled: c,
                        isGrouped: d,
                        isHovered: u,
                        onClick: h,
                        text: m,
                        textBeforeIcon: v,
                        title: p,
                        theme: f = r,
                        className: b,
                        forceInteractive: g,
                        "data-name": y,
                        ...S
                    } = e, _ = n(b, f.button, p && "apply-common-tooltip", {
                        [f.isActive]: o,
                        [f.isOpened]: l,
                        [f.isInteractive]: (g || Boolean(h)) && !c,
                        [f.isDisabled]: c,
                        [f.isGrouped]: d,
                        [f.hover]: u
                    }), E = a && ("string" == typeof a ? s.createElement(i.a, {
                        className: f.icon,
                        icon: a
                    }) : s.cloneElement(a, {
                        className: n(f.icon, a.props.className)
                    }));
                    return s.createElement("div", { ...S,
                        ref: t,
                        "data-role": "button",
                        className: _,
                        onClick: c ? void 0 : h,
                        title: p,
                        "data-name": y
                    }, v && m && s.createElement("div", {
                        className: n("js-button-text", f.text)
                    }, m), E, !v && m && s.createElement("div", {
                        className: n("js-button-text", f.text)
                    }, m))
                })
        }
    }
]);
(window.webpackJsonp = window.webpackJsonp || []).push([
    ["study-pane-views"], {
        "1sos": function(e, t, i) {
            "use strict";
            i.r(t), i.d(t, "HorizLinePaneView", (function() {
                return o
            }));
            var s = i("Eyy1"),
                n = i("VdBB"),
                r = i("Zy3/"),
                a = i("l4sv");
            class o {
                constructor(e, t, i) {
                    this._data = [], this._invalidated = !0, this._provider = e, this._model = t, this._hitTestResult = void 0 !== i ? new n.HitTestResult(n.HitTestResult.CUSTOM, i) : new n.HitTestResult(n.HitTestResult.REGULAR)
                }
                update() {
                    this._invalidated = !0
                }
                renderer() {
                    this._invalidated && (this._updateViewInternal(), this._invalidated = !1);
                    const e = new r.CompositeRenderer;
                    for (const t of this._data) {
                        const i = new a.HorizontalLineRenderer;
                        i.setData(t), i.setHitTest(this._hitTestResult), e.append(i)
                    }
                    return e
                }
                _updateViewInternal() {
                    this._data = [];
                    const e = this._provider.priceScale(),
                        t = this._model.timeScale();
                    if (!e || e.isEmpty() || t.isEmpty()) return;
                    const i = this._provider.graphics().horizlines();
                    if (0 === i.size) return;
                    const n = this._model.timeScale().visibleBarsStrictRange();
                    if (null === n) return;
                    const r = this._provider.firstValue();
                    if (null === r) return;
                    const a = n.firstBar(),
                        o = n.lastBar();
                    i.forEach((i, n) => {
                        const l = this._provider.properties().graphics.horizlines[n];
                        l.visible.value() && i.forEach(i => {
                            const n = i.startIndex,
                                c = i.endIndex;
                            !i.extendRight && Math.max(n, c) < a || !i.extendLeft && Math.min(n, c) > o || this._data.push({
                                y: e.priceToCoordinate(Object(s.ensureDefined)(i.level), r),
                                left: i.extendLeft ? void 0 : t.indexToCoordinate(n),
                                right: i.extendRight ? void 0 : t.indexToCoordinate(c),
                                color: l.color.value(),
                                linewidth: l.width.value(),
                                linestyle: l.style.value()
                            })
                        })
                    })
                }
            }
        },
        Gj0v: function(e, t, i) {
            "use strict";
            i.r(t);
            var s = i("Eyy1"),
                n = i("VdBB"),
                r = i("Zy3/"),
                a = i("qgcf"),
                o = i("aO4+"),
                l = i("eJTA"),
                c = i("ikwP"),
                h = i("KG+6"),
                d = i("nEwK"),
                u = i("zDbI");

            function f(e, t) {
                return {
                    min: Math.min(e, t),
                    max: Math.max(e, t)
                }
            }

            function p(e) {
                return e.max - e.min
            }
            class v {
                constructor(e) {
                    this._data = e
                }
                hitTest(e, t) {
                    const i = this._data;
                    for (const s of i.histograms) {
                        if (s.yRange.min >= e.y || e.y >= s.yRange.max) continue;
                        let r = s.yRange.min,
                            a = null;
                        const o = p(s.xRange);
                        for (const l of s.bars) {
                            const c = i.styles[l.styleId];
                            if (!c.visible) continue;
                            if (c.location === h.b.Absolute && (s.xRange.min >= e.x || e.x >= s.xRange.max)) continue;
                            null === a && (a = 0, s.bars.forEach(e => {
                                const t = e.subBarValues.reduce((e, t) => e + t);
                                a = Math.max(a, t)
                            }));
                            const d = m(s.xRange, c, t.cssWidth),
                                {
                                    xBasePoint: u,
                                    sign: p
                                } = d,
                                v = f(r, r + l.height);
                            r += l.height;
                            const _ = Math.max(c.percentWidth * o / 100 - l.subBarValues.length, 0);
                            for (let t = 0; t < l.subBarValues.length; t++) {
                                const i = v.min,
                                    s = v.max,
                                    r = 0 === t ? u : u + p * (_ * l.subBarValues[t - 1] / a),
                                    o = r + p * (_ * l.subBarValues[t] / a);
                                if ((e.x >= r && e.x <= o || e.x >= o && e.x <= r) && e.y >= i && e.y <= s) return new n.HitTestResult(n.HitTestResult.REGULAR)
                            }
                        }
                    }
                    return null
                }
                draw(e, t) {
                    const i = this._data;
                    e.save(), i.histograms.forEach(s => {
                        const n = [];
                        let r = s.yRange.min,
                            a = 0,
                            o = 0;
                        s.bars.forEach(e => {
                            const t = e.subBarValues.reduce((e, t) => e + t);
                            a = Math.max(a, t), o += e.height
                        });
                        const c = o / s.bars.length,
                            h = (d = c, u = t.pixelRatio, Math.floor(d * u) >= 1 * u ? Math.floor(u) : 0);
                        var d, u;
                        const v = p(s.xRange),
                            x = [];
                        if (s.bars.forEach(o => {
                                const l = i.styles[o.styleId];
                                if (!l.visible) return;
                                if (l.showValues)
                                    for (let e = 0; e < o.subBarValues.length; e++) n[e] = (n[e] || 0) + o.subBarValues[e];
                                const c = m(s.xRange, l, t.cssWidth),
                                    {
                                        xBasePoint: d,
                                        sign: u
                                    } = c,
                                    p = f(r, r + o.height);
                                if (r += o.height, p.min > t.cssHeight || p.max < 0) return;
                                const R = Math.max(l.percentWidth * v / 100 - o.subBarValues.length, 0);
                                for (let i = 0; i < o.subBarValues.length; i++) {
                                    const s = p.min,
                                        n = p.max,
                                        r = 0 === i ? d : d + u * (R * o.subBarValues[i - 1] / a),
                                        c = r + u * (R * o.subBarValues[i] / a);
                                    if (Math.abs(c - r) < .5) continue;
                                    e.fillStyle = l.colors[i], e.beginPath();
                                    const f = Math.round(r * t.pixelRatio),
                                        v = Math.round(s * t.pixelRatio),
                                        m = Math.round(c * t.pixelRatio),
                                        _ = Math.round(n * t.pixelRatio),
                                        g = m - f,
                                        x = Math.max(_ - v - h, 1);
                                    e.rect(f, v, g, x), e.fill()
                                }
                                if (!l.showValues) return;
                                const b = _(o.subBarValues, l.direction),
                                    y = g(v, p, c, l, b);
                                x.push(y)
                            }), x.length > 0) {
                            const e = i.styles[s.bars[0].styleId],
                                a = m(s.xRange, e, t.cssWidth),
                                o = f(r, r + c),
                                h = _(n, e.direction),
                                d = g(v, o, a, e, h);
                            d.color = Object(l.shiftColor)(d.color, 1.5), x.push(d)
                        }
                        const b = Math.min(...x.map(e => e.fontSize));
                        if (b >= 7.5)
                            for (const i of x) i.fontSize = b, R(e, t, i)
                    }), e.restore()
                }
            }

            function m(e, t, i) {
                const s = t.location === h.b.Absolute,
                    n = t.location === h.b.Relative,
                    r = t.direction === h.a.LeftToRight,
                    a = t.direction === h.a.RightToLeft;
                let o, l;
                if (s && r) o = e.min, l = 1;
                else if (s && a) o = e.max, l = -1;
                else if (n && r) o = 0, l = 1;
                else {
                    if (!n || !a) throw new Error(`Unknown location/direction values: ${t.location}/${t.direction}`);
                    o = i, l = -1
                }
                return {
                    xBasePoint: o,
                    sign: l
                }
            }

            function _(e, t) {
                t === h.a.RightToLeft && (e = e.slice()).reverse();
                const i = new d.VolumeFormatter;
                return e.map(e => i.format(e)).join("x")
            }

            function g(e, t, i, s, n) {
                const r = Math.min(Math.round(1.7 * e / n.length), Math.round(.6 * p(t))),
                    a = s.direction === h.a.LeftToRight ? "left" : "right",
                    {
                        xBasePoint: l,
                        sign: c
                    } = i,
                    d = l + 3 * c,
                    u = t.min + .7 * p(t);
                return {
                    text: n,
                    color: s.valuesColor,
                    fontSize: r,
                    align: a,
                    point: new o.Point(d, u)
                }
            }

            function R(e, t, i) {
                const {
                    text: s,
                    color: n,
                    fontSize: r,
                    align: a,
                    point: o
                } = i;
                e.font = `${r}px ${u.CHART_FONT_FAMILY}`, e.fillStyle = n, e.textAlign = a, Object(c.drawScaled)(e, t.pixelRatio, () => e.fillText(s, o.x, o.y))
            }
            var x = i("Tmoa");
            i.d(t, "HHistPaneView", (function() {
                return b
            }));
            class b {
                constructor(e, t, i) {
                    this._invalidated = !0, this._provider = e, this._model = t, this._rendererData = {
                        histograms: [],
                        styles: {}
                    }, this._textData = [], this._hhistRenderer = new v(this._rendererData)
                }
                update() {
                    this._invalidated = !0
                }
                renderer() {
                    this._invalidated && (this._updateViewInternal(), this._invalidated = !1);
                    const e = new r.CompositeRenderer;
                    e.append(this._hhistRenderer);
                    for (const t of this._textData) e.append(new a.TextRenderer(t, new n.HitTestResult(n.HitTestResult.REGULAR)));
                    return e
                }
                _resetRenderersData() {
                    this._rendererData.histograms = [], this._textData = []
                }
                _prepareStyles() {
                    const e = Object(s.ensureDefined)(this._provider.graphicsInfo().hhists),
                        t = Object.keys(e),
                        i = this._provider.properties().graphics.hhists;
                    this._rendererData.styles = {};
                    for (const n of t) {
                        const t = Object(s.ensureDefined)(i.child(n)),
                            r = Object(s.ensureDefined)(e[n]),
                            a = Object(x.generateColor)(t.colors[0].value(), t.transparencies[0].value()),
                            o = t.colors[1] ? Object(x.generateColor)(t.colors[1].value(), t.transparencies[1].value()) : a;
                        this._rendererData.styles[n] = {
                            colors: [a, o],
                            visible: t.visible.value(),
                            percentWidth: t.percentWidth.value(),
                            location: r.location,
                            direction: t.direction.value(),
                            showValues: t.showValues.value(),
                            valuesColor: t.valuesColor.value()
                        }
                    }
                }
                _updateViewInternal() {
                    this._resetRenderersData();
                    const e = this._provider.priceScale(),
                        t = this._model.timeScale();
                    if (!e || e.isEmpty() || t.isEmpty()) return;
                    if (null === this._provider.firstValue()) return;
                    const i = this._provider.graphics().hhistsByTimePointIndex();
                    if (0 === i.size) return;
                    const n = t.visibleBarsStrictRange();
                    if (null === n) return;
                    const r = n.firstBar(),
                        a = n.lastBar();
                    this._prepareStyles(), Object(s.ensureDefined)(i).forEach((i, s) => {
                        let n = 1 / 0,
                            o = -1 / 0;
                        i.forEach(e => {
                            n = Math.min(n, e.firstBarTime), o = Math.max(o, e.lastBarTime)
                        }), o < r || n > a || this._updateDataForRenderers(i, e, t)
                    })
                }
                _updateDataForRenderers(e, t, i) {
                    if (e.size <= 0) return;
                    let n = null;
                    if (e.forEach(e => {
                            n = n || e
                        }), null === n) return;
                    let r = n;
                    e.forEach(e => {
                        e.priceLow < r.priceLow && (r = e)
                    });
                    const a = function(e, t) {
                            return f(t.indexToCoordinate(e.firstBarTime), t.indexToCoordinate(e.lastBarTime))
                        }(n, i),
                        o = [];
                    e.forEach(e => {
                        null == e.rate[e.rate.length - 1] && e.rate.splice(-1, 1);
                        const i = function(e, t, i) {
                            return f(t.priceToCoordinate(e.priceHigh, i), t.priceToCoordinate(e.priceLow, i))
                        }(e, t, Object(s.ensureNotNull)(this._provider.firstValue()));
                        o.push({
                            yRange: i,
                            subBarValues: e.rate,
                            styleId: e.styleId
                        })
                    }), o.sort((e, t) => e.yRange.min - t.yRange.min);
                    const l = [];
                    let c = o[0].yRange.min;
                    for (const e of o) {
                        const t = e.yRange.max - c;
                        l.push({
                            height: t,
                            ...e
                        }), c = e.yRange.max
                    }
                    this._rendererData.histograms.push({
                        xRange: a,
                        yRange: f(o[0].yRange.min, c),
                        bars: l
                    })
                }
            }
        },
        psYU: function(e, t, i) {
            "use strict";
            i.r(t), i.d(t, "VertLinePaneView", (function() {
                return l
            }));
            var s = i("Eyy1"),
                n = i("VdBB"),
                r = i("972a"),
                a = i("Zy3/"),
                o = i("z+cS");
            class l {
                constructor(e, t, i) {
                    this._data = [], this._invalidated = !0, this._provider = e, this._model = t, this._hitTestResult = void 0 !== i ? new n.HitTestResult(n.HitTestResult.CUSTOM, i) : new n.HitTestResult(n.HitTestResult.REGULAR)
                }
                update() {
                    this._invalidated = !0
                }
                renderer() {
                    this._invalidated && (this._updateViewInternal(), this._invalidated = !1);
                    const e = new a.CompositeRenderer;
                    for (const t of this._data) {
                        const i = new o.VerticalLineRenderer;
                        i.setData(t), i.setHitTest(this._hitTestResult), e.append(i)
                    }
                    return e
                }
                _updateViewInternal() {
                    this._data = [];
                    const e = this._provider.priceScale(),
                        t = this._model.timeScale();
                    if (!e || e.isEmpty() || t.isEmpty()) return;
                    const i = this._provider.graphicsInfo().vertlines,
                        n = this._provider.graphics().vertlines();
                    if (0 === n.size || void 0 === i) return;
                    const a = this._model.timeScale().visibleBarsStrictRange();
                    if (null === a) return;
                    const o = this._provider.firstValue();
                    if (null === o) return;
                    const l = a.firstBar(),
                        c = a.lastBar();
                    n.forEach((n, a) => {
                        const h = this._provider.properties().graphics.vertlines[a];
                        if (!h.visible.value()) return;
                        let d = 0;
                        switch (Object(s.ensureDefined)(i[a]).halign) {
                            case r.a.Left:
                                d = -t.barSpacing() / 2;
                                break;
                            case r.a.Right:
                                d = t.barSpacing() / 2
                        }
                        n.forEach(i => {
                            const n = i.index;
                            n < l || c < n || this._data.push({
                                x: t.indexToCoordinate(n) + d,
                                top: i.extendTop ? void 0 : e.priceToCoordinate(Object(s.ensureDefined)(i.endPrice), o),
                                bottom: i.extendBottom ? void 0 : e.priceToCoordinate(Object(s.ensureDefined)(i.startPrice), o),
                                color: h.color.value(),
                                linewidth: h.width.value(),
                                linestyle: h.style.value()
                            })
                        })
                    })
                }
            }
        }
    }
]);
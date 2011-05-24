var DISQUS = function(d, k) {
    function p(a) {
        var c = a.currentTarget || a.srcElement, e = c.getAttribute("data-callback-id");
        if (a.type == "load" || /^(complete|loaded)$/.test(c.readyState)) e && b.trigger("loader.onScriptLoaded", {
            args: [ e ]
        }), c.removeEventListener ? c.removeEventListener("load", p, !1) : c.detachEvent("onreadystatechange", p);
    }
    var i = d.document, u = 0, j = {}, s = i.getElementsByTagName("head")[0] || i.getElementsByTagName("body")[0], l = {
        running: !1,
        timer: null,
        queue: []
    }, q = {
        "0.0": {},
        "1.0": {}
    }, b = {
        config: {},
        browser: {
            ie: /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent),
            ie6: !d.XMLHttpRequest,
            ie7: !(!i.all || d.opera || !d.XMLHttpRequest),
            webkit: ~navigator.userAgent.indexOf("AppleWebKit/"),
            opera: !(!d.opera || !d.opera.buildNumber),
            gecko: ~navigator.userAgent.indexOf("Gecko/"),
            mobile: /(iPhone|Android|iPod|iPad|webOS|Mobile Safari|Windows Phone)/i.test(navigator.userAgent),
            quirks: i.compatMode === "BackCompat"
        },
        blocks: {},
        status: null,
        modules: {},
        settings: {
            realtime_url: "http://rt.disqus.com/forums/realtime.js",
            urls: {
                unmerged_profiles: "http://disqus.com/embed/profile/unmerged_profiles/"
            },
            minify_js: !0,
            debug: !1,
            disqus_url: "http://disqus.com",
            uploads_url: "http://media.disqus.com/uploads",
            recaptcha_public_key: "6LdKMrwSAAAAAPPLVhQE9LPRW4LUSZb810_iaa8u",
            media_url: "http://mediacdn.disqus.com/1306270476"
        },
        AssertionError: function(a) {
            this.message = a;
        }
    };
    b.AssertionError.prototype.toString = function() {
        return "AssertionError: " + this.message;
    };
    b.assert = function(a, c) {
        if (!a) throw new b.AssertionError(c);
    };
    b.api = function(a, c) {
        var e = b.comm && b.comm.Default.recover();
        if (e) {
            if (!c.type) c.type = "GET";
            if (!c.success) c.success = function() {};
            if (!c.failure) c.failure = function() {};
            if (!c.data) c.data = {};
            e.api(a, c.data, c.type, c.success, c.failure);
        } else b.once("loader.onDefaultChannelReady", function() {
            b.api(a, c);
        });
    };
    b.bind = function(a, c) {
        j[a] || (j[a] = {});
        var e = b.getGuid();
        c.guid = e;
        j[a][e] = c;
    };
    b.once = function(a, c) {
        c.once = !0;
        b.bind(a, c);
    };
    b.unbind = function(a, b) {
        j[a] && j[a][b] && delete j[a][b];
    };
    b.unbindAll = function(a) {
        a || (j = {});
        a && j[a] && (j[a] = {});
    };
    b.contains = function(a, b) {
        for (var e = 0, f = a.length; e < f; e++) if (a[e] == b) return !0;
        return !1;
    };
    b.defer = function(a, c) {
        function e() {
            var a = l.queue;
            if (a.length === 0) l.running = !1, clearInterval(l.timer);
            try {
                for (var c = 0, e; e = a[c]; c++) e[0]() && (a.splice(c--, 1), e[1]());
            } catch (d) {
                if (!(d instanceof b.AssertionError)) throw d;
            }
        }
        l.queue.push([ a, c ]);
        e();
        if (!l.running) l.running = !0, l.timer = setInterval(e, 100);
    };
    b.each = function(a, b) {
        var e = a.length, f = Array.prototype.forEach;
        if (isNaN(e)) for (var d in a) a.hasOwnProperty(d) && b(a[d], d, a); else if (f) f.call(a, b); else for (f = 0; f < e; f++) b(a[f], f, a);
    };
    b.empty = function(a) {
        for (var b in a) if (a.hasOwnProperty(b)) return !1;
        return !0;
    };
    b.extend = function() {
        var a, c;
        arguments.length <= 1 ? (a = b, c = [ arguments[0] || {} ]) : (a = arguments[0] || {}, c = Array.prototype.slice.call(arguments, 1));
        b.each(c, function(c) {
            b.each(c, function(b, c) {
                a[c] = b;
            });
        });
        return a;
    };
    b.getGuid = function() {
        return u++;
    };
    b.partial = function() {
        var a = arguments[0], b = Array.prototype.slice.call(arguments, 1);
        return function() {
            for (var e = Array.prototype.slice.call(arguments), d = [], h = 0, g = b.length; h < g; h++) d.push(b[h] === k ? e.shift() : b[h]);
            for (; e.length > 0; ) d.push(e.shift());
            return a.apply(this, d);
        };
    };
    b.serializeArgs = function(a) {
        var c = [];
        b.each(a, function(a, b) {
            c.push(b + (a !== null ? "=" + encodeURIComponent(a) : ""));
        });
        return c.join("&");
    };
    b.serialize = function(a, c, e) {
        c && (a += ~a.indexOf("?") ? a.charAt(a.length - 1) == "&" ? "" : "&" : "?", a += b.serializeArgs(c));
        if (e) return c = {}, c[(new Date).getTime()] = null, b.serialize(a, c);
        c = a.length;
        return a.charAt(c - 1) == "&" ? a.slice(0, c - 1) : a;
    };
    b.sdk = function(a) {
        function c(c) {
            return function() {
                var e = Array.prototype.slice.call(arguments);
                b.bind("loader.onSDKMethodReady", function(d, g, i) {
                    c != d || a != g || (i.apply({}, e), b.unbind(this.guid));
                });
            };
        }
        var e = q[a || "1.0"];
        b.assert(e !== k, "version is not supported.");
        if (!b.empty(e)) return e;
        b.require(b.settings.media_url + (b.settings.debug ? "/js/src/sdk/" : "/build/system/sdk/") + a + ".js");
        return {
            getThread: c("getThread"),
            getSession: c("getSession")
        };
    };
    b.sdk.add = function(a, c, e) {
        b.assert(q[c] !== k, "version is not supported.");
        q[c][a] = e;
        b.trigger("loader.onSDKMethodReady", {
            args: [ a, c, e ]
        });
    };
    b.trigger = function(a, c) {
        var e = c && c.args || [], d = c && c.guid, h = {};
        if (j[a] && (!d || j[a][d])) d ? h[c.guid] = j[a][d] : h = j[a], b.each(h, function(c, d) {
            c.apply({
                guid: d
            }, e);
            c.once && b.unbind(a, d);
        });
    };
    b.useSSL = function(a) {
        if (d.location.href.match("/^https/")) for (var c, e = [ "disqus_url", "media_url", "realtime_url", "uploads_url" ], a = a || b.settings, f = 0; f < e.length; f++) c = e[f], typeof a[c] == "string" && (a[c] = a[c].replace(/^http/, "https"));
    };
    b.useSSL();
    b.ready = function(a) {
        function c() {
            var a = b.settings.media_url, c = a + "/javascript/embed/dtpl/", d = a + "/build/system/", g;
            b.status = "loading";
            b.settings.debug ? (g = a + "/styles/dtpl/defaults.css", a = [ c + "dtpl.js", c + "utils.js", c + "sandbox.js", c + "tooltip.js", c + "comm.js", c + "ui.js", c + "sso.js", c + "compat.js", c + "facebook.js", d + "defaults.js", a + "/js/src/lib/easyxdm.js", a + "/js/src/json.js", a + "/js/src/sdk/1.0.js", b.settings.media_url + "/js/src/lib/stacktrace.js" ]) : (g = d + "/defaults.css", a = [ d + "disqus.js" ]);
            b.requireStylesheet(g);
            b.requireSet(a, b.settings.debug, function() {
                b.status = "ready";
                b.trigger("loader.onFilesReady");
            });
        }
        if (b.status == "ready") a(); else b.once("loader.onFilesReady", function() {
            a();
        });
        b.status === null && c();
    };
    b.require = function(a, c, d, f) {
        var h = i.createElement("script");
        h.src = b.serialize(a, c, d);
        h.async = !0;
        h.charset = "UTF-8";
        if (f) {
            var g = b.getGuid();
            b.bind("loader.onScriptLoaded", function(a) {
                a == g && (f(), b.unbind(this.guid));
            });
            h.setAttribute("data-callback-id", g);
            h.addEventListener ? h.addEventListener("load", p, !1) : h.attachEvent("onreadystatechange", p);
        }
        s.appendChild(h);
        return b;
    };
    b.requireSet = function(a, c, d) {
        var f = a.length;
        b.each(a, function(a) {
            b.require(a, {}, c, function() {
                --f === 0 && d();
            });
        });
    };
    b.requireStylesheet = function(a, c, d) {
        var f = i.createElement("link");
        f.rel = "stylesheet";
        f.type = "text/css";
        f.href = b.serialize(a, c, d);
        s.appendChild(f);
        return b;
    };
    b.addBlocks = function(a, c) {
        var d = b.modules;
        if (c) return function() {
            if (a == "all") c(), d.dtpl_defaults = !0, d.dtpl_theme = !0; else if (a == "defaults") c(), d.dtpl_defaults = !0; else if (a == "theme") d.dtpl_defaults ? (c(), d.dtpl_theme = !0) : b.defer(function() {
                return d.dtpl_defaults;
            }, function() {
                b.addBlocks(a, c);
            });
        }();
        var f = function() {
            return {
                Builder: b.strings.Builder,
                renderBlock: b.renderBlock,
                each: b.each,
                extend: b.extend,
                blocks: b.blocks,
                interpolate: b.strings.interpolate
            };
        };
        if (a === k) return function(a) {
            a(f());
            d.dtpl_defaults = !0;
            d.dtpl_theme = !0;
        }; else if (a == "defaults") return function(a) {
            a(f());
            d.dtpl_defaults = !0;
        }; else if (a == "theme") {
            if (d.dtpl_defaults) return function(a) {
                a(f());
                d.dtpl_theme = !0;
            };
            return function(c) {
                b.defer(function() {
                    return d.dtpl_defaults;
                }, function() {
                    b.addBlocks(a)(c);
                });
            };
        }
    };
    b.renderBlock = function(a, c) {
        var d = a;
        typeof a === "string" && (d = b.blocks[a]);
        if (d === k) throw "Block " + a + " was not found!";
        return b.sandbox.wrap(a, d, c);
    };
    b.events = {
        add: function(a, c, e) {
            b.assert(a.addEventListener || a.attachEvent, "Event registration not supported");
            if (a.addEventListener) return a.addEventListener(c, e, !1), e;
            var f = function() {
                var a = d.event;
                a.preventDefault = function() {
                    a.returnValue = !1;
                };
                return e(a);
            };
            a.attachEvent("on" + c, f);
            return f;
        },
        remove: function(a, b, d) {
            a.removeEventListener ? a.removeEventListener(b, d, !1) : a.detachEvent && a.detachEvent("on" + b, d);
        },
        debounce: function(a, c, d, f) {
            var g;
            b.events.add(a, c, function(a) {
                g && clearTimeout(g);
                g = setTimeout(function() {
                    d(a);
                }, f);
            });
        }
    };
    b.window = {
        getSize: function() {
            return typeof d.innerWidth == "number" ? [ d.innerWidth, d.innerHeight ] : i.documentElement ? [ i.documentElement.clientWidth || i.body.clientWidth, i.documentElement.clientHeight || i.body.clientHeight ] : [ -1, -1 ];
        },
        getScrollPosition: function() {
            var a = i.documentElement;
            return a && (a.scrollTop || a.scrollWidth) ? [ a.scrollWidth, a.scrollTop || i.body.scrollTop ] : [ i.body.scrollWidth, i.body.scrollTop ];
        }
    };
    var g = {};
    b.strings = {
        translations: {},
        setGlobalContext: function(a) {
            b.extend(g, a);
        },
        get: function(a) {
            return b.strings.translations[a] || a;
        },
        interpolate: function(a, b) {
            var d = [ b || {}, g ];
            return a.replace(/%\(\w+\)s/g, function(a) {
                a : {
                    for (var a = a.slice(2, -2), b = 0, c = d.length; b < c; b++) if (d[b][a] !== k) {
                        a = d[b][a].toString();
                        break a;
                    }
                    throw "Key " + a + "not found in context";
                }
                return a;
            });
        },
        pluralize: function(a, b, d) {
            return a != 1 ? d || "s" : b || "";
        },
        trim: function(a) {
            for (var a = a.replace(/^\s\s*/, ""), b = /\s/, d = a.length; b.test(a.charAt(--d)); ) ;
            return a.slice(0, d + 1);
        },
        capitalize: function(a) {
            return a.charAt(0).toUpperCase() + a.slice(1);
        }
    };
    b.strings.Builder = function() {
        this.value = b.browser.ie ? [] : "";
    };
    b.strings.Builder.prototype.put = function() {
        return b.browser.ie ? function(a) {
            this.value.push(a);
        } : function(a) {
            this.value += a;
        };
    }();
    b.strings.Builder.prototype.compile = function() {
        if (b.browser.ie) this.value = this.value.join("");
        return this.value;
    };
    b.addJob = b.defer;
    b.getResourceURL = b.serialize;
    b.lang = {
        contains: b.contains,
        forEach: b.each,
        extend: b.extend,
        trim: b.strings.trim,
        partial: b.partial
    };
    return b;
}(this);

(function(d) {
    function k(a, b) {
        return a.hasAttribute ? a.hasAttribute(b) : a.getAttribute(b) !== null;
    }
    function p() {
        for (var a, b = 0, d = n.length; b < d; b++) if (k(n[b], "name") && n[b].getAttribute("name") == "generator" && k(n[b], "content") && n[b].getAttribute("content") == "blogger") {
            a = g.getElementsByTagName("A");
            for (var c = 0, e = a.length; c < e; c++) if (!k(a[c], "src") && k(a[c], "name") && parseInt(a[c].getAttribute("name"), 10) && a[c].innerHTML === "") return a[c].getAttribute("name");
        }
        return null;
    }
    function i(a) {
        for (var b = 0, d = a.length; b < d; b++) if (a.charCodeAt(b) > 256) return !0;
        return !1;
    }
    function u(a) {
        var b = 0, d = 0;
        if (!a.offsetParent) return [ 0, 0 ];
        do b += a.offsetLeft, d += a.offsetTop, a = a.offsetParent; while (a);
        return [ b, d ];
    }
    function j(b) {
        var d = a.window.getScrollPosition()[1], c = d + a.window.getSize()[1];
        return b >= d && b <= c;
    }
    function s() {
        var b = d.location.href, t = d.location.hash, g = e || {}, y = p();
        a.extend(a.config, {
            container_id: x || "disqus_thread1",
            page: {
                url: G || b,
                title: H || "",
                sort: I || "",
                per_page: v || null,
                category_id: F || "",
                developer: +J,
                identifier: K || ""
            },
            trackback_url: g.trackback_url || null,
            trackbacks: g.trackbacks || null,
            absorbStyles: !1
        });
        if (y) a.config.page.blogger_id = y;
        a.config.message = !r || a.browser.ie && i(r) ? "" : r.length > 400 ? r.substring(0, r.indexOf(" ", 350)) : r;
        if (typeof z != "undefined") a.config.page.require_mod_s = z;
        if (typeof A != "undefined") a.config.page.remote_auth_s2 = A;
        if (typeof f != "undefined") a.config.page.author_s2 = f;
        if (typeof v != "undefined") a.config.page.per_page = v;
        if (typeof B != "undefined") a.config.page.slug = B;
        if (t && (b = t.match(/comment\-([0-9]+)/))) a.config.page.anchor_post_id = b[1];
        a.config.callback_params = E || null;
        typeof h == "function" && a.bind("thread.onReady", function() {
            h(a.config.callback_params);
        });
        if (typeof C == "object") a.config.custom_strings = C;
        a.extend(a.config, {
            domain: L || (M ? "dev.disqus.org" : "disqus.com"),
            shortname: N || a.getShortname(),
            facebook_forum: O || null,
            facebook_key: P || null,
            def_name: Q,
            def_email: R,
            def_text: S || "",
            skip_auth: T || !1
        });
        a.config.json_url = "//" + a.config.shortname + "." + a.config.domain + "/thread.js";
        (function() {
            if (typeof d.disqus_config == "function") {
                var b = {
                    preData: "loader.onReady",
                    preInit: "loader.onDataReady",
                    onInit: "loader.onLibraryReady",
                    afterRender: "loader.onTemplateReady",
                    onReady: "thread.onReady",
                    onPaginate: "thread.onPaginate",
                    onNewComment: "comment.onCreate",
                    preReset: "thread.beforeReset"
                };
                a.config.callbacks = {};
                a.each(b, function(b, d) {
                    a.config.callbacks[d] = [];
                });
                try {
                    c.call(a.config);
                } catch (m) {}
                a.each(a.config.callbacks, function(d, c) {
                    d.length !== 0 && a.each(d, function(d) {
                        a.bind(b[c], d);
                    });
                });
                a.config.callbacks = b;
            }
        })();
    }
    function l() {
        function b(a, d, c, m, e, t) {
            return "<" + [ "img", 'width="' + a + '"', 'height="' + d + '"', 'alt="' + m + '"', 'src="data:image/' + c + ";base64," + e + '"', t ? 'style="' + t + '"' : "" ].join(" ") + "/>";
        }
        a.jsonData = {
            ready: !1
        };
        a.require(a.config.json_url, a.config.page, !0);
        var d = g.getElementById("dsq-content") || g.createElement("div");
        d.id = "dsq-content";
        d.style.display = "none";
        var c = g.createElement("div");
        c.id = "dsq-content-stub";
        c.innerHTML = a.browser.ie6 ? "..." : b(71, 17, "png", "DISQUS", U.join("")) + b(16, 11, "gif", "...", V.join(""), "margin:0 0 3px 5px");
        var e = g.getElementById(a.config.container_id);
        e.appendChild(d);
        e.appendChild(c);
        a.ready(function() {
            a.initThread(function() {
                c.style.display = "none";
            });
        });
    }
    function q(b) {
        var c = g.getElementById("dsq-content"), e = a.settings.media_url + "/build/lang/", f = a.jsonData.forum.template.css, o = a.jsonData.forum.template.url;
        (function() {
            var b = a.jsonData;
            a.strings.setGlobalContext({
                profile_url: b.urls.request_user_profile,
                disqus_url: b.settings.disqus_url,
                media_url: b.settings.media_url,
                forum_name: b.forum.name,
                request_username: b.request.username,
                request_display_username: b.request.display_username
            });
        })();
        a.trigger("loader.onDataReady");
        if (a.browser.mobile && !a.jsonData.forum.mobile_theme_disabled) f = a.jsonData.forum.template.mobile.css, o = a.jsonData.forum.template.mobile.url; else if (a.config.template) f = a.config.template.css, o = a.config.template.js;
        !d.disqus_no_style && f && a.requireStylesheet(f, {}, a.jsonData.settings.debug);
        f = a.jsonData.forum.stylesUrl;
        if (!a.jsonData.context.switches.static_styles || a.settings.debug) f = "http://" + a.config.domain + "/forums/" + a.config.shortname + "/styles.css";
        a.jsonData.forum.hasCustomStyles && a.requireStylesheet(f, {
            u: a.jsonData.forum.lastUpdate
        });
        o = [ o ];
        f = d.location.search;
        ~f.indexOf("fbc_channel=1") ? a.require("http://static.ak.connect.facebook.com/js/api_lib/v0.4/FeatureLoader.js.php") : ~f.indexOf("fb_xd_fragment") ? a.require("http://connect.facebook.net/en_US/all.js") : (a.config.language ? a.config.language != "en" && o.push(e + a.config.language + ".js") : a.jsonData.forum.language != "en" && o.push(e + a.jsonData.forum.language + ".js"), a.comm.Default.create(function() {
            a.trigger("loader.onDefaultChannelReady");
        }).setApiKey(a.jsonData.forum.apiKey), a.requireSet(o, a.jsonData.settings.debug, function() {
            a.config.custom_strings && a.lang.extend(a.strings.translations, a.config.custom_strings);
            if (a.config.def_text === "") a.config.def_text = a.strings.get("Type your comment here.");
            a.registerActions();
            a.trigger("loader.onActionsReady");
            a.nodes.addClass(c, "clearfix");
            var d = c.parentNode;
            d.removeChild(c);
            c.innerHTML = a.renderBlock("thread");
            d.appendChild(c);
            a.trigger("loader.onLibraryReady");
            a.dtpl.actions.fire("thread.initialize");
            a.trigger("loader.onTemplateReady");
            a.nodes.container = a.nodes.get("#dsq-content");
            c.style.display = "block";
            b();
            a.config.page.anchor_post_id && a.nodes.scrollTo("#dsq-comment-" + a.config.page.anchor_post_id);
            a.dtpl.actions.fire("thread.ready");
        }));
    }
    function b(a) {
        return Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a.getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds(), a.getUTCMilliseconds());
    }
    var g = d.document, a = d.DISQUS, c = d.disqus_config, e = d.DsqLocal, f = d.disqus_author_s2, h = d.disqus_callback, E = d.disqus_callback_params, F = d.disqus_category_id, x = d.disqus_container_id, C = d.disqus_custom_strings, R = d.disqus_def_email, Q = d.disqus_def_name, S = d.disqus_default_text, M = d.disqus_dev, J = d.disqus_developer, L = d.disqus_domain, O = d.disqus_facebook_forum, P = d.disqus_facebook_key, K = d.disqus_identifier, r = d.disqus_message, v = d.disqus_per_page, A = d.disqus_remote_auth_s2, z = d.disqus_require_moderation_s, N = d.disqus_shortname, T = d.disqus_skip_auth, I = d.disqus_sort, B = d.disqus_thread_slug, H = d.disqus_title, G = d.disqus_url, W = g.getElementsByTagName("head")[0] || g.getElementById("disqus_thread1"), n = g.getElementsByTagName("meta"), w = !1, U = [ "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", "TkSuQmCC" ], V = [ "R0lGODlhEAALAPQAAP///z2LqeLt8dvp7u7090GNqz2LqV+fuJ/F1IW2ycrf51aatHWs", "waXJ14i4ys3h6FmctUCMqniuw+vz9eHs8fb5+meku+Tu8vT4+cfd5bbT3tbm7PH2+AAA", "AAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQu", "aW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27if", "DgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeR", "vsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjoth", "LOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh", "+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+", "YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY", "5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAs", "AAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00k", "j5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpy", "HCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAA", "BS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7", "AAAAAAAAAAAA" ];
    a.extend({
        cache: {
            buttonsToRestore: [],
            popupProfileCache: {},
            popupStatusCache: {},
            toggledReplies: {},
            postSharing: {},
            realtime: {
                interval: null,
                ongoing_request: null,
                prev_script: null,
                last_checked: null,
                newPosts: []
            }
        },
        states: {
            edit: {},
            realtime: !1,
            useLoginWindow: !1,
            loginDisabled: !1,
            metaViewport: function() {
                for (var a = 0, b = n.length; a < b; a++) if (n[a].getAttribute("name") == "viewport") return !0;
                return !1;
            }()
        },
        curPageId: "dsq-comments",
        frames: {},
        config: {
            template: null
        },
        jsonData: null,
        isReady: !1,
        getShortname: function() {
            function a(b) {
                var b = b.getAttribute ? b.getAttribute("src") : b.src, d = [ /https?:\/\/(www\.)?disqus\.com\/forums\/([\w_\-]+)/i, /https?:\/\/(www\.)?([\w_\-]+)\.disqus\.com/i, /https?:\/\/(www\.)?dev\.disqus\.org\/forums\/([\w_\-]+)/i, /https?:\/\/(www\.)?([\w_\-]+)\.dev\.disqus\.org/i ], c = d.length;
                if (!b || b.substring(b.length - 8) != "embed.js") return null;
                for (var e = 0; e < c; e++) {
                    var m = b.match(d[e]);
                    if (m && m.length && m.length == 3) return m[2];
                }
                return null;
            }
            for (var b = g.getElementsByTagName("script"), d = b.length - 1; d >= 0; d--) {
                var c = a(b[d]);
                if (c !== null) return c;
            }
            return null;
        },
        callback: function(b) {
            var d = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
            a.trigger(b, {
                args: d
            });
        },
        reset: function(b) {
            var d = a.nodes.get("#" + a.config.container_id), b = b || {};
            a.comm.reset();
            a.jsonData = null;
            a.sandbox.invalidateGlobals();
            a.status = null;
            d.innerHTML = "";
            a.trigger("thread.beforeReset");
            a.unbindAll();
            if (b.reload) {
                s();
                if (b.config) try {
                    b.config.call(a.config);
                } catch (c) {}
                l();
            }
        },
        updatePost: function(b, d) {
            var c = a.jsonData.posts[b] || {};
            if (d) d.id = b, a.jsonData.posts[b] = a.extend(c, d), a.trigger("data.onPostUpdate", {
                args: [ b, d ]
            });
        },
        reload: function(b) {
            a.require(a.config.json_url, a.config.page, !0, function() {
                w = !0;
                typeof b == "function" && b();
            });
        },
        redraw: function(b) {
            if (w || b) a.sandbox.invalidateGlobals(), b = a.nodes.get("#dsq-content"), b.innerHTML = a.renderBlock("thread"), a.frames = [], a.dtpl.actions.fire("thread.initialize"), w = !1;
        },
        initThread: function(b) {
            function c(a) {
                var b = d.onload;
                d.onload = typeof d.onload != "function" ? a : function() {
                    b && b();
                    a();
                };
            }
            function e() {
                var b, c;
                if (a.isReady) {
                    if (h && clearInterval(h), g.getElementById(x), b = g.getElementsByTagName("iframe"), c = g.getElementById("dsq-content")) for (var f = 0, m = b.length; f < m; f++) b[f].style.width = c.offsetWidth;
                } else h || (h = d.setInterval(e, 500));
            }
            var f, h;
            a.browser.ie && a.config.frame_theme !== "cnn2" && c(e);
            f = g.createElement("style");
            W.appendChild(f);
            a.cache.inlineStylesheet = f.sheet;
            if (!a.cache.inlineStylesheet) a.cache.inlineStylesheet = g.styleSheets[g.styleSheets.length - 1];
            a.trigger("loader.onReady");
            f = g.getElementById("dsq-content") || g.createElement("div");
            f.id = "dsq-content";
            f.style.display = "none";
            g.getElementById(a.config.container_id).appendChild(f);
            a.container = g.getElementById("dsq-content");
            try {
                a.browser.ie6 && g.execCommand("BackgroundImageCache", !1, !0);
            } catch (i) {}
            a.jsonData === null ? a.require(a.config.json_url, a.config.page, !0, function() {
                q(b);
            }) : a.addJob(function() {
                return a.jsonData && a.jsonData.ready;
            }, function() {
                q(b);
            });
        }
    });
    s();
    l();
    (function() {
        function b() {
            c && j(e) && a.trigger("disqus.viewed");
        }
        var c = g.getElementById(a.config.container_id), e = u(c)[1];
        b();
        a.events.debounce(d, "scroll", b, 250);
    })();
    a.bind("thread.onReady", function() {
        function b() {
            e && j(e) && a.trigger("comments.reply.viewed");
            f && j(f) && a.trigger("comments.viewed");
        }
        var c = g.getElementById("dsq-reply") || g.getElementById("dsq-new-post"), e = c ? a.nodes.getPosition(c)[1] + c.offsetHeight : null, c = g.getElementById("dsq-comments"), f = a.nodes.getPosition(c)[1] + c.offsetHeight;
        b();
        a.events.debounce(d, "scroll", b, 250);
    });
    var D = b(new Date);
    a.bind("thread.onReady", function() {
        var c = a.comm.Default.recover(), e = b(new Date);
        c.log("load:start", D);
        c.log("load:length", e - D);
        try {
            d.jQuery ? c.log("jslib", "jquery:" + jQuery().jquery) : d.jQuery && jQuery.ui ? c.log("jslib", "jqueryui:" + jQuery.ui.version) : d.Prototype ? c.log("jslib", "prototype:" + Prototype.Version) : d.dojo ? c.log("jslib", "dojo:" + dojo.version.toString()) : d.MooTools ? c.log("jslib", "mootools:" + MooTools.version) : d.Ext ? c.log("jslib", "ext:" + Ext.version) : d.YUI ? c.log("jslib", "yui:" + YUI.version) : c.log("jslib", "none");
        } catch (f) {
            c.log("jslib", "error");
        }
        try {
            d.FB && FB.dynData && c.log("oldfb", "true");
        } catch (g) {}
    });
    a.bind("loader.onTemplateReady", function() {
        var b = a.comm.Default.recover(), c = a.jsonData;
        b.enable(c.context.sigma_chance);
        c.forum.id && b.log("info:forum_id", c.forum.id);
        c.thread.id && b.log("info:thread_id", c.thread.id);
        c.request.user_type && b.log("info:user_type", c.request.user_type);
        c.request.user_id && b.log("info:user_id", c.request.user_id);
    });
    a.once("comments.viewed", function() {
        a.comm.Default.recover().log("viewed:comments", 1);
    });
    a.once("comments.reply.viewed", function() {
        a.comm.Default.recover().log("viewed:comment_box", 1);
    });
})(this);
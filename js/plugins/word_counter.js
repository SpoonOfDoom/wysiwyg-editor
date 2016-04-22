! function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function (b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c), c
    } : a(jQuery)
}(function (a) {
    "use strict";
    a.extend(a.FE.DEFAULTS, {
        wordCounterMax: -1,
        wordCounterCount: !0
    }), a.FE.PLUGINS.wordCounter = function (b) {
        function get_text(el) {
            var ret = "";
            var length = el.childNodes.length;
            for (var i = 0; i < length; i++) {
                var node = el.childNodes[i];
                if (node.nodeType != 8) {
                    ret += node.nodeType != 1 ? node.nodeValue : " " + get_text(node);
                }
            }
            return ret;
        }

        function getWordCount() {
            //use custom getText function; jQuery text() leaves no space between words in constructs such as "<h1>Title</h1><p>This is the text.</p>", resulting in TitleThis is the text.
            var text = get_text(b.$el[0]); 
            var myRe = /\w\b/gim;
            var myArray = text.match(myRe);
            return myArray.length;
        }

        function d(a) {
            if (b.opts.wordCounterMax < 0) return !0;
            if (getWordCount() < b.opts.wordCounterMax) return !0;
            var d = a.which;
            return !b.keys.ctrlKey(a) && b.keys.isCharacter(d) ? (a.preventDefault(), a.stopPropagation(), b.events.trigger("wordCounter.exceeded"), !1) : !0
        }

        function e(d) {
            if (b.opts.wordCounterMax < 0) return d;
            var e = a("<div>").html(d).text().length;
            return e + getWordCount() <= b.opts.wordCounterMax ? d : (b.events.trigger("wordCounter.exceeded"), "")
        }

        function f() {
            if (b.opts.wordCounterCount) {
                var a = getWordCount() + (b.opts.wordCounterMax > 0 ? "/" + b.opts.wordCounterMax : "");
                h.text(a), b.opts.toolbarBottom && h.css("margin-bottom", b.$tb.outerHeight(!0));
                var d = b.$wp.get(0).offsetWidth - b.$wp.get(0).clientWidth;
                d >= 0 && ("rtl" == b.opts.direction ? h.css("margin-left", d) : h.css("margin-right", d))
            }
        }

        function g() {
            return b.$wp && b.opts.wordCounterCount ? (h = a('<span class="fr-counter"></span>'), h.css("bottom", b.$wp.css("border-bottom-width")), b.$box.append(h), b.events.on("keydown", d, !0), b.events.on("paste.afterCleanup", e), b.events.on("keyup contentChanged", function () {
                b.events.trigger("wordCounter.update")
            }), b.events.on("wordCounter.update", f), b.events.trigger("wordCounter.update"), void b.events.on("destroy", function () {
                a(b.o_win).off("resize.char" + b.id), h.removeData().remove()
            })) : !1
        }
        var h;
        return {
            _init: g,
            count: getWordCount
        }
    }
});
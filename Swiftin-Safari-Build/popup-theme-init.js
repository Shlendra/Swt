// Resolves the popup theme before first paint.
//
// A separate file on purpose, not an inline <script>: the extension-pages CSP
// is `script-src 'self'`, which blocks inline scripts. The inline version never
// ran, so the popup kept its "no-transition" class and every transition stayed
// off, and a light-theme user got a dark first frame.
//
// Dark is the default (baked into <html class="dark">). "no-transition"
// suppresses CSS animations while the theme is being resolved.
(function () {
    var root = document.documentElement;
    try {
        chrome.storage.local.get('swiftin-theme', function (r) {
            var t = r && r['swiftin-theme'];
            // 'light' and 'dark' are explicit. 'system', or no hint yet (first
            // open), follows the OS. Older builds stored the resolved colour
            // instead of the setting; those values read the same way.
            var followOs = t === 'system' || !t;
            var osLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            if (t === 'light' || (followOs && osLight)) {
                root.classList.remove('dark');
            }
            requestAnimationFrame(function () {
                root.classList.remove('no-transition');
            });
        });
    } catch (e) {
        root.classList.remove('no-transition');
    }
})();

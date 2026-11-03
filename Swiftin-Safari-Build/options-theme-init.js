// Resolves the options-page theme before first paint.
//
// A separate file on purpose, not an inline <script>: the extension-pages CSP
// is `script-src 'self'`, which blocks inline scripts. The inline version never
// ran, so the page kept its "no-transition" class and every transition stayed
// off.
//
// Dark is the default (baked into <html class="dark">). "no-transition"
// suppresses CSS animations while the theme is being resolved.
(function () {
    var root = document.documentElement;
    try {
        chrome.storage.sync.get('settings', function (r) {
            var saved = r && r.settings;
            var theme = saved && saved.theme;
            // Same rule as the options App, which keeps this class while it
            // loads, so the two must agree or the page flips on open. No saved
            // settings: the App's own defaults are dark. Saved settings: 'light'
            // and 'dark' are explicit, anything else follows the OS (isLight).
            var osLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            if (saved && (theme === 'light' || (theme !== 'dark' && osLight))) {
                root.classList.remove('dark');
            }
            // Theme is set: allow transitions from the next frame onward.
            requestAnimationFrame(function () {
                root.classList.remove('no-transition');
            });
        });
    } catch (e) {
        root.classList.remove('no-transition');
    }
})();

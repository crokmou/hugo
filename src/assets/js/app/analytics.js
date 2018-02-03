const GTAG = (function() {
  'use strict';
  (function gtagInit() {
    const gtagScript = document.createElement('script');
    gtagScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=' + window.CROKMOU_CONF_KEY_GA);
    document.head.appendChild(gtagScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    sendPageView()
  })();

  function sendPageView() {
    window.gtag('config', window.CROKMOU_CONF_KEY_GA);
  }

  /**
   * Send gtag analytics event
   * @param {string} category
   * @param {string} type
   * @param {string} action
   * @param {string} label
   */
  function sendEvent({category = '', type = '', action = '', label = ''}) {
    if (!window.gtag && typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', type, {
      event_category: category,
      event_action  : action,
      event_label   : label,
    });
  }

  return {
    sendPageView, sendEvent
  }
})();
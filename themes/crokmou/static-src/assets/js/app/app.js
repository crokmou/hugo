$(document).ready(function() {
  'use strict';

  const SPRITE_URL = '/assets/images/svg/Crokmou.min.svg';

  const $pageContainer = $('#page-container');
  const $bodyHtml      = $('body, html');

  const App = (function App() {
    Nav();
    Algolia();
    Photoswipe();
    LazyLoad();
    Single();
    ResizeVideos();
    initFbComment();

    function Nav() {
      const $window = $(window);
      const $logo   = $('[rel="logo"]');
      const $nav    = $('[rel="nav"]');
      const $active = $nav.find('.active');
      if ($active.length) {
        const scrollLeftPos = $active.offset().left - $nav.offset().left - 40;
        $nav.scrollLeft(scrollLeftPos);
      }
      ResizeWindow(() => {
        updateLogoShape();
        ScrollWindow(() => {
          updateLogoShape(true)
        });
      });
      function updateLogoShape(transition) {
        const isDesktop = $window.width() >= 768;
        const topMax = $window.scrollTop() >= 60;
        $logo.css({
          'transition': transition ? '.3s ease transform' : 'none',
          'transform': 'translateY('+ ((topMax && isDesktop) ? '30' : '0') + 'px) scale('+ ((topMax && isDesktop) ? '.6' : '1')+')',
        });
      }
    }

    function LazyLoad() {
      new IOlazy({
        threshold: 0,
      });
      $('.lazyload').each(function() {
        const $this = $(this);
        $this.on('load', function() {
          $this.removeClass('loading');
        });
      });
    }

    function Single() {
      const $headerTitle = $('[rel="single-header-title"]');
      const $children    = $headerTitle.children();
      let height         = 0;
      $children.each(function() {
        const $this     = $(this);
        const newHeight = $this.height();
        if (newHeight > height) {
          height = newHeight;
        }
      });
      $children.height('100%');
      $headerTitle.height(Math.max(height + 30, 110));
    }

    function ResizeVideos() {
      const $allVideos = $('iframe[src*="youtube.com"], iframe[src*="facebook.com"]');

      $allVideos.each(function() {
        $(this).
        data('aspectRatio', this.height / this.width).
        removeAttr('height').
        removeAttr('width');
      });

      ResizeWindow(function() {
        $allVideos.each(function() {
          const $el = $(this);
          const $parent = $el.parent();
          const newWidth = $parent.width();
          $el.width(newWidth).height(newWidth * $el.data('aspectRatio'));
        });
      });
    }

    function ResizeWindow(cb) {
      $(window).resize(cb).resize();
    }

    function ScrollWindow(cb) {
      $(window).scroll(cb).scroll();
    }

    function initFbComment() {
      let tries = 0;
      (function tryLoadingFacebook() {
        if(tries > 30 && (!window.FB || typeof FB !== 'object')) {
          $('body').addClass('facebook-error');
        } else {
          try {
            FB.XFBML.parse();
          } catch(e) {
            tries++;
            setTimeout(tryLoadingFacebook, 100)
          }
        }
      }());
    }
    return {init: App};
  })();

  function Algolia() {
    try {
      const client = algoliasearch('7GZHV5CIYF',
          'c2dcc32aadead636824c3f969c3adc53');
      const index  = client.initIndex('blog');
      $('#search-input').autocomplete({
        openOnFocus: true,
        templates  : {
          dropdownMenu: '#global-search',
        },
      }, [
        {
          source   : $.fn.autocomplete.sources.hits(index, {hitsPerPage: 5}),
          templates: {
            suggestion: function(suggestion) {
              const result = suggestion._highlightResult;
              const title = result.title.value;
              const section = result.section.value;
              const categories = result.categories.map((c) => c.value);

              return `<div class="global-search__content">
                        <h2 class="global-search__content__title">${title}</h2>
                        <p class="global-search__content__desc">
                          ${section} > ${categories.join('-')}</p>
                      </div>`;
            },
          },
        },
      ]).on('autocomplete:selected', function(event, suggestion, dataset) {
        window.location = suggestion.uri;
      });
    } catch (e) {
      setTimeout(Algolia, 300);
    }
  }

  function clearWindowsEvent() {
    $(window).off("resize");
    $(window).off('scroll');
  }

  function Photoswipe() {

    const initPhotoSwipeFromDOM = function(gallerySelector) {

      // parse slide data (url, title, size ...) from DOM elements
      // (children of gallerySelector)
      const parseThumbnailElements = async function(el) {
        let thumbElements = el.querySelectorAll('figure');
        let items         = [];
        let $figure;
        let $img;
        let item;

        const images = await addImageProcess(thumbElements);

        for (let i = 0; i < images.length; i++) {
          $figure = thumbElements[i];
          $img    = images[i];
          if ($figure.nodeType !== 1 || $img.error) {
            continue;
          }
          item = {
            src: $img.src,
            w  : parseInt(($img.naturalWidth || $img.width), 10),
            h  : parseInt(($img.naturalHeight || $img.height), 10),
          };
          if ($figure.children.length > 1) {
            item.title = $figure.children[1].innerHTML;
          }
          item.el = $figure;
          items.push(item);
        }
        return items;
      };

      // find nearest parent element
      const closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
      };

      // triggers when user clicks on thumbnail
      const onThumbnailsClick = function(e) {
        e             = e || window.event;
        const eTarget = e.target || e.srcElement;

        // find root element of slide
        const clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
          return;
        } else {
          e.preventDefault ? e.preventDefault() : e.returnValue = false;
        }

        const clickedGallery = closest(eTarget, (el) =>
            el.classList.contains('single'));
        const childNodes     = clickedGallery.querySelectorAll('figure');
        const numChildNodes  = childNodes.length;
        let nodeIndex        = 0,
              index;

        for (let i = 0; i < numChildNodes; i++) {
          if (childNodes[i].nodeType !== 1) {
            continue;
          }

          if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }

        if (index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe(index, clickedGallery);
        }
        return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      const photoswipeParseHash = function() {
        const hash   = window.location.hash.substring(1),
              params = {};

        if (hash.length < 5) {
          return params;
        }

        const consts = hash.split('&');
        for (let i = 0; i < consts.length; i++) {
          if (!consts[i]) {
            continue;
          }
          const pair = consts[i].split('=');
          if (pair.length < 2) {
            continue;
          }
          params[pair[0]] = pair[1];
        }

        if (params.gid) {
          params.gid = parseInt(params.gid, 10);
        }

        return params;
      };

      const openPhotoSwipe = async function(
          index, galleryElement, disableAnimation, fromURL) {
        const pswpElement = document.querySelectorAll('.pswp')[0];
        let gallery;
        let options;
        let items;
        console.log('waiting...');
        items = await parseThumbnailElements(galleryElement);
        console.log('ok');
        // define options (if needed)
        options = {
          showHideOpacity: true,
          // define gallery index (for URL)
          galleryUID     : galleryElement.getAttribute('data-pswp-uid') || 1,
          shareButtons: [
            {id:'facebook', label:'Partager sur Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
            {id:'twitter', label:'Partager sur Tweeter', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
            {id:'pinterest', label:'Partager sur Pinterest', url:'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}'},
          ],

          getThumbBoundsFn: function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            const thumbnail   = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                  pageYScroll = window.pageYOffset ||
                      document.documentElement.scrollTop,
                  rect        = thumbnail.getBoundingClientRect();

            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
          },

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (let j = 0; j < items.length; j++) {
              if (items[j].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
          return;
        }

        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items,
            options);
        gallery.init();
      };

      // loop through all gallery elements and bind events
      const galleryElements = document.querySelectorAll(gallerySelector);

      for (let i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      const hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true,
            true);
      }
    };

    function addImageProcess(figures) {
      const images = [];
      let number   = 0;
      return new Promise((resolve) => {
        for (let i = 0; i < figures.length; i++) {
          const fig   = figures[i];
          const a     = fig.children[0];
          const src   = a.href;
          const img   = a.children[0];
          img.onload  = () => {
            number++;
            images.push(img);
            if (number === figures.length) {
              resolve(images);
            }
          };
          img.onerror = () => {
            number++;
            images.push({error: ''});
            if (number === figures.length) {
              resolve(images);
            }
          };
          img.src     = src;
        }
      });
    }

    initPhotoSwipeFromDOM('.single');
  }

  /**
   * Ajax loader to insert the sprite svg dynamically at the bottom of the document
   */
  (function loadSvg() {
    'use strict';
    let ajax = new XMLHttpRequest();
    ajax.open('GET', SPRITE_URL, true);
    ajax.onload = function() {
      let div          = document.createElement('div');
      div.style.width  = 0;
      div.style.height = 0;
      div.innerHTML    = ajax.responseText;
      document.body.insertBefore(div, document.body.childNodes[0]);
    };
    ajax.send();
  })();

  (function($, History) {
    analytics(null, document.title);

    if (!History.enabled) {
      return false;
    }

    $pageContainer.on('click', '[rel="xhr"], .pagination a', function(event) {
      event.preventDefault();
      if (window.location === this.href) {
        return;
      }
      History.pushState(null, $(this).data('browser-title'), this.href);
    });

    History.Adapter.bind(window, 'statechange', function() {
      const state = History.getState();
      const $a    = $('a');
      $a.css('cursor', 'progress');
      $bodyHtml.css('cursor', 'progress');
      $.get(state.url, function(res) {
        $a.css('cursor', 'default');
        $bodyHtml.css('cursor', 'default');
        $.each($(res), function(index, elem) {
          const $this = $(this);
          if($this[0].nodeName.toUpperCase() === 'TITLE') {
            $('head title').html($this.html());
          }
          if ($pageContainer[0].id !== elem.id) {
            return;
          }
          $pageContainer.html($(elem).html()).promise().done(function(res) {
            if($(window).scrollTop() >= $('[rel="header"]').height()) {
              $bodyHtml.scrollTop($('[rel="header"] + *').offset().top - 60);
            }
            clearWindowsEvent();
            App.init();
            analytics(res, state.title);
          });
        });
      });
    });

    function analytics(res, title) {
      if (typeof ga === 'function' && (!res || res.length !== 0)) {
        ga('set', {
          page : window.location.pathname,
          title: title,
        });
        ga('send', 'pageview');
      }
    }
  })(jQuery, window.History);

  (function RegisterSw() {
    if ('serviceWorker' in navigator) {
      // See https://developers.google.com/web/fundamentals/instant-and-offline/service-worker/registration
        // Your service-worker.js *must* be located at the top-level directory relative to your site.
        // It won't be able to control pages unless it's located at the same level or higher than them.
        // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
        // See https://github.com/slightlyoff/ServiceWorker/issues/468
        navigator.serviceWorker.register('service-worker.js').then(function(reg) {
          // updatefound is fired if service-worker.js changes.
          reg.onupdatefound = function() {
            // The updatefound event implies that reg.installing is set; see
            // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
            var installingWorker = reg.installing;

            installingWorker.onstatechange = function() {
              switch (installingWorker.state) {
                case 'installed':
                  if (navigator.serviceWorker.controller) {
                    // At this point, the old content will have been purged and the fresh content will
                    // have been added to the cache.
                    // It's the perfect time to display a "New content is available; please refresh."
                    // message in the page's interface.
                    console.log('New or updated content is available.');
                  } else {
                    // At this point, everything has been precached.
                    // It's the perfect time to display a "Content is cached for offline use." message.
                    console.log('Content is now available offline!');
                  }
                  break;

                case 'redundant':
                  console.error('The installing service worker became redundant.');
                  break;
              }
            };
          };
        }).catch(function(e) {
          console.error('Error during service worker registration:', e);
        });
    }
  })();

  (function InjectCss() {
    injectCss('/assets/style.css?v=2', 'screen, projection');
    injectCss(
        'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.min.css',
        'screen, projection');
    injectCss(
        'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/default-skin/default-skin.min.css',
        'screen, projection');
    injectCss(
        'https://fonts.googleapis.com/css?family=Oswald:300|Roboto:300,400,500');
    injectCss('/assets/print.css?v=1', 'print');

    function injectCss(href, media) {
      var element  = document.createElement('link');
      element.rel  = 'stylesheet';
      element.href = href;
      if (media) {
        element.setAttribute('media', media);
      }
      element.type = 'text/css';
      var godefer  = document.getElementsByTagName('link')[0];
      godefer.parentNode.insertBefore(element, godefer);
    }
  })()
});

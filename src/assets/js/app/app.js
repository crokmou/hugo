'use strict';
// @codekit-prepend '../vendor/lazysizes.min.js'
// @codekit-prepend 'analytics.js'

$(document).ready(function() {
  const $bodyHtml      = $('body, html');

  (function app() {
    nav();
    algolia();
    photoswipe();
    resizeVideos();
    returnTop();

    function nav() {
      const $window = $(window);
      const $logo   = $('[rel*="logo"]');
      const $nav    = $('[rel="nav"]');
      const $active = $nav.find('.active');
      if ($active.length) {
        const scrollLeftPos = $active.offset().left - $nav.offset().left - 40;
        $nav.scrollLeft(scrollLeftPos);
      }
      resizeWindow(() => {
        updateLogoShape();
        scrollWindow(() => {
          updateLogoShape(true);
        });
      });

      function updateLogoShape(transition) {
        const isDesktop = $window.width() >= 768;
        const topMax    = $window.scrollTop() >= 60;
        $logo.css({
          'transition': transition ? '.3s ease transform' : 'none',
          'transform' : 'translateY(' + ((topMax && isDesktop) ? '30' : '0') +
          'px) scale(' + ((topMax && isDesktop) ? '.6' : '1') + ')',
        });
      }
    }

    function resizeVideos() {
      const $allVideos = $(
        'iframe[src*="youtube.com"], iframe[src*="facebook.com"]');

      $allVideos.each(function() {
        $(this).
        data('aspectRatio', (this.height || 16) / (this.width || 10)).
        removeAttr('height').
        removeAttr('width');
      });

      resizeWindow(function() {
        $allVideos.each(function() {
          const $el      = $(this);
          const $parent  = $el.parent();
          const newWidth = $parent.width();
          $el.width(newWidth).height(newWidth * $el.data('aspectRatio'));
        });
      });
    }

    function resizeWindow(cb) {
      setTimeout(() => $(window).resize(cb).resize(), 100);
    }

    function scrollWindow(cb) {
      $(window).scroll(cb).scroll();
    }

    function parsePinButtons() {
      let tries = 0;
      (function tryParse() {
        try {
          window.parsePinBtns();
        } catch (e) {
          tries++;
          if (tries < 500) {
            setTimeout(tryParse, 100);
          }
        }
      })();
    }

    function returnTop() {
      const $returnTop = $('[rel="js-return-top"]');
      scrollWindow(() => {
        if ($bodyHtml.scrollTop() >= 500) {
          $returnTop.fadeIn();
        } else {
          $returnTop.fadeOut();
        }
      });
      $returnTop.on('click', function() {
        $bodyHtml.scrollTop(0);
      });
    }

    return {
      init  : app,
      update: () => {
        app();
        parsePinButtons();
      },
    };
  })();

  function algolia() {
    try {
      const client = algoliasearch(window.CROKMOU_CONF_ALGOLIA_ID,
        window.CROKMOU_CONF_ALGOLIA_API_KEY);
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
              const result     = suggestion._highlightResult;
              const title      = result.title.value;
              const section    = result.section.value;
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
      setTimeout(algolia, 300);
    }
  }

  function photoswipe() {
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
        let nodeIndex        = 0;
        let index;

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
        const hash   = window.location.hash.substring(1);
        const params = {};

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
        const pswpElement  = document.querySelectorAll('.pswp')[0];
        const $loadingPswp = $('[rel=js-loading-pswp]');
        let gallery;
        let options;
        let items;
        $loadingPswp.addClass('footer__loading-pswp--active');
        items = await parseThumbnailElements(galleryElement);
        $loadingPswp.removeClass('footer__loading-pswp--active');
        // define options (if needed)
        options = {
          showHideOpacity: true,
          // define gallery index (for URL)
          galleryUID     : galleryElement.getAttribute('data-pswp-uid') || 1,
          shareButtons   : [
            {
              id   : 'facebook',
              label: 'Partager sur Facebook',
              url  : 'https://www.facebook.com/sharer/sharer.php?u={{url}}',
            },
            {
              id   : 'twitter',
              label: 'Partager sur Tweeter',
              url  : 'https://twitter.com/intent/tweet?text={{text}}&url={{url}}',
            },
            {
              id   : 'pinterest',
              label: 'Partager sur Pinterest',
              url  : 'http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}',
            },
          ],

          getThumbBoundsFn: function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            const thumbnail   = items[index].el.getElementsByTagName('img')[0]; // find thumbnail
            const pageYScroll = window.pageYOffset ||
              document.documentElement.scrollTop;
            const rect        = thumbnail.getBoundingClientRect();

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
          const $fig = $(figures[i]);
          const $a   = $fig.find('[itemprop="contentUrl"]');
          const src  = $a.attr('href');
          const img  = $a.find('img')[0];
          if (!img) {
            number++;
            if (number === figures.length) {
              resolve(images);
            }
            return;
          }
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

  (function RegisterSw() {
    if ('serviceWorker' in navigator) {
      // See https://developers.google.com/web/fundamentals/instant-and-offline/service-worker/registration
      // Your service-worker.js *must* be located at the top-level directory relative to your site.
      // It won't be able to control pages unless it's located at the same level or higher than them.
      // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
      // See https://github.com/slightlyoff/ServiceWorker/issues/468
      navigator.serviceWorker.register('/service-worker.js').
      then(function(reg) {
        // updatefound is fired if service-worker.js changes.
        reg.onupdatefound = function() {
          // The updatefound event implies that reg.installing is set; see
          // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
          let installingWorker = reg.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and the fresh content will
                  // have been added to the cache.
                  // It's the perfect time to display a "New content is available; please refresh."
                  // message in the page's interface.
                  // console.log('New or updated content is available.');
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a "Content is cached for offline use." message.
                  // console.log('Content is now available offline!');
                }
                break;

              case 'redundant':
                console.error(
                  'The installing service worker became redundant.');
                break;
            }
          };
        };
      }).
      catch(function(e) {
        console.error('Error during service worker registration:', e);
      });
    }
  })();
});

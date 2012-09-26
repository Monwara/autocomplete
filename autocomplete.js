/**
 * # jQuery autocomplete plugin
 *
 * @author Monwara LLC / Branko Vukelic
 * @version 0.0.2
 * @license MIT
 */

/**
 * ## Overview
 * 
 * This plugin specializes in providing autocompletion for form inputs. It is a
 * highly customizable and lightweight solution with extensive keyboard
 * support.
 *
 * It can be used both as AMD module (with loaders like RequireJS), or as
 * standalone script.
 *
 * ## Installation
 *
 * To install this script as standalone, include the following snipped after
 * jQuery's own script tag:
 *
 *     <script type="text/javascript" src="/path/to/autocomplete.js"></script>
 *
 * To use as AMD module, simple require it as usual.
 *
 * ## Getting started
 *
 * You can provide no configuration options if you so desire. In tha case, the
 * autocomplete plugin would simply be activated as follows:
 *
 *     $('#myInputElement').autocomplete();
 *
 * This will make autocomplete plugin make a GET request to the page's URL with
 * a `q` URL parameter that holds the current value of the form field. It then
 * expects JSON data in return, which should contain the array of candidates.
 *
 * If you set your server-side code respond in expected manner, your
 * autocomplete should just work.
 *
 * ## Customizing
 *
 * All of the above can be customized, and a bit more. 
 *
 * Configuration parameters can be passed in as an object when calling the
 * autocomplete plugin:
 *
 *     $('#myInputElement').autocomplete({
 *        url: '/names',
 *        queryParam: 'name'
 *     });
 *
 * Here is a list of configuration options available:
 *
 *  + `url`: URL at which requests should be made. By default, the URL will be 
 *    derived from `window.location`.
 *  + `queryParam`: GET query parameter to be used to pass on the keyword.
 *    Default query parameter is `q`.
 *  + `dataProperty`: If this is provided, JSON data returned should contain an
 *    object whose `dataProperty` property contains the array of candidates.
 *    By default, JSON data is treated as a simple array.
 *  + `objectData`: This option tells the plugin to treat the array of
 *    candidates as array of objects rather than array of strings, and that
 *    `objectData` property on each candidate object contains the actual string
 *    to be used as a candidate. This allows you to attach extra data to your
 *    candidate list (more on that later). By default, JSON data is treated as
 *    simple array of strings.
 *  + `tabCycle`: Use tab to cycle the results (default is to jump to next
 *    field).
 *  + `zIndex`: The z-index of the results list. By default, the results list
 *    will have a z-index of 9999.
 *  + `width`: Width of the result list. By default, it is 'auto', and any
 *    valid CSS width can be used.
 *  + `offset`: Distance of result list from the edges of the form control. 
 *    Default offset is 0. Any valid CSS dimension can be used.
 *  + `requestData`: Extra data that will be sent along with the request. This
 *    parameter can either be a function that will be evaluated each time 
 *    autocomplete fetches data, or an object containing the extra data. The
 *    function _must_ return an object or else things might not work as
 *    expected. Note that the query parameter will always override any keys 
 *    that exist in the extra data. This is meant to be used with special cases
 *    like server that requests access tokens and similar authentication data.
 *
 * ## Using extra data
 *
 * Suppose you want to have two text inputs in your form. One would be for
 * names, and another for emails. Let's also suppose your database contains
 * pairs of names and emails. Finally, let's make it so that autocomplete
 * populates the email field using the autocomplete candidate for name field.
 *
 * Here's the HTML part for the two inputs:
 *
 *   <input name="name" id="name" />
 *   <input name="email" id="email" />
 *
 * Now, let's set up autocomplete:
 *
 *   $('#name').autocomplete({
 *     url: '/names',
 *     objectData: 'name'
 *   });
 *
 * The server side responds to each query by returning an array of objects in
 * the following format:
 *
 *     [
 *       {"name": "John", "email": "john.sinatra@example.com"},
 *       {"name": "Dan", "email": "dan@test.com"},
 *       ...
 *     ]
 *
 * Now, let's handle the change event on the autocompleted form input to
 * populate the other one:
 *
 *     $('#name').change(function(e, data) {
 *       if (data) { $('#email').val(data.email); }
 *     });
 *
 * So what is going on here? What happens is that, each time user selects an
 * autocomplete candidate, the autocomplete plugin will fire a change event on
 * the form element it is bound to. The change event is given extra data, which
 * can be accessed as the second argument to the change event handler (in our
 * case, we named it `data`). The data is a full copy of the object that
 * represents the candidate.
 *
 * A word of warning: always check if data is passed in. Although autocomplete
 * does trigger the `change` event, it doesn't mean other parts of the code
 * don't, so there is no guarantee onchange event handler will always receive
 * the `data` argument. Most notably, this is the case where clicking an
 * autocomplete candidate causes the field to become unfocused, which triggers
 * the change event without the `data` argument. Later on, once autocomplete
 * plugin has done it's thing, it will re-trigger the change event, this time
 * _with_ the `data` argument.
 *
 * ## Styling
 *
 * The autocomplete plugin creates very simple HTML structure for its own
 * needs, but it might be tricky to style it since it is not ever-present. The
 * list only appears when there is something to show, that is.
 *
 * Here is a quick overview of the HTML structure:
 *
 *     div.autocomplete-container
 *       div.autocomplete-inner
 *         div.autocomplete-candidate.autocomplete-selected
 *         div.autocomplete-candidate
 *         div.autocomplete-candidate
 *         div.autocomplete-candidate
 *         ...
 *
 * All autocomplete-specific classes are prefixed with `autocomplete-`. There
 * are two DIV containers (outer and inner), where the inner container contains
 * a series of DIVs which serve as autocomplete candidates.
 *
 * There are a few properties that are applied to the outer container that you
 * generally shouldn't touch (unless you are reasonably sure it's a good idea):
 *
 *  + display: __none__
 *  + position: __absolute__
 *  + z-index: either zIndex configuration option or 9999
 *  + width: either fixed width give via configuration option, or auto
 *  + top and left: these are calculated automatically
 *
 * These CSS rules are applied directly on the element, so you will need to add
 * the `!important` flag if you wish to override them via stylesheets.
 *
 * Note that the autocomplete container has no `id` attribute, so if you want
 * to have multiple differently styled autocomplete result lists, that is
 * currently not possible.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(root.jQuery);
  }
})(this, function($) {
  var resultTemplate = '<div class="autocomplete-container">' +
    '<div class="autocomplete-inner"></div>' +
    '</div>';
  var SELECTED = 'autocomplete-selected';

  $.fn.autocomplete = function(opts) {
    var self = this;
    var cache = {};
    var resultContainer = null;
    var resultInner = null;
    var totalResults = 0;

    function removeContainer() {
      if (resultContainer) {
        resultContainer.remove();
        resultContainer = null;
        resultInner = null;
        totalResults = 0;
      }
    }

    function updateValue(el) {
      $(self).val(el && $(el).text());
      $(self).trigger('change', el && $(el).data('result'));
    }

    $(this).blur(function() {
      // We have to delay removal of the container because it interferes with
      // click event bound to candidates. If we didn't have this delay, the 
      // container would be removed before the candidates had chance to handle
      // the click event and populate the input.
      setTimeout(removeContainer, 200);
    });

    $(this).keydown(function(e) {
      var first = resultInner ? resultInner.children(':first') : null;
      var last = resultInner ? resultInner.find(':last') : null;
      var selected = resultInner ? 
        resultInner.children('.' + SELECTED) : null;
      var next = selected && selected.next().length ?
        selected.next() : first;
      var prev = selected && selected.prev().length ? 
        selected.prev() : last;
      var inputs;

      function advanceFocus() {
        inputs = $(self).closest('form').find(':input');
        inputs.eq(inputs.index(this) + 2).focus();
        removeContainer();
      }

      function stop() {
        e.preventDefault();
        e.stopPropagation();
      }

      switch(e.which) {
        case 9: // Tab
          if (totalResults) {
            if (opts.tabCycle) {
              stop();

              if (e.shiftKey) {
                if (selected) {
                  selected.removeClass(SELECTED);
                }
                if (prev) {
                  prev.addClass(SELECTED);
                  updateValue(prev);
                }
              } else {
                if (selected) {
                  selected.removeClass(SELECTED);
                }
                if (next) {
                  next.addClass(SELECTED);
                  updateValue(next);
                }
              }
            } else {
              if (selected) {
                updateValue(selected);
              }
            }
          }
          break;
        case 13: // Enter
          if (totalResults === 1) {
            stop();
            updateValue(first);
            advanceFocus();
            return false;
          } else if (totalResults && !selected) {
            stop();
            return false;
          } else if (totalResults && selected) {
            stop();
            updateValue(selected);
            advanceFocus();
            return false;
          }
          removeContainer();
          break;
      }
    });

    $(this).keyup(function(e) {
      var first = resultInner ? resultInner.children(':first') : null;
      var last = resultInner ? resultInner.find(':last') : null;
      var selected = resultInner ? 
        resultInner.children('.' + SELECTED) : null;
      var next = selected && selected.next().length ?
        selected.next() : first;
      var prev = selected && selected.prev().length ? 
        selected.prev() : last;

      switch (e.which) {
        case 9: // Tab
        case 13: // Enter
          // Do nothing in keyup since we do everything in keydown
          break;
        case 8: // Backspace
        case 46: // Del
          removeContainer();
          break;
        case 27: // Esc
          e.preventDefault();
          removeContainer();
          $(self).select();
          break;
        case 39: // Right arrow
          if (resultContainer && selected) {
            updateValue(selected);
          }
          removeContainer();
          break;
        case 38: // Up arrow
          if (selected) {
            selected.removeClass(SELECTED);
          }
          if (prev) {
            prev.addClass(SELECTED);
            updateValue(prev);
          }
          break;
        case 40: // Down arrow
          if (selected) {
            selected.removeClass(SELECTED);
          }
          if (next) {
            next.addClass(SELECTED);
            updateValue(next);
          }
          break;
        default: // All other keys

          // Create the result window and populate with candidates
          function processResults(results) {
            var i;
            var l;

            // If `results` is not an array, or has 0 length, destroy 
            // autocomplete box and return
            if (!results || !results.length) { 
              return;
            }

            if (resultContainer) {
              // If there is already a container, just clean up the existing
              // candidates.
              resultInner.html('');
            } else {
              // If there is no result container create one now.
              resultContainer = $(resultTemplate);
              resultInner = resultContainer.children('.autocomplete-inner');
              resultContainer.css({
                display: 'none',
                position: 'absolute',
                'z-index': opts.zIndex || 9999,
                width: opts.width || 'auto',
                top: $(self).offset().top + $(self).outerHeight() + 
                  (opts.offset || 0),
                left: $(self).offset().left
              });

              // Append result container to body
              resultContainer.appendTo(document.body);

              // Handle click event, and react only to clicks that come from
              // the completion candidates.
              resultContainer.one(
                'click', 
                '.autocomplete-candidate', 
                function(e) {
                  e.preventDefault();
                  inputs = $(self).closest('form').find(':input');
                  inputs.eq(inputs.index(this) + 2).focus();
                  updateValue($(e.target));
                }
                // We don't need to remove the container because clicking on
                // a candidate causes the blur event to be triggered on the 
                // input, which in turn removes the container after a 200ms
                // delay.
              );
            }

            // Convert to array of strings if results are objects
            var candidates = opts.objectData ? results.map(function(result) {
                return result[opts.objectData];
            }) : results;

            // Populate container
            candidates.forEach(function(candidate, idx) {
              var candidateHTML = '<div class="autocomplete-candidate' +
                (opts.autoSelectFirst && idx === 0 ? (' ' + SELECTED) : '') +
                '">' +
                candidate + '</div>';
              var candidateNode = $(candidateHTML);
              candidateNode.data('result', results[idx]);
              resultInner.append(candidateNode);
            });

            selected = resultInner.children('.' + SELECTED);

            // Show the container.
            resultContainer.show();
            totalResults = results.length;
          }

          // First try to use cached values
          if (cache[$(self).val()]) {
            return processResults(cache[$(self).val()]);
          }

          // Don't autocomplete if there's no value or value is shorter than 2
          if (!self.val() || self.val().length < 2) {
            return;
          }

          // Construct GET params object
          var data = {};

          // Add additional request data if supplied
          data = typeof opts.requestData === 'function' ? 
            $.extend(data, opts.requestData()) :
            $.extend(data, opts.requestData);

          // Add query parameter
          data[opts.queryParam || 'q'] = $(self).val();

          // Do the AJAX query.
          $.ajax({
            url: opts.url || window.location,
            data: data,
            dataType: 'json',
            type: 'GET',
            success: function(res) {
              if (res) {
                res = res[opts.dataProperty] || res;

                // Return immediately on empty results
                if (!res || res.length === 0) {
                  removeContainer();
                  totalResults = 0;
                  return;
                }

                // Cache the new results and process them
                cache[$(self).val()] = res;
                processResults(res);
              }
            }
          });

          break;
      }
    });

  };
});


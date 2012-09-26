# Overview

This plugin specializes in providing autocompletion for form inputs. It is a
highly customizable and lightweight solution with extensive keyboard
support.

It can be used both as AMD module (with loaders like RequireJS), or as
standalone script.

# Installation

To install this script as standalone, include the following snipped after
jQuery's own script tag:

    <script type="text/javascript" src="/path/to/autocomplete.js"></script>

To use as AMD module, simple require it as usual.

# Getting started

You can provide no configuration options if you so desire. In tha case, the
autocomplete plugin would simply be activated as follows:

    $('#myInputElement').autocomplete();

This will make autocomplete plugin make a GET request to the page's URL with
a `q` URL parameter that holds the current value of the form field. It then
expects JSON data in return, which should contain the array of candidates.

If you set your server-side code respond in expected manner, your
autocomplete should just work.

# Customizing

All of the above can be customized, and a bit more. 

Configuration parameters can be passed in as an object when calling the
autocomplete plugin:

    $('#myInputElement').autocomplete({
       url: '/names',
       queryParam: 'name'
    });

Here is a list of configuration options available:

 + `url`: URL at which requests should be made. By default, the URL will be 
   derived from `window.location`.
 + `queryParam`: GET query parameter to be used to pass on the keyword.
   Default query parameter is `q`.
 + `dataProperty`: If this is provided, JSON data returned should contain an
   object whose `dataProperty` property contains the array of candidates.
   By default, JSON data is treated as a simple array.
 + `objectData`: This option tells the plugin to treat the array of
   candidates as array of objects rather than array of strings, and that
   `objectData` property on each candidate object contains the actual string
   to be used as a candidate. This allows you to attach extra data to your
   candidate list (more on that later). By default, JSON data is treated as
   simple array of strings.
 + `tabCycle`: Use tab to cycle the results (default is to jump to next
   field).
 + `zIndex`: The z-index of the results list. By default, the results list
   will have a z-index of 9999.
 + `width`: Width of the result list. By default, it is 'auto', and any
   valid CSS width can be used.
 + `offset`: Distance of result list from the edges of the form control. 
   Default offset is 0. Any valid CSS dimension can be used.

# Using extra data

Suppose you want to have two text inputs in your form. One would be for
names, and another for emails. Let's also suppose your database contains
pairs of names and emails. Finally, let's make it so that autocomplete
populates the email field using the autocomplete candidate for name field.

Here's the HTML part for the two inputs:

  <input name="name" id="name" />
  <input name="email" id="email" />

Now, let's set up autocomplete:

  $('#name').autocomplete({
    url: '/names',
    objectData: 'name'
  });

The server side responds to each query by returning an array of objects in
the following format:

    [
      {"name": "John", "email": "john.sinatra@example.com"},
      {"name": "Dan", "email": "dan@test.com"},
      ...
    ]

Now, let's handle the change event on the autocompleted form input to
populate the other one:

    $('#name').change(function(e, data) {
      if (data) { $('#email').val(data.email); }
    });

So what is going on here? What happens is that, each time user selects an
autocomplete candidate, the autocomplete plugin will fire a change event on
the form element it is bound to. The change event is given extra data, which
can be accessed as the second argument to the change event handler (in our
case, we named it `data`). The data is a full copy of the object that
represents the candidate.

A word of warning: always check if data is passed in. Although autocomplete
does trigger the `change` event, it doesn't mean other parts of the code don't,
so there is no guarantee onchange event handler will always receive the `data`
argument. Most notably, this is the case where clicking an autocomplete
candidate causes the field to become unfocused, which triggers the change event
without the `data` argument. Later on, once autocomplete plugin has done it's
thing, it will re-trigger the change event, this time _with_ the `data`
argument.

# Styling

The autocomplete plugin creates very simple HTML structure for its own
needs, but it might be tricky to style it since it is not ever-present. The
list only appears when there is something to show, that is.

Here is a quick overview of the HTML structure:

    div.autocomplete-container
      div.autocomplete-inner
        div.autocomplete-candidate.autocomplete-selected
        div.autocomplete-candidate
        div.autocomplete-candidate
        div.autocomplete-candidate
        ...

All autocomplete-specific classes are prefixed with `autocomplete-`. There
are two DIV containers (outer and inner), where the inner container contains
a series of DIVs which serve as autocomplete candidates.

There are a few properties that are applied to the outer container that you
generally shouldn't touch (unless you are reasonably sure it's a good idea):

 + display: __none__
 + position: __absolute__
 + z-index: either zIndex configuration option or 9999
 + width: either fixed width give via configuration option, or auto
 + top and left: these are calculated automatically

These CSS rules are applied directly on the element, so you will need to add
the `!important` flag if you wish to override them via stylesheets.

Note that the autocomplete container has no `id` attribute, so if you want
to have multiple differently styled autocomplete result lists, that is
currently not possible.

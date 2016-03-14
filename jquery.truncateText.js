/**
 * truncateText
 * https://github.com/toddlawton/truncateText
 * 
 * Display a truncated version of the provided element's text with an expand link.
 * Matches sentence characters of different languages when provided a language code.
 *
 * Usage: 
 * $('.example-paragraph').truncateText()
 */

;( function( $, window, document, undefined ) {

    "use strict";

        var pluginName = "truncateText",
            defaults = {
                langCode: "en",
                visibleSentences: 1,
                expandLinkText: "Read more"
            };

        function Plugin ( element, options ) {
            this.element = element;
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;

            this.patterns = {
                'en': /[“"']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/g,
                'ja': /[^！？。]*[！？。]/g
            };

            this.init();
        }

        $.extend( Plugin.prototype, {
            init: function() {
                var $this = $(this.element),
                    text = $this.text(),
                    sentences = this.findSentenceMatches(text);

                this.insertTruncatedText(sentences);
                this.bindEvents();
            },

            /**
             * Attach events to the full-text expand link
             */
            bindEvents: function() {
                var $this = $(this.element),
                    $readMoreLink = $this.find('.read-more-link'),
                    $fullText = $this.find('.truncated-full-text');
                
                $readMoreLink.on('click', function() {
                    $readMoreLink.addClass('hidden');
                    $fullText.removeClass('hidden');
                });
            },

            /**
             * Split the element's text into sentences matching the regex pattern
             * @param  {string} text The text to truncate
             * @return {array} The split sentences
             */
            findSentenceMatches: function(text) {
                if (!text.length > 0 || !this.patterns[this.settings.langCode]) return;

                var pattern = this.patterns[this.settings.langCode],
                    splitText = text.match(pattern);

                return splitText;
            },

            /**
             * Build the markup of split truncated and hidden text and insert into the DOM
             * @param  {array} sentences The sentence array to truncate
             */
            insertTruncatedText: function(sentences) {
                if (!sentences || !sentences.length > 0 || !(sentences.length > this.settings.visibleSentences)) return;

                var visibleText = '',
                    hiddenText = '',
                    markupToInsert = '',
                    expandLink = '<a class="read-more-link" href="#"><b>'+this.settings.expandLinkText+'</b></a>';

                if (this.settings.visibleSentences > 1) {
                    for (var i = 0; i < this.settings.visibleSentences; i++) { visibleText += sentences[i] }
                    for (var s = this.settings.visibleSentences; s < sentences.length; s++) { hiddenText += sentences[s] }
                } else {
                    visibleText = sentences[0];
                    for (var o = 1; o < sentences.length; o++) { hiddenText += sentences[o] }
                }

                visibleText += expandLink;
                hiddenText = '<span class="truncated-full-text hidden">' + hiddenText + '</span>';
                markupToInsert = visibleText + hiddenText;
                $(this.element).html(markupToInsert);
            }
        } );

        $.fn[ pluginName ] = function( options ) {
            return this.each( function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" +
                        pluginName, new Plugin( this, options ) );
                }
            } );
        };

} )( jQuery, window, document );
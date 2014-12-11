function Emojii_Keyboard(el) {

    this.rendered = false;
    this.modal = null;
    this.input = el;
    this.btn = null;
    this.$documentBody = $("body").first();
    this.selection = null;

    this.render();
    this.renderSampleModal();
}

Emojii_Keyboard.prototype.renderSampleModal = function () {

    if ($("#tabs-container-sample").length !== 0) { return; }

    this.$documentBody.append('<div id="tabs-container-sample"><ul class="tabs"></ul></div>');
    this.input.trigger("ek.sample-container-rendered");

    var $container = $("#tabs-container-sample"),
        $tabs = $container.find(".tabs"),
        _i = 1,
        current,
        html,
        self = this;

    if ($container.attr("rendered")) { return; }

    for (var group in EP_emotions) {
        if (!EP_emotions.hasOwnProperty(group)) continue;
        current = "";
        html = "";

        if (_i == 1) current = "current";
        $tabs.append('<li class="tab-link ' + current + '" data-tab="tab-' + _i + '">' + group + '</li>');
        EP_emotions[group].forEach(function (item) {
            html += "<span>" + item + "</span>";
        });
        $tabs.after($("<div/>").html(html).attr({id: "tab-" + _i, class: "tab-content " + current}));
        _i++;
    }

    $container.attr({rendered: true});

    $(".tab-content").minEmoji();
};

Emojii_Keyboard.prototype.btnClick = function () {

    var self = this,
        hash = new Array(5).join().replace(/(.|$)/g, function () {
            return ((Math.random() * 36) | 0).toString(36);
        }),
        position = self.input.position(),
        body_width = self.$documentBody.width(),
        horizontal_position = {left: (position.left) + "px"};

    if (position.left > body_width / 2) {
        horizontal_position = {right: (body_width - self.btn.position().left - self.btn.width()) + "px"}
    }

    if (!self.rendered) {
        self.modal = $("<div/>")
            .html($("#tabs-container-sample").clone().attr({id: hash}))
            .attr({class: "emoji-menu"})
            .css({top: (position.top + 26) + "px"}).appendTo("body");

        self.modal.css(horizontal_position);

        $('#' + hash + ' ul.tabs li').click(function () {
            var tab_id = $(this).attr('data-tab');

            $('#' + hash + ' ul.tabs li').removeClass('current');
            $('#' + hash + ' .tab-content').removeClass('current');

            $(this).addClass('current');
            $('#' + hash + ' #' + tab_id).addClass('current');
        });
        self.rendered = true;

        $("html").click(function (e) {
            if ($(e.target).closest(".emoji-menu").length == 0 && $(e.target).closest(".modal-btn").length == 0) {
                self.modal.hide();
                self.input.trigger("ek.modal-window-hide");
            }
        });

        $('#' + hash + ' .em').click(function () {
            var character = $(this).attr("data-char"),
                caretPos = self.input[0].selectionStart,
                prevText = self.input.val();
            
            self.input.val(prevText.substring(0, caretPos) + character + prevText.substring(caretPos) );
        });
        self.input.trigger("ek.modal-window-rendered");
    } else {
        self.modal.show();
    }
    self.input.trigger("ek.modal-window-show");
};

Emojii_Keyboard.prototype.render = function () {
    var attributes = {},
        $inputs = $("input"),
        self = this;

    for (var key in $(this).get(0).attributes) {
        if (!$(this).get(0).attributes.hasOwnProperty(key)) continue;
        var item = $(this).get(0).attributes[key];

        if (item.name != null)
            attributes[item.name] = item.value;
    }

    attributes.contentEditable = true;

    this.btn = $("<button/>")
        .html('<img src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==" style="vertical-align: middle;" class="em emj1">')
        .css({"vertical-align": "top", "margin": 0})
        .attr({class: "modal-btn"});

    this.btn.click(self.btnClick.bind(self));
    this.input.after(this.btn);
    this.input.css({height : "19px"});
};

(function ($) {
    // jQuery plugin wrapper
    $.fn.Emojii_Keyboard = function () {
        return this.each(function () {
            new Emojii_Keyboard($(this))
        });
    };
})(jQuery);


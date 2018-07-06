var div = document.createElement('div');
var showtoast = new ToastBuilder;
var arr = [];

function scrollTop(i) {
  $(i).prepend(toTopTpl())
  $(window).scroll(function() {
    100 < $(this).scrollTop() ? $("#toTop").fadeIn() : $("#toTop").fadeOut()
  }), $("#toTop").click(function() {
    return $("html, body").animate({
      scrollTop: 0
    }, 1e3), !1
  })
}


function ToastBuilder(options) {
  var opts = options || {};
  return opts.defaultText = opts.defaultText, opts.displayTime = opts.displayTime || 3e3, opts.target = "body",
    function(text) {
      $("<div/>").addClass("toast blink").prependTo($(opts.target)).text(text || opts.defaultText).queue(function(next) {
        $(this).css({
          opacity: 1
        });
        var topOffset = 40;
        $(".toast").each(function() {
          var height = $(this).outerHeight();
          $(this).css("bottom", topOffset + "px"), topOffset += height + 15
        }), next()
      }).delay(opts.displayTime).queue(function(next) {
        var width = $(this).outerWidth() + 20;
        $(this).css({
          right: "-" + width + "px",
          opacity: 0
        }), next()
      }).delay(600).queue(function(next) {
        //$(this).remove(), next()
      })
    }
}

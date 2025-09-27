/*------------------------------------------------------------------
Menu Hover Fix JavaScript - Dropdown sadece text üzerinde açılmalı
-------------------------------------------------------------------*/

(function ($) {
  "use strict";

  $(document).ready(function () {
    function fixMenuHover() {
      // Sadece desktop'ta çalışsın (1024px üzeri)
      if ($(window).width() <= 1024) {
        return;
      }

      // FlexNav'ın orijinal hover eventlerini temizle
      $(".flexnav li.item-with-ul").off("mouseenter mouseleave");

      // Her menü öğesi için özel hover logic
      $(".flexnav li.item-with-ul").each(function () {
        var $menuItem = $(this);
        var $link = $menuItem.children("a");
        var $submenu = $menuItem.children(".sub-menu, ul");
        var timeout;

        // Sadece link üzerine hover olduğunda dropdown aç
        $link.on("mouseenter", function (e) {
          clearTimeout(timeout);
          $submenu.stop(true, true).addClass("flexnav-show");
        });

        // Link'ten çıkıldığında gecikmeli kapatma
        $link.on("mouseleave", function (e) {
          timeout = setTimeout(function () {
            // Eğer mouse dropdown'da değilse kapat
            if (!$submenu.is(":hover")) {
              $submenu.removeClass("flexnav-show");
            }
          }, 100);
        });

        // Dropdown üzerinde hover olduğunda açık tut
        $submenu.on("mouseenter", function () {
          clearTimeout(timeout);
          $(this).addClass("flexnav-show");
        });

        // Dropdown'tan çıkıldığında kapat
        $submenu.on("mouseleave", function () {
          $(this).removeClass("flexnav-show");
        });

        // Li elementinin boş alanına hover olduğunda hiçbir şey yapma
        $menuItem.on("mouseenter", function (e) {
          // Sadece li'nin kendisine hover olduğunda (link'e değil)
          if (e.target === this) {
            // Dropdown'ı kapatma mantığı
            if (!$link.is(":hover") && !$submenu.is(":hover")) {
              $submenu.removeClass("flexnav-show");
            }
          }
        });
      });
    }

    // Sayfa yüklendiğinde başlat
    setTimeout(function () {
      fixMenuHover();
    }, 1000);

    // Pencere boyutu değiştiğinde yeniden başlat
    $(window).on("resize", function () {
      setTimeout(function () {
        fixMenuHover();
      }, 100);
    });

    // Ajax sayfa yüklemelerinde yeniden başlat
    $(document).on("ajaxComplete", function () {
      setTimeout(function () {
        fixMenuHover();
      }, 500);
    });
  });
})(jQuery);

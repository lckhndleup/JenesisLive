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
        var isAnimating = false; // Animasyon kontrolü

        // Sadece link üzerine hover olduğunda dropdown aç
        $link.on("mouseenter", function (e) {
          clearTimeout(timeout);

          // Eğer dropdown zaten açık değilse ve animasyon yapılmıyorsa aç
          if (!$submenu.hasClass("flexnav-show") && !isAnimating) {
            isAnimating = true;
            $submenu.stop(true, true).addClass("flexnav-show");

            // Animasyon bittikten sonra flag'i sıfırla
            setTimeout(function () {
              isAnimating = false;
            }, 300);
          }
        });

        // Link'ten çıkıldığında gecikmeli kapatma
        $link.on("mouseleave", function (e) {
          var relatedTarget = e.relatedTarget || e.toElement;

          // Eğer mouse dropdown'a gidiyorsa kapatma
          if (relatedTarget && $(relatedTarget).closest($submenu).length > 0) {
            return;
          }

          timeout = setTimeout(function () {
            // Eğer mouse dropdown'da değilse kapat
            if (!$submenu.is(":hover") && !isAnimating) {
              $submenu.removeClass("flexnav-show");
            }
          }, 200); // Daha uzun süre ver
        });

        // Dropdown üzerinde hover olduğunda açık tut
        $submenu.on("mouseenter", function () {
          clearTimeout(timeout);
          // Dropdown zaten açık olduğundan emin ol
          if (!$(this).hasClass("flexnav-show")) {
            $(this).addClass("flexnav-show");
          }
        });

        // Dropdown'tan çıkıldığında kapat
        $submenu.on("mouseleave", function (e) {
          var relatedTarget = e.relatedTarget || e.toElement;

          // Eğer mouse ana link'e dönüyorsa kapatma
          if (relatedTarget && $(relatedTarget).closest($link).length > 0) {
            return;
          }

          // Kısa gecikme ile kapat
          setTimeout(function () {
            if (!$link.is(":hover") && !isAnimating) {
              $submenu.removeClass("flexnav-show");
            }
          }, 100);
        });

        // Li elementinin boş alanlarında dropdown davranışını kontrol et
        $menuItem.on("mouseenter", function (e) {
          // Eğer event li'nin kendisinden geliyorsa (link veya submenu'den değil)
          if (e.target === this) {
            // Dropdown açıksa ve mouse ne link'te ne de dropdown'ta değilse
            if (
              $submenu.hasClass("flexnav-show") &&
              !$link.is(":hover") &&
              !$submenu.is(":hover")
            ) {
              // Dropdown'ı kapat ama gecikmeli
              timeout = setTimeout(function () {
                if (!$link.is(":hover") && !$submenu.is(":hover")) {
                  $submenu.removeClass("flexnav-show");
                }
              }, 150);
            }
          }
        });

        // Li elementinden çıkıldığında da kontrol et
        $menuItem.on("mouseleave", function (e) {
          var relatedTarget = e.relatedTarget || e.toElement;

          // Eğer mouse tamamen menü alanından çıkıyorsa dropdown'ı kapat
          if (
            !relatedTarget ||
            (!$(relatedTarget).closest($menuItem).length &&
              !$(relatedTarget).closest($submenu).length)
          ) {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
              $submenu.removeClass("flexnav-show");
            }, 100);
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

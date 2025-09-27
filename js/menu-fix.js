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

      // Tüm submenu elementlerini event'lerden temizle
      $(".flexnav .sub-menu, .flexnav ul ul").off("mouseenter mouseleave");

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

        // Dropdown hover kontrolü - ÇOK SIKI KONTROL
        $submenu.on("mouseenter", function (e) {
          // SADECE dropdown zaten açıksa işlem yap
          if ($(this).hasClass("flexnav-show")) {
            clearTimeout(timeout);
          } else {
            // Dropdown kapalıysa event'i durdur ve hiçbir şey yapma
            e.stopPropagation();
            e.preventDefault();
            return false;
          }
        });

        // Dropdown'tan çıkıldığında kapat
        $submenu.on("mouseleave", function (e) {
          // SADECE dropdown açıksa işlem yap
          if (!$(this).hasClass("flexnav-show")) {
            return;
          }

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
          // Dropdown KAPALIYKEN li elementine hover olunca hiçbir şey yapma
          if (!$submenu.hasClass("flexnav-show")) {
            return; // Çık, dropdown açma
          }

          // Eğer event li'nin kendisinden geliyorsa (link veya submenu'den değil)
          if (e.target === this) {
            // Dropdown açıksa ve mouse ne link'te ne de dropdown'ta değilse
            if (!$link.is(":hover") && !$submenu.is(":hover")) {
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

      // İkinci seviye menü kontrolleri (sub-sub-menu)
      $(".flexnav .sub-menu li.has-submenu").each(function () {
        var $subMenuItem = $(this);
        var $subLink = $subMenuItem.children("a");
        var $subSubMenu = $subMenuItem.children(".sub-sub-menu");
        var subTimeout;

        // Alt menü item'ine hover olduğunda sub-sub-menu'yu göster
        $subMenuItem.on("mouseenter", function (e) {
          clearTimeout(subTimeout);
          $subSubMenu.addClass("flexnav-show");
        });

        // Alt menü item'ten çıkıldığında sub-sub-menu'yu gizle
        $subMenuItem.on("mouseleave", function (e) {
          subTimeout = setTimeout(function () {
            $subSubMenu.removeClass("flexnav-show");
          }, 150);
        });

        // Sub-sub-menu üzerindeyken açık tut
        $subSubMenu.on("mouseenter", function () {
          clearTimeout(subTimeout);
        });

        // Sub-sub-menu'den çıkıldığında kapat
        $subSubMenu.on("mouseleave", function () {
          $(this).removeClass("flexnav-show");
        });
      });

      // Global dropdown event blocker - kapalı dropdown'lara hover olmasın
      $(document).on(
        "mouseenter",
        ".flexnav .sub-menu:not(.flexnav-show), .flexnav .sub-sub-menu:not(.flexnav-show)",
        function (e) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      );
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

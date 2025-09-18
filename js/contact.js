/*--------------------------------------------------
EmailJS Contact Form - Backend'siz Mail Gönderimi
---------------------------------------------------*/

// EmailJS Initialization - Sayfada ilk yüklenen kod
(function () {
  // BURAYA EmailJS panelinden aldığınız Public Key'i yazın
  emailjs.init("kNiOc8j2m41bvPK-F");
})();

/*--------------------------------------------------
Function Contact Formular
---------------------------------------------------*/
function ContactForm() {
  if ($("#contact-formular").length > 0) {
    $("#contactform").submit(function (e) {
      e.preventDefault(); // Formun normal submit işlemini durdur

      // Loading mesajı göster ve buton durumunu değiştir
      $("#message").slideUp(750, function () {
        $("#message").hide();
        $("#submit").attr("disabled", "disabled");
        $("#submit").val("Sending...");

        // Form verilerini al ve temizle
        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const comments = $("#comments").val().trim();
        const verify = $("#verify").val().trim();

        // Validation kontrolleri (PHP'deki gibi)
        if (!name) {
          showResult(
            '<div class="error_message">Attention! You must enter your name.</div>'
          );
          return;
        }

        if (!email) {
          showResult(
            '<div class="error_message">Attention! Please enter a valid email address.</div>'
          );
          return;
        }

        // Email format kontrolü (regex ile)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showResult(
            '<div class="error_message">Attention! You have enter an invalid e-mail address, try again.</div>'
          );
          return;
        }

        if (!comments) {
          showResult(
            '<div class="error_message">Attention! Please enter your message.</div>'
          );
          return;
        }

        if (!verify) {
          showResult(
            '<div class="error_message">Attention! Please enter the verification number.</div>'
          );
          return;
        }

        if (verify !== "4") {
          showResult(
            '<div class="error_message">Attention! The verification number you entered is incorrect.</div>'
          );
          return;
        }

        // EmailJS template parametreleri - EmailJS template'inizle eşleşmeli
        const templateParams = {
          name: name,
          email: email,
          comments: comments,
        };

        // EmailJS ile mail gönder
        // BURAYA Service ID ve Template ID'nizi yazın
        emailjs
          .send("service_w6m5g8j", "template_ewnhrxp", templateParams)
          .then(
            function (response) {
              console.log("Email sent successfully!", response);

              // Başarı mesajı göster (PHP'deki gibi)
              showResult(
                "<fieldset>" +
                  '<div id="success_page">' +
                  "<h3>Email Sent Successfully.</h3>" +
                  "<p>Thank you <strong>" +
                  name +
                  "</strong>, your message has been submitted to us.</p>" +
                  "</div>" +
                  "</fieldset>"
              );

              // Form'u gizle (başarılı gönderim sonrası)
              setTimeout(function () {
                $("#contactform").slideUp("slow");
              }, 2000);
            },
            function (error) {
              console.error("Email sending failed:", error);

              // Hata mesajı göster
              showResult(
                '<div class="error_message">Sorry, there was an error sending your message. Please try again later.</div>'
              );
            }
          );
      });

      return false;
    });
  }

  // Sonucu göster ve butonu resetle
  function showResult(message) {
    document.getElementById("message").innerHTML = message;
    $("#message").slideDown("slow");
    $("#submit").removeAttr("disabled");
    $("#submit").val("Send Mail");
  }
} //End ContactForm

/*--------------------------------------------------
Function Contact Map - İSTANBUL İKİTELLİ OSB
---------------------------------------------------*/
function ContactMap() {
  if (jQuery("#map_canvas").length > 0) {
    // İSTANBUL İKİTELLİ OSB KOORDİNATLARI (DOĞRU LOKASYON)
    var latlng = new google.maps.LatLng(41.08015985557919, 28.811415826196423);
    var settings = {
      zoom: 16, // Daha yakın görüntü için zoom artırıldı
      disableDefaultUI: true,
      center: new google.maps.LatLng(41.08015985557919, 28.811415826196423), // İstanbul koordinatları
      mapTypeControl: false,
      scrollwheel: false,
      draggable: true,
      panControl: false,
      scaleControl: false,
      zoomControl: false,
      streetViewControl: false,
      navigationControl: false,
    };

    var newstyle = [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [
          {
            saturation: 36,
          },
          {
            color: "#000000",
          },
          {
            lightness: 40,
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "#000000",
          },
          {
            lightness: 16,
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 20,
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 17,
          },
          {
            weight: 1.2,
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 20,
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 21,
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 17,
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 29,
          },
          {
            weight: 0.2,
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 18,
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 16,
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 19,
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 17,
          },
        ],
      },
    ];

    var mapOptions = {
      styles: newstyle,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, "holver"],
      },
    };

    var map = new google.maps.Map(
      document.getElementById("map_canvas"),
      settings
    );
    var mapType = new google.maps.StyledMapType(newstyle, {
      name: "Grayscale",
    });
    map.mapTypes.set("holver", mapType);
    map.setMapTypeId("holver");

    google.maps.event.addDomListener(window, "resize", function () {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });

    // GÜNCELLENMIŞ İŞLETME BİLGİLERİ
    var contentString =
      '<div id="content-map-marker" style="text-align:center; padding-top:10px; padding-left:10px">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h4 id="firstHeading" class="firstHeading" style="color:#000!important; font-weight:600; margin-bottom:5px;">Jenesis Buhar Teknolojileri</h4>' +
      '<div id="bodyContent">' +
      '<p style="color:#666; font-size:13px; margin-bottom:8px; line-height:1.4;">İkitelli OSB Eski Turgut Özal Cad.<br>No:40/1 Z-03 Başakşehir İstanbul</p>' +
      '<p style="color:#333; font-size:12px; margin-bottom:5px;"><strong>Tel:</strong> +90 (212) 595 16 56</p>' +
      '<p style="color:#333; font-size:12px; margin-bottom:10px;"><strong>Email:</strong> info@jenesis.com.tr</p>' +
      "</div>" +
      "</div>";

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 300,
    });

    // Özel marker (eğer images/marker.png dosyası varsa)
    var companyImage = new google.maps.MarkerImage(
      "images/marker.png",
      new google.maps.Size(58, 63), // Width and height of the marker
      new google.maps.Point(0, 0),
      new google.maps.Point(35, 20) //Position of the marker
    );

    // İSTANBUL İKİTELLİ OSB KOORDİNATLARI (DOĞRU LOKASYON)
    var companyPos = new google.maps.LatLng(
      41.08015985557919,
      28.811415826196423
    );
    var companyMarker = new google.maps.Marker({
      position: companyPos,
      map: map,
      icon: companyImage, // Eğer marker.png yoksa bu satırı silin
      title: "JENESIS BUHAR JENERATÖRLERİ",
      zIndex: 3,
    });

    // Marker'a tıklandığında bilgi kutusu açılır
    google.maps.event.addListener(companyMarker, "click", function () {
      infowindow.open(map, companyMarker);
    });

    // Sayfa yüklendiğinde otomatik olarak bilgi kutusunu göster
    setTimeout(function () {
      infowindow.open(map, companyMarker);
    }, 1000);
  }

  return false;
} //End ContactMap

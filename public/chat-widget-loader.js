(function () {
  "use strict";

  window.ChatWidget = {
    init: function (config) {
      if (!config.token) {
        console.error("ChatbotWidget: Missing required configuration");
        return;
      }

      const domain = window.location.origin;

      const iframe = document.createElement("iframe");

      iframe.src = `${domain}/widget?token=${config.token}&domain=${domain}`;

      iframe.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 500px;
        height: 600px;
        border: none;
      `;

      document.body.appendChild(iframe);

      window.addEventListener("message", function (event) {
        if (event.data.type === "RESIZE_WIDGET") {
          iframe.style.height = event.data.height + "px";
        }
      });
    },
  };
})();

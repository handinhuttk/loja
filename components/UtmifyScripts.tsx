import Script from 'next/script';

export default function UtmifyScripts() {
  return (
    <>
      {/* Script do Pixel UTMify */}
      <Script
        id="utmify-pixel-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.pixelId = "6a314a881bff7edd5fdfeb73";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `,
        }}
      />

      {/* Script de UTMs UTMify */}
      <Script
        id="utmify-utms-script"
        strategy="afterInteractive"
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        data-utmify-prevent-xcod-sck="true"
        data-utmify-prevent-subids="true"
        async
        defer
      />
    </>
  );
}

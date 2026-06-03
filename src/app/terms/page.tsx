export default function TermsPage() {
  return (
    <div className="p-5 md:p-10 pt-24 max-w-4xl mx-auto text-gray-300">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Terms of Service & Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Terms of Service</h2>
        <p className="mb-4">
          Welcome to SALIDA. By using our website, you agree to comply with and be bound by these terms. 
        </p>
        <h3 className="text-xl font-semibold mb-2 text-white">Content Disclaimer</h3>
        <p className="mb-4">
          SALIDA is a website that provides links to third-party content. <strong>SALIDA does not host, upload, or broadcast any movies, TV shows, or media files on its servers.</strong> All content displayed on this site is hosted by third-party services and provided solely for informational and entertainment purposes based on publicly available metadata.
        </p>
        <p className="mb-4">
          We do not claim ownership of any content linked through our platform. All trademarks and copyrights belong to their respective owners.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Privacy Policy</h2>
        <p className="mb-4">
          We respect your privacy. We do not collect, store, or sell personal data. 
        </p>
        <p>
          Any watchlist information you create is stored locally within your browser's local storage. This data is never sent to or stored on our servers.
        </p>
      </section>

      <p className="text-sm text-gray-500">Last updated: June 3, 2026</p>
    </div>
  );
}

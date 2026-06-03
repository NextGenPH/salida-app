export const Footer = () => {
  return (
    <footer className="w-full py-8 text-center text-gray-500 bg-[#141414]">
      <p>&copy; {new Date().getFullYear()} SALIDA. All rights reserved.</p>
      <div className="mt-2 space-x-2">
        <a href="/terms" className="text-gray-400 hover:text-white underline">Terms & Policy</a>
        <span>|</span>
        <a href="https://nextgenph.site" className="text-red-500 hover:text-red-400 font-semibold" target="_blank" rel="noopener noreferrer">Powered by nextgenph.site</a>
      </div>
    </footer>
  );
};

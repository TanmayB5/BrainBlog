import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-dark-brown text-cream py-4 border-t border-medium-beige mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2 text-sm">
        <div className="font-bold text-lg text-cream">
          Brain Blog
        </div>
        <div className="text-xs md:text-sm opacity-80 text-cream">
          © {new Date().getFullYear()} Brain Blog. Built with <span className="text-red-400">❤️</span> for creators.
        </div>
      </div>
    </footer>
  );
}

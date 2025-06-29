import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark-brown text-cream py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl" role="img" aria-label="brain">🧠</span>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Brain Blog
              </span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} Brain Blog. All rights reserved. Built with ❤️ for creators.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

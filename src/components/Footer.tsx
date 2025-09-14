import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-primary py-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Follow Us Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <a 
                href="#" 
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* School Information */}
          <div className="text-center md:text-right text-white">
            <p className="text-lg font-semibold mb-2">
              © SMK Negeri 6 Makassar
            </p>
            <p className="text-white/80 text-sm">
              Jl. Pendidikan No. 123, Makassar, Sulawesi Selatan
            </p>
            <p className="text-white/80 text-sm">
              Phone: (0411) 123-4567 | Email: info@smkn6makassar.sch.id
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/70 text-sm">
            All rights reserved. Empowering students for a brighter future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import profilePhoto from "@/assets/profile-photo.jpg";

const ProfileSection = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12 animate-slide-up">
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <div className="profile-image relative">
          <div 
            className="w-64 h-64 rounded-full bg-gradient-to-br from-primary-light to-primary shadow-[var(--shadow-profile)] overflow-hidden border-4 border-white"
            style={{
              boxShadow: "0 20px 25px -5px hsl(217 91% 60% / 0.1), 0 10px 10px -5px hsl(217 91% 60% / 0.04), 0 0 0 4px white"
            }}
          >
            <img 
              src={profilePhoto}
              alt="Ahmad Amiruddin - Profile Photo"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="text-center lg:text-left flex-1">
        <h2 className="text-4xl lg:text-5xl font-bold text-heading mb-4 tracking-tight">
          AHMAD AMIRUDDIN
        </h2>
        <blockquote className="text-lg lg:text-xl text-secondary italic leading-relaxed max-w-md dark:text-white text-black/80 mx-auto lg:mx-0">
          "Jika kode mu berjalan, maka biarkanlah"
        </blockquote>
      </div>
    </section>
  );
};

export default ProfileSection;
import principalImage from "@/assets/principal.png";

const PrincipalProfile = () => {
  return (
    <section className="py-16 px-6 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Principal's Profile
        </h2>
        
        <div className="bg-card rounded-lg shadow-elegant p-8">
          <div className="flex fklex-col md:flex-row items-center md:items-start gap-8">
            {/* Principal Photo */}
            <div className="flex-shrink-0">
              <img
                src={principalImage}
                alt="Principal Profile"
                className="w-48 h-48 rounded-lg object-cover shadow-lg"
              />
            </div>

            {/* Principal Information */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-card-foreground mb-2">
                A. Nursyidah Galigo, S.Pd.,M.Pd
              </h3>
              <p className="text-primary font-semibold mb-4">
                Principal of SMK Negeri 6 Makassar
              </p>
              
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  A. Nursyidah Galigo, S.Pd.,M.Pd brings over 20 years of experience in vocational education 
                  and has been serving as the Principal of SMK Negeri 6 Makassar since 2018. 
                  She holds a Master's degree in Educational Leadership and a Doctorate in 
                  Vocational Education Management.
                </p>
                
                <p>
                  Under her leadership, SMK Negeri 6 Makassar has achieved numerous accolades 
                  including the "Outstanding Vocational School" award from the Ministry of 
                  Education and Culture. She is committed to preparing students with practical 
                  skills and knowledge for the modern workforce.
                </p>
                
                <p>
                  Her vision is to make SMK Negeri 6 Makassar a center of excellence in 
                  vocational education, producing graduates who are competent, innovative, 
                  and ready to contribute to Indonesia's economic development.
                </p>
              </div>

              {/* Achievements */}
              <div className="mt-6">
                <h4 className="font-semibold text-card-foreground mb-3">Key Achievements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Outstanding Principal Award 2022</li>
                  <li>• 95% Graduate Employment Rate</li>
                  <li>• S2 Pendidikan Teknologi dan Kejuruan Universitas Negeri Makassar</li>
                  <li>• Tata Kecantikan Rambut</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalProfile;
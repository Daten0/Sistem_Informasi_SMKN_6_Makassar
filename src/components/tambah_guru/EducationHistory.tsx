const EducationHistory = () => {
  const educationData = [
    {
      university: "UNM",
      degree: "2302939303333",
      year: "2000",
      level: "S1"
    },
    {
      university: "UNHAS", 
      degree: "2302939303333",
      year: "2007",
      level: "S2"
    },
    {
      university: "UGM",
      degree: "2302939303333", 
      year: "2008",
      level: "S3"
    }
  ];

  return (
    <section className="animate-slide-up">
      <h3 className="text-xl font-bold text-heading mb-6">Riwayat Pendidikan</h3>
      
      <div className="surface-elevated p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-4 px-4 text-subheading font-semibold">
                  Perguruan Tinggi
                </th>
                <th className="text-left py-4 px-4 text-subheading font-semibold">
                  Gelar akademik
                </th>
                <th className="text-left py-4 px-4 text-subheading font-semibold">
                  Tahun
                </th>
                <th className="text-left py-4 px-4 text-subheading font-semibold">
                  Jenjang
                </th>
              </tr>
            </thead>
            <tbody>
              {educationData.map((item, index) => (
                <tr 
                  key={index}
                  className="border-b border-border-light last:border-b-0 hover:bg-accent/30 transition-colors"
                >
                  <td className="py-4 px-4 font-semibold text-body">
                    {item.university}
                  </td>
                  <td className="py-4 px-4 text-body">
                    {item.degree}
                  </td>
                  <td className="py-4 px-4 text-body">
                    {item.year}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                      {item.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EducationHistory;
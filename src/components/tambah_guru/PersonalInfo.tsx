const PersonalInfo = () => {
  const personalData = [
    { label: "Nama", value: "Ahmad Amiruddin" },
    { label: "NIP", value: "1224355353535" },
    { label: "Jabatan", value: "Bengkel IT" },
    { label: "Mata Pelajaran", value: "Matematika" },
    { label: "Kelas", value: "DKV, AK" }
  ];

  const locationData = [
    { label: "Tempat lahir", value: "Makassar" },
    { label: "Tanggal lahir", value: "19 Mei 2000" },
    { label: "Alamat", value: "Mannuruki" },
    { label: "Agama", value: "Islam" }
  ];

  const InfoGroup = ({ title, data }: { title?: string; data: Array<{ label: string; value: string }> }) => (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-heading border-b border-border-light pb-2">
          {title}
        </h3>
      )}
      {data.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <dt className="text-muted-foreground font-medium min-w-[120px]">{item.label}</dt>
          <dd className="text-foreground font-semibold">{item.value}</dd>
        </div>
      ))}
    </div>
  );

  return (
    <section className="surface-elevated p-8 mb-8 animate-slide-up">
      <div className="grid md:grid-cols-2 gap-8">
        <InfoGroup data={personalData} />
        <InfoGroup data={locationData} />
      </div>
    </section>
  );
};

export default PersonalInfo;
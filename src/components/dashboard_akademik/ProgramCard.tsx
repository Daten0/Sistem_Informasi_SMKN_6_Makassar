interface ProgramCardProps {
  title: string;
  onClick?: () => void;
}

export const ProgramCard = ({ title, onClick }: ProgramCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-lg shadow-md px-8 py-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
    >
      <h2 className="text-xl font-bold text-card-foreground group-hover:text-blue-600 transition-colors">
        {title}
      </h2>
    </button>
  );
};
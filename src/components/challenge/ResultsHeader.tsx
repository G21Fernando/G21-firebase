interface ResultsHeaderProps {
  title: string;
}

const ResultsHeader = ({ title }: ResultsHeaderProps) => {
  return (
    <h2 className="text-xl font-semibold text-[#11245A] mb-4">{title}</h2>
  );
};

export default ResultsHeader;
interface TimerHeaderProps {
  title: string;
  subtitle: string;
}

const TimerHeader = ({ title, subtitle }: TimerHeaderProps) => {
  return (
    <div className="text-center mb-2">
      <div className="text-2xl font-bold text-[#11245A]">{title}</div>
      <div className="text-base text-[#11245A]/70 mt-1">{subtitle}</div>
    </div>
  );
};

export default TimerHeader;
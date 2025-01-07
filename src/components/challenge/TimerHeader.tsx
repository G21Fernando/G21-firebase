interface TimerHeaderProps {
  title: string;
  subtitle: string;
  isActive: boolean;
}

const TimerHeader = ({ title, subtitle, isActive }: TimerHeaderProps) => {
  return (
    <div className="text-center mb-2">
      <div className="text-2xl font-bold text-[#11245A]">{title}</div>
      {!isActive && (
        <div className="text-base text-[#11245A]/70 mt-1">{subtitle}</div>
      )}
    </div>
  );
};

export default TimerHeader;
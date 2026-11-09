interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <div className={`${alignClass} ${className}`}>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm sm:text-base text-gray-400 tracking-widest uppercase font-body">
          {subtitle}
        </p>
      )}
    </div>
  );
}

import React from 'react';
import logoImg from '../assets/images/82a33697-4af9-41fd-ae0a-940c4c556c06.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };
  const textSizes: Record<NonNullable<LogoProps['size']>, string> = {
    sm: 'text-base font-extrabold',
    md: 'text-xl font-black',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={logoImg}
        alt="NameForge"
        className={`${iconSizes[size]} shrink-0 rounded-xl object-contain`}
        loading="eager"
        decoding="async"
      />
      {showText && (
        <span className={`${textSizes[size]} nf-brand-title tracking-tight leading-none`}>
          NameForge
        </span>
      )}
    </div>
  );
};

export default Logo;

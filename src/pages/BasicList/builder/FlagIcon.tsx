import React from 'react';
import Flags from 'country-flag-icons/react/3x2';
import { hasFlag } from 'country-flag-icons';

type FlagIconType = {
  code: string;
  className?: string;
  width?: number;
};

const FlagIcon = ({ code, className = '', width }: FlagIconType) => {
  let countryCode = code;
  // to ISO-3166-1
  if (countryCode.includes('-')) {
    countryCode = countryCode.substring(countryCode.indexOf('-') + 1);
  }

  countryCode = countryCode.toUpperCase();

  if (hasFlag(countryCode) === false) {
    return <>invalid flag code</>;
  }

  const styles = {};
  if (width) {
    styles['width'] = width + 'px';
  }

  const FlagComponent = Flags[countryCode];
  return <FlagComponent className={`flag-icon ${className}`} style={{ ...styles }} />;
};

export default FlagIcon;

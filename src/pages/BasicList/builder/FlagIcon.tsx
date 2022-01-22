import React from 'react';
import Flags from 'country-flag-icons/react/3x2';
import { hasFlag } from 'country-flag-icons';

type FlagIconType = {
  code: string;
  className?: string;
  width?: number;
};

const FlagIcon = ({ code, className = '', width }: FlagIconType) => {
  // to ISO-3166-1
  if (code.includes('-')) {
    code = code.substring(code.indexOf('-') + 1);
  }

  code = code.toUpperCase();

  if (hasFlag(code) === false) {
    return <>invalid flag code</>;
  }

  const styles = {};
  if (width) {
    styles['width'] = width + 'px';
  }

  const FlagComponent = Flags[code];
  return <FlagComponent className={`flag-icon ${className}`} style={{ ...styles }} />;
};

export default FlagIcon;

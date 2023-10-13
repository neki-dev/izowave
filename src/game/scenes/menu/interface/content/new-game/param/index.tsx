import React, { useState } from 'react';

import { Setting } from '~scene/system/interface/setting';
import { LangPhrase } from '~type/lang';

type Props = {
  label: LangPhrase
  values: LangPhrase[]
  defaultValue: LangPhrase
  onChange: (value: any) => void
};

export const Param: React.FC<Props> = ({
  label,
  values,
  defaultValue,
  onChange,
}) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChange = (value: LangPhrase) => {
    onChange(value);
    setCurrentValue(value);
  };

  return (
    <Setting
      label={label}
      values={values}
      currentValue={currentValue}
      onChange={handleChange}
    />
  );
};

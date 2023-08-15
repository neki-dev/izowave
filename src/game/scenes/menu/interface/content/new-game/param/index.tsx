import React, { useState } from 'react';

import { Setting } from '~scene/system/interface/setting';

type Props = {
  label: string
  values: string[]
  defaultValue: string
  onChange: (value: any) => void
};

export const Param: React.FC<Props> = ({
  label,
  values,
  defaultValue,
  onChange,
}) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChange = (value: string) => {
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

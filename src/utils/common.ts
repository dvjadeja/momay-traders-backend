export const getPagination = ({
  pageProp,
  limitProp,
}: {
  pageProp: {
    pageIndex: string | number;
    defaultValue?: number;
    maxLimit?: number;
  };
  limitProp: {
    limitIndex: string | number;
    defaultValue?: number;
    maxLimit?: number;
  };
}) => {
  const { pageIndex, defaultValue: pageDefaultValue = 1, maxLimit: pageMaxLimit = 1 } = pageProp;
  const {
    limitIndex,
    defaultValue: limitDefaultValue = 10,
    maxLimit: limitMaxLimit = 100,
  } = limitProp;

  const page = getMaxLimit({
    value: pageIndex,
    defaultValue: pageDefaultValue,
    maxLimit: pageMaxLimit,
  });

  const limit = getMaxLimit({
    value: limitIndex,
    defaultValue: limitDefaultValue,
    maxLimit: limitMaxLimit,
  });

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const getSearchQuery = (search: string) => {
  return {
    $text: { $search: search },
  };
};

export const convertToNumber = (value: string | number) => {
  return Number(value);
};

export const getMaxLimit = ({
  value,
  defaultValue = 1,
  maxLimit,
}: {
  value: string | number;
  defaultValue?: number;
  maxLimit: number;
}) => {
  return Math.min(Number(value) || defaultValue, maxLimit);
};

export const trimSearch = (search: string) => {
  return (search as string | undefined)?.trim();
};

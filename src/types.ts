// Basic TypeScript types for the project
export type ReactChildren = {
  children: React.ReactNode;
};

export type ClassNameProps = {
  className?: string;
};

export type BasicComponentProps = ReactChildren & ClassNameProps;

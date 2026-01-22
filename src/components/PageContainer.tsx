import React, { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  withBeams?: boolean;
  className?: string;
  bgClassName?: string;
}

const PageContainer = ({
  children,
  withBeams = true,
  className = "",
  bgClassName = "bg-gradient-to-br from-purple-50 via-white to-blue-50",
}: PageContainerProps) => {
  return (
    <div className={`min-h-screen relative ${bgClassName}`}>
      <div className="page-content">
        <div className={`w-full p-0 ${className}`}>{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;

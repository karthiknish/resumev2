/**
 * A reusable page container component that ensures proper spacing with the navigation
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render inside the container
 * @param {boolean} props.withBeams - Whether to include the background beams effect (default: true)
 * @param {string} props.className - Additional classes to apply to the content container
 * @param {string} props.bgClassName - Additional classes to apply to the background container
 */
const PageContainer = ({
  children,
  withBeams = true,
  className = "",
  bgClassName = "bg-black/95",
}) => {
  return (
    <div className={`min-h-screen relative ${bgClassName}`}>
      <div className="page-content">
        <div className={`max-w-6xl mx-auto p-8 ${className}`}>{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;

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
  bgClassName = "bg-gradient-to-br from-purple-50 via-white to-blue-50",
}) => {
  return (
    <div className={`min-h-screen relative ${bgClassName}`}>
      <div className="page-content">
        <div className={`w-full p-0 ${className}`}>{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;

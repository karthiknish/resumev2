// Converted to TypeScript - migrated
export const GA_MEASUREMENT_ID = "G-LSLF7F9MS0";
export const pageview = (url) => {
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};
export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};


export const GA_MEASUREMENT_ID = "G-LSLF7F9MS0";

export const pageview = (url: string): void => {
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: EventParams): void => {
  (window as any).gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

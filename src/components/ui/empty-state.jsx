import {
  Inbox,
  Users,
  FileText,
  Mail,
  Search,
  Calendar,
  Package,
  Database,
  FileX,
} from "lucide-react";

const illustrations = {
  inbox: Inbox,
  users: Users,
  files: FileText,
  mail: Mail,
  search: Search,
  calendar: Calendar,
  package: Package,
  database: Database,
  fileX: FileX,
};

export function EmptyState({
  title = "No data found",
  description = "There's nothing to display right now.",
  illustration = "inbox",
  action = null,
  className = "",
}) {
  const IllustrationIcon = illustrations[illustration] || illustrations.inbox;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div className="mb-4 flex items-center justify-center rounded-full bg-muted/50 p-6">
        <IllustrationIcon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-heading font-semibold text-foreground">
        {title}
      </h3>
      <p className="mb-6 text-center text-sm text-muted-foreground max-w-md">
        {description}
      </p>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function EmptyTable({
  title = "No data found",
  description = "There's nothing to display in this table.",
  illustration = "inbox",
  colSpan = 1,
}) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <EmptyState
          title={title}
          description={description}
          illustration={illustration}
        />
      </td>
    </tr>
  );
}

export function EmptyList({
  title = "No items found",
  description = "There are no items to display right now.",
  illustration = "inbox",
  action = null,
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      illustration={illustration}
      action={action}
    />
  );
}

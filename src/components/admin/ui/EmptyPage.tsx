// Converted to TypeScript - migrated
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface EmptyPageProps {
  sessionDebug?: unknown;
}

export function EmptyPage({ sessionDebug }: EmptyPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-foreground">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Access denied
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        You do not have administrator privileges to access this page.
      </p>

      {!!sessionDebug && (
        <div className="mt-8 w-full max-w-2xl text-left">
          <Card className="overflow-hidden border-destructive/25 shadow-sm">
            <CardHeader className="border-b border-border bg-muted/50 px-4 py-3 sm:px-6">
              <CardTitle className="text-base font-semibold text-foreground">
                Session debug
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-4 sm:px-6">
              <p className="mb-3 text-sm text-muted-foreground">
                Current session payload (share with site owner if access should be granted):
              </p>
              <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-code-canvas p-4 text-left text-xs text-code-block-fg">
                {JSON.stringify(sessionDebug, null, 2)}
              </pre>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground sm:px-6">
              If this looks wrong, sign out and sign in again with an admin account.
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EmptyPage;

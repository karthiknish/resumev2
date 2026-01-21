// Converted to TypeScript - migrated
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function EmptyPage({ sessionDebug }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
      <p className="mb-4">
        You do not have administrator privileges to access this page.
      </p>

      {sessionDebug && (
        <div className="mt-8 w-full max-w-2xl">
          <Card className="p-6 bg-gray-800 border border-gray-700 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
            <CardHeader className="bg-black rounded-t-lg px-6 py-4">
              <CardTitle className="text-xl font-semibold text-white">
                Session Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Your current session contains the following information:
              </p>

              <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
                {JSON.stringify(sessionDebug, null, 2)}
              </pre>
            </CardContent>
            <CardFooter className="bg-black rounded-b-lg px-6 py-4">
              <p className="text-gray-400 text-sm">
                If you believe you should have admin access, please contact the
                system administrator with this information.
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EmptyPage;


declare module "formidable" {
  import type { IncomingMessage } from "http";

  export interface Files {
    [field: string]: unknown;
  }

  export interface Fields {
    [field: string]: string[] | undefined;
  }

  export interface IncomingForm {
    parse(req: IncomingMessage): Promise<[Fields, Files]>;
  }

  export default function formidable(options?: Record<string, unknown>): IncomingForm;
}

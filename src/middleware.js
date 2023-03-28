import withAuthorization from "middlewares/withAuthorization";
import { NextResponse } from "next/server";
const mainMiddleware = (request) => {
  const res = NextResponse.next();
  return res;
};
export default withAuthorization(mainMiddleware, ["/admin"]);

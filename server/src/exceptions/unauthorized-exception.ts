import { HTTPException } from "hono/http-exception";

export default class UnauthorizedException extends HTTPException {
  constructor(message: { message: string }) {
    super(401, { message: JSON.stringify(message) });
  }
}

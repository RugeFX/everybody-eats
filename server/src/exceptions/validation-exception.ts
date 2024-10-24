export class ValidationException extends Error {
	public errors: Record<string, unknown>;

	constructor(message: string, errors: Record<string, unknown>) {
		super(message);
		this.name = "ValidationException";
		this.errors = errors;
	}
}

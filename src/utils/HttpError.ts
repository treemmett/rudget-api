export type Errors =
  | 'budget_not_found'
  | 'category_not_found'
  | 'group_not_found'
  | 'internal_error'
  | 'invalid_request'
  | 'invalid_token';

export default class HttpError extends Error {
  public error: Errors;
  public message: string;
  public statusCode: number;
  public description?: string;

  public constructor(details: {
    description?: string;
    error?: Errors;
    message?: string;
    statusCode?: number;
  }) {
    super(details.message);

    this.description = details.description;
    this.error = details.error || 'internal_error';
    this.message =
      details.message || 'Something went wrong. Please try again later.';
    this.statusCode = details.statusCode || 500;
  }
}

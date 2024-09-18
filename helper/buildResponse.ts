export function buildResponse(data: any, message: string, statusCode: number) {
  return {
    meta: { statusCode, message },
    data,
  };
}

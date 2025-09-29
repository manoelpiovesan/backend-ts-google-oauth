import {NextFunction, Request, Response} from "express";

export function responseWrapper(req: Request, res: Response, next: NextFunction) {
  const oldJson = res.json;
  res.json = function (data) {
    let responseData = data;

    if (data && data.message !== undefined && data.data !== undefined) {
      if (!Array.isArray(data.data)) {
        data.data = [data.data];
      }
      return oldJson.call(this, data);
    }

    if (!Array.isArray(data)) {
      responseData = data !== undefined && data !== null ? [data] : [];
    }

    return oldJson.call(this, {
      message: "success",
      data: responseData,
    });
  };

  next();
}
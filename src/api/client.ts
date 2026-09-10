const API_PREFIX =
  "/api/v1";


export class ApiError extends Error {
  status:
    number;

  data:
    unknown;


  constructor(
    status:
      number,
    data:
      unknown,
    message:
      string,
  ) {
    super(
      message,
    );

    this.name =
      "ApiError";

    this.status =
      status;

    this.data =
      data;
  }
}


interface RequestOptions
  extends RequestInit {
  json?:
    unknown;
}


export async function apiRequest<T>(
  path:
    string,
  options:
    RequestOptions =
      {},
): Promise<T> {
  const headers =
    new Headers(
      options.headers,
    );


  if (
    options.json !==
    undefined
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }


  const response =
    await fetch(
      `${API_PREFIX}${path}`,
      {
        ...options,

        headers,

        credentials:
          "include",

        body:
          options.json !==
          undefined
            ? JSON.stringify(
                options.json,
              )
            : options.body,
      },
    );


  const contentType =
    response.headers.get(
      "content-type",
    );


  let data:
    unknown =
      null;


  if (
    contentType?.includes(
      "application/json",
    )
  ) {
    data =
      await response.json();
  } else if (
    response.status !==
    204
  ) {
    data =
      await response.text();
  }


  if (
    !response.ok
  ) {
    throw new ApiError(
      response.status,
      data,
      getErrorMessage(
        data,
        response.statusText,
      ),
    );
  }


  return data as T;
}


function getErrorMessage(
  data:
    unknown,
  fallback:
    string,
) {
  if (
    data &&
    typeof data ===
      "object"
  ) {
    const object =
      data as Record<
        string,
        unknown
      >;

    if (
      typeof object.detail ===
      "string"
    ) {
      return object.detail;
    }

    if (
      typeof object.message ===
      "string"
    ) {
      return object.message;
    }
  }


  if (
    typeof data ===
    "string" &&
    data.trim()
  ) {
    return data;
  }


  return (
    fallback ||
    "Request failed."
  );
}

export interface ApiDownloadResult {
  blob: Blob;

  filename: string | null;
}


export async function apiDownload(
  path: string,
): Promise<ApiDownloadResult> {
  const response =
    await fetch(
      `${API_PREFIX}${path}`,
      {
        method:
          "GET",

        credentials:
          "include",
      },
    );


  if (
    !response.ok
  ) {
    const contentType =
      response.headers.get(
        "content-type",
      );

    let data:
      unknown =
      null;


    if (
      contentType?.includes(
        "application/json",
      )
    ) {
      data =
        await response.json();
    } else {
      data =
        await response.text();
    }


    throw new ApiError(
      response.status,
      data,
      getErrorMessage(
        data,
        response.statusText,
      ),
    );
  }


  const blob =
    await response.blob();


  return {
    blob,

    filename:
      getDownloadFilename(
        response.headers.get(
          "content-disposition",
        ),
      ),
  };
}


function getDownloadFilename(
  contentDisposition:
    string |
    null,
) {
  if (
    !contentDisposition
  ) {
    return null;
  }


  const utf8Match =
    contentDisposition.match(
      /filename\*=UTF-8''([^;]+)/i,
    );


  if (
    utf8Match?.[1]
  ) {
    try {
      return decodeURIComponent(
        utf8Match[1],
      );
    } catch {
      return utf8Match[1];
    }
  }


  const basicMatch =
    contentDisposition.match(
      /filename="?([^"]+)"?/i,
    );


  return basicMatch?.[1] ??
    null;
}
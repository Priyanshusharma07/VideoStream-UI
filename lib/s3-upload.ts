export type PresignedPutUploadOptions = {
  url: string;
  file: Blob;
  contentType: string;
  signal?: AbortSignal;
  onProgress?: (percent: number, loaded: number, total?: number) => void;
};

export type PresignedPutUploadResult = {
  status: number;
  etag?: string | null;
};

export function uploadToPresignedPutUrl(
  options: PresignedPutUploadOptions,
): Promise<PresignedPutUploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    let settled = false;
    const settle = (fn: () => void) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const cleanupAbortListener = (() => {
      const signal = options.signal;
      if (!signal) return () => {};
      if (signal.aborted) {
        settle(() =>
          reject(new DOMException("Upload aborted", "AbortError")),
        );
        return () => {};
      }

      const onAbort = () => {
        try {
          xhr.abort();
        } finally {
          settle(() =>
            reject(new DOMException("Upload aborted", "AbortError")),
          );
        }
      };
      signal.addEventListener("abort", onAbort, { once: true });
      return () => signal.removeEventListener("abort", onAbort);
    })();

    xhr.open("PUT", options.url, true);
    xhr.setRequestHeader("Content-Type", options.contentType);

    xhr.upload.onprogress = (evt) => {
      if (!options.onProgress) return;
      if (typeof evt.loaded !== "number") return;

      const total =
        typeof evt.total === "number" && evt.total > 0 ? evt.total : undefined;
      const percent = total
        ? Math.min(100, Math.round((evt.loaded / total) * 100))
        : 0;
      options.onProgress(percent, evt.loaded, total);
    };

    xhr.onerror = () => {
      cleanupAbortListener();
      settle(() =>
        reject(new Error("S3 upload failed (network error).")),
      );
    };

    xhr.onabort = () => {
      cleanupAbortListener();
      settle(() =>
        reject(new DOMException("Upload aborted", "AbortError")),
      );
    };

    xhr.onload = () => {
      cleanupAbortListener();
      const status = xhr.status;
      if (status >= 200 && status < 300) {
        resolve({
          status,
          etag: xhr.getResponseHeader("ETag"),
        });
      } else {
        settle(() =>
          reject(new Error(`S3 upload failed (HTTP ${status}).`)),
        );
      }
    };

    xhr.send(options.file);
  });
}


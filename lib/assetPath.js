const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function normalizeBasePath(value) {
  if (!value || value === "/") {
    return "";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

function encodePublicPath(path) {
  return path
    .split("/")
    .map((segment) => {
      if (!segment) {
        return segment;
      }

      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");
}

export const publicBasePath = normalizeBasePath(configuredBasePath);

export function assetPath(path) {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (publicBasePath && (normalizedPath === publicBasePath || normalizedPath.startsWith(`${publicBasePath}/`))) {
    return encodePublicPath(normalizedPath);
  }

  const encodedPath = encodePublicPath(normalizedPath);
  return `${publicBasePath}${encodedPath}`;
}

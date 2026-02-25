import type { SVGProps } from "react";

export function StreamHubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#FF6A00" />
      <path
        d="M10.2 7.8c0-1 .8-1.8 1.8-1.8h.3c1 0 1.8.8 1.8 1.8v8.4c0 1-.8 1.8-1.8 1.8H12c-1 0-1.8-.8-1.8-1.8V7.8Z"
        fill="white"
        opacity=".95"
      />
      <path
        d="M8 9.5c0-.9.7-1.6 1.6-1.6h.6v8.2h-.6c-.9 0-1.6-.7-1.6-1.6V9.5Z"
        fill="white"
        opacity=".6"
      />
    </svg>
  );
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2.3 12.2c-.1-.1-.1-.3 0-.4C4.3 8.6 7.9 6 12 6s7.7 2.6 9.7 5.8c.1.1.1.3 0 .4-2 3.2-5.6 5.8-9.7 5.8s-7.7-2.6-9.7-5.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10.6 10.7a2.5 2.5 0 0 0 2.7 2.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.2 6.9C4.6 8 3.2 9.6 2.3 11.2c-.1.2-.1.4 0 .6C4.3 15 7.9 18 12 18c1.5 0 2.9-.4 4.2-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.8 5.7c.7-.2 1.4-.3 2.2-.3 4.1 0 7.7 3 9.7 6.2.1.2.1.4 0 .6-.7 1.2-1.6 2.4-2.7 3.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21.2 12.3c0-.7-.1-1.3-.2-1.9H12v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9v2.3h3.1c1.8-1.6 2.9-4 2.9-6.9Z"
        fill="currentColor"
        opacity=".9"
      />
      <path
        d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3.1-2.3c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.5-4h-3.2V16c1.6 3.7 5.2 6 8.7 6Z"
        fill="currentColor"
        opacity=".65"
      />
      <path
        d="M6.5 13.9a6.5 6.5 0 0 1 0-3.8V7.9H3.3a10 10 0 0 0 0 8.2l3.2-2.2Z"
        fill="currentColor"
        opacity=".55"
      />
      <path
        d="M12 5.8c1.4 0 2.7.5 3.7 1.4l2.8-2.8A9.7 9.7 0 0 0 12 2C8.5 2 5 4.3 3.3 7.9l3.2 2.2c.8-2.3 3-4.3 5.5-4.3Z"
        fill="currentColor"
        opacity=".75"
      />
    </svg>
  );
}

export function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16.7 12.7c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.8-2.7-.8-1.4 0-2.8.8-3.5 2-1.5 2.5-.4 6.2 1 8.2.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.2 1.2-2.3 1.2-2.3s-2.1-.8-2.1-3.3Z"
        fill="currentColor"
      />
      <path
        d="M14.8 6.3c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.3-.6.7-1 1.7-.9 2.7 1 .1 2-.6 2.6-1.3Z"
        fill="currentColor"
        opacity=".75"
      />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13.8 21v-7h2.3l.4-2.7h-2.7V9.6c0-.8.2-1.3 1.4-1.3h1.5V5.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v1.7H8.1V14h2.4v7h3.3Z"
        fill="currentColor"
      />
    </svg>
  );
}


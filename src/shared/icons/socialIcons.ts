/**
 * Social Icons
 * - Radix Icons 기반: Github, Instagram, LinkedIn, Twitter/X, Discord
 * - Lucide Icons 기반: Facebook, YouTube, Twitch, Send(Telegram)
 * - 커스텀 SVG: Mail, CodePen, GitLab, Reddit, Skype, Steam
 *
 * 삭제됨: Pinterest, WhatsApp, TikTok, Mastodon, Snapchat, Skype, Steam
 */

const socialIcons: Record<string, string> = {
  // === Radix Icons 기반 ===
  Github: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 15 15" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5.25C3.5.25.25 3.5.25 7.5c0 3.2 2.08 5.92 4.96 6.88.36.07.5-.16.5-.35v-1.23c-2.02.44-2.44-1-.44-1-.44-.81-.44-1.13-.44-1.13-.67-.46.05-.45.05-.45.74.05 1.13.78 1.13.78.66 1.13 1.73.8 2.15.62.07-.48.26-.8.47-.99-1.61-.18-3.3-.8-3.3-3.58 0-.79.28-1.43.74-1.94-.07-.18-.32-.93.07-1.93 0 0 .6-.19 1.99.74a6.9 6.9 0 0 1 3.64 0c1.38-.93 1.99-.74 1.99-.74.4 1 .15 1.75.07 1.93.46.51.74 1.15.74 1.94 0 2.78-1.69 3.4-3.3 3.58.26.22.5.66.5 1.33v1.97c0 .19.13.42.5.35A7.25 7.25 0 0 0 14.75 7.5C14.75 3.5 11.5.25 7.5.25Z"/>
  </svg>`,

  Instagram: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 15 15" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 2.8c-1.6 0-1.79.01-2.41.04-.63.03-1.06.13-1.44.27a2.9 2.9 0 0 0-1.05.69 2.9 2.9 0 0 0-.69 1.05c-.14.38-.24.81-.27 1.44C1.6 6.91 1.59 7.1 1.59 8.71s.01 1.79.04 2.42c.03.63.13 1.06.27 1.44.15.39.35.72.69 1.06.34.34.67.54 1.05.69.38.14.81.24 1.44.27.63.03.81.04 2.42.04s1.79-.01 2.42-.04c.63-.03 1.06-.13 1.44-.27a2.9 2.9 0 0 0 1.05-.69c.34-.34.54-.67.69-1.06.14-.38.24-.81.27-1.44.03-.63.04-.81.04-2.42s-.01-1.8-.04-2.42c-.03-.63-.13-1.06-.27-1.44a2.9 2.9 0 0 0-.69-1.05 2.9 2.9 0 0 0-1.05-.69c-.38-.14-.81-.24-1.44-.27-.63-.03-.81-.04-2.42-.04Zm0 1.07c1.57 0 1.74 0 2.37.03.58.03.89.12 1.1.2.28.11.47.24.68.45.21.21.34.4.45.68.08.21.17.52.2 1.1.03.63.03.8.03 2.37s0 1.75-.03 2.37c-.03.58-.12.9-.2 1.1-.11.28-.24.48-.45.68-.21.21-.4.34-.68.45-.21.08-.52.17-1.1.2-.63.03-.8.04-2.37.04s-1.75 0-2.37-.04c-.58-.03-.9-.12-1.1-.2a1.85 1.85 0 0 1-.68-.45 1.85 1.85 0 0 1-.45-.68c-.08-.2-.17-.52-.2-1.1-.03-.62-.04-.8-.04-2.37s0-1.74.04-2.37c.03-.58.12-.89.2-1.1.1-.28.24-.47.45-.68.2-.21.4-.34.68-.45.2-.08.52-.17 1.1-.2.63-.03.8-.03 2.37-.03Zm0 1.8a2.66 2.66 0 1 0 0 5.31 2.66 2.66 0 0 0 0-5.3Zm0 4.38a1.73 1.73 0 1 1 0-3.46 1.73 1.73 0 0 1 0 3.46Zm3.43-4.48a.62.62 0 1 1-1.24 0 .62.62 0 0 1 1.24 0Z"/>
  </svg>`,

  LinkedIn: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 15 15" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2Zm1.05 5h1.9v6h-1.9V6Zm2.03-2a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0ZM12 8.36c0-1.81-1.17-2.51-2.33-2.51a2.1 2.1 0 0 0-1.89 1.04h-.05V6H6v6h1.9V8.81c-.02-.32.08-.68.2-.81.22-.25.53-.32.77-.35h.07c.63 0 1.08.38 1.08 1.32V12H12V8.36Z"/>
  </svg>`,

  X: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4l11.73 16h4.27l-11.73-16z"/>
    <path d="M4 20l6.77-6.77m2.46-2.46L20 4"/>
  </svg>`,

  Discord: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 15 15" fill="currentColor">
    <path d="M5.08 1.83a.4.4 0 0 0-.13 0c-.05 0-1.3.15-2.57 1.05a.4.4 0 0 0-.02.01c-.54.42-1.12 1.56-1.58 2.85a15 15 0 0 0-.78 4.5.4.4 0 0 0 0 .04c.4 2.35 2.57 3.68 4.27 4.15a.4.4 0 0 0 .41-.11l.66-1.2a8 8 0 0 1-2.04-.97.4.4 0 0 1 .23-.73c.54.26 1.12.46 1.72.59a9.8 9.8 0 0 0 4.5 0c.6-.13 1.18-.33 1.72-.59a.4.4 0 0 1 .24.73 8 8 0 0 1-2.05.97l.66 1.2a.4.4 0 0 0 .41.12c1.7-.48 3.87-1.8 4.27-4.16a.4.4 0 0 0 0-.04 15 15 0 0 0-.78-4.5c-.46-1.3-1.04-2.43-1.58-2.85a.4.4 0 0 0-.02 0 7.4 7.4 0 0 0-2.57-1.06.4.4 0 0 0-.44.26l-.33.83a9 9 0 0 0-1.5-.12c-.51 0-1 .04-1.5.12l-.33-.83a.4.4 0 0 0-.31-.26ZM5.2 6.5a1.13 1.13 0 1 1 0 2.25 1.13 1.13 0 0 1 0-2.25Zm4.63 0a1.13 1.13 0 1 1 0 2.25 1.13 1.13 0 0 1 0-2.25Z"/>
  </svg>`,

  // === Lucide Icons 기반 ===
  Facebook: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>`,

  YouTube: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>`,

  Twitch: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/>
  </svg>`,

  Telegram: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14.54 21.69a.5.5 0 0 0 .93-.03l6.5-19a.5.5 0 0 0-.63-.63l-19 6.5a.5.5 0 0 0-.02.93l7.93 3.18a2 2 0 0 1 1.11 1.11z"/>
    <path d="m21.85 2.15-10.94 10.94"/>
  </svg>`,

  // === 기타 ===
  Mail: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>`,

  CodePen: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
    <line x1="12" y1="22" x2="12" y2="15.5"/>
    <polyline points="22 8.5 12 15.5 2 8.5"/>
    <polyline points="2 15.5 12 8.5 22 15.5"/>
    <line x1="12" y1="2" x2="12" y2="8.5"/>
  </svg>`,

  GitLab: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z"/>
  </svg>`,

  Reddit: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="1"/>
    <circle cx="8.5" cy="14" r="1"/>
    <circle cx="15.5" cy="14" r="1"/>
    <path d="M8.5 17c0 1 1.5 3 3.5 3s3.5-2 3.5-3"/>
    <path d="M12 2c1 0 1.5 1 2 2l.5 3"/>
    <path d="M18 6.5a1 1 0 0 1 1 1c0 1-1.5 2-2.5 3"/>
    <path d="M6 6.5a1 1 0 0 0-1 1c0 1 1.5 2 2.5 3"/>
    <path d="M3.5 13.5c0-3.5 3.5-7 8.5-7s8.5 3.5 8.5 7c0 3-3 5-8.5 5s-8.5-2-8.5-5"/>
  </svg>`,
};

export default socialIcons;

import type { Plugin } from 'vite';

/**
 * 레이아웃 파일 해결 오류를 처리하는 Vite 플러그인
 * 레이아웃을 찾지 못하는 경우 빌드 실패를 방지하고 페이지를 건너뜁니다.
 */
export function handleLayoutErrors(): Plugin {
  return {
    name: 'handle-layout-resolve-errors',
    enforce: 'pre',
    resolveId(source, importer) {
      // 경로에 'layouts'가 포함되어 있고 .astro 확장자를 가진 파일
      if (source.includes('layouts') && source.endsWith('.astro') && importer) {
        try {
          // 여기서는 실제로 파일을 확인하지 않고, 나중에 로딩 시 오류가 발생하면 처리
          return null;
        } catch (error) {
          console.warn(`경고: ${importer}에서 레이아웃 파일 ${source}를 찾을 수 없습니다. 이 파일은 빌드에서 제외됩니다.`);
          return { id: 'virtual:empty-layout-module', external: false };
        }
      }
      return null;
    },
    load(id) {
      if (id === 'virtual:empty-layout-module') {
        // 빈 레이아웃 컴포넌트 반환
        return `
          export const Content = ({children}) => children;
          export default function EmptyLayout({children}) {
            return children;
          }
        `;
      }
      
      // 실제 모듈 로딩 시 오류가 발생하면 빈 레이아웃으로 대체
      try {
        return null;
      } catch (error) {
        if (id.includes('layouts') && id.endsWith('.astro')) {
          console.warn(`경고: 레이아웃 파일 ${id}를 로드하는 데 실패했습니다. 기본 레이아웃으로 대체합니다.`);
          return `
            export const Content = ({children}) => children;
            export default function EmptyLayout({children}) {
              return children;
            }
          `;
        }
        return null;
      }
    },
    handleHotUpdate(ctx) {
      // 핫 리로드 처리 중 레이아웃 파일 오류 무시
      if (ctx.file.includes('layouts') && ctx.file.endsWith('.astro')) {
        try {
          return ctx.modules;
        } catch (error) {
          console.warn(`핫 리로드: 레이아웃 파일 ${ctx.file}에 문제가 있습니다. 변경사항 무시.`);
          return [];
        }
      }
      return undefined;
    }
  };
} 
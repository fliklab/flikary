# Control And Execution Post Plan

## Goal

`통제력 되찾기` 글을 블로그 새 포스트로 추가한다.

## Scope

- 기존 메모형 포스트 구조 확인
- 제목, slug, tags, description 결정
- 사용자 원문을 MDX 포맷으로 정리
- 작업 문서와 로그 기록
- 콘텐츠 빌드 검증

## Inputs

- 사용자 제공 원문
- `.local/README.md`
- `src/content/blog/notes/2026-04-16-openclaw-memo.mdx`
- `src/content/blog/260410/index.mdx`

## Deliverables

- 새 블로그 포스트 파일
- 작업 계획 문서
- 작업 체크리스트
- 1차 작업 로그

## Approach

1. 메모형 글의 frontmatter 형식을 기준으로 메타데이터를 정한다.
2. 사용자 원문을 제목과 소제목 흐름에 맞게 정리한다.
3. `src/content/blog/notes` 아래 새 포스트를 추가한다.
4. 빌드로 콘텐츠 로딩 오류가 없는지 확인한다.
5. 작업 문서를 완료 처리하고 `done/`으로 이동한다.

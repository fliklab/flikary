# 프라이빗 페이지 통합 방법

이 프로젝트는 외부의 Private Repository에서 콘텐츠를 가져와 임의의 URL로 접근 가능한 페이지를 생성합니다.

## 구성 파일 형식

프라이빗 레포지토리에는 다음과 같은 구조의 `private-pages.json` 파일이 필요합니다:

```json
[
  {
    "externalPath": "abc123", 
    "sourcePath": "resume-secret.md",
    "expiryDate": "2025-12-31"
  },
  {
    "externalPath": "xyz789",
    "sourcePath": "interview-project.md",
    "expiryDate": "2024-10-15"
  }
]
```

각 항목의 의미:
- `externalPath`: 생성될 페이지가 외부에 노출될 URL 경로
- `sourcePath`: 프라이빗 레포지토리 내의 소스 파일 경로
- `expiryDate`: 페이지 만료일 (ISO 형식, YYYY-MM-DD)

## 환경 변수 설정

다음 환경 변수를 설정해야 합니다:

```
PRIVATE_REPO_URL=https://github.com/your-username/private-repo.git
PRIVATE_REPO_TOKEN=ghp_your_github_token
PRIVATE_CONTENT_PATH=content-dir (선택사항, 기본값: resume-content)
PRIVATE_CONFIG_FILE=config.json (선택사항, 기본값: private-pages.json)
```

## 소스 파일

소스 파일은 일반적인 Astro 마크다운 페이지와 동일한 형식으로 작성하면 됩니다:

```markdown
---
layout: ../../layouts/Resume/ResumeLayout.astro
title: ...
---

내용
```

## 빌드 과정

빌드 시 다음과 같은 과정이 자동으로 실행됩니다:

1. 프라이빗 레포지토리 클론
2. 관리 파일(private-pages.json) 읽기
3. 만료되지 않은 페이지만 필터링
4. 각 페이지를 `src/pages/p/{externalPath}.md` 경로로 생성
5. 빌드 시 이 파일들이 정적 페이지로 변환됨

생성된 페이지는 다음 URL로 접근할 수 있습니다.

```
https://your-site.com/p/{externalPath}
```
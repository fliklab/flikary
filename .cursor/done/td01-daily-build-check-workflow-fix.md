# Daily Build Check Workflow 수정

## 🔍 문제 분석

### 실패 원인
- GitHub Actions에서 `npm ci` 명령어 실행 시 lock file을 찾을 수 없음
- 프로젝트는 `pnpm-lock.yaml`을 사용하지만 워크플로우는 `npm`으로 설정됨
- 에러 메시지: "Dependencies lock file is not found in /home/runner/work/flikary/flikary. Supported file patterns: package-lock.json, npm-shrinkwrap.json, yarn.lock"

### 워크플로우 기능
- **목적**: 매일 오전 3시(UTC)에 만료된 프라이빗 콘텐츠 확인
- **동작**: 만료된 콘텐츠가 있으면 Vercel 재배포 트리거
- **스크립트**: `scripts/check-expiring-content.cjs` 실행

## 🛠️ 수정 내용

### 1. Node.js 설정 변경
```yaml
# Before
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "18"
    cache: "npm"

# After  
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "18"
    cache: "pnpm"
```

### 2. pnpm 설치 단계 추가
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8
```

### 3. 의존성 설치 명령어 변경
```yaml
# Before
- name: Install dependencies
  run: npm ci

# After
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

### 4. 스크립트 실행 명령어 변경
```yaml
# Before
- name: Check for expiring content
  run: npm run check-expiring-content

# After
- name: Check for expiring content
  run: pnpm run check-expiring-content
```

## 📋 워크플로우 구조

### 실행 조건
- **스케줄**: 매일 오전 3시(UTC) = 한국 시간 오전 12시
- **수동 실행**: `workflow_dispatch` 이벤트로 가능

### 작업 단계
1. **Checkout repository**: 코드 체크아웃
2. **Setup Node.js**: Node.js 18 설정
3. **Install pnpm**: pnpm 패키지 매니저 설치
4. **Install dependencies**: 의존성 설치
5. **Create .env file**: 환경 변수 파일 생성
6. **Check for expiring content**: 만료된 콘텐츠 확인
7. **Trigger Vercel deployment**: 필요시 재배포 트리거

## 🔧 관련 스크립트

### check-expiring-content.cjs
- **위치**: `scripts/check-expiring-content.cjs`
- **기능**: 
  - 프라이빗 레포에서 콘텐츠 가져오기
  - 만료일 확인
  - GitHub Actions 출력 설정
  - 임시 디렉토리 정리

### 환경 변수
- `PRIVATE_REPO_URL`: 프라이빗 레포 URL
- `PRIVATE_REPO_TOKEN`: 접근 토큰
- `PRIVATE_CONTENT_PATH`: 콘텐츠 경로
- `PRIVATE_CONFIG_FILE`: 설정 파일명
- `VERCEL_DEPLOY_HOOK_URL`: Vercel 배포 훅 URL

## ✅ 수정 완료

### 변경된 파일
- `.github/workflows/daily-build-check.yml`

### 확인된 다른 워크플로우
- ✅ `performance.yml`: 이미 pnpm 사용 중
- ✅ `optimize-images.yml`: 이미 pnpm 사용 중

## 🚀 다음 단계

1. **워크플로우 테스트**: 수동으로 워크플로우 실행하여 정상 동작 확인
2. **모니터링**: 다음 스케줄 실행 시 정상 동작 확인
3. **로그 확인**: 만료된 콘텐츠 확인 및 Vercel 배포 트리거 정상 동작 확인

---

**수정일**: 2025-01-17  
**수정자**: AI Assistant  
**상태**: 완료 ✅ 
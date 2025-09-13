## BlurHash 비율 즉시 반영

- BlogImageWrapper가 프로덕션 빌드 경로(/_astro/...)에서도 BlurHash와 크기 매칭하도록 개선
- 파일명에 삽입되는 빌드 해시를 제거(normalize)하여 원본 파일명으로 매칭
- CSS aspect-ratio 활용으로 최초 렌더부터 원본 비율 보존, padding-bottom은 폴백
- 린트 오류(불필요한 이스케이프) 제거

### 변경 파일
- src/components/BlogImageWrapper.astro

### 테스트
- dev/prod 모두에서 1024x1024 등 정방 비율이 즉시 반영되는지 확인
- 다양한 확장자(jpg/jpeg/png/webp)와 slug 하위 경로 매칭 확인

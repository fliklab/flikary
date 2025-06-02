---
author: Flik
pubDatetime: 2025-06-02T22:55:43.000+09:00
modDatetime: 2025-06-02T22:55:43.000+09:00
title: Git Rebase 중 발생한 오류를 Reflog를 통해 복구하기
slug: git-reflog-250602
featured: false
draft: false
tags:
  - Git
  - Git Rebase
  - Git Reflog
  - 버전관리
  - 트러블슈팅
description: Git rebase 작업 중 발생한 실수로 커밋이 사라졌을 때, Git reflog를 활용해 복구했던 경험을 다루며, 추가로 Git Reflog에 대해 알게된 점에 대해 간단히 정리합니다.
---

## 인트로

최근에 작업하면서 Git rebase를 하다가 **예상치 못한 오류**를 만났다.
"어, 변경사항이 사라졌는데?" 하는 순간의 그 당황스러움은 rebase를 처음 사용하는 사람이라면 겪어보지 않았을까

**Git rebase 중의 실수**, 그리고 이를 **reflog를 통해 복구**했던 과정을 남긴다.
사실 글을 쓰다보니 모든 원인은 rebase와 reflog에 대한 기본적인 경험조차 없었기 때문이지만 기록 겸 남긴다.

---

## 상황: 나는 왜 rebase를 했는가

최근 2개의 커밋 중 **가장 최근 커밋은 그대로 두고**, 그 이전 커밋(직직전)에 새로 작성한 코드(스테이징된 변경사항)를 **합치기 위해** `git rebase -i HEAD~2`를 진행후 pick을 edit으로 수정하려고 했으나,
이후 뜨는 2개의 커밋 리스트가 생각한 순서와 반대로 되어있어서, 직전 커밋을 선택함.
그리고 변경사항을 후가 후 continue 했는데... 리베이스가 종료되었다.
이후 뭔가 잘못 된 것을 깨달았다. (사실 이 상태에서 직직전 커밋을 했다고 생각했고 직전 커밋이 사라졌다고 잘못 인지함)
이후 reflog를 통해 복구 할 수 있었다.

---

## Git Reflog로 복구하기

Git을 사용하면서, force push, reset, rebase, 병합 등의 기능을 사용하다보면 의도치 않게 브랜치가 망가지는 경우가 있다.
다행히 Git에는 \*\*`reflog`\*\*라는 기능이 있다.

`reflog`는 브랜치의 **모든 이동 기록**을 담고 있어, 과거 상태로 돌아갈 수 있는 강력한 복구 도구이다.

```bash
git reflog
```

출력 결과를 보니, 다행히도 rebase 시작 전의 상태가 남아있었다.

```bash
# 커밋 기록은 이해를 돕기 위한 가짜 데이터입니다
1234567 (HEAD -> main) HEAD@{0}: commit: 파일 수정
abcdefg HEAD@{1}: rebase -i (finish): returning to refs/heads/main
9876543 HEAD@{2}: rebase (pick): feat: 기능 추가
7654321 HEAD@{3}: commit (amend): README 업데이트
```

`git reset` 을 통해 복구 할수 있었다.

```bash
git reset --hard HEAD@{3}
```

---

## Git Reflog 정리

올리는 김에 Reflog에 대해 좀 더 자세히 알아보았다.

### 특징

- 내 로컬 저장소에서 HEAD(=현재 작업 위치)가 이동한 이력을 기록한 로그
- 브랜치 이동, 커밋, 머지, 리베이스, 리셋 등 모든 HEAD의 움직임이 남아 있음
- 로컬 전용 (원격 저장소에선 기록되지 않음)
- 브랜치 삭제/리셋/리베이스 등으로 사라진 커밋도 reflog에 남아 있으면 복구 가능

### 예시로 알아보기

```bash
1234567 (HEAD -> main) HEAD@{0}: commit: 파일 수정
abcdefg HEAD@{1}: rebase -i (finish): returning to refs/heads/main
9876543 HEAD@{2}: rebase (pick): feat: 기능 추가
7654321 HEAD@{3}: commit (amend): README 업데이트
```

- `HEAD@{N}`는 HEAD 참조의 몇 번째 이전 상태인지를 나타냄. `HEAD@{0}`은 현재 상태이며 숫자가 커질수록 과거 기록.
- commit, rebase, merge, checkout, pull, clone, reset, cherry-pick 과 같은 브랜치 관련 작업이 기록됨.
- rebase (pick): ~~~ → rebase 중 pick 단계에서 선택한 커밋
- rebase (finish): returning to refs/heads/main → rebase 종료하고 원래 브랜치(main)로 돌아감
- `(HEAD -> main)` HEAD가 main 브랜치의 최신 커밋을 보고 있다는 뜻.
- reflog로 로컬에 있는 기록은 복구 할 수 있지만, 원격 브랜치에까지 저장되는것은 아님.

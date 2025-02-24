---
author: Flik
pubDatetime: 2021-08-16T22:47:16+09:00
title: "Personal Access Token을 사용하여 깃허브 인증하기"
slug: github-pat
featured: true
draft: false
tags:
  - Github
description: 맥에서 Github 인증을 위해 Personal Access Token을 발급받고 osx-keycahin에 추가하는 방법을 설명합니다.
---

## 문제

어느날부터 깃허브(github)에서 private repository를 사용하려고 하니 이런 에러가 발생한다.

```bash
$ git clone https://github.com/user-name/repository-name
Cloning into 'play-with-data'...
remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
remote: Please see https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/ for more information.
fatal: unable to access 'https://github.com/user-name/repository-name': The requested URL returned error: 403
```

password authentication을 더 이상 지원하지 않기 때문에 personal access token을 사용하라는 내용이다.

그런데 안내된 링크로 들어가보고 구글링을 해보았으나, personal access token을 사용해서 인증하는 방법을 알 수 없어서 헤메다가 찾은 해결방법을 간단하게 소개한다. Mac 기준이라 윈도우에서는 해당되지 않는다.

---

## 요약

이 글은 맥에서 Personal Access Token을 사용하여 깃허브 인증을 하는 절차를 설명하는 글이다. 절차를 요약하면 다음과 같다.

1. Personal Access Token 발급.

2. git의 credential.helper로 키체인을 사용하도록 설정

3. 키체인에 personal access token을사용하는 항목을 추가

## 진행방법

### 1. Personal Access Token 발급.

personal access token은 github 웹사이트에서 발급받을 수 있다.
이 것에 대해 다룬 문서와 블로그가 많으므로 아래 문서의 링크로 대체한다.

[Creating a personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token "Creating a personal access token")

토큰을 발급받으면 안전한 장소에 토큰을 반드시 저장해야 한다.

### 2. credential helper로 키체인을 사용하도록 설정

credential.helper는 git의 계정 인증 정보를 매번 다시 입력하지 않도록 인증 정보를 관리하는 도구이다.
osxkeychain 모드를 사용하면 Mac에서 제공하는 Keychain 시스템을 사용할 수 있다.

터미널에서 아래와 같이 입력한다.

```
$ git config --global credential.helper osxkeychain
```

잘 되었다면 다음과 같이 입력했을때, osxkeychain 이 출력될 것이다.

```
$ git config --global credential.helper
```

### 3-1. 키체인에 PAT(personal access token)을 사용하는 항목 추가

**방법1.**
가장 간단한 방법은 본인의 github계정으로 접근권한이 필요한 private repository를 clone해준다.
그러면, username과 password를 입력하도록 진행된다.

여기서 만약, Support for password authentication was removed ... 와 같은 메시지가 뜬다면
3-2와 같이 이미 저장된 목록에서 비밀번호를 PAT로 대체해줘야 한다.

**방법2.**
키체인에 추가하는 방법은 몇가지가 있는데 터미널에서 아래와같이 실행해준다.

```
$ git credential-osxkeychain store
```

이어서 다음 내용을 본인의 username과 personal acess token에 맞게 수정해서 입력해준다.
`[USERNAME]`, `[PERSONAL_ACCESS_TOKEN]` 부분은 본인의 github계정과 발급한 토큰으로 입력해야 한다.
한줄씩 터미널에 입력한 다음 마지막에 엔터를 두번 치면 입력이 완료된다.

```
host=github.com
protocol=https
username=[USERNAME]
password=[PERSONAL_ACCESS_TOKEN]
```

### 3-2.keychain access 목록 확인 및 수정

기존에 credential-osxkeychain을 사용한적이 있다면 이미 추가되어 있을 수가 있어서 새로운 계정을 입력받도록 나타나지 않을 수 있다.
이런 경우에는 기존에 저장된 키체인 항목에서 비밀번호를 PAT로 직접 바꿔주어야 한다.

Keychain Access(키체인 접근)을 실행한다.

![(스크린샷) 키체인접근 실행](@assets/images/hydrate/1.png)

'github.com'을 검색하면 목록에 여러 항목이 나타난다.

![(스크린샷) Keychain Access에서 github.com 검색](@assets/images/hydrate/2.png)

![(스크린샷) Keychain Access](@assets/images/hydrate/3.png)

목록에서, 이름이 github.com인 항목을 더블클릭해서 "접근 제어"를 선택한다.
접근 허용 리스트에 git-credential-osxkeychain이 있는 항목이 있는지 확인한다.

없다면, 다른 키체인 항목을 다시 선택에서, 있는 항목을 찾아야 한다.

![접근 제어에서 `git-credential-osxkeychain`가 있는지 확인](@assets/images/hydrate/4.png)

다시 "속성" 탭으로 되돌아가서 비밀번호를 입력하는 칸에 Personal AccessToken을 입력해주고 변경사항을 저장한다.

![(스크린샷) Keychain Access에서 Personal AccessToken 입력](@assets/images/hydrate/5.png)

## 확인

마지막으로 인증이 잘 되었는지 확인하기 위해 권한이 필요한 작업을 수행해본다. 진행 과정을 모두 마친 후 다시 github의 인증이 필요한 작업(private repo를 clone하거나, commit을 push하는 작업 등)을 수행해보면 같은 오류가 발생하지 않고 잘 진행되는 것을 확인할 수 있게 된다.

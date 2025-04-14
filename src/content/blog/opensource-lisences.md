---
author: Flik
pubDatetime: 2025-04-14T03:00:01+09:00
modDatetime: 2025-04-14T03:00:01+09:00
title: 오픈소스 라이센스 종류와 적용 방법
slug: opensource-lisences
featured: false
draft: false
tags:
  - 라이센스
  - 오픈소스
description: 오픈소스 라이센스의 종류와 특징, 그리고 프로젝트에 적용하는 방법에 대해 정리하는 글입니다. MIT. Apache License 2.0, GPL, MPL 등 주요 라이센스를 다룹니다.
---

오픈소스 개발을 하려다 보면, 코드만 잘 작성하고 라이센스에 대해서는 무관심한 경우가 많다. 나도 사실 그래왔다.
오픈소스 라이센스는 개발자가 자신의 코드를 어떻게 공유하고 사용할 수 있는지에 대한 권리를 표기하는데, 이 부분이 빠져있다면 직접 작성한 코드/소프트웨어에 대한 권리를 보호받지 못할 뿐만 아니라 나도 모르게 라이센스를 침해하는 일이 생길수도 있다.
또 포트폴리오를 위한 프로젝트라면, 프로젝트의 완성도 면에서 아쉽게 보이는 경우도 있다.

이 글을 통해 오픈소스 라이센스의 종류, LICENSE 파일, 그리고 copyright 표기법에 대해 정리해 보려고 한다.

## 오픈소스 라이센스의 종류

오픈소스에서 자주 사용되는 라이센스는 몇가지가 있다.

각 라이센스마다 소프트웨어의 상업적 사용, 수정, 배포에 관한 허용 범위를 간단히 비교해보면 다음과 같다.

| 라이선스            | 상업적 사용 | 수정 및 재배포 | 조건 & 특징                         |
| ------------------- | ----------- | -------------- | ----------------------------------- |
| **MIT**             | ✅ 가능     | ✅ 가능        | 라이선스 및 저작권 고지 포함        |
| **Apache 2.0**      | ✅ 가능     | ✅ 가능        | 저작권 + 특허 조항 명시             |
| **GPL v3**          | ✅ 가능     | ✅ 가능        | 수정된 소스도 반드시 GPL로 배포     |
| **BSD 3-Clause**    | ✅ 가능     | ✅ 가능        | 저작권 고지, 이름 사용 금지 조항 등 |
| **MPL 2.0**         | ✅ 가능     | ✅ 가능        | 수정한 파일만 오픈소스로 공개       |
| **Unlicense / CC0** | ✅ 가능     | ✅ 가능        | 조건 없음 (퍼블릭 도메인)           |

**MIT License**는 굉장히 자유롭게 쓸 수 있는 라이센스이다. 거의 모든 목적으로 소프트웨어를 사용할 수 있으며, 소스 코드를 공개할 의무도 없다.

**Apache License 2.0**: MIT와 유사하게 사용제한이 별로 없다. 하지만 특허 라이센스를 포함하는 차이가 있다.

**GPL(GNU General Public License)** 은 상업적 이용을 허용하기는 하지만. GPL 라이센스의 소스코드를 사용하면 GPL로 배포해야 하며 소스 코드 공개를 해야한다.

### MIT License

MIT 라이선스는 가장 간단하고 관대한 라이선스이다.

- 코드를 복사, 수정, 배포, 상업적 사용 모두 가능.
- 사용시 라이선스를 포함하기만 하면 됨 (LICENSE 파일, 또는 소스코드 상단에 주석으로).
- 책임 없음, 즉 코드를 사용하다 문제가 생겨도 원 저자는 책임지지 않음.
- 특허 보호 조항은 없음. (Apache와 다른 점)

### Apache License 2.0

Apache License 2.0은 MIT보다 조금 더 복잡하지만 법적 보호가 강한 라이선스다.

✅ 주요 특징

- MIT처럼 복사, 수정, 배포, 상업적 사용 가능.
- 라이선스 문구 포함 필수
- 특허 조항이 포함
  - 특허 분쟁(소송)을 일으키면 자동으로 사용 권한이 취소됨.
- 기여자 명시 조항: 기여자들을 명확히 드러내야 함
- 파일 수정 시, 변경 내용 표시 필요

특허 조항은 오픈소스 개발자나 기여자를 법적으로 보호하기 위한 조항으로, 사용자가 기여자를 소송으로 공격하는 걸 막기 위한 장치라고 할 수 있다.

### GPL (GNU General Public License)

코드를 사용해서 새로운 프로그램을 만들었다면, 그 프로그램도 반드시 GPL로 공개해야 하는 것이 핵심이다.
이것을 Copy-Right의 반대라고 해서 Copy-Left 정신(카피레프트 정신)이라고 부른다.

GPL 라이센스가 걸린 코드를 조금이라도 포함하면, 전체가 GPL의 영향을 받아 GPL로 공개해야 한다.

GPL 라이센스를 조금이라도 사용하면 소스를 모두 공개해야 하기 때문에 사용하기가 꺼져질 수 있다. 반면, **MPL(Mozilla Public License)** 은 라이센스가 있는 파일만 오픈하면 되고, 나머지는 비공개여도 괜찮다.

### 어떤 걸 써야 할지 고민된다면?

상황별로 다음과 같이 선택할 수 있다.

1. 누구나 자유롭게 가져다 쓰고, 마음대로 수정하고, 상업적으로 써도 괜찮다면?<br/>
   👉 **MIT License** 또는 특허 보호가 필요하다면 **Apache 2.0**

2. 내 코드를 쓴 사람이 꼭 오픈소스로 공유하기를 바란다면?<br/>
   👉 **GPL**. 단, 기업/상업 프로젝트에서 사용을 꺼려할 수도 있음.

3. 일부만 공개하는 것을 허용한다면?<br/>
   👉 **MPL**. MPL 라이센스가 포함된 파일은 공개하지만, 나머지는 자유롭게 비공개도 가능.

## 라이센스를 명시하는 요령

LICENSE를 명시하는 몇 가지 요령은 다음과 같다.

- `NOTICE`나 `third-party-licenses.txt`에 프로젝트에 사용된 모든 외부 라이브러리와 해당 라이센스를 명시.
- `LICENSE`파일에는 라이센스 전문을 포함하고 프로젝트의 제목과 저작권 보유자의 이름을 함께 삽입.
- 필요한 경우 라이센스 조항에 따라 특허나 책임의 제한 사항을 추가.

### LICENSE 파일

소프트웨어 프로젝트의 루트 디렉토리에 위치한 LICENSE 파일은 `LICENSE` 또는`LISENCE.txt`로 저장하며, 해당 프로젝트에 적용되는 라이센스에 대한 파일이다.

닉네임을 써도 되지만, 실명으로 쓰는게 저작권 보호에는 더 유리하다고 한다.

```markdown
MIT License

Copyright (c) 2025 Flik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
(중략)
```

필수는 아니지만 `README.md`에도 간단히 라이센스를 요약해주면 좋다.

```markdown
## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
```

### 외부 라이브러리의 라이센스

외부 라이브러리에 대한 라이센스는 보통 `NOTICE` 또는 `third-party-licenses.txt`에 표기한다.

```markdown
This project uses the following third-party libraries:

1. React (MIT License)
   https://github.com/facebook/react

2. date-fns (MIT License)
   https://github.com/date-fns/date-fns

3. lodash (MIT License)
   https://lodash.com

Each library retains its own license and copyright.
```

## Copyright 문구 표기법

보통 소스코드의 상단이나 웹사이트 하단 footer에 표시되는 문구인데 표기법은 다음과 같다.

```plaintext
Copyright © [연도] [저작자 이름]
```

사이트 하단에 `Copyright © 2025 Flik. All rights reserved.` 처럼 쓰이기도 하는데 이것은 모든 권리를 보유한다는 뜻으로, 특별히 명시된 조건 되의 권한은 타인이 사용할 수 없다는 것을 말한다.

©가 빠지거나 연도가 빠지나, `©Flik`, `© 2025 Flik`처럼 축약되어 쓰이기도 하는데 명확하게 써주는게 나중을 위해서 좋다.

## 결론

오픈소스 라이센스는 간과하기 쉽지만 중요하다. 적절한 라이센스를 선택할 줄 몰라서 라이센스를 종종 빠뜨려왔는데, 프로젝트에 적합한 라이센스를 선택하고 표기해보자. 올바른 라이센스 표기에 대한 노력은 오픈소스 커뮤니티의 일원으로서의 책임이면서, 더 나은 협업과 발전에 기여하는 것이다.

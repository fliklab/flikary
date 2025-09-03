---
author: Flik
pubDatetime: 2024-11-14T19:06:16+09:00
title: "Github Actions로 이미지 생성 자동화 하기"
slug: github-action-image-generation
featured: true
draft: false
tags:
  - Github Action
description: "Github Actions를 활용하여 텍스트 파일을 기반으로 자동으로 이미지를 생성하는 방법에 대한 포스팅입니다."
---

## Intro

이전에 Github Actions로 여러가지 자동화를 할 수 있는 것을 이야기 했는데 구체적인 예시를 소개하고자 합니다.
Text 파일 업로드를 하면 해당 텍스트 파일을 기준으로 이미지를 생성해서 업로드 하는 Workflow를 만들어 보았습니다.

## 작동방식

텍스트 파일을 깃허브 레포에 커밋하면 파이썬 코드가, 해당 텍스트파일을 가지고 이미지를 만들도록 할 것입니다.

어떻게 되는지 한번 보여드리겠습니다.

아래 처럼 텍스트 파일을 만들어서 Push 하면..

![Push Text Files](@assets/images/github-action-image-generation/1.png)

아래와 같이 Github Action이 돌아갑니다.

![Github Action이 돌아갑니다.](@assets/images/github-action-image-generation/2.png)

최종적으로 이미지 파일이 만들어 졌습니다.
![github-action-image-generation](@assets/images/github-action-image-generation/3.png)

"와우.png"
![github-action-image-generation-1](@assets/images/github-action-image-generation/4.png)

조금 긴 텍스트는 좌우로 텍스트가 잘리네요. 파이썬 코드를 수정해야 할 것 같은데 이번에는 넘어가겠습니다.

## 파이썬 코드

이 코드는 현재 디렉토리의 .txt 파일 이름을 이용해 최대 3줄로 줄바꿈한 텍스트를 포함하는 128x128 크기의 검은색 썸네일 이미지를 생성하고, 이를 thumbnails 폴더에 저장합니다. 텍스트는 흰색으로 중앙에 배치되며, 텍스트 크기는 이미지에 맞도록 조정됩니다. 코드 실행 시 폴더에 이미 해당 이름의 이미지 파일이 있다면 새로 생성하지 않고 넘어갑니다. 최종적으로, .txt 파일마다 해당 텍스트가 표시된 썸네일이 저장되는 구조로 작동합니다.

```python
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# 특정 확장자를 포함하는 파일만 검색
def find_files_with_extensions(base_path, extensions):
    all_files = []
    for file_path in Path(base_path).rglob('*'):
        if file_path.suffix in extensions:
            all_files.append(file_path)
    return all_files

# 썸네일 생성
def create_thumbnail(file_path, thumbnails_path):
    filename = file_path.stem  # 파일 이름 추출 (확장자 제외)
    thumbnail_file = f'{thumbnails_path}/{filename}.png'

    # 이미 썸네일 존재 시 스킵
    if os.path.exists(thumbnail_file):
        print(f"'{thumbnail_file}' 파일이 이미 존재하여 건너뜁니다.")
        return

    # 이미지 생성
    img = Image.new('RGB', (800, 600), color='black')
    d = ImageDraw.Draw(img)
    font_size = 24
    font = ImageFont.load_default()

    # 텍스트 줄바꿈 처리
    def wrap_text(text, font, max_width):
        words = text.split()
        lines = []
        current_line = ""
        for word in words:
            test_line = f"{current_line} {word}".strip()
            bbox = d.textbbox((0, 0), test_line, font=font)
            width = bbox[2] - bbox[0]
            if width <= max_width:
                current_line = test_line
            else:
                lines.append(current_line)
                current_line = word
        lines.append(current_line)
        return lines[:3]  # 최대 3줄까지만 반환

    # 텍스트 설정
    max_width, max_height = 800, 600
    text = filename

    # 폰트 크기 조정
    while font_size > 8:
        try:
            font = ImageFont.truetype("fonts/BMDOHYEON_ttf.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()
        wrapped_text = wrap_text(text, font, max_width)
        text_height = sum(d.textbbox((0, 0), line, font=font)[
                          3] - d.textbbox((0, 0), line, font=font)[1] for line in wrapped_text)
        if text_height <= max_height:
            break
        font_size -= 1

    # 텍스트 렌더링
    y_offset = (max_height - text_height) // 2
    for line in wrapped_text:
        bbox = d.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        position = ((max_width - text_width) // 2, y_offset)
        d.text(position, line, fill=(255, 255, 255), font=font)
        y_offset += bbox[3] - bbox[1]

    # 저장
    img.save(thumbnail_file)
    print(f"'{thumbnail_file}' 파일을 새로 생성했습니다.")

# 메인 실행
def main():
    base_path = '.'  # 현재 디렉토리
    thumbnails_path = './thumbnails'
    allowed_extensions = ['.md', '.mdx', '.txt']  # 허용할 확장자 목록

    os.makedirs(thumbnails_path, exist_ok=True)

    # 파일 검색 및 처리
    files_to_process = find_files_with_extensions(
        base_path, allowed_extensions)
    for file_path in files_to_process:
        create_thumbnail(file_path, thumbnails_path)


if __name__ == '__main__':
    main()
```

## Workflow

이 GitHub Actions 워크플로우는 저장소에 .txt 파일이 추가되거나 변경될 때마다 트리거되어, 해당 파일들을 기반으로 썸네일 이미지를 생성한 뒤 thumbnails 폴더에 저장하고, 생성된 썸네일 이미지를 저장소에 커밋하여 푸시합니다. 워크플로우는 우분투 환경에서 실행되며, Python을 사용하여 이미지 생성 스크립트를 수행합니다. 이후 생성된 썸네일 이미지들을 저장소에 자동으로 커밋하고 푸시하여 저장소에 반영되도록 합니다.

```
name: Generate Thumbnail for Text Files

on:
  push:
    paths:
      - '**/*.txt'

jobs:
  generate_thumbnail:
    runs-on: ubuntu-latest

    permissions:
      contents: write  # 저장소에 파일을 작성할 권한

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.x'

      - name: Install dependencies
        run: |
          pip install pillow  # 이미지 처리 라이브러리

      - name: Generate Thumbnail
        run: |
          python scripts/generate_thumbnail.py  # 파이썬 파일 실행

      - name: Commit and push thumbnails
        run: |
          git config --local user.name "github-actions[bot]"
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git add thumbnails/
          git commit -m "Add thumbnails for text files"
          git push
```

## 마무리

![마무리](@assets/images/github-action-image-generation/6.png)

사실 간단해 보이지만 만드는과정에서 많은 실패가 일어납니다. Workflow에 권한이 없는 문제, 파이썬 파일 실행과정에서의 문제 등으로 인해 수많은 fail을 거쳐 성공을 할 수 있었습니다.

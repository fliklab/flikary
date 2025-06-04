---
author: Flik
pubDatetime: 2017-12-18
modDatetime: 2017-12-18
title: Processing으로 오디오 반응형 비주얼 만들기
slug: audio-reactive-visual-with-processing
featured: false
draft: false
tags:
  - processing
  - audio
  - visualization
  - audiovisual
  - creative-coding
description: Processing을 사용하여 오디오에 반응하는 AudioVisual 영상을 만든 과정을 공유합니다.
---

Processing을 사용하여 오디오에 반응하는 시각화를 어떻게 만들었는지 공유합니다.

## Main Idea

This Project consists of two main themes and their modifications.

- **<1> Audio Reactive Cube**
- **<2> Frequency Terrain**

![Main Idea 슬라이드](2025-06-05-02-36-37.png)

## <1>Audio reactive cube

<1> Beat-detected value is used to trigger the function named `setModeRandom()`.
<2> This function randomly changes the values of parameters such as fill color, stroke color, and amount of rotations.
Then the cube looks reacting to a beat of the music but not according to certain rules.
<3> The size of the cube and the noise value(how much the cube is distorted) depends on the value of the particular frequency range.

## Libraries

![Library Used 슬라이드](2025-06-05-02-41-22.png)

![Audio Reactive Cube 슬라이드](2025-06-05-02-42-04.png)

## <2>Frequency Terrain

![Frequency Terrain 슬라이드](2025-06-05-02-42-13.png)

This is an infinitely generated terrain.
Along the x-axis, the loudness of each frequency band is mapped on each point. The color of each part of the terrain is complicatedly defined by the trequency and the size of the sound
You can rotate or move the scene to see the terrain at various viewpoints
by using keyboards.

![Video 슬라이드](2025-06-05-02-42-49.png)

관심 가져주셔서 감사합니다.
질문이 있으시다면 언제든 알려주세요.

<iframe width="560" height="315" src="https://www.youtube.com/embed/LPduVX1qKGk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/dGAdpjFcTgQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

원문: [How I made Audio Reactive Visual with Processing](https://randomflik.blogspot.com/2017/12/how-i-made-audio-reactive-visual-with.html)

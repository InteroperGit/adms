# 091 — Тесты content blocks и fallback

## Цель

Покрыть рендеринг универсальных блоков и безопасные media/form fallback-состояния.

## Объём

Добавить component-тесты для всех блоков из плана: текст, списки, таблицы,
графики, изображения, галереи, видео, цитаты, footnotes и order forms.
Использовать матрицу `input block -> component -> output`; проверить heading
levels, safe links, native lists, captions, ratios, focal points, responsive
sources, media errors, transcript/caption, no-JS fallback, publication
filtering и general inquiry fallback.

## Приёмка

Все типы и fallback-состояния покрыты минимальными fixtures; опубликованные
блоки рендерятся, demo/unpublished блоки фильтруются по policy.

import { getWindow } from "@utils/window";
import { c, toClassName } from "@utils/fashion";
import type { Style } from "@common/types";
import { h } from "@external/preact";
import { useEffect, useRef, useState } from "@external/preact/hooks";

const centeredClass = toClassName("centeredClass", {
  width: "max-content",
  margin: "0 auto",
});

const numberOfSpacesAndTotallyNotAMagicNumber = 2;

/**
 * Так как Goober будет бесконечно создавать `<style>` элементы каждый раз
 * при вызове функции `css`, имеет смысл сохранять названия классов, чтобы
 * не плодить бесконечность одинаковых стилей. Так как стили остаются в шапке
 * страницы «навечно», не имеет смысла мудрить и «выгружать» что-либо из этой
 * карты.
 */
const sizeClasses = new Map<number, string>();

/**
 * Генерирует стиль для изменения размера точек в индикаторе прогресса и
 * возвращает название класса для применения к индикатору прогресса или
 * любому элементу вообще, который содержит индикаторы прогресса
 *
 * @param dotSize Размер одной точки
 * @return Название класса для применения к компоненту индикатора или
 * любому элементу, содержащему в дочерних классах индикатор прогресса
 */
export function dotsSize(dotSize: number) {
  let className = sizeClasses.get(dotSize);

  if (className != null) return className;

  const spaceSize = dotSize / numberOfSpacesAndTotallyNotAMagicNumber;

  className = toClassName(`dotSize${dotSize}`, {
    "& .pr .pr_bt": {
      width: `${dotSize}px`,
      height: `${dotSize}px`,
      marginRight: `${spaceSize}px`,

      "&:first": {
        marginLeft: `${spaceSize}px`,
      },
    },
  });

  sizeClasses.set(dotSize, className);

  return className;
}

/**
 * Представляет собой опции индикатора прогресса
 */
export interface IProgressIndicatorProps {
  /**
   * Булевое значение, если индикатор должен отображаться по центру
   * родительского элемента (если это возможно; применяет `margin: 0 auto`)
   */
  centered?: boolean;

  /**
   * Стили, применимые к корневому элементу индикатора
   */
  style?: Style;

  /**
   * Название класса, применяемое к корневому элементу индикатора
   *
   * Элемент индикатора имеет класс `pr`, когда как каждая точка в нём
   * имеет класс `pr_bt`. Это можно использовать для вычисления размера
   * индикатора
   */
  className?: string;
}

/**
 * Компонент индикации прогресса
 *
 * @param props Настройки индикатора
 * @return DIV элемент с тремя точками внутри
 */
export function ProgressIndicator(props: IProgressIndicatorProps) {
  const { centered, className, style } = props;
  const progressHolder = useRef<HTMLDivElement>(null);
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    const holder = progressHolder.current;

    if (holder == null || isMounted) return;

    getWindow().showProgress(holder);

    setMounted(true);
  }, [progressHolder, isMounted]);

  return (
    <div
      ref={progressHolder}
      className={c(className, centeredClass, centered ?? false)}
      style={style}
    />
  );
}

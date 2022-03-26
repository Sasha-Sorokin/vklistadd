/* eslint-disable @typescript-eslint/no-explicit-any */
type Key = symbol | string | number;

export type Entry<KeyType extends Key, ValueType> = [
  key: KeyType,
  value: ValueType,
];

/**
 * @return Новая пустая хэш-карта.
 */
export function create<K extends Key, V>(): Record<K, V> {
  return Object.create(null);
}

/**
 * Создаёт пустую хэш-карту, определяет её значения и возвращает её.
 *
 * @param entries Массив элементов ключ-пара для определения внутри карты.
 * @return Новая хэш-карта с уже определёнными значениями.
 */
export function of<K extends Key, V>(entries: Entry<K, V>[]) {
  const map = create<K, V>();

  for (const [key, value] of entries) {
    map[key] = value;
  }

  return map;
}

const emptyMap = Object.freeze(create());

/**
 * @return Пустая замороженная карта.
 */
export function empty(): Record<any, any> {
  return emptyMap;
}

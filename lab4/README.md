# Лабораторна робота №4 — GoF патерн Strategy

Реалізовано вичитку датасету злочинів Чикаго, запис отриманих даних у файл та
вивід записів через патерн **Strategy** у різні сховища:

- `console` — друк у консоль;
- `kafka` — відправка в Kafka topic;
- `redis` — запис у Redis list.

Перемикання виконується **лише через конфігурацію** (`config/appsettings.json`)
без змін у коді.

## Джерело даних

- Dashboard: [Crimes - 2001 to present - Dashboard](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present-Dashboard/5cd6-ry5g)
- API endpoint (JSON): `https://data.cityofchicago.org/resource/ijzp-q8t2.json`

## Структура

```text
lab4/
├── config/appsettings.json
├── src/
│   ├── config/AppConfig.ts
│   ├── readers/ChicagoCrimesDatasetReader.ts
│   ├── services/CrimeExportService.ts
│   ├── strategies/
│   │   ├── IOutputStrategy.ts
│   │   ├── ConsoleOutputStrategy.ts
│   │   ├── KafkaOutputStrategy.ts
│   │   ├── RedisOutputStrategy.ts
│   │   └── OutputStrategyFactory.ts
│   ├── types/CrimeRecord.ts
│   └── main.ts
├── package.json
└── tsconfig.json
```

## Запуск

```bash
cd lab4
npm install
npm start
```

Програма:
1. Завантажує дані з API (`dataset.sourceUrl` + `$limit`).
2. Зберігає "сирий" JSON у файл `dataset.outputFile`.
3. Зчитує дані з цього файлу.
4. Передає рядки у вибрану Strategy-реалізацію.

## Перемикання сховища (без змін коду)

Змініть тільки:

```json
"output": { "type": "console" }
```

на:

- `"console"`
- `"kafka"`
- `"redis"`

та за потреби параметри секцій `kafka` або `redis`.

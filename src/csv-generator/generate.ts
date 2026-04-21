import * as fs from "fs";
import * as path from "path";

const FIRST_NAMES = [
  "Олександр", "Марія", "Дмитро", "Анна", "Максим", "Софія", "Андрій",
  "Вікторія", "Іван", "Юлія", "Сергій", "Катерина", "Михайло", "Наталія",
  "Артем", "Олена", "Владислав", "Тетяна", "Богдан", "Ірина", "Денис",
  "Оксана", "Ярослав", "Людмила", "Роман", "Дарина", "Олег", "Аліна",
  "Василь", "Галина",
];

const LAST_NAMES = [
  "Шевченко", "Бондаренко", "Коваленко", "Ткаченко", "Мельник", "Олійник",
  "Лисенко", "Кравченко", "Поліщук", "Савченко", "Мороз", "Романенко",
  "Павленко", "Гончаренко", "Петренко", "Левченко", "Карпенко", "Руденко",
  "Федоренко", "Тимошенко",
];

const SPECIALIZATIONS = [
  { name: "Комп'ютерні науки", description: "Поглиблене вивчення алгоритмів, структур даних та теорії обчислень" },
  { name: "Веб-розробка", description: "Створення сучасних веб-застосунків з використанням актуальних технологій" },
  { name: "Штучний інтелект", description: "Машинне навчання, нейронні мережі та обробка природної мови" },
  { name: "Кібербезпека", description: "Захист інформаційних систем від кіберзагроз та вразливостей" },
  { name: "Мобільна розробка", description: "Розробка додатків для iOS та Android платформ" },
  { name: "Аналіз даних", description: "Статистичний аналіз, візуалізація та інтерпретація великих обсягів даних" },
  { name: "DevOps", description: "Автоматизація процесів розробки, тестування та розгортання програмного забезпечення" },
  { name: "Бази даних", description: "Проектування, оптимізація та адміністрування реляційних та NoSQL баз даних" },
];

const COURSES_BY_SPEC: Record<string, string[]> = {
  "Комп'ютерні науки": ["Алгоритми та структури даних", "Теорія обчислень", "Дискретна математика", "Операційні системи"],
  "Веб-розробка": ["HTML/CSS основи", "JavaScript поглиблено", "React розробка", "Node.js серверна частина"],
  "Штучний інтелект": ["Вступ до ML", "Глибинне навчання", "NLP обробка тексту", "Комп'ютерний зір"],
  "Кібербезпека": ["Мережева безпека", "Криптографія", "Пентестинг", "Безпека веб-додатків"],
  "Мобільна розробка": ["Kotlin для Android", "Swift для iOS", "Flutter крос-платформа", "React Native"],
  "Аналіз даних": ["Python для аналізу", "SQL аналітика", "Візуалізація даних", "Статистичні методи"],
  "DevOps": ["Docker контейнери", "Kubernetes оркестрація", "CI/CD пайплайни", "AWS хмарні сервіси"],
  "Бази даних": ["SQL основи", "PostgreSQL адміністрування", "MongoDB NoSQL", "Оптимізація запитів"],
};

const INSTRUCTORS = [
  "Проф. Коваль Петро", "Доц. Сидоренко Ольга", "Проф. Бойко Ігор",
  "Доц. Кравчук Наталія", "Проф. Литвин Віктор", "Доц. Гнатюк Тарас",
  "Проф. Марченко Олена", "Доц. Ющенко Анна", "Проф. Дорошенко Сергій",
  "Доц. Пономаренко Іван", "Проф. Клименко Ірина", "Доц. Захарченко Богдан",
];

const REVIEW_COMMENTS = [
  "Дуже корисний курс, рекомендую всім!",
  "Чудовий матеріал, подано зрозуміло.",
  "Курс допоміг зрозуміти складні концепції.",
  "Хороший курс, але можна додати більше практики.",
  "Відмінний інструктор, все пояснює чітко.",
  "Матеріал актуальний та практичний.",
  "Курс перевершив мої очікування.",
  "Добре структурований курс з логічною послідовністю.",
  "Дуже задоволений якістю навчання.",
  "Рекомендую для початківців та середнього рівня.",
  "Практичні завдання дуже допомогли закріпити знання.",
  "Інструктор завжди відповідає на запитання.",
  "Один з найкращих курсів на платформі.",
  "Гарний баланс теорії та практики.",
  "Курс варто пройти кожному розробнику.",
  "Деякі теми можна було розкрити глибше.",
  "Після курсу отримав роботу в IT компанії!",
  "Матеріали та ресурси дуже якісні.",
  "Складний, але цікавий курс.",
  "Допоміг систематизувати знання в цій галузі.",
];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function generateCsv(rowCount: number): string {
  const headers = [
    "user_name",
    "user_email",
    "specialization_name",
    "specialization_description",
    "course_name",
    "instructor_name",
    "week_number",
    "week_deadline",
    "review_rating",
    "review_comment",
  ];

  const lines: string[] = [headers.join(",")];

  const users: { name: string; email: string }[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < 200; i++) {
    const firstName = random(FIRST_NAMES);
    const lastName = random(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

    if (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.com`;
    }
    usedEmails.add(email);
    users.push({ name, email });
  }

  const instructorAssignment = new Map<string, string>();
  for (const spec of SPECIALIZATIONS) {
    const courses = COURSES_BY_SPEC[spec.name];
    for (const course of courses) {
      instructorAssignment.set(`${spec.name}|${course}`, random(INSTRUCTORS));
    }
  }

  let generated = 0;

  while (generated < rowCount) {
    const user = random(users);
    const spec = random(SPECIALIZATIONS);
    const courses = COURSES_BY_SPEC[spec.name];
    const course = random(courses);
    const instructor = instructorAssignment.get(`${spec.name}|${course}`)!;
    const weekNumber = randomInt(1, 8);

    const baseDate = new Date(2026, 1, 1);
    baseDate.setDate(baseDate.getDate() + weekNumber * 7);
    const deadline = baseDate.toISOString().split("T")[0];

    const rating = randomInt(1, 5);
    const comment = random(REVIEW_COMMENTS);

    const row = [
      escapeCsv(user.name),
      escapeCsv(user.email),
      escapeCsv(spec.name),
      escapeCsv(spec.description),
      escapeCsv(course),
      escapeCsv(instructor),
      weekNumber.toString(),
      deadline,
      rating.toString(),
      escapeCsv(comment),
    ];

    lines.push(row.join(","));
    generated++;
  }

  return lines.join("\n");
}

function main(): void {
  const rowCount = parseInt(process.argv[2] || "1200", 10);
  const outputPath = process.argv[3] || path.join(__dirname, "..", "..", "data.csv");

  console.log(`Generating CSV with ${rowCount} rows...`);
  const csv = generateCsv(rowCount);

  const absolutePath = path.resolve(outputPath);
  fs.writeFileSync(absolutePath, csv, "utf-8");
  console.log(`CSV file saved to: ${absolutePath}`);
  console.log(`Total lines (including header): ${csv.split("\n").length}`);
}

main();

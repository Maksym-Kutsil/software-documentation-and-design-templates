import path from "path";
import { UnitOfWork } from "../data-access/repositories/UnitOfWork";
import {
  Course,
  Specialization,
  Instructor,
} from "../data-access/entities";

async function seed(): Promise<void> {
  const dbPath = path.join(__dirname, "..", "..", "database.sqlite");
  const uow = new UnitOfWork(dbPath);
  await uow.connect();
  await uow.syncDatabase(true);

  console.log("Seeding test data...");

  const specializations = await Specialization.bulkCreate([
    {
      name: "Data Science",
      description: "Машинне навчання, статистика, аналіз даних",
    },
    {
      name: "Web Development",
      description: "Frontend та backend розробка сучасних веб-додатків",
    },
    {
      name: "Cloud Engineering",
      description: "Хмарні платформи, DevOps, інфраструктура як код",
    },
    {
      name: "Cybersecurity",
      description: "Захист систем, криптографія, тестування на проникнення",
    },
    {
      name: "Mobile Development",
      description: "Розробка мобільних додатків iOS та Android",
    },
  ]);

  const instructors = await Instructor.bulkCreate([
    { name: "Andrew Ng" },
    { name: "Barbara Liskov" },
    { name: "Guido van Rossum" },
    { name: "Ada Lovelace" },
    { name: "Linus Torvalds" },
    { name: "Margaret Hamilton" },
  ]);

  const coursesData = [
    {
      name: "Machine Learning Foundations",
      description:
        "Вступ до машинного навчання: лінійна/логістична регресія, градієнтний спуск, нейромережі.",
      durationWeeks: 8,
      specIdx: 0,
      instrIdx: 0,
    },
    {
      name: "Deep Learning with PyTorch",
      description:
        "Глибокі нейромережі, CNN, RNN, трансформери, практичні проекти з комп'ютерного зору та NLP.",
      durationWeeks: 10,
      specIdx: 0,
      instrIdx: 0,
    },
    {
      name: "Statistics for Data Science",
      description: "Ймовірності, гіпотези, регресія, A/B тести.",
      durationWeeks: 6,
      specIdx: 0,
      instrIdx: 2,
    },
    {
      name: "React from Zero to Hero",
      description:
        "Сучасний React: хуки, контекст, Redux Toolkit, React Query, тестування.",
      durationWeeks: 8,
      specIdx: 1,
      instrIdx: 1,
    },
    {
      name: "Node.js & Express API",
      description:
        "Побудова REST API на Node.js з Express, TypeORM, JWT-автентифікацією та тестами.",
      durationWeeks: 6,
      specIdx: 1,
      instrIdx: 1,
    },
    {
      name: "TypeScript in Depth",
      description:
        "Generics, utility types, conditional types, патерни для великих проектів.",
      durationWeeks: 4,
      specIdx: 1,
      instrIdx: 2,
    },
    {
      name: "AWS Cloud Practitioner",
      description:
        "Основи AWS: EC2, S3, RDS, Lambda, VPC, IAM, сертифікаційна підготовка.",
      durationWeeks: 6,
      specIdx: 2,
      instrIdx: 4,
    },
    {
      name: "Kubernetes for Developers",
      description:
        "Оркестрація контейнерів: Pods, Services, Deployments, Helm, GitOps.",
      durationWeeks: 5,
      specIdx: 2,
      instrIdx: 4,
    },
    {
      name: "Offensive Security 101",
      description:
        "Етичний хакінг: розвідка, експлуатація вразливостей, post-exploitation.",
      durationWeeks: 8,
      specIdx: 3,
      instrIdx: 3,
    },
    {
      name: "Applied Cryptography",
      description:
        "Симетричні та асиметричні шифри, TLS, хеш-функції, цифрові підписи.",
      durationWeeks: 6,
      specIdx: 3,
      instrIdx: 5,
    },
    {
      name: "iOS Development with Swift",
      description:
        "SwiftUI, Combine, архітектура MVVM, публікація в App Store.",
      durationWeeks: 10,
      specIdx: 4,
      instrIdx: 5,
    },
    {
      name: "Android with Kotlin",
      description:
        "Jetpack Compose, Coroutines, Room, Retrofit, Material Design 3.",
      durationWeeks: 8,
      specIdx: 4,
      instrIdx: 3,
    },
  ];

  await Course.bulkCreate(
    coursesData.map((c) => ({
      name: c.name,
      description: c.description,
      durationWeeks: c.durationWeeks,
      specializationId: specializations[c.specIdx].id,
      instructorId: instructors[c.instrIdx].id,
    }))
  );

  console.log(`  ${specializations.length} specializations`);
  console.log(`  ${instructors.length} instructors`);
  console.log(`  ${coursesData.length} courses`);
  console.log("Seed complete.");

  await uow.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

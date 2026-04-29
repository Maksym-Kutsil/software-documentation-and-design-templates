# Лабораторна робота №3 — MVC веб-додаток

Веб-додаток на шаблоні **MVC**, що візуалізує дані предметної області
(онлайн-платформа курсів) та надає повний CRUD для основної сутності **Course**.

## Стек технологій

- **TypeScript** + **Node.js**
- **Express** — веб-фреймворк / MVC-роутінг
- **EJS** — шаблонізатор для представлень (View)
- **Sequelize** — ORM для рівня доступу до даних
- **SQLite** — база даних

## Відповідність вимогам

| Вимога                                                        | Реалізація                                                                       |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1. Основна сутність предметної області                        | `Course` (курс онлайн-платформи), зв'язаний з `Specialization` та `Instructor`   |
| 2. Контролер(и) з методами-діями, що відображають інформацію  | `CoursesController` (index, details, create, edit, delete) + `HomeController`    |
| 3. Модель описує логіку даних, взаємодіє з БД + тестові дані  | ORM-сутності + `CourseService` (BLL) + скрипт `seed` з тестовими даними          |
| 4. Можливість додавати, редагувати, видаляти дані             | `POST /courses/create`, `POST /courses/:id/edit`, `POST /courses/:id/delete`     |
| 5. Вибірка відображається як HTML-сторінка (Представлення)    | EJS-шаблони в `src/views/courses/*.ejs`                                          |
| 6. Вичитка даних — через класи рівня бізнес-логіки            | Контролери викликають `ICourseService` → `CourseService`, а не DAL безпосередньо |

## Архітектура

```
Browser  ─►  Controller (Express)  ─►  Business Logic (CourseService)  ─►  DAL (UnitOfWork, Repository)  ─►  SQLite
                   │
                   └─►  View (EJS) ─►  HTML
```

- **Model (Модель)** — ORM-сутності (`Course`, `Specialization`, `Instructor`) + сервіси BLL.
- **View (Представлення)** — EJS-шаблони в `src/views/`.
- **Controller (Контролер)** — Express-контролери в `src/controllers/`.

Зв'язок між рівнями — через **інтерфейси** (`ICourseService`, `IUnitOfWork`,
`ICourseRepository`), інстанси збираються у DI-контейнері (`DiContainer`).

## Структура проекту

```
lab3/
├── src/
│   ├── app.ts                      # точка входу Express
│   ├── di-container.ts             # IoC / DI-контейнер
│   ├── routes/                     # маршрути MVC
│   ├── controllers/                # Controllers
│   │   ├── HomeController.ts
│   │   └── CoursesController.ts
│   ├── business-logic/             # BLL
│   │   ├── dto/CourseDto.ts
│   │   ├── interfaces/ICourseService.ts
│   │   └── services/CourseService.ts
│   ├── data-access/                # DAL
│   │   ├── entities/               # Sequelize-моделі
│   │   ├── interfaces/             # IRepository, IUnitOfWork, ICourseRepository
│   │   └── repositories/           # Repository, CourseRepository, UnitOfWork
│   ├── views/                      # EJS-шаблони (View)
│   │   ├── home.ejs
│   │   ├── error.ejs
│   │   ├── partials/               # header/footer
│   │   └── courses/                # index, details, create, edit, delete
│   ├── public/css/styles.css       # статичні стилі
│   └── seed/seed.ts                # тестові дані
├── package.json
├── tsconfig.json
└── README.md
```

## Як запустити

### 1. Встановити залежності

```bash
cd lab3
npm install
```

### 2. Заповнити базу тестовими даними

```bash
npm run seed
```

Буде створено `lab3/database.sqlite` з 5 спеціалізаціями, 6 інструкторами та 12 курсами.

### 3. Запустити веб-сервер

```bash
npm start
```

Відкрити у браузері: <http://localhost:3000>

## Маршрути

| Method | URL                     | Дія                                   |
| ------ | ----------------------- | ------------------------------------- |
| GET    | `/`                     | Головна сторінка                      |
| GET    | `/courses`              | Список усіх курсів                    |
| GET    | `/courses/create`       | Форма створення курсу                 |
| POST   | `/courses/create`       | Створити курс                         |
| GET    | `/courses/:id`          | Деталі курсу                          |
| GET    | `/courses/:id/edit`     | Форма редагування                     |
| POST   | `/courses/:id/edit`     | Оновити курс                          |
| GET    | `/courses/:id/delete`   | Сторінка підтвердження видалення      |
| POST   | `/courses/:id/delete`   | Видалити курс                         |

## Як демонструвати викладачу

1. Запустити `npm run seed`, щоб показати, що БД наповнена тестовими даними.
2. `npm start` і відкрити `http://localhost:3000`.
3. Показати **Home** → клік на **Courses** — демонструє *Read*.
4. Клік на назву курсу — сторінка **Details** (деталі з навантаженням через `belongsTo`).
5. Натиснути **+ New course**, заповнити форму → **Create**. Продемонструвати валідацію
   (залишити поле пустим → побачити повідомлення про помилку).
6. На сторінці курсу клік **Edit** → змінити значення → **Save** (*Update*).
7. На сторінці курсу клік **Delete** → підтвердити (*Delete*).
8. Показати у коді:
   - `CoursesController` викликає **інтерфейс** `ICourseService`, а не конкретний клас (DIP);
   - `CourseService` викликає **інтерфейс** `IUnitOfWork` та `ICourseRepository`;
   - `DiContainer` збирає залежності й інжектить їх у контролери.

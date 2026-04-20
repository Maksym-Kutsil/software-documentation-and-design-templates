import { CourseAttributes } from "../../data-access/entities";
import { WeekAttributes } from "../../data-access/entities";
import { ReviewAttributes } from "../../data-access/entities";

export interface ICoursePresenter {
  displayCourses(courses: CourseAttributes[]): void;
  displayCourseDetails(
    course: CourseAttributes,
    weeks: WeekAttributes[],
    reviews: ReviewAttributes[]
  ): void;
}

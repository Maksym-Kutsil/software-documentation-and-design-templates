import { SpecializationAttributes } from "../../data-access/entities";
import { CourseAttributes } from "../../data-access/entities";

export interface ISpecializationPresenter {
  displaySpecializations(specializations: SpecializationAttributes[]): void;
  displaySpecializationDetails(
    specialization: SpecializationAttributes,
    courses: CourseAttributes[]
  ): void;
}

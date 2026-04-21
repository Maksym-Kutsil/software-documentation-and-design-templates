import { UserAttributes } from "../../data-access/entities";

export interface IUserPresenter {
  displayUsers(users: UserAttributes[]): void;
  displayUserDetails(user: UserAttributes): void;
  displayUserEnrollments(
    user: UserAttributes,
    specializations: string[]
  ): void;
}

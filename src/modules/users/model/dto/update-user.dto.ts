import { PartialType } from "@nestjs/mapped-types";
import { User } from "../entity/user.entity";

export class UpdateUserDto extends PartialType(User) {}
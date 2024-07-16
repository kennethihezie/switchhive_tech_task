import { PartialType } from "@nestjs/mapped-types";
import { Product } from "../entity/product.entity";

export class UpdateProductDto extends PartialType(Product) {}
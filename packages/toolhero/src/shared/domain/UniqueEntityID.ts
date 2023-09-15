import { v4 } from "uuid";
import { autoId } from "./autoId";
import { Identifier } from "./Identifier";
export class UniqueEntityID extends Identifier<string> {
  constructor(id?: string) {
    super(id ? id : autoId());
  }
}

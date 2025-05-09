// src/components/contract-form/contract-form.ts
import { FASTElement, attr, observable } from "@microsoft/fast-element";
import { type ContractField } from "@features/contracts/templates/contract-templates";

export class ContractForm extends FASTElement {
  @observable metadata?: ContractField[];
  form?: HTMLFormElement;

  submit() {
    const formData = new FormData(this.form);
    const metadata = Object.fromEntries((formData as any).entries());
    this.$emit("submit", { metadata });
  }
}

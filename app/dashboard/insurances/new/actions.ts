"use server";

import { createInsurance } from "@/lib/api/insurances";
import { redirect } from "next/navigation";

export async function createInsuranceAction(_prevState: unknown, formData: FormData) {
  const result = await createInsurance(formData);
  if (result.error) return { error: result.error };
  redirect("/dashboard/insurances");
}

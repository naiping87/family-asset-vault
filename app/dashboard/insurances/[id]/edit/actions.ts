"use server";

import { updateInsurance } from "@/lib/api/insurances";
import { redirect } from "next/navigation";

export async function editInsuranceAction(
  insuranceId: string,
  _prevState: unknown,
  formData: FormData
) {
  const result = await updateInsurance(insuranceId, formData);
  if (result.error) return { error: result.error };
  redirect("/dashboard/insurances");
}

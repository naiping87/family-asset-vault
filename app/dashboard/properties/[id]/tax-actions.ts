"use server";

import { createTax, markTaxPaid } from "@/lib/api/taxes";
import { revalidatePath } from "next/cache";

export async function addTaxAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  const result = await createTax(formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function markTaxPaidAction(propertyId: string, taxId: string) {
  const result = await markTaxPaid(taxId);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

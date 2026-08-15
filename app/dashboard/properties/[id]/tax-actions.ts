"use server";

import { createTax, updateTax, markTaxPaid, deleteTax } from "@/lib/api/taxes";
import { revalidatePath } from "next/cache";

export async function addTaxAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  const result = await createTax(formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function editTaxAction(propertyId: string, taxId: string, formData: FormData) {
  const result = await updateTax(taxId, formData);
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

export async function deleteTaxAction(propertyId: string, taxId: string) {
  const result = await deleteTax(taxId);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

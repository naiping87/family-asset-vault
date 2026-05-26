"use server";

import { createTax, markTaxPaid, deleteTax } from "@/lib/api/taxes";
import { revalidatePath } from "next/cache";

export async function addTaxAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  await createTax(formData);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}

export async function markTaxPaidAction(propertyId: string, taxId: string) {
  await markTaxPaid(taxId);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}

export async function deleteTaxAction(propertyId: string, taxId: string) {
  await deleteTax(taxId);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}

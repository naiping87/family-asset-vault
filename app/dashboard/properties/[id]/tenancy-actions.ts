"use server";

import { createTenancy, updateTenancy, deleteTenancy } from "@/lib/api/tenancies";
import { revalidatePath } from "next/cache";

export async function addTenancyAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  const result = await createTenancy(formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function editTenancyAction(propertyId: string, tenancyId: string, formData: FormData) {
  const result = await updateTenancy(tenancyId, formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function deleteTenancyAction(propertyId: string, tenancyId: string) {
  const result = await deleteTenancy(tenancyId);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

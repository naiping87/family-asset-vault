"use server";

import { createTenancy } from "@/lib/api/tenancies";
import { revalidatePath } from "next/cache";

export async function addTenancyAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  const result = await createTenancy(formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

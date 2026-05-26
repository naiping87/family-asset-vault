"use server";

import { createTenancy, updateTenancy, deleteTenancy } from "@/lib/api/tenancies";
import { revalidatePath } from "next/cache";

export async function addTenancyAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  await createTenancy(formData);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}

export async function editTenancyAction(propertyId: string, tenancyId: string, formData: FormData) {
  await updateTenancy(tenancyId, formData);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}

export async function deleteTenancyAction(propertyId: string, tenancyId: string) {
  await deleteTenancy(tenancyId);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}

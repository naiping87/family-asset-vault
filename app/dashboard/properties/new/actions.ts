"use server";

import { createProperty } from "@/lib/api/properties";
import { redirect } from "next/navigation";

export async function createPropertyAction(_prevState: unknown, formData: FormData) {
  const result = await createProperty(formData);
  if (result.error) return { error: result.error };
  redirect("/dashboard/properties");
}

"use server";

import { createExpense, updateExpense, markExpensePaid, deleteExpense } from "@/lib/api/expenses";
import { revalidatePath } from "next/cache";

export async function addExpenseAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  const result = await createExpense(formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function editExpenseAction(propertyId: string, expenseId: string, formData: FormData) {
  const result = await updateExpense(expenseId, formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function markExpensePaidAction(propertyId: string, expenseId: string) {
  const result = await markExpensePaid(expenseId);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function deleteExpenseAction(propertyId: string, expenseId: string) {
  const result = await deleteExpense(expenseId);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { DateInput } from "@/components/ui/DateInput";
import { FileUpload } from "@/components/ui/FileUpload";
import { handleActionError } from "@/lib/utils/action-error";
import { createInsuranceAction } from "@/app/dashboard/insurances/new/actions";
import { editInsuranceAction } from "@/app/dashboard/insurances/[id]/edit/actions";
import type { Insurance } from "@/types/database";

interface Props {
  properties: { id: string; name: string }[];
  insurance?: Insurance;
}

export function InsuranceForm({ properties, insurance }: Props) {
  const { t } = useT();
  const isEdit = Boolean(insurance);
  const serverAction = isEdit && insurance
    ? editInsuranceAction.bind(null, insurance.id)
    : createInsuranceAction;
  const [state, formAction, isPending] = useActionState(serverAction, null);
  const [policyFileUrl, setPolicyFileUrl] = useState(insurance?.policy_file_url ?? "");

  useEffect(() => {
    handleActionError(state);
  }, [state]);

  const title = isEdit ? t("insurance.editTitle") : t("insurance.newTitle");

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/insurances">{t("insurance.listTitle")}</Link>
        <span>›</span>
        <span className="current">{title}</span>
      </div>

      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-subtitle">{insurance ? insurance.policy_no : t("property.saveProperty")}</div>
        </div>
      </div>

      <form action={formAction}>
        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("insurance.policyInfo")}</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t("insurance.type")}</label>
              <select className="form-input" name="insurance_type" defaultValue={insurance?.insurance_type ?? "fire"} required>
                <option value="fire">{t("insurance.fire")}</option>
                <option value="flood">{t("insurance.flood")}</option>
                <option value="home">{t("insurance.home")}</option>
                <option value="mortgage">{t("insurance.mortgage")}</option>
                <option value="other">{t("insurance.other")}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t("insurance.linkedProperty")}</label>
              <select className="form-input" name="property_id" defaultValue={insurance?.property_id ?? ""}>
                <option value="">{t("insurance.noProperty")}</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <FormInput label={t("insurance.provider")} name="provider" placeholder={t("insurance.providerPlaceholder")} defaultValue={insurance?.provider ?? ""} required />
            <FormInput label={t("insurance.policyNo")} name="policy_no" placeholder={t("insurance.policyNoPlaceholder")} defaultValue={insurance?.policy_no ?? ""} required />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("insurance.coverage")}</div>
          <div className="form-row">
            <FormInput label={t("insurance.coverageAmount")} name="coverage_amount" type="number" placeholder="0.00" defaultValue={insurance?.coverage_amount != null ? String(insurance.coverage_amount) : ""} required />
            <FormInput label={t("insurance.annualPremium")} name="annual_premium" type="number" placeholder="0.00" defaultValue={insurance?.annual_premium != null ? String(insurance.annual_premium) : ""} required />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("insurance.agent")}</div>
          <div className="form-row">
            <FormInput label={t("insurance.agentName")} name="agent_name" placeholder={t("insurance.agentNamePlaceholder")} defaultValue={insurance?.agent_name ?? ""} />
            <FormInput label={t("insurance.agentPhone")} name="agent_phone" placeholder={t("insurance.agentPhonePlaceholder")} defaultValue={insurance?.agent_phone ?? ""} />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("insurance.validity")}</div>
          <div className="form-row">
            <DateInput label={t("tenancy.startDate")} name="start_date" defaultValue={insurance?.start_date ?? ""} required />
            <DateInput label={t("tenancy.endDate")} name="end_date" defaultValue={insurance?.end_date ?? ""} required />
          </div>
          {isEdit && (
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">{t("property.status")}</label>
              <select className="form-input" name="status" defaultValue={insurance?.status ?? "active"}>
                <option value="active">{t("tenancy.active")}</option>
                <option value="expired">{t("tenancy.expired")}</option>
              </select>
            </div>
          )}
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("insurance.policyFile")}</div>
          <FileUpload accept=".pdf,.jpg,.jpeg,.png"
            existingFiles={policyFileUrl ? [{ id: "", name: "Policy", size: 0, type: "application/pdf", url: policyFileUrl }] : []}
            onUploaded={setPolicyFileUrl} onDelete={() => setPolicyFileUrl("")} />
          <input type="hidden" name="policy_file_url" value={policyFileUrl} />
        </Card>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href="/dashboard/insurances"><Button variant="secondary">{t("common.cancel")}</Button></Link>
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? t("common.saving") : isEdit ? t("insurance.saveChanges") : t("insurance.savePolicy")}
          </Button>
        </div>
      </form>
    </>
  );
}

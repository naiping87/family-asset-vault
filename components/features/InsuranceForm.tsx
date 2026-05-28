"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { FileUpload } from "@/components/ui/FileUpload";
import { showToast } from "@/components/ui/Toast";
import { createInsuranceAction } from "@/app/dashboard/insurances/new/actions";

interface Props {
  properties: { id: string; name: string }[];
}

export function InsuranceForm({ properties }: Props) {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState(createInsuranceAction, null);
  const [policyFileUrl, setPolicyFileUrl] = useState("");

  useEffect(() => {
    if (state?.error) showToast(state.error, "error");
  }, [state]);

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/insurances">{t("insurance.listTitle")}</Link>
        <span>›</span>
        <span className="current">{t("insurance.newTitle")}</span>
      </div>

      <div className="page-header">
        <div>
          <div className="page-title">🛡️ {t("insurance.newTitle")}</div>
          <div className="page-subtitle">{t("property.saveProperty")}</div>
        </div>
      </div>

      <form action={formAction}>
        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📋 {t("insurance.policyInfo")}</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t("insurance.type")}</label>
              <select className="form-input" name="insurance_type" defaultValue="fire" required>
                <option value="fire">{t("insurance.fire")}</option>
                <option value="flood">{t("insurance.flood")}</option>
                <option value="home">{t("insurance.home")}</option>
                <option value="mortgage">{t("insurance.mortgage")}</option>
                <option value="other">{t("insurance.other")}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t("insurance.linkedProperty")}</label>
              <select className="form-input" name="property_id" defaultValue="">
                <option value="">{t("insurance.noProperty")}</option>
                {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <FormInput label={t("insurance.provider")} name="provider" placeholder={t("insurance.providerPlaceholder")} required />
            <FormInput label={t("insurance.policyNo")} name="policy_no" placeholder={t("insurance.policyNoPlaceholder")} required />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>💰 {t("insurance.coverage")}</div>
          <div className="form-row">
            <FormInput label={t("insurance.coverageAmount")} name="coverage_amount" type="number" placeholder="0.00" required />
            <FormInput label={t("insurance.annualPremium")} name="annual_premium" type="number" placeholder="0.00" required />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>👤 {t("insurance.agent")}</div>
          <div className="form-row">
            <FormInput label={t("insurance.agentName")} name="agent_name" placeholder={t("insurance.agentNamePlaceholder")} />
            <FormInput label={t("insurance.agentPhone")} name="agent_phone" placeholder={t("insurance.agentPhonePlaceholder")} />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📅 {t("insurance.validity")}</div>
          <div className="form-row">
            <FormInput label={t("tenancy.startDate")} name="start_date" type="date" required />
            <FormInput label={t("tenancy.endDate")} name="end_date" type="date" required />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>📎 {t("insurance.policyFile")}</div>
          <FileUpload accept=".pdf,.jpg,.jpeg,.png"
            existingFiles={policyFileUrl ? [{ id: "", name: "Policy", size: 0, type: "application/pdf", url: policyFileUrl }] : []}
            onUploaded={setPolicyFileUrl} onDelete={() => setPolicyFileUrl("")} />
          <input type="hidden" name="policy_file_url" value={policyFileUrl} />
        </Card>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href="/dashboard/insurances"><Button variant="secondary">{t("common.cancel")}</Button></Link>
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? t("common.saving") : t("insurance.savePolicy")}
          </Button>
        </div>
      </form>
    </>
  );
}

"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { DateInput } from "@/components/ui/DateInput";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { FileUpload } from "@/components/ui/FileUpload";
import { showToast } from "@/components/ui/Toast";
import { createPropertyAction } from "@/app/dashboard/properties/new/actions";
import { updatePropertyAction } from "@/app/dashboard/properties/[id]/edit/actions";
import type { Property } from "@/types/database";

interface Props {
  property?: Property;
  mode: "new" | "edit";
}

export function PropertyForm({ property, mode }: Props) {
  const { t } = useT();
  const serverAction = mode === "new" ? createPropertyAction : updatePropertyAction.bind(null, property?.id ?? "");
  const [state, formAction, isPending] = useActionState(serverAction, null);
  const [spaFileUrl, setSpaFileUrl] = useState(property?.spa_file_url ?? "");
  const [geranFileUrl, setGeranFileUrl] = useState(property?.geran_file_url ?? "");
  const [photoUrls, setPhotoUrls] = useState<string[]>(property?.photos ?? []);
  const [photosUploading, setPhotosUploading] = useState(false);

  function handlePhotoUploaded(url: string) {
    setPhotoUrls((prev) => [...prev, url]);
  }

  function handlePhotoDelete(url: string) {
    setPhotoUrls((prev) => prev.filter((u) => u !== url));
  }

  useEffect(() => {
    if (state?.error) { showToast(state.error, "error"); }
  }, [state]);

  return (
    <>
      <div className="breadcrumb">
        <Link href="/dashboard/properties">{t("property.listTitle")}</Link>
        <span>›</span>
        {mode === "edit" && property ? (
          <>
            <Link href={"/dashboard/properties/" + property.id}>{property.name}</Link>
            <span>›</span>
          </>
        ) : null}
        <span className="current">{mode === "new" ? t("property.newTitle") : t("property.editTitle")}</span>
      </div>

      <div className="page-header">
        <div>
          <div className="page-title">{mode === "new" ? `${t("property.newTitle")}` : `${t("property.editTitle")}`}</div>
          <div className="page-subtitle">{mode === "new" ? t("property.saveProperty") : property?.name}</div>
        </div>
      </div>

      <form action={formAction}>
        <div className="content-grid-2" style={{ marginBottom: 28 }}>
          <Card variant="intense" className="section-panel">
            <div className="section-title" style={{ marginBottom: 20 }}>{t("property.basicInfo")}</div>
            <FormInput label={t("property.name")} name="name" placeholder={t("property.namePlaceholder")} defaultValue={property?.name ?? ""} required />
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t("property.type")}</label>
                <select className="form-input" name="property_type" defaultValue={property?.property_type ?? "apartment"}>
                  <option value="apartment">{t("property.apartment")}</option>
                  <option value="landed">{t("property.landed")}</option>
                  <option value="land">{t("property.land")}</option>
                  <option value="shop">{t("property.shop")}</option>
                  <option value="factory">{t("property.factory")}</option>
                </select>
              </div>
              <FormInput label={t("property.titleDeed")} name="title_deed_no" placeholder={t("property.titleDeedPlaceholder")} defaultValue={property?.title_deed_no ?? ""} />
            </div>
            <div className="form-row">
              <FormInput label={t("property.city")} name="city" placeholder={t("property.cityPlaceholder")} defaultValue={property?.city ?? ""} />
              <FormInput label={t("property.state")} name="state" placeholder={t("property.statePlaceholder")} defaultValue={property?.state ?? ""} />
            </div>
            <FormInput label={t("property.address")} name="address" placeholder={t("property.addressPlaceholder")} defaultValue={property?.address ?? ""} />
            <FormInput label={t("property.postcode")} name="postcode" placeholder={t("property.postcodePlaceholder")} defaultValue={property?.postcode ?? ""} />
          </Card>

          <Card variant="intense" className="section-panel">
            <div className="section-title" style={{ marginBottom: 20 }}>{t("property.map")}</div>
            <MapPlaceholder />
          </Card>
        </div>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("property.finance")}</div>
          <div className="form-row-3">
            <FormInput label={t("property.purchasePrice")} name="purchase_price" type="number" placeholder="0.00" defaultValue={property?.purchase_price ? String(property.purchase_price) : ""} />
            <FormInput label={t("property.currentValue")} name="current_value" type="number" placeholder="0.00" defaultValue={property?.current_value ? String(property.current_value) : ""} />
            <FormInput label={t("property.loanBalance")} name="loan_balance" type="number" placeholder="0.00" defaultValue={property?.loan_balance ? String(property.loan_balance) : ""} />
          </div>
          <div style={{ marginTop: 16 }}>
            <FormInput label={t("property.loanBank")} name="loan_bank" placeholder={t("property.loanBankPlaceholder")} defaultValue={property?.loan_bank ?? ""} />
          </div>
          <div className="form-row" style={{ marginTop: 16 }}>
            <FormInput label={t("property.loanInstallment")} name="loan_installment" type="number" placeholder="0.00" defaultValue={property?.loan_installment ? String(property.loan_installment) : ""} />
            <FormInput label={t("property.loanInterestRate")} name="loan_interest_rate" type="number" placeholder="0.00" step="0.01" defaultValue={property?.loan_interest_rate ? String(property.loan_interest_rate) : ""} />
          </div>
        </Card>

<Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("property.photos")}</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 12 }}>{t("property.photosHint")}</p>
          <FileUpload propertyId={property?.id} accept=".jpg,.jpeg,.png,.webp"
            existingFiles={photoUrls.map((url, i) => ({ id: url, name: t("property.photoLabel") + " " + (i + 1), size: 0, type: "image/jpeg", url }))}
            onUploaded={handlePhotoUploaded} onDelete={handlePhotoDelete}
            onUploadingChange={setPhotosUploading} />
          <input type="hidden" name="photos" value={JSON.stringify(photoUrls)} />
          {photoUrls.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {photoUrls.map((url, i) => (
                <img key={i} src={url} alt={t("property.photoLabel") + " " + (i + 1)}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid var(--glass-border)" }} />
              ))}
            </div>
          )}
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("property.legalDocs")}</div>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">{t("property.spaFile")}</label>
            <FileUpload propertyId={property?.id} accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={spaFileUrl ? [{ id: "", name: "SPA", size: 0, type: "application/pdf", url: spaFileUrl }] : []}
              onUploaded={setSpaFileUrl} onDelete={() => setSpaFileUrl("")} />
            <input type="hidden" name="spa_file_url" value={spaFileUrl} />
          </div>
          <div>
            <label className="form-label">{t("property.geranFile")}</label>
            <FileUpload propertyId={property?.id} accept=".pdf,.jpg,.jpeg,.png"
              existingFiles={geranFileUrl ? [{ id: "", name: "Geran", size: 0, type: "application/pdf", url: geranFileUrl }] : []}
              onUploaded={setGeranFileUrl} onDelete={() => setGeranFileUrl("")} />
            <input type="hidden" name="geran_file_url" value={geranFileUrl} />
          </div>
        </Card>

        <Card variant="intense" className="section-panel" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 20 }}>{t("property.status")}</div>
          <div className="form-group">
            <select className="form-input" name="status" defaultValue={property?.status ?? "vacant"}>
              <option value="rented">{t("property.rented")}</option>
              <option value="non_rental">{t("property.occupied")}</option>
              <option value="vacant">{t("property.vacant")}</option>
              <option value="sold">{t("property.sold")}</option>
            </select>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href={property ? "/dashboard/properties/" + property.id : "/dashboard/properties"}>
            <Button variant="secondary">{t("common.cancel")}</Button>
          </Link>
          <Button variant="primary" type="submit" disabled={isPending || photosUploading}>
            {isPending ? t("common.saving") : mode === "new" ? t("property.saveProperty") : t("property.saveChanges")}
          </Button>
        </div>
      </form>
    </>
  );
}

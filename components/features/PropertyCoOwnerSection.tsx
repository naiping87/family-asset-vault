"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { addCoOwnerAction, removeCoOwnerAction } from "@/app/dashboard/properties/[id]/co-owner-actions";
import type { CoOwner } from "@/types/database";

interface Props {
  propertyId: string;
  coOwners: CoOwner[];
}

export function PropertyCoOwnerSection({ propertyId, coOwners }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div className="section-title">👥 持有人</div>
        <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "取消" : "+ 添加持有人"}
        </Button>
      </div>

      {showForm && (
        <form
          action={async (formData: FormData) => {
            await addCoOwnerAction(propertyId, formData);
          }}
          style={{
            marginBottom: 12,
            padding: 16,
            background: "var(--glass-bg)",
            borderRadius: "var(--radius)",
          }}
        >
          <div className="form-row">
            <FormInput label="姓名" name="name" placeholder="持有人姓名" required />
            <FormInput label="邮箱" name="email" type="email" placeholder="email@example.com" />
          </div>
          <FormInput label="持有比例 (%)" name="ownership_pct" type="number" placeholder="50" />
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="sm" type="submit">保存</Button>
          </div>
        </form>
      )}

      {coOwners.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>暂无持有人信息</p>
      ) : (
        coOwners.map((owner, i) => (
          <div className="owner-item" key={owner.id}>
            <div
              className="owner-avatar"
              style={{
                background: i === 0
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "linear-gradient(135deg, #ec4899, #f472b6)",
              }}
            >
              {owner.name.charAt(0)}
            </div>
            <div className="owner-info">
              <div className="owner-name">{owner.name}</div>
              <div className="owner-role">{owner.is_primary ? "主要持有人" : "共同持有人"}</div>
            </div>
            <div className="owner-pct">{owner.ownership_pct}%</div>
            <form
              action={async () => {
                await removeCoOwnerAction(propertyId, owner.id);
              }}
            >
              <button className="owner-remove" type="submit">✕</button>
            </form>
          </div>
        ))
      )}
    </>
  );
}

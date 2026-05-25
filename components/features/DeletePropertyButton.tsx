"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { deletePropertyAction } from "@/app/dashboard/properties/[id]/actions";

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deletePropertyAction(propertyId);
      if (result?.error) {
        alert("删除失败: " + result.error);
      }
    });
  }

  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
        删除
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="确认删除"
        description="删除后无法恢复，确定要删除该房产吗？同时会删除关联的租约、税务和文件记录。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirm} disabled={pending}>
              {pending ? "删除中..." : "确认删除"}
            </Button>
          </>
        }
      />
    </>
  );
}

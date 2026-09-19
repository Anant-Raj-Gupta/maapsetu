"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { certificatePath } from "@/lib/public-url";

export function VerifySearch({ variant = "default" }: { variant?: "default" | "hero" }) {
  const { t } = useI18n();
  const router = useRouter();
  const [category, setCategory] = useState("certificates");

  const getPlaceholder = () => {
    switch (category) {
      case "pcr": return "PCR/TS/HYD/2025/12345";
      case "dir": return "DIR/TS/HYD/2025/67890";
      default: return "VC/TS/HYD/2025/00011";
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("code") || "");
    if (value) router.push(certificatePath(value.trim()));
  };

  if (variant === "hero") {
    return (
      <form className="hero-search" onSubmit={onSubmit}>
        <select 
          className="border-0 border-r border-gray-200 bg-transparent px-4 py-3 text-[#1b2430] outline-none font-medium cursor-pointer focus:bg-gray-50"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="certificates">Certificates</option>
          <option value="pcr">Packaged Commodities Registration</option>
          <option value="dir">Directors of companies</option>
        </select>
        <input
          name="code"
          aria-label={t("forms.searchAria")}
          placeholder={getPlaceholder()}
          defaultValue={getPlaceholder()}
          suppressHydrationWarning
          key={category}
        />
        <button type="submit" suppressHydrationWarning>{t("forms.search")}</button>
      </form>
    );
  }

  return (
    <form className="flex gap-0 overflow-hidden rounded-[2px] border" onSubmit={onSubmit}>
      <select 
        className="bg-gray-100 border-r border-gray-300 px-3 outline-none text-sm text-[#1b2430]"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="certificates">Certificates</option>
        <option value="pcr">Packaged Commodities Registration</option>
        <option value="dir">Directors of companies</option>
      </select>
      <input
        name="code"
        className="field !rounded-none !border-0 flex-1"
        placeholder={getPlaceholder()}
        defaultValue={getPlaceholder()}
        suppressHydrationWarning
        key={category}
      />
      <button className="btn btn-accent !rounded-none" suppressHydrationWarning>{t("forms.search")}</button>
    </form>
  );
}

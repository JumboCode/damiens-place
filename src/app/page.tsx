"use client";
import { useRouter } from "next/navigation";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import CommonButton from "@/components/common/CommonButton";

export default function Home() {
  const router = useRouter();
  return (
    <AuthPageLayout user="Developers">
      <h3 className="text-center"> Check out the apply flow below </h3>
      <div className="mt-8 items-center flex justify-center">
        <CommonButton
          title="Apply"
          onClick={() => {
            router.push("/apply");
          }}
          size="lg"
        />
      </div>
    </AuthPageLayout>
  );
}

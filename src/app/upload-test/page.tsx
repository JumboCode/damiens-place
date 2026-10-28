"use client";

import ProofOfResidenceUpload from "@/components/application/ProofOfResidenceUpload";

export default function TestPage() {
  function handleUploaded() {
    console.log("Upload finished");
    // e.g. router.push("/next-step") or setUploaded(true)
  }

  return <ProofOfResidenceUpload onUploaded={handleUploaded} />;
}

/**
 * ApplicantDetailView.tsx
 *
 * Displays applicants application for admin review.
 *
 * Author: Abby, Alex
 * Date Created: 11/18/26
 */
"use client";

import { useEffect, useState } from "react";
import {
  fetchApplicantDetail,
  type ApplicantDetail,
} from "@/lib/admin-api";
import { formatPantry } from "@/lib/time-conversion";
import Link from "next/link";
import ApplicantDecisionControls from "@/components/admin/ApplicantDecisionControls";


function Row({
    label,
    value,
    required = true,
  }: {
    label: string;
    value: string | number | null;
    required?: boolean;
  }) {
    return (
      <div className="flex flex-col gap-2">
        <dt className="font-['Inclusive_Sans'] text-[20px] font-medium text-[#1C1E1F]">
            {label}
            {required && <span className="text-red-600"> *</span>}
        </dt>
        <dd className="font-['Inclusive_Sans'] text-[18px] font-normal text-[#1C1E1F]">
            {value === null || value === "" ? "—" : value}
        </dd>
      </div>
    );
  }
  

/**
 * ApplicantDetailView /src/components/admin/
 *
 * Displays applicant's application for review.
 * 
 * @param applicantId - applicants id 
 * @returns applicant detail view
 *
 */
export default function ApplicantDetailView({
  applicantId,
}: {
  applicantId: string;
}) {
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [error, setError] = useState<{
    message: string;
    notFound: boolean;
  } | null>(null);

  async function loadApplicant() {
    const result = await fetchApplicantDetail(applicantId); 
    if (result.ok) {
      setApplicant(result.applicant);
      setError(null);
    } else {
      setApplicant(null);
      setError({
        message: result.message,
        notFound: result.notFound,
      });
    }
  }

    useEffect(() => {
    loadApplicant();
  }, [applicantId]);

  if (!applicant && !error) {
        return (
          <section className="py-10 text-center text-gray-500">
            Loading...
          </section>
        );
      }

      if (error?.notFound) {
        return (
          <section className="py-10 text-center text-gray-500">
            Applicant not found
          </section>
        );
      }

      if (error) {
        return (
          <section className="py-10 text-center text-red-500">
            {error.message}
          </section>
        );
      }
      if (!applicant) {
      return null;
    }

  return (
    <section className="space-y-10 px-8 py-6">
      <Link 
      href="/admin/applicants"
      className="group flex items-center gap-3 text-black transition-colors duration-200 hover:text-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11.7068 4.29279C11.8943 4.48031 11.9996 4.73462 11.9996 4.99979C11.9996 5.26495 11.8943 5.51926 11.7068 5.70679L6.41379 10.9998H19.9998C20.265 10.9998 20.5194 11.1051 20.7069 11.2927C20.8944 11.4802 20.9998 11.7346 20.9998 11.9998C20.9998 12.265 20.8944 12.5194 20.7069 12.7069C20.5194 12.8944 20.265 12.9998 19.9998 12.9998H6.41379L11.7068 18.2928C11.8889 18.4814 11.9897 18.734 11.9875 18.9962C11.9852 19.2584 11.88 19.5092 11.6946 19.6946C11.5092 19.88 11.2584 19.9852 10.9962 19.9875C10.734 19.9897 10.4814 19.8889 10.2928 19.7068L3.29279 12.7068C3.10532 12.5193 3 12.265 3 11.9998C3 11.7346 3.10532 11.4803 3.29279 11.2928L10.2928 4.29279C10.4803 4.10532 10.7346 4 10.9998 4C11.265 4 11.5193 4.10532 11.7068 4.29279V4.29279Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor"/>
        </svg>
        <h1 className="font-['Inclusive_Sans'] text-[24px] font-medium">
            Applicant Detail
        </h1>
      </Link>


      {/* TODO: the full submission sections from the Figma, including the submission date (formatPantry) and the minor release (age under 18 only). You can imitate the review page structure (apply step 5) which is already made (src/components/application/ReviewStep.tsx */}
    
      {/* TODO(natalie): Proof of residence is private and cannot be opened. */}
      
      <section className="mx-auto w-full max-w-[1344px]">
        <h2 className="mb-7 font-['Inclusive_Sans'] text-[27px] font-medium text-black">
            Personal Information
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            <Row label="First Name" value={applicant.firstName} />
            <Row label="Last Name" value={applicant.lastName} />
            <Row label="Age" value={applicant.age} />
            <Row label="Email" value={applicant.email} />
            <Row label="Cell Phone" value={applicant.cellPhone} />
            <Row label="Home Phone" value={applicant.homePhone} required={false} />
            </div>
            <div className="mt-10 max-w-sm mt-20">
                <Row label="Proof of Residence" value="Uploaded" />
            </div>
      </section>
      <section className="mx-auto w-full max-w-[1344px] mt-20">
        <h2 className="mb-7 font-['Inclusive_Sans'] text-[27px] font-medium text-black">
            Home Address
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
            <Row label="Street Address" value={applicant.street} />
            <Row label="City" value={applicant.city} />
            <Row label="State / Province / Region" value={applicant.state} />
            <Row label="ZIP / Postal Code" value={applicant.zip} />
        </div>
      </section>
      <section className="mx-auto w-full max-w-[1344px] mt-20">
        <h2 className="mb-7 font-['Inclusive_Sans'] text-[27px] font-medium text-black">
            Emergency Contact
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            <Row label="Emergency Contact Name" value={applicant.emergencyContactName} />
            <Row
                label="Emergency Contact Phone"
                value={applicant.emergencyContactPhone}
            />
            <Row
                label="Relationship to Volunteer"
                value={applicant.emergencyContactRelationship}
                required={false}
            />
        </div>
      </section>
      <section className="mx-auto w-full max-w-[1344px] mt-20">
        <h2 className="mb-7 font-['Inclusive_Sans'] text-[27px] font-medium text-black">
            All Volunteer Positions
        </h2>
        <div className="flex flex-col gap-4">
        <Row
            label="Position of Interest"
            value={applicant.positions.map((position) => position.name).join(", ")}
        />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1344px] mt-20">
        <h2 className="mb-7 font-['Inclusive_Sans'] text-[27px] font-medium text-black">
            Time Available
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
            <Row
                label="Days of Week Available"
                value={applicant.availableDays
                .map((day) => day.charAt(0) + day.slice(1).toLowerCase())
                .join(", ")}
            />
            <Row
                label="Hours Available on Those Days"
                value={applicant.availableHours ?? ""}
            />
        </div>
      </section>
      <section className="mx-auto w-full max-w-[1344px]">
        <h2 className="mb-5 font-['Inclusive_Sans'] text-[27px] font-medium text-black mt-20">
            Disability
        </h2>
        <div className="flex flex-col gap-6">
            <Row 
                label="Disability Report" 
                value={applicant.hasDisability == null
                    ? ""
                    : applicant.hasDisability
                      ? "Yes, I have a disability."
                      : "No, I don't have a disability."
                    } 
            />
                {applicant.hasDisability === true && (
            <Row
                label="Disability Details"
                value={applicant.disabilityDetails}
                required={false}
            />
            )}
        </div>
      </section>
      <section className="mx-auto w-full max-w-[1344px]">
        <h2 className="mb-5 font-['Inclusive_Sans'] text-[27px] font-medium text-black mt-20">
            Volunteer Agreement
        </h2>
        <div className="flex flex-col gap-10">
            <Row
                label="Volunteer Waiver"
            value={applicant.waiverSignature ?? ""}
            />

            <Row
                label="Volunteer Agreement"
                value={applicant.agreementSignature ?? ""}
            />
            {applicant.age < 18 && ( 
              <>
              <Row
                label="Parent/Legal Guardian E-Signature"
                value={applicant.minorGuardianSignature}
              />
              <Row
                label="Minor E-Signature"
                value={applicant.minorSignature}
              />

              </> 
            )}
            
        </div>
      </section>
  
      <section className="w-full">
        <ApplicantDecisionControls
          applicantId={applicant.id}
          status={applicant.status as "SUBMITTED" | "APPROVED" | "REJECTED"}
          onDecided={() => {
            loadApplicant();
          }}
        />
      </section>
    </section>
  
  );
}
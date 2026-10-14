/**
 * src/app/sign-in/page.tsx
 *
 * Layout where VolunteerSignInForm is being called.
 *
 * Author: Rim and Abby
 * Date Created: 10/10/2026
 */
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import VolunteerSignInForm from "@/components/auth/VolunteerSignInForm";

export default function VolunteerSignInPage() {
  return (
    <AuthPageLayout user="Volunteer">
      {/* call your volunteer sign in form component here */}
      <VolunteerSignInForm />
      {/* also add any subtitles to the auth page layout wrapper... see figma*/}
    </AuthPageLayout>
  );
}

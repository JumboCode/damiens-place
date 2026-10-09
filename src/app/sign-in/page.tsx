// TODO: file header
// import AuthPageLayout and the VolunteerSignInForm you made!
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import VolunteerSignInForm from "@/components/auth/VolunteerSignInForm";

export default function VolunteerSignInPage() {
  return (
    <AuthPageLayout
      title="Volunteer Sign in Page"
      subtitel="Please enter a phone and email to get started"
    >
      {/* call your volunteer sign in form component here */}
      <VolunteerSignInForm />
      {/* also add any subtitles to the auth page layout wrapper... see figma*/}
    </AuthPageLayout>
  );
}

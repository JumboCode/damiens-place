import AuthPageLayout from "@/components/auth/AuthPageLayout";
import StepProgress from "@/components/application/StepProgress";
import ApplicationFormShell from "@/components/application/ApplicationFormShell";

export default function Home() {
  return (
    <AuthPageLayout user="Developers">
      <p> For frontend devs - here is where your content will go! </p>
    </AuthPageLayout>
  );
}

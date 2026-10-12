import ApplicantSettingsForm from "@/features/applicant/component/applicant-settings-form"
import { getApplicantSettings } from "@/features/applicant/server/settings"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
    const profile = await getApplicantSettings()
    if (!profile) redirect("/login")

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
                <p className="text-muted-foreground">
                    Manage your personal information and professional profile.
                </p>
            </div>

            <ApplicantSettingsForm initialData={profile} />
        </div>
    )
}

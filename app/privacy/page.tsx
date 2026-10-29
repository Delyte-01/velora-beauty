import { siteConfig } from '@/config/site';



export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-NG')}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          This is a demonstration website for {siteConfig.name}. This privacy policy is a
          placeholder provided for completeness. A real store should replace this with a
          policy reviewed by a qualified professional.
        </p>
        <section>
          <h2 className="font-heading text-lg text-foreground">Information we collect</h2>
          <p className="mt-2">
            This demo does not send any data to a server. Information you enter in forms
            (such as checkout or contact) is stored only in your browser and is not
            transmitted anywhere.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">How we use information</h2>
          <p className="mt-2">
            In a real deployment, your information would be used to process orders, respond
            to enquiries, and improve our services. This demo does not perform any of those
            actions.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">Your rights</h2>
          <p className="mt-2">
            You can clear all demo data at any time by clearing your browser storage. For
            questions about a real deployment, contact {siteConfig.email}.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">Contact</h2>
          <p className="mt-2">
            For any privacy-related questions, reach us at {siteConfig.email} or
            {siteConfig.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}

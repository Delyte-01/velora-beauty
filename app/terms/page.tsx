import { siteConfig } from '@/config/site';



export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-NG')}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          These terms are a placeholder for {siteConfig.name}. A real store should replace
          them with terms reviewed by a qualified professional.
        </p>
        <section>
          <h2 className="font-heading text-lg text-foreground">Demo nature</h2>
          <p className="mt-2">
            This website is a demonstration. No payments are processed, no orders are
            fulfilled, and no appointments are confirmed. All product prices and service
            fees are fictional sample data.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">Use of the site</h2>
          <p className="mt-2">
            You agree to use this website responsibly and not to misuse any forms or
            features. Content, imagery, and data are for demonstration purposes only.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">Liability</h2>
          <p className="mt-2">
            {siteConfig.name} is not liable for any actions taken based on this demo
            website. All information is provided "as is" without warranty.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg text-foreground">Contact</h2>
          <p className="mt-2">
            For questions about these terms, contact {siteConfig.email}.
          </p>
        </section>
      </div>
    </div>
  );
}

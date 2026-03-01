import { Navbar } from '@/components/navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl py-10 prose prose-sm sm:prose-base">
        <h1>Privacy Policy</h1>
        <p>
          RailSwap is a simple listing platform that connects people who have unused
          railway tickets with passengers who are looking for tickets. We do not sell
          tickets ourselves and we do not act as an agent for Indian Railways or IRCTC.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            Basic profile information from Google sign in (name, email, profile photo).
          </li>
          <li>
            Contact details you choose to share on listings (for example, your mobile
            number).
          </li>
          <li>Ticket details you submit when you create a listing.</li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>To create your RailSwap account and show your listings to other users.</li>
          <li>To display your contact details to potential buyers if you choose to.</li>
          <li>To keep the platform secure and prevent abuse.</li>
        </ul>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell your data to third parties.</li>
          <li>We do not handle payments between buyers and sellers.</li>
          <li>
            We do not verify the authenticity of tickets or the identity of users. You
            must verify these yourself before dealing with anyone.
          </li>
        </ul>

        <h2>Responsibility and fraud</h2>
        <p>
          RailSwap is only a listing and discovery tool. All communication, ticket
          transfers, and payments happen directly between users. We are{' '}
          <strong>not responsible</strong> for:
        </p>
        <ul>
          <li>Any fraud, fake tickets, or misrepresentation by users.</li>
          <li>Any money lost, chargebacks, or disputes between buyers and sellers.</li>
          <li>Any penalties imposed by Indian Railways, IRCTC, or other authorities.</li>
        </ul>
        <p>
          Please check ticket details carefully, speak to the other party, and use safe
          payment methods. If something feels suspicious, do not proceed.
        </p>

        <h2>Contact</h2>
        <p>
          If you have privacy questions about RailSwap you can contact the developer of
          this project directly through the support channels where the app is hosted.
        </p>
      </main>
    </div>
  );
}


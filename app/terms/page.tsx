import { Navbar } from '@/components/navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl py-10 prose prose-sm sm:prose-base">
        <h1>Terms &amp; Conditions</h1>

        <h2>About RailSwap</h2>
        <p>
          RailSwap is a community platform that helps users list and discover unused
          railway tickets. It is an independent project and is{' '}
          <strong>not affiliated</strong> with Indian Railways, IRCTC, or any government
          body.
        </p>

        <h2>Your responsibilities</h2>
        <ul>
          <li>You are fully responsible for the tickets you list and the information you share.</li>
          <li>
            You must follow all applicable laws and railway rules when buying or selling
            tickets.
          </li>
          <li>
            You must verify the other party&apos;s details and the ticket before making
            any payment.
          </li>
        </ul>

        <h2>No guarantee, no liability</h2>
        <p>
          RailSwap only provides a way for people to find each other. We do not act as an
          agent, broker, or middleman. By using the platform you agree that RailSwap and
          its developer:
        </p>
        <ul>
          <li>Do not guarantee that any ticket is valid, transferrable, or usable.</li>
          <li>Do not guarantee that any user is genuine or trustworthy.</li>
          <li>
            Are <strong>not responsible</strong> for any fraud, scam, loss of money, or
            other damage that happens between users.
          </li>
        </ul>

        <p>
          Always double‑check ticket PNR, passenger details, and train information.
          Prefer safe payment options and avoid sending money to unknown people without
          proper verification.
        </p>

        <h2>Prohibited behaviour</h2>
        <ul>
          <li>Posting false, misleading, or fake tickets.</li>
          <li>Impersonating someone else or using stolen identities.</li>
          <li>Using RailSwap for any illegal activity or to violate railway rules.</li>
        </ul>

        <p>
          We reserve the right to remove listings or restrict access to the platform if
          we suspect abuse, fraud, or violation of these terms.
        </p>
      </main>
    </div>
  );
}


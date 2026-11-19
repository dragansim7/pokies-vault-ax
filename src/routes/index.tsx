import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/shell";
import { Directory } from "@/components/directory";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppFrame>
      <Directory />
      <section className="story">
        <h2>One place for the sites you actually use</h2>
        <div className="story-grid">
          <article className="story-card">
            <h3>The list</h3>
            <p>
              The list starts empty. Add the sites you use in Domain Intel. Nothing is loaded for you.
            </p>
          </article>
          <article className="story-card">
            <h3>The fetch</h3>
            <p>
              The login that worked is remembered for that site and tried first next time. New sites use the
              phone and password you enter. A hit keeps the site. A rejection does not.
            </p>
          </article>
          <article className="story-card">
            <h3>What you see</h3>
            <p>
              Cash, commission, share, referral, welcome, and rebate — plus the rest of the bonuses sitting on
              the account. Unlimited checks. No credits to buy.
            </p>
          </article>
        </div>
      </section>
    </AppFrame>
  );
}

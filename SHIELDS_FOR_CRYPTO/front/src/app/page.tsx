import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-6">
      <div className="min-h-screen">
        <h1 className="font-bold text-7xl mb-6 pt-24 text-center">
          "When injustice becomes law, resistance becomes duty." <br /> - Thomas Jefferson
        </h1>
        <p className="text-2xl leading-relaxed text-center">
          Unleashing a Cry Against Injustice: The SEC and Crypto's David vs. Goliath Moment. In a
          world that values liberty and the pursuit of innovation, the SEC's aggressive stance
          towards crypto contradicts America's foundational ethos. This isn't just a regulatory
          scuffle; it's a stand for our digital rights, a fight for financial autonomy.
        </p>
        <div className="h-96 w-[30rem] mt-6 relative mx-auto">
          <Image fill={true} alt="battle" src="/battle.jpg" />
        </div>
      </div>
      <div className="py-32 min-h-[50rem]">
        <p className="leading-relaxed text-center text-2xl">
          The skirmish ignited with Coinbase's defiant Stand With Crypto NFT launch, but that was
          only the prelude.
        </p>
        <h2 className="font-bold my-10 text-center text-5xl">It Started With Coinbase</h2>
        <div>
          <div className="h-[30rem] w-[30rem] relative mx-auto">
            <Link href="https://zora.co/collect/eth:0x9d90669665607f08005cae4a7098143f554c59ef">
              <Image src="/coinbase.png" fill={true} alt="coinbase" />
            </Link>
          </div>
          <div className="text-slate-400 text-base text-center">Click Image To Mint</div>
        </div>
      </div>

      <p className="text-2xl leading-relaxed text-center">
        Champions of the cause, Polygon, Gnosis, and ApeCoin are stepping up, minting shields as
        tokens of resistance, if you hold the Coinbase Stand With Crypto. Every shield you mint
        makes you eligible for a unique airdrop, giving you a direct voice in our battle strategy.
      </p>

      <h2 className="font-bold text-7xl py-12 text-center">Join The Fight</h2>
      <div className="flex flex-col gap-28 justify-between mb-36">
        <div>
          <h3 className="font-bold text-5xl mb-4 text-center text-violet-500">
            Polygon Stands With Crypto
          </h3>
          <div className="h-[43rem] w-[60rem] relative mx-auto">
            <Link href="/polygon">
              <Image src="/polygon.png" fill={true} alt="polygon" />
            </Link>
          </div>
          <div className="text-slate-400 text-2xl text-center">Click Image To Mint</div>
        </div>
        <div>
          <h3 className="font-bold text-5xl mb-4 text-center text-green-500">
            Gnosis Stands With Crypto
          </h3>
          <div className="h-[43rem] w-[60rem] relative mx-auto">
            <Link href="/gnosis">
              <Image src="/gnosis.png" fill={true} alt="gnosis" />
            </Link>
          </div>
          <div className="text-slate-400 text-2xl text-center">Click Image To Mint</div>
        </div>

        <div>
          <h3 className="font-bold text-5xl mb-4 text-center text-sky-600">
            ApeCoin Stands With Crypto
          </h3>
          <div className="h-[43rem] w-[60rem] relative mx-auto">
            <Link href="/ape">
              <Image src="/apedao.png" fill={true} alt="apedao" />
            </Link>
          </div>
          <div className="text-slate-400 text-2xl text-center">Click Image To Mint</div>
        </div>
      </div>
      <div className="py-36">
        <p className="text-3xl leading-relaxed text-center">
          This fight isn't for the passive bystander. It's for the believer, the innovator, the
          fighter. Driven by the advanced{" "}
          <Link href={"https://www.sismo.io/"} className="text-5xl font-bold text-slate-400">
            Sismo Connect
          </Link>
          , our application robustly checks against airdrop farmers, ensuring only genuine
          supporters partake in this crusade. By generating a ZK proof, Sismo Connect enables users
          to establish ownership without revealing their identity or depositing address, fortifying
          privacy. In this fight, your privacy is paramount and the government doesn't need to know
          you're joining this battle. Together, we're not just reshaping finance, we're defining our
          digital destiny.
        </p>

        <p className="text-center pt-12 font-bold text-5xl">
          Rise, resist, redefine markets. Join us in our digital revolution!
        </p>
      </div>
    </main>
  );
}

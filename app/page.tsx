"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  soldOut?: boolean;
  allergens?: string[];
};

type CartItem = Product & { cartId: number; quantity: number; option?: string; note?: string; unitPrice: number };

const categories = ["Alles", "Populair", "Patat", "Snacks", "Broodjes", "Hamburgers", "Plate service", "Lunch", "Sauzen", "Dranken"];

const products: Product[] = [
  { id: 1, name: "Patat Pollo", description: "Krokante patat met vers gebakken malse kipdijreepjes", price: 9.5, category: "Patat", popular: true, image: "https://ugc.zenchef.com/3/6/8/7/7/7/1/5/4/0/5/0/0/1738256049_411/e536e15a337f518401689c3aafb8446c.clandscape_hd.jpg", allergens: ["Gluten"] },
  { id: 2, name: "Thuus dubbele burger", description: "Dubbele 100% rundburger, kaas, sla, augurk en huisgemaakte saus", price: 9.5, category: "Hamburgers", popular: true, image: "https://cyprus.wiz-guide.com/assets/modules/kat/articles/201810/1124/editor/syno.jpg", allergens: ["Gluten", "Melk"] },
  { id: 3, name: "Elitekroket", description: "Onze krokante 100% rund-kroket", price: 3.4, category: "Snacks", popular: true, image: "https://dutchsnackscompany.co.uk/wp-content/uploads/2024/10/DSC_Kroket-8.jpeg", allergens: ["Gluten", "Melk"] },
  { id: 4, name: "Kapsalon pollo", description: "Patat, kipreepjes, kaas, frisse salade en knoflooksaus", price: 11.5, category: "Patat", popular: true, image: "https://cdn.thefork.com/tf-lab/image/upload/w_640,c_fill,q_auto,f_auto/restaurant/717c4055-b24a-4751-9746-72d3d2761acc/47646073-f13c-4021-b312-fa589efd599f.png", allergens: ["Melk"] },
  { id: 5, name: "Patat", description: "Goudgeel gebakken, saus standaard in een apart vakje", price: 3.5, category: "Patat", image: "https://tb-static.uber.com/prod/image-proc/processed_images/b591f0eaa2a02783ddd7419c3cab616f/b92d4926516c2635a39581f43cd533a0.jpeg" },
  { id: 6, name: "Grote patat", description: "Een royale portie verse, krokante patat", price: 5.2, category: "Patat", image: "https://static.where-e.com/United_Kingdom/England/Greater_London/Tigers-Diner_6488e538b94b1f7c1d4df97c465bf23a.jpg" },
  { id: 7, name: "Frikandel speciaal", description: "Met curry, fritessaus en verse uitjes", price: 3.6, category: "Snacks", image: "https://dutchsnackscompany.co.uk/wp-content/uploads/2024/10/DSC_Kroket-8.jpeg", allergens: ["Gluten"] },
  { id: 8, name: "Kaassoufflé", description: "Krokant van buiten, romig van binnen", price: 3.3, category: "Snacks", soldOut: true, image: "https://dutchsnackscompany.co.uk/wp-content/uploads/2024/10/DSC_Kroket-8.jpeg", allergens: ["Gluten", "Melk", "Ei"] },
  { id: 9, name: "Broodje Pollo pittig", description: "Malse kipdijreepjes, knapperige salade en pittige saus", price: 9, category: "Broodjes", image: "https://www.hashtagburgersandwaffles.com.au/wp-content/uploads/2023/08/Background7.webp" },
  { id: 10, name: "Hamburger bacon & cheese", description: "100% rund, bacon, kaas, sla, augurk en burgersaus", price: 7.2, category: "Hamburgers", image: "https://www.obraise-restaurants.fr/assets/images/burger-ns.jpg", allergens: ["Gluten", "Melk"] },
  { id: 11, name: "Plate Schnitzel Bakhuus", description: "Met gebakken ui en champignons, salade, patat en groenten", price: 17, category: "Plate service", image: "https://static.wixstatic.com/media/965a71_3217e9d7a1ec4502bebfceb328cec64a~mv2.jpg/v1/fill/w_980,h_1307,al_c,q_85/965a71_3217e9d7a1ec4502bebfceb328cec64a~mv2.jpg" },
  { id: 12, name: "Twaalfuurtje", description: "Kroket, ham, gebakken ei en gesmolten kaas op witbrood", price: 7.5, category: "Lunch", image: "https://www.stackedpancakehouse.ca/api/image-proxy?url=https%3A%2F%2Fd3tzpe3210s0tc.cloudfront.net%2F27-08-25_NewMenu_KSM_Stacked_3847_FULL-2400x3600.jpg" },
  { id: 13, name: "Bakje fritessaus", description: "Klein bakje", price: 1.5, category: "Sauzen", image: "https://tb-static.uber.com/prod/image-proc/processed_images/b591f0eaa2a02783ddd7419c3cab616f/b92d4926516c2635a39581f43cd533a0.jpeg" },
  { id: 14, name: "Coca-Cola", description: "Blik 330 ml, inclusief statiegeld", price: 3, category: "Dranken", image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80" },
];

const euro = (value: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(value);

export default function Home() {
  const [category, setCategory] = useState("Alles");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [sauce, setSauce] = useState("Geen saus");
  const [note, setNote] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [done, setDone] = useState(false);
  const [favorite, setFavorite] = useState<number[]>([1, 2]);
  const [fulfilment, setFulfilment] = useState("Afhalen");
  const [pay, setPay] = useState("iDEAL");

  const filtered = useMemo(() => products.filter((p) => {
    const cat = category === "Alles" || (category === "Populair" ? p.popular : p.category === category);
    return cat && `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase());
  }), [category, query]);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addProduct(product: Product, option = "", productNote = "") {
    const extra = option && option !== "Geen saus" ? 1 : 0;
    setCart((items) => [...items, { ...product, cartId: Date.now() + Math.random(), quantity: 1, option, note: productNote, unitPrice: product.price + extra }]);
    setSelected(null); setSauce("Geen saus"); setNote(""); setCartOpen(true);
  }
  function changeQty(cartId: number, delta: number) {
    setCart((items) => items.map((i) => i.cartId === cartId ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0));
  }
  function goMenu(cat = "Alles") {
    setCategory(cat); document.getElementById("bestellen")?.scrollIntoView({ behavior: "smooth" });
  }

  if (done) return <Confirmation cart={cart} total={subtotal} fulfilment={fulfilment} onHome={() => { setDone(false); setCheckout(false); setCart([]); }} />;
  if (checkout) return <Checkout cart={cart} subtotal={subtotal} fulfilment={fulfilment} setFulfilment={setFulfilment} pay={pay} setPay={setPay} onBack={() => setCheckout(false)} onDone={() => setDone(true)} />;

  return (
    <main>
      <div className="topbar">Rijksweg 42A, Duiven <span>·</span> Vandaag open tot 21:30</div>
      <header className="header">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Naar boven">
          <img src="/bakhuus-logo.jpg" alt="’t Bakhuus" />
        </button>
        <nav><a href="#bestellen">Menukaart</a><a href="#verhaal">Over ons</a><a href="#opening">Openingstijden</a></nav>
        <button className="cart-button" onClick={() => count ? setCartOpen(true) : goMenu()}><span>{count ? "Mandje" : "Bestellen"}</span><b>{count || "→"}</b></button>
      </header>

      <section className="hero">
        <div className="hero-photo" />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="hero-kicker">Cafetaria ’t Bakhuus · Duiven</p>
          <h1>Zin in een<br/>goede friet?</h1>
          <p>Bestel online. Wij bakken het vers en zorgen dat het op tijd voor je klaarstaat.</p>
          <div className="hero-actions"><button className="primary" onClick={() => goMenu()}>Bestel online</button><a href="tel:0316253275">Of bel 0316 25 32 75</a></div>
        </div>
        <div className="open-card"><span className="pulse"/><div><b>We zijn vandaag open</b><small>Rijksweg 42A, Duiven</small></div><strong>tot 21:30</strong></div>
      </section>

      <section className="welcome-strip">
        <div><b>Vandaag geen zin om te koken?</b><span>Geen probleem. Kies wat lekkers uit en wij gaan voor je aan de slag.</span></div>
        <button onClick={() => goMenu("Populair")}>Bekijk wat vaak besteld wordt →</button>
      </section>

      <section id="bestellen" className="order-section">
        <div className="section-head"><div><p className="section-label">ONLINE BESTELLEN</p><h2>Wat wil je eten?</h2></div><p>Friet, snacks, broodjes of een stevige plate. Kies je favorieten en pas ze aan zoals jij ze graag hebt.</p></div>
        <div className="order-tools">
          <div className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek in onze menukaart..." aria-label="Zoeken in menu" /></div>
          <div className="category-scroll">{categories.map((c) => <button className={category === c ? "active" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>)}</div>
        </div>
        <div className="results-line"><b>{category === "Alles" ? "Ons menu" : category}</b><span>{filtered.length} gerechten</span></div>
        <div className="products">
          {filtered.map((p) => <article className={`product ${p.soldOut ? "sold" : ""}`} key={p.id}>
            <div className="product-image"><img src={p.image} alt="" /><button className={favorite.includes(p.id) ? "fav active" : "fav"} onClick={() => setFavorite((f) => f.includes(p.id) ? f.filter(id => id !== p.id) : [...f, p.id])} aria-label="Favoriet">♥</button>{p.popular && <span className="popular">POPULAIR</span>}{p.soldOut && <span className="sold-label">Vandaag uitverkocht</span>}</div>
            <div className="product-body"><div><h3>{p.name}</h3><p>{p.description}</p>{p.allergens && <small>ⓘ Bevat {p.allergens.join(", ").toLowerCase()}</small>}</div><div className="product-bottom"><b>{euro(p.price)}</b><button disabled={p.soldOut} onClick={() => setSelected(p)} aria-label={`${p.name} toevoegen`}>+</button></div></div>
          </article>)}
        </div>
      </section>

      <section className="reviews"><div><span>★★★★★</span><b>Wat vinden onze gasten?</b><small>Lees de ervaringen van bezoekers uit Duiven en omgeving.</small></div><a href="https://www.google.com/search?q=%27t+Bakhuus+Duiven+reviews" target="_blank">Bekijk onze reviews op Google →</a></section>

      <section id="verhaal" className="story"><div className="story-image"/><div className="story-copy"><p className="section-label">GEWOON HIER IN DUIVEN</p><h2>Een vertrouwde plek voor iets lekkers.</h2><p>’t Bakhuus is zo’n zaak waar je gewoon even binnenloopt. Voor een frietje na het werk, een broodje tijdens de lunch of een makkelijke maaltijd voor het hele gezin.</p><p>We maken je bestelling pas als jij hem bestelt. Dan is hij warm en vers wanneer je hem komt halen.</p><button onClick={() => goMenu()} className="text-link">Bekijk de menukaart →</button></div></section>

      <section id="opening" className="info-section"><div className="info-intro"><p className="section-label">KOM LANGS</p><h2>Je vindt ons aan de Rijksweg.</h2><p><b>’t Bakhuus Duiven</b><br/>Rijksweg 42A<br/>6921 AH Duiven</p><p><a href="tel:0316253275">0316 25 32 75</a><br/><a href="mailto:bakhuusduiven@hotmail.com">bakhuusduiven@hotmail.com</a></p><a className="route-link" href="https://www.google.com/maps/search/?api=1&query=Rijksweg+42A+Duiven" target="_blank">Bekijk de route op Google Maps →</a></div><div className="map"><span>’t BAKHUUS</span><small>Rijksweg 42A</small></div><div className="hours"><h3>Wanneer zijn we open?</h3>{[["Maandag","Gesloten"],["Dinsdag","11:30 – 21:00"],["Woensdag","11:30 – 21:00"],["Donderdag","11:30 – 21:00"],["Vrijdag","11:30 – 21:30"],["Zaterdag","11:30 – 21:30"],["Zondag","12:00 – 21:30"]].map(([d,t],i)=><div className={i===5?"today":""} key={d}><span>{d}{i===5&&<small>Vandaag</small>}</span><b>{t}</b></div>)}</div></section>
      <section className="last-order"><div><b>Vanavond iets makkelijks?</b><span>Bestel online, kies je tijd en haal het warm bij ons op.</span></div><button onClick={() => goMenu()}>Bestellen</button></section>
      <footer id="contact"><div className="footer-brand"><div className="brand"><img src="/bakhuus-logo-purple.jpg" alt="’t Bakhuus" /></div><p>Gewoon goed eten.<br/>Lekker dichtbij.</p></div><div><b>Contact</b><a href="https://www.google.com/maps/search/?api=1&query=Rijksweg+42A+Duiven">Rijksweg 42A<br/>6921 AH Duiven</a><a href="tel:0316253275">0316 25 32 75</a></div><div><b>Snel naar</b><a href="#bestellen">Online bestellen</a><a href="#opening">Openingstijden</a><a href="#verhaal">Over ons</a></div><div className="newsletter"><b>Blijf op de hoogte</b><p>Ontvang onze acties en nieuwe specials.</p><label><input placeholder="Jouw e-mailadres"/><button>→</button></label></div><small className="copyright">© 2026 ’t Bakhuus Duiven · Privacy · Algemene voorwaarden</small></footer>

      {selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><div className="product-modal" onMouseDown={(e)=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><img src={selected.image} alt=""/><div className="modal-content"><div className="eyebrow"><i/> SAMENSTELLEN</div><h2>{selected.name}</h2><p>{selected.description}</p><fieldset><legend>Kies je saus <small>optioneel</small></legend>{["Geen saus","Fritessaus + € 1,00","Curry + € 1,00","Speciaal + € 1,00","Satésaus + € 1,00"].map(s=><label key={s}><input type="radio" name="sauce" checked={sauce===s} onChange={()=>setSauce(s)}/><span>{s}</span></label>)}</fieldset><label className="note">Opmerking <small>optioneel</small><textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Bijv. saus apart verpakken"/></label><button className="add-wide" onClick={()=>addProduct(selected,sauce,note)}>Toevoegen aan mandje <b>{euro(selected.price + (sauce!=="Geen saus"?1:0))}</b></button></div></div></div>}
      {cartOpen && <><div className="drawer-backdrop" onClick={()=>setCartOpen(false)}/><aside className="cart-drawer"><div className="drawer-head"><div><small>JOUW BESTELLING</small><h2>Winkelmandje <span>{count}</span></h2></div><button onClick={()=>setCartOpen(false)}>×</button></div>{cart.length===0?<div className="empty"><span>🍟</span><h3>Nog niets gekozen</h3><p>Je favoriete gerechten wachten op je.</p><button onClick={()=>setCartOpen(false)}>Bekijk het menu</button></div>:<><div className="cart-items">{cart.map(item=><div className="cart-item" key={item.cartId}><img src={item.image} alt=""/><div><b>{item.name}</b>{item.option&&item.option!=="Geen saus"&&<small>{item.option}</small>}<div className="qty"><button onClick={()=>changeQty(item.cartId,-1)}>−</button><span>{item.quantity}</span><button onClick={()=>changeQty(item.cartId,1)}>+</button></div></div><strong>{euro(item.unitPrice*item.quantity)}</strong></div>)}</div><div className="upsell"><div><b>Lekker erbij?</b><span>Maak je bestelling compleet</span></div><div className="upsell-items">{[products[13],products[2],products[12]].map(p=><button key={p.id} onClick={()=>addProduct(p)}><img src={p.image} alt=""/><span><b>{p.name}</b><small>{euro(p.price)}</small></span><i>+</i></button>)}</div></div><div className="cart-total"><div><span>Subtotaal</span><b>{euro(subtotal)}</b></div><small>Inclusief btw · Geen bestelkosten</small><button onClick={()=>{setCartOpen(false);setCheckout(true)}}>Doorgaan naar afrekenen <span>→</span></button></div></>}</aside></>}
      {count>0&&!cartOpen&&<button className="mobile-cart" onClick={()=>setCartOpen(true)}><span><b>{count}</b> Bekijk winkelmandje</span><strong>{euro(subtotal)}</strong></button>}
      {count===0&&<button className="mobile-order" onClick={()=>goMenu()}>Bestellen <span>→</span></button>}
    </main>
  );
}

function Checkout({cart, subtotal, fulfilment, setFulfilment, pay, setPay, onBack, onDone}:{cart:CartItem[];subtotal:number;fulfilment:string;setFulfilment:(s:string)=>void;pay:string;setPay:(s:string)=>void;onBack:()=>void;onDone:()=>void}) {
  const [time,setTime]=useState("18:15"); const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [email,setEmail]=useState(""); const [error,setError]=useState(false);
  return <main className="checkout-page"><header className="checkout-header"><button onClick={onBack}>← Terug naar menu</button><div className="brand"><img src="/bakhuus-logo.jpg" alt="’t Bakhuus" /></div><span>Veilig afrekenen 🔒</span></header><div className="checkout-wrap"><div className="checkout-main"><div className="checkout-title"><small>BIJNA KLAAR</small><h1>Rond je bestelling af</h1><p>Vul je gegevens in en kies wanneer je de bestelling wilt ophalen.</p></div><section><div className="step"><b>1</b><h2>Hoe wil je bestellen?</h2></div><div className="choice-row">{["Afhalen","Bezorgen"].map((x,i)=><button className={fulfilment===x?"selected":""} onClick={()=>setFulfilment(x)} key={x}><span>{i===0?"🛍":"🚲"}</span><div><b>{x}</b><small>{i===0?"Gratis · Rijksweg 42A":"Vanaf € 2,50 · beperkte zone"}</small></div><i>✓</i></button>)}</div></section><section><div className="step"><b>2</b><h2>Kies je afhaaltijd</h2></div><div className="time-grid">{["Zo snel mogelijk","17:45","18:00","18:15","18:30","18:45"].map(t=><button className={time===t?"selected":""} onClick={()=>setTime(t)} key={t}>{t}{t==="Zo snel mogelijk"&&<small>± 20 min</small>}</button>)}</div></section><section><div className="step"><b>3</b><h2>Jouw gegevens</h2></div><div className="form-grid"><label>Naam *<input value={name} onChange={e=>setName(e.target.value)} placeholder="Voor- en achternaam"/></label><label>Telefoonnummer *<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="06 12 34 56 78"/></label><label className="full">E-mailadres *<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="naam@voorbeeld.nl" type="email"/></label><label className="full">Opmerking<textarea placeholder="Heb je nog een opmerking voor de keuken?"/></label></div>{error&&<p className="form-error">Vul je naam, telefoonnummer en e-mailadres in.</p>}</section><section><div className="step"><b>4</b><h2>Betaalmethode</h2></div><div className="payment-options"><button className={pay==="iDEAL"?"selected":""} onClick={()=>setPay("iDEAL")}><span className="ideal">iD</span><div><b>iDEAL</b><small>Betaal veilig via je eigen bank</small></div><i>✓</i></button><button className={pay==="Bij afhalen"?"selected":""} onClick={()=>setPay("Bij afhalen")}><span>💳</span><div><b>Betalen bij afhalen</b><small>Pin of contant in de zaak</small></div><i>✓</i></button></div></section></div><aside className="summary"><h2>Jouw bestelling</h2><div className="summary-time"><span>🛍</span><div><b>{fulfilment}</b><small>Vandaag om {time}</small></div><button onClick={onBack}>Wijzig</button></div>{cart.map(i=><div className="summary-item" key={i.cartId}><span>{i.quantity}×</span><div><b>{i.name}</b><small>{i.option}</small></div><strong>{euro(i.unitPrice*i.quantity)}</strong></div>)}<div className="summary-total"><div><span>Subtotaal</span><b>{euro(subtotal)}</b></div><div><span>Bestelkosten</span><b>Gratis</b></div><div className="total"><span>Totaal</span><strong>{euro(subtotal)}</strong></div></div><button className="pay-button" onClick={()=>{if(!name||!phone||!email){setError(true);return;}onDone();}}>Bestelling plaatsen <span>{euro(subtotal)}</span></button><small className="demo-note">Bij deze demonstratie wordt geen echte betaling uitgevoerd.</small></aside></div></main>
}

function Confirmation({cart,total,fulfilment,onHome}:{cart:CartItem[];total:number;fulfilment:string;onHome:()=>void}) { return <main className="confirmation"><div className="conf-card"><div className="conf-check">✓</div><div className="eyebrow"><i/> BESTELLING ONTVANGEN</div><h1>Bedankt voor<br/>je bestelling!</h1><p>We gaan meteen voor je aan de slag. Je bestelling staat vandaag om <b>18:15</b> voor je klaar.</p><div className="order-number"><span>BESTELNUMMER</span><b>#BH-2847</b></div><div className="conf-summary"><div><span>{fulfilment}</span><b>Vandaag, 18:15</b></div>{cart.map(i=><div key={i.cartId}><span>{i.quantity}× {i.name}</span><b>{euro(i.quantity*i.unitPrice)}</b></div>)}<div><strong>Totaal</strong><strong>{euro(total)}</strong></div></div><div className="pickup"><b>📍 Ophalen bij ’t Bakhuus</b><span>Rijksweg 42A, 6921 AH Duiven</span></div><button onClick={onHome}>Terug naar de homepage</button><small>Een bevestiging is verzonden naar je e-mailadres.</small></div></main> }

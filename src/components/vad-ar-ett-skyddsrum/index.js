import { h } from 'preact';
import ContentWrapper from '../content-wrapper';

export default () => {
  return (
    <ContentWrapper>
      <h1>Vad är ett skyddsrum?</h1>
      <p>Ett skyddsrum är i korta ordalag ett utrymme som byggts för att skydda de som befinner sig i lokalen mot stridsmedel. Man skulle kunna säga att det är en slags bunker för civila, och de finns utspridda i fastigheter över hela vårt land. Bara för att en lokal är skyddad betyder det inte nödvändigtvis att den är ett skyddsrum i juridisk mening - detta regleras i lagen om skyddsrum (SFS 2006:545). Lagen definierar i princip vad den svenska staten anser vara ett skyddsrum och fastställer
        vilka kriterier som måste uppfyllas, samt en rad andra bestämmelser och ansvarsförhållanden.</p>

      <p>Skyddsrum är i huvudsak belägna i vanliga fastigheter, och i fredstid används de för annan typ av verksamhet än som skydd, t.ex. som förrådslokaler. Det är fastighetsägaren som ansvarar för underhåll av skyddsrummet. Kontroller av lokalerna kan genomföras av Myndigheten för Samhällsskydd och Beredskap (MSB).</p>

      <p>Man behöver inte bo i huset där skyddsrummet är beläget för att få ta skydd i det.</p>

      <p>Skyddsrum bör vara utrustade med rinnande vatten och toaletter, då de som söker skydd kan tvingas befinna sig där en längre tid.</p>

      <p>Särskilt folktäta orter har ett högre behov av skyddsrum, och dess kallas skyddsrumstätorter. Vilka dessa är, och vilka skyddsrum som där finns kan du <a href="https://www.msb.se/sv/Insats--beredskap/Hantera-olyckor--kriser/Skyddsrum/Skyddsrumstatorter/" target="_blank">läsa mer om hos MSB</a>.</p>

      <p>Byggnader där skyddsrum finns markeras med skylt - en blå triangel i en orange fyrkant, och texten “SKYDDSRUM”.</p>

      <h2>Vad skyddar ett skyddsrum mot?</h2>
      <p>Det finns olika typer av skyddsrum, men rent generellt skall alla skydda mot “sådana stridsmedel som kan antas komma till användning i krig” (SFS 2006:545). Det innebär att lokalerna skall kunna motstå tryckvågor och splitter från t.ex. flygbomber, kryssningsrobotar och artillerigranater. Förekomsten av massförstörelsevapen hos potentiella motståndare innebär att skyddsrummen även behöver vara skyddade mot brand, radioaktiv strålning, stridsgas och biologiska stridsmedel.</p>

      <p>Ovanstående ställer givetvis mycket höga krav på skyddsrummets konstruktion, och det behöver vara mer robust än en “vanlig” byggnad. Det innebär även att ventilationen behöver vara utformad för att skydda mot gaser, samt att dörrar klarar av stötvågen från en explosion.</p>

      <p>Trots det är ingen konstruktion oförstörbar, och en tillräckligt kraftig explosion i dess omedelbara närhet kan innebära att de som befinner sig i skyddsrummet ändå skadas eller avlider.</p>

      <h2>Räcker skyddsrummen till alla?</h2>
      <p>Nej, det gör de inte. I särskilt tätbefolkade orter finns inte skyddsrum som rymmer alla invånare. I Sverige finns det ungefär 65 000 skyddsrum, som tillsammans bereder skyddsplats till ungefär sju miljoner invånare.</p>

      <p>I Stockholms innerstad, t.ex. finns inte tillräckligt med plats i skyddsrum för alla invånare. I innerstaden har därför 18 tunnelbanestationer förberetts för att kunna användas som skydd för befolkningen. Trots detta saknar ca 10% av befolkningen i Stockholm skyddsrumsplats.</p>

      <p>Det är MSB som ansvarar för att antalet skyddsrum är tillräckligt, så att det svenska samhällets skyddsförmåga inte försämras.</p>
    </ContentWrapper>
  );
};

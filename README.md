# Questlog

## Projektbeskrivning

Detta är min egen **spelbacklog**, byggd som en **SPA** i **React** och **TypeScript**. I appen samlar jag spelen jag vill spela, spelar just nu, har klarat eller har lagt ner. Spelen kan filtreras på status, och varje spel har en egen sida med omslag, plattform, betyg och anteckningar. Man kan lägga till, ändra och ta bort spel, och all data sparas i ett externt API.

Inlämning 2 i kursen JavaScript-ramverk. Målet har varit att bygga en app med CRUD mot ett externt API, med routing, komponenter, laddning och felhantering, och att lägga all fetch-logik i egna custom hooks.

- **Handle:** `oscar-h`
- **Betyg jag siktar på:** VG

## Kör projektet lokalt

Du behöver Node.js 20.19+ eller 22.12+.

Klona repot och gå in i mappen:

```bash
git clone https://github.com/oscarholmblad/questlog.git
cd questlog
```

Installera paket:

```bash
npm install
```

Starta utvecklingsservern:

```bash
npm run dev
```

Appen körs på `http://localhost:5173`.

## Custom hooks

Jag har lagt all fetch-logik i egna hooks i `src/hooks/useGames.ts`. Ingen komponent anropar `fetch` själv, utan komponenterna får bara data, laddning och fel från en hook.

Alla anrop går igenom en hjälpfunktion, `request()`. Den lägger till bas-URL:en, kontrollerar `response.ok` och läser felmeddelandet från API:et. Då finns felhanteringen på ett enda ställe istället för i varje hook.

`useGames(status)` och `useGame(id)` bygger båda på en intern hook, `useFetch()`, så att hämtningen bara är skriven en gång. `useGames` hämtar alla spel eller bara en status, och `useGame` hämtar ett spel. `useGame` säger också till om spelet inte finns, så att sidan kan visa 404. När man byter filter avbryts det gamla anropet med en `AbortController`, eftersom ett långsamt svar annars hade kunnat skriva över det nya.

`useSaveGame()` samlar POST, PATCH och DELETE, med en gemensam laddning och ett gemensamt felmeddelande. När man ändrar ett spel jämför sidan formuläret med spelet, och bara de fält som faktiskt har ändrats skickas med PATCH.

`useLocalStorage()` fungerar som `useState` men sparar värdet i `localStorage`. Jag använder den till statusfiltret, så att det valda filtret finns kvar efter en omladdning.

Jag valde att bygga så här för att skilja logiken från det som visas. Komponenterna blir mindre och lättare att läsa, och samma hook kan användas på flera sidor. Om något i API:et ändras räcker det att ändra på ett ställe.

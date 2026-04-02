## Plan: Add Animated Robot Image to ChatbotPage

Add the existing `robot.png` (cartoon robot with jet boosters) to [ChatbotPage.jsx](src/pages/ChatbotPage.jsx) with a GSAP-powered floating/hovering animation. The robot sits beside the chatbot card on desktop and above it on mobile.

---

### Phase 1: Component Update — [ChatbotPage.jsx](src/pages/ChatbotPage.jsx)

1. **Import robot image + GSAP** — import `robot.png` from `../assets/chatbot/robot.png` (ES6 import, same pattern as [HomePage.jsx](src/pages/HomePage.jsx#L1)), import `gsap`, `useEffect`, and `useRef`.

2. **Add layout wrapper + image** — wrap the existing `<Chatbot />` in a new `soge-chatbot-layout` flex container. Add an `<img>` element with class `soge-robot` before the chatbot. Structure:
   ```
   .chatbot-page
     └── .soge-chatbot-layout  (new flex container)
           ├── img.soge-robot   (new robot image)
           └── <Chatbot />
   ```

3. **GSAP floating animation** using `gsap.context()` scoped to a container ref (matching the [Header.jsx pattern](src/components/Layout/Header.jsx)):
   - **Entrance**: `gsap.fromTo()` — fade in + slide up (`autoAlpha: 0, y: 60` → `autoAlpha: 1, y: 0`), ~1s, ease `power2.out`
   - **Continuous hover**: chained `gsap.to()` with `yoyo: true, repeat: -1` — vertical bob (`y: ±12`), ~2s, ease `sine.inOut` — simulates the jet-booster hovering
   - **Cleanup**: `ctx.revert()` in `useEffect` return (mandatory per project conventions)

### Phase 2: Styling — [index.css](src/index.css) (after `.chatbot-page` block, ~line 9708)

4. **Add CSS classes** following the `soge-*` namespace:
   - `.soge-chatbot-layout` — flex column on mobile, flex row on desktop (≥1025px), centered, gap 40px
   - `.soge-robot` — `max-width: 180px` desktop / `120px` mobile, `visibility: hidden` initially (GSAP `autoAlpha` reveals it)
   - Ensure `.soge-young-chatbot` retains its `max-width: 680px` inside the new flex layout

---

### Relevant Files
- [src/pages/ChatbotPage.jsx](src/pages/ChatbotPage.jsx) — add robot image, animation logic, layout wrapper
- [src/index.css](src/index.css) — add `.soge-chatbot-layout`, `.soge-robot` styles (~line 9708)
- [src/assets/chatbot/robot.png](src/assets/chatbot/robot.png) — image asset (already exists)
- [src/components/Layout/Header.jsx](src/components/Layout/Header.jsx) — reference for `gsap.context()` + `ctx.revert()` cleanup pattern

### Verification
1. `npm run dev` → chatbot page: robot fades in from below, then continuously bobs up/down
2. Mobile width (<720px): robot centered above the chatbot card, smaller size
3. Desktop (≥1025px): robot to the left of the chatbot card
4. Navigate away and back — no GSAP orphaned-tween warnings in console
5. `npm run lint` — no errors

### Decisions
- Use `src/assets/chatbot/robot.png` (the chatbot-specific copy)
- Animation lives in `ChatbotPage.jsx`, not `Chatbot.jsx` — keeps conversation logic clean
- Robot on the **left** on desktop, visually "introducing" the conversation
- Infinite float via GSAP `yoyo + repeat: -1` — no JS timers needed
- No changes to `Chatbot.jsx`

import { Route, Routes } from "react-router-dom";
import { PlayerBrandPage } from "./components/player-brand/page";
import { PlayerCarouselPage } from "./components/player-carousel/page";
import { PlayerFeaturePage } from "./components/player-feature/page";
import { PlayerBlurPage } from "./components/player-blur/page";
import { PlayerLayoutPage } from "./components/player-layout/page";
import { PlayerPage } from "./components/player/page";
import { PlayerShadowPage } from "./components/player-shadow/page";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PlayerPage />} />
      <Route path="/player-shadow" element={<PlayerShadowPage />} />
      <Route path="/player-blur" element={<PlayerBlurPage />} />
      <Route path="/player-layout" element={<PlayerLayoutPage />} />
      <Route path="/player-brand" element={<PlayerBrandPage />} />
      <Route path="/player-feature" element={<PlayerFeaturePage />} />
      <Route path="/player-carousel" element={<PlayerCarouselPage />} />
    </Routes>
  );
}

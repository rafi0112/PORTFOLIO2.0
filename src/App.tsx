import { useEffect, useState } from "react";
import Nav from "./components/site/Nav";
import Hero from "./components/site/Hero";
import About from "./components/site/About";
import Toolkit from "./components/site/Toolkit";
import Work from "./components/site/Work";
import Journey from "./components/site/Journey";
import Playground from "./components/site/Playground";
import Contact from "./components/site/Contact";
import AvatarGuide from "./components/site/AvatarGuide";
import { startSmoothScroll } from "./lib/motion";

export default function App() {
  const [helloOpen, setHelloOpen] = useState(false);
  const [storyId, setStoryId] = useState<string | null>(null);

  useEffect(() => startSmoothScroll(), []);

  return (
    <>
      <Nav />
      <main>
        <Hero onHello={() => setHelloOpen(true)} />
        <About />
        <Toolkit onOpenProject={setStoryId} />
        <Work openId={storyId} setOpenId={setStoryId} />
        <Journey />
        <Playground />
        <Contact />
      </main>
      <AvatarGuide open={helloOpen} setOpen={setHelloOpen} />
    </>
  );
}

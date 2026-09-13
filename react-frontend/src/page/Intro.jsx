import { LogOut } from "lucide-react";
import React from "react";
import { Typewriter } from "react-simple-typewriter";
import "../css/pages/Intro.css";
import PageHeader from "../component/PageHeader";

export default function Intro() {
  const typewriterProps = {
    words: ["German Traffic Accidents", "Accident Trends", "German Regions"],
    loop: 0,
    cursor: true,
    cursorStyle: "_",
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 1000,
  };
  return (
    <div className="intro-page">
      <div className="intro-content">
        <h2>Hello World!</h2>

        <section className="intro-project">
          <p>Welcome to...</p>
          <h1>"German Traffic Accident Explorer"</h1>
          <p>
            <b className="explore">Explore</b>{" "}
            <Typewriter {...typewriterProps} />
          </p>
        </section>

        <section className="intro-author">
          <p className="intro-author-name">
            I'm <b>Mahshid</b>,
          </p>

          <p>
            I built this platform to make German traffic accident data easier to
            <b> explore</b>, <b>understand</b>, and <b>visualize</b>.
          </p>
        </section>

        <div className="intro-cta">Click anywhere to explore</div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import thelablogo from "../../public/images/thelab.png";
import Image from "next/image";
import "../../styles/home.css";
import Heading from "@/components/Heading";

const Homepage: React.FC = () => {
  const [tab, setTab] = useState("Leagues");
  const [username_searched, setUsername_searched] = useState("");
  const [leagueId, setLeagueId] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (tab === "Picktracker") {
      setLeagueId(value);
    } else {
      setUsername_searched(value);
    }
  };

  return (
    <>
      <Heading navTab={"homepage"} week={0} />
      <div id="homepage">
        <div className="home_wrapper">
          {/* The lab logo */}
          <Image src={thelablogo} alt="logo" className="homelogo" />

          <div className="home_title">
            <strong className="home">The Lab</strong>
            <select value={tab} onChange={(e) => setTab(e.target.value)}>
              <option>Players</option>
              <option>Leagues</option>
              <option>Trades</option>
              <option>Leaguemates</option>
              <option>Matchups</option>
              <option>Picktracker</option>
            </select>
            <div>
              <div className="user_input">
                {/* Input for username search */}
                <input
                  type="text"
                  value={tab === "Picktracker" ? leagueId : username_searched}
                  placeholder={tab === "Picktracker" ? "League ID" : "Username"}
                  onChange={handleInputChange}
                />
                {/* Submit link to navigate to page */}
                <Link
                  href={`/${tab.toLowerCase()}/${username_searched.trim()}`}
                >
                  Submit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;

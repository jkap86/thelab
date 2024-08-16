"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import thelablogo from "../../public/images/thelab.png";
import Image from "next/image";
import "../../styles/home.css";

const Hompage: React.FC = () => {
  const [tab, setTab] = useState("Leagues");
  const [username_searched, setUsername_searched] = useState("");
  const [leagueId, setLeagueId] = useState("");

  return (
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
                onChange={(e) =>
                  tab === "Picktracker"
                    ? setLeagueId(e.target.value)
                    : setUsername_searched(e.target.value)
                }
              />
              {/* Submit link to navigate to page */}
              <Link href={`/${tab.toLowerCase()}/${username_searched.trim()}`}>
                Submit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hompage;

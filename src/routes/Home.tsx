/* global chrome */

import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ChromeMessage, Sender } from "../types";

export const Home = () => {
  const [responseFromContent, setResponseFromContent] = useState<string>("");

  let { push } = useHistory();

  const sendMessage = () => {
    chrome.tabs?.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id!;
      const message: ChromeMessage = {
        from: Sender.React,
        message: "Hello from React",
      };
      chrome.tabs.sendMessage(currentTabID, message, (response) =>
        setResponseFromContent(response)
      );
    });
  };

  //   useEffect(() => {
  //     sendMessage();
  //   }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={sendMessage}>SEND MESSAGE</button>
        <p>Response from content:</p>
        <p>{responseFromContent}</p>
        <button
          onClick={() => {
            push("/about");
          }}
        >
          About page
        </button>
      </header>
    </div>
  );
};

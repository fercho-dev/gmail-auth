"use client";

import React from "react";
import { Conversation } from "../components/Conversation";
import { Header } from "../components/Header";

function Chat() {
  return (
    <div>
      <Header />
      <Conversation />
    </div>
  );
}

export default Chat;

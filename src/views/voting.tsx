import React, { useState, useEffect } from "react";
import { EXTENSION_ID, FIELD_BASE, VOTING_OPTIONS, Vote  } from "../lib/common";

const Styles = () => {
  return (
    <style>
      {`
      .diviitup-btn {
        padding: 0.2rem 0.6rem;
        margin-right: 0.6rem;
        cursor: pointer;
        background-color: white;
        border: 1px solid gray;
        border-radius: 4px;
      }
      .diviitup-btn:hover {
        border: 1px solid black;
      }
      .diviitup-btn--selected {
        background-color: rgba(224, 187, 228, 0.8);
      }
      .diviitup-btn--want:hover {
        background-color: rgba(186, 255, 201, 0.8);
      }
      .diviitup-btn--neutral:hover {
        background-color: rgba(186, 225, 255, 0.8);
      }
      .diviitup-btn--pass:hover {
        background-color: rgba(255, 179, 186, 0.8);
      }
      `}
    </style>
  );
};

const VotingButton = ({ className, selected, onClick, children }) => (
  <button 
    className={ `diviitup-btn ${className || ''} ${selected ? 'diviitup-btn--selected' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
)

const VotingForm = ({ currentVote, onVote }) => {
  return (
    <>
      <VotingButton
        className="diviitup-btn--want"
        selected={currentVote?.vote == VOTING_OPTIONS.WANT}
        onClick={() => onVote(VOTING_OPTIONS.WANT)}
      >
        I Want it
      </VotingButton>
      <VotingButton
        className="diviitup-btn--neutral"
        selected={currentVote?.vote == VOTING_OPTIONS.NEUTRAL}
        onClick={() => onVote(VOTING_OPTIONS.NEUTRAL)}
      >
        I'm Neutral
      </VotingButton>
      <VotingButton
        className="diviitup-btn--pass"
        selected={currentVote?.vote == VOTING_OPTIONS.PASS}
        onClick={() => onVote(VOTING_OPTIONS.PASS)}
      >
        I'll Pass
      </VotingButton>
    </>
  )
}

const DivitItUpVoting = ({ record, existingVote }) => {
  const [vote, setVote] = useState(existingVote);

  const submitVote = async (vote) => {
    const user = aha.user;
    const key = `${FIELD_BASE}:${user.id}`;
    const payload: Vote = {
      id: String(user.id),
      name: user.name,
      avatar: user.avatarUrl,
      vote
    }

    setVote(payload);

    await record.setExtensionField(EXTENSION_ID, key, payload);
  }

  return (
    <>
      <Styles />
      <VotingForm currentVote={vote} onVote={submitVote} />
    </>
  )
}

aha.on("diviItUpVoting", ({ record, fields }, { settings }) => {
  const userKey = `${FIELD_BASE}:${aha.user.id}`;
  const existingVote: Vote = fields[userKey];

  return <DivitItUpVoting record={record} existingVote={existingVote} />
});
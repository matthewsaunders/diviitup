import React, { useState, useEffect } from "react";
import { EXTENSION_ID, VOTING_OPTIONS  } from "../lib/common";

const Styles = () => {
  return (
    <style>
      {`
        .Loader {
          text-align: center;
          margin-top: 40vh;
        }
        .Loader__spinner {
          height: 50px;
          width: 50px;
        }

        .Board {
          height: calc(100vh - 90px);
          display: flex;
          flex-direction: row;
          overflow: hidden;
          border-top: 2px solid black;
        }
        .Board__records {
          flex-basis: 28rem;
          height: 100%;
          padding: 1rem;
          overflow-y: auto;
          border-right: 2px solid black;
        }
        .Board__details {
          flex-grow: 1;
          height: 100%;
          padding: 0.4rem 1rem;
        }

        .Record {
          letter-spacing: 1px;
          padding: 1rem;
          margin: 1rem 0.6rem;
          border: 2px solid black;
          box-shadow: -4px 4px 0 0 black;
        }
        .Record:hover {
          cursor: pointer;
          background-color: #f1d624;
        }
        .Record--selected {
          background-color: #faf2be;
        }
        .Record--assigned {
        }
        .Record--assigned:hover {
          background-color: #cfcfcf;
        }
        .Record--assigned.Record--selected {
          background-color: #f0f0f0;;
        }
        .Record--assigned.Record--selected:hover {
          background-color: #cfcfcf;
        }
        .Record__title {
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.75rem;
          margin: 0.2rem 0rem;
        }
        .Record__avatar {
          border-radius: 20%;
          width: 24px;
          float: right;
        }

        .User {
          padding: 0.4rem 0.8rem;
          margin: 0.6rem 0rem;
          border: 2px solid black;
          display: flex;
          align-items: center;
        }
        .User--assigned {
          background-color: #e0dcfa;
        }
        .User__avatar {
          border-radius: 20%;
          width: 30px;
        }
        .User__name {
          flex-grow: 1;
          margin-left: 0.4rem;
        }
        .User__assign-btn {
          align-self: end;
          text-align: center;
          border: 2px solid black;
          box-shadow: -4px 4px 0 0 black;
          font-weight: 400;
          font-size: 0.75rem;
          letter-spacing: 1px;
          padding: 0.4rem;
        }
        .User__assign-btn:hover {
          cursor: pointer;
          background-color: #e0dcfa;
        }

        .UserGrid {
          display: flex;
          border: 2px solid black;
        }
        .UserGrid__col {
          flex-grow: 1;
          width: 33%;
          padding: 0rem 0.4rem;
        }
        .UserGrid__col--neutral {
          border-left: 2px solid black;
          border-right: 2px solid black;
        }
        .UserGrid__col--neutral > .UserGrid__col-title {
          color: #aac5da;
        }
        .UserGrid__col--want > .UserGrid__col-title {
          color: #48c5b5;
        }
        .UserGrid__col--pass > .UserGrid__col-title {
          color: #f57474;
        }
        .UserGrid__col-title {
          font-size: 1.4rem;
          font-weight: bold;
          text-align: center;
          
          margin: 1.4rem;
        }
      `}
    </style>
  );
};

const User = ({ user, assigned, onClick }) => {
  return (
    <div className={`User ${assigned ? 'User--assigned' : ''}`}>
      <img src={user.avatarUrl} className="User__avatar" />
      <p className="User__name">{ user.name }</p>
      <button className="User__assign-btn" onClick={onClick}>Assign</button>
    </div>
  )
}

const UsersList = ({ record, users, userVotes, forceUpdate }) => {
  const wantUserIds = userVotes.filter(vote => vote.vote === VOTING_OPTIONS.WANT).map(vote => vote.id);
  const passUserIds = userVotes.filter(vote => vote.vote === VOTING_OPTIONS.PASS).map(vote => vote.id);

  const wantUsers = users.filter(u => wantUserIds.includes(u.id));
  const passUsers = users.filter(u => passUserIds.includes(u.id));
  const neutralUsers = users.filter(u => !wantUserIds.includes(u.id) && !passUserIds.includes(u.id));

  const assignUserToRecord = (record, user) => {
    record.assignedToUser = user;
    record
      .save()
      .then(() => {
        // TODO:
        // Figure out a way to force this page to rerender component without
        // having to reload the page
        // forceUpdate();
        location.reload();
      });
  };

  return (
    <div className="UserGrid">
      <div className="UserGrid__col UserGrid__col--want">
        <h4 className="UserGrid__col-title">I want it</h4>
        { wantUsers.map(
          (user) => <User user={user} assigned={record.assignedToUser.id === user.id} onClick={() => assignUserToRecord(record, user)} />
        )}
      </div>
      <div className="UserGrid__col UserGrid__col--neutral">
        <h4 className="UserGrid__col-title">I'm Neutral</h4>
        { neutralUsers.map(
          (user) => <User user={user} assigned={record.assignedToUser.id === user.id} onClick={() => assignUserToRecord(record, user)} />
        )}
      </div>
      <div className="UserGrid__col UserGrid__col--pass">
        <h4 className="UserGrid__col-title">I'll pass</h4>
        { passUsers.map(
          (user) => <User user={user} assigned={record.assignedToUser.id === user.id} onClick={() => assignUserToRecord(record, user)} />
        )}
      </div>
    </div>
  )
}

const RecordDetails = ({ record, users, userVotes, forceUpdate }) => {
  return (
    <div className="RecordDetails">
      <h1 className="RecordDetails__title">
        { record.referenceNum + ' ' + record.name }
      </h1>
      <p>
        { record.description }
      </p>
      <UsersList record={record} users={users} userVotes={userVotes} forceUpdate={forceUpdate} />
    </div>
  )
}

const Record = ({ record, selected, assigned, onClick }) => {
  const avatar = assigned ? <img src={record.assignedToUser.avatarUrl} className="Record__avatar" /> : '';

  return (
    <div 
      className={`Record ${selected ? 'Record--selected' : ''} ${assigned ? 'Record--assigned' : ''}`} 
      onClick={onClick}
    >
      <h2>
        { record.referenceNum }
        { avatar }
      </h2>
      <a href={ record.path }>
        { record.name }
        &nbsp;
        <i class="fa-regular fa-external-link"></i>
      </a>
    </div>
  );
}

const Board = ({iteration, users, forceUpdate}) => {
  const assignedRecords = iteration.records.filter( record => record.assignedToUser.id);
  const unassignedRecords = iteration.records.filter( record => !record.assignedToUser.id);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [userVotes, setUserVotes] = useState([]);

  useEffect(() => {
    if (!selectedRecord) { return; }

    selectedRecord
      .getExtensionFields(EXTENSION_ID)
      .then((fields) => {
        setUserVotes(fields.map(field => field.value));
      });
  }, [selectedRecord]);

  return (
    <>
      <div className="Board">
        <div className="Board__records">
          <div className="Board__records--unassigned">
            <h3>Unassigned Records ({unassignedRecords.length})</h3>
            { unassignedRecords.map(record => {
                return <Record
                  key={record.id}
                  record={record}
                  selected={record == selectedRecord}
                  onClick={() => setSelectedRecord(record)}
                />
              })
            }
          </div>
          <div className="Board__records--assigned">
            <h3>Assigned Records ({assignedRecords.length})</h3>
            { assignedRecords.map(record => {
                return <Record
                  key={record.id}
                  record={record}
                  assigned={true}
                  selected={record == selectedRecord}
                  onClick={() => setSelectedRecord(record)}
                />
              })
            }
          </div>
        </div>
        <div className="Board__details">
          { selectedRecord ? 
              <RecordDetails record={selectedRecord} users={users} userVotes={userVotes} forceUpdate={forceUpdate} />
            :
              <p>Select a record to divi up.</p>
          }
        </div>
      </div>
    </>
  )
}

const Loader = () => {
  return (
    <div className="Loader">
      <p>Loading...</p>
      <aha-spinner class="Loader__spinner" />
    </div>
  );
}

const DiviItUpBoard = ({}) => {
  const [users, setUsers] = useState([]);
  const [iteration, setIteration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [update, setUpdate] = useState(0);

  useEffect(async () => {
    console.log('DiviItUpBoard.useEffect');
    const query = ` 
      {
        users(filters: {projectId: ${aha.project.id}}) {
          nodes {
            id
            avatarUrl
            name
          }
        }
        iterations(filters: {projectId: ${aha.project.id}}, order: {direction: ASC, name: startDate}, page: 1, per: 1) {
          nodes {
            id
            name
            records {
              ... on Feature {
                id
                name
                path
                description
                assignedToUser {
                  id
                  avatarUrl
                }
                referenceNum
                teamWorkflowStatus {
                  id
                  name
                }
              }
              ... on Requirement {
                id
                name
                path
                description
                assignedToUser {
                  id
                  avatarUrl
                }
                referenceNum
                teamWorkflowStatus {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `;

    aha
      .graphQuery(query)
      .then((data) => {
        if (data.users.nodes.length > 0) {
          setUsers(data.users.nodes.map(node => new aha.models.User(node)));
        }
    
        if (data.iterations.nodes.length > 0) {
          setIteration(new aha.models.Iteration(data.iterations.nodes[0]));
        }

        setIsLoading(false);
      });
  }, [update]);

  return (
    <>
      <Styles />
      {isLoading ?
        <Loader />
      :
        <Board iteration={iteration} users={users} forceUpdate={() => setUpdate(update + 1)} />
      }
    </>
  )
}

aha.on("diviItUp", ({}) => {
  return <DiviItUpBoard />
});
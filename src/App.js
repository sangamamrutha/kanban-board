import React, { useState, useEffect, useRef } from "react";
import "./Assets/App.css";
import axios from "axios";
import Card from "./Components/Card";
import dots from "./Images/3dots.svg";
import plus from "./Images/plus.svg";
import display from "./Images/display.svg";
import adown from "./Images/adown.svg";


const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(
    localStorage.getItem("groupBy") || "status"
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortBy") || "priority"
  );

  useEffect(() => {
    getData();
  }, []);

  // Function which fetchs data from API
  const getData = async () => {
    try {
      const response = await axios.get(
        "https://api.quicksell.co/v1/internal/frontend-assignment"
      );
      const data = response.data;
      setTickets(data.tickets);
      setUsers(data.users);
      console.log(data);
    } catch (error) {
      console.error("Error in fetching the data");
    }
  };

  // Function which handle clicks outside of the dropdown and the button
  const handleClickOutside = (event) => {
    if (
      !dropdownRef.current?.contains(event.target) &&
      !buttonRef.current?.contains(event.target)
    ) {
      setIsOpen(false);
      setIsButtonClicked(false);
    }
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function which toggles the dropdown
  const toggle = () => {
    setIsOpen(!isOpen);
    setIsButtonClicked(!isButtonClicked);
  };

  // Function which handle changes in grouping or sorting options
  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    if (name === "groupBy") {
      setGroupBy(value);
      localStorage.setItem("groupBy", value);
    } else if (name === "sortBy") {
      setSortBy(value);
      localStorage.setItem("sortBy", value);
    }
    setIsOpen(false);
    setIsButtonClicked(false);
  };

  // Function which group tickets based on selected criteria
  const groupTickets = () => {
    if (groupBy === "status") {
      return groupByStatus(tickets);
    } else if (groupBy === "user") {
      return groupByUser(tickets);
    } else if (groupBy === "priority") {
      return groupByPriority(tickets);
    }
  };

  // Function which sort tickets based on selected criteria
  const sortTickets = (groupedTickets) => {
    if (sortBy === "priority") {
      return sortByPriority(groupedTickets);
    } else if (sortBy === "title") {
      return sortByTitle(groupedTickets);
    }
  };

  // Function which group tickets by status
  const groupByStatus = (tickets) => {
    const statusGrouped = {};

    tickets.forEach((ticket) => {
      const allStatuses = [
        "Backlog",
        "Todo",
        "In progress",
        "Done",
        "Cancelled",
      ];
      allStatuses.forEach((status) => {
        if (!statusGrouped[status]) {
          statusGrouped[status] = [];
        }
      });
      const status = ticket.status;
      if (!statusGrouped[status]) {
        statusGrouped[status] = [];
      }
      statusGrouped[status].push(ticket);
    });

    return statusGrouped;
  };

  function findUserNameById(userId) {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : null;
  }

  // Function which group tickets by user
  const groupByUser = (tickets) => {
    const userGrouped = {};

    tickets.forEach((ticket) => {
      const userId = ticket.userId;

      const userName = findUserNameById(userId);

      if (!userGrouped[userName]) {
        userGrouped[userName] = [];
      }
      userGrouped[userName].push(ticket);
    });

    return userGrouped;
  };

  // Function which group tickets by priority
  const groupByPriority = (tickets) => {
    const priorityGrouped = {
      "No priority": [],
      Urgent: [],
      High: [],
      Medium: [],
      Low: [],
    };

    tickets.forEach((ticket) => {
      const priority = ticket.priority;

      const priorityName = {
        0: "No priority",
        4: "Urgent",
        3: "High",
        2: "Medium",
        1: "Low",
      }[priority];
      priorityGrouped[priorityName].push(ticket);
    });

    const allPriorities = ["No priority", "Urgent", "High", "Medium", "Low"];
    allPriorities.forEach((priority) => {
      if (!priorityGrouped[priority]) {
        priorityGrouped[priority] = [];
      }
    });

    return priorityGrouped;
  };

  // Function which sort grouped tickets by priority
  const sortByPriority = (grouped) => {
    const prioritySorted = {};

    for (const priority in grouped) {
      prioritySorted[priority] = grouped[priority].sort((a, b) => {
        return b.priority - a.priority;
      });
    }

    return prioritySorted;
  };

  // Function which sort grouped tickets by title
  const sortByTitle = (grouped) => {
    const titleSorted = {};

    for (const priority in grouped) {
      titleSorted[priority] = grouped[priority].sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    }

    return titleSorted;
  };

  return (
    console.log(tickets),
    console.log(users),
    (
      <div className="container">
        <div className="display">
          <button onClick={toggle} ref={buttonRef} className="display-btn">
            <div className="display-img">
              <img src={display} alt="" style={{ width: "58%" }} />
            </div>
            <div style={{paddingTop: "2%"  }}>Display</div>
            <div className="display-img">
              <img src={adown} alt="" style={{ width: "60%" }} />
            </div>
          </button>
          {isOpen && isButtonClicked ? (
            <div className="dropdown" ref={dropdownRef}>
              <label>
                <div style={{ display: "flex", marginTop: "3px" }}>
                  <div style={{ width: "85%", paddingTop: "2%" }}>
                    Grouping:
                  </div>
                  <select
                    name="groupBy"
                    value={groupBy}
                    onChange={handleOptionChange}
                    className="select"
                  >
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </label>
              <label>
                <div style={{ display: "flex", marginTop: "3px" }}>
                  <div style={{ width: "85%", paddingTop: "2%" }}>Ordering</div>
                  <select
                    name="sortBy"
                    value={sortBy}
                    onChange={handleOptionChange}
                    className="select"
                  >
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </label>
            </div>
          ) : null}
        </div>
        <div>
          <div className="body">
            <div className="tickets">
              {Object.entries(sortTickets(groupTickets())).map(
                ([group, items]) => {
                  const length = items.length;
                  return (
                    <div className="section" key={group}>
                      <div className="section-head">
                        <div className="section-title">
                        <img style={{ display: "flex", width: "10%" }} src={group} alt="" />
                          <span style={{ width: "#24262D", paddingRight: "10px" }} > 
                            {group}
                          </span>
                          <span style={{ color: "#82858C" }}>{length}</span>
                        </div>
                        <div style={{ display: "flex", width: "25%" }}>
                          <button className="section-btn">
                            <img src={plus} alt="" />
                          </button>
                          <button className="section-btn">
                            <img src={dots} alt="" />
                          </button>
                        </div>
                      </div>
                      {items.map((ticket, i) => (
                        <Card
                          key={i}
                          id={ticket.id}
                          tag={ticket.tag}
                          title={ticket.title}
                          group={group}
                          length={length}
                          status={ticket.status}
                          priority={ticket.priority}
                        />
                      ))}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default App;

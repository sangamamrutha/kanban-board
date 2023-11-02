import React from "react";
import "../../Assets/Card.css";
import backlog from "../../Images/backlog.svg";
import todo from "../../Images/todo.svg";
import inprogress from "../../Images/inprogress.svg";
import cancelled from "../../Images/cancelled.svg";
import done from "../../Images/done.svg";
import dp from "../../Images/dp.png";
import exmark from "../../Images/exmark.svg";

function Card(props) {
  let statusImageSrc;

  if (props.status === "Todo") {
    statusImageSrc = todo;
  } else if (props.status === "In progress") {
    statusImageSrc = inprogress;
  } else if (props.status === "Done") {
    statusImageSrc = done;
  } else if (props.status === "Cancelled") {
    statusImageSrc = cancelled;
  } else {
    statusImageSrc = backlog;
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-id">{props.id}</div>
        <div style={{ width: "20%" }}>
          <img src={dp} alt="" className="dp" /> 
        </div>
      </div>
      <div className="card-body">
        <div >
          <img src={statusImageSrc} alt={props.status} className="card-status" />
        </div>
        <div className="title">{props.title}</div>
      </div>
      <div className="card-footer">
        <div className="pic" >
          <img src={exmark} alt="" />
        </div>
        <div className="fetrq">
          <span style={{ color: "#BEC2C8" }}>{"\u2B24"}</span> {props.tag}
        </div>
      </div>
    </div>
  );
}

export default Card;

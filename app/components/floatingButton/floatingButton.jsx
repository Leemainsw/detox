"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function floatingButton() {
  return (
    <button className="btn btn-rounded btn-primary" type="button">
      <FontAwesomeIcon icon={faPlus} />
      {/* <FontAwesomeIcon icon={faArrowUp} /> */}
    </button>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

function Comments() {
  const [comment, setComment] = useState("");
  const [commentsArray, setCommentsArray] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await axios.get("http://localhost:8000/comments");

        setCommentsArray(response.data.comments);
      } catch (error) {
        console.error("Błąd podczas pobierania komentarzy:", error);
      }
    }
    fetchComments();
  }, [commentsArray]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (comment.trim() !== "") {
      try {
        await axios.post("http://localhost:8000/comments", {
          text: comment,
        });

        setComment("");
      } catch (error) {
        console.error("Błąd podczas dodawania komentarza:", error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8000/comments/${commentId}`);
    } catch (error) {
      console.error("Błąd podczas usuwania komentarza:", error);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      await axios.put(`http://localhost:8000/comments/${commentId}`, {
        text: newText,
      });
    } catch (error) {
      console.error("Błąd podczas edycji komentarza:", error);
    }
  };
  return (
    <div>
      <div>
        <input
          type="text"
          value={comment}
          onChange={handleInputChange}
          placeholder="Dodaj komentarz"
        />
        <button onClick={handleAddComment}>Dodaj</button>
      </div>
      <div>
        <ul>
          {commentsArray.map((elem) => (
            <div key={elem._id}>
              <span>{elem.comment}</span>

              <button
                onClick={() =>
                  handleEditComment(
                    elem._id,
                    prompt("Wprowadź nowy tekst komentarza:")
                  )
                }
              >
                Edytuj
              </button>
              <button onClick={() => handleDeleteComment(elem._id)}>
                Usuń
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Comments;

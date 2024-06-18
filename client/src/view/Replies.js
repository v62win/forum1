import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Replies = () => {
    const [replyList, setReplyList] = useState([]);
    const [reply, setReply] = useState("");
    const [thread, setThread] = useState("");
    const { threadId } = useParams();
    

    const addReply = () => {
        fetch("http://localhost:4000/api/create/reply", {
            method: "POST",
            body: JSON.stringify({
                threadId,
                userId: localStorage.getItem("_id"),
                reply,
                name: localStorage.getItem("_name"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                // Refresh replies after adding a new reply
                fetchReplies();
            })
            .catch((err) => console.error(err));
    };

    const fetchReplies = () => {
        fetch("http://localhost:4000/api/thread/replies", {
            method: "POST",
            body: JSON.stringify({
                threadId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setReplyList(data.replies);
                setThread(data.thread); // Set the thread title
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchReplies();
    }, [threadId]);

    const handleSubmitReply = (e) => {
        e.preventDefault();
        if (!reply.trim()) {
            // Prevent submission if reply is empty or contains only whitespace
            return;
        }
        addReply();
        setReply("");
    };

    return (
        <main className="replies">
             <h2>Reply to: {thread}</h2>
            <form className="modal__content" onSubmit={handleSubmitReply}>
                <label htmlFor="reply">Reply to this thread</label>
                <textarea
                    rows={5}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    type="text"
                    name="reply"
                    className="modalInput"
                />
                <button className="modalBtn">SEND</button>
            </form>
            <div className="thread__container">
                {replyList.map((reply) => (
                    <div className="thread__item" key={reply.replyId}>
                        <p>{reply.reply}</p>
                        <div className="react__container">
                            <p style={{ opacity: "0.5" }}>by {reply.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Replies;

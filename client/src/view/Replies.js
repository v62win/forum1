import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

const fetchReplies = (threadId, setReplyList, setThread) => {
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
            setThread(data.thread);
        })
        .catch((err) => console.error(err));
};

const Replies = () => {
    const [replyList, setReplyList] = useState([]);
    const [reply, setReply] = useState("");
    const [thread, setThread] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { threadId } = useParams();

    const handleFileChange = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    const addReply = () => {
        const formData = new FormData();
        formData.append("threadId", threadId);
        formData.append("userId", localStorage.getItem("_id"));
        formData.append("reply", reply);
        formData.append("name", localStorage.getItem("_name"));

        selectedFiles.forEach((file) => {
            formData.append("media", file);
        });

        fetch("http://localhost:4000/api/create/reply", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                fetchReplies(threadId, setReplyList, setThread);
                setSelectedFiles([]);
            })
            .catch((err) => console.error(err));
    };

    const handleSubmitReply = (e) => {
        e.preventDefault();
        if (!reply.trim() && !selectedFiles.length) {
            return;
        }
        addReply();
        setReply("");
    };

    useEffect(() => {
        fetchReplies(threadId, setReplyList, setThread);
    }, [threadId]);

    const renderMedia = (replyText) => {
        const urls = replyText.match(/https?:\/\/[^\s]+/g) || [];
        return urls.map((url, index) => {
            if (ReactPlayer.canPlay(url)) {
                return (
                    <div className="player-wrapper" key={index}>
                        <ReactPlayer url={url} controls className="react-player" width="100%" />
                    </div>
                );
            } else if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
                return (
                    <img
                        key={index}
                        src={url}
                        alt="Reply media"
                        style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                        onError={(e) => {
                            e.target.src = "path/to/fallback/image.png";
                            console.error("Failed to load image:", e.target.src);
                        }}
                    />
                );
            }
            return null;
        });
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

                <label htmlFor="media">Attach Images/Videos</label>
                <input
                    type="file"
                    name="media"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                />

                <button className="modalBtn">SEND</button>
            </form>
            <div className="thread__container">
                {replyList.map((reply) => (
                    <div className="thread__item" key={reply.replyId}>
                        <p>{reply.reply}</p>
                        <div className="media__container">{renderMedia(reply.reply)}</div>
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

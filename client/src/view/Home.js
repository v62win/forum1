import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import Likes from "../utils/likes";
import Comments from "../utils/comments";

const Home = () => {
    const [thread, setThread] = useState("");
    const [threadList, setThreadList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            if (!localStorage.getItem("_id")) {
                navigate("/");
            } else {
                console.log("Authenticated");
                await fetchThreads();
            }
        };
        checkUser();
    }, [navigate]);

    const fetchThreads = async () => {
        await fetch("http://localhost:4000/api/all/threads")
            .then((res) => res.json())
            .then((data) => {
                setThreadList(data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const createThread = async () => {
        await fetch("http://localhost:4000/api/create/thread", {
            method: "POST",
            body: JSON.stringify({
                thread,
                userId: localStorage.getItem("_id"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                fetchThreads();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ thread });
        setThread("");
        await createThread();
    };

    const updateLikes = (threadId, userId) => {
        setThreadList((prevList) =>
            prevList.map((thread) =>
                thread.threadId === threadId
                    ? {
                          ...thread,
                          likes: thread.likes.includes(userId)
                              ? thread.likes.filter((id) => id !== userId)
                              : [...thread.likes, userId],
                      }
                    : thread
            )
        );
    };

    return (
        <>
            <Nav />
            <main className="home">
                <h2 className="homeTitle">Create a Thread</h2>
                <form className="homeForm" onSubmit={handleSubmit}>
                    <div className="home__container">
                        <label htmlFor="thread">Title / Description</label>
                        <input
                            type="text"
                            name="thread"
                            required
                            value={thread}
                            onChange={(e) => setThread(e.target.value)}
                        />
                    </div>
                    <button className="homeBtn">CREATE</button>
                </form>
                <div className="thread__container">
                    {threadList?.map((thread) => (
                        <div className="thread__item" key={thread.threadId}>
                            <p>{thread.thread}</p>
                            <div className="react__container">
                                <Likes
                                    numberOfLikes={thread.likes?.length || 0}
                                    threadId={thread.threadId}
                                    updateLikes={updateLikes}
                                />
                                <Comments
                                    numberOfComments={thread.replies?.length || 0}
                                    threadId={thread.threadId}
                                    title={thread.title}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Home;

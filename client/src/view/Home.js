import React, {useEffect , useState} from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import Likes from "../utils/likes";
import Comments from "../utils/comments";


const Home = () => {
    const [thread, setThread] = useState("");
    const [threadList, setThreadList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = () => {
            if(!localStorage.getItem("_id")){
                navigate("/");
            }else{
                console.log("Authenticated");
                fetchThreads();
            }
        };
        checkUser();
    }, [navigate]);

    const fetchThreads = async() => {
       await fetch("http://localhost:4000/api/all/threads")
            .then((res) => res.json())
            .then((data) => {
                setThreadList(data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const createThread = async() => {
      await fetch("http://localhost:4000/api/create/thread" , {
            method: "Post",
            body: JSON.stringify({
                thread,
                userId : localStorage.getItem("_id"),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
             .then((res) => res.json())
             .then((data) => {
                alert(data.message);
             })
             .catch((err) => {
                 console.log(err);
             });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ thread });
        setThread("");
        createThread();
    };

    return(
        <>
        <Nav />
        <main className="home">
            <h2 className="homeTitle">Create a Thread</h2>
            <form className="homeform" onSubmit={handleSubmit}>
                <div className="home__container">
                    <label htmlFor="thread">Title / Discription</label>
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
                            <div className='react__container'>
                                <Likes
                                    numberOfLikes={thread.likes?.length || 0}
                                    threadId={thread.id}
                                />
                                <Comments
                                    numberOfComments={thread.replies?.length || 0}
                                    threadId={thread.id}
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
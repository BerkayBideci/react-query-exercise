/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";

export default function App() {
    const [postId, setPostId] = useState(-1);

    return (
        <div>
            {postId > -1 ? (
                <Post
                    postId={postId}
                    setPostId={setPostId}
                />
            ) : (
                <Posts setPostId={setPostId} />
            )}
        </div>
    );
}

function usePosts() {
    return useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const { data } = await axios.get(
                "https://jsonplaceholder.typicode.com/posts"
            );
            return data;
        },
    });
}

function Posts({ setPostId }) {
    const queryClient = useQueryClient();
    const { status, data, error, isFetching } = usePosts();

    return (
        <div>
            <h1>Posts</h1>
            <div>
                {status === "loading" ? (
                    "Loading..."
                ) : status === "error" ? (
                    <span>Error: {error.message}</span>
                ) : (
                    <>
                        <div>
                            {data.map((post) => (
                                <p key={post.id}>
                                    <a
                                        onClick={() => setPostId(post.id)}
                                        href="#"
                                        style={
                                            queryClient.getQueryData([
                                                "post",
                                                post.id,
                                            ])
                                                ? {
                                                      fontWeight: "bold",
                                                      color: "green",
                                                  }
                                                : {}
                                        }
                                    >
                                        {post.title}
                                    </a>
                                </p>
                            ))}
                        </div>
                        <div>{isFetching ? "Background Updating..." : " "}</div>
                    </>
                )}
            </div>
        </div>
    );
}

const getPostById = async (id) => {
    const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return data;
};

function usePost(postId) {
    return useQuery({
        queryKey: ["post", postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
    });
}

function Post({ postId, setPostId }) {
    const { status, data, error, isFetching } = usePost(postId);

    return (
        <div>
            <div>
                <a
                    onClick={() => setPostId(-1)}
                    href="#"
                >
                    Back
                </a>
            </div>
            {!postId || status === "loading" ? (
                "Loading..."
            ) : status === "error" ? (
                <span>Error: {error.message}</span>
            ) : (
                <>
                    <h1>{data.title}</h1>
                    <div>
                        <p>{data.body}</p>
                    </div>
                    <div>{isFetching ? "Background Updating..." : " "}</div>
                </>
            )}
        </div>
    );
}

import React, { useEffect, useState } from "react";
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    DialogContentText,
    Divider,
    IconButton,
    TextField,
    InputAdornment,
    OutlinedInput,
    FormGroup,
    FormControlLabel,
    FormControl,
    Checkbox,
    DialogTitle,
    CircularProgress,
} from "@mui/material";
import { Send, ThumbUp, ThumbDown, Refresh, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { auth, db } from "../../firebase";
import {
    addDoc,
    collection,
    getDoc,
    doc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { dummyData } from "../../dummyData";
import { handleSearch } from "./functions";

import { userConverter } from "../../styles/User";

import {
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { query } from "./functions";

var t = 1000;

function Chat({ setSearchTerm, loggedin }) {
    const [userInputs, setUserInputs] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [responses, setResponses] = useState([]);
    const [currentInput, setCurrentInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [kwRefs, setKwRefs] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [endSession, setEndSession] = useState(false);
    const [num, setNum] = useState(-1);
    const [totalQuota, setTotalQuota] = useState(0);

    function errorHandler(err) {
        setAlert("Error verifying user. Returning you to the sign in page");
        console.error(err);
        window
            .open(
                "https://" + process.env.REACT_APP_LOGIN_REDIRECT_URL,
                "_blank"
            )
            .focus();
    }

    function rejectDelay(reason) {
        // console.log(reason);
        return new Promise(function (resolve, reject) {
            setTimeout(reject.bind(null, reason), t);
        });
    }
    const [alert, setAlert] = useState("");

    useEffect(() => {
        const USER_DATA_PROMISE = async () => {
            setAlert("Authenticating user info...");
            // console.log(auth.currentUser);
            if (!auth.currentUser) {
                console.log("User not signed in");
                throw new FirebaseError();
            } else if (!auth.currentUser.emailVerified) {
                console.log("User email not verified");
                throw new FirebaseError();
            } else {
                const docRef = doc(
                    db,
                    "users",
                    auth.currentUser.uid
                ).withConverter(userConverter);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // console.debug("Document data:", docSnap.data());

                    // console.log(Number(docSnap.data().prompts_allowed) - Number(docSnap.data().prompts_used))
                    return Number(docSnap.data().prompts_left);
                } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                    return 0;
                }
            }
        };
        var max = 5;
        var p = Promise.reject();
        for (var i = 0; i < max; i++) {
            p = p.catch(USER_DATA_PROMISE).catch(rejectDelay);
        }
        p = p.then(setNum).then(handleAlertClose).catch(errorHandler);
        // We don't have to worry about rejection, because you've set it
        // up not to reject
    }, []);
    const [feedbackState, setFeedbackState] = useState({
        index: null,
        dialogOpen: false,
        isSatisfactory: null,
        message: null,
    });
    const [feedbackSelect, setFeedbackSelect] = useState({
        "Superficial Response": false,
        "Lacks Reasoning": false,
        "Lacks Relevant Facts": false,
        "Lacks Citation": false,
    });

    const findRefs = (texts, keyword) => {
        var allRefs = [];
        for (const text of texts) {
            var indexes = [];
            var excerpts = [];
            const textLower = text.text.toLowerCase();
            var pos = textLower.indexOf(keyword);
            const kwLen = keyword.length;
            const prev = 300;
            const after = 500;
            while (pos !== -1) {
                indexes.push(pos);
                const start = pos - prev > -1 ? pos - prev : 0;
                const end =
                    pos + after < text.text.length
                        ? pos + after
                        : text.text.length;
                excerpts.push(text.text.substring(start, end));
                pos = text.text.indexOf(keyword, pos + 1);
            }
            indexes.length > 0 &&
                allRefs.push({
                    name: text.name,
                    kwLen: kwLen,
                    excerpts: excerpts,
                });
        }
        return allRefs;
    };

    const handleSubmit = async () => {
        const docRef = doc(db, "users", auth.currentUser.uid).withConverter(
            userConverter
        );
        setLoading(true);
        setKwRefs(null);
        //console.log(findRefs(dummyData, keyword.toLowerCase()));

        keyword &&
            setKwRefs({
                keyword: keyword,
                refs: findRefs(dummyData, keyword.toLowerCase()),
            });

        setUserInputs([...userInputs, currentInput]);
        const newConversation = [
            ...conversation,
            {
                role: "user",
                content:
                    currentInput +
                    " You answer should be no longer than 500 words.",
            },
        ];
        setConversation(newConversation);
        setCurrentInput("");
        setKeyword("");
        setNum(num - 1);
        await updateDoc(docRef, { prompts_left: num - 1 });
        //console.log(newConversation);
        if (num > 0) {
            await query({
                model: "gpt-3.5-turbo",
                messages: newConversation,
            }).then(async (res) => {
                const resContent = res.choices[0].message.content;
                if (num === 10) {
                    await query({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "user",
                                content:
                                    resContent +
                                    "Summarize the given text in 2 words. Output these words in lower case, no punctuation. ",
                            },
                        ],
                    }).then(async (res) => {
                        await handleSearch(
                            res.choices[0].message.content,
                            setSearchTerm
                        );
                    });
                }
                setResponses([
                    ...responses,
                    {
                        response: resContent,
                        is_satisfactory: "N/A",
                        feedback: "N/A",
                    },
                ]);
                setConversation([...newConversation, res.choices[0].message]);
            });
        }
        // const url = new URL(window.location);
        // //url.searchParams.set("q", "law");
        // //window.history.pushState(null, "", url.toString());
        // var searchInput = document.getElementById("downshift-1-input");

        // searchInput.focus();

        // setTimeout(console.log(""), 1000);
        // // searchInput = document.getElementsByClassName(
        // //     "sui-search-box__text-input focus"
        // // );
        // searchInput = document.getElementById("downshift-1-input");
        // document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
        // searchInput.value = "law";
        // searchInput.setAttribute("value", "law");
        // console.log(searchInput);
        // searchInput.dispatchEvent(new Event("change"));
        // const searchBtn = document.getElementsByClassName(
        //     "sui-search-box__submit"
        // )[0];
        // //searchBtn.click();

        setLoading(false);
    };

    const submitFeedback = () => {
        setResponses(
            responses.map((res, idx) =>
                idx !== feedbackState.index
                    ? res
                    : {
                          ...res,
                          feedback: {
                              message: feedbackState.message
                                  ? feedbackState.message
                                  : "",
                              reasons: feedbackSelect,
                          },
                      }
            )
        );
        setFeedbackState({
            index: null,
            dialogOpen: false,
            isSatisfactory: true,
            message: null,
        });
    };
    const extractUserInput = (convo) => {
        const userInput = [];
        for (let i = 0; i < convo.length; i++) {
            if (convo[i]["role"] === "user") {
                userInput.push(convo[i]["content"]);
            }
        }
        return userInput;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            //console.log(userInputs, responses);
            const docRef = await addDoc(collection(db, "conversations"), {
                userInputs: userInputs,
                responses: responses,
            });
            const userDocRef = await updateDoc(
                doc(db, "users", auth.currentUser.uid),
                { conversations: arrayUnion(docRef.id) }
            );
            // setAlert(
            //     `Conversation (ID: ${docRef.id}) successfully saved in Firebase.`
            // );
            window.location.reload();
        } catch (e) {
            setAlert(`Error saving conversation: ${e}`);
        }
        setSaving(false);
    };

    const handleAlertClose = () => {
        setAlert("");
    };
    const handleFeedbackClose = () => {
        setFeedbackState({ ...feedbackState, dialogOpen: false });
    };

    // useEffect(() => {
    //     window.addEventListener("beforeunload", handleSave);
    // }, []);
    return (
        <div
            style={{
                paddingBlock: 32,
                paddingInline: 60,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    right: 50,
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <LoadingButton
                    onClick={handleSave}
                    variant="contained"
                    endIcon={<Save></Save>}
                    style={{ marginRight: 10 }}
                >
                    Save Conversation
                </LoadingButton>
                <LoadingButton
                    variant="contained"
                    loading={saving}
                    onClick={handleSave}
                    endIcon={<Refresh></Refresh>}
                >
                    Start Over
                </LoadingButton>
            </div>
            <div
                style={{
                    maxHeight: 800,
                    overflow: "scroll",
                    width: "100%",
                    paddingBlockStart: 20,
                }}
            >
                {userInputs &&
                    userInputs.map((input, i) => (
                        <div>
                            {i !== 0 && <Divider></Divider>}
                            <div
                                style={{
                                    marginBlock: 40,
                                    overflowWrap: "break-word",
                                }}
                            >
                                <strong
                                    style={{
                                        marginRight: 10,
                                    }}
                                >
                                    You:
                                </strong>
                                {input}
                            </div>

                            {i < responses.length && (
                                <>
                                    <Divider></Divider>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBlock: 32,
                                            overflowWrap: "break-word",
                                        }}
                                    >
                                        <div>
                                            <strong
                                                style={{
                                                    marginRight: 10,
                                                }}
                                            >
                                                Bot:
                                            </strong>
                                            {responses[i].response}
                                        </div>

                                        {responses[i].is_satisfactory ===
                                        "N/A" ? (
                                            <ButtonGroup>
                                                <IconButton
                                                    onClick={() => {
                                                        setResponses(
                                                            responses.map(
                                                                (res, idx) =>
                                                                    idx !== i
                                                                        ? res
                                                                        : {
                                                                              ...res,
                                                                              is_satisfactory: true,
                                                                          }
                                                            )
                                                        );
                                                        setFeedbackState({
                                                            index: i,
                                                            dialogOpen: true,
                                                            isSatisfactory: true,
                                                        });
                                                        setKwRefs(null);
                                                    }}
                                                >
                                                    <ThumbUp></ThumbUp>
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => {
                                                        setResponses(
                                                            responses.map(
                                                                (res, idx) =>
                                                                    idx !== i
                                                                        ? res
                                                                        : {
                                                                              ...res,
                                                                              is_satisfactory: false,
                                                                          }
                                                            )
                                                        );
                                                        setFeedbackState({
                                                            index: i,
                                                            dialogOpen: true,
                                                            isSatisfactory: false,
                                                        });
                                                    }}
                                                >
                                                    <ThumbDown></ThumbDown>
                                                </IconButton>
                                            </ButtonGroup>
                                        ) : (
                                            <IconButton disabled>
                                                {responses[i]
                                                    .is_satisfactory ? (
                                                    <ThumbUp></ThumbUp>
                                                ) : (
                                                    <ThumbDown></ThumbDown>
                                                )}
                                            </IconButton>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                {/* <div
                    style={{
                        maxHeight: 400,
                        overflow: "scroll",
                        color: "gray",
                    }}
                >
                    {kwRefs &&
                        (kwRefs.refs.length !== 0 ? (
                            <div>
                                <p>{`Found ${kwRefs.refs
                                    .map((ref) => ref.excerpts.length)
                                    .reduce((a, b) => a + b)} matches`}</p>
                                {kwRefs.refs.map((ref) =>
                                    ref.excerpts.map((excerpt) => (
                                        <div style={{}}>
                                            <i>{ref.name}</i>
                                            <p>
                                                {'"...' +
                                                    excerpt.substring(0, 300)}
                                                <strong
                                                    style={{ color: "black" }}
                                                >
                                                    {excerpt.substring(
                                                        300,
                                                        300 + ref.kwLen
                                                    )}
                                                </strong>
                                                {excerpt.substring(
                                                    300 + ref.kwLen
                                                ) + '..."'}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <i>No references found</i>
                        ))}
                </div> */}
                {loading && <CircularProgress></CircularProgress>}
            </div>

            <div
                style={{
                    position: "fixed",
                    bottom: "50px",
                    width: "60%",
                    alignSelf: "center",
                }}
            >
                {!endSession && num >= 0 ? (
                    <>
                        {/* <TextField
                            label="Keyword"
                            variant="standard"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                        /> */}
                        <div style={{ height: 20 }}></div>
                        <OutlinedInput
                            fullWidth
                            required
                            placeholder="Prompt"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                            endAdornment={
                                <InputAdornment>
                                    <LoadingButton
                                        onClick={handleSubmit}
                                        loading={loading}
                                    >
                                        <Send></Send>
                                    </LoadingButton>
                                </InputAdornment>
                            }
                        ></OutlinedInput>{" "}
                        <p
                            style={{
                                fontStyle: "italic",
                                fontSize: 14,
                                color: "gray",
                            }}
                        >
                            {num === 0
                                ? "No more prompts allowed. Please enter your final feedback."
                                : `Prompts left: ${num}`}
                        </p>
                    </>
                ) : (
                    <></>
                )}
            </div>
            <Dialog open={alert} onClose={handleAlertClose}>
                <DialogContent>
                    <DialogContentText>{alert}</DialogContentText>
                </DialogContent>
            </Dialog>

            <Dialog
                open={feedbackState.dialogOpen}
                onClose={handleFeedbackClose}
                fullWidth
            >
                <DialogContent
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <h3>Provide additional feedback</h3>
                    <TextField
                        fullWidth
                        label={
                            feedbackState.isSatisfactory
                                ? "What do you like about the response?"
                                : "What was the issue with the response? How could it be improved?"
                        }
                        variant="outlined"
                        multiline
                        value={feedbackState.message}
                        onChange={(e) =>
                            setFeedbackState({
                                ...feedbackState,
                                message: e.target.value,
                            })
                        }
                    />
                    {!feedbackState.isSatisfactory && (
                        <FormControl component="fieldset" variant="standard">
                            <FormGroup>
                                {Object.keys(feedbackSelect).map((key) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={feedbackSelect[key]}
                                                onChange={(e) =>
                                                    setFeedbackSelect({
                                                        ...feedbackSelect,
                                                        [e.target.name]:
                                                            e.target.checked,
                                                    })
                                                }
                                                name={key}
                                            ></Checkbox>
                                        }
                                        label={key}
                                    ></FormControlLabel>
                                ))}
                            </FormGroup>
                        </FormControl>
                    )}
                    <br></br>
                    <Button variant="contained" onClick={submitFeedback}>
                        Submit feedback
                    </Button>
                    <br></br>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Chat;
